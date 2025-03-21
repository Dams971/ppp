Schema
pour
furagora
Tables_in_furagora
audit_logs
events
locations
member_contacts
member_profiles
members
membership_payments
membership_plans
memberships
status_references
ticket_payments
ticket_types
tickets
Table	Create Table
audit_logs	CREATE TABLE `audit_logs` (\n  `id` bigint(20) NOT NULL AUTO_INCREMENT,\n  `entity_type` varchar(50) NOT NULL,\n  `entity_id` uuid NOT NULL,\n  `action` enum('create','update','delete','status_change','anonymize') NOT NULL,\n  `field_name` varchar(50) DEFAULT NULL,\n  `old_value` text DEFAULT NULL,\n  `new_value` text DEFAULT NULL,\n  `user_id` uuid DEFAULT NULL,\n  `timestamp` timestamp NULL DEFAULT current_timestamp(),\n  `ip_address` varchar(45) DEFAULT NULL,\n  PRIMARY KEY (`id`)\n) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_uca1400_ai_ci
Table	Create Table
events	CREATE TABLE `events` (\n  `id` uuid NOT NULL DEFAULT uuid_v7(),\n  `name` varchar(100) NOT NULL,\n  `description` text DEFAULT NULL,\n  `location_id` uuid NOT NULL,\n  `start_datetime` timestamp NOT NULL,\n  `end_datetime` timestamp NOT NULL,\n  `max_capacity` int(11) DEFAULT NULL,\n  `is_members_only` tinyint(1) DEFAULT 0,\n  `status` enum('draft','published','cancelled','completed') DEFAULT 'draft',\n  `created_at` timestamp NULL DEFAULT current_timestamp(),\n  PRIMARY KEY (`id`),\n  KEY `location_id` (`location_id`),\n  CONSTRAINT `events_ibfk_1` FOREIGN KEY (`location_id`) REFERENCES `locations` (`id`)\n) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_uca1400_ai_ci
Table	Create Table
locations	CREATE TABLE `locations` (\n  `id` uuid NOT NULL DEFAULT uuid_v7(),\n  `name` varchar(100) NOT NULL,\n  `address` varchar(255) NOT NULL,\n  `city` varchar(100) NOT NULL,\n  `postal_code` varchar(10) DEFAULT NULL,\n  `country_id` char(2) DEFAULT NULL,\n  `capacity` int(11) DEFAULT NULL,\n  `facilities` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL CHECK (json_valid(`facilities`)),\n  `created_at` timestamp NULL DEFAULT current_timestamp(),\n  PRIMARY KEY (`id`)\n) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_uca1400_ai_ci
Table	Create Table
member_contacts	CREATE TABLE `member_contacts` (\n  `member_id` uuid NOT NULL,\n  `phone` varchar(20) DEFAULT NULL,\n  `address` varchar(255) DEFAULT NULL,\n  `postal_code` varchar(10) DEFAULT NULL,\n  `city` varchar(100) DEFAULT NULL,\n  `country_id` char(2) DEFAULT NULL,\n  PRIMARY KEY (`member_id`),\n  CONSTRAINT `member_contacts_ibfk_1` FOREIGN KEY (`member_id`) REFERENCES `members` (`id`) ON DELETE CASCADE\n) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_uca1400_ai_ci
Table	Create Table
member_profiles	CREATE TABLE `member_profiles` (\n  `member_id` uuid NOT NULL,\n  `first_name` varchar(50) DEFAULT NULL,\n  `last_name` varchar(50) DEFAULT NULL,\n  `birthdate` date DEFAULT NULL,\n  `species` varchar(100) DEFAULT NULL,\n  `tags` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL CHECK (json_valid(`tags`)),\n  `free_comment` text DEFAULT NULL,\n  PRIMARY KEY (`member_id`),\n  CONSTRAINT `member_profiles_ibfk_1` FOREIGN KEY (`member_id`) REFERENCES `members` (`id`) ON DELETE CASCADE\n) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_uca1400_ai_ci
Table	Create Table
members	CREATE TABLE `members` (\n  `id` uuid NOT NULL DEFAULT uuid_v7(),\n  `member_type` enum('regular','vip','partner') NOT NULL DEFAULT 'regular',\n  `status` tinyint(4) NOT NULL DEFAULT 1,\n  `username` varchar(100) NOT NULL,\n  `email` varchar(150) NOT NULL,\n  `created_at` timestamp NULL DEFAULT current_timestamp(),\n  `updated_at` timestamp NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),\n  PRIMARY KEY (`id`),\n  UNIQUE KEY `username` (`username`),\n  UNIQUE KEY `email` (`email`)\n) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_uca1400_ai_ci
Table	Create Table
membership_payments	CREATE TABLE `membership_payments` (\n  `id` uuid NOT NULL DEFAULT uuid_v7(),\n  `membership_id` uuid NOT NULL,\n  `amount` decimal(10,2) NOT NULL,\n  `payment_date` timestamp NOT NULL DEFAULT current_timestamp(),\n  `payment_method` varchar(50) NOT NULL,\n  `transaction_ref` varchar(100) DEFAULT NULL,\n  `status` enum('completed','pending','failed','refunded') DEFAULT 'completed',\n  PRIMARY KEY (`id`),\n  KEY `membership_id` (`membership_id`),\n  CONSTRAINT `membership_payments_ibfk_1` FOREIGN KEY (`membership_id`) REFERENCES `memberships` (`id`) ON DELETE CASCADE\n) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_uca1400_ai_ci
Table	Create Table
membership_plans	CREATE TABLE `membership_plans` (\n  `id` uuid NOT NULL DEFAULT uuid_v7(),\n  `name` varchar(100) NOT NULL,\n  `description` text DEFAULT NULL,\n  `period` enum('monthly','annual') NOT NULL,\n  `price` decimal(10,2) NOT NULL,\n  `benefits` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL CHECK (json_valid(`benefits`)),\n  `is_active` tinyint(1) DEFAULT 1,\n  PRIMARY KEY (`id`)\n) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_uca1400_ai_ci
Table	Create Table
memberships	CREATE TABLE `memberships` (\n  `id` uuid NOT NULL DEFAULT uuid_v7(),\n  `member_id` uuid NOT NULL,\n  `plan_id` uuid NOT NULL,\n  `start_date` date NOT NULL,\n  `end_date` date NOT NULL,\n  `status` enum('active','expired','cancelled') DEFAULT 'active',\n  `discount_applied` decimal(5,2) DEFAULT 0.00,\n  `auto_renew` tinyint(1) DEFAULT 0,\n  PRIMARY KEY (`id`),\n  KEY `member_id` (`member_id`),\n  KEY `plan_id` (`plan_id`),\n  CONSTRAINT `memberships_ibfk_1` FOREIGN KEY (`member_id`) REFERENCES `members` (`id`) ON DELETE CASCADE,\n  CONSTRAINT `memberships_ibfk_2` FOREIGN KEY (`plan_id`) REFERENCES `membership_plans` (`id`)\n) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_uca1400_ai_ci
Table	Create Table
status_references	CREATE TABLE `status_references` (\n  `id` smallint(6) NOT NULL,\n  `entity_type` varchar(50) NOT NULL,\n  `status_code` varchar(20) NOT NULL,\n  `label` varchar(50) NOT NULL,\n  `description` text DEFAULT NULL,\n  PRIMARY KEY (`id`),\n  UNIQUE KEY `entity_type` (`entity_type`,`status_code`)\n) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_uca1400_ai_ci
Table	Create Table
ticket_payments	CREATE TABLE `ticket_payments` (\n  `id` uuid NOT NULL DEFAULT uuid_v7(),\n  `ticket_id` uuid NOT NULL,\n  `amount` decimal(10,2) NOT NULL,\n  `payment_date` timestamp NOT NULL DEFAULT current_timestamp(),\n  `payment_method` varchar(50) NOT NULL,\n  `transaction_ref` varchar(100) DEFAULT NULL,\n  `status` enum('completed','pending','failed','refunded') DEFAULT 'completed',\n  PRIMARY KEY (`id`),\n  KEY `ticket_id` (`ticket_id`),\n  CONSTRAINT `ticket_payments_ibfk_1` FOREIGN KEY (`ticket_id`) REFERENCES `tickets` (`id`) ON DELETE CASCADE\n) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_uca1400_ai_ci
Table	Create Table
ticket_types	CREATE TABLE `ticket_types` (\n  `id` uuid NOT NULL DEFAULT uuid_v7(),\n  `event_id` uuid NOT NULL,\n  `name` varchar(100) NOT NULL,\n  `description` text DEFAULT NULL,\n  `price` decimal(10,2) NOT NULL,\n  `max_quantity` int(11) DEFAULT NULL,\n  `benefits` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL CHECK (json_valid(`benefits`)),\n  `available_from` timestamp NULL DEFAULT NULL,\n  `available_until` timestamp NULL DEFAULT NULL,\n  PRIMARY KEY (`id`),\n  KEY `event_id` (`event_id`),\n  CONSTRAINT `ticket_types_ibfk_1` FOREIGN KEY (`event_id`) REFERENCES `events` (`id`) ON DELETE CASCADE\n) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_uca1400_ai_ci
Table	Create Table
tickets	CREATE TABLE `tickets` (\n  `id` uuid NOT NULL DEFAULT uuid_v7(),\n  `ticket_type_id` uuid NOT NULL,\n  `member_id` uuid DEFAULT NULL,\n  `code` varchar(255) NOT NULL,\n  `badge_number` varchar(20) DEFAULT NULL,\n  `purchase_date` timestamp NOT NULL DEFAULT current_timestamp(),\n  `status` enum('reserved','paid','validated','cancelled','refunded') DEFAULT 'reserved',\n  `validation_date` timestamp NULL DEFAULT NULL,\n  `specifications` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL CHECK (json_valid(`specifications`)),\n  PRIMARY KEY (`id`),\n  UNIQUE KEY `code` (`code`),\n  KEY `ticket_type_id` (`ticket_type_id`),\n  KEY `member_id` (`member_id`),\n  CONSTRAINT `tickets_ibfk_1` FOREIGN KEY (`ticket_type_id`) REFERENCES `ticket_types` (`id`),\n  CONSTRAINT `tickets_ibfk_2` FOREIGN KEY (`member_id`) REFERENCES `members` (`id`) ON DELETE SET NULL\n) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_uca1400_ai_ci
