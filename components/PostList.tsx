'use client';
import { useState } from "react";
import Post from "./Post";

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

const PostList = ({ postsMetadata }: Props) => {
  const pageIncrement = 10;
  const [displayedPostCount, setDisplayedPostCount] = useState(pageIncrement);

  const sortedPosts = postsMetadata.sort((b, a) => new Date(a.date).getTime() - new Date(b.date).getTime());

  const handleLoadMore = () => {
    setDisplayedPostCount(prevCount => prevCount + pageIncrement);
  };

  return (
    <>
      <ul>
        {sortedPosts.slice(0, displayedPostCount).map(post => (
          <li key={post.slug}>
            <div className="border border-blog-border"></div>
            <Post post={post} />
          </li>
        ))}
      </ul>
      <div className="text-lg	 text-center my-12">
        {displayedPostCount < postsMetadata.length && (
          <button onClick={handleLoadMore} >さらに記事を読み込む</button>
        )}
      </div>
    </>
  );
};
export default PostList;
