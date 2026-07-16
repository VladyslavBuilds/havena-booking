'use client';

import useRegisterModal from '@/app/hooks/useRegisterModal';
import Modal from './Modal';


const RegisterModal = () => {
    const registerModal = useRegisterModal();

    return (
        <Modal
        isOpen={registerModal.isOpen}
        title="Register"
        actionLabel="Continue"
        onClose={registerModal.onClose}
        onSubmit={() => {}}
        body={<div>Register form</div>}
        />
    );
}

export default RegisterModal;
