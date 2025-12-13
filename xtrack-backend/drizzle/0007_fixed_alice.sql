ALTER TABLE `leave_requests` ADD `day_type` varchar(10) DEFAULT 'full';--> statement-breakpoint
ALTER TABLE `leave_requests` ADD `start_time` varchar(5);--> statement-breakpoint
ALTER TABLE `leave_requests` ADD `end_time` varchar(5);