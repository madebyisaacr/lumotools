import type { Metadata } from "next";

import { fileTypes, fileConverterSlugs } from "@/lib/file-types";
import FileConverter from "@/components/tools/file-converter";

export function generateMetadata({ params }) {
	const { slug } = params;

	const fromType = fileTypes[slug.split("-to-")[0]];
	const toType = fileTypes[slug.split("-to-")[1]];

	return {
		title: `${fromType.name} to ${toType.name} Converter | Lumotools`,
	};
}

export default function Page({ params }: { params: { slug: string } }) {
	const { slug } = params;

	if (!fileConverterSlugs.includes(slug)) {
		return (
			<div className="w-full flex flex-col gap-12 items-center">
				<h1 className="text-5xl font-semibold w-full text-center">
					404: Page Not Found
				</h1>
				<p className="w-full text-center">
					The page you're looking for does not exist.
				</p>
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
					Convert {fromType.name} {fromType.titles[1]} to{" "}
					{toType.name} instantly with this free online tool.
				</p>
			</div>
			<FileConverter fromType={fromType.id} toType={toType.id} />
		</div>
	);
}
