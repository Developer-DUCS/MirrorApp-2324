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
		Modal} from "@mui/material";
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
	const [getImageData, setImageData] = useState("");
	const [getImageType, setImageType] = useState("");
	const { status, data } = useSession();

	const [img, setImg] = useState(null);
	const [uploadedImg, setUploadedImg] = useState("");

	const [noSelectedImgError, setNoSelectedImgError] = useState(false);
	const [invalidFileTypeError, setInvalidFileTypeError] = useState(false);
	const [saveWithoutImagePopup, setSaveWithoutImagePopup] = useState(false);
	const [open, setOpen] = useState(false);

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
		router.reload();
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

						// Make sure the response was received before setting the articles
						if (article) {
							setArticle(article);
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
		setUploadedImg(false);
		setInvalidFileTypeError(false);

		const file = e.target.files[0];
		if (file){
			const fileName = file.name;
			const fileExtension = fileName.split('.').pop().toLowerCase();

			if (fileExtension == 'png' || fileExtension == 'jpg' || fileExtension == 'jpeg'){
				const image = await imagebase64(file);
				setImg(image);
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
					<form onSubmit={handleSubmit} id="articleForm">
						<div className={uploadStyles.imageContainer}>
							<form>
								<label htmlFor="uploadImage">
									<div className={uploadStyles.uploadBox}>
										<input type="file" id="uploadImage" onChange={setImage}/>
										{img ? 
											<img src={img} />
											:
											<FileUploadIcon fontSize="large"/>
										}
									</div>
								</label>
							</form>
						</div>
						{uploadedImg ?
							<div className={uploadStyles.uploadButton}>
								<Button
									sx={{ m: 2 }}
									variant="contained"
									color="success"
									startIcon={<CheckIcon />}
									>
									Thumbnail Uploaded
								</Button>
							</div>
						:
							<div className={uploadStyles.uploadButton}>
								<Button
									sx={{ m: 2 }}
									variant={img == null ? "outlined" : "contained"}
									color="error"
									onClick={() => {
										if (img==""){
											setNoSelectedImgError(true);
										}
										else {
											setUploadedImg(img);
										}
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
									document.getElementById('uploadImage').value = ''
									setImg(null);
									setUploadedImg(null);
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
									sx={{ color: "white", marginLeft: 2 }}
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
										color: "white",
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
							type={/* Implementation when backend for image uploading is done
							 img == null ? "button" :  
							 	*/
							 "submit"}
							onClick={() => {
								if (img == null){
									setSaveWithoutImagePopup(true);
								}
							}}
						>
							{buttonText}
						</Button>

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
								width: 400,
								bgcolor: 'background.paper',
								border: '2px solid #000',
								boxShadow: 24,
								p: 4,
							  }}>
							<Typography id="modal-modal-title" variant="h6" component="h2">
							Text in a modal
							</Typography>
							<Typography id="modal-modal-description" sx={{ mt: 2 }}>
							Duis mollis, est non commodo luctus, nisi erat porttitor ligula.
							</Typography>
						</Box>
						</Modal>
						
						{/* {saveWithoutImagePopup ? 
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
										onClick={() => {
											setSaveWithoutImagePopup(false);
											document.getElementById("articleForm").submit();
										}}
									>
										Submit Anyway
									</Button>
								</DialogActions>
							</Dialog>
						:
							null
						} */}
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
