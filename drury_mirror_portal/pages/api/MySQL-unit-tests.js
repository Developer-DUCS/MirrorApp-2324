// Unit Tests for SQL database

import executeQuery from "../../backend/mysqldb";

var fs = require("fs");

export default async (req, res) => {
    console.log("Running unit tests... ");

    let totalTests;
    let successfulTests;
    let failedTests;

    // api/addImage
    totalTests = 1;
    successfulTests = 0;
    failedTests = 0;

    console.log(`Testing route: api/addImage | `)

    console.log(buildScript);

    const createDb = await executeQuery({
        query: buildScript
    });

    if (createDb.error){
        res.status(500).json({ error: "failed to build temp database" });
    }
    else {
        res.status(200).json({ msg: "successfully built temp database" });
    }

    /* const buildDb = await createTempDatabase();

    if (buildDb.error){
        console.log(buildDb.error);
        res.status(500);
    } */

    // api/changeUserRole

    // api/createUser

    // api/deleteImage

    // api/
};

// run test function
async function runTest(routeName, data, ){

}

// SQL querys to create temp tables for testing
async function createTempDatabase() {
    const createDb = await executeQuery({
        query: buildScript
    });

    if (createDb.error){
        return { error: "failed to build temp database" };
    }
    else {
        return { msg: "successfully built temp database" };
    }
}

