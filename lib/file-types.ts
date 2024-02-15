const TITLES = {
	image: ["image", "images"],
	audio: ["file", "audio files"],
	file: ["file", "files"],
};

export const fileTypes = {
	webp: {
		name: "WebP",
		extensions: ["webp"],
		titles: TITLES.image,
		mimeType: "image/webp",
		allowClipboard: false,
	},
	jpg: {
		name: "JPG",
		extensions: ["jpg", "jpeg"],
		titles: TITLES.image,
		mimeType: "image/jpeg",
	},
	jpeg: {
		name: "JPEG",
		extensions: ["jpg", "jpeg"],
		titles: TITLES.image,
		mimeType: "image/jpeg",
	},
	png: {
		name: "PNG",
		extensions: ["png"],
		titles: TITLES.image,
		mimeType: "image/png",
	},
	gif: {
		name: "GIF",
		extensions: ["gif"],
		titles: TITLES.image,
		mimeType: "image/gif",
	},
	csv: {
		name: "CSV",
		extensions: ["csv"],
		titles: TITLES.file,
		mimeType: "text/csv",
	},
	markdown: {
		name: "Markdown",
		extensions: ["md", "markdown", "txt"],
		titles: TITLES.file,
		mimeType: "text/markdown",
		resultExtension: "md",
	},
	xml: {
		name: "XML",
		extensions: ["xml"],
		titles: TITLES.file,
		mimeType: "application/xml",
	},
	json: {
		name: "JSON",
		extensions: ["json"],
		titles: TITLES.file,
		mimeType: "application/json",
	},
	yaml: {
		name: "YAML",
		extensions: ["yaml", "yml"],
		titles: TITLES.file,
		mimeType: "text/yaml",
	},
	psd: {
		name: "PSD",
		extensions: ["psd"],
		titles: TITLES.file,
		mimeType: "image/vnd.adobe.photoshop",
	},
	mp3: {
		name: "MP3",
		extensions: ["mp3"],
		titles: TITLES.audio,
		mimeType: "audio/mpeg",
	},
	bmp: {
		name: "BMP",
		extensions: ["bmp"],
		titles: TITLES.image,
		mimeType: "image/bmp",
	},
};

// Add IDs and default values to file types
for (const typeId in fileTypes) {
	const type = fileTypes[typeId];

	type.id = typeId;
	type.resultExtension = type.resultExtension || type;
	if (type.allowClipboard === undefined) {
		type.allowClipboard = true
	}
}

export const fileConverters = [
    {types: ["webp", "jpg"]},
    {types: ["webp", "png"]},
    {types: ["jpg", "webp"]},
	{types: ["jpg", "png"]},
	{types: ["png", "webp"]},
	{types: ["png", "jpg"]},
	{types: ["bmp", "webp"]},
	{types: ["bmp", "jpg"]},
	{types: ["bmp", "png"]},
	{types: ["jpeg", "jpg"]},
	{types: ["jpg", "jpeg"]},
]

// Add jpeg duplicates to converters with jpg
for (const converter of fileConverters) {
	const {types} = converter;

	// Skip if both types are jpg or jpeg
	if ((types[0] == "jpg" || types[0] == "jpeg") && (types[1] == "jpg" || types[1] == "jpeg")) {
		continue;
	}

	if (types[0] === "jpg") {
		fileConverters.push({ types: ["jpeg", types[1]] });
	} else if (types[1] === "jpg") {
		fileConverters.push({ types: [types[0], "jpeg"] });
	}
}

export const fileConverterSlugs = fileConverters.map(({ types }) => `${types[0]}-to-${types[1]}`);
