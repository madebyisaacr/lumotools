import { fileTypes, fileConverters, fileConverterSlugs } from "@/lib/file-types";
import { FileConverter, TextConverter } from "@/components/tools/file-converter";
import { FileIcon } from "@/components/elements/file-icon";
import Script from "next/script";
import ChecklistItem from "@/components/elements/checklist-item";

const CONVERTER_COMPONENTS = {
	file: FileConverter,
	text: TextConverter,
};

export function generateMetadata({ params }) {
	const { slug } = params;

	const fromType = fileTypes[slug.split("-to-")[0]];
	const toType = fileTypes[slug.split("-to-")[1]];

	return {
		title: `${fromType.name} to ${toType.name} Converter | Lumotools`,
		description: `Convert ${fromType.name} ${fromType.titles[1]} to ${toType.name} instantly with this free online tool.`,
	};
}

export function generateStaticParams() {
	return fileConverterSlugs.map((slug) => ({ slug }));
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

	const converter = fileConverters[fileConverterSlugs.indexOf(slug)];
	const ConverterComponent = CONVERTER_COMPONENTS[converter.component];

	const schema = {
		"@context": "http://schema.org",
		"@type": "SoftwareApplication",
		name: `${fromType.name} to ${toType.name} Converter`,
		applicationCategory: "Utility",
		applicationSubCategory: "File Conversion",
		operatingSystem: "Web",
		softwareVersion: "1.0",
		offers: {
			"@type": "Offer",
			price: "0",
			priceCurrency: "USD",
		},
		features: [
			`Convert ${fromType.name} ${fromType.titles[1]} to ${toType.name}`,
			"Free file conversion with no account required or limits.",
			"100% secure with on-device file conversion.",
		],
	};

	return (
		<div className="w-full flex flex-col gap-12 items-center">
			<Script id="schema" type="application/ld+json" strategy="beforeInteractive">
				{JSON.stringify(schema)}
			</Script>
			<div className="flex flex-col gap-4 items-center w-full">
				<h1 className="text-5xl font-semibold w-full text-center max-md:text-4xl">
					{`Free ${fromType.name} to ${toType.name} Converter`}
				</h1>
				<p className="w-full text-center">
					{`Convert ${fromType.name} ${fromType.titles[1]} to ${toType.name} instantly with this free online tool.`}
				</p>
				<div className="flex flex-row gap-x-8 gap-y-4 pt-2 w-full flex-wrap justify-center items-center">
					<ChecklistItem>No limits</ChecklistItem>
					<ChecklistItem>No paywalls</ChecklistItem>
					<ChecklistItem>No account required</ChecklistItem>
					<ChecklistItem>100% secure with on-device file conversion</ChecklistItem>
				</div>
			</div>
			<ConverterComponent converter={converter} />
			<div className="flex flex-row gap-4 w-full max-w-5xl max-md:flex-col">
				<div className="flex flex-col gap-4 p-6 bg-zinc-100 flex-1 rounded-lg border border-zinc-200">
					<FileIcon type={fromType.id} size={64} />
					<h2 className="text-xl font-semibold mt-3">{`About ${fromType.name} Files`}</h2>
					<p>{fromType.description}</p>
				</div>
				<div className="flex flex-col gap-4 p-6 bg-zinc-100 flex-1 rounded-lg border border-zinc-200">
					<FileIcon type={toType.id} size={64} />
					<h2 className="text-xl font-semibold mt-3">{`About ${toType.name} Files`}</h2>
					<p>{toType.description}</p>
				</div>
			</div>
		</div>
	);
}
