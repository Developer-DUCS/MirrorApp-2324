import styles from "../styles/Home.module.css";
import { useRouter } from "next/router";
import { TextField, Button, FormGroup, Grid, Typography } from "@mui/material";

import { signIn } from "next-auth/react";
import { useState } from "react";

export default function LoginPage() {
	const router = useRouter();
	const [isError, setIsError] = useState(null);

	
	let basePathValue = null
	const mode = process.env.MY_ENVIROMENT;

	const handleSubmit = async (event) => {
		event.preventDefault();

		if (mode == "production") {
			basePathValue = "/mirror";
		}

		const res = await signIn("credentials", {
			redirect: false,
			email: event.target.username.value,
			password: event.target.password.value,
			callbackUrl: `/${process.env.NEXT_PUBLIC_API_PATH}/Dashboard`,

			basePath: basePathValue,
		});

		try {
			if (res.ok) {
				setIsError(false);
				router.push(res.url);
			} else {
				setIsError(true);
			}
		} catch (e) {}
	};

	const handleReset = async (event) => {
		event.preventDefault();
		router.push(`${process.env.NEXT_PUBLIC_API_PATH}/forgotPassword`);
	};

	return (
		<>
			<div className={styles.formContainer}>
				<form onSubmit={handleSubmit} className={styles.formItem}>
					<FormGroup className={styles.formItem}>
						<Grid
							container
							direction={"column"}
							spacing={2}
							justifyContent="center"
							alignItems="center"
							className={styles.formContainer}
						>
							<Grid item>
								<Typography variant="logo">
									Drury Mirror
								</Typography>
							</Grid>
							<Grid item>
								<TextField
									sx={{
										input: {
											color: "black",
										},
										label: {
											color: "black",
										},
									}}
									id="username"
									name="username"
									label="Username"
									variant="standard"
								/>
							</Grid>
							<Grid item>
								<TextField
									sx={{
										input: {
											color: "black",
										},
										label: {
											color: "black",
										},
									}}
									type="password"
									id="password"
									label="Password"
									variant="standard"
								/>
							</Grid>
							<Grid item>
								<Button
									color="contrast"
									sx={{ color: "black" }}
									type="submit"
									variant="outline"
								>
									Log in
								</Button>
							</Grid>
							{isError === true && (
								<Typography
									variant="h6"
									sx={{
										margin: 1,
										marginTop: 1,
										color: "red",
									}}
								>
									Incorrect Username or Password
								</Typography>
							)}
							<Grid item>
								<Button
									sx={{ marginTop: 2, alignSelf: "center" }}
									variant="contained"
									size="small"
									color="error"
									type="button"
									onClick={handleReset}
								>
									Forgot Password?
								</Button>
							</Grid>
						</Grid>
					</FormGroup>
				</form>
			</div>
		</>
	);
}