const buildScript = `
-- -----------------------------------------------------
-- Sql file to reset database
-- -----------------------------------------------------

-- -----------------------------------------------------
-- Schema drury_mirror_portal
-- -----------------------------------------------------

SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0;
SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0;
SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION';

CREATE SCHEMA IF NOT EXISTS \`du_mirror\` DEFAULT CHARACTER SET utf8 ;
USE \`du_mirror\` ;

-- -----------------------------------------------------
-- Table \`du_mirror\`.\`usersTemp\`
-- -----------------------------------------------------

CREATE TABLE IF NOT EXISTS \`du_mirror\`.\`usersTemp\` (
  \`uid\` INT NOT NULL AUTO_INCREMENT,
  \`fname\` VARCHAR(45) NOT NULL,
  \`lname\` VARCHAR(45) NOT NULL,
  \`email\` VARCHAR(60) NOT NULL,
  \`password\` VARCHAR(60) NULL,
  \`roles\` VARCHAR(20) NOT NULL,
  \`created\` DATETIME NULL,
  \`active\` bool NOT NULL,
  PRIMARY KEY (\`uid\`),
  UNIQUE INDEX \`email_UNIQUE\` (\`email\` ASC) VISIBLE)
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table \`du_mirror\`.\`commentsTemp\`
-- -----------------------------------------------------

DROP TABLE IF EXISTS \`du_mirror\`.\`commentsTemp\` ;

CREATE TABLE IF NOT EXISTS \`du_mirror\`.\`commentsTemp\` (
  \`cid\` INT NOT NULL, -- Set to the same as the "aid" of the article that the comments belong to
  \`email\` VARCHAR(60) NOT NULL,
  \`editor\` VARCHAR(45) NOT NULL,
  \`overallComments\` VARCHAR(500) NOT NULL,
  \`comments\` VARCHAR(500) NOT NULL,
  \`createdDate\` date NOT NULL,
  PRIMARY KEY (\`cid\`))
ENGINE = InnoDB;
 
-- -----------------------------------------------------
-- Table \`du_mirror\`.\`articlesTemp\`
-- -----------------------------------------------------

DROP TABLE IF EXISTS \`du_mirror\`.\`articlesTemp\` ;

-- isDraft: 0: unfinishedTemp, 1: Draft (ready to be edited), 2: Edited (sent back to the author), 
--          3: Fixed (sent to editor again), 4: Ready to publish (send to Editor-In-Chief), 5: Publish
CREATE TABLE IF NOT EXISTS \`du_mirror\`.\`articlesTemp\` (
  \`aid\` INT NOT NULL AUTO_INCREMENT,
  \`email\` VARCHAR(60) NOT NULL,
  \`author\` VARCHAR(45) NOT NULL,
  \`headline\` VARCHAR(50) NOT NULL,
  \`body\` MEDIUMTEXT NOT NULL,
  \`isDraft\` INT NOT NULL,
  \`imageType\` VARCHAR(100) NULL,
  \`thumbnailImage\` VARCHAR(200) NULL,
  \`createdDate\` date NOT NULL,
  \`isRemoved\` INT,
  PRIMARY KEY (\`aid\`))
ENGINE = InnoDB;

-- -----------------------------------------------------
-- Table \`du_mirror\`.\`tagsTemp\`
-- -----------------------------------------------------
  DROP TABLE IF EXISTS \`du_mirror\`.\`tagsTemp\` ;

  CREATE TABLE IF NOT EXISTS \`du_mirror\`.\`tagsTemp\` (
    \`tid\` INT NOT NULL,
    \`local\` bool,
    \`national\` bool,
    \`international\` bool,
    PRIMARY KEY (\`tid\`))
  ENGINE = InnoDB;
-- -----------------------------------------------------
-- Table \`du_mirror\`.\`unfinishedTemp\`
-- -----------------------------------------------------

DROP TABLE IF EXISTS \`du_mirror\`.\`unfinishedTemp\` ;

CREATE TABLE IF NOT EXISTS \`du_mirror\`.\`unfinishedTemp\` (
  \`fid\` INT NOT NULL AUTO_INCREMENT,
  \`author\` VARCHAR(45) NOT NULL,
  \`headline\` VARCHAR(50) NOT NULL,
  \`body\` VARCHAR(8000) NOT NULL,
  \`isDraft\` bool NOT NULL,
  \`createdDate\` date NOT NULL,
  PRIMARY KEY (\`fid\`))
ENGINE = InnoDB;

-- -----------------------------------------------------
-- Table \`du_mirror\`.\`sessionsTemp\`
-- -----------------------------------------------------

DROP TABLE IF EXISTS \`du_mirror\`.\`sessionsTemp\`;

CREATE TABLE IF NOT EXISTS \`du_mirror\`.\`sessionsTemp\`
  (
    \`id\`            INT NOT NULL AUTO_INCREMENT,
    \`user_id\`       INTEGER NOT NULL,
    \`expires\`       TIMESTAMP(6) NOT NULL,
    \`session_token\` VARCHAR(255) NOT NULL,
    \`access_token\`  VARCHAR(255) NOT NULL,
    \`created_at\`    TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
    \`updated_at\`    TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
    PRIMARY KEY (\`id\`)
  )
ENGINE = InnoDB;

-- -----------------------------------------------------
-- Table \`du_mirror\`.\`tokensTemp\`
-- -----------------------------------------------------

DROP TABLE IF EXISTS \`du_mirror\`.\`tokensTemp\`;

-- forgot_password_token row is a placeholder for the tokensTemp used to reset passwords
-- when a new password is made the token will be stored and overwritten when another
-- new password is made.
CREATE TABLE IF NOT EXISTS \`du_mirror\`.\`tokensTemp\`
  (
    \`id\`                            INT NOT NULL AUTO_INCREMENT,
    \`email\`                         VARCHAR(50) NOT NULL,
    \`forgot_password_token\`         VARCHAR(255) NOT NULL,
    PRIMARY KEY (\`id\`)
  )
ENGINE = InnoDB;

-- -----------------------------------------------------
-- Table \`du_mirror\`.\`categoriesTemp\`
-- -----------------------------------------------------

DROP TABLE IF EXISTS \`du_mirror\`.\`categoriesTemp\`;

CREATE TABLE \`du_mirror\`.\`categoriesTemp\` (
  \`cid\` INT NOT NULL AUTO_INCREMENT,
  \`front_page\` INT NOT NULL,
  \`sports\` INT NOT NULL,
  \`lifestyle\` INT NOT NULL,
  \`campus_news\` INT NOT NULL,
  \`news\` INT NOT NULL,
  \`weekend\` INT NOT NULL,
  \`editorial\` INT NOT NULL,
  \`aid\` INT NOT NULL,
  PRIMARY KEY (\`cid\`));

-- add article id (aid) as a foreign key to the categoriesTemp table

ALTER TABLE \`du_mirror\`.\`categoriesTemp\`
ADD CONSTRAINT \`article_category\`
FOREIGN KEY (\`aid\`)
REFERENCES \`du_mirror\`.\`articlesTemp\`(\`aid\`);

SET SQL_MODE=@OLD_SQL_MODE;
SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS;
SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS;
`;