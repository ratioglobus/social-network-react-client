import { useCreatePostMutation, useLazyGetAllPostsQuery } from '../../app/services/postsApi'
import { Controller, useForm } from 'react-hook-form';
import { Button, Textarea } from '@nextui-org/react';
import { ErrorMessage } from '../error-message';
import { useState } from 'react';

export const CreatePost = () => {
    const [createPost] = useCreatePostMutation();
    const [triggerAllPosts] = useLazyGetAllPostsQuery();
    const [selectedFile, setSelectedFile] = useState<File | null>(null)

    const {
        handleSubmit,
        control,
        formState: { errors },
        setValue
    } = useForm();

    const error = errors?.post?.message as string;

    const onSubmit = handleSubmit(async (data) => {
        try {

            const formData = new FormData();
            formData.append("content", data.post);

            if (selectedFile) {
                formData.append("image", selectedFile);
            }

            await createPost(formData).unwrap();
            setValue('post', '');
            await triggerAllPosts().unwrap();
            setSelectedFile(null);
        } catch (error) {
            console.log(error)
        }
    })

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            setSelectedFile(e.target.files[0]);
        }
    }

    return (
        <form className='flex-grow' onSubmit={onSubmit}>
            <Controller
                name='post'
                control={control}
                defaultValue=''
                rules={{
                    required: 'Текст для поста обязателен'
                }}
                render={({ field }) => (
                    <Textarea
                        {...field}
                        labelPlacement='outside'
                        placeholder='О чем думаете?'
                        className='mb-5'
                    />
                )}
            />

            <div className="flex items-center gap-3 mb-5">
                <label className="px-4 py-2 bg-blue-500 text-white rounded-md cursor-pointer hover:bg-blue-600">
                    Прикрепить фото
                    <input
                        type="file"
                        name="image"
                        accept="image/*"
                        onChange={handleFileChange}
                        className="hidden"
                    />
                </label>

                {selectedFile && <span className="text-sm text-gray-900 dark:text-gray-100">{selectedFile.name}</span>}

                <Button
                    color='success'
                    type='submit'
                    className="px-4 py-2 bg-green-500 text-base text-white rounded-md cursor-pointer hover:bg-green-600"
                   
                >
                    Опубликовать пост
                </Button>
            </div>

            {error && <ErrorMessage error={error} />}
        </form>
    )

}
