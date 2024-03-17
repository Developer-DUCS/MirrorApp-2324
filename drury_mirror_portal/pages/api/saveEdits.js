// TO DO: implement approve thumbnail image and approve category selection when edits are saved, this will update articles table

import executeQuery from "../../backend/mysqldb";

// removed async
export default async (req, res) => {
	try {
		const body = req.body;

		let articleString = body.article;
		let isDraft = "2";
		const id = body.id;
		let checked = body.checked;
		const page = body.page;

		// update image and image type if needed
		if (body.thumbnailImage != undefined && body.imageType != undefined){
			let newImageQuery = "UPDATE articles SET thumbnailImage = ?, imageType = ? WHERE aid = ?;";

			const result = await executeQuery({
				query: newImageQuery,
				values: [body.thumbnailImage, body.imageType, id]
			})
			if (result.error) {
				console.log("There was an error updating the article thumbnail image.");
				return res.status(500).json({ error: result.error });
			} else {
				console.log(`Successfully updated thumbnail image for article ${id}`);
			}
		}

		// update category selection
		if (body.categories){
			let updateCategoriesQuery = "UPDATE categories set front_page = ?, sports = ?, lifestyle = ?, campus_life = ?, news = ?, editorial = ? WHERE aid = ?;";

			const result = await executeQuery({
				query: updateCategoriesQuery,
				values: [body.categories[0], body.categories[1], body.categories[2], body.categories[3], body.categories[4], body.categories[5], body.categories[6], id]
			})
			if (result.error){
				console.log("There was an error updating the article category selections.");
				return res.status(500).json({ error: result.error });
			} else {
				console.log(`Successfully updated category selections for article ${id}`);
			}
		}

		if (page == "commentViewer" && checked) {
			isDraft = "3";
			let commentsQuery = "DELETE FROM comments WHERE cid = ?";

			const result = await executeQuery({
				query: commentsQuery,
				values: id,
			});
			if (result.error) {
				console.log("There was an error deleting comments");
				return res.status(500).json({ error: result.error });
			} else {
				console.log("Successfully deleted comments");
			}
		} else if (page != "commentViewer") {
			let editor = body.editor;
			let email = body.email;
			const overAllComments = body.overAllComments;
			const comments = body.comments.toString();

			let saveCommentsQuery =
				"INSERT INTO comments (cid, email, editor, overAllComments, comments, createdDate) VALUES(?,?,?,?,?,NOW())";

			const result = await executeQuery({
				query: saveCommentsQuery,
				values: [id, email, editor, overAllComments, comments],
			});
			if (result.error) {
				return res
					.status(500)
					.json({ error: "There was an error saving the comments" });
			} else {
				// res.status(200).json({ msg: "Successful Update" });
				// console.log("Successfully updated the comments");
			}
		}

		let updateArticleQuery =
			"UPDATE articles SET body = ?, isDraft = ? WHERE aid = ?";

		const result = await executeQuery({
			query: updateArticleQuery,
			values: [articleString, isDraft, id],
		});
		if (result.error) {
			return res.status(500).json({ error: "Failed Insertion" });
		} else {
			return res.status(200).json({ msg: "Successful Update" });
		}
	} catch (error) {
		console.log(error);
	}
};
