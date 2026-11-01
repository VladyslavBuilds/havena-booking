'use client';

import axios from 'axios';
import getErrorMessage from "@/app/libs/getErrorMessage";
import { AiFillGithub } from 'react-icons/ai';
import { FcGoogle } from 'react-icons/fc';
import { useCallback, useState } from 'react';
import {
    FieldValues,
    SubmitHandler,
    useForm
} from 'react-hook-form';

import useRegisterModal from '@/app/hooks/useRegisterModal';
import useLoginModal from '@/app/hooks/useLoginModal';
import Modal from './Modal';
import Heading from '../Heading';
import Input from '../inputs/Input';
import toast from 'react-hot-toast';
import Button from '../Button';
import { signIn } from 'next-auth/react';


const RegisterModal = () => {
    const registerModal = useRegisterModal();
    const loginModal = useLoginModal();
    const [isLoading, setIsLoading] = useState(false);

    const {
        register,
        handleSubmit,
        formState: {
            errors,
        }
    } = useForm<FieldValues>({
        defaultValues: {
            name: '',
            email: '',
            password: ''
        }
    });

    const onSubmit: SubmitHandler<FieldValues> = (data) => {
        setIsLoading(true);

        axios.post('/api/register', data)
        .then(() => {
            toast.success('Success!');
            loginModal.onOpen();
            registerModal.onClose();
        })
        .catch((error) => {
            toast.error(getErrorMessage(error));
        })
        .finally(() => {
            setIsLoading(false);
        })
    }

    const toggle = useCallback(() => {
        registerModal.onClose();
        loginModal.onOpen();
    }, [loginModal, registerModal])

    const bodyContent = (
        // A real <form> so the browser can offer to save the new login and
        // Enter submits; validation stays with react-hook-form (noValidate).
        <form
            id="register-form"
            onSubmit={handleSubmit(onSubmit)}
            noValidate
            className='flex flex-col gap-4'
        >
            <Heading
            title="Welcome to Havena"
            subtitle="Create an account!"
            />
           <Input
            id="email"
            type="email"
            label="Email"
            autoComplete="email"
            disabled={isLoading}
            register={register}
            errors={errors}
            required
            />
            <Input
            id="name"
            label="Name"
            autoComplete="name"
            disabled={isLoading}
            register={register}
            errors={errors}
            required
            />
            <Input
            id="password"
            type="password"
            label="Password"
            autoComplete="new-password"
            disabled={isLoading}
            register={register}
            errors={errors}
            required
            />
            <button type="submit" className="hidden" tabIndex={-1} aria-hidden="true" />
        </form>
    );

    const footerContent = (
        <div className='flex flex-col gap-4 mt-3'>
            <hr />
            <Button 
                outline
                label="Continue with Google"
                icon={FcGoogle}
                onClick={() => signIn('google')}
            />
            <Button 
                outline
                label="Continue with Github"
                icon={AiFillGithub}
                onClick={() => signIn('github')}
            />
            <div className="
                    text-neutral-500 dark:text-neutral-400
                    text-center
                    mt-4
                    font-light
                "
            >
                <div className="
                    justify-center flex flex-row items-center gap-2">
                    <div>
                        Already have an account?
                    </div>
                    <div 
                        onClick={toggle}
                        className="
                            text-neutral-800 dark:text-neutral-100
                            cursor-pointer
                            hover:underline
                        ">
                        Log in
                    </div>
                </div>
            </div>
        </div>
    )

    return (
        <Modal
        disabled={isLoading}
        isOpen={registerModal.isOpen}
        title="Register"
        actionLabel="Continue"
        onClose={registerModal.onClose}
        onSubmit={handleSubmit(onSubmit)}
        body={bodyContent}
        footer={footerContent}
        />
    );
}

export default RegisterModal;