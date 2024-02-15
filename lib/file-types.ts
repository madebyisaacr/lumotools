const TITLES = {
    image: ["image", "images"],
    audio: ["audio file", "audio files"],
    file: ["file", "files"],
}

export const fileTypes = {
    webp: {
        name: "WebP",
        extensions: ["webp"],
        titles: TITLES.image,
    },
    jpg: {
        name: "JPG",
        extensions: ["jpg", "jpeg"],
        titles: TITLES.image,
    },
    png: {
        name: "PNG",
        extensions: ["png"],
        titles: TITLES.image,
    },
    gif: {
        name: "GIF",
        extensions: ["gif"],
        titles: TITLES.image,
    },
    csv: {
        name: "CSV",
        extensions: ["csv"],
        titles: TITLES.file,
    },
    markdown: {
        name: "Markdown",
        extensions: ["md", "markdown"],
        titles: TITLES.file,
    },
    xml: {
        name: "XML",
        extensions: ["xml"],
        titles: TITLES.file,
    },
    json: {
        name: "JSON",
        extensions: ["json"],
        titles: TITLES.file,
    },
    yaml: {
        name: "YAML",
        extensions: ["yaml", "yml"],
        titles: TITLES.file,
    },
    psd: {
        name: "PSD",
        extensions: ["psd"],
        titles: TITLES.file,
    },
    mp3: {
        name: "MP3",
        extensions: ["mp3"],
        titles: TITLES.audio,
    },
};