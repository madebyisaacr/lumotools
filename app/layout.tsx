import type { Metadata } from "next";
import Link from "next/link";
import { Inter } from "next/font/google";
import "./globals.css";

import { cn } from "@/lib/utils"
import { buttonVariants } from "@/components/ui/button"

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
		<html lang="en" className="dark">
			<body className={inter.className}>
				<header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
					<div className="container flex h-14 max-w-screen-2xl items-center">
						<nav className="flex items-center">
							<Link
								href="/"
							>
								<div
									className={cn(
										buttonVariants({
											variant: "ghost",
										}),
										"w-9 px-0")
									}
								>
									<span>Lumotools</span>
								</div>
							</Link>
						</nav>
					</div>
				</header>
				<main className="flex flex-col items-center p-8">
					{children}
				</main>
			</body>
		</html>
	);
}
