import { useLazyGetPostByIdQuery } from '../../app/services/postsApi'
import { Controller, useForm } from 'react-hook-form';
import { Button, Textarea } from '@nextui-org/react';
import { ErrorMessage } from '../error-message';
import { IoMdCreate } from 'react-icons/io';
import { useParams } from 'react-router-dom';
import { useCreateCommentMutation } from '../../app/services/commentsApi';

export const CreateComment = () => {
    const { id } = useParams<{id: string}>()
    const [createComment] = useCreateCommentMutation();
    const [getPostById] = useLazyGetPostByIdQuery();

    const {
        handleSubmit,
        control,
        formState: { errors },
        setValue
    } = useForm();

    const error = errors?.post?.message as string;

    const onSubmit = handleSubmit(async (data) => {
        try {
            if (id) {
                await createComment({ content: data.comment, postId: id }).unwrap();
                setValue('comment', '');
                await getPostById(id).unwrap();
            }

        } catch (error) {
            console.log(error)
        }
    })

    return (
        <form className='flex-grow' onSubmit={onSubmit}>
            <Controller
                name='comment'
                control={control}
                defaultValue=''
                rules={{
                    required: 'Обязательное поле'
                }}
                render={({ field }) => (
                    <Textarea
                        {...field}
                        labelPlacement='outside'
                        placeholder='Оставьте свой комментарий'
                        className='mb-5'
                    />
                )}
            />
            {errors && <ErrorMessage error={error} />}
            <Button
                color='primary'
                className='flex-end'
                endContent={<IoMdCreate />}
                type='submit'
            >
                Отправить
            </Button>
        </form>
    )
}
