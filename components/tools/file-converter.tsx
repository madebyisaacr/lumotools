"use client";

import { useRef, useState, useEffect } from "react";
import { json2csv, csv2json } from "json-2-csv";

import { cn } from "@/lib/utils";
import { fragmentMono } from "@/lib/fonts";
import { fileTypes } from "@/lib/file-types";
import { UploadCloud, Download, Copy, Upload, Wand2 } from "lucide-react";
import { Button } from "@/components/ui/button";

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

	const handleDrop = (e) => {
		preventDefaults(e);

		let files = e.dataTransfer.files;
		for (const file of files) {
			if (file.type == fromType.mimeType) {
				setFile(file);
				break;
			}
		}
	};

	useEffect(() => {
		document.addEventListener("dragenter", preventDefaults, false);
		document.addEventListener("dragover", preventDefaults, false);
		document.addEventListener("dragleave", preventDefaults, false);
		document.addEventListener("drop", handleDrop, false);
		document.addEventListener("paste", handlePaste);

		return () => {
			document.removeEventListener("dragenter", preventDefaults, false);
			document.removeEventListener("dragover", preventDefaults, false);
			document.removeEventListener("dragleave", preventDefaults, false);
			document.removeEventListener("drop", handleDrop, false);
			document.removeEventListener("paste", handlePaste);
		};
	}, [handlePaste]);

	return (
		<div className="flex flex-col gap-3 items-center w-full max-w-5xl">
			<div
				className={`${
					file ? "border-zinc-300" : "border-primary"
				} relative flex flex-col items-center justify-center gap-3 w-full h-96 p-4 bg-zinc-50 rounded-lg border-2 border-dashed cursor-pointer`}
			>
				<input
					ref={fileInputRef}
					type="file"
					id="image"
					accept={fromType.extensions.map((item) => "." + item).join(", ")}
					className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
					onChange={handleFileChange}
				/>
				<div className="flex flex-col gap-3 w-full flex-1 items-center justify-center">
					{file ? (
						<>
							<img src={URL.createObjectURL(file)} alt={file.name} className="h-36 object-cover rounded-md" />
							<span className="w-full text-center text-lg font-semibold">{file.name}</span>
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
	const [errorMessage, setErrorMessage] = useState("");
	const inputRef = useRef<HTMLTextAreaElement>(null);

	const fromType = fileTypes[fromTypeId] || {};
	const toType = fileTypes[toTypeId] || {};

	function invalidateOutput() {
		setOutput("");
	}

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
						invalidateOutput();
					}
				};
				reader.readAsText(file);
			}
		});
	}

	function convertFile() {
		const input = inputRef.current?.value || "";

		let convertFunction = null;
		switch (`${fromTypeId}-to-${toTypeId}`) {
			case "json-to-csv":
				convertFunction = convertJsonToCsv;
				break;
			case "csv-to-json":
				convertFunction = convertCsvToJson;
				break;
		}

		if (convertFunction) {
			try {
				setOutput(convertFunction(input));
			} catch (error) {
				setErrorMessage(`Invalid ${fromType.name} input. Please try again with a valid ${fromType.name} input.`);
			}
		}
	}

	function onDownloadClick() {
		const blob = new Blob([output], { type: toType.mimeType });
		const url = URL.createObjectURL(blob);
		downloadFile(url, generateFileName(fileName, toType.resultExtension));
	}

	function copyOutputToClipboard() {
		navigator.clipboard.writeText(output);
	}

	// Handle file drop
	const handleDrop = (e) => {
		preventDefaults(e);

		let files = e.dataTransfer.files;
		for (const file of files) {
			if (file.type == fromType.mimeType) {
				setFileName(file.name);

				const reader = new FileReader();
				reader.onload = (event) => {
					if (inputRef.current) {
						inputRef.current.value = event.target.result as string;
						invalidateOutput();
					}
				};
				reader.readAsText(file);
				break;
			}
		}
	};

	useEffect(() => {
		document.addEventListener("dragenter", preventDefaults, false);
		document.addEventListener("dragover", preventDefaults, false);
		document.addEventListener("dragleave", preventDefaults, false);
		document.addEventListener("drop", handleDrop, false);

		return () => {
			document.removeEventListener("dragenter", preventDefaults, false);
			document.removeEventListener("dragover", preventDefaults, false);
			document.removeEventListener("dragleave", preventDefaults, false);
			document.removeEventListener("drop", handleDrop, false);
		};
	}, []);

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
					<div className="absolute bottom-4 left-4 right-4 flex flex-row flex-wrap justify-center gap-3">
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
							<p className={cn("w-full h-full p-4 pb-20 overflow-auto text-sm whitespace-pre", fragmentMono.className)}>{output}</p>
							<div className="absolute bottom-0 left-4 right-4 pb-4 flex flex-row flex-wrap justify-center gap-3">
								<div className="flex-1 bg-zinc-100">
								<Button className="w-full" onClick={onDownloadClick}>
									<Download size={16} strokeWidth={2} className="mr-3" />
									Download as {toType.name}
								</Button></div>
								<div className="flex-1 bg-zinc-100">
									<Button variant="tertiary" className="w-full" onClick={copyOutputToClipboard}>
										<Copy size={16} strokeWidth={2} className="mr-3" />
										Copy to Clipboard
									</Button>
								</div>
							</div>
						</>
					) : (
						<div className="w-full h-full flex flex-col gap-4 p-4 items-center justify-center">
							<Button className="w-fit" onClick={convertFile}>
								<Wand2 size={16} strokeWidth={2} className="mr-3" />
								Convert to {toType.name}
							</Button>
							{errorMessage.length != 0 && <p className="text-red-600 w-full text-center">{errorMessage}</p>}
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

function convertJsonToCsv(input) {
	const json = JSON.parse(input); // Attempt to parse the JSON input
	return json2csv(json, {
		expandNestedObjects: true,
	});
}

function convertCsvToJson(input) {
	return JSON.stringify(csv2json(input), null, 2)
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

	return `${fileName}.${extension}`;
}

function notSupportedErrorMessage(mimeType, name = "") {
	return `File type "${mimeType}"${
		name.length ? " (" + name + ")" : ""
	} is not supported by your browser. Please try again with a different browser or device.`;
}

function preventDefaults(e) {
	e.preventDefault();
	e.stopPropagation();
}
