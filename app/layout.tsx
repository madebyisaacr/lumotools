import type { Metadata } from "next";
import Link from "next/link";
import { Inter } from "next/font/google";
import "./globals.css";

import { cn } from "@/lib/utils";
import { buttonVariants } from "@/components/ui/button";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
	title: "Lumotools",
	description: "Lumotools",
};

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<html lang="en" className="">
			<body className={inter.className}>
				<header className="sticky top-0 z-50 w-full border-b border-zinc-100 bg-zinc-50">
					<div className="px-4 flex h-14 max-w-screen-2xl items-center">
						<nav className="flex items-center">
							<Link href="/">
								<div
									className={cn(
										buttonVariants({
											variant: "ghost",
										}),
										// "px-0"
									)}
								>
									<span>Lumotools</span>
								</div>
							</Link>
						</nav>
					</div>
				</header>
				<main className="flex flex-row p-10 w-full justify-center">
					<div className="flex flex-col items-center w-full max-w-5xl">
						{children}
					</div>
				</main>
			</body>
		</html>
	);
}
