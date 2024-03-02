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
			<div className="w-full px-4 flex justify-between h-14 max-w-screen-2xl items-center">
				<nav className="flex items-center">
					<Link href="/">
						<div
							className={cn(
								buttonVariants({
									variant: "ghost",
								})
							)}
						>
							<span className="font-semibold text-base">Lumotools</span>
						</div>
					</Link>
				</nav>
				<Menubar className="bg-transparent border-none">
					{Object.keys(fileCategories).map((categoryName, index) => (
						<MenubarMenu key={index}>
							<MenubarTrigger>
								{fileCategories[categoryName].name} Converters
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
												<a href={`/convert/${converter.slug}`} className="px-2 py-1.5 w-full">
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
