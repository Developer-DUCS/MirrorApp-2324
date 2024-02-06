// Page Description:
//                  API to handle an article comment being resolved.
//                  This will remove the specified comment from the array of comments associated with the article.
//
// Creation Date: 
//                  By: Charlie Roder  Feb. 4, 2024
//
// Modification Log:
//
//

import executeQuery from "../../backend/mysqldb";

const conn = require("../../backend/mysqldb");

export default async (req, res) => {
    try {
        const body = req.body;

        let articleId = body.articleId;
        let buttonId = body.buttonId;

        // get the commentId based on the buttonId
        let commentId = `input${buttonId.split("n")[1]}`;
        
        let getCommentsQuery = `SELECT comments from comments WHERE cid = ?`;

        const getComments = await executeQuery({
            query: getCommentsQuery,
            values: [articleId],
        });

        if (getComments.error) {
            res.status(500).json({ error: "Error getting comments."});
        }
        else {
            let comments = getComments[0].comments;

            // reformat comments array
            let commentList = comments.split(",");

            comments = []
            // repopulate the comments array with formatted: [comment, input id value]
            for (let i = 0; i < commentList.length; i++){
                comments.push([commentList[i], commentList[i+1]]);
                i +=1;
            }

            // remove the resolved comment from the list

            for (let i = 0; i < comments.length; i++){
                // remove comment if commentIds match
                if (comments[i][1] === commentId){
                    if (comments.length == 1){
                        comments = []
                    }
                    else {
                        // split the array in order to remove the item
                        let firstHalf = comments.slice(0, i);
                        let secondHalf = comments.slice(i+1);
                        
                        // return the concat of the two arrays without the comment being resolved
                        comments = firstHalf.concat(secondHalf);
                        break;
                    }
                }
            }

            // Update comments table to match the new comment array
            try {
                let updateCommentsQuery = `UPDATE comments SET comments = ? WHERE (cid = ?)`;

                let formattedComments = comments.join()

                const updateCommentsResult = await executeQuery({
                    query: updateCommentsQuery,
                    values: [formattedComments, articleId]
                });

                if (updateCommentsResult.error){
                    return res.status(500).json({ error: updateCommentsResult.error})
                }
                else {
                    console.log("Removed comment with id: ", buttonId.split("n")[1]);
                    return res.status(200).json({ msg: "comment array sucessfully updated", commentArray: comments});
                }
            }
            catch (error) {
                console.log(error);
                res.status(500).json({ msg: "Error updating comments."});
            }
        }

    }
    catch (error) {
        console.log(error);
        res.status(500).json({ msg: "Error getting comments."});
    }

}