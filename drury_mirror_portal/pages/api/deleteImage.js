// deleteImage.js
// Page Description:
//                  This rooute will exist in the articleWriting page and will allow users to delete an uploaded thumbnail image
//                  so that another image can be selected. This portion removes the image from the server and alters the sql database
//                  by setting thumbnailImage to null. 
//                  
//Creation Date:
//                  By: Charlie Roder, 11/12/2023
//
//Modificaiton Log:
//
//

import { promises as fs } from 'fs'
import executeQuery from "../../backend/mysqldb";

const conn = require("../../backend/mysqldb");

export default async (req, res) => {
    try {
        console.log(`deleting image: ${req.body.filePath}`);

        // update sql table to set thumbnail image and image type to nulL
        if (req.body.aid) {
            console.log(`from article: ${req.body.aid}`);

            let removeImageQuery = 'UPDATE articles SET imageType = NULL, thumbnailImage = NULL WHERE aid = ?;'

            const result = await executeQuery({
                query: removeImageQuery,
                values: [req.body.aid]
            })

            if (result.error) {
                return res.status(500).json({ error: result.error })
            }
        }
        
        // delete image
        await fs.unlink(req.body.filePath);

        return res.status(200).json({ msg: "complete"});
    }
    catch (error) {
        console.error(`Error deleting file: ${error}`);
        res.status(500).send('Internal Server Error');
    }
}