// getImage.js
// Page Description:
//                  This will exist in the article writing page, when a writer revisits an article they saved as draft, 
//                  or in the editing phase so that the article's thumbnail image can be displayed. Send a request containing the
//                  thumbnail path and the route will return a file object so that the front end can display the image.
//                  
//Creation Date:
//                  By: Charlie Roder, 11/12/2023
//
//Modificaiton Log:
//
//

import { promises as fs } from 'fs'

export default async (req, res) => {
    try {
        console.log(req.body.filePath);
        const data = await fs.readFile(req.body.filePath);
        console.log(data);
        res.status(200).send(data);
    }
    catch (error) {
        console.error(`Error retrieving file: ${error}`);
        res.status(500).send('Internal Server Error');
    }
}