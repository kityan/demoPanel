-- MySQL Workbench Forward Engineering

SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0;
SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0;
SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='TRADITIONAL,ALLOW_INVALID_DATES';

-- -----------------------------------------------------
-- Schema demo-panel
-- -----------------------------------------------------

-- -----------------------------------------------------
-- Schema demo-panel
-- -----------------------------------------------------
CREATE SCHEMA IF NOT EXISTS `demo-panel` DEFAULT CHARACTER SET utf8 COLLATE utf8_general_ci ;
USE `demo-panel` ;

-- -----------------------------------------------------
-- Table `demo-panel`.`users`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `demo-panel`.`users` (
  `id` INT UNSIGNED NOT NULL AUTO_INCREMENT COMMENT '',
  `name` VARCHAR(255) NULL COMMENT '',
  `password` VARCHAR(255) NULL COMMENT '',
  `dtCreate` DATETIME NULL COMMENT '',
  PRIMARY KEY (`id`)  COMMENT '',
  UNIQUE INDEX `name_UNIQUE` (`name` ASC)  COMMENT '')
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `demo-panel`.`tasks`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `demo-panel`.`tasks` (
  `id` INT UNSIGNED NOT NULL AUTO_INCREMENT COMMENT '',
  `authorId` INT UNSIGNED NOT NULL COMMENT '',
  `title` TEXT NULL COMMENT '',
  `body` TEXT NULL COMMENT '',
  `dtCreate` DATETIME NULL COMMENT '',
  `dtUpdate` DATETIME NULL COMMENT '',
  PRIMARY KEY (`id`)  COMMENT '',
  INDEX `fk_tasks_users1_idx` (`authorId` ASC)  COMMENT '',
  CONSTRAINT `fk_tasks_users1`
    FOREIGN KEY (`authorId`)
    REFERENCES `demo-panel`.`users` (`id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `demo-panel`.`tasks_permissions`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `demo-panel`.`tasks_permissions` (
  `tasks_id` INT UNSIGNED NOT NULL COMMENT '',
  `users_id` INT UNSIGNED NOT NULL COMMENT '',
  PRIMARY KEY (`tasks_id`, `users_id`)  COMMENT '',
  INDEX `fk_tasks_has_users_users1_idx` (`users_id` ASC)  COMMENT '',
  INDEX `fk_tasks_has_users_tasks1_idx` (`tasks_id` ASC)  COMMENT '',
  CONSTRAINT `fk_tasks_has_users_tasks1`
    FOREIGN KEY (`tasks_id`)
    REFERENCES `demo-panel`.`tasks` (`id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT `fk_tasks_has_users_users1`
    FOREIGN KEY (`users_id`)
    REFERENCES `demo-panel`.`users` (`id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB;


SET SQL_MODE=@OLD_SQL_MODE;
SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS;
SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS;

-- -----------------------------------------------------
-- Data for table `demo-panel`.`users`
-- -----------------------------------------------------
START TRANSACTION;
USE `demo-panel`;
INSERT INTO `demo-panel`.`users` (`id`, `name`, `password`, `dtCreate`) VALUES (1, 'test1', '136a5988bfe71efc94e5b8945817d6bd', '2018-03-21 00:00:00');
INSERT INTO `demo-panel`.`users` (`id`, `name`, `password`, `dtCreate`) VALUES (2, 'test2', 'c10c3272aa5672993d72c79964d7ca50', '2018-03-21 00:00:00');
INSERT INTO `demo-panel`.`users` (`id`, `name`, `password`, `dtCreate`) VALUES (3, 'test3', '34c078f08408d0dbad0014e6e3d1b633', '2018-03-21 00:00:00');

COMMIT;


-- -----------------------------------------------------
-- Data for table `demo-panel`.`tasks`
-- -----------------------------------------------------
START TRANSACTION;
USE `demo-panel`;
INSERT INTO `demo-panel`.`tasks` (`id`, `authorId`, `title`, `body`, `dtCreate`, `dtUpdate`) VALUES (1, 1, 'title1', 'body1', '2018-03-21 00:00:00', NULL);

COMMIT;


-- -----------------------------------------------------
-- Data for table `demo-panel`.`tasks_permissions`
-- -----------------------------------------------------
START TRANSACTION;
USE `demo-panel`;
INSERT INTO `demo-panel`.`tasks_permissions` (`tasks_id`, `users_id`) VALUES (1, 2);

COMMIT;

