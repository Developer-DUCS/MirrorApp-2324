import executeQuery from "../../backend/mysqldb";

// removed async
export default async (req, res) => {
	try {
		const body = req.body;
		console.log(body);
		let check = body.check;
		let articleString = body.article;
		let author = body.author;
		let headline = body.headline;
		let email = body.email;
		let thumbnailImage = body.imageData;
		let imageType = body.imageType;
		let categories = body.categories;

		if (check) {
			check = "1";
		} else {
			check = "0";
		}

		let saveQuery = "";

		if (body.aid) {
			let isDraft = check;
			let aid = parseInt(body.aid);

			// updating the article
			let saveQueryArticle = `UPDATE articles SET headline = ?, body = ?, isDraft = ?, imageType = ?, thumbnailImage = ? WHERE aid = ?; `;

			// updating the categories associated with the article
			let saveQueryCategory = `UPDATE categories SET front_page = ?, sports = ?, lifestyle = ?, campus_news = ?, news = ?, weekend = ?, editorial = ? WHERE categories.aid = ?;`
			
			const articleResult = await executeQuery({
				query: saveQueryArticle,
				values: [headline, articleString, isDraft, imageType, thumbnailImage, aid],
			});

			const categoryResult = await executeQuery({
				query: saveQueryCategory,
				values: [categories[0], categories[1], categories[2], categories[3], categories[4], categories[5], categories[6], aid],
			});

			console.log("🚀 ~ file: saveArticle.js:52 ~ result:");
			console.log("article query info: ", articleResult.info);
			console.log("category query info: ", categoryResult.info);

			if (articleResult.error || categoryResult.error) {
				console.log("There was an error saving the article");
				res.status(500).json({ error: "Unsuccessful Insertion" });
			} else if (articleResult.affectedRows == 1 && categoryResult.affectedRows == 1) {
				console.log("Successfully saved the article");
				res.status(201).json({ msg: "Successful Insertion" });
			}
		} else {
			// inserting the article information
			let articleQuery =
				`INSERT INTO articles(email, author, headline, body, isDraft, imageType, thumbnailImage, createdDate, isRemoved) 
				VALUES(?,?,?,?,?,?,?, NOW(), 0);`;

			// inserting the category information associated with the article
			let categoryQuery = 
				`INSERT INTO categories(front_page, sports, lifestyle, campus_news, news, weekend, editorial, aid) VALUES(?, ?, ?, ?, ?, ?, ?, ?)`
			
			const articleResult = await executeQuery({
				query: articleQuery,
				values: [email, author, headline, articleString, check, imageType, thumbnailImage],
			});

			// get the aid from the inserted article
			const new_article = await executeQuery({
				query: "SELECT aid FROM articles ORDER BY aid DESC LIMIT 1",
			});

			const categoryResult = await executeQuery({
				query: categoryQuery,
				values: [categories[0], categories[1], categories[2], categories[3], categories[4], categories[5], categories[6], new_article[0].aid],
			});

			if (articleResult.error || categoryResult.error) {
				res.status(500).json({ error: "Unsuccessful Insertion" });
			} else if (articleResult.affectedRows == 1 && categoryResult.affectedRows == 1) {

				console.log("🚀 ~ file: saveArticle.js:52 ~ result:");
				console.log("article inserted with id: ", articleResult.insertId);
				console.log("category values inserted with id: ", categoryResult.insertId);

				res.status(201).json({ msg: "Successful Insertion" });
			}
		}
	} catch (error) {
		console.log(error);
	}
};
