import { fileTypes } from "@/lib/file-types";
import {
	Image,
	Volume2,
	Video,
	Type,
	Table2,
	Braces,
	Text,
	Code2,
	ListTree,
	AudioWaveform,
	Images,
	TableProperties,
	SquareUserRound,
} from "lucide-react";

const icons = {
	image: Image,
	gif: Images,
	audio: Volume2,
	video: Video,
	font: Type,
	table: Table2,
	braces: Braces,
	text: Text,
	code: Code2,
	listTree: ListTree,
	waveform: AudioWaveform,
	tableProperties: TableProperties,
	user: SquareUserRound,
};

export function FileIcon({ type, size = 100, hideText = false }) {
	const fileType = fileTypes[type];
	const Icon = icons[fileType.icon];

	return (
		<div
			className="relative"
			style={{
				backgroundColor: fileType.accentColor,
				width: size / 1.2,
				height: size,
				borderRadius: (12 * size) / 120,
				clipPath: `polygon(0 0, 70% 0, 100% ${(size / 1.2) * 0.3}px, 100% 100%, 0 100%)`,
			}}
		>
			<div
				className="bg-white/20 absolute right-0"
				style={{ width: (size / 1.2) * 0.3, height: (size / 1.2) * 0.3, borderBottomLeftRadius: (12 * size) / 120 }}
			/>
			{hideText ? null : (
				<span
					className="font-bold text-white absolute top-[4%] left-[36%] select-none"
					style={{ translate: "-50% 0", fontSize: (size / 120) * 20 }}
				>
					{type == "markdown" ? "MD" : fileType.name}
				</span>
			)}
			{Icon && (
				<Icon
					color="white"
					size={(60 * size) / 120}
					className="absolute left-[50%] top-[58%]"
					style={{ transform: "translate(-50%,-50%)" }}
				/>
			)}
		</div>
	);
}

export function FileIconMinimal({ type, size = 16, color = "accent", className = "" }) {
	const fileType = fileTypes[type];
	const Icon = icons[fileType.icon];

	if (!Icon) {
		return null;
	}

	return <Icon size={size} color={color == "accent" ? fileType.accentColor : color} className={className} />;
}
