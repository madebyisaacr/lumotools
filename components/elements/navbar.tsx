"use client";

import Link from "next/link";

import React from "react";
import { fileTypes, fileConverters } from "@/lib/file-types";
import { cn } from "@/lib/utils";
import { buttonVariants } from "@/components/ui/button";
import { ChevronDown } from "lucide-react";

import {
	Menubar,
	MenubarContent,
	MenubarItem,
	MenubarMenu,
	MenubarTrigger,
} from "@/components/ui/menubar";

export default function Navbar() {
	const convertersByType = {};
	for (const converter of fileConverters) {
		if (converter.types.includes("jpeg")) {
			continue
		}

		convertersByType[converter.types[0]] =
			convertersByType[converter.types[0]] || [];
		convertersByType[converter.types[0]].push(converter);
	}

	return (
		<header className="fixed top-0 left-0 right-0 z-50 border-b border-zinc-200 bg-zinc-100">
			<div className="px-4 flex justify-between h-14 max-w-screen-2xl items-center">
				<nav className="flex items-center">
					<Link href="/">
						<div
							className={cn(
								buttonVariants({
									variant: "ghost",
								})
							)}
						>
							<span className="font-semibold text-base">
								Lumotools
							</span>
						</div>
					</Link>
				</nav>
				<Menubar className="bg-transparent border-none">
					{Object.keys(convertersByType).map((typeId, index) => {
						const type = fileTypes[typeId];

						return (
							<MenubarMenu key={index}>
								<MenubarTrigger>
									{type.name}
									<ChevronDown size={14} className="ml-1" />
								</MenubarTrigger>
								<MenubarContent>
									{convertersByType[typeId].map(
										(converter, index) => {
											const fromType =
												fileTypes[converter.types[0]];
											const toType =
												fileTypes[converter.types[1]];

											return (
												<MenubarItem
													key={index}
													className="p-0"
												>
													<a
														href={`/convert/${fromType.id}-to-${toType.id}`}
														className="px-2 py-1.5"
													>
														{fromType.name} to{" "}
														{toType.name}
													</a>
												</MenubarItem>
											);
										}
									)}
								</MenubarContent>
							</MenubarMenu>
						);
					})}
				</Menubar>
			</div>
		</header>
	);
}
