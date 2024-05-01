import PostList from "@/components/PostList";
import { getPostsMetadata } from '@/utils/getPosts';
import TagFilter from '@/components/TagFilter';

export default async function Page() {
  const postsMetadata = getPostsMetadata("./posts");
  return (
    <>
      <PostList postsMetadata={postsMetadata} />
    </>
  );
}