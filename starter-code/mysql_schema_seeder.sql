CREATE TABLE `invoices` (
  `id` varchar(6) NOT NULL,
  `created_at` date DEFAULT NULL,
  `payment_due` date DEFAULT NULL,
  `description` text,
  `payment_terms` int DEFAULT NULL,
  `client_name` varchar(100) DEFAULT NULL,
  `client_email` varchar(100) DEFAULT NULL,
  `status` enum('draft','pending','paid','deleted') NOT NULL DEFAULT 'draft',
  `sender_address_id` int unsigned DEFAULT NULL,
  `client_address_id` int unsigned DEFAULT NULL,
  `total` decimal(10,2) DEFAULT NULL,
  `deleted_at` datetime DEFAULT NULL,
  `updated_at` datetime DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `sender_address_id` (`sender_address_id`),
  KEY `client_address_id` (`client_address_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3;

CREATE TABLE `invoice_items` (
  `id` int NOT NULL AUTO_INCREMENT,
  `invoice_id` varchar(6) NOT NULL,
  `name` varchar(255) DEFAULT NULL,
  `quantity` int unsigned DEFAULT NULL,
  `price` decimal(10,2) unsigned DEFAULT NULL,
  `total` decimal(10,2) unsigned DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `invoice_id` (`invoice_id`),
  CONSTRAINT `invoice_items_ibfk_1` FOREIGN KEY (`invoice_id`) REFERENCES `invoices` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=28 DEFAULT CHARSET=utf8mb3;

CREATE TABLE `addresses` (
  `id` int NOT NULL AUTO_INCREMENT,
  `street` varchar(255) NOT NULL,
  `city` varchar(100) NOT NULL,
  `post_code` varchar(20) NOT NULL,
  `country` varchar(100) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=15 DEFAULT CHARSET=utf8mb3;

CREATE TABLE `audit_logs` (
  `id` int NOT NULL AUTO_INCREMENT,
  `invoice_id` varchar(6) NOT NULL,
  `message` text NOT NULL,
  `action_type` enum('created_draft','created_pending','updated','mark_as_paid','deleted') NOT NULL,
  `ip_address` varchar(45) DEFAULT NULL,
  `user_agent` text,
  `action_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `invoice_id` (`invoice_id`),
  CONSTRAINT `audit_logs_ibfk_1` FOREIGN KEY (`invoice_id`) REFERENCES `invoices` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=33 DEFAULT CHARSET=utf8mb3;

INSERT INTO addresses (id, street, city, post_code, country) VALUES
(1, '19 Union Terrace', 'London', 'E1 3EZ', 'United Kingdom'),        -- sender
(2, '106 Kendell Street', 'Sharrington', 'NR24 5WQ', 'United Kingdom'), -- client
(3, '84 The Avenue', 'Manchester', 'M1 1AA', 'United Kingdom'),
(4, '21B Baker Street', 'London', 'NW1 6XE', 'United Kingdom'),
(5, '200 Castle Blvd', 'Nottingham', 'NG7 1FB', 'United Kingdom'),
(6, '34 High Street', 'Oxford', 'OX1 4AQ', 'United Kingdom'),
(7, '88 Kingsway', 'Liverpool', 'L1 1AA', 'United Kingdom'),
(8, '500 West Avenue', 'Leeds', 'LS1 1UR', 'United Kingdom'),
(9, '40 Downing Road', 'Cambridge', 'CB2 1TN', 'United Kingdom'),
(10, '12 Station Road', 'York', 'YO1 6GA', 'United Kingdom');


INSERT INTO invoices (
  id, created_at, payment_due, description, payment_terms,
  client_name, client_email, status, sender_address_id, client_address_id, total
) VALUES
('RT3080', '2021-08-18', '2021-08-19', 'Re-branding', 1, 'Jensen Huang', 'jensenh@mail.com', 'paid', 1, 2, 1800.90),
('XM9141', '2021-08-20', '2021-08-30', 'UX Review', 10, 'Alex Mercer', 'alex.mercer@mail.com', 'pending', 3, 4, 1200.00),
('RG0314', '2021-09-01', '2021-09-06', 'Logo Design', 5, 'Sarah Smith', 'sarah.smith@mail.com', 'draft', 5, 6, 800.00),
('AA1449', '2021-09-10', '2021-09-13', 'Website Hosting', 3, 'Daniel Craig', 'daniel.craig@mail.com', 'paid', 7, 8, 300.00),
('TY2034', '2021-09-15', '2021-09-22', 'Email Marketing', 7, 'Olivia Brown', 'olivia.brown@mail.com', 'pending', 9, 10, 950.00);

INSERT INTO invoice_items (invoice_id, name, quantity, price, total) VALUES
-- RT3080
('RT3080', 'Brand Guidelines', 1, 1800.90, 1800.90),

-- XM9141
('XM9141', 'UX Audit', 2, 500.00, 1000.00),
('XM9141', 'Follow-up Report', 1, 200.00, 200.00),

-- RG0314
('RG0314', 'Logo Sketch', 2, 200.00, 400.00),
('RG0314', 'Final Vector', 1, 400.00, 400.00),

-- AA1449
('AA1449', 'Monthly Hosting Fee', 3, 100.00, 300.00),

-- TY2034
('TY2034', 'Newsletter Template', 1, 500.00, 500.00),
('TY2034', 'Email Campaign Setup', 1, 450.00, 450.00);
