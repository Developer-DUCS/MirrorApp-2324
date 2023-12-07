// ----------------------------------------------------------------
//
// GetArticleByTag.JS
// - Fetches articles from the database depending on their tags
//
// ----------------------------------------------------------------

import { forEach } from "lodash";

const conn = require("../../backend/mysqldb");

export default async (req, res) => {

    console.log(req.body.filter);

    // Define the text to match
    const filterByTag = req.body.filterBy;
    console.log("Filtering by Tag: " + filterByTag);

    // Build the SQL query to look up rows with matching headline text
    let query = `SELECT * FROM articles`;

    // 1. Fetch all articles

    // Execute the query
    let articles = [];
    conn.query(query, (error, rows, fields) => {
        if (error) {
            console.error("ERROR:\n" + error);
            return;
        }
        rows.forEach((row) => {
            let article = {
                aid: row.aid,
                author: row.author,
                headline: row.headline,
                body: row.body,
                isDraft: row.isDraft,
                thumbnailImage: row.thumbnailImage,
            };

            articles.push(article);
        });

        // Return if no filter
        if (filterByTag === "All" || filterByTag === "Recent") {
            console.log("Called recent articles.");
            //console.log(articles);
            return res.status(200).json(articles);
        }
    });

    // 2. Fetch all tag rows if filter

    if (filterByTag === "Front Page" || filterByTag === "Sports" || filterByTag === "Lifestyle" || filterByTag === "Campus News" || filterByTag === "Weekend" || filterByTag === "Editorial") {

        // Change tag name to match SQL naming conventions
        let filterName;

        if (filterByTag === "Front Page") { filterName = 'front_page'; }
        else if (filterByTag === "Sports") { filterName = 'sports'; }
        else if (filterByTag === "Lifestyle") { filterName = 'lifestyle'; }
        else if (filterByTag === "Campus News") { filterName = 'campus_news'; }
        else if (filterByTag === "Weekend") { filterName = 'weekend'; }
        else if (filterByTag === "Editorial") { filterName = 'editorial'; }
        
        // Update the query
        query = `SELECT * FROM articles JOIN categories ON categories.aid = articles.aid WHERE categories.?? LIKE 1`;
        let value = [filterName];

        conn.query(query, value, (error, rows, fields) => {
            if (error) {
                console.error("ERROR:\n" + error);
                return;
            }

            if (rows.length == 0){
                console.log(`No articles with the ${filterByTag} category`)
            }
            else {
                return res.status(200).json(rows);
            }
        });

    }
};
