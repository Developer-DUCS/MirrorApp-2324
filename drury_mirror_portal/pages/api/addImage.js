// addImage.js 
// Created: 9/30/2023
// Purpose: 
//      Create query to store image to the mongo database
//
//      Used in conjunction with the uploadFileHandler method on line 239 of articleWriting.js
// 
// Modification Log: 
//

import { GridFSBucket } from 'mongodb';
import { db } from '../../backend/mongodb';

export default async (req, res) => {
  try {
    const collection = db.connection('images')

    
  }
  catch {

  }

  if (req.method === 'POST') {
    const bucket = new GridFSBucket(db);

    const uploadStream = bucket.openUploadStream(req.file.originalname)
    req.pipe(uploadStream);

    uploadStream.on('finish', () => {
      console.log("file uploaded successfully");
      res.status(200).json({ message: 'File uploaded'});
    });
  }
  else {
    res.status(405).json({message: 'Method not allowed'});
  }
}