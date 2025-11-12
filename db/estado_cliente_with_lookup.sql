-- Create lookup table for client states and a per-user estado_cliente table
-- Idempotent: safe to run multiple times

-- 1) Create lookup table with provided states
CREATE TABLE IF NOT EXISTS public.estado_cliente_tipo (
  id smallint PRIMARY KEY,
  nombre text NOT NULL,
  descripcion text
);

-- 2) Insert/Update the known states (0..4)
INSERT INTO public.estado_cliente_tipo (id, nombre, descripcion)
VALUES
  (0, 'Inactivo', 'Usuario desactivado'),
  (1, 'Activo', 'Usuario activo (uso administrativo/general)'),
  (2, 'Posible', 'Usuario que creó cuenta (nuevo)'),
  (3, 'Potencial', 'Usuario que realizó al menos una compra'),
  (4, 'Fidelizado', 'Usuario con 4 o más compras')
ON CONFLICT (id) DO UPDATE SET nombre = EXCLUDED.nombre, descripcion = EXCLUDED.descripcion;

-- 3) Create per-user estado_cliente table (if missing)
CREATE TABLE IF NOT EXISTS public.estado_cliente (
  id SERIAL PRIMARY KEY,
  id_usuario integer NOT NULL UNIQUE,
  tipo smallint NOT NULL DEFAULT 2,
  updated_at timestamptz NOT NULL DEFAULT now()
);

-- 4) Add FK constraints (best-effort; will try to add if possible)
DO $$
BEGIN
  -- FK to usuario
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint c JOIN pg_namespace n ON n.oid = c.connamespace
    WHERE c.conname = 'fk_estado_cliente_usuario'
  ) THEN
    BEGIN
      ALTER TABLE public.estado_cliente
        ADD CONSTRAINT fk_estado_cliente_usuario FOREIGN KEY (id_usuario) REFERENCES public.usuario(id_usuario) ON DELETE CASCADE;
    EXCEPTION WHEN OTHERS THEN
      RAISE NOTICE 'Could not add FK fk_estado_cliente_usuario: %', SQLERRM;
    END;
  END IF;

  -- FK to estado_cliente_tipo
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint c JOIN pg_namespace n ON n.oid = c.connamespace
    WHERE c.conname = 'fk_estado_cliente_tipo'
  ) THEN
    BEGIN
      ALTER TABLE public.estado_cliente
        ADD CONSTRAINT fk_estado_cliente_tipo FOREIGN KEY (tipo) REFERENCES public.estado_cliente_tipo(id) ON DELETE RESTRICT;
    EXCEPTION WHEN OTHERS THEN
      RAISE NOTICE 'Could not add FK fk_estado_cliente_tipo: %', SQLERRM;
    END;
  END IF;
END
$$;

-- 5) Populate estado_cliente from usuario without modifying usuario
-- Map boolean usuario.estado -> tipo: true -> 2 (Posible), false -> 0 (Inactivo)
INSERT INTO public.estado_cliente (id_usuario, tipo, updated_at)
SELECT u.id_usuario,
       CASE WHEN pg_typeof(u.estado) = 'boolean'::regtype THEN (CASE WHEN u.estado THEN 2 ELSE 0 END) ELSE u.estado END,
       now()
FROM public.usuario u
WHERE NOT EXISTS (SELECT 1 FROM public.estado_cliente ec WHERE ec.id_usuario = u.id_usuario);

-- 6) Synchronize mismatches (keep tipo in sync with usuario.estado logical value)
UPDATE public.estado_cliente ec
SET tipo = src.usuario_tipo, updated_at = now()
FROM (
  SELECT u.id_usuario,
         CASE WHEN pg_typeof(u.estado) = 'boolean'::regtype THEN (CASE WHEN u.estado THEN 2 ELSE 0 END) ELSE u.estado END AS usuario_tipo
  FROM public.usuario u
) AS src
WHERE ec.id_usuario = src.id_usuario
  AND ec.tipo IS DISTINCT FROM src.usuario_tipo;

-- 7) Optional: show counts (uncomment if running interactively)
-- SELECT 'estado_cliente_tipo' AS tabla, count(*) FROM public.estado_cliente_tipo;
-- SELECT 'usuario' AS tabla, count(*) FROM public.usuario
-- UNION ALL
-- SELECT 'estado_cliente' AS tabla, count(*) FROM public.estado_cliente;
