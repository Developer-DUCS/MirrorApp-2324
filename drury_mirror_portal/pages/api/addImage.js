// addImage.js 
// Created: 9/30/2023
// Purpose: 
//      Create query to store image to the mongo database
//
//      Used in conjunction with the uploadFileHandler method on line 239 of articleWriting.js
// 
// Modification Log: 
//

import executeQuery from "../../backend/mongodb";

let result = executeQuery("sample query", "sample values");

async function getImage(client, value) {
    try {
        
    }
    catch (error) {
		console.log("error in getImage");
		console.log(error);
		return { error };
    }
}