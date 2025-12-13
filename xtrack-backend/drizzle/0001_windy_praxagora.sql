CREATE TABLE `leave_history` (
	`id` int AUTO_INCREMENT NOT NULL,
	`user_id` int NOT NULL,
	`applied_leaves` int NOT NULL,
	`paid_leaves` int NOT NULL,
	`unpaid_leaves` int NOT NULL,
	`date` datetime NOT NULL DEFAULT NOW(),
	CONSTRAINT `leave_history_id` PRIMARY KEY(`id`)
);
