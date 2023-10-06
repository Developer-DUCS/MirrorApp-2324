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

//front end implementation
// TO DO: add aid to req body and search based on that

/* const fetchDocuments = async () => {
  return await fetch('/api/getImage')
    .then((response) => {
      if (response.ok) {
        return response.json();
      }
      else {
        throw new Error('Error fetching documents');
      }
    });
} */

/* onClick={() => {
  console.log('clicked');
  fetchDocuments()
    .then((data) => {
      const images = data;
      console.log(images);
    })
}} */