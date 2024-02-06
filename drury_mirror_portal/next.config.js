/** @type {import('next').NextConfig} */
const nextConfig = {
	reactStrictMode: false,
	swcMinify: true,
	basePath: "/mirror",
	assetPrefix: "https://mcs.drury.edu/mirror/",
	images: {
		loader: "akamai",
		path: "",
	  },
};

module.exports = nextConfig;
