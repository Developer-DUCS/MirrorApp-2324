//ImageUpload.js
//
// Component Description:
//                      image uploading feature that exists in article writing and article editing
//
//

import { Button, Alert } from "@mui/material";

import DriveFolderUploadIcon from "@mui/icons-material/DriveFolderUpload";
import FileUploadIcon from '@mui/icons-material/FileUpload';

import uploadStyles from "../styles/uploadImage.module.css";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/router";


export default function ImageUpload ({ articleImage }) {

    const [getImageData, setImageData] = useState(null);
	const [getImageType, setImageType] = useState(null);

    const [img, setImg] = useState(null);
	const [previewImg, setPreviewImg] = useState(null);

	const [noSelectedImgError, setNoSelectedImgError] = useState(false);
	const [invalidFileTypeError, setInvalidFileTypeError] = useState(false);
	const [uploadSuccessAlert, setUploadSuccessAlert] = useState(false);
	const [uploadFailedAlert, setUploadFailedAlert] = useState(false);
	const [deleteImageSuccess, setDeleteImageSuccess] = useState(false);

    const router = useRouter();

    useEffect(() => {
		// Make sure the router is ready before
		// getting the query parameters
		if (router.isReady) {
			// Get the articles for the current user from the database
			const getArticleRoute = async () => {

                // get image from server to be displayed if a thumbnail image exists for the article
                if (articleImage) {

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
            getArticleRoute();
		};
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

	const handleRemoveImage = async (path) => {

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

    return(
        <div>
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
        <div className={uploadStyles.removeImageButton}>
            <Button
                sx={{ m: 2 }}
                color="error"
                variant="outlined"
                onClick={() => {
                    // delete image file if image has been uploaded
                    handleRemoveImage(getImageData);

                    // remove all image data from frontend
                    document.getElementById('uploadImage').value = ''
                    setImg(null);
                    setPreviewImg(null);
                    setImageData(null);
                    setImageType(null);
                    setUploadFailedAlert(false);
                    setUploadSuccessAlert(false);
                }}
                >
                Remove Image
            </Button>
        </div>
        :
        null
        }

        </div>
    )
}