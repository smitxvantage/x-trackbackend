CREATE TABLE `salary` (
	`id` int AUTO_INCREMENT NOT NULL,
	`name` varchar(100) NOT NULL,
	`salary` int NOT NULL,
	`created_at` datetime NOT NULL DEFAULT NOW(),
	CONSTRAINT `salary_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
DROP TABLE `employees`;