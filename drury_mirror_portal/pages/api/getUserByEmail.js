import executeQuery from "../../backend/mysqldb";
const conn = require("../../backend/mysqldb");

export default async (req, res) => {
	const body = req.body;

	let getQuery =
		`SELECT uid FROM users WHERE email = '${req.body.email}'`;

	const result = await executeQuery({
		query: getQuery,
	});

	if (result.error) {
		return res.status(500).json({ error: result.error });
	} else if (result.length == 0) {
		return res.status(400).json({ msg: "User not found" });
	} else {
		return res.status(200).json(result[0]);
	}
};