import type { Metadata } from "next";

import FileConverter from "@/components/tools/file-converter";

export const metadata: Metadata = {
	title: "WebP to JPG Converter | Lumotools",
};

export default function Page() {
	return (
		<div className="w-full flex flex-col gap-12 items-center w-full">
			<div className="flex flex-col gap-4 items-center w-full">
				<h1 className="text-5xl font-semibold">
					Free WebP to JPG Converter
				</h1>
				<p>
					Convert WebP images to JPG instantly with this free online
					tool.
				</p>
			</div>
			<FileConverter fromType="webp" toType="jpg" />
		</div>
	);
}
