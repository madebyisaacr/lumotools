import { Check } from "lucide-react";

export default function ChecklistItem({ children }) {
	return (
		<p className="text-zinc-500">
			<Check size={20} strokeWidth={2.5} className="inline mr-2 mb-0.5"/>{children}
		</p>
	);
}
