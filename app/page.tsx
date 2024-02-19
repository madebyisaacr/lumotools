import { fileTypes, fileConverters, fileCategories } from "@/lib/file-types";

export default function Home() {
	return (
		<div className="flex flex-col gap-16 max-w-6xl">
			<div className="flex flex-col gap-6">
				<h1 className="text-5xl font-semibold w-full text-center text-balance">
					Free, simple file converters and online utilities.
				</h1>
				<p className="w-full text-center">Lumotools helps you convert images, files, and more.</p>
			</div>
			<div className="flex flex-col gap-y-16">
				{Object.keys(fileCategories).map((categoryName, index) => {
					return (
						<div key={index} className="flex flex-col gap-2">
							<h2 className="text-2xl font-semibold w-full">{fileCategories[categoryName].name} Converters</h2>
							<p className="w-full text-sm line-clamp-2 text-ellipsis opacity-60">{fileCategories[categoryName].description}</p>
							<div className="h-2" />
							<div className="grid grid-cols-4 gap-3">
								{fileConverters
									.filter((converter) => fileTypes[converter.types[0]].category == categoryName && !converter.types.includes("jpeg"))
									.map((converter, index) => {
										const fromType = fileTypes[converter.types[0]];
										const toType = fileTypes[converter.types[1]];

										return (
											<a
												key={index}
												href={`./convert/${fromType.id}-to-${toType.id}`}
												className="flex flex-col gap-4 items-center justify-center p-4 bg-zinc-100 flex-1 text-center font-medium rounded-lg border border-zinc-200 hover:bg-primary hover:text-primary-foreground hover:border-transparent transition-colors"
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
