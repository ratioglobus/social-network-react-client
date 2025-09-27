import React from 'react';
import { useGetPostsByUserQuery } from '../../app/services/postsApi';
import { Card } from '../card';

type Props = {
  userId: string;
};

export const ProfilePosts: React.FC<Props> = ({ userId }) => {
  const { data: posts, isLoading, refetch } = useGetPostsByUserQuery(userId);

  if (isLoading) {
    return <p>Загрузка постов...</p>;
  }

  if (!posts || posts.length === 0) {
    return <p>Постов пока нет</p>;
  }

  return (
    <div className="mt-10 flex flex-col gap-6">
      {posts.map((post) => (
        <Card
          key={post.id}
          cardFor="post"
          id={post.id}
          content={post.content}
          authorId={post.authorId}
          name={post.author.name ?? ''}
          avatarUrl={post.author.avatarUrl ?? ''}
          likesCount={post.likes.length}
          commentsCount={post.comments.length}
          likedByUser={post.likedByUser}
          createAt={post.createdAt}
          imageUrl={post.imageUrl ? post.imageUrl : undefined}
          onPostUpdated={refetch}
        />
      ))}
    </div>
  );
};
