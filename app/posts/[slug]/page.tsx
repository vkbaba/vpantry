
import { getPostsMetadata, getPostContent } from "@/utils/getPosts"
import Markdown from "markdown-to-jsx"
import React, { isValidElement, ReactNode } from 'react'
import ExportedImage from "next-image-export-optimizer";
import Code from "@/components/Code"
import Link from 'next/link';
import LinkCard from "@/components/LinkCard";
import { OgpData } from "@/utils/ogp";

function getChildrenText(children: ReactNode): string {
    if (typeof children === 'string') return children;
    if (Array.isArray(children)) return children.map(getChildrenText).join('');
    if (isValidElement<{ children?: ReactNode }>(children)) {
        return getChildrenText(children.props.children);
    }
    return '';
}

function createSmartLink(ogpData: Record<string, OgpData>) {
    return function SmartLink({ children, href, ...props }: { children: React.ReactNode; href?: string; [key: string]: unknown }) {
        const childText = getChildrenText(children);

        // URLのみの行かどうかを判定（childrenがhrefと同じ場合）
        if (href && childText === href && ogpData[href]) {
            return <LinkCard ogp={ogpData[href]} />;
        }

        return (
            <a
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                className="text-cyan-600 underline visited:text-indigo-800"
                {...props}
            >
                {children}
            </a>
        );
    };
}

// Set dynamic routes
export const generateStaticParams = async () => {
    const posts = getPostsMetadata('./posts/')
    return posts.map((post: { slug: string }) => ({ slug: post.slug }))
}

// export async function generateMetadata({ params, searchParams }) {
// }

export default async function Page({ params }: { params: Promise<{ slug: string }> }) {
    const { slug } = await params
    const post = await getPostContent('./posts/', slug)
    // (images/*.png) -> (/slug/images/*.png)
    post.content = post.content.replace(/\(images\/(.*?.(png|jpg|jpeg|gif|svg))\)/g, `(/${slug}/images/$1)`);
    // Need to set width and height for images in development environment to avoid build errors.
    // It means images may look different in development and production environments.
    // This is a current limitation when using both next-image-export-optimizer and markdown-to-jsx.
    const imgProps = process.env.NODE_ENV === 'development' ?
        // dev 
        {
            className: 'rounded-md	border border-blog-border mx-auto',
            width: 500,
            height: 500
        } :
        // prod
        {
            className: 'rounded-md	border border-blog-border mx-auto'
        };

    return (
        <div className="max-w-4xl mx-auto">
            <main>
                <article>
                    <h1 className="text-4xl my-4">{post.data.title}</h1>
                    <div className="text-lg"> {post.data.date} </div>
                    <div className="my-4 flex flex-wrap gap-x-2">
                        {post.data.tags?.map((tag: string) => (
                            <span key={tag} className="mt-1 px-3 py-1 bg-blog-accent-secondary rounded-md text-sm">{tag}</span>
                        ))}
                    </div>
                    <div className="border-b-2 my-6"> </div>
                    <Markdown
                        options={{
                            overrides: {
                                h1: {
                                    props: {
                                        className: 'text-3xl font-bold my-8 border-b-2 border-blog-border pb-2',
                                    },
                                },
                                h2: {
                                    props: {
                                        className: 'text-2xl font-bold my-6 border-b-2 border-blog-border  pb-2',
                                    },
                                },
                                h3: {
                                    props: {
                                        className: 'text-xl font-bold my-4',
                                    },
                                },
                                p: {
                                    props: {
                                        className: 'text-lg	my-6',
                                    },
                                },
                                ul: {
                                    props: {
                                        className: 'list-disc ',
                                    },
                                },
                                ol: {
                                    props: {
                                        className: 'list-decimal ',
                                    },
                                },
                                li: {
                                    props: {
                                        className: 'list-inside ml-6 text-lg',
                                    },
                                },
                                a: {
                                    component: createSmartLink(post.ogpData),
                                },
                                img: {
                                    component: ExportedImage,
                                    props: imgProps,
                                },
                                figcaption: {
                                    props: {
                                        className: 'text-center text-sm mb-8',
                                    },
                                },
                                blockquote: {
                                    props: {
                                        className: 'border-l-2 border-blog-text pl-6 ml-6 my-6 [&>p]:my-2 [&>p]:text-base',
                                    },
                                },
                                code: {
                                    component: Code,
                                },
                            }
                        }}
                    >
                        {post.content}
                    </Markdown>
                </article>
                <div className="text-center text-lg">
                    <Link href="/">Home</Link>
                </div>
            </main>
        </div>
    )
}