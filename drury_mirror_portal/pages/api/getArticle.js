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
	let getArticleQuery = "SELECT headline, body, thumbnailImage FROM articles WHERE articles.aid = ?;";

	const articleResult = await executeQuery({
		query: getArticleQuery,
		values: [id],
	});

	let getCategoryQuery = "SELECT front_page AS 'Front Page', sports AS 'Sports', lifestyle AS 'Lifestyle', campus_news AS 'Campus News', news AS 'News', weekend AS 'Weekend', editorial AS 'Editorial' FROM categories WHERE aid = ?"

	const categoryResult = await executeQuery({
		query: getCategoryQuery,
		values: [id],
	})

	if (articleResult.error || categoryResult.error) {
		return res.status(500).json({ error: err });
	} else if (articleResult.length == 0) {
		return res.status(400).json({ msg: "Articles not found" });
	} else {
		// if there is categories associated with the article return both, otherwise return just the article information
		if (categoryResult.length == 1){
			let article = {
				body: articleResult[0].body,
				headline: articleResult[0].headline,
				thumbnailImage: articleResult[0].thumbnailImage,
				categories: categoryResult[0]
			}
			return res.status(200).json(article);
		}
		else{
			let article = {
				body: articleResult[0].body,
				headline: articleResult[0].headline,
				thumbnailImage: articleResult[0].thumbnailImage,
				categories: null,
			}
			return res.status(200).json(article);
		}
	}
};
