
DROP TABLE IF EXISTS roles CASCADE;
create table roles(
	id BIGSERIAL PRIMARY KEY,
	name VARCHAR(100) NOT NULL UNIQUE,
	image VARCHAR(255) NULL,
	route varchar(255) NULL,
	created_at timestamp(0) NOT NULL, 
	updated_at timestamp(0) NOT NULL
);


INSERT INTO roles(name,route,created_at,updated_at) values('CLIENTE','client/products/list', '2021-08-03','2021-08-03');
INSERT INTO roles(name,route,created_at,updated_at) values('RESTAURANTE','restaurant/orders/list', '2021-08-03','2021-08-03');
INSERT INTO roles(name,route,created_at,updated_at) values('REPARTIDOR','delivery/orders/list', '2021-08-03','2021-08-03');


DROP TABLE IF EXISTS users CASCADE;
create table users(
	id BIGSERIAL PRIMARY KEY,
	email varchar(255) NOT NULL UNIQUE, 
	name varchar(255) NOT NULL,
	lastname varchar(255) NOT NULL,
	phone varchar(80) NOT NULL UNIQUE,
	image varchar(255) NULL,
	notification_token varchar(255) null,
	password varchar(255) NOT NULL, 
	is_available BOOLEAN null , 
	session_token varchar(255) null, 
	created_at timestamp(0) NOT NULL, 
	updated_at timestamp(0) NOT NULL
);



DROP TABLE IF EXISTS user_has_roles CASCADE;
create table user_has_roles(
	id_user BIGSERIAL NOT NULL, 
	id_rol BIGSERIAL NOT NULL,	
	created_at timestamp(0) NOT NULL, 
	updated_at timestamp(0) NOT NULL,
	FOREIGN KEY(id_user) REFERENCES users(id) ON UPDATE CASCADE ON DELETE CASCADE,
	FOREIGN KEY(id_rol) REFERENCES roles(id) ON UPDATE CASCADE ON DELETE CASCADE, 
	PRIMARY KEY (id_user,id_rol)
);




DROP TABLE IF EXISTS categories CASCADE;
CREATE TABLE categories(
	id BIGSERIAL PRIMARY KEY,
	name VARCHAR(100) NULL UNIQUE,
	description VARCHAR(255) NOT NULL , 
	created_at timestamp(0) NOT NULL,
	updated_at timestamp(0) NOT NULL
);


DROP TABLE IF EXISTS products CASCADE;
CREATE TABLE products(
	id BIGSERIAL PRIMARY KEY,
	name VARCHAR(180) NOT NULL, 
	description VARCHAR(255) NOT NULL,
	price DECIMAL DEFAULT 0, 
	image1 VARCHAR(255) NULL,
	image2 VARCHAR(255) NULL,
	image3 VARCHAR(255) NULL,
	id_category BIGINT NOT NULL , 
	created_at timestamp(0) NOT NULL,
	updated_at timestamp(0) NOT NULL,
	FOREIGN KEY (id_category) REFERENCES categories(id) ON UPDATE CASCADE ON DELETE CASCADE
);



DROP TABLE IF EXISTS address CASCADE;
CREATE TABLE address(
	id BIGSERIAL PRIMARY KEY,
	id_user BIGINT NOT NULL , 
	address VARCHAR(255) NOT NULL,
	neighborhood VARCHAR(255) NOT NULL,
	lat DECIMAL DEFAULT 0, 
	lng DECIMAL DEFAULT 0,
	created_at timestamp(0) NOT NULL,
	updated_at timestamp(0) NOT NULL,
	FOREIGN KEY (id_user) REFERENCES users(id) ON UPDATE CASCADE ON DELETE CASCADE
);


DROP TABLE IF EXISTS orders CASCADE;
CREATE TABLE orders(
	id BIGSERIAL PRIMARY KEY,
	id_client BIGINT NOT NULL , 
	id_delivery BIGINT NOT NULL , 
	id_address BIGINT NOT NULL , 
	lat DECIMAL DEFAULT 0, 
	lng DECIMAL DEFAULT 0, 
	status varchar(90) NOT NULL,
	timestamp BIGINT NOT NULL, 
	created_at timestamp(0) NOT NULL,
	updated_at timestamp(0) NOT NULL,
		FOREIGN KEY (id_client) REFERENCES users(id) ON UPDATE CASCADE ON DELETE CASCADE , 
		FOREIGN KEY (id_delivery) REFERENCES users(id) ON UPDATE CASCADE ON DELETE CASCADE , 
		FOREIGN KEY (id_address) REFERENCES address(id) ON UPDATE CASCADE ON DELETE CASCADE 
);

DROP TABLE IF EXISTS order_has_products CASCADE;
CREATE TABLE order_has_products (
	id_order BIGINT NOT NULL,
	id_product BIGINT NOT NULL , 
	quantity BIGINT NOT NULL , 
	created_at timestamp(0) NOT NULL,
	updated_at timestamp(0) NOT NULL,
	PRIMARY KEY (id_order , id_product ) , 
	FOREIGN KEY (id_order) REFERENCES orders(id) ON UPDATE CASCADE ON DELETE CASCADE , 
	FOREIGN KEY (id_product) REFERENCES products(id) ON UPDATE CASCADE ON DELETE CASCADE 
);