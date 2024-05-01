import fs from 'fs';
import matter from 'gray-matter';
import path from 'path';

interface PostMetadata {
    title: string;
    date: string;
    categories: string[];
    tags: string[];
    coverImage: string;
    slug: string;
}

function getAllFiles(dir: string): string[] {
    const files = fs.readdirSync(dir);
    const allFiles: string[] = [];
    files.forEach(file => {
        const filePath = path.join(dir, file);
        const stat = fs.statSync(filePath);
        if (stat.isDirectory()) {
            const subdirectoryFiles = getAllFiles(filePath);
            allFiles.push(...subdirectoryFiles);
        } else {
            allFiles.push(filePath);
        }
    });
    return allFiles;
};

export function getPostsMetadata(basePath: string): PostMetadata[] {

    const markdownFiles = getAllFiles(basePath).filter(file => file.endsWith('.md')); 
    const posts = markdownFiles.map((filePath) => {
        const fileContents = fs.readFileSync(filePath, 'utf8');
        const matterResult = matter(fileContents);
        const filename = path.basename(filePath);
        // slug is the name of the directory containing the markdown file
        const pathParts = filePath.split(path.sep);
        const slug = pathParts[pathParts.length - 2];
        return {
            title: matterResult.data.title,
            date: matterResult.data.date,
            categories: matterResult.data.categories,
            tags: matterResult.data.tags?.map((tag: string) => `${tag}`),
            coverImage: matterResult.data.coverImage,
            slug: slug,
        };
    });

    return posts;
}

export function getPostContent(basePath: string, slug: string): matter.GrayMatterFile<string> {

    const markdownFiles = getAllFiles(basePath).filter(file => file.endsWith('.md'));
    const file = markdownFiles.filter(file => file.includes(slug));
    if (!file) {        
        throw new Error(`File not found: ${slug}`);
    } else if (file.length > 1) {
        throw new Error(`Multiple files found: ${slug}`);
    }

    const content = fs.readFileSync(file[0], 'utf8');

    const matterResult = matter(content)
    return matterResult
}


// export function getPostContent(basePath: string, slug: string): matter.GrayMatterFile<string> {
//     const markdownFiles = getAllFiles(basePath).filter(file => file.endsWith('.md'));
//     const file = markdownFiles.find(file => file.includes(path.join(slug, 'index.md'))); // Ensuring to pick the correct index.md file
//     if (!file) {
//         throw new Error(`File not found: ${slug}`);
//     }

//     const content = fs.readFileSync(file, 'utf8');
//     const matterResult = matter(content);
    
//     // Adjust image paths in Markdown content
//     const updatedContent = matterResult.content.replace(/!\[([^\]]*)\]\(([^)]+)\)/g, (match, alt, src) => {
//         if (!src.startsWith('http')) { // Check if the src is a relative path
//             const newPath = path.join('/content', slug, src); // Adjust the path as needed
//             return `![${alt}](${newPath})`;
//         }
//         return match; // Return the original match if it's not a relative path
//     });

//     return {...matterResult, content: updatedContent};
// }

