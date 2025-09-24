import React, { useContext, useState } from 'react'
import { User } from '../../app/types';
import { ThemeContext } from '../theme-provider';
import { useUpdateUserMutation } from '../../app/services/userApi';
import { useParams } from 'react-router-dom';
import { Controller, useForm } from 'react-hook-form';
import { Button, Modal, ModalBody, ModalContent, ModalFooter, ModalHeader, Textarea } from '@nextui-org/react';
import { Input } from '../input';
import { MdOutlineEmail } from 'react-icons/md';
import { ErrorMessage } from '../error-message';
import { hasErrorField } from '../../utils/has-error-field';

type Props = {
    isOpen: boolean;
    onClose: () => void;
    user?: User
}

type FormValues = {
  email?: string;
  name?: string;
  dateOfBirth?: string;
  bio?: string;
  location?: string;
};

export const EditProfile: React.FC<Props> = ({
    isOpen,
    onClose,
    user
}) => {
    const { theme } = useContext(ThemeContext);
    const [updateUser, { isLoading }] = useUpdateUserMutation();
    const [error, setError] = useState('');
    const [selectedFile, setSelectedFile] = useState<File | null>(null)
    const { id } = useParams<{ id: string }>()

    const { handleSubmit, control } = useForm<FormValues>({
        defaultValues: {
            email: user?.email ?? '',
            name: user?.name ?? '',
            dateOfBirth: user?.dateOfBirth
                ? new Date(user.dateOfBirth).toISOString().split('T')[0]
                : '',
            bio: user?.bio ?? '',
            location: user?.location ?? ''
        }
    });

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            setSelectedFile(e.target.files[0]);
        }
    }

    const onSubmit = async (data: FormValues) => {
        if (!id) return;

        try {
            const formData = new FormData();
            data.name && formData.append('name', data.name);
            data.email && data.email !== user?.email && formData.append('email', data.email);
            data.dateOfBirth && formData.append('dateOfBirth', new Date(data.dateOfBirth).toISOString());
            data.bio && formData.append('bio', data.bio);
            data.location && formData.append('location', data.location);
            selectedFile && formData.append('avatar', selectedFile);

            await updateUser({ userData: formData, id }).unwrap();
            onClose();
        } catch (err) {
            if (hasErrorField(err)) {
                setError(err.data.error);
            } else {
                setError('Произошла ошибка');
            }
        }
    }

    return (
        <Modal isOpen={isOpen} onClose={onClose} className={`${theme} text-foreground`}>
            <ModalContent>
                {(onClose) => (
                    <>
                        <ModalHeader className='flex flex-col gap-1'>
                            Изменения профиля
                        </ModalHeader>
                        <ModalBody>
                            <form className='flex flex-col gap-4' onSubmit={handleSubmit(onSubmit)}>
                                <Input
                                    control={control}
                                    name='email'
                                    label='Email'
                                    type='email'
                                    endContent={<MdOutlineEmail />}
                                />
                                <Input
                                    control={control}
                                    name='name'
                                    label='Имя'
                                    type='text'
                                />
                                <input
                                    type='file'
                                    name='avatarUrl'
                                    placeholder='Выберите файл'
                                    onChange={handleFileChange}
                                />
                                <Input
                                    control={control}
                                    name='dateOfBirth'
                                    label='Дата рождения'
                                    type='date'
                                    placeholder='Дата рождения'
                                />
                                <Controller
                                    name='bio'
                                    control={control}
                                    render={({ field }) => (
                                        <Textarea
                                            {...field}
                                            rows={4}
                                            placeholder='Ваша биография'
                                        />
                                    )}
                                />
                                <Input
                                    control={control}
                                    name='location'
                                    label='Местоположение'
                                    type='text'
                                />
                                <ErrorMessage error={error} />
                                <div className='flex gap-2 justify-end'>
                                    <Button
                                        fullWidth
                                        color='primary'
                                        type='submit'
                                        isLoading={isLoading}
                                    >
                                        Обновить профиль
                                    </Button>
                                </div>
                            </form>
                        </ModalBody>
                        <ModalFooter>
                            <Button color='danger' variant='light' onPress={onClose}>
                                Закрыть
                            </Button>
                        </ModalFooter>
                    </>
                )}
            </ModalContent>
        </Modal>
    )
}
