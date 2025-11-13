-- Tabla: Categoria
CREATE TABLE categoria (
    id_categoria SERIAL PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    descripcion TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabla: Producto
CREATE TABLE producto (
    id_producto SERIAL PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    descripcion TEXT NOT NULL,
    precio_unitario NUMERIC(10,2) NOT NULL,
    stock_minimo INTEGER NOT NULL,
    estado BOOLEAN NOT NULL,
    url_imagen TEXT NOT NULL,
    id_categoria INTEGER NOT NULL REFERENCES categoria(id_categoria),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabla: Inventario
CREATE TABLE inventario (
    id_inventario SERIAL PRIMARY KEY,
    cantidad INTEGER NOT NULL,
    estado BOOLEAN NOT NULL,
    id_producto INTEGER NOT NULL REFERENCES producto(id_producto),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabla: Proveedor
CREATE TABLE proveedor (
    id_proveedor SERIAL PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    telefono VARCHAR(20) NOT NULL,
    nit VARCHAR(20) NOT NULL,
    estado BOOLEAN NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabla: Lote
CREATE TABLE lote (
    id_lote SERIAL PRIMARY KEY,
    fecha_vencimiento DATE NOT NULL,
    cantidad INTEGER NOT NULL,
    estado BOOLEAN NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabla: AsignaLotes
CREATE TABLE asigna_lotes (
    id_asignacion SERIAL PRIMARY KEY,
    id_inventario INTEGER NOT NULL REFERENCES inventario(id_inventario),
    id_lote INTEGER NOT NULL REFERENCES lote(id_lote),
    estado BOOLEAN NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabla: Factura
CREATE TABLE factura (
    id_factura SERIAL PRIMARY KEY,
    tipo TEXT NOT NULL,
    fecha DATE NOT NULL,
    subtotal NUMERIC(12,2) NOT NULL,
    total NUMERIC(12,2) NOT NULL,
    descuento NUMERIC(12,2),
    estado BOOLEAN NOT NULL,
    id_proveedor INTEGER NULL REFERENCES proveedor(id_proveedor),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabla: Detalle Factura
CREATE TABLE detalle_factura (
    id_detalle SERIAL PRIMARY KEY,
    cantidad INTEGER NOT NULL,
    precio_unitario NUMERIC(12,2) NOT NULL,
    id_factura INTEGER NOT NULL REFERENCES factura(id_factura),
    id_inventario INTEGER NOT NULL REFERENCES inventario(id_inventario),
    id_lote INTEGER NOT NULL REFERENCES lote(id_lote),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabla: Rol
CREATE TABLE rol (
    id_rol SERIAL PRIMARY KEY,
    nombre VARCHAR(50) NOT NULL,
    descripcion TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabla: Usuario
CREATE TABLE usuario (
    id_usuario SERIAL PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    contrasena_hash TEXT NOT NULL,
    telefono VARCHAR(20) NOT NULL,
    direccion TEXT NULL,
    correo VARCHAR(100) NOT NULL,
    estado BOOLEAN NOT NULL,
    fecha_creacion TIMESTAMP NOT NULL,
    id_rol INTEGER NOT NULL REFERENCES rol(id_rol),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabla: Usuarios
CREATE TABLE usuarios (
    id SERIAL PRIMARY KEY,
    id_usuario INTEGER NOT NULL REFERENCES usuario(id_usuario),
    id_factura INTEGER NOT NULL REFERENCES factura(id_factura),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabla: Pedido
CREATE TABLE pedido (
    id_pedido SERIAL PRIMARY KEY,
    fecha_pedido DATE NOT NULL,
    direccion_envio TEXT NOT NULL,
    costo_envio NUMERIC(10,2) NOT NULL,
    subtotal NUMERIC(10,2) NOT NULL,
    total NUMERIC(10,2) NOT NULL,
    estado BOOLEAN NOT NULL,
    id_usuario INTEGER NOT NULL REFERENCES usuario(id_usuario),
    id_factura INTEGER NOT NULL REFERENCES factura(id_factura),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabla: Departamento
CREATE TABLE departamento (
    id_departamento SERIAL PRIMARY KEY,
    departamento TEXT NOT NULL,
    estado BOOLEAN NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabla: Direccion
CREATE TABLE direccion (
    id_direccion SERIAL PRIMARY KEY,
    calle VARCHAR(50) NOT NULL,
    colonia VARCHAR(50) NOT NULL,
    ciudad VARCHAR(50) NOT NULL,
    estado BOOLEAN NOT NULL,
    id_usuario INTEGER NOT NULL REFERENCES usuario(id_usuario),
    id_departamento INTEGER NOT NULL REFERENCES departamento(id_departamento),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabla: Logs
CREATE TABLE logs (
    id_log SERIAL PRIMARY KEY,
    accion TEXT NOT NULL,
    id_usuario INTEGER NOT NULL REFERENCES usuario(id_usuario)
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabla: Oferta
CREATE TABLE oferta (
    id_oferta SERIAL PRIMARY KEY,
    descripcion TEXT,
    descuento_porcentaje NUMERIC(5,2),
    fecha_inicio DATE NOT NULL,
    fecha_fin DATE NOT NULL,
    id_producto INTEGER NOT NULL REFERENCES producto(id_producto),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
-- ------------------------------------------------------------------
-- Tablas para estado de cliente (lookup + per-usuario)
-- No modifican la tabla `usuario`; enlazan con ella por FK
-- ------------------------------------------------------------------

-- Tabla lookup con los tipos/estados de cliente
CREATE TABLE IF NOT EXISTS public.estado_cliente_tipo (
        id smallint PRIMARY KEY,
        nombre text NOT NULL,
        descripcion text
);

-- Insertar/actualizar los estados conocidos
INSERT INTO public.estado_cliente_tipo (id, nombre, descripcion)
VALUES
    (0, 'Inactivo', 'Usuario desactivado'),
    (1, 'Activo', 'Usuario activo (uso administrativo/general)'),
    (2, 'Posible', 'Usuario que creó cuenta (nuevo)'),
    (3, 'Potencial', 'Usuario que realizó al menos una compra'),
    (4, 'Fidelizado', 'Usuario con 4 o más compras')
ON CONFLICT (id) DO UPDATE SET nombre = EXCLUDED.nombre, descripcion = EXCLUDED.descripcion;

-- Tabla por-usuario que referencia al lookup
CREATE TABLE IF NOT EXISTS public.estado_cliente (
    id SERIAL PRIMARY KEY,
    id_usuario integer NOT NULL UNIQUE,
    tipo smallint NOT NULL DEFAULT 2,
    updated_at timestamptz NOT NULL DEFAULT now()
);

-- Intentar crear constraints FK (mejor esfuerzo: si fallan por permisos se ignorarán)
DO $$
BEGIN
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

-- Poblar estado_cliente a partir de usuario sin modificar la tabla usuario
INSERT INTO public.estado_cliente (id_usuario, tipo, updated_at)
SELECT u.id_usuario,
             CASE WHEN pg_typeof(u.estado) = 'boolean'::regtype THEN (CASE WHEN u.estado THEN 2 ELSE 0 END) ELSE u.estado END,
             now()
FROM public.usuario u
WHERE NOT EXISTS (SELECT 1 FROM public.estado_cliente ec WHERE ec.id_usuario = u.id_usuario);

-- Sincronizar diferencias (mantener la tabla por-usuario alineada)
UPDATE public.estado_cliente ec
SET tipo = src.usuario_tipo, updated_at = now()
FROM (
    SELECT u.id_usuario,
                 CASE WHEN pg_typeof(u.estado) = 'boolean'::regtype THEN (CASE WHEN u.estado THEN 2 ELSE 0 END) ELSE u.estado END AS usuario_tipo
    FROM public.usuario u
) AS src
WHERE ec.id_usuario = src.id_usuario
    AND ec.tipo IS DISTINCT FROM src.usuario_tipo;

