-- -----------------------------------------------------
-- Sql file to reset database
-- -----------------------------------------------------

-- -----------------------------------------------------
-- Schema drury_mirror_portal
-- -----------------------------------------------------

SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0;
SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0;
SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION';


CREATE SCHEMA IF NOT EXISTS `du_mirror_temp` DEFAULT CHARACTER SET utf8 ;
USE `du_mirror_temp` ;

-- -----------------------------------------------------
-- Table `du_mirror_temp`.`user`
-- -----------------------------------------------------

CREATE TABLE IF NOT EXISTS `du_mirror_temp`.`users` (
  `uid` INT NOT NULL AUTO_INCREMENT,
  `fname` VARCHAR(45) NOT NULL,
  `lname` VARCHAR(45) NOT NULL,
  `email` VARCHAR(60) NOT NULL,
  `password` VARCHAR(60) NULL,
  `roles` VARCHAR(20) NOT NULL,
  `created` DATETIME NULL,
  `active` bool NOT NULL,
  PRIMARY KEY (`uid`),
  UNIQUE INDEX `email_UNIQUE` (`email` ASC) VISIBLE)
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `du_mirror_temp`.`comments`
-- -----------------------------------------------------

DROP TABLE IF EXISTS `du_mirror_temp`.`comments` ;

CREATE TABLE IF NOT EXISTS `du_mirror_temp`.`comments` (
  `cid` INT NOT NULL, -- Set to the same as the "aid" of the article that the comments belong to
  `email` VARCHAR(60) NOT NULL,
  `editor` VARCHAR(45) NOT NULL,
  `overallComments` VARCHAR(500) NOT NULL,
  `comments` VARCHAR(500) NOT NULL,
  `createdDate` date NOT NULL,
  PRIMARY KEY (`cid`))
ENGINE = InnoDB;
 
-- -----------------------------------------------------
-- Table `du_mirror_temp`.`article`
-- -----------------------------------------------------

DROP TABLE IF EXISTS `du_mirror_temp`.`articles` ;

-- isDraft: 0: Unfinished, 1: Draft (ready to be edited), 2: Edited (sent back to the author), 
--          3: Fixed (sent to editor again), 4: Ready to publish (send to Editor-In-Chief), 5: Publish
CREATE TABLE IF NOT EXISTS `du_mirror_temp`.`articles` (
  `aid` INT NOT NULL AUTO_INCREMENT,
  `email` VARCHAR(60) NOT NULL,
  `author` VARCHAR(45) NOT NULL,
  `headline` VARCHAR(50) NOT NULL,
  `body` MEDIUMTEXT NOT NULL,
  `isDraft` INT NOT NULL,
  `imageType` VARCHAR(100) NULL,
  `thumbnailImage` VARCHAR(200) NULL,
  `createdDate` date NOT NULL,
  `isRemoved` INT,
  PRIMARY KEY (`aid`))
ENGINE = InnoDB;

-- -----------------------------------------------------
-- Table `du_mirror_temp`.`tags`
-- -----------------------------------------------------
  DROP TABLE IF EXISTS `du_mirror_temp`.`tags` ;

  CREATE TABLE IF NOT EXISTS `du_mirror_temp`.`tags` (
    `tid` INT NOT NULL,
    `local` bool,
    `national` bool,
    `international` bool,
    PRIMARY KEY (`tid`))
  ENGINE = InnoDB;
-- -----------------------------------------------------
-- Table `du_mirror_temp`.`unfinished`
-- -----------------------------------------------------

DROP TABLE IF EXISTS `du_mirror_temp`.`unfinished` ;

CREATE TABLE IF NOT EXISTS `du_mirror_temp`.`unfinished` (
  `fid` INT NOT NULL AUTO_INCREMENT,
  `author` VARCHAR(45) NOT NULL,
  `headline` VARCHAR(50) NOT NULL,
  `body` VARCHAR(8000) NOT NULL,
  `isDraft` bool NOT NULL,
  `createdDate` date NOT NULL,
  PRIMARY KEY (`fid`))
ENGINE = InnoDB;

-- -----------------------------------------------------
-- Table `du_mirror_temp`.`sessions`
-- -----------------------------------------------------

DROP TABLE IF EXISTS `du_mirror_temp`.`sessions`;

CREATE TABLE IF NOT EXISTS `du_mirror_temp`.`sessions`
  (
    `id`            INT NOT NULL AUTO_INCREMENT,
    `user_id`       INTEGER NOT NULL,
    `expires`       TIMESTAMP(6) NOT NULL,
    `session_token` VARCHAR(255) NOT NULL,
    `access_token`  VARCHAR(255) NOT NULL,
    `created_at`    TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
    `updated_at`    TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
    PRIMARY KEY (`id`)
  )
ENGINE = InnoDB;

-- -----------------------------------------------------
-- Table `du_mirror_temp`.`tokens`
-- -----------------------------------------------------

DROP TABLE IF EXISTS `du_mirror_temp`.`tokens`;

-- forgot_password_token row is a placeholder for the tokens used to reset passwords
-- when a new password is made the token will be stored and overwritten when another
-- new password is made.
CREATE TABLE IF NOT EXISTS `du_mirror_temp`.`tokens`
  (
    `id`                            INT NOT NULL AUTO_INCREMENT,
    `email`                         VARCHAR(50) NOT NULL,
    `forgot_password_token`         VARCHAR(255) NOT NULL,
    PRIMARY KEY (`id`)
  )
ENGINE = InnoDB;

-- -----------------------------------------------------
-- Table `du_mirror_temp`.`categories`
-- -----------------------------------------------------

DROP TABLE IF EXISTS `du_mirror_temp`.`categories`;

CREATE TABLE `du_mirror_temp`.`categories` (
  `cid` INT NOT NULL AUTO_INCREMENT,
  `front_page` INT NOT NULL,
  `sports` INT NOT NULL,
  `lifestyle` INT NOT NULL,
  `campus_news` INT NOT NULL,
  `news` INT NOT NULL,
  `weekend` INT NOT NULL,
  `editorial` INT NOT NULL,
  `aid` INT NOT NULL,
  PRIMARY KEY (`cid`));

-- add article id (aid) as a foreign key to the categories table

ALTER TABLE `du_mirror_temp`.`categories`
ADD CONSTRAINT `article_category`
FOREIGN KEY (`aid`)
REFERENCES `du_mirror_temp`.`articles`(`aid`);

SET SQL_MODE=@OLD_SQL_MODE;
SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS;
SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS;