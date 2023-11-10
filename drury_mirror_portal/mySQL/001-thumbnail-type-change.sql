-- This change is required do to how images will be saved
--      The data type needs to be a string because the path to the image is being saved

ALTER TABLE `articles`
MODIFY COLUMN `thumbnailImage` VARCHAR(200);