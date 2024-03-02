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
			<div className="w-full px-6 max-sm:px-1 flex justify-between h-14 max-w-screen-2xl items-center">
				<nav className="flex items-center">
					<Link href="/">
						<div
							className={cn(
								buttonVariants({
									variant: "ghost",
								})
							)}
						>
							<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24" className="mr-1.5">
								<path
									stroke="#000"
									strokeLinecap="round"
									strokeLinejoin="round"
									strokeWidth="2"
									d="M2 6V4c0-1.1.9-2 2-2h2M18 2h2c1.1 0 2 .9 2 2v2M22 18v2c0 1.1-.9 2-2 2h-2M6 22H4c-1.1 0-2-.9-2-2v-2M18 9.333a1.333 1.333 0 00-.667-1.153l-4.666-2.667a1.334 1.334 0 00-1.334 0L6.667 8.18A1.333 1.333 0 006 9.333v5.334a1.333 1.333 0 00.667 1.153l4.666 2.667a1.334 1.334 0 001.334 0l4.666-2.667A1.333 1.333 0 0018 14.667V9.333z"
								></path>
								<path
									stroke="#000"
									strokeLinecap="round"
									strokeLinejoin="round"
									strokeWidth="2"
									d="M6.2 8.667L12 12l5.8-3.333M12 18.667V12"
								></path>
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
