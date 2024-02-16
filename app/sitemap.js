import { fileConverterSlugs } from "@/lib/file-types";

const DOMAIN = "https://lumotools.com"

export default function sitemap() {
	return [
		{ url: DOMAIN },
        ...(fileConverterSlugs.map((slug) => ({
            url: `${DOMAIN}/convert/${slug}`,
        }))),
	];
}
