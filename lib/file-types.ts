const TITLES = {
	image: ["image", "images"],
	audio: ["file", "audio files"],
	file: ["file", "files"],
};

export const fileCategories = {
	text: {
		name: "Text File",
		description:
			"Convert between text-based file formats, such as JSON, CSV, XML, and more, to manage and transform your data.",
	},
	image: {
		name: "Image",
		description:
			"Convert between popular image formats, such as WebP, JPG, PNG, and more, to optimize your images for the web and other uses.",
	},
	audio: {
		name: "Audio",
		description:
			"Convert between audio file formats, such as MP3, WAV, OGG, and more, to optimize your audio for streaming and storage.",
	},
};

export const fileTypes = {
	webp: {
		name: "WebP",
		extensions: ["webp"],
		titles: TITLES.image,
		mimeType: "image/webp",
		allowClipboard: false,
		description:
			"WebP is a modern image format that provides superior lossless and lossy compression for web images, making them smaller in size while maintaining high quality.",
		category: "image",
	},
	jpg: {
		name: "JPG",
		extensions: ["jpg", "jpeg"],
		titles: TITLES.image,
		mimeType: "image/jpeg",
		description:
			"JPG files are a popular image format known for their efficient compression, which allows for reduced file sizes while maintaining relatively high image quality, making them ideal for sharing and storing photographs and digital images on the web and in various devices.",
		category: "image",
	},
	jpeg: {
		name: "JPEG",
		extensions: ["jpg", "jpeg"],
		titles: TITLES.image,
		mimeType: "image/jpeg",
		description:
			"JPEG files, also known as JPG, are a popular format for digital images, characterized by their compression which balances image quality with file size.",
		category: "image",
	},
	png: {
		name: "PNG",
		extensions: ["png"],
		titles: TITLES.image,
		mimeType: "image/png",
		description:
			"PNG (Portable Network Graphics) is a lossless image format known for its high-quality, transparent graphics suitable for the web and image editing.",
		category: "image",
	},
	gif: {
		name: "GIF",
		extensions: ["gif"],
		titles: TITLES.image,
		mimeType: "image/gif",
		description:
			"GIF files are a type of image file format that supports both animated and static images, using a palette of up to 256 colors.",
		category: "image",
	},
	csv: {
		name: "CSV",
		extensions: ["csv"],
		titles: TITLES.file,
		mimeType: "text/csv",
		description: "CSV files are plain text files that use commas to separate values, often used for storing tabular data.",
		category: "text",
	},
	markdown: {
		name: "Markdown",
		extensions: ["md", "markdown", "txt"],
		titles: TITLES.file,
		mimeType: "text/markdown",
		resultExtension: "md",
		description:
			"Markdown files are text files that use Markdown formatting to structure content, making it easy to read in plain text yet capable of being converted into HTML or other formats.",
		category: "text",
	},
	xml: {
		name: "XML",
		extensions: ["xml"],
		titles: TITLES.file,
		mimeType: "application/xml",
		description:
			"XML files are structured text files used to store and transport data, using tags to define objects and attributes in a hierarchical format that is both human-readable and machine-parseable.",
		category: "text",
	},
	json: {
		name: "JSON",
		extensions: ["json"],
		titles: TITLES.file,
		mimeType: "application/json",
		description:
			"JSON (JavaScript Object Notation) files are a lightweight data-interchange format that uses human-readable text to store and transmit data objects consisting of attribute-value pairs and arrays.",
		category: "text",
	},
	yaml: {
		name: "YAML",
		extensions: ["yaml", "yml"],
		titles: TITLES.file,
		mimeType: "text/yaml",
		description:
			"YAML files are a human-readable data serialization format used for configuration files, data exchange between languages, and more, employing a structure of key-value pairs, lists, and nested objects.",
		category: "text",
	},
	psd: {
		name: "PSD",
		extensions: ["psd"],
		titles: TITLES.file,
		mimeType: "image/vnd.adobe.photoshop",
		description:
			"PSD files are proprietary layered image files used by Adobe Photoshop, designed to support a wide range of imaging options within a single file.",
		category: "image",
	},
	bmp: {
		name: "BMP",
		extensions: ["bmp"],
		titles: TITLES.image,
		mimeType: "image/bmp",
		description:
			"BMP files are a bitmap image format used for storing digital images, characterized by their simple structure and lack of compression, leading to large file sizes but high quality.",
		category: "image",
	},
	avif: {
		name: "AVIF",
		extensions: ["avif"],
		titles: TITLES.image,
		mimeType: "image/avif",
		allowClipboard: false,
		description:
			"AVIF (AV1 Image File Format) is a new, highly efficient image format derived from the key frames of AV1 video codec, designed for compression, quality, and versatility in web usage.",
		category: "image",
	},
	pdf: {
		name: "PDF",
		extensions: ["pdf"],
		titles: TITLES.file,
		mimeType: "application/pdf",
		description:
			"PDF files are a universal file type designed for sharing documents that maintain their formatting regardless of the software, hardware, or operating system used to view them.",
		category: "text",
	},
	rtf: {
		name: "RTF",
		extensions: ["rtf"],
		titles: TITLES.file,
		mimeType: "application/rtf",
		description:
			"RTF files, or Rich Text Format documents, are text files that include formatting such as fonts, styles, and colors, compatible across different word processing programs.",
		category: "text",
	},
	txt: {
		name: "TXT",
		extensions: ["txt"],
		titles: TITLES.file,
		mimeType: "text/plain",
		description:
			"TXT files are plain text documents that contain unformatted text, readable by various text editors and word processing software without specialized formatting.",
		category: "text",
	},
	mp3: {
		name: "MP3",
		extensions: ["mp3"],
		titles: TITLES.audio,
		mimeType: "audio/mpeg",
		description:
			"MP3 files are a type of digital audio file that uses a form of lossy data compression to reduce file size while retaining a sound quality that is close to the original recording.",
		category: "audio",
	},
	ogg: {
		name: "Ogg",
		extensions: ["ogg"],
		titles: TITLES.audio,
		mimeType: "audio/ogg",
		description:
			"Ogg Vorbis files are a type of audio file format that uses the Ogg container format and the Vorbis compression codec, designed for efficient streaming and high-quality audio compression.",
		category: "audio",
	},
	wav: {
		name: "WAV",
		extensions: ["wav"],
		titles: TITLES.audio,
		mimeType: "audio/wav",
		description:
			"WAV audio files are a digital audio format standard for storing waveform data, allowing high-quality, uncompressed sound recordings.",
		category: "audio",
	},
	aac: {
		name: "AAC",
		extensions: ["aac"],
		titles: TITLES.audio,
		mimeType: "audio/aac",
		description:
			"AAC (Advanced Audio Coding) is a digital audio compression format that provides high-quality audio at lower bitrates than MP3, making it efficient for streaming and storage.",
		category: "audio",
	},
};

