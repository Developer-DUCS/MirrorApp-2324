// getImage.js 
// Created: 9/30/2023
// Purpose: 
//      Create a query to fetch an image from the mongo database
//
//      Will need new method in draftList.js to show thumbnail in draft.
// 
// Modification Log: 
//

import db from '../../backend/mongodb'

export default async (req, res) => {
  try {
    const collection = db.collection('images');

    const documents = await collection.find({}).toArray();

    res.status(200).json(documents);
  } catch (error) {
    console.error('Error retrieving documents', error);
    res.status(500).json({ error: 'Error retrieving documents' });
  }
}