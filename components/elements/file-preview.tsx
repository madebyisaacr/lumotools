import { useEffect, useState, useRef } from "react";
import WaveSurfer from "wavesurfer.js";

const WAVEFORM_ID = "waveform";

export function FilePreview({ file }: { file: File }) {
	const [dataUrl, setDataUrl] = useState<string | null>(null);
	const wavesurferRef = useRef(null);

	useEffect(() => {
		const url = URL.createObjectURL(file);
		setDataUrl(url);

		if (file.type.startsWith("audio/")) {
			if (wavesurferRef.current) {
				// Destroy the existing instance or update it
				wavesurferRef.current.destroy();
			}
			wavesurferRef.current = WaveSurfer.create({
				container: `#${WAVEFORM_ID}`,
				waveColor: `hsl(${window.getComputedStyle(document.documentElement).getPropertyValue("--primary")})`,
				barWidth: 4,
				barRadius: 2,
				interact: false,
				cursorColor: "transparent",
				normalize: true,
			});
			wavesurferRef.current.load(url);
		}
	}, [file]);

	if (file.type.startsWith("image/")) {
		return <img src={dataUrl} alt={file.name} className="h-36 object-cover rounded-md" />;
	} else if (file.type.startsWith("audio/")) {
		return <div id={WAVEFORM_ID} className="w-full h-36 pointer-events-none" />;
	}

	return <div />;
}
