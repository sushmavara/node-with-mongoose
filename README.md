# node-js

# This gives overview of using node js with SQL DB

# have SQL Community Server and workbench installed

# Before running the project we need to make sure db and tables are created else project will fail

# in sql workbench create these tables in database shop

CREATE SCHEMA `shop`;

CREATE TABLE `shop`.`products` (
`id` INT UNSIGNED NOT NULL AUTO_INCREMENT,
`title` VARCHAR(45) NOT NULL,
`imageUrl` VARCHAR(255) NOT NULL,
`price` DOUBLE NOT NULL,
`description` TEXT NOT NULL,
PRIMARY KEY (`id`),
UNIQUE INDEX `id_UNIQUE` (`id` ASC) VISIBLE);

CREATE TABLE `shop`.`cart` (
`id` VARCHAR(25) NOT NULL,
PRIMARY KEY (`id`));

CREATE TABLE `shop`.`cart_items` (
`id` INT UNSIGNED NOT NULL,
`qty` INT NOT NULL DEFAULT 0,
`cart_id` INT UNSIGNED NOT NULL,
`product_id` INT UNSIGNED NOT NULL,
PRIMARY KEY (`id`),
UNIQUE INDEX `id_UNIQUE` (`id` ASC) VISIBLE,
INDEX `product_id_idx` (`product_id` ASC) VISIBLE,
INDEX `cart_id_idx` (`cart_id` ASC) VISIBLE,
CONSTRAINT `cart_id`
FOREIGN KEY (`cart_id`)
REFERENCES `shop`.`cart` (`id`)
ON DELETE CASCADE
ON UPDATE NO ACTION,
CONSTRAINT `product_id`
FOREIGN KEY (`product_id`)
REFERENCES `shop`.`products` (`id`)
ON DELETE CASCADE
ON UPDATE NO ACTION);

# do npm install and run npm start to start the server open localhost: http://localhost:3000/
