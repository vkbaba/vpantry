import { OgpData } from "@/utils/ogp";

type Props = {
    ogp: OgpData;
};

export default function LinkCard({ ogp }: Props) {
    const hostname = new URL(ogp.url).hostname;

    return (
        <a
            href={ogp.url}
            target="_blank"
            rel="noopener noreferrer"
            className="!block my-6 border border-blog-border rounded-lg overflow-hidden hover:bg-blog-accent-secondary/30 transition-colors no-underline"
        >
            <span className="flex">
                <span className="flex-1 p-4 min-w-0 block">
                    <span className="block text-lg font-semibold text-blog-text line-clamp-2">
                        {ogp.title}
                    </span>
                    {ogp.description && (
                        <span className="block text-sm text-blog-text/70 mt-2 line-clamp-2">
                            {ogp.description}
                        </span>
                    )}
                    <span className="flex text-sm text-blog-text/50 mt-2 items-center gap-1">
                        <span>{ogp.siteName || hostname}</span>
                    </span>
                </span>
                {ogp.image && (
                    <span className="block w-32 sm:w-48 flex-shrink-0">
                        <img
                            src={ogp.image}
                            alt=""
                            className="w-full h-full object-cover"
                        />
                    </span>
                )}
            </span>
        </a>
    );
}
