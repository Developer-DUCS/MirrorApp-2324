// addImage.js
// Description:
//              API to upload images to the folder path corresponding with the article ID and image type
//              --> implemented for thumbnail images only now
//              --> images will be saved in public/images/article_images/thumbnail/*article_folder*
//                      - the article_folder is decided by floor(articleId / 10), so articles 1-9 will land in /0, articles 10-19 will land in /1 and so on
// Creation Date:
// 11/1/2023 - Plan: get image object, parse object, save file to specified folder, return path
//
// Modification Log:
// 11/8/2023 - Upload image route working, saves images to public/article_images/thumbnail and returns path to frontend

import { IncomingForm } from 'formidable'
import { promises as fs } from 'fs'
import { floor } from 'mathjs'

export const config = {
    api: {
        bodyParser: false,
    }
}

export default async (req, res) => {
    
    // parse the incoming data and returns articleId in fields and a file object in files
    const data = await new Promise((resolve, reject) => {
        const form = new IncomingForm()

        form.parse(req, (err, fields, files) => {
            if(err) return reject(err)
            resolve({ fields, files })
        })
    })

    // returns the image data as a string so that it can be saved
    let contents = await fs.readFile(data?.files?.file[0].filepath);

    // directory for article thumbnail images
    const outputDirectory = './public/images/article_images/thumbnail';

    // find the correct folder based on the article id
    const articleFolder = parseInt(data.fields.userId[0]);

    const filename = data.files.file[0].originalFilename;
    
    // include numbered folder in the path image will be saved to
    const outputPath = `${outputDirectory}/${articleFolder}/${filename}`

    // save the image to the given path
    fs.writeFile(outputPath, contents)
        .then(() => {
            console.log(`file saved: ${outputPath}`);
            res.status(200).json({filePath: outputPath, });
        })
        .catch((err) => {
            res.status(500).json({error: err});
        })
}