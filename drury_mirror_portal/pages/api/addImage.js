// addImage.js
// Description:
//              API to upload images to the folder path corresponding with the article ID and image type
//              --> implemented for thumbnail images only now
//              --> images will be saved in public/images/*article_id*/*image_type*
// Creation Date:
//
// Modification Log:
//

import { IncomingForm } from 'formidable'
import { promises as fs } from 'fs'

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

    const outputDirectory = './public/uploads';
    const articleFolder = data.fields.articleId[0];
    const filename = data.files.file[0].originalFilename;
    
    //const outputPath = `${outputDirectory}/${articleFolder}/${filename}`
    const outputPath = `${outputDirectory}/${filename}`

    fs.writeFile(outputPath, contents)
        .then(() => {
            console.log(`file saved: ${outputPath}`);
            res.status(200).json({filePath: outputPath});
        })
        .catch((err) => {
            res.status(500).json({error: err});
        })
}