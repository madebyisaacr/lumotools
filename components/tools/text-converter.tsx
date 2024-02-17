"use client";

import { useRef, useState, useEffect } from "react";

import { fileTypes } from "@/lib/file-types";
import { UploadCloud, Download, Copy } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function FileConverter({ fromTypeId, toTypeId }) {
	const fromType = fileTypes[fromTypeId] || {};
	const toType = fileTypes[toTypeId] || {};

	return (
		<div className="flex justify-between p-4">
			<textarea className="w-1/2 h-32 p-2 border border-zinc-300 rounded-lg resize-none" placeholder="Type something..." />
			<div className="w-1/2 h-32 bg-blue-500 text-white flex items-center justify-center p-2 ml-4 rounded-lg">
				Rectangle with text
			</div>
		</div>
	);
}
