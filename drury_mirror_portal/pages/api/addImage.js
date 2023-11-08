// addImage.js
// Description:
//              API to upload images to the folder path corresponding with the article ID and image type
//              --> implemented for thumbnail images only now
//              --> images will be saved in public/images/*article_id*/*image_type*
// Creation Date:
// 11/1/2023 - Plan: get image object, parse object, save file to specified folder, return path
//
// Modification Log:
// 11/8/2023 - Upload image route working, saves images to public/uploads and returns path to frontend

import { IncomingForm } from 'formidable'
import { promises as fs } from 'fs'
import { floor } from 'mathjs'

export const config ={
    api: {
        bodyParser: false,
    }
}

export default async (req, res) => {
    
    const data = await new Promise((resolve, reject) => {
        const form = new IncomingForm()

        form.parse(req, (err, fields, files) => {
            if(err) return reject(err)
            resolve({ fields, files })
        })
    })

    const contents = await fs.readFile(data?.files?.file[0].filepath, {
        encoding: 'utf8',
    })

    const outputDirectory = './public/images/article_images/thumbnail';
    // find the correct folder based on the article id
    const articleFolder = floor(parseInt(data.fields.articleId[0]) / 10);
    console.log(articleFolder);
    const filename = data.files.file[0].originalFilename;
    
    const outputPath = `${outputDirectory}/${articleFolder}/${filename}`
    //const outputPath = `${outputDirectory}/${filename}`

    fs.writeFile(outputPath, contents)
        .then(() => {
            console.log(`file saved: ${outputPath}`);
            res.status(200).json({filePath: outputPath});
        })
        .catch((err) => {
            res.status(500).json({error: err});
        })
}