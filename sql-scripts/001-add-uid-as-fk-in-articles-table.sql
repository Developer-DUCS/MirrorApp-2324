--create a new column named article_uid inside the articles table
ALTER TABLE article
ADD COLUMN article_uid INT AFTER aid;

--make the article_uid column a foreign key referencing the uid column in the users table
ALTER TABLE article
ADD FOREIGN KEY (article_uid) REFERENCES users(uid);