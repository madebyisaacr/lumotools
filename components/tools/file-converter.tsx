"use client";

import { useRef, useState, useEffect } from "react";
import { json2csv } from "json-2-csv";

import { cn } from "@/lib/utils";
import { fragmentMono } from "@/lib/fonts";
import { fileTypes } from "@/lib/file-types";
import { UploadCloud, Download, Copy, Upload, Wand2 } from "lucide-react";
import { Button } from "@/components/ui/button";

const FILE_NAME_WATERMARK = "(Converted by Lumotools.com)";

export function FileConverter({ fromTypeId, toTypeId }) {
	const fileInputRef = useRef<HTMLInputElement>(null);
	const [file, setFile] = useState<File | null>(null);

	const fromType = fileTypes[fromTypeId] || {};
	const toType = fileTypes[toTypeId] || {};

	function convertAndSaveFile(toClipboard) {
		if (file) {
			let convertFunction = null;

			if ((fromType.id == "jpg" && toType.id == "jpeg") || (fromType.id == "jpeg" && toType.id == "jpg")) {
				convertFunction = (file, toTypeId) => {
					return new Promise((resolve, reject) => {
						resolve(URL.createObjectURL(file));
					});
				};
			} else {
				switch (fromType.id) {
					case "jpg":
					case "jpeg":
					case "png":
					case "webp":
					case "bmp":
					case "avif":
						convertFunction = convertImage;
						break;
				}
			}

			if (convertFunction) {
				convertFunction(file, toTypeId, toClipboard)
					.then((result) => {
						if (toClipboard) {
							navigator.clipboard.write([new window.ClipboardItem({ [toType.mimeType]: result })]);
						} else {
							downloadFile(result, generateFileName(file.name, toType.resultExtension));
						}
					})
					.catch((error) => {
						alert(error.message);
					});
			}
		}
	}

	function handlePaste(e) {
		if (!fromType.allowClipboard) {
			return;
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
	}, [handlePaste]);

	return (
		<div className="flex flex-col gap-3 items-center w-full max-w-5xl">
			<div className="relative flex flex-col items-center justify-center gap-3 w-full h-96 p-4 bg-zinc-50 rounded-lg border-2 border-dashed border-zinc-300 cursor-pointer">
				<input
					type="file"
					id="image"
					accept={fromType.extensions.map((item) => "." + item).join(", ")}
					ref={fileInputRef}
					className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
					onChange={handleFileChange}
				/>
				<div className="flex flex-col gap-3 flex-1 items-center justify-center">
					{file ? (
						<>
							<img src={URL.createObjectURL(file)} alt={file.name} className="h-36 object-cover rounded-md" />
							<span className="w-full text-center truncate text-lg font-semibold">{file.name}</span>
						</>
					) : (
						<div className="bg-primary size-24 flex items-center justify-center rounded-full">
							<UploadCloud size={48} strokeWidth={2} color="white" />
						</div>
					)}
					<div />
					<label>
						Click to upload {fromType.name} {fromType.titles[0]}
						{fromType.allowClipboard ? `, drag-and-drop, or paste ${fromType.titles[0]} from clipboard.` : " or drag-and-drop."}
					</label>
				</div>
				{file ? (
					<div className="w-full flex flex-row flex-wrap justify-center gap-3">
						<Button className="w-fit z-10" onClick={() => convertAndSaveFile(false)}>
							<Download size={16} strokeWidth={2} className="mr-3" />
							Download as {toType.name}
						</Button>
						<Button variant="secondary" className="w-fit z-10" onClick={() => convertAndSaveFile(true)}>
							<Copy size={16} strokeWidth={2} className="mr-3" />
							Copy to Clipboard as {toType.name}
						</Button>
					</div>
				) : null}
			</div>
		</div>
	);
}

