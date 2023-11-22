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

		if (check) {
			check = "1";
		} else {
			check = "0";
		}

		let saveQuery = "";

		if (body.aid) {
			let isDraft = check;
			let aid = parseInt(body.aid);
			saveQuery =
				"UPDATE articles SET headline = ?, body = ?, isDraft = ?, imageType = ?, thumbnailImage = ? WHERE aid = ?";

			const result = await executeQuery({
				query: saveQuery,
				values: [headline, articleString, isDraft, imageType, thumbnailImage, aid],
			});
			console.log("🚀 ~ file: saveArticle.js:52 ~ result:", result);
			if (result.error) {
				console.log("There was an error saving the article");
				res.status(500).json({ error: "Unsuccessful Insertion" });
			} else if (result.affectedRows == 1) {
				console.log("Successfully saved the article");
				res.status(201).json({ msg: "Successful Insertion" });
			}
		} else {
			saveQuery =
				"INSERT INTO articles(email,author, headline, body, isDraft, imageType, thumbnailImage, createdDate) VALUES(?,?,?,?,?,?,?, NOW())";

			const result = await executeQuery({
				query: saveQuery,
				values: [
					email,
					author,
					headline,
					articleString,
					check,
					imageType,
					thumbnailImage,
				],
			});

			if (result.error) {
				res.status(500).json({ error: "Unsuccessful Insertion" });
			} else if (result.affectedRows == 1) {
				res.status(201).json({ msg: "Successful Insertion" });
			}
		}
	} catch (error) {
		console.log(error);
	}
};
