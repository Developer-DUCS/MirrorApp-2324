// NOT CREATED BY THOMAS NIELD

// writerPortal.js
// Page Description:
//                  The home page for the writer
//Creation Date:
//                  By: Thomas Nield, Daniel Brinck, Samuel Rudqvist  Oct. 4 2022
//
//Modificaiton Log:
//
//
import styles from "../styles/article.module.css";
import { useRouter } from "next/router";
import { useSession, signOut, getSession } from "next-auth/react";
import { useState, useEffect, useMemo } from "react";
import { Dropdown } from "@nextui-org/react";
import {
	Button,
	Container,
	TextField,
	Box,
	Typography,
	Stack,
	Card,
} from "@mui/material";

import Header from "./header";

export function draftList() {
	const router = useRouter();
	const { status, data } = useSession();
	const [getArticles, setArticles] = useState([]);

	// Keep track of the dropdown state
	const [selected, setSelected] = useState(new Set(["unpublished"]));

	const selectedValue = useMemo(
		() => Array.from(selected).join(", ").replaceAll("_", " "),
		[selected]
	);

	const parse = require("html-react-parser");

	// Redirect the user to the log in screen
	const redirectToSignIn = (event) => {
		event.preventDefault();
		router.push("/");
	};

	// Handle the write draft button
	const writeDraftRoute = async (event) => {
		event.preventDefault();
		console.log("article id: ", event.currentTarget.id);
		router.push({
			pathname: "articleWriting",
			query: { id: event.currentTarget.id },
		});
	};

	const publishArticle = async (event) => {
		event.preventDefault();
		console.log("article id: ", event.currentTarget.id);
		let endpoint = "/api/publishArticle";
		let data = {
			id: event.currentTarget.id,
		};
		let JSONdata = JSON.stringify(data);
		console.log("JSONdata", JSONdata);
		let options = {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
			},
			// Body of the request is the JSON data we created above.
			body: JSONdata,
		};

		let response = await fetch(endpoint, options);

		//reload page upon click of button
		router.reload();
	};

	useEffect(() => {
		// Get the articles for the current user from the database
		getArticlesRoute();
	}, [selected]);

	const getArticlesRoute = async () => {
		const session = await getSession();
		let endpoint = "/api/getArticles";

		// Make sure there is a session before making the API call
		if (session) {
			let data = {
				email: session.user.email,
				page: "publishPage",
				articleType: selectedValue,
			};
			let JSONdata = JSON.stringify(data);
			console.log("JSONdata", JSONdata);
			let options = {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				// Body of the request is the JSON data we created above.
				body: JSONdata,
			};

			let response = await fetch(endpoint, options);
			if (response.status !== 200) {
				console.log(response.status);
				console.log(response.statusText);
			} else {
				let articles = await response.json();

				// Make sure the response was received before setting the articles
				if (articles) {
					setArticles(articles.reverse());
				}
			}
		}
	};

	// Populate the articles array to display the articles on the page
	let articles = [];
	function filterArticles() {
		// if not default value (meaning it has data)
		if (getArticles != []) {
			getArticles.forEach(checkArticle);
		}
	}

	// Check if the article exists
	function checkArticle(article) {
		if (article) {
			articles.push(article);
		}
	}

	filterArticles();
	console.log("aritcle 1:", articles[0]);

	// Check if the user is authenticated
	const allowedRoles = ["Editor-In-Chief"];

	if (status === "authenticated" && allowedRoles.includes(data.user.role)) {
		console.log(data.user);
		console.log(data.user.role);
		const role = data.user.role;

		return (
			<>
				<Header />

				<Typography variant="copyEditorHeader" sx={{ m: 2 }}>
					Publish Articles
				</Typography>
				<br></br>
				<Typography sx={{ m: 2 }} variant="userLabel">
					{data.user.fname} {data.user.lname}
				</Typography>

				<Dropdown>
					<Dropdown.Button
						flat
						color="primary"
						css={{ tt: "capitalize" }}
					>
						{selectedValue}
					</Dropdown.Button>
					<Dropdown.Menu
						aria-label="Single selection actions"
						color="primary"
						disallowEmptySelection
						selectionMode="single"
						selectedKeys={selected}
						// onSelectionChange={setSelected}
						onSelectionChange={setSelected}
					>
						<Dropdown.Item key="unpublished">
							Unpublished
						</Dropdown.Item>
						<Dropdown.Item key="published">Published</Dropdown.Item>
					</Dropdown.Menu>
				</Dropdown>
				<Box sx={{ marginTop: -2 }}>
					{getArticles.map((article) => (
						<Card
							style={{
								margin: 15,
								marginTop: 30,
								padding: 5,
								paddingLeft: 15,
								boxShadow: 4,
								backgroundColor: "#82858f",
							}}
						>
							<Typography
								variant="headline"
								sx={{ color: "#F3f3f3" }}
							>
								{article.headline}
							</Typography>
							<br></br>
							<Typography
								variant="author"
								sx={{ color: "#F3f3f3" }}
							>
								{article.author}
							</Typography>
							<Typography
								variant="copyEditorBody"
								sx={{
									color: "#F3f3f3",
									overflow: "hidden",
									textOverflow: "ellipsis",
									display: "-webkit-box",
									WebkitLineClamp: "2",
								}}
							>
								{parse(article.body)}
							</Typography>
							<Button
								id={article.aid}
								variant="contained"
								onClick={publishArticle}
								sx={{
									marginBottom: 1,
									marginRight: 5,
									color: "white",
									backgroundColor: "#4685F5",
								}}
							>
								Publish Article
							</Button>
						</Card>
					))}
				</Box>
			</>
		);
	} else {
		return (
			<Stack
				display="flex"
				spacing={2}
				justifyContent="center"
				alignItems="center"
			>
				<Typography variant="h2" color="black">
					Please sign in
				</Typography>
				<Button
					variant="contained"
					color="error"
					onClick={redirectToSignIn}
				>
					Sign In
				</Button>
			</Stack>
		);
	}
}

export default draftList;