export function TextConverter({ fromTypeId, toTypeId }) {
	const [output, setOutput] = useState("");
	const [fileName, setFileName] = useState("");
	const inputRef = useRef<HTMLTextAreaElement>(null);

	const fromType = fileTypes[fromTypeId] || {};
	const toType = fileTypes[toTypeId] || {};

	function uploadFile() {
		const fileInput = document.createElement("input");
		fileInput.type = "file";
		fileInput.accept = fromType.extensions.map((item) => "." + item).join(", ");
		fileInput.click();

		fileInput.addEventListener("change", (event) => {
			const target = event.target as HTMLInputElement;
			const file = target.files[0];
			if (file) {
				setFileName(file.name);
				const reader = new FileReader();
				reader.onload = (event) => {
					if (inputRef.current) {
						inputRef.current.value = event.target.result as string;
					}
				};
				reader.readAsText(file);
			}
		});
	}

	function convertFile() {
		const input = inputRef.current?.value || "";
		const json = JSON.parse(input);
		setOutput(
			json2csv(json, {
				expandNestedObjects: true,
			})
		);
	}

	function onDownloadClick() {
		const blob = new Blob([output], { type: toType.mimeType });
		const url = URL.createObjectURL(blob);
		downloadFile(url, generateFileName(fileName, toType.resultExtension));
	}

	function copyOutputToClipboard() {
		navigator.clipboard.writeText(output);
	}

	return (
		<div className="flex flex-row w-full gap-4 h-[550px]">
			<div className="flex flex-col flex-1">
				<div className="flex flex-row gap-3 justify-between items-center px-4 py-2 bg-zinc-200 border border-zinc-300 rounded-t-lg">
					<span className="font-semibold">{fromType.name} Input</span>
					{fileName.length != 0 && <span className="flex-1 text-ellipsis text-right text-sm opacity-60">{fileName}</span>}
				</div>
				<div className="relative flex flex-col flex-1 bg-zinc-100 border border-zinc-200 rounded-b-lg border-t-0">
					<textarea
						ref={inputRef}
						className={cn("flex-1 p-4 pb-20 bg-transparent resize-none text-sm", fragmentMono.className)}
						placeholder={`Type ${fromType.name} here, drag-and-drop file, or copy-and-paste...`}
						onChange={(event) => setOutput("")}
					/>
					<div className="absolute bottom-0 left-4 right-4 pb-4 bg-inherit flex flex-row flex-wrap justify-center gap-3">
						<Button className="flex-1" onClick={uploadFile}>
							<Upload size={16} strokeWidth={2} className="mr-3" />
							Upload {fromType.name} File
						</Button>
					</div>
				</div>
			</div>
			<div className="flex flex-col flex-1 overflow-auto">
				<h2 className="font-semibold px-4 py-2 bg-zinc-200 border border-zinc-300 rounded-t-lg">{toType.name} Output</h2>
				<div className="relative flex flex-col gap-5 flex-1 overflow-hidden bg-zinc-100 border border-zinc-200 rounded-b-lg border-t-0">
					{output.length ? (
						<>
							<p className={cn("w-full h-full p-4 pb-20 overflow-auto text-sm", fragmentMono.className)}>{output.trimEnd()}</p>
							<div className="absolute bottom-0 left-4 right-4 pb-4 flex flex-row flex-wrap justify-center gap-3">
								<Button className="grow basis-0" onClick={onDownloadClick}>
									<Download size={16} strokeWidth={2} className="mr-3" />
									Download as {toType.name}
								</Button>
								<div className="grow basis-0 bg-zinc-100">
									<Button variant="tertiary" className="w-full" onClick={copyOutputToClipboard}>
										<Copy size={16} strokeWidth={2} className="mr-3" />
										Copy to Clipboard
									</Button>
								</div>
							</div>
						</>
					) : (
						<div className="w-full h-full flex items-center justify-center">
							<Button className="w-fit" onClick={convertFile}>
								<Wand2 size={16} strokeWidth={2} className="mr-3" />
								Convert to {toType.name}
							</Button>
						</div>
					)}
				</div>
			</div>
		</div>
	);
}

function convertImage(file: File, toTypeId: string, returnBlob = false): Promise<string | Blob> {
	const toType = fileTypes[toTypeId];

	if (!toType) {
		return Promise.reject(new Error(`"${toTypeId}" is not a valid file type. Please try again with a different file type.`));
	}

	const dummyCanvas = document.createElement("canvas");
	try {
		// Check for result file type support
		const testDataURL = dummyCanvas.toDataURL(toType.mimeType);
		if (testDataURL === "data:,") {
			throw new Error(notSupportedErrorMessage(toType.mimeType, toType.name));
		}
	} catch (error) {
		return Promise.reject(new Error(notSupportedErrorMessage(toType.mimeType, toType.name)));
	}

	return new Promise((resolve, reject) => {
		if (!file) {
			reject(new Error("No file found. Please upload a file."));
			return;
		}

		if (!file.type.includes("image")) {
			reject(new Error("Please upload an image file."));
			return;
		}

		const reader = new FileReader();

		reader.onload = function (event) {
			const img = new Image();
			img.onload = function () {
				const canvas = document.createElement("canvas");
				canvas.width = img.width;
				canvas.height = img.height;

				const ctx = canvas.getContext("2d");
				ctx.drawImage(img, 0, 0);

				try {
					if (returnBlob) {
						canvas.toBlob(
							(blob) => {
								resolve(blob);
							},
							toType.mimeType,
							1.0
						);
					} else {
						// Attempt to convert the canvas to the desired file type
						const dataUrl = canvas.toDataURL(toType.mimeType, 1.0);
						resolve(dataUrl);
					}
				} catch (error) {
					reject(new Error(`Cannot convert to type "${toType.mimeType}".`));
				}
			};

			img.onerror = () => reject(new Error(notSupportedErrorMessage(file.type)));

			img.src = event.target.result as string;
		};

		reader.onerror = reject;

		reader.readAsDataURL(file);
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

function generateFileName(name, extension) {
	let fileName = name;
	
	// Check if the file name has an extension and does not start with a dot
	const dotIndex = fileName.lastIndexOf(".");
	if (dotIndex > 0) {
		fileName = fileName.substring(0, dotIndex); // Remove the extension
	}

	return `${fileName}${fileName.includes(FILE_NAME_WATERMARK) ? "" : " " + FILE_NAME_WATERMARK}.${extension}`;
}

function notSupportedErrorMessage(mimeType, name = "") {
	return `File type "${mimeType}"${
		name.length ? " (" + name + ")" : ""
	} is not supported by your browser. Please try again with a different browser or device.`;
}
