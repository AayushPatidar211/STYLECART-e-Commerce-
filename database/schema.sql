-- ==========================================================
-- StyleCart - Fashion E-Commerce Platform
-- Relational MySQL Database Schema & Initial Seed Data
-- ==========================================================

CREATE DATABASE IF NOT EXISTS `stylecart_db` 
DEFAULT CHARACTER SET utf8mb4 
COLLATE utf8mb4_unicode_ci;

USE `stylecart_db`;

-- 1. Users Table
CREATE TABLE IF NOT EXISTS `users` (
    `id` BIGINT AUTO_INCREMENT PRIMARY KEY,
    `first_name` VARCHAR(50) NOT NULL,
    `last_name` VARCHAR(50) NOT NULL,
    `email` VARCHAR(100) NOT NULL UNIQUE,
    `password` VARCHAR(120) NOT NULL,
    `role` VARCHAR(20) NOT NULL DEFAULT 'ROLE_USER',
    `phone_number` VARCHAR(20),
    `full_name` VARCHAR(100),
    `phone` VARCHAR(20),
    `street_address` VARCHAR(255),
    `apartment` VARCHAR(100),
    `city` VARCHAR(100),
    `state` VARCHAR(100),
    `postal_code` VARCHAR(20),
    `country` VARCHAR(100),
    `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX `idx_users_email` (`email`),
    INDEX `idx_users_role` (`role`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 2. Categories Table
CREATE TABLE IF NOT EXISTS `categories` (
    `id` BIGINT AUTO_INCREMENT PRIMARY KEY,
    `name` VARCHAR(50) NOT NULL UNIQUE,
    `description` VARCHAR(500),
    `image_url` VARCHAR(255),
    `active` BOOLEAN NOT NULL DEFAULT TRUE,
    INDEX `idx_categories_name` (`name`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 3. Products Table
CREATE TABLE IF NOT EXISTS `products` (
    `id` BIGINT AUTO_INCREMENT PRIMARY KEY,
    `name` VARCHAR(150) NOT NULL,
    `description` TEXT NOT NULL,
    `brand` VARCHAR(80) NOT NULL,
    `category_id` BIGINT NOT NULL,
    `price` DECIMAL(10, 2) NOT NULL,
    `discount_price` DECIMAL(10, 2),
    `discount_percentage` INT DEFAULT 0,
    `stock_quantity` INT NOT NULL DEFAULT 0,
    `rating` DOUBLE DEFAULT 4.5,
    `review_count` INT DEFAULT 0,
    `active` BOOLEAN NOT NULL DEFAULT TRUE,
    `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    CONSTRAINT `fk_product_category` FOREIGN KEY (`category_id`) REFERENCES `categories` (`id`) ON DELETE RESTRICT,
    INDEX `idx_product_category` (`category_id`),
    INDEX `idx_product_brand` (`brand`),
    INDEX `idx_product_price` (`price`),
    INDEX `idx_product_active` (`active`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 4. Product Images Table
CREATE TABLE IF NOT EXISTS `product_images` (
    `product_id` BIGINT NOT NULL,
    `image_url` VARCHAR(500) NOT NULL,
    CONSTRAINT `fk_images_product` FOREIGN KEY (`product_id`) REFERENCES `products` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 5. Product Available Sizes Table
CREATE TABLE IF NOT EXISTS `product_sizes` (
    `product_id` BIGINT NOT NULL,
    `size_name` VARCHAR(20) NOT NULL,
    CONSTRAINT `fk_sizes_product` FOREIGN KEY (`product_id`) REFERENCES `products` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 6. Product Available Colors Table
CREATE TABLE IF NOT EXISTS `product_colors` (
    `product_id` BIGINT NOT NULL,
    `color_name` VARCHAR(30) NOT NULL,
    CONSTRAINT `fk_colors_product` FOREIGN KEY (`product_id`) REFERENCES `products` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 7. Carts Table
CREATE TABLE IF NOT EXISTS `carts` (
    `id` BIGINT AUTO_INCREMENT PRIMARY KEY,
    `user_id` BIGINT NOT NULL UNIQUE,
    CONSTRAINT `fk_cart_user` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 8. Cart Items Table
CREATE TABLE IF NOT EXISTS `cart_items` (
    `id` BIGINT AUTO_INCREMENT PRIMARY KEY,
    `cart_id` BIGINT NOT NULL,
    `product_id` BIGINT NOT NULL,
    `selected_size` VARCHAR(20) NOT NULL,
    `selected_color` VARCHAR(30) NOT NULL,
    `quantity` INT NOT NULL DEFAULT 1,
    CONSTRAINT `fk_cart_items_cart` FOREIGN KEY (`cart_id`) REFERENCES `carts` (`id`) ON DELETE CASCADE,
    CONSTRAINT `fk_cart_items_product` FOREIGN KEY (`product_id`) REFERENCES `products` (`id`) ON DELETE RESTRICT
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 9. Wishlists Table
CREATE TABLE IF NOT EXISTS `wishlists` (
    `id` BIGINT AUTO_INCREMENT PRIMARY KEY,
    `user_id` BIGINT NOT NULL UNIQUE,
    CONSTRAINT `fk_wishlist_user` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 10. Wishlist Items Table
CREATE TABLE IF NOT EXISTS `wishlist_items` (
    `id` BIGINT AUTO_INCREMENT PRIMARY KEY,
    `wishlist_id` BIGINT NOT NULL,
    `product_id` BIGINT NOT NULL,
    `added_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT `fk_wishlist_items_wishlist` FOREIGN KEY (`wishlist_id`) REFERENCES `wishlists` (`id`) ON DELETE CASCADE,
    CONSTRAINT `fk_wishlist_items_product` FOREIGN KEY (`product_id`) REFERENCES `products` (`id`) ON DELETE CASCADE,
    UNIQUE KEY `uk_wishlist_product` (`wishlist_id`, `product_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 11. Orders Table
CREATE TABLE IF NOT EXISTS `orders` (
    `id` BIGINT AUTO_INCREMENT PRIMARY KEY,
    `order_number` VARCHAR(64) NOT NULL UNIQUE,
    `tracking_number` VARCHAR(64),
    `user_id` BIGINT NOT NULL,
    `subtotal` DECIMAL(10, 2) NOT NULL,
    `discount_amount` DECIMAL(10, 2) DEFAULT 0.00,
    `delivery_charge` DECIMAL(10, 2) NOT NULL,
    `total_amount` DECIMAL(10, 2) NOT NULL,
    `status` VARCHAR(30) NOT NULL DEFAULT 'PLACED',
    `payment_method` VARCHAR(50) NOT NULL,
    `payment_status` VARCHAR(20) NOT NULL DEFAULT 'PENDING',
    `transaction_id` VARCHAR(100),
    `order_notes` VARCHAR(500),
    `full_name` VARCHAR(100) NOT NULL,
    `phone` VARCHAR(20) NOT NULL,
    `street_address` VARCHAR(255) NOT NULL,
    `apartment` VARCHAR(100),
    `city` VARCHAR(100) NOT NULL,
    `state` VARCHAR(100) NOT NULL,
    `postal_code` VARCHAR(20) NOT NULL,
    `country` VARCHAR(100) NOT NULL,
    `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    CONSTRAINT `fk_order_user` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE RESTRICT,
    INDEX `idx_orders_user` (`user_id`),
    INDEX `idx_orders_status` (`status`),
    INDEX `idx_orders_number` (`order_number`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 12. Order Items Table
CREATE TABLE IF NOT EXISTS `order_items` (
    `id` BIGINT AUTO_INCREMENT PRIMARY KEY,
    `order_id` BIGINT NOT NULL,
    `product_id` BIGINT,
    `product_name` VARCHAR(150) NOT NULL,
    `product_image` VARCHAR(500),
    `selected_size` VARCHAR(20) NOT NULL,
    `selected_color` VARCHAR(30) NOT NULL,
    `quantity` INT NOT NULL,
    `unit_price` DECIMAL(10, 2) NOT NULL,
    `total_price` DECIMAL(10, 2) NOT NULL,
    CONSTRAINT `fk_order_items_order` FOREIGN KEY (`order_id`) REFERENCES `orders` (`id`) ON DELETE CASCADE,
    CONSTRAINT `fk_order_items_product` FOREIGN KEY (`product_id`) REFERENCES `products` (`id`) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ==========================================================
-- SEED DATA
-- ==========================================================

-- Seed Users (Passwords hashed using BCrypt: $2a$10$w... for password 'admin123' and 'user123')
INSERT INTO `users` (`id`, `first_name`, `last_name`, `email`, `password`, `role`, `phone_number`, `full_name`, `phone`, `street_address`, `city`, `state`, `postal_code`, `country`)
VALUES
(1, 'Admin', 'Officer', 'admin@stylecart.com', '$2a$10$wG2R0g4j68q1VvE39j/k5O7QxUuS7eZzX7rRjE3K8A4v.c/JbOQ2m', 'ROLE_ADMIN', '+1-555-0199', 'Admin Officer', '+1-555-0199', '100 Fashion Avenue, Suite 400', 'New York', 'NY', '10001', 'United States'),
(2, 'Sarah', 'Jenkins', 'user@stylecart.com', '$2a$10$6CqYf9iA.4v2bUvN4wWn6ODlJm0eH4Yx.vM3m7G1bT.a/X6wQeN5u', 'ROLE_USER', '+1-555-0142', 'Sarah Jenkins', '+1-555-0142', '742 Evergreen Terrace', 'Springfield', 'OR', '97477', 'United States');

-- Seed Carts & Wishlists
INSERT INTO `carts` (`id`, `user_id`) VALUES (1, 1), (2, 2);
INSERT INTO `wishlists` (`id`, `user_id`) VALUES (1, 1), (2, 2);

-- Seed Categories
INSERT INTO `categories` (`id`, `name`, `description`, `image_url`, `active`) VALUES
(1, 'Men', 'Tailored shirts, heavy cotton t-shirts, selvedge denim, trench coats, and outerwear.', 'https://images.unsplash.com/photo-1617137984095-74e4e5e3613f?auto=format&fit=crop&w=800&q=80', TRUE),
(2, 'Women', 'Contemporary designer dresses, silk blouses, structured trousers, kurtis, and eveningwear.', 'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?auto=format&fit=crop&w=800&q=80', TRUE),
(3, 'Kids', 'Comfortable, breathable organic cotton apparel, hoodies, denim, and playful prints.', 'https://images.unsplash.com/photo-1519238263530-99bdd11df2ea?auto=format&fit=crop&w=800&q=80', TRUE),
(4, 'Shoes', 'Handcrafted leather boots, minimalist sneakers, brogues, and Chelsea dress shoes.', 'https://images.unsplash.com/photo-1549298916-b41d501d3772?auto=format&fit=crop&w=800&q=80', TRUE),
(5, 'Accessories', 'Full-grain Italian leather bags, automatic watches, silk scarves, and braided belts.', 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=800&q=80', TRUE);

-- Seed Products
INSERT INTO `products` (`id`, `name`, `description`, `brand`, `category_id`, `price`, `discount_price`, `discount_percentage`, `stock_quantity`, `rating`, `review_count`, `active`) VALUES
(1, 'Minimalist Relaxed Fit Trench Coat', 'Constructed from a dense, water-repellent organic cotton twill. Features a relaxed storm flap, horn buttons, deep welt pockets, and a clean minimalist silhouette tailored for modern layering.', 'Zara Studio', 2, 189.00, 149.00, 21, 35, 4.8, 48, TRUE),
(2, 'Oversized Heavyweight Cotton Hoodie', 'Crafted from 480 GSM French terry cotton. Brushed interior for unrivaled softness with structured dropped shoulders and twin-needle reinforced ribbed cuffs.', 'Essentials Co.', 1, 95.00, 75.00, 21, 50, 4.9, 82, TRUE),
(3, 'Tailored Slim Wool-Blend Trousers', 'Refined wool blend trousers with front pressed pleats, concealed hook-and-bar closure, and cleanly tapered hems suitable for both formal and smart-casual styling.', 'Calvin Klein', 1, 120.00, 89.00, 25, 42, 4.7, 34, TRUE),
(4, 'Silk Slip Midi Dress in Champagne', 'Cut on the bias for a liquid drape that gracefully follows the body contours. Adjustable slim shoulder straps, delicate cowl neckline, and French seams throughout.', 'Mango Selection', 2, 140.00, 105.00, 25, 28, 4.8, 65, TRUE),
(5, 'Raw Selvedge Denim Straight Jeans', '13.5 oz Japanese selvedge denim woven on vintage shuttle looms. Raw unwashed indigo that molds to your unique wear patterns over time with copper rivet detailing.', 'Levi\'s Premium', 1, 160.00, 128.00, 20, 30, 4.7, 52, TRUE),
(6, 'Ribbed Merino Wool Knit Sweater', 'Spun from 100% extra-fine Australian merino wool. Exceptionally warm yet breathable with architectural horizontal ribbing and a ribbed mock neck.', 'COS', 2, 130.00, 99.00, 24, 22, 4.6, 29, TRUE),
(7, 'Handcrafted Suede Chelsea Boots', 'Rich Italian calf suede treated with water-resistant finish. Hand-stitched Goodyear welted construction, natural crepe sole, and elastic side gussets for effortless fit.', 'Nordstrom Atelier', 4, 220.00, 175.00, 20, 18, 4.9, 74, TRUE),
(8, 'Structured Leather Crossbody Tote', 'Full-grain pebble leather with matte palladium hardware. Magnetic top closure, partitioned interior with zippered laptop compartment, and adjustable crossbody strap.', 'Ralph Lauren', 5, 280.00, 210.00, 25, 14, 4.9, 91, TRUE),
(9, 'Classic Supima Cotton Oxford Shirt', 'Woven with long-staple American Supima cotton yarns. Soft rolled button-down collar, box pleat with locker loop, and Mother of Pearl buttons.', 'Tommy Hilfiger', 1, 85.00, 59.00, 30, 60, 4.6, 40, TRUE),
(10, 'Hand-Embroidered Chanderi Kurti', 'Ethically hand-embroidered by artisan weavers using fine Chanderi silk blend. Features delicate zari floral motifs, split mandarin collar, and side slit hems.', 'Fabindia Luxe', 2, 98.00, 69.00, 29, 26, 4.8, 38, TRUE),
(11, 'Kids Organic Cotton Graphic Sweatshirt', '100% GOTS certified organic fleece with non-toxic water-based botanical prints. Reinforced ribbed crewneck and ultra-soft brushed lining.', 'Mini Boden', 3, 45.00, 32.00, 28, 45, 4.7, 19, TRUE),
(12, 'Minimalist Bauhaus Automatic Watch', 'Clean 40mm stainless steel case with sapphire crystal glass. Japanese automatic self-winding movement, exhibition caseback, and genuine Horween leather strap.', 'Sternglas', 5, 340.00, 275.00, 19, 12, 5.0, 56, TRUE);

-- Seed Product Images
INSERT INTO `product_images` (`product_id`, `image_url`) VALUES
(1, 'https://images.unsplash.com/photo-1544441893-675973e31985?auto=format&fit=crop&w=800&q=80'),
(2, 'https://images.unsplash.com/photo-1556905055-8f358a7a47b2?auto=format&fit=crop&w=800&q=80'),
(3, 'https://images.unsplash.com/photo-1624378439575-d8705ad7ae80?auto=format&fit=crop&w=800&q=80'),
(4, 'https://images.unsplash.com/photo-1515372039744-b8f02a3ae446?auto=format&fit=crop&w=800&q=80'),
(5, 'https://images.unsplash.com/photo-1542272604-780c96856592?auto=format&fit=crop&w=800&q=80'),
(6, 'https://images.unsplash.com/photo-1576566588028-4147f3842f27?auto=format&fit=crop&w=800&q=80'),
(7, 'https://images.unsplash.com/photo-1638247025967-b4e38f787b76?auto=format&fit=crop&w=800&q=80'),
(8, 'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?auto=format&fit=crop&w=800&q=80'),
(9, 'https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?auto=format&fit=crop&w=800&q=80'),
(10, 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=800&q=80'),
(11, 'https://images.unsplash.com/photo-1622290291468-a28f7a7dc6a8?auto=format&fit=crop&w=800&q=80'),
(12, 'https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?auto=format&fit=crop&w=800&q=80');

-- Seed Product Sizes
INSERT INTO `product_sizes` (`product_id`, `size_name`) VALUES
(1, 'XS'), (1, 'S'), (1, 'M'), (1, 'L'), (1, 'XL'),
(2, 'S'), (2, 'M'), (2, 'L'), (2, 'XL'), (2, 'XXL'),
(3, '30'), (3, '32'), (3, '34'), (3, '36'),
(4, 'XS'), (4, 'S'), (4, 'M'), (4, 'L'),
(5, '30'), (5, '32'), (5, '34'), (5, '36'),
(6, 'S'), (6, 'M'), (6, 'L'), (6, 'XL'),
(7, '8'), (7, '9'), (7, '10'), (7, '11'), (7, '12'),
(8, 'One Size'),
(9, 'S'), (9, 'M'), (9, 'L'), (9, 'XL'),
(10, 'S'), (10, 'M'), (10, 'L'), (10, 'XL'),
(11, '3-4Y'), (11, '5-6Y'), (11, '7-8Y'), (11, '9-10Y'),
(12, '40mm');

-- Seed Product Colors
INSERT INTO `product_colors` (`product_id`, `color_name`) VALUES
(1, 'Camel'), (1, 'Black'), (1, 'Olive'),
(2, 'Heather Grey'), (2, 'Washed Black'), (2, 'Sage'),
(3, 'Charcoal'), (3, 'Navy'), (3, 'Beige'),
(4, 'Champagne'), (4, 'Emerald'), (4, 'Black'),
(5, 'Raw Indigo'), (5, 'Faded Blue'),
(6, 'Oatmeal'), (6, 'Dark Olive'), (6, 'Espresso'),
(7, 'Tan Suede'), (7, 'Midnight Black'),
(8, 'Cognac Brown'), (8, 'Obsidian Black'),
(9, 'Sky Blue'), (9, 'White'), (9, 'Oxford Grey'),
(10, 'Powder Blue'), (10, 'Dusty Rose'),
(11, 'Oatmeal Heather'), (11, 'Forest Green'),
(12, 'Brushed Silver'), (12, 'Matte Black');

-- Seed Sample Orders
INSERT INTO `orders` (`id`, `order_number`, `tracking_number`, `user_id`, `subtotal`, `discount_amount`, `delivery_charge`, `total_amount`, `status`, `payment_method`, `payment_status`, `transaction_id`, `full_name`, `phone`, `street_address`, `city`, `state`, `postal_code`, `country`)
VALUES
(1, 'SC-20260915-1042', 'TRK-98421094', 2, 224.00, 0.00, 0.00, 224.00, 'DELIVERED', 'CREDIT_CARD', 'PAID', 'TXN-A91B824C9102', 'Sarah Jenkins', '+1-555-0142', '742 Evergreen Terrace', 'Springfield', 'OR', '97477', 'United States'),
(2, 'SC-20260924-8491', 'TRK-44219082', 2, 149.00, 0.00, 0.00, 149.00, 'PROCESSING', 'CREDIT_CARD', 'PAID', 'TXN-F40192BA0184', 'Sarah Jenkins', '+1-555-0142', '742 Evergreen Terrace', 'Springfield', 'OR', '97477', 'United States');

-- Seed Sample Order Items
INSERT INTO `order_items` (`id`, `order_id`, `product_id`, `product_name`, `product_image`, `selected_size`, `selected_color`, `quantity`, `unit_price`, `total_price`)
VALUES
(1, 1, 2, 'Oversized Heavyweight Cotton Hoodie', 'https://images.unsplash.com/photo-1556905055-8f358a7a47b2?auto=format&fit=crop&w=800&q=80', 'M', 'Heather Grey', 1, 75.00, 75.00),
(2, 1, 1, 'Minimalist Relaxed Fit Trench Coat', 'https://images.unsplash.com/photo-1544441893-675973e31985?auto=format&fit=crop&w=800&q=80', 'S', 'Camel', 1, 149.00, 149.00),
(3, 2, 1, 'Minimalist Relaxed Fit Trench Coat', 'https://images.unsplash.com/photo-1544441893-675973e31985?auto=format&fit=crop&w=800&q=80', 'M', 'Black', 1, 149.00, 149.00);
