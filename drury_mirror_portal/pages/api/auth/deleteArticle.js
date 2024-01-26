// deleteArticle.js
// Page Description:
//                  Delete an article from the draft list
//Creation Date:
//                  By: Paul Pollard  Jan. 25 2024
//
//Modificaiton Log:
//
//

import executeQuery from "../../backend/mysqldb";

// connection requirement
const conn = require("../../backend/mysqldb");

export default async (req, res) => {

    const body = req.body;
    
    let aid = body.aid;

    //Attempt to delete
    try{
        deleteQuery = `delete from du_mirror.articles where aid = ?`;

        checkQuery = `select * from du_mirror.articles where aid = ?`;

        const checkArticle = await executeQuery({
            query: checkQuery,
            values: aid,
        });
        if (checkArticle.length == 1) {
            const deleteArticleResult = await executeQuery({
                query: deleteQuery,
                values: aid,
            });
            if (deleteArticleResult.error) {
                return res.status(500).json({ error: deleteQuery.error });
            } else {
                return res.status(204).json({ msg: "Article Deleted" });
            }
        } else {
            return res.status(401).json({ msg: "Article does not exist" });
        }
    }
    catch{
		console.log(error);
    }
};