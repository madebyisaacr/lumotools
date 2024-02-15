"use client";

// import { z } from "zod";
// import { zodResolver } from "@hookform/resolvers/zod";
// import { useForm } from "react-hook-form";
import { useRef, useState } from "react";

// import { Input } from "@/components/ui/input";
// import {
// 	Form,
// 	FormControl,
// 	FormDescription,
// 	FormField,
// 	FormItem,
// 	FormLabel,
// 	FormMessage,
// } from "@/components/ui/form";
import { Button } from "@/components/ui/button";

// const formSchema = z.object({
// 	file: z.string().url(),
// });

const FILE_NAMES = {
	webp: "WebP",
	jpg: "JPG",
	png: "PNG",
};

export default function FileConverter({ fromType, toType }) {
	const fileInputRef = useRef<HTMLInputElement>(null);
	const [fileName, setFileName] = useState("");

	// const form = useForm<z.infer<typeof formSchema>>({
	// 	resolver: zodResolver(formSchema),
	// 	defaultValues: {
	// 		file: "",
	// 	},
	// });

	// function onSubmit(values: z.infer<typeof formSchema>) {
	// 	if (fileInputRef.current?.files?.length) {
	// 		const file = fileInputRef.current.files[0];

	// 		let convertFunction = null;
	// 		if (fromType === "webp" && toType === "jpg") {
	// 			convertFunction = webpToJpg;
	// 		}

	// 		if (convertFunction) {
	// 			const url = convertFunction(file);

	// 			let fileName = file.name;
	// 			const dotIndex = fileName.lastIndexOf(".");

	// 			// Check if the file name has an extension and does not start with a dot
	// 			if (dotIndex > 0) {
	// 				fileName = fileName.substring(0, dotIndex); // Remove the extension
	// 			}

	// 			downloadFile(
	// 				url,
	// 				`${fileName} (Converted by Lumotools.com).${toType}`
	// 			);
	// 		}
	// 	}
	// }

	function onButtonPress() {
		if (fileInputRef.current?.files?.length) {
			const file = fileInputRef.current.files[0];

			let convertFunction = null;
			if (fromType === "webp" && toType === "jpg") {
				convertFunction = webpToJpg;
			}

			if (convertFunction) {
				convertFunction(file)
					.then((url) => {
						let fileName = file.name;
						const dotIndex = fileName.lastIndexOf(".");

						// Check if the file name has an extension and does not start with a dot
						if (dotIndex > 0) {
							fileName = fileName.substring(0, dotIndex); // Remove the extension
						}

						downloadFile(
							url,
							`${fileName} (Converted by Lumotools.com).${toType}`
						);
					})
					.catch((error) => {
						alert(error.message);
					});
			}
		}
	}

	const handleFileChange = (event) => {
		const file = event.target.files[0];
		if (file) {
			setFileName(file.name);
		} else {
			setFileName("");
		}
	};

	return (
		<div className="flex flex-col gap-3 items-center w-full">
			<div className="relative flex flex-col items-center justify-center gap-3 w-full h-96 p-4 bg-zinc-50 rounded-lg border-2 border-dashed border-zinc-300 cursor-pointer">
				<input
					type="file"
					id="image"
					accept={`.${fromType}`}
					ref={fileInputRef}
					className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
					onChange={handleFileChange}
				/>
				<div className="flex flex-col gap-3 flex-1 items-center justify-center">
				<label>Click to upload file or drag-and-drop</label>
				<label>{fileName.length ? fileName : "No file chosen"}</label>

				</div>
			<Button className="w-fit" onClick={onButtonPress}>
				Download as {FILE_NAMES[toType]}
			</Button>
			</div>
		</div>
	);

	// return (
	// 	<Form {...form}>
	// 		<form
	// 			onSubmit={form.handleSubmit(onSubmit)}
	// 			className="flex flex-col gap-4"
	// 		>
	// 			<FormField
	// 				control={form.control}
	// 				name="file"
	// 				render={({ field }) => {
	// 					const { ref, ...rest } = field;
	// 					return (
	// 						<FormItem>
	// 							<FormLabel htmlFor="image">
	// 								{FILE_NAMES[fromType]} Image
	// 							</FormLabel>
	// 							<FormControl>
	// 								<Input
	// 									id="image"
	// 									type="file"
	// 									accept={`.${fromType}`}
	// 									{...rest}
	// 									ref={(e) => {
	// 										ref(e);
	// 										fileInputRef.current = e;
	// 									}}
	// 								/>
	// 							</FormControl>
	// 							<FormDescription>
	// 								Upload a {FILE_NAMES[fromType]} image to
	// 								convert to {FILE_NAMES[toType]}.
	// 							</FormDescription>
	// 							<FormMessage />
	// 						</FormItem>
	// 					);
	// 				}}
	// 			></FormField>
	// 			<Button type="submit">Download as {FILE_NAMES[toType]}</Button>
	// 		</form>
	// 	</Form>
	// );
}

function webpToJpg(file) {
	return new Promise((resolve, reject) => {
		if (file) {
			// Ensure it's a WEBP image
			if (file.type === "image/webp") {
				const reader = new FileReader();

				reader.onload = function (event) {
					const img = new Image();
					img.onload = function () {
						// Create a canvas element to draw the WEBP image
						const canvas = document.createElement("canvas");
						canvas.width = img.width;
						canvas.height = img.height;

						// Draw the image onto the canvas
						const ctx = canvas.getContext("2d");
						ctx.drawImage(img, 0, 0);

						// Convert the canvas to a JPG image
						const jpgUrl = canvas.toDataURL("image/jpeg", 1.0);

						// Resolve the promise with the JPG URL
						resolve(jpgUrl);
					};

					img.onerror = reject; // Handle image loading error

					img.src = event.target.result;
				};

				reader.onerror = reject; // Handle file reading error

				reader.readAsDataURL(file);
			} else {
				reject(new Error("Please upload a WEBP image."));
			}
		} else {
			reject(new Error("Please upload a file."));
		}
	});
}

function downloadFile(url, fileName) {
	const a = document.createElement("a");
	a.href = url;
	a.download = fileName;
	document.body.appendChild(a);
	a.click();
	document.body.removeChild(a);
}