// Add IDs and default values to file types
for (const typeId in fileTypes) {
	const type = fileTypes[typeId];

	type.id = typeId;
	type.resultExtension = type.resultExtension || typeId;
	if (type.allowClipboard === undefined) {
		type.allowClipboard = true;
	}
}

export const fileConverters = [
	{ types: ["webp", "jpg"], component: "file" },
	{ types: ["webp", "png"], component: "file" },
	{ types: ["jpg", "webp"], component: "file" },
	{ types: ["jpg", "png"], component: "file" },
	{ types: ["png", "webp"], component: "file" },
	{ types: ["png", "jpg"], component: "file" },
	{ types: ["avif", "webp"], component: "file" },
	{ types: ["avif", "jpg"], component: "file" },
	{ types: ["avif", "png"], component: "file" },
	{ types: ["bmp", "webp"], component: "file" },
	{ types: ["bmp", "jpg"], component: "file" },
	{ types: ["bmp", "png"], component: "file" },
	{ types: ["jpeg", "jpg"], component: "file" },
	{ types: ["jpg", "jpeg"], component: "file" },
	{ types: ["json", "csv"], component: "text" },
	{ types: ["json", "yaml"], component: "text" },
	{ types: ["csv", "json"], component: "text" },
	{ types: ["yaml", "json"], component: "text" },
	{ types: ["rtf", "txt"], component: "text" },
	{ types: ["mp3", "wav"], component: "file" },
	{ types: ["wav", "mp3"], component: "file" },
	{ types: ["ogg", "mp3"], component: "file" },
	{ types: ["ogg", "wav"], component: "file" },
	{ types: ["aac", "mp3"], component: "file" },
	{ types: ["aac", "wav"], component: "file" },
];

// Add jpeg duplicates to converters with jpg
for (const converter of fileConverters) {
	const { types } = converter;

	// Skip if both types are jpg or jpeg
	if ((types[0] == "jpg" || types[0] == "jpeg") && (types[1] == "jpg" || types[1] == "jpeg")) {
		continue;
	}

	if (types[0] === "jpg") {
		fileConverters.push({ ...converter, types: ["jpeg", types[1]] });
	} else if (types[1] === "jpg") {
		fileConverters.push({ ...converter, types: [types[0], "jpeg"] });
	}
}

export const fileConverterSlugs = [];

for (const converter of fileConverters) {
	fileConverterSlugs.push(`${converter.types[0]}-to-${converter.types[1]}`);
}
