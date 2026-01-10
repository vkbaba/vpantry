export interface OgpData {
    url: string;
    title: string;
    description?: string;
    image?: string;
    siteName?: string;
}

export async function fetchOgp(url: string): Promise<OgpData | null> {
    try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 5000);

        const response = await fetch(url, {
            signal: controller.signal,
            headers: {
                'User-Agent': 'Mozilla/5.0 (compatible; OGPFetcher/1.0)',
            },
        });
        clearTimeout(timeoutId);

        if (!response.ok) {
            return null;
        }

        const html = await response.text();

        const getMetaContent = (property: string): string | undefined => {
            const match = html.match(new RegExp(`<meta[^>]*property=["']${property}["'][^>]*content=["']([^"']*)["']`, 'i'))
                || html.match(new RegExp(`<meta[^>]*content=["']([^"']*)["'][^>]*property=["']${property}["']`, 'i'));
            return match?.[1];
        };

        const getMetaName = (name: string): string | undefined => {
            const match = html.match(new RegExp(`<meta[^>]*name=["']${name}["'][^>]*content=["']([^"']*)["']`, 'i'))
                || html.match(new RegExp(`<meta[^>]*content=["']([^"']*)["'][^>]*name=["']${name}["']`, 'i'));
            return match?.[1];
        };

        const getTitle = (): string => {
            const ogTitle = getMetaContent('og:title');
            if (ogTitle) return ogTitle;

            const titleMatch = html.match(/<title[^>]*>([^<]*)<\/title>/i);
            return titleMatch?.[1] || url;
        };

        const title = getTitle();
        const description = getMetaContent('og:description') || getMetaName('description');
        const image = getMetaContent('og:image');
        const siteName = getMetaContent('og:site_name');

        return {
            url,
            title,
            description,
            image,
            siteName,
        };
    } catch (error) {
        console.error(`Failed to fetch OGP for ${url}:`, error);
        return null;
    }
}

// URLのみの行のパターンを検出
// [https://example.com](https://example.com) の形式
export function extractUrlOnlyLinks(content: string): string[] {
    const urlPattern = /^\[https?:\/\/[^\]]+\]\(https?:\/\/[^)]+\)$/gm;
    const matches = content.match(urlPattern) || [];

    return matches.map(match => {
        const urlMatch = match.match(/\((https?:\/\/[^)]+)\)/);
        return urlMatch?.[1] || '';
    }).filter(Boolean);
}
