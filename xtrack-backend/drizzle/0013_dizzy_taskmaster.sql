ALTER TABLE `leave_history` MODIFY COLUMN `applied_leaves` decimal(4,1) NOT NULL;--> statement-breakpoint
ALTER TABLE `leave_history` MODIFY COLUMN `paid_leaves` decimal(4,1) NOT NULL;--> statement-breakpoint
ALTER TABLE `leave_history` MODIFY COLUMN `unpaid_leaves` decimal(4,1) NOT NULL;