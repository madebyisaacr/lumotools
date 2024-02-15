"use client";

import { useRef, useState, useEffect } from "react";

import { fileTypes } from "@/lib/file-types";
import { UploadCloud, Download } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function FileConverter({ fromType, toType }) {
	const fileInputRef = useRef<HTMLInputElement>(null);
	const [file, setFile] = useState<File | null>(null);

	const fromFileType = fileTypes[fromType] || {};
	const toFileType = fileTypes[toType] || {};

	function onButtonPress() {
		if (file) {
			let convertFunction = convertImage;

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

	function handlePaste(e) {
		if (!fromFileType.allowClipboard) {
			return
		}

		// Prevent the default pasting event
		e.preventDefault();

		// Check if there's anything in the clipboard data
		if (e.clipboardData) {
			// Get the items from the clipboard
			const items = e.clipboardData.items;

			// Loop through the clipboard items
			for (let i = 0; i < items.length; i++) {
				console.log(items[i].type, items[i].kind);
				// Check if the item is an image
				if (items[i].type.indexOf("image") !== -1) {
					// Get the image file
					setFile(items[i].getAsFile());

					break;
				}
			}
		}
	}

	const handleFileChange = (event) => {
		const file = event.target.files[0];
		if (file) {
			setFile(file);
		} else {
			setFile(null);
		}
	};

	useEffect(() => {
		document.addEventListener("paste", handlePaste);

		return () => {
			document.removeEventListener("paste", handlePaste);
		};
	}, []);

	return (
		<div className="flex flex-col gap-3 items-center w-full">
			<div className="relative flex flex-col items-center justify-center gap-3 w-full h-96 p-4 bg-zinc-50 rounded-lg border-2 border-dashed border-zinc-300 cursor-pointer">
				<input
					type="file"
					id="image"
					accept={fromFileType.extensions
						.map((item) => "." + item)
						.join(", ")}
					ref={fileInputRef}
					className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
					onChange={handleFileChange}
				/>
				<div className="flex flex-col gap-3 flex-1 items-center justify-center">
					{file ? (
						<>
							<img
								src={URL.createObjectURL(file)}
								alt={file.name}
								className="h-36 object-cover rounded-md"
							/>
							<span className="w-full text-center truncate text-lg font-semibold">
								{file.name}
							</span>
						</>
					) : (
						<div className="bg-zinc-200 size-20 flex items-center justify-center border border-zinc-300 rounded-full">
							<UploadCloud size={48} strokeWidth={2} />
						</div>
					)}
					<div />
					<label>
						Click to upload {fromFileType.name}{" "}
						{fromFileType.titles[0]}
						{fromFileType.allowClipboard
							? `, drag-and-drop, or paste ${fromFileType.titles[0]} from clipboard.`
							: " or drag-and-drop."}
					</label>
				</div>
				{file ? (
					<Button className="w-fit z-10" onClick={onButtonPress}>
						<Download size={16} strokeWidth={3} className="mr-3" />
						Download as {toFileType.name}
					</Button>
				) : null}
			</div>
		</div>
	);
}

function convertImage(file: File, toTypeId: string) {
	const toType = fileTypes[toTypeId] || {};

	return new Promise((resolve, reject) => {
		if (file) {
			// Ensure it's a WEBP image
			if (file.type.includes("image")) {
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
						const jpgUrl = canvas.toDataURL(toType.mimeType, 1.0);

						// Resolve the promise with the JPG URL
						resolve(jpgUrl);
					};

					img.onerror = reject; // Handle image loading error

					img.src = event.target.result;
				};

				reader.onerror = reject; // Handle file reading error

				reader.readAsDataURL(file);
			} else {
				reject(new Error("Please upload an image file."));
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
