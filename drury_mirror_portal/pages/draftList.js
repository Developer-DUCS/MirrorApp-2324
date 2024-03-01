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
import { useState, useEffect } from "react";

import { Button, Typography, Card, Box, Stack, Modal } from "@mui/material";

import Header from "./header";

export function draftList() {
	const router = useRouter();
	const { status, data } = useSession();
	const [getArticles, setArticles] = useState([]);
	const [getDeleteModal, setDeleteModal] = useState(false);
	const [articleRemoved, setArticleRemoved] = useState(false);

	const parse = require("html-react-parser");

	// Redirect the user to the log in screen
	const redirectToSignIn = (event) => {
		event.preventDefault();
		router.push("/");
	};

	// Handle the write draft button
	const writeDraftRoute = async (event) => {
		event.preventDefault();
		router.push({
			pathname: `${process.env.NEXT_PUBLIC_API_PATH}/articleWriting`,
			query: { id: event.currentTarget.id },
		});
	};

	useEffect(() => {
		// Get the articles for the current user from the database
		const getArticlesRoute = async () => {
			const session = await getSession();
			let endpoint = "api/getArticles";

			// Make sure there is a session before making the API call
			if (session) {
				let data = {
					email: session.user.email,
					page: "draftList",
				};
				let JSONdata = JSON.stringify(data);
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
				} else {
					let articles = await response.json();

					// Make sure the response was recieved before setting the articles
					if (articles) {
						setArticles(articles.reverse());
					}
				}
			}
		};
		setArticleRemoved(false);

		getArticlesRoute();
	}, [articleRemoved]);

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

	// Delete article
	async function removeArticle(article) {
		//Server Delete Call
		let endpoint = "api/removeDraft";

		let data = {
			articleId: article.aid
		}

		let JSONdata = JSON.stringify(data);

		let options = {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSONdata,
		}

		let response = await fetch(endpoint, options);

		if (response.status === 201){
			console.log("draft deleted");
		}
		else if (response.status === 500){
			console.log(`Error removing draft: ${response.error}`);
		}
		else {
			console.log(response.error)
		}
	}

	// Check if you really want to delete article
	function openDeleteModal(){
		setDeleteModal(true)
	}

	// Closes delete modal
	function closeDeleteModal(){
		setDeleteModal(false)
	}

	filterArticles();

	// Check if the user is authenticated
	if (status === "authenticated") {
		const role = data.user.role;

		return (
			<Box>
				<Header />
				<p id="article"></p>
				<Box
					sx={{
						padding: 5,
						paddingLeft: 15,
					}}
				>
					<Typography
						sx={{ m: 1, marginLeft: 0 }}
						variant="copyEditorHeader"
					>
						Drafts
					</Typography>
					<br></br>
					<Typography
						sx={{ m: 1, marginLeft: 0 }}
						variant="userLabel"
					>
						{data.user.fname} {data.user.lname}
					</Typography>
					<br></br>
				</Box>
				<Box
					sx={{
						display: "flex",
						flexDirection: "column",
						minHeight: "100vh",
					}}
				>
					{articles.length != 0 ? (
						<div className={styles.divArticle}>
							<ul>
								{articles.map((article) => (
									<Card
										style={{
											margin: 15,
											marginTop: 30,
											padding: 5,
											paddingLeft: 15,
											boxShadow: 4,
											backgroundColor: "#313131",
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
											onClick={writeDraftRoute}
											color="primaryButton"
											sx={{
												marginBottom: 1,
												marginRight: 5,
												color: "white",
											}}
										>
											Keep Writing
										</Button>
										<Button
											id={article.aid}
											variant="contained"
											onClick={() => {
												openDeleteModal();
												//deleteArticle(article);
												//setArticleRemoved(true);
											}}
											color="primaryButton"
											sx={{
												marginBottom: 1,
												color:"white",
											}}
										>
											Delete
										</Button>
										<Modal
											sx={{
												display: 'flex',
												alignItems: 'center',
												justifyContent: 'center',
											}}
											open={getDeleteModal}
											onClose={closeDeleteModal}
										>
											<Box
												sx={{
													position: 'absolute',
													top: '50%',
													left: '50%',
													transform: 'translate(-50%, -50%)',
													height: "50vh",
													width: "80vh",
													bgcolor: 'background.paper',
													boxShadow: 24,
													borderRadius: 5,
													backgroundColor: 'White',
													p:1,
												}}
											>
												<Box
													sx={{
														position: "absolute",
														top: "30%",
														left: "6%"
													}}
												>
													<Typography
														sx={{
															fontSize: 24
														}}
													>Are you sure you want to delete this draft?</Typography>
													<Button
													sx={{
														mr: 1,
														position: "absolute",
														top: "200%",
														left: "25%"
													}}
														onClick={() => {
															removeArticle(article);
															setArticleRemoved(true);
														}}
														variant="contained"
														color="error"
													>Yes</Button>
													<Button
														onClick={closeDeleteModal}
														variant="outlined"
														color="error"
														sx={{	
															position: "absolute",
															top: "200%",
															left: "55%"
														}}
													>No</Button>
												</Box>
											</Box>
										</Modal>
									</Card>
								))}
							</ul>
						</div>
					) : (
						<Box
							sx={{
								m: 15,
								marginTop: 0,
								padding: 5,
								paddingLeft: 15,
								boxShadow: 4,
							}}
						>
							<Typography>
								You don't have any articles.
							</Typography>
						</Box>
					)}
				</Box>
			</Box>
		);
	} else {
		return (
			<Stack
				display="flex"
				spacing={2}
				justifyContent="center"
				alignItems="center"
				sx={{
					height: "100vh"
				}}
			>
				<Typography variant="h1" color="black">
					Please sign in
				</Typography>
				<Button
					variant="contained"
					color="error"
					onClick={redirectToSignIn}
					sx={{
						height: "10vh",
						width: "20vh"
					}}
				>
					Sign In
				</Button>
			</Stack>
		);
	}
}

export default draftList;
