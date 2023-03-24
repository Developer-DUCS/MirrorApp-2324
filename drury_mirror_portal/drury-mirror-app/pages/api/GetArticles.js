// ----------------------------------------------------------------
//
// GetArticles.JS
// !!! (mobile version, not to be confused with portal) !!!
// - fetches all article data except body and thumbnails
//
// TODO body is loaded on article click
// TODO first 20 thumbnails are downloaded
// - as the user scrolls down, refresh
//
// ----------------------------------------------------------------

const fs = require("fs");
const path = require("path");

const conn = require("../../backend/mysqldb");

function createArticleIndices(articleArray) {
    const folderName = "ArticleIndices";
    const folderPath = path.join(__dirname, "..", "..", folderName);

    articleArray.forEach((item) => {
        const fileName = `${item.name}.json`;
        const filePath = path.join(folderPath, fileName);
        const fileContent = JSON.stringify(item);
        fs.writeFileSync(filePath, fileContent);
    });
}

export default async (req, res) => {
    console.log("called get article route");

    // * Turbo console log
    // * select what to log
    // * ctrl+option+l OR ctrl + alt + l (liveshare extension has hotkey conflicts)

    let isDraft = "0";

    let getQuery = "SELECT aid, author, headline, isDraft, body, thumbnailImage, imageType FROM articles";

    let query = getQuery;

    conn.connect()

    conn.query(query, (err, rows) => {
        if (err) {
            console.log("error", err);

            return res
                .status(500)
                .json({ error: err, msg: "SQL Fetching Error" });
        } else if (rows.length == 0) {
            console.log("No articles");
            return res.status(400).json({ msg: "No articles matching query." });
        } else {
            let articles = [];
            rows.forEach((row) => {
                let article = {
                    aid: row.aid,
                    author: row.author,
                    headline: row.headline,
                    body: row.body,
                    isDraft: row.isDraft,
                    thumbnailImageData: row.thumbnailImage,
                    imageType: row.imageType,
                };
                
                console.log("Image Type: " +  typeof article.thumbnailImageData);
                console.log("Image Type: " +  typeof article.body);
                
                articles.push(article);
            });

            //createArticleIndices(articles);

            return res.status(200).json(articles);
        }
    });
};
