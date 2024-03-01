-- new column added to articles to remove them from the draftlist but
--  keep the information to avoid dependency issues
ALTER TABLE du_mirror.articles ADD isRemoved int;