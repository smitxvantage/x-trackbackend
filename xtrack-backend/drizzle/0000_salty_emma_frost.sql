CREATE TABLE `users` (
	`id` int AUTO_INCREMENT NOT NULL,
	`name` varchar(255) NOT NULL,
	`email` varchar(255) NOT NULL,
	`username` varchar(255) NOT NULL,
	`password` text NOT NULL,
	`role` varchar(50) NOT NULL DEFAULT 'employee',
	`department` varchar(100),
	`manager_id` int,
	`joining_date` date,
	`profile_pic_url` text,
	`is_active` boolean NOT NULL DEFAULT true,
	`created_at` datetime NOT NULL DEFAULT NOW(),
	`updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
	`earned_leave` int NOT NULL DEFAULT 0,
	`last_leave_increment` datetime NOT NULL DEFAULT NOW(),
	CONSTRAINT `users_id` PRIMARY KEY(`id`),
	CONSTRAINT `users_email_unique` UNIQUE(`email`),
	CONSTRAINT `users_username_unique` UNIQUE(`username`)
);
--> statement-breakpoint
CREATE TABLE `attendance` (
	`id` int AUTO_INCREMENT NOT NULL,
	`user_id` int,
	`date` date,
	`check_in` varchar(10),
	`check_out` varchar(10),
	`total_hours` varchar(10),
	`status` varchar(20),
	CONSTRAINT `attendance_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `time_entries` (
	`id` int AUTO_INCREMENT NOT NULL,
	`attendance_id` int NOT NULL,
	`start_time` datetime NOT NULL,
	`end_time` datetime DEFAULT null,
	CONSTRAINT `time_entries_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `daily_reports` (
	`id` int AUTO_INCREMENT NOT NULL,
	`user_id` int NOT NULL,
	`date` date NOT NULL,
	`hours_worked` int,
	`attachments` text,
	`status` varchar(50) NOT NULL DEFAULT 'draft',
	`is_edited` boolean NOT NULL DEFAULT false,
	`submitted_at` datetime DEFAULT null,
	`approved_at` datetime DEFAULT null,
	`approved_by` int,
	`created_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
	`updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
	`tasks` text,
	`hoursSpent` int DEFAULT 0,
	`reportType` varchar(255),
	CONSTRAINT `daily_reports_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `leave_requests` (
	`id` int AUTO_INCREMENT NOT NULL,
	`user_id` int NOT NULL,
	`leave_type` varchar(50) NOT NULL,
	`start_date` date NOT NULL,
	`end_date` date NOT NULL,
	`total_days` int NOT NULL,
	`reason` text NOT NULL,
	`status` varchar(50) NOT NULL DEFAULT 'pending',
	`approved_by` int,
	`approved_at` datetime DEFAULT null,
	`rejection_reason` text,
	`created_at` datetime NOT NULL DEFAULT NOW(),
	`updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `leave_requests_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `leave_balances` (
	`id` int AUTO_INCREMENT NOT NULL,
	`user_id` int NOT NULL,
	`leave_type` varchar(50) NOT NULL,
	`total_allocated` int NOT NULL,
	`used` int NOT NULL DEFAULT 0,
	`year` int NOT NULL,
	CONSTRAINT `leave_balances_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `holidays` (
	`id` int AUTO_INCREMENT NOT NULL,
	`name` varchar(255) NOT NULL,
	`date` date NOT NULL,
	`is_optional` boolean NOT NULL DEFAULT false,
	CONSTRAINT `holidays_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `notifications` (
	`id` int AUTO_INCREMENT NOT NULL,
	`user_id` int NOT NULL,
	`title` text NOT NULL,
	`message` text NOT NULL,
	`type` varchar(50) NOT NULL,
	`is_read` boolean NOT NULL DEFAULT false,
	`action_url` text,
	`created_at` datetime NOT NULL DEFAULT NOW(),
	CONSTRAINT `notifications_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
ALTER TABLE `time_entries` ADD CONSTRAINT `time_entries_attendance_id_attendance_id_fk` FOREIGN KEY (`attendance_id`) REFERENCES `attendance`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `daily_reports` ADD CONSTRAINT `daily_reports_user_id_users_id_fk` FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `leave_requests` ADD CONSTRAINT `leave_requests_user_id_users_id_fk` FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `leave_balances` ADD CONSTRAINT `leave_balances_user_id_users_id_fk` FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `notifications` ADD CONSTRAINT `notifications_user_id_users_id_fk` FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE no action ON UPDATE no action;