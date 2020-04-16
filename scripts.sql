-- ==========================================================================
-- ==========================================================================
-- ==========================================================================
-- ==========================================================================
-- ==========================================================================


create database Shop;
use Shop;
drop table users;

create table users (
cedula nvarchar(30) primary key not null,
nombres nvarchar(80) not null,
apellidos nvarchar(80) not null,
foto longblob ,
email nvarchar(80) not null,
usuario nvarchar(80) not null,
clave nvarchar(80) not null
);



create table Productos_generales (
id int (11) auto_increment primary key,
nombre_producto nvarchar(50) not null,
caracteristica nvarchar(1000) not null,
serie_mostrar nvarchar(100) not null,
constraint serie_fk foreign key(serie_mostrar) references Agregar_productos(serie)
);


drop table if exists Agregar_productos;
create table Agregar_productos(
id int (11) auto_increment primary key,
serie nvarchar(100) not null ,
imagen nvarchar(30) not null,
stock int not null default 0,
id_propietario nvarchar(30),
fullname nvarchar(200),
alias nvarchar(50) not null,
nombre_producto nvarchar(50) not null,
caracteristica nvarchar(1000) not null,
constraint id_fk_propietario foreign key(id_propietario) references users(cedula)
);