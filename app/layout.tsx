import type { Metadata } from "next";
import "./globals.css";

import Navbar from "@/components/elements/navbar";

export const metadata: Metadata = {
	title: "Lumotools - Free File Converters and Online Tools",
	description: "Convert images, files, audio, and more with free online tools and file converters.",
	metadataBase: new URL("https://lumotools.com"),
	alternates: {
		canonical: "/",
	},
	openGraph: {
		title: "Lumotools - Free File Converters and Online Tools",
		description: "Convert images, files, audio, and more with free online tools and file converters.",
		url: "https://lumotools.com",
		siteName: "Lumotools",
		type: "website",
	}
};

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<html lang="en" className="">
			<head>
				<script defer data-domain="lumotools.com" src="https://plausible.io/js/script.js" />
				<link rel="icon" href="/favicon.svg" type="image/svg+xml" />
			</head>
			<body className="pt-14">
				<Navbar />
				<main className="flex flex-row p-10 pt-14 max-sm:p-5 max-sm:pt-12 w-full justify-center">
					<div className="flex flex-col items-center w-full ">{children}</div>
				</main>
				<footer className="flex flex-col items-center w-full pb-5 px-10 max-sm:px-5">
					<p className="text-sm text-zinc-500 w-full max-w-5xl">
						© {new Date().getFullYear()} Framestack LLC
					</p>
				</footer>
			</body>
		</html>
	);
}
