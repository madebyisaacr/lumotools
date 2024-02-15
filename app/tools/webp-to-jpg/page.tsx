import type { Metadata } from "next";

import FileConverter from "@/components/tools/file-converter";

export const metadata: Metadata = {
	title: "WebP to JPG Converter | lumotools",
};

export default function Page() {
	return (
		<div className="w-full flex flex-col gap-4 items-center">
			<h1 className="text-3xl">WebP to JPG Converter</h1>
			<p>hello</p>
			<FileConverter />
		</div>
	);
}
