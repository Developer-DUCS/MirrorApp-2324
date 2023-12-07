CREATE TABLE `du_mirror`.`categories` (
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

ALTER TABLE `du_mirror`.`categories`
ADD CONSTRAINT `article_category`
FOREIGN KEY (`aid`)
REFERENCES `du_mirror`.`articles`(`aid`);