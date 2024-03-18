// Editor
//import styles from '../styles/quillTestStyle.css'
import "react-quill/dist/quill.snow.css";
import dynamic from "next/dynamic";
import styles from "../styles/article.module.css";
import uploadStyles from "../styles/uploadImage.module.css";

import { useRouter } from "next/router";

import { 
		Button, Box, Stack, Grid, Typography, Checkbox, Alert, 
		Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions, 
		Modal, TextField, InputLabel, FormControl, Select, MenuItem, FormHelperText} from "@mui/material";

import DriveFolderUploadIcon from "@mui/icons-material/DriveFolderUpload";
import FileUploadIcon from '@mui/icons-material/FileUpload';
import CheckIcon from '@mui/icons-material/Check';

// React, Next, system stuff
import React, { useState, useEffect } from "react";
import { useSession, getSession } from "next-auth/react";

// Components
import Header from "./header";
import ImageUpload from "./ImageUpload";
import CategorySelector from "./CategorySelector";

// we import react-quill dynamically, to avoid including it in server-side
// and we will render a loading state while the dynamic component is being loaded.
const QuillNoSSRWrapper = dynamic(import("react-quill"), {
	ssr: false,
	loading: () => <p>Loading ...</p>,
});

// Modules, options, etc. for the editor
const modules = {
	toolbar: [
		[{ header: "1" }, { header: "2" }, { font: [] }],
		[{ size: [] }],
		["bold", "italic", "underline", "strike", "blockquote"],
		[{ color: [] }, { background: [] }],
		[
			{ list: "ordered" },
			{ list: "bullet" },
			{ indent: "-1" },
			{ indent: "+1" },
		],
		["link", "image", "video"],
		["clean"],
	],
	clipboard: {
		// toggle to add extra line breaks when pasting HTML:
		matchVisual: false,
	},
};

/*
 * Quill editor formats
 * See https://quilljs.com/docs/formats/
 */
const formats = [
	"header",
	"font",
	"size",
	"bold",
	"italic",
	"underline",
	"strike",
	"blockquote",
	"color",
	"background",
	"list",
	"bullet",
	"indent",
	"link",
	"image",
	"video",
];

