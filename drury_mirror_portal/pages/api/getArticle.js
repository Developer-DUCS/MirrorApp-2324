// getArticle.js
// Page Description:
//                  Landing page for the copy editor after they log in to the site
//Creation Date:
//                  By: Thomas Nield, Daniel Brinck, Samuel Rudqvist  Oct. 26 2022
//
//Modificaiton Log:
//
//

import executeQuery from "../../backend/mysqldb";

// connection requirement
const conn = require("../../backend/mysqldb");

// api route for getting a single article
export default async (req, res) => {
	let id = req.body.id;
	let email = req.body.email;
	console.log("id", id);
	console.log(email);
	let getArticleQuery = "SELECT headline, body, thumbnailImage, front_page, sports, lifestyle, campus_news, news, weekend, editorial FROM articles JOIN categories ON categories.aid WHERE articles.aid = ?;";

	const result = await executeQuery({
		query: getArticleQuery,
		values: [id],
	});

	if (result.error) {
		return res.status(500).json({ error: err });
	} else if (result.length == 0) {
		return res.status(400).json({ msg: "Articles not found" });
	} else {
		// convert categories to an array and reformat the article object
		let article = {
			body: result[0].body,
			headline: result[0].headline,
			thumbnailImage: result[0].thumbnailImage,
			categories: {
				front_page: result[0].front_page, 
				sports: result[0].sports, 
				lifestyle: result[0].lifestyle, 
				campus_news: result[0].campus_news, 
				news: result[0].news, 
				weekend: result[0].weekend, 
				editorial: result[0].editorial
			},
		}
		return res.status(200).json(article);
	}
};
