import { createPost } from "@/actions/post";
import PostForm from "@/components/PostForm";

export default function NewPostPage() {
return <PostForm action={createPost} />
}