export default function articleWriting() {
	// Handles the contents of the article editor
	let [value, setValue] = useState();
	const [getArticle, setArticle] = useState([]);
	const [getHeadline, setHeadline] = useState([]);
	const [getImageData, setImageData] = useState(null);
	const [getImageType, setImageType] = useState(null);
	const { status, data } = useSession();

	const [articleImage, setArticleImage] = useState(null);

	const [saveWithoutImagePopup, setSaveWithoutImagePopup] = useState(false);
	const [open, setOpen] = useState(false);
	const [previewTextBody, setPreviewTextBody] = useState("");
	const [previewTextAuthor, setpreviewTextAuthor] = useState("");

	// Categorie States
	const [categories, setCategories] = useState([])

	const [getExpireTime, setExpireTime] = useState(14);

	// Used to set the text on the submit button
	const [buttonText, setButtonText] = useState("Save as Draft");

	const router = useRouter();

	// Redirect the user to the
	const redirectToSignIn = (event) => {
		event.preventDefault();
		router.push(`${process.env.NEXT_PUBLIC_API_PATH}/`);
	};

	// Switch the text on the submit button when the user clicks
	// the checkbox
	const switchReadyForEdits = () => {
		let checkValue = document.getElementById("checkbox").checked;
		if (!checkValue) {
			setButtonText("Save as Draft");
		} else if (checkValue) {
			setButtonText("Submit");
		} else {
		}
	};

	// loads the article into the editor
	useEffect(() => {
		if (getArticle != []) {
			let myArticle = getArticle;
			setValue(myArticle);
		}
	}, [getArticle]);

	const data_from_upload = (data) => {
		setImageData(data.imageData);
		setImageType(data.imageType);
	}

	const data_from_category_selector = (data) => {
		setCategories([data[0], data[1], data[2], data[3], data[4], data[5], data[6]]);
	}

	const handleSubmit = async (event) => {
		
		// Stop the form from submitting and refreshing the page.
		event.preventDefault();

		let session = await getSession();
		let author = session.user.fname + " " + session.user.lname;

		if (router.query.id) {

			const data = {
				email: session.user.email,
				author: author,
				article: value,
				headline: getHeadline,
				check: document.getElementById("checkbox").checked,
				aid: router.query.id,
				imageType: getImageType,
				imageData: getImageData,
				categories: categories,
				expireTime: getExpireTime
			};

			// Send the data to the server in JSON format.
			const JSONdata = JSON.stringify(data);

			// API endpoint where we send form data.
			const endpoint = "api/saveArticle";

			// Form the request for sending data to the server.
			const options = {
				// The method is POST because we are sending data.
				method: "POST",
				// Tell the server we're sending JSON.
				headers: {
					"Content-Type": "application/json",
				},
				// Body of the request is the JSON data we created above.
				body: JSONdata,
			};

			// Send the form data to our forms API on Vercel and get a response.
			const response = await fetch(endpoint, options);

			// Get the response data from server as JSON.
			// If server returns the name submitted, that means the form works.
			const result = await response.json();
		} else {

			const data = {
				email: session.user.email,
				author: author,
				article: value,
				headline: getHeadline,
				check: document.getElementById("checkbox").checked,
				imageData: getImageData,
				imageType: getImageType,
				categories: categories,
				expireTime: getExpireTime
			};

			// Send the data to the server in JSON format.
			const JSONdata = JSON.stringify(data);

			// API endpoint where we send form data.
			const endpoint = "api/saveArticle";

			// Form the request for sending data to the server.
			const options = {
				// The method is POST because we are sending data.
				method: "POST",
				// Tell the server we're sending JSON.
				headers: {
					"Content-Type": "application/json",
				},
				// Body of the request is the JSON data we created above.
				body: JSONdata,
			};

			// Send the form data to our forms API on Vercel and get a response.
			const response = await fetch(endpoint, options);

			// Get the response data from server as JSON.
			// If server returns the name submitted, that means the form works.
			const result = await response.json();
		}

		// reload page upon submit
		router.push('/Dashboard');
	};

	useEffect(() => {
		// Make sure the router is ready before
		// getting the query parameters
		if (router.isReady) {
			// Get the articles for the current user from the database
			const getArticleRoute = async () => {
				const session = await getSession();
				const id = parseInt(router.query.id);

				if (!isNaN(id)) {
					let endpoint = "api/getArticle";

					// Make sure there is a session before making the API call
					if (session) {
						const data = {
							email: session.user.email,
							id: id,
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
						let article = await response.json();

						let articleBody = article.body;
						let articleImage = article.thumbnailImage;
						let articleHeadline = article.headline;

						console.log(article);

						// set the previously saved categories 
						/*setFrontPage(article.categories["Front Page"]);
						setSports(article.categories["Sports"]);
						setLifestyle(article.categories["Lifestyle"]);
						setCampusNews(article.categories["Campus News"]);
						setNews(article.categories["News"]);
						setWeekend(article.categories["Weekend"]);
						setEditorial(article.categories["Editorial"]);*/
						if (article.categories) {
							setCategories([
								article.categories["Front Page"],
								article.categories["Sports"],
								article.categories["Lifestyle"],
								article.categories["Campus News"],
								article.categories["News"],
								article.categories["Weekend"],
								article.categories["Editorial"]
							])
						}

						// Make sure the response was received before setting the article information
						if (article) {
							if (articleBody) {
								setArticle(articleBody);
							}
							if (articleHeadline) {
								setHeadline(articleHeadline);
							}
							if (articleImage) {
								setImageData(articleImage);
							}
						}
					}
				} else {
				}
			};

			getArticleRoute();
		} else {
		}
		// depend on router.isReady
	}, [router.isReady]);

	useEffect(() => {
		setArticleImage(getImageData);
	}, [getImageData])

	function handleDialogClose() {
		setSaveWithoutImagePopup(false);
	}

	function openPreview() {
		const parse = require("html-react-parser");

		let body = parse(JSON.stringify(value));

		setpreviewTextAuthor("By: " + data.user.fname + " " + data.user.lname);
		setPreviewTextBody(body);
		setOpen(true)
	}

	function closePreview() {
		setOpen(false)
	}

	const changeExpireTime = (event) => {
		setExpireTime(event.target.value);
	  };

	if (status === "authenticated") {
		return (
			<Box
				sx={{
					display: "flex",
					flexDirection: "column",
					minHeight: "100vh",
				}}
			>
				<Box
					className={styles.divWriting}
					sx={{
						display: "flex",
						flexDirection: "column",
						minHeight: "100vh",
					}}
				>
					<div>
						<Header />
					</div>

					<div>
						<ImageUpload 
							articleImage = { articleImage }
							setter = {data_from_upload}
						/>
					</div>
					
					<form onSubmit={handleSubmit} id="articleForm">

						<Box
							sx={{
								display: "flex",
								flexDirection: "column",
								width: "30%",
							}}
						>
							<TextField
								sx={{
									input: {
										color: "black",
									},
									label: {
										color: "black",
									},
									backgroundColor: "white",
									m: 2,
									borderRadius: 1,
								}} 
								id="headline"
								name="headline"
								label="Headline"
								variant="outlined"
								value={getHeadline}
								onChange={(e) => {
									setHeadline(e.target.value);
								}}
							/>
						</Box>


						<Box
							sx={{
								backgroundColor: "white",
								margin: 2,
							}}
						>
							<QuillNoSSRWrapper
								id="article"
								modules={modules}
								value={value}
								onChange={setValue}
								formats={formats}
								theme="snow"
							/>
						</Box>
						<br></br>
						<CategorySelector 
							categories = { categories }
							setter = { data_from_category_selector }
						/>
						<br></br>

						<Box sx={{ maxWidth: "25vh", marginLeft: "2vh" }}>
							<FormControl fullWidth>
								<InputLabel variant="standard" htmlFor="uncontrolled-native">
								Expire Time
								</InputLabel>
								<Select
									value={getExpireTime}
									labelId="Expire Time"
									id="expireTime"
									onChange={changeExpireTime}
									>
									<MenuItem value={14}>2 Weeks</MenuItem>
									<MenuItem value={31}>Month</MenuItem>
									<MenuItem value={93}>3 Months</MenuItem>
									<MenuItem value={186}>6 Months</MenuItem>
									<MenuItem value={365}>Year</MenuItem>
								</Select>
								<FormHelperText>Choose how long the article is avalible on the app.</FormHelperText>
							</FormControl>
						</Box>
						
						<br></br>

						<Box sx={{ maxWidth: "25vh", marginLeft: "2vh" }}>
							<FormControl fullWidth>
								<InputLabel variant="standard" htmlFor="uncontrolled-native">
								Expire Time
								</InputLabel>
								<Select
									value={getExpireTime}
									labelId="Expire Time"
									id="expireTime"
									onChange={changeExpireTime}
									>
									<MenuItem value={14}>2 Weeks</MenuItem>
									<MenuItem value={31}>Month</MenuItem>
									<MenuItem value={93}>3 Months</MenuItem>
									<MenuItem value={186}>6 Months</MenuItem>
									<MenuItem value={365}>Year</MenuItem>
								</Select>
								<FormHelperText>Choose how long the article is avalible on the app.</FormHelperText>
							</FormControl>
						</Box>
					
						<br></br>
						<Grid
							container
							sx={{ display: "flex", flexDirection: "row" }}>
							<Grid item>
								<Typography
									sx={{ color: "black", marginLeft: 2 }}>
									{/* Maybe explain better */}
									Ready for Edits
								</Typography>
							</Grid>
							<Grid item>
								<Checkbox
									id="checkbox"
									color="error"
									onChange={switchReadyForEdits}
									sx={{
										color: "black",
										marginTop: -1,
										borderColor: "white",
									}}
								/>
							</Grid>
						</Grid>

						<Button
							sx={{
								m: 2,
							}}
							color="error"
							variant="contained"
							type={
							 getImageData == null ? 
							 "button" 
							:
							 "submit"}
							onClick={() => {
								if (getImageData == null){
									setSaveWithoutImagePopup(true);
								}
							}}
						>
							{buttonText}
						</Button>

						{saveWithoutImagePopup ? 
						<Dialog
							open={saveWithoutImagePopup}
							onClose={handleDialogClose}
							>
							<DialogTitle>
								{"Missing Thumbnail Image"}
							</DialogTitle>
							<DialogContent>
								<DialogContentText>
									Would you like to save without a thumbnail or go back and add one?
								</DialogContentText>
								<DialogContentText>
									A thumbnail can be added later if the article is saved as a draft.
								</DialogContentText>
							</DialogContent>
							<DialogActions>
								<Button
									color="error"
									variant="outlined"
									onClick={handleDialogClose}
								>
									Close
								</Button>
								<Button
									type="submit"
									color="error"
									variant="contained"
									onClick={(e) => {
										setSaveWithoutImagePopup(false);
										console.log("submit clicked");
										handleSubmit(e);
									}}
								>
									Save
								</Button>
							</DialogActions>
						</Dialog>
						:
						null
						}

						<Button
							sx={{
								m: 2,
							}}
							color="error"
							variant="contained"
							onClick={openPreview}
						>
							Preview Article
						</Button>

						<Modal
						open={open}
						onClose={closePreview}
						aria-labelledby="modal-modal-title"
						aria-describedby="modal-modal-description"
						>
							<Box 
								sx={{
									position: 'absolute',
									top: '50%',
									left: '50%',
									transform: 'translate(-50%, -50%)',
									height: 550,
									width: 290,
									bgcolor: 'background.paper',
									boxShadow: 24,
									borderRadius: 5,
									backgroundColor: 'Black',
									p:1,
							}}>
								<Box
									sx={{
										borderRadius: 2.5,
										p:1,
										backgroundColor:'White',
										height: 530,
										width: 270,
										overflow: "scroll",
								}}>
									<Box>
										<Typography 
											id="modal-modal-title"
											variant="h6" 
											component="h2"
										>
											{getHeadline}
										</Typography>
										<Typography>
											{previewTextAuthor}
										</Typography>
										<Typography 
											id="modal-modal-description"
											sx={{
												overflow: "hidden",
												textOverflow: "ellipsis",
											}}
										>
											{previewTextBody}
										</Typography>
									</Box>
								</Box>
							</Box>
						</Modal>
					</form>
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
				<Typography variant="h1" color="black" sx={{fontFamily:"Garamond-Regular", fontWeight: "bold", fontSize: "6rem"}}>
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
