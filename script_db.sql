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