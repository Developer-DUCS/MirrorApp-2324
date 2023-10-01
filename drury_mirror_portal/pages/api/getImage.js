// getImage.js 
// Created: 9/30/2023
// Purpose: 
//      Create a query to fetch an image from the mongo database
//
//      Will need new method in draftList.js to show thumbnail in draft.
// 
// Modification Log: 
//

import executeQuery from "../../backend/mongodb";

let result = executeQuery("sample query", "sample values");

async function addImage(client, value) {
    try {
        
    }
    catch (error) {
		console.log("error in addImage");
		console.log(error);
		return { error };
    }
}