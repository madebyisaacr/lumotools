const TITLES = {
	image: ["image", "images"],
	audio: ["audio file", "audio files"],
	file: ["file", "files"],
};

export const fileTypes = {
	webp: {
		name: "WebP",
		extensions: ["webp"],
		titles: TITLES.image,
		allowClipboard: false,
	},
	jpg: {
		name: "JPG",
		extensions: ["jpg", "jpeg"],
		titles: TITLES.image,
		allowClipboard: true,
	},
	png: {
		name: "PNG",
		extensions: ["png"],
		titles: TITLES.image,
		allowClipboard: true,
	},
	gif: {
		name: "GIF",
		extensions: ["gif"],
		titles: TITLES.image,
		allowClipboard: true,
	},
	csv: {
		name: "CSV",
		extensions: ["csv"],
		titles: TITLES.file,
		allowClipboard: true,
	},
	markdown: {
		name: "Markdown",
		extensions: ["md", "markdown", "txt"],
		titles: TITLES.file,
		allowClipboard: true,
	},
	xml: {
		name: "XML",
		extensions: ["xml"],
		titles: TITLES.file,
		allowClipboard: true,
	},
	json: {
		name: "JSON",
		extensions: ["json"],
		titles: TITLES.file,
		allowClipboard: true,
	},
	yaml: {
		name: "YAML",
		extensions: ["yaml", "yml"],
		titles: TITLES.file,
		allowClipboard: true,
	},
	psd: {
		name: "PSD",
		extensions: ["psd"],
		titles: TITLES.file,
		allowClipboard: true,
	},
	mp3: {
		name: "MP3",
		extensions: ["mp3"],
		titles: TITLES.audio,
		allowClipboard: true,
	},
};

// Add IDs to file types
for (const type in fileTypes) {
	fileTypes[type].id = type;
}

export const fileConverters = [
    {types: ["webp", "jpg"]},
    {types: ["webp", "png"]},
	{types: ["csv", "json"]},
]

export const fileConverterSlugs = fileConverters.map(({ types }) => `${types[0]}-to-${types[1]}`);
