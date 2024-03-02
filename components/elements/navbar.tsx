"use client";

import Link from "next/link";

import React from "react";
import { fileTypes, fileConverters, fileCategories } from "@/lib/file-types";
import { cn } from "@/lib/utils";
import { buttonVariants } from "@/components/ui/button";
import { ChevronDown } from "lucide-react";

import { Menubar, MenubarContent, MenubarItem, MenubarMenu, MenubarTrigger } from "@/components/ui/menubar";

export default function Navbar() {
	const convertersByType = {};
	for (const converter of fileConverters) {
		convertersByType[converter.types[0]] = convertersByType[converter.types[0]] || [];
		convertersByType[converter.types[0]].push(converter);
	}

	return (
		<header className="fixed top-0 left-0 right-0 flex justify-center z-50 bg-zinc-100 border-b border-zinc-200">
			<div className="w-full px-6 flex justify-between h-14 max-w-screen-2xl items-center">
				<nav className="flex items-center max-sm:w-full">
					<Link href="/" className="w-full flex flex-row justify-center items-center">
						<div
							className={cn(
								buttonVariants({
									variant: "ghost",
								})
							)}
						>
							<svg width="24" height="24" viewBox="0 3 24 20" fill="none" xmlns="http://www.w3.org/2000/svg" className="mr-2">
								<path
									d="M0 11.2426C0 10.447 0.316071 9.68393 0.87868 9.12132L5.58579 4.41421C6.36684 3.63316 7.63316 3.63317 8.41421 4.41421L14 10V22H3C1.34315 22 0 20.6569 0 19V11.2426Z"
									fill="black"
								/>
								<path
									fillRule="evenodd"
									clipRule="evenodd"
									d="M18.4142 4.4142L22 8.00002L14.8284 8.00002L13.4142 6.58581L15.5858 4.41423C16.3668 3.63318 17.6331 3.63315 18.4142 4.4142Z"
									fill="black"
								/>
								<path d="M16 10H22C23.1046 10 24 10.8954 24 12V19C24 20.6569 22.6569 22 21 22H16V10Z" fill="black" />
							</svg>
							<span className="font-semibold text-base">Lumotools</span>
						</div>
					</Link>
				</nav>
				<Menubar className="bg-transparent border-none max-sm:hidden">
					{Object.keys(fileCategories).map((categoryName, index) => (
						<MenubarMenu key={index}>
							<MenubarTrigger className="cursor-pointer">
								<span className="max-lg:hidden">{fileCategories[categoryName].name}&nbsp;Converters</span>
								<span className="lg:hidden">{fileCategories[categoryName].namePlural}</span>
								<ChevronDown size={14} className="ml-1" />
							</MenubarTrigger>
							<MenubarContent>
								{fileConverters
									.filter((converter) => fileTypes[converter.types[0]].category == categoryName && !converter.alternativeTo)
									.map((converter, index) => {
										const fromType = fileTypes[converter.types[0]];
										const toType = fileTypes[converter.types[1]];

										return (
											<MenubarItem key={index} className="p-0">
												<a href={`/convert/${converter.slug}`} className="px-2 py-1.5 w-full font-medium">
													{fromType.name} to {toType.name}
												</a>
											</MenubarItem>
										);
									})}
							</MenubarContent>
						</MenubarMenu>
					))}
				</Menubar>
			</div>
		</header>
	);
}
