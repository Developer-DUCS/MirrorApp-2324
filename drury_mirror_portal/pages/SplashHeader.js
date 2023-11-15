import { Button, Grid, Typography } from "@mui/material";

import React from "react";
import { useRouter } from "next/router";
import { signOut } from "next-auth/react";

export default function SplashHeader() {
	const router = useRouter();

	// Handle the About Us button
	const handleAbout = () => {
		router.push(`${process.env.NEXT_PUBLIC_API_PATH}/about`);
	};

	// Sends user back to splash page when clicking mirror logo
	const handleHome = () => {
		router.push(`${process.env.NEXT_PUBLIC_API_PATH}/Dashboard`);
	};

	return (
		<Grid
			container
			sx={{
				height: "10vh",
				marginBottom: 2,
				backgroundColor: "#313131",
				color: "black",
				display: "flex",
				justifyContent: "space-around",
				alignItems: "center",
			}}
		>
			<Grid item xs={1}>
				<Button
					sx={{
						color: "white",
						marginRight: 2,
						fontSize: { lg: "16px", md: "12px", sm: "6px" },
						height: { lg: "40px", md: "30px", sm: "20px" },
						width: { lg: "120px", md: "90px", sm: "60px" },
					}}
					variant="contained"
					color="primaryButton"
					onClick={handleAbout}
				>
					About Us
				</Button>
			</Grid>
			<Grid item xs={7}>
				<Typography
					variant="logoHeader"
					color="white"
					sx={{ display: "flex", justifyContent: "center" }}
					onClick={handleHome}
				>
					Drury Mirror
				</Typography>
			</Grid>
			<Grid item xs={1}>
				<Button
					variant="outlined"
					color="error"
					onClick={() => signOut()}
				>
					Log Out
				</Button>
			</Grid>
		</Grid>
	);
}
