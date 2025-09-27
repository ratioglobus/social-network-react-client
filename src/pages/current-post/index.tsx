import { useEffect } from 'react'
import { useParams } from 'react-router-dom'
import { useLazyGetPostByIdQuery } from '../../app/services/postsApi'
import { Card } from '../../components/card'
import { GoBack } from '../../components/go-back'
import { CreateComment } from '../../components/create-comment'

export const CurrentPost = () => {
  const params = useParams<{ id: string }>()
  const [triggerGetPostById, { data }] = useLazyGetPostByIdQuery()

  useEffect(() => {
    if (params?.id) triggerGetPostById(params.id)
  }, [params?.id])

  if (!data) return <h2>Такого поста не существует</h2>

  const handlePostUpdated = async () => {
    if (params?.id) await triggerGetPostById(params.id)
  }

  return (
    <>
      <GoBack />
      <Card
        cardFor='current-post'
        avatarUrl={data.author.avatarUrl ?? ''}
        content={data.content}
        name={data.author.name ?? ''}
        likesCount={data.likes.length}
        commentsCount={data.comments.length}
        authorId={data.authorId}
        id={data.id}
        likedByUser={data.likedByUser}
        createAt={data.createdAt}
        imageUrl={data.imageUrl}
        onPostUpdated={handlePostUpdated}
      />

      <div className='mt-10'>
        <CreateComment />
      </div>

      <div className='mt-10'>
        {data.comments.length > 0 &&
          data.comments.map((comment) => (
            <Card
              cardFor='comment'
              key={comment.id}
              avatarUrl={comment.user.avatarUrl ?? ''}
              content={comment.content}
              name={comment.user.name ?? ''}
              authorId={comment.userId ?? ''}
              commentId={comment.id}
              id={data.id}
            />
          ))}
      </div>
    </>
  )
}
