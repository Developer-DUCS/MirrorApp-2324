// Page Description:
//                  API to handle removing an article draft. This will alter a boolean so the 
//                  draft still exists on the server but will not show up on the draft list.
//Creation Date:
//                  By: Charlie Roder  Jan. 26 2024
//
//Modificaiton Log:
//
//

import executeQuery from "../../backend/mysqldb";

const conn = require("../../backend/mysqldb");

export default async (req, res) => {
    try {
        const body = req.body;

        let articleId = body.articleId;

        console.log(articleId);

        let removeQuery = `UPDATE articles SET isRemoved = 1 WHERE articles.aid = ${articleId}`;

        const removeDraft = await executeQuery({
            query: removeQuery,
        });

        if (removeDraft.error) {
            res.status(500).json({ error: "Error removing article draft."});
        }
        else {
            console.log("🚀 ~ file: removeDraft.js: ~ result:")
            console.log("article draft with id removed: ", articleId);
            res.status(201).json({ msg: "Successful removal of article draft."});
        }

    }
    catch (error) {
        console.log(error);
        res.status(500).json({ msg: "Error removing article draft."})
    }
}