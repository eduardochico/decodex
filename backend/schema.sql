CREATE TABLE IF NOT EXISTS `applications` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(255) NOT NULL,
  `repository` varchar(255) NOT NULL,
  `git_url` varchar(255) NOT NULL,
  `language` varchar(64) NOT NULL,
  `status` enum('ok','error','warning') DEFAULT 'ok',
  `created_at` timestamp DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS `repository_scans` (
  `id` int NOT NULL AUTO_INCREMENT,
  `application_id` int NOT NULL,
  `status` enum('scanning','completed','error') DEFAULT 'scanning',
  `output` longtext,
  `created_at` timestamp DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `application_id_idx` (`application_id`),
  CONSTRAINT `fk_application` FOREIGN KEY (`application_id`) REFERENCES `applications`(`id`) ON DELETE CASCADE
 ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS `scan_files` (
  `id` int NOT NULL AUTO_INCREMENT,
  `scan_id` int NOT NULL,
  `filename` varchar(1024) NOT NULL,
  `source` longtext NOT NULL,
  `parse` longtext NOT NULL,
  PRIMARY KEY (`id`),
  KEY `scan_id_idx` (`scan_id`),
  CONSTRAINT `fk_scan` FOREIGN KEY (`scan_id`) REFERENCES `repository_scans`(`id`) ON DELETE CASCADE
 ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
