import React, { useState, useContext } from 'react'
import { CardBody, CardFooter, CardHeader, Card as NextUiCard, Spinner } from '@nextui-org/react'
import { useLikePostMutation, useUnlikePostMutation } from '../../app/services/likesApi';
import { useDeletePostMutation, useLazyGetAllPostsQuery, useLazyGetPostByIdQuery, useUpdatePostMutation } from '../../app/services/postsApi';
import { useDeleteCommentMutation } from '../../app/services/commentsApi';
import { Link, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { selectCurrent } from '../../features/userSlice';
import { User } from '../user';
import { formatToClientDate } from '../../utils/format-to-client-date';
import { RiDeleteBinLine } from 'react-icons/ri';
import { Typography } from '../typography';
import { MetaInfo } from '../meta-info';
import { FcDislike } from 'react-icons/fc';
import { MdOutlineFavoriteBorder } from 'react-icons/md';
import { FaRegComment } from 'react-icons/fa';
import { ErrorMessage } from '../error-message';
import { hasErrorField } from '../../utils/has-error-field';
import { BASE_URL } from '../../constants';
import { ThemeContext } from '../theme-provider';
import { Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, Textarea, Button } from '@nextui-org/react';
import { FiEdit } from 'react-icons/fi';


type Props = {
    avatarUrl: string;
    name: string;
    authorId: string;
    content: string;
    commentId?: string;
    likesCount?: number;
    commentsCount?: number;
    createAt?: Date;
    id?: string;
    cardFor: 'comment' | 'post' | 'current-post'
    likedByUser?: boolean;
    imageUrl?: string;
}

export const Card: React.FC<Props> = ({
    avatarUrl = '',
    name = '',
    authorId = '',
    content = '',
    commentId = '',
    likesCount = 0,
    commentsCount = 0,
    createAt,
    id = '',
    cardFor = 'post',
    imageUrl,
    likedByUser = false
}) => {
    const [likedPost] = useLikePostMutation();
    const [unlikePost] = useUnlikePostMutation();
    const [triggerGetAllPosts] = useLazyGetAllPostsQuery();
    const [triggerGetPostById] = useLazyGetPostByIdQuery();
    const [deletePost, deletePostStatus] = useDeletePostMutation();
    const [deleteComment, deleteCommentStatus] = useDeleteCommentMutation();
    const [updatePost] = useUpdatePostMutation();
    const [error, setError] = useState('');
    const [isEditing, setIsEditing] = useState(false);
    const [newContent, setNewContent] = useState(content);
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const navigate = useNavigate();
    const currentUser = useSelector(selectCurrent);
    const { theme } = useContext(ThemeContext);

    const refetchPosts = async () => {
        switch (cardFor) {
            case "post":
            case "current-post":
                await triggerGetAllPosts().unwrap()
                break
            case "comment":
                await triggerGetPostById(id).unwrap()
                break
            default:
                throw new Error("Неверный аргумент cardFor")
        }
    }

    const handleClick = async () => {
        try {
            likedByUser
                ? await unlikePost(id).unwrap()
                : await likedPost({ postId: id }).unwrap()

            if (cardFor === 'current-post') await triggerGetPostById(id).unwrap()
            if (cardFor === 'post') await triggerGetAllPosts().unwrap()
        } catch (err) {
            if (hasErrorField(err)) setError(err.data.error)
            else setError(err as string)
        }
    }

    const handleDelete = async () => {
        try {
            switch (cardFor) {
                case "post":
                    await deletePost(id).unwrap()
                    await refetchPosts()
                    break
                case "current-post":
                    await deletePost(id).unwrap()
                    navigate('/')
                    break
                case "comment":
                    await deleteComment(commentId).unwrap()
                    await refetchPosts()
                    break
                default:
                    throw new Error("Неверный аргумент cardFor")
            }
        } catch (err) {
            if (hasErrorField(err)) setError(err.data.error)
            else setError(err as string)
        }
    }

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) setSelectedFile(e.target.files[0]);
    }

    const handleUpdate = async () => {
        try {
            const formData = new FormData();
            formData.append('content', newContent);
            if (selectedFile) formData.append('image', selectedFile);

            await updatePost({ id, formData }).unwrap();
            setIsEditing(false);
            await refetchPosts();
        } catch (err) {
            console.log(err);
        }
    };

    return (
        <>
            <NextUiCard className="mb-6">
                <CardHeader className='justify-between items-center bg-transparent'>
                    <Link to={`/users/${authorId}`}>
                        <User
                            name={name}
                            className='text-small font-semibold leading-non text-default-600'
                            avatarUrl={avatarUrl}
                            description={createAt && formatToClientDate(createAt)}
                        />
                    </Link>
                    {authorId === currentUser?.id && (
                        <div className="flex gap-3">
                            <div className="cursor-pointer" onClick={() => setIsEditing(true)}>
                                <FiEdit size={16} />
                            </div>
                            <div className="cursor-pointer" onClick={handleDelete}>
                                {deletePostStatus.isLoading || deleteCommentStatus.isLoading ? (
                                    <Spinner />
                                ) : (
                                    <RiDeleteBinLine size={17} />
                                )}
                            </div>
                        </div>
                    )}
                </CardHeader>

                <CardBody className='px-3 py-2 mb-5'>
                    <Typography className="whitespace-pre-wrap">{content}</Typography>
                    {imageUrl && (
                        <img
                            src={`${BASE_URL}${imageUrl}`}
                            alt="post"
                            className="mt-3 rounded-md max-w-full max-h-[400px] object-contain"
                        />
                    )}
                </CardBody>

                {cardFor !== 'comment' && (
                    <CardFooter className='gap-3'>
                        <div className="flex gap-5 items-center">
                            <div onClick={handleClick}>
                                <MetaInfo
                                    count={likesCount}
                                    Icon={likedByUser ? FcDislike : MdOutlineFavoriteBorder}
                                />
                            </div>
                            <Link to={`/posts/${id}`}>
                                <MetaInfo count={commentsCount} Icon={FaRegComment} />
                            </Link>
                        </div>
                        <ErrorMessage error={error} />
                    </CardFooter>
                )}
            </NextUiCard>

            <Modal isOpen={isEditing} onClose={() => setIsEditing(false)} className={`${theme} text-foreground`}>
                <ModalContent>
                    <ModalHeader className='flex flex-col gap-1'>Редактирование поста</ModalHeader>
                    <ModalBody>
                        <div className='flex flex-col gap-4'>
                            <Textarea
                                value={newContent}
                                onChange={(e) => setNewContent(e.target.value)}
                                placeholder='Что нового?'
                                minRows={5}
                                fullWidth
                            />
                            <input
                                type="file"
                                accept="image/*"
                                onChange={handleFileChange}
                                className="w-full rounded-md border border-gray-300 dark:border-gray-700 p-2"
                            />
                            {selectedFile && (
                                <img
                                    src={URL.createObjectURL(selectedFile)}
                                    alt="preview"
                                    className="rounded-md max-h-64 w-full object-contain border border-gray-200 dark:border-gray-600"
                                />
                            )}
                        </div>
                    </ModalBody>
                    <ModalFooter className='flex justify-end gap-2'>
                        <Button color='danger' variant='flat' onPress={() => setIsEditing(false)}>Отмена</Button>
                        <Button onPress={handleUpdate}>Сохранить</Button>
                    </ModalFooter>
                </ModalContent>
            </Modal>
        </>
    )
}
