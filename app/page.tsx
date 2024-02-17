import { fileTypes, fileConverters } from "@/lib/file-types";

export default function Home() {
	const convertersByType = {};
	for (const converter of fileConverters) {
		if (converter.types.includes("jpeg")) {
			continue;
		}

		convertersByType[converter.types[0]] = convertersByType[converter.types[0]] || [];
		convertersByType[converter.types[0]].push(converter);
	}

	return (
		<div className="flex flex-col gap-16 max-w-5xl">
			<div className="flex flex-col gap-6">
				<h1 className="text-5xl font-semibold w-full text-center text-balance">
					Free, simple file converters and online utilities.
				</h1>
				<p className="w-full text-center">Lumotools helps you convert images, files, and more.</p>
			</div>
			<div className="grid grid-cols-3 gap-8 gap-y-16">
				{Object.keys(convertersByType).map((type, index) => {
					return (
						<div key={index} className="flex flex-col gap-2">
							<h2 className="text-2xl font-semibold w-full">{fileTypes[type].name} Converters</h2>
							<p className="w-full text-sm line-clamp-2 text-ellipsis opacity-60">{fileTypes[type].description}</p>
							<div className="h-2" />
							<div className="flex flex-col gap-3">
								{convertersByType[type].map((converter, index) => {
									const fromType = fileTypes[converter.types[0]];
									const toType = fileTypes[converter.types[1]];

									return (
										<a
											key={index}
											href={`./convert/${converter.slug}`}
											className="flex flex-col gap-4 items-center justify-center p-4 bg-zinc-100 flex-1 text-center font-medium rounded-lg border border-zinc-200 hover:bg-zinc-200/70"
										>
											{fromType.name} to {toType.name}
										</a>
									);
								})}
							</div>
						</div>
					);
				})}
			</div>
		</div>
	);
}
