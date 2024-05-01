type PostMetadata = {
    title: string;
    date: string;
    categories: string[];
    tags: string[];
    coverImage: string;
    slug: string;
  };
  
  type Props = {
    postsMetadata: PostMetadata[];
  };
  
  const TagFilter = ({ postsMetadata }: Props) => {
    const tags = postsMetadata.flatMap(post => post.tags);
    const uniqueTags = Array.from(new Set(tags));
    return (
        <div className="my-12 flex flex-wrap gap-x-2">
        {uniqueTags.map((tag: string) => (
            <span key={tag} className="mt-1 px-3 py-1 bg-blog-accent-secondary rounded-md text-sm">{tag}</span>
        ))}
    </div>
    );
  };
  
export default TagFilter;