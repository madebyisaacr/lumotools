import { fileTypes, fileConverters, fileCategories } from "@/lib/file-types";
import { FileIcon } from "@/components/elements/file-icon";
import { ChevronRight } from "lucide-react";
import ChecklistItem from "@/components/elements/checklist-item";

export default function Home() {
	return (
		<div className="flex flex-col gap-16 w-full max-w-5xl">
			<div className="flex flex-col gap-6">
				<h1 className="text-5xl max-sm:text-4xl font-semibold w-full text-center text-balance">
					Free file converters and online tools.
				</h1>
				<p className="w-full text-center">Lumotools helps you convert images, files, audio, and more.</p>
				<div className="flex flex-row gap-x-8 gap-y-4 w-full flex-wrap justify-center pt-2 items-center max-sm:hidden">
					<ChecklistItem>No limits</ChecklistItem>
					<ChecklistItem>No paywalls</ChecklistItem>
					<ChecklistItem>No account required</ChecklistItem>
					<ChecklistItem>100% secure with on-device file conversion</ChecklistItem>
				</div>
			</div>
			<div className="flex flex-col gap-y-16">
				{Object.keys(fileCategories).map((categoryName, index) => {
					return (
						<div key={index} className="flex flex-col gap-2">
							<h2 className="text-2xl font-semibold w-full">{fileCategories[categoryName].name} Converters</h2>
							<p className="w-full text-sm line-clamp-2 text-ellipsis opacity-60">{fileCategories[categoryName].description}</p>
							<div className="h-2" />
							<div className="grid grid-cols-4 max-md:grid-cols-3 max-sm:grid-cols-2 max-[350px]:grid-cols-1 gap-3">
								{fileConverters
									.filter((converter) => fileTypes[converter.types[0]].category == categoryName && !converter.alternativeTo)
									.map((converter, index) => {
										const fromType = fileTypes[converter.types[0]];
										const toType = fileTypes[converter.types[1]];

										return (
											<a
												key={index}
												href={`./convert/${converter.slug}`}
												className="flex flex-col gap-4 items-center justify-center p-4 bg-zinc-100 flex-1 text-center font-medium rounded-lg border border-black/5 hover:bg-zinc-200 transition-colors"
											>
												<div className="flex flex-row gap-1 items-center">
													<FileIcon type={converter.types[0]} size={52} />
													<ChevronRight size={16} strokeWidth={3} opacity={0.7} />
													<FileIcon type={converter.types[1]} size={52} />
												</div>
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
