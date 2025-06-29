"use client";

import { useOptimistic } from "react";
import { formatDate } from "@/lib/format";
import { togglePostLikeStatus } from "@/actions/post";


function Post({ post, action }) {
  return (
    <article className="post">
      <div className="post-image">
        <img src={post.image} alt={post.title} />
      </div>
      <div className="post-content">
        <header>
          <div>
            <h2>{post.title}</h2>
            <p>
              Shared by {post.userFirstName} on{" "}
              <time dateTime={post.createdAt}>
                {formatDate(post.createdAt)}
              </time>
            </p>
          </div>
          <div>
            <button
              type="button"
              onClick={() => action(post.id)}
              className={`like-button ${post.isLiked ? "liked" : ""}`}
              aria-label="Toggle like"
            >
              <span className="like-icon">❤️</span>
              <span className="like-count">{post.likes}</span>
            </button>
          </div>
        </header>
        <p>{post.content}</p>
      </div>
    </article>
  );
}

export default function Posts({ posts }) {
  const [optimisticPosts, updateOptimisticPosts] = useOptimistic(
    posts,
    (prevPosts, postId) => {
      const index = prevPosts.findIndex((p) => p.id === postId);
      if (index === -1) return prevPosts;

      const updated = { ...prevPosts[index] };
      updated.isLiked = !updated.isLiked;
      updated.likes += updated.isLiked ? 1 : -1;

      const newPosts = [...prevPosts];
      newPosts[index] = updated;
      return newPosts;
    }
  );

  async function updatePost(postId) {
    updateOptimisticPosts(postId); // UI update
    await togglePostLikeStatus(postId); // Server update
  }

  if (!optimisticPosts || optimisticPosts.length === 0) {
    return <p>There are no posts yet. Maybe start sharing some?</p>;
  }

  return (
    <ul className="posts">
      {optimisticPosts.map((post) => (
        <li key={post.id}>
          <Post post={post} action={updatePost} />
        </li>
      ))}
    </ul>
  );
}
