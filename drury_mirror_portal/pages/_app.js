import React from "react";
import { useRouter } from "next/router";
import PropTypes from "prop-types";
import Head from "next/head";
import { ThemeProvider } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import { theme, mainTheme, aboutTheme, editorTheme } from "../styles/theme";
import "../styles/globals.css";

import { SessionProvider } from "next-auth/react";
import { NextUIProvider } from "@nextui-org/react";
import Footer from "./Footer";

// // To show the page is loading
// import NProgress from "nprogress"; //nprogress module
// import "nprogress/nprogress.css"; //styles of nprogress
// //Binding events.
// Router.events.on("routeChangeStart", () => NProgress.start());
// Router.events.on("routeChangeComplete", () => NProgress.done());
// Router.events.on("routeChangeError", () => NProgress.done());

export default function MyApp({ Component, pageProps }) {
	// const { Component, pageProps } = props;
	const router = useRouter();
	console.log(router.pathname);

	let curTheme = theme;

	if (router.pathname == "/testSplashPage") {
		curTheme = theme;
	}

	if (router.pathname == "/about") {
		curTheme = aboutTheme;
	}

	if (router.pathname == "/commentViewer") {
		curTheme = editorTheme;
	}

	if (router.pathname == "/commentEditor") {
		curTheme = editorTheme;
	}

	if (router.pathname == "/articleWriting") {
		curTheme = editorTheme;
	}

	return (
		<React.Fragment>
			<Head>
				<title>Drury Mirror</title>
				<meta
					name="viewport"
					content="minimum-scale=1, initial-scale=1, width=device-width"
				/>
			</Head>
			<ThemeProvider theme={curTheme}>
				<CssBaseline />
				<SessionProvider session={pageProps.session}>
					<NextUIProvider>
						<Component {...pageProps} />
						{/* //<Footer/> */}
					</NextUIProvider>
				</SessionProvider>
			</ThemeProvider>
		</React.Fragment>
	);
}

// MyApp.propTypes = {
//     Component: PropTypes.func.isRequired,
//     pageProps: PropTypes.object.isRequired,
// };
