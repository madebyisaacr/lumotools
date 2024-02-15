"use client";

import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useRef } from "react";

import { Input } from "@/components/ui/input";
import {
	Form,
	FormControl,
	FormDescription,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from "@/components/ui/form";
import { Button } from "@/components/ui/button";

const formSchema = z.object({
	file: z.string().url(),
});

export default function FileConverter() {
	const fileInputRef = useRef<HTMLInputElement>(null);

	const form = useForm<z.infer<typeof formSchema>>({
		resolver: zodResolver(formSchema),
		defaultValues: {
			file: "",
		},
	});

	function onSubmit(values: z.infer<typeof formSchema>) {
		if (fileInputRef.current?.files?.length) {
			const file = fileInputRef.current.files[0];
			
			webpToJpg(file);
		}
	}

	return (
			<Form {...form}>
				<form
					onSubmit={form.handleSubmit(onSubmit)}
					className="flex flex-col gap-4"
				>
					<FormField
						control={form.control}
						name="file"
						render={({ field }) => {
							const {ref, ...rest} = field;
							return (
								<FormItem>
									<FormLabel htmlFor="image">
										WebP Image
									</FormLabel>
									<FormControl>
										<Input
											id="image"
											type="file"
											accept=".webp"
											{...rest}
											ref={(e) => {
												ref(e);
												fileInputRef.current = e;
											}}
										/>
									</FormControl>
									<FormDescription>
										Upload a WebP image to convert to JPG.
									</FormDescription>
									<FormMessage />
								</FormItem>
							);
						}}
					></FormField>
					<Button type="submit">Download as JPG</Button>
				</form>
			</Form>
	);
}

function webpToJpg(file: File) {
    if (file) {
        // Ensure it's a WEBP image
        if (file.type === "image/webp") {
            const reader = new FileReader();
            
            reader.onload = function(event) {
                const img = new Image();
                img.onload = function() {
                    // Create a canvas element to draw the WEBP image
                    const canvas = document.createElement('canvas');
                    canvas.width = img.width;
                    canvas.height = img.height;

                    // Draw the image onto the canvas
                    const ctx = canvas.getContext('2d');
                    ctx.drawImage(img, 0, 0);

                    // Convert the canvas to a JPG image
                    const jpgUrl = canvas.toDataURL('image/jpeg', 1.0);
                    
                    // Download or display the JPG image
                    downloadImage(jpgUrl, 'converted-image.jpg');
                };

                img.src = event.target.result;
            };

            reader.readAsDataURL(file);
        } else {
            alert("Please upload a WEBP image.");
        }
    } else {
        alert("Please upload a file.");
    }
}

function downloadImage(url, fileName) {
    const a = document.createElement('a');
    a.href = url;
    a.download = fileName;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
}
