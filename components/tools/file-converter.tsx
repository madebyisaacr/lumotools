"use client";

import { useRef, useState, useEffect } from "react";
import { json2csv, csv2json } from "json-2-csv";
import YAML from "yaml";
import toWav from "audiobuffer-to-wav";
import lamejs from "lamejs";
import jsPDF from "jspdf";

import { cn } from "@/lib/utils";
import { fragmentMono } from "@/lib/fonts";
import { fileTypes } from "@/lib/file-types";
import { UploadCloud, Download, Copy, Upload, Wand2, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { FilePreview } from "@/components/elements/file-preview";

import MPEGMode from "lamejs/src/js/MPEGMode";
import Lame from "lamejs/src/js/Lame";
import BitStream from "lamejs/src/js/BitStream";

const TEXT_FILE_CONVERTER_FUNCTIONS = {
	"json-to-csv": convertJSONtoCSV,
	"csv-to-json": convertCSVtoJSON,
	"json-to-yaml": convertJSONtoYAML,
	"yaml-to-json": convertYAMLtoJSON,
	"rtf-to-txt": convertRTFtoTXT,
};

export function FileConverter({ converter }) {
	const fileInputRef = useRef<HTMLInputElement>(null);
	const [file, setFile] = useState<File | null>(null);

	const fromType = fileTypes[converter.types[0]] || {};
	const toType = fileTypes[converter.types[1]] || {};

	function convertAndSaveFile(toClipboard) {
		if (file) {
			let convertFunction = null;

			switch (converter.alternativeTo || converter.slug) {
				case "jpg-to-jpeg":
				case "jpeg-to-jpg":
					convertFunction = (file, toTypeId) => {
						return new Promise((resolve, reject) => {
							resolve(URL.createObjectURL(file));
						});
					};
					break;
				case "webp-to-jpg":
				case "webp-to-png":
				case "jpg-to-webp":
				case "jpg-to-png":
				case "png-to-webp":
				case "png-to-jpg":
				case "avif-to-webp":
				case "avif-to-jpg":
				case "avif-to-png":
				case "bmp-to-webp":
				case "bmp-to-jpg":
				case "bmp-to-png":
					convertFunction = convertImage;
					break;
				case "png-to-pdf":
				case "jpg-to-pdf":
				case "bmp-to-pdf":
				case "gif-to-pdf":
				case "webp-to-pdf":
				case "avif-to-pdf":
					convertFunction = convertImageToPDF;
					break;
				case "mp3-to-wav":
				case "wav-to-mp3":
				case "ogg-to-mp3":
				case "ogg-to-wav":
				case "aac-to-mp3":
				case "aac-to-wav":
					convertFunction = convertAudioFile;
					break;
			}

			if (convertFunction) {
				convertFunction(file, toType.id, toClipboard)
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

	const handleFileChange = (event) => {
		const file = event.target.files[0];
		if (file) {
			setFile(file);
		} else {
			setFile(null);
		}
	};

	useEffect(() => {
		// @ts-ignore
		window.MPEGMode = MPEGMode;
		// @ts-ignore
		window.Lame = Lame;
		// @ts-ignore
		window.BitStream = BitStream;

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
	}, []);

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
					id="fileUpload"
					accept={fromType.extensions.map((item) => "." + item).join(", ")}
					className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
					onChange={handleFileChange}
				/>
				<div className="flex flex-col gap-3 w-full flex-1 items-center justify-center">
					{file ? (
						<>
							<FilePreview file={file} />
							<span className="w-full text-center text-lg font-semibold">{file.name}</span>
						</>
					) : (
						<div className="bg-primary size-24 flex items-center justify-center rounded-full">
							<UploadCloud size={48} strokeWidth={2} color="white" />
						</div>
					)}
					<div />
					<label htmlFor="fileUpload" className="w-full text-center text-balance">
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
						{fromType.allowClipboard && (
							<Button variant="secondary" className="w-fit z-10" onClick={() => convertAndSaveFile(true)}>
								<Copy size={16} strokeWidth={2} className="mr-3" />
								Copy to Clipboard as {toType.name}
							</Button>
						)}
					</div>
				) : null}
			</div>
		</div>
	);
}

export function TextConverter({ converter }) {
	const fromType = fileTypes[converter.types[0]] || {};
	const toType = fileTypes[converter.types[1]] || {};

	const [output, setOutput] = useState("");
	const [fileName, setFileName] = useState("");
	const [errorMessage, setErrorMessage] = useState("");
	const [copiedState, setCopiedState] = useState(false);
	const [hasInput, setHasInput] = useState(false);

	const inputRef = useRef<HTMLTextAreaElement>(null);
	const copyButtonRef = useRef<HTMLButtonElement>(null);

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
						setHasInput(true);
					}
				};
				reader.readAsText(file);
			}
		});
	}

	function convertFile() {
		const input = inputRef.current?.value || "";

		let convertFunction = TEXT_FILE_CONVERTER_FUNCTIONS[converter.alternativeTo || converter.slug];
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
		downloadFile(url, generateFileName(fileName.length ? fileName : converter.slug, toType.resultExtension));
	}

	function copyOutputToClipboard() {
		navigator.clipboard.writeText(output);
		setCopiedState(true);
		setTimeout(() => setCopiedState(false), 2000);
	}

	function onInputChange(event) {
		setOutput("");
		setHasInput(event.target.value.length > 0);

		if (event.target.value.length == 0) {
			setFileName("");
		}
	}

	useEffect(() => {
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
							setHasInput(true);
						}
					};
					reader.readAsText(file);
					break;
				}
			}
		};

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
		<div className="flex flex-row w-full gap-4 h-[550px] max-md:h-[900px] max-md:flex-col">
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
						onChange={onInputChange}
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
							<p className={cn("w-full h-full p-4 pb-20 overflow-auto text-sm whitespace-pre", fragmentMono.className)}>
								{output}
							</p>
							<div className="absolute bottom-0 left-4 right-4 pb-4 flex flex-row flex-wrap justify-center gap-3">
								<div className="flex-1 bg-zinc-100">
									<Button className="w-full" onClick={onDownloadClick}>
										<Download size={16} strokeWidth={2} className="mr-3" />
										Download as {toType.name}
									</Button>
								</div>
								<div className="flex-1 bg-zinc-100">
									<Button ref={copyButtonRef} variant="tertiary" className="w-full" onClick={copyOutputToClipboard}>
										{copiedState ? (
											<Check size={16} strokeWidth={2} className="mr-3" />
										) : (
											<Copy size={16} strokeWidth={2} className="mr-3" />
										)}
										{copiedState ? "Copied" : "Copy to Clipboard"}
									</Button>
								</div>
							</div>
						</>
					) : (
						<div className="w-full h-full flex flex-col gap-4 p-4 items-center justify-center">
							<Button className={`w-fit ${hasInput ? "opacity-100" : "opacity-50"}`} onClick={convertFile}>
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

async function convertImage(file: File, toTypeId: string, toClipboard = false): Promise<string | Blob> {
	const toType = fileTypes[toTypeId];

	if (!toType) {
		throw new Error(`"${toTypeId}" is not a valid file type. Please try again with a different file type.`);
	}

	const dummyCanvas = document.createElement("canvas");
	try {
		// Check for result file type support
		const testDataURL = dummyCanvas.toDataURL(toType.mimeType);
		if (testDataURL === "data:,") {
			throw new Error(notSupportedErrorMessage(toType.mimeType, toType.name));
		}
	} catch (error) {
		throw new Error(notSupportedErrorMessage(toType.mimeType, toType.name));
	}

	if (!file) {
		throw new Error("No file found. Please upload a file.");
	}

	if (!file.type.includes("image")) {
		throw new Error("Please upload an image file.");
	}

	return new Promise((resolve, reject) => {
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
					if (toClipboard) {
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

async function convertAudioFile(file: File, toTypeId: string): Promise<string> {
	const toType = fileTypes[toTypeId];

	if (!toType) {
		throw new Error(`"${toTypeId}" is not a valid file type. Please try again with a different file type.`);
	}

	try {
		// Create a new AudioContext
		const audioContext = new AudioContext();

		// Read the file as an ArrayBuffer using FileReader
		const arrayBuffer = (await new Promise((resolve, reject) => {
			const reader = new FileReader();
			reader.onload = () => resolve(reader.result as ArrayBuffer);
			reader.onerror = (error) => reject(error);
			reader.readAsArrayBuffer(file);
		})) as ArrayBuffer;

		// Decode the audio file into an AudioBuffer
		const audioBuffer = await audioContext.decodeAudioData(arrayBuffer);

		if (toTypeId === "wav") {
			// Use the audiobuffer-to-wav package to convert the AudioBuffer to WAV
			const wavBuffer = toWav(audioBuffer);

			// Convert the WAV buffer to a Blob
			const wavBlob = new Blob([wavBuffer], { type: "audio/wav" });

			// Create a URL for the Blob and return it
			const wavURL = URL.createObjectURL(wavBlob);
			return wavURL;
		} else if (toTypeId === "mp3") {
			// Convert AudioBuffer to WAV samples
			const leftChannel = audioBuffer.getChannelData(0); // For simplicity, this example assumes mono audio
			const samples = new Int16Array(leftChannel.length);
			for (let i = 0; i < samples.length; i++) {
				samples[i] = leftChannel[i] * 0x7fff; // Convert float32 audio data to int16
			}

			// Step 3: Use lamejs to encode the WAV samples to MP3
			const mp3Encoder = new lamejs.Mp3Encoder(1, audioBuffer.sampleRate, 128); // 1 channel (mono), sample rate, 128 kbps
			const mp3Data = mp3Encoder.encodeBuffer(samples);
			const mp3End = mp3Encoder.flush(); // Finalize the MP3 data

			// Combine the encoded MP3 data chunks
			const mp3Blob = new Blob([mp3Data, mp3End], { type: "audio/mp3" });

			// Step 4: Resolve the promise with the MP3 Blob
			return URL.createObjectURL(mp3Blob);
		}
	} catch (error) {
		throw error;
	}
}

async function convertImageToPDF(file: File, toTypeId: string): Promise<string> {
	return new Promise(async (resolve, reject) => {
		const toType = fileTypes[toTypeId];

		if (!toType) {
			reject(new Error(`"${toTypeId}" is not a valid file type. Please try again with a different file type.`));
			return;
		}

		// Convert AVIF and WebP images to PNG for compatibility
		let conversionNeeded = false;
		let imageFormat = "JPEG"; // Default to JPEG
		if (file.type === "image/png") {
			imageFormat = "PNG";
		} else if (file.type === "image/bmp") {
			imageFormat = "BMP";
		} else if (file.type === "image/gif") {
			imageFormat = "GIF";
		} else if (file.type === "image/avif" || file.type === "image/webp") {
			conversionNeeded = true;
			imageFormat = "PNG"; // Convert to PNG for compatibility
		}

		if (conversionNeeded) {
			try {
				const convertedImageURL = await convertImage(file, "png"); // Assuming convertImage returns a Data URL
				file = await fetch(convertedImageURL as string)
					.then((r) => r.blob())
					.then((blobFile) => new File([blobFile], "converted_image.png", { type: "image/png" }));
			} catch (error) {
				reject(new Error("Error converting image"));
				return;
			}
		}

		const reader = new FileReader();
		reader.onload = function (e) {
			const img = new Image();
			img.onload = function () {
				const pdf = new jsPDF({
					orientation: img.width > img.height ? "l" : "p",
					unit: "px",
					format: [img.width, img.height],
				});
				pdf.addImage(e.target.result as string, imageFormat, 0, 0, img.width, img.height);

				const pdfBlob = pdf.output("blob");
				const pdfUrl = URL.createObjectURL(pdfBlob);
				resolve(pdfUrl);
			};
			img.onerror = function () {
				reject(new Error("Error loading the image"));
			};
			img.src = e.target.result as string;
		};
		reader.onerror = function () {
			reject(new Error("Error reading the file"));
		};
		reader.readAsDataURL(file);
	});
}

function convertJSONtoCSV(input) {
	const json = JSON.parse(input); // Attempt to parse the JSON input
	return json2csv(json, {
		expandNestedObjects: true,
	});
}

function convertCSVtoJSON(input) {
	return JSON.stringify(csv2json(input), null, 2);
}

function convertJSONtoYAML(input) {
	return YAML.stringify(JSON.parse(input));
}

function convertYAMLtoJSON(input) {
	return JSON.stringify(YAML.parse(input), null, 2);
}

function convertRTFtoTXT(input) {
	let rtf = input.replace(/\\par[d]?/g, "");
	rtf = rtf.replace(/\{\*?\\[^{}]+}|[{}]|\\\n?[A-Za-z]+\n?(?:-?\d+)?[ ]?/g, "");
	return rtf.replace(/\\'[0-9a-zA-Z]{2}/g, "").trim();
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
