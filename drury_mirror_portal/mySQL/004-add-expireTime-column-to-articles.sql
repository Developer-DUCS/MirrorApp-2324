-- Adds new column to articles to set when the article should be removed from the mobile version.
ALTER TABLE du_mirror.articles ADD expireTime int;