import { useParams } from 'react-router-dom'
import { useGetPostByIdQuery } from '../../app/services/postsApi'
import { Card } from '../../components/card';
import { GoBack } from '../../components/go-back';
import { CreateComment } from '../../components/create-comment';

export const CurrentPost = () => {
  const params = useParams<{id: string}>();
  const { data } = useGetPostByIdQuery(params?.id ?? '');

  if (!data) {
    return <h2>Такого поста не существует</h2>
  }

  const {
    content,
    id,
    authorId,
    comments,
    likes,
    author,
    likedByUser,
    createdAt,
    imageUrl
  } = data;

  return (
    <>
      <GoBack />
      <Card 
        cardFor='current-post'
        avatarUrl={author.avatarUrl ?? ''}
        content={content}
        name={author.name ?? ''}
        likesCount={likes.length}
        commentsCount={comments.length}
        authorId={authorId}
        id={id}
        likedByUser={likedByUser}
        createAt={createdAt}
        imageUrl={imageUrl}
      />
      <div className='mt-10'>
        <CreateComment />
      </div>
      <div className='mt-10'>
        {
          comments?.length > 0
            ? comments.map((comment) => (
                <Card
                  cardFor='comment'
                  key={comment.id}
                  avatarUrl={comment.user.avatarUrl ?? ''}
                  content={comment.content}
                  name={comment.user.name ?? ''}
                  authorId={comment.userId ?? ''}
                  commentId={comment.id}
                  id={id}
                />
              ))
            : null
        }
      </div>
    </>
  )
}
