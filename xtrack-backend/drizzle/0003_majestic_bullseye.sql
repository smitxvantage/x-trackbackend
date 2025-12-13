CREATE TABLE `employees` (
	`id` int AUTO_INCREMENT NOT NULL,
	`name` varchar(100) NOT NULL,
	`salary` int NOT NULL,
	`created_at` datetime NOT NULL DEFAULT NOW(),
	CONSTRAINT `employees_id` PRIMARY KEY(`id`)
);
