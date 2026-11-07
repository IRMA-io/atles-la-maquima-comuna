CREATE TABLE `analytics_events` (
  `event_id` text PRIMARY KEY NOT NULL,
  `created_at` integer NOT NULL,
  `day_local` text NOT NULL,
  `hour_local` integer NOT NULL,
  `kind` text NOT NULL,
  `resource_id` text,
  `is_owner` integer NOT NULL,
  `session_key` text NOT NULL
);
--> statement-breakpoint
CREATE INDEX `analytics_created_idx` ON `analytics_events` (`created_at`);
--> statement-breakpoint
CREATE INDEX `analytics_session_idx` ON `analytics_events` (`session_key`, `created_at`);
