import { useRef, useState } from "react";
import { cn } from "../lib/cn.ts";

type MessageInputProps = {
	onSend: (content: string) => void;
	placeholder?: string;
};

export function MessageInput({
	onSend,
	placeholder = "Type a message...",
}: MessageInputProps): React.ReactElement {
	const [value, setValue] = useState("");
	const inputRef = useRef<HTMLInputElement>(null);

	const handleSubmit = (e: React.FormEvent) => {
		e.preventDefault();
		const trimmed = value.trim();
		if (trimmed) {
			onSend(trimmed);
			setValue("");
			inputRef.current?.focus();
		}
	};

	return (
		<footer className="fixed bottom-0 inset-x-0 z-40 bg-background border-t border-border">
			<form onSubmit={handleSubmit} className="flex gap-2 p-3 max-w-lg mx-auto">
				<input
					ref={inputRef}
					type="text"
					value={value}
					onChange={(e) => setValue(e.target.value)}
					placeholder={placeholder}
					className="flex-1 px-4 py-2 rounded-full bg-muted text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
				/>
				<button
					type="submit"
					disabled={!value.trim()}
					className={cn(
						"w-10 h-10 rounded-full flex items-center justify-center transition-colors",
						value.trim()
							? "bg-primary text-primary-foreground hover:bg-primary/90"
							: "bg-muted text-muted-foreground",
					)}
				>
					<SendIcon className="w-5 h-5" />
				</button>
			</form>
		</footer>
	);
}

function SendIcon({ className }: { className?: string }): React.ReactElement {
	return (
		<svg
			xmlns="http://www.w3.org/2000/svg"
			viewBox="0 0 24 24"
			fill="none"
			stroke="currentColor"
			strokeWidth="2"
			strokeLinecap="round"
			strokeLinejoin="round"
			className={className}
		>
			<path d="m22 2-7 20-4-9-9-4Z" />
			<path d="M22 2 11 13" />
		</svg>
	);
}
