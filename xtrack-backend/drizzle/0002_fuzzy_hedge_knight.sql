ALTER TABLE `leave_history` ADD `month` varchar(7) NOT NULL;--> statement-breakpoint
ALTER TABLE `leave_history` ADD `created_at` datetime DEFAULT NOW() NOT NULL;--> statement-breakpoint
ALTER TABLE `leave_history` DROP COLUMN `date`;