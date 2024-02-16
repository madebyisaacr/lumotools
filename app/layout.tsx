import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

import { cn } from "@/lib/utils";
import Navbar from "@/components/elements/navbar";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
	title: "Lumotools",
	description: "Free, simple file converters and online utilities. Lumotools helps you convert images, files, and more.",
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
			</head>
			<body className={cn(inter.className, "pt-14")}>
				<Navbar />
				<main className="flex flex-row p-10 pt-14 w-full justify-center">
					<div className="flex flex-col items-center w-full max-w-5xl">{children}</div>
				</main>
			</body>
		</html>
	);
}
