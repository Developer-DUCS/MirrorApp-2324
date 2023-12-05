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
		Modal, TextField} from "@mui/material";

import DriveFolderUploadIcon from "@mui/icons-material/DriveFolderUpload";
import FileUploadIcon from '@mui/icons-material/FileUpload';
import CheckIcon from '@mui/icons-material/Check';

// React, Next, system stuff
import React, { useState, useEffect } from "react";
import { useSession, getSession } from "next-auth/react";

// Components
import Header from "./header";

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

	const [img, setImg] = useState(null);
	const [previewImg, setPreviewImg] = useState(null);

	const [noSelectedImgError, setNoSelectedImgError] = useState(false);
	const [invalidFileTypeError, setInvalidFileTypeError] = useState(false);
	const [uploadSuccessAlert, setUploadSuccessAlert] = useState(false);
	const [uploadFailedAlert, setUploadFailedAlert] = useState(false);
	const [deleteImageSuccess, setDeleteImageSuccess] = useState(false);
	const [saveWithoutImagePopup, setSaveWithoutImagePopup] = useState(false);
	const [open, setOpen] = useState(false);
	const [previewTextBody, setPreviewTextBody] = useState("");
	const [previewTextAuthor, setpreviewTextAuthor] = useState("");

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

						// Make sure the response was received before setting the article information
						if (article) {
							if (articleBody) {
								setArticle(articleBody);
							}
							if (articleHeadline) {
								setHeadline(articleHeadline);
							}
						}

						// get image from server to be displayed if a thumbnail image exists for the article
						if (article && articleImage) {

							let endpoint = "api/getImage";

							const imageData = {
								filePath: articleImage,
							};

							let JSONdata = JSON.stringify(imageData);
							let options = {
								method: "POST",
								headers: {
									"Content-Type": "application/json",
								},
								body: JSONdata
							};

							try {
								let response = await fetch(endpoint, options);

								if (response.ok){
									const blob = await response.blob();
									setPreviewImg(URL.createObjectURL(blob));
									// set other UI conditions for uploaded image
									setImg(URL.createObjectURL(blob));
									setImageData(articleImage);
								}
								else {
									// TO DO: error alert for image not found or image failed to load
									console.error('Error fetching image');
								}
							} catch (error) {
								console.error('Failed to fetch image or set image data:', error);
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

	const handleUpload = async (image) => {

		if (!img) return

		// first get user id by the session email value to know image destination
		let session = await getSession();

		// set email data
		const emailData = {
			email: session.user.email,
		}
		// specify route and data being sent to the route
		const JSONdata = JSON.stringify(emailData);
		const endpoint = 'api/getUserByEmail';
		const options = {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSONdata,
		};

		// handle response and set userId to be passed into the image upload portion
		const response = await fetch(endpoint, options);
		const result = await response.json()

		const userId = result.uid;
		
		// upload image call with image data and user id
		try {
			const data = new FormData();
			data.set('file', image);
			data.set('userId', userId);

			const res = await fetch('/api/addImage', {
				method: "POST",
				body: data,
			});
			
			if (res.ok){
				const result = await res.json();
				setImageData(result.filePath);
				setUploadSuccessAlert(true);
				return;
			}
			else {
				console.log(`error ${res.json()}`);
				setUploadFailedAlert(true);
			}

		} catch (err) {
			console.log(`failed upload: ${err}`);
			setImageData(null);
			setImg(null);
			setPreviewImg(null)
		}
	}

	const handleClearSelection = async (path) => {

		// no image path exists
		if (!path) return

		const fileData = {
			aid: parseInt(router.query.id),
			filePath: path,
		}

		const JSONdata = JSON.stringify(fileData);
		const endpoint = 'api/deleteImage';
		const options = {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSONdata,
		}

		const response = await fetch(endpoint, options);

		if (response.ok) {
			const msg = await response.json()
			setDeleteImageSuccess(true);
		}
		else if (result.status == 500) {
			console.log("image deletion failed");
		}
	}

	// Image Processing functions
	const imagebase64 = (file) => {
		const reader = new FileReader();
		reader.readAsDataURL(file);
			const data = new Promise((resolve,reject) => {
				reader.onload = () => resolve(reader.result)
				reader.onerror = (error) => reject(error)
			})
			return data;
	}

	const setImage = async (e) => {
		// reset alerts
		setNoSelectedImgError(false);
		setInvalidFileTypeError(false);

		const file = e.target.files[0];
		if (file){
			const fileName = file.name;
			const fileExtension = fileName.split('.').pop().toLowerCase();

			if (fileExtension == 'png' || fileExtension == 'jpg' || fileExtension == 'jpeg'){
				setImageType(fileExtension);
				setImg(file);

				const preview = await imagebase64(file);
				setPreviewImg(preview);
			}
			else{
				setInvalidFileTypeError(true);
			}
		}
	}

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

					{noSelectedImgError ?
						<div>
							<Alert severity="error">Oops. You did not select an image.</Alert>
							<br></br>
						</div>
					:
						null
					}
					{invalidFileTypeError ?
						<div>
							<Alert severity="error">This is not a valid image file. Try .png, .jpg, or .jpeg files. </Alert>
							<br></br>
						</div>
					:
						null
					}

					{uploadSuccessAlert ?
						<div>
							<Alert 
							action={
								<Button color="inherit" size="small"
								onClick={() => {
									setUploadSuccessAlert(false);
								}}
								>
									Close
								</Button>
							}
							>
								Thumbnail image successfully uploaded
							</Alert>
							<br></br>
						</div>
					:
						null
					}

					{uploadFailedAlert ?
					<div>
						<Alert 
						severity="error"
						action={
							<Button color="inherit" size="small"
							onClick={() => {
								setUploadFailedAlert(false);
							}}
							>
								Close
							</Button>
						}
						>
							Thumbnail image failed to uploaded
						</Alert>
						<br></br>
					</div>
					:
					null
					}

					{deleteImageSuccess ?
					<div>
						<Alert 
						action={
							<Button color="inherit" size="small"
							onClick={() => {
								setDeleteImageSuccess(false);
							}}
							>
								Close
							</Button>
						}
						>
							Thumbnail image successfully deleted
						</Alert>
						<br></br>
					</div>
					:
					null
					}
					
					<form onSubmit={handleSubmit} id="articleForm">
						<div className={uploadStyles.imageContainer}>
							<label htmlFor="uploadImage">
								<div className={uploadStyles.uploadBox}>
									<input type="file" id="uploadImage" name="theFiles" onChange={setImage} accept="image/*"/>
									{previewImg ?
										<img src={previewImg} />
										:
										<FileUploadIcon fontSize="large"/>
									}
								</div>
							</label>
						</div>
						{getImageData ?
						null
						:
						<div className={uploadStyles.uploadButton}>
							<Button
								sx={{ m: 2 }}
								variant={img == null ? "outlined" : "contained"}
								color="error"
								onClick={() => {
									handleUpload(img);
								}}
								startIcon={<DriveFolderUploadIcon />}
								>
								Upload Thumbnail
							</Button>
						</div>
						}
						{img ?
						<div className={uploadStyles.clearButton}>
							<Button
								sx={{ m: 2 }}
								color="error"
								variant="outlined"
								onClick={() => {
									// delete image file if image has been uploaded
									// TODO: create a route for deleting image from article_images folder
									handleClearSelection(getImageData);

									// clear all image data from frontend
									document.getElementById('uploadImage').value = ''
									setImg(null);
									setPreviewImg(null);
									setImageData(null);
									setImageType(null);
									setUploadFailedAlert(false);
									setUploadSuccessAlert(false);
								}}
								>
								Clear Selection
							</Button>
						</div>
						:
						null
						}
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
						<br></br>
						<Grid
							container
							sx={{ display: "flex", flexDirection: "row" }}
						>
							<Grid item>
								<Typography
									sx={{ color: "black", marginLeft: 2 }}
								>
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
										marginLeft: 1,
										borderColor: "white",
									}}
								/>
							</Grid>
						</Grid>
						{/* <input id="checkbox" type="checkbox"></input> */}

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
										<img src={previewImg} />
									</Box>
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
