import type { Metadata } from "next";

import { fileTypes, fileConverterSlugs } from "@/lib/file-types";
import FileConverter from "@/components/tools/file-converter";

export function generateMetadata({ params }) {
	const { slug } = params;

	const fromType = fileTypes[slug.split("-to-")[0]];
	const toType = fileTypes[slug.split("-to-")[1]];

	return {
		title: `${fromType.name} to ${toType.name} Converter | Lumotools`,
		description: `Convert ${fromType.name} ${fromType.titles[1]} to ${toType.name} instantly with this free online tool.`,
	};
}

export default function Page({ params }: { params: { slug: string } }) {
	const { slug } = params;

	if (!fileConverterSlugs.includes(slug)) {
		return (
			<div className="w-full flex flex-col gap-12 items-center">
				<h1 className="text-5xl font-semibold w-full text-center">404: Page Not Found</h1>
				<p className="w-full text-center">The page you&apos;re looking for does not exist.</p>
			</div>
		);
	}

	const fromType = fileTypes[slug.split("-to-")[0]];
	const toType = fileTypes[slug.split("-to-")[1]];

	return (
		<div className="w-full flex flex-col gap-12 items-center">
			<div className="flex flex-col gap-4 items-center w-full">
				<h1 className="text-5xl font-semibold w-full text-center">
					Free {fromType.name} to {toType.name} Converter
				</h1>
				<p className="w-full text-center">
					Convert {fromType.name} {fromType.titles[1]} to {toType.name} instantly with this free online tool.
				</p>
			</div>
			<FileConverter fromTypeId={fromType.id} toTypeId={toType.id} />
			<div className="flex flex-row gap-4 w-full">
				<div className="flex flex-col gap-4 p-6 bg-zinc-100 flex-1 rounded-lg border border-zinc-200">
					<h2 className="text-xl font-semibold">{fromType.name}</h2>
					<p>{fromType.description}</p>
				</div>
				<div className="flex flex-col gap-4 p-6 bg-zinc-100 flex-1 rounded-lg border border-zinc-200">
					<h2 className="text-xl font-semibold">{toType.name}</h2>
					<p>{toType.description}</p>
				</div>
			</div>
		</div>
	);
}
