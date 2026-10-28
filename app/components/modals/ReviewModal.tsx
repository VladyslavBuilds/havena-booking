'use client';

import axios from "axios";
import getErrorMessage from "@/app/libs/getErrorMessage";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { FieldValues, SubmitHandler, useForm, useWatch } from "react-hook-form";
import toast from "react-hot-toast";

import useReviewModal from "@/app/hooks/useReviewModal";

import Modal from "./Modal";
import Heading from "../Heading";
import StarRating from "../inputs/StarRating";
import TextArea from "../inputs/TextArea";

const emptyForm = {
    rating: 0,
    comment: ''
};

const ReviewModal = () => {
    const router = useRouter();
    const reviewModal = useReviewModal();
    const [isLoading, setIsLoading] = useState(false);

    const {
        register,
        handleSubmit,
        setValue,
        control,
        reset,
        formState: {
            errors,
        }
    } = useForm<FieldValues>({
        defaultValues: emptyForm
    });

    const rating = useWatch({ control, name: 'rating' });

    const closeAndReset = () => {
        reviewModal.onClose();
        reset(emptyForm);
    };

    const onSubmit: SubmitHandler<FieldValues> = (data) => {
        setIsLoading(true);

        axios.post('/api/reviews', {
            listingId: reviewModal.listingId,
            rating: data.rating,
            comment: data.comment
        })
        .then(() => {
            toast.success('Thanks for your review!');
            router.refresh();
            closeAndReset();
        })
        .catch((error) => {
            toast.error(getErrorMessage(error));
        })
        .finally(() => {
            setIsLoading(false);
        });
    };

    // The stars are not a registered form field, so check them before
    // react-hook-form validates the comment.
    const submit = () => {
        if (!rating) {
            toast.error('Please pick a rating.');
            return;
        }

        handleSubmit(onSubmit)();
    };

    const bodyContent = (
        <div className="flex flex-col gap-6">
            <Heading
                title="How was your stay?"
                subtitle="Your review helps other guests choose"
            />
            <StarRating
                value={rating}
                onChange={(value) => setValue('rating', value, { shouldDirty: true })}
                disabled={isLoading}
            />
            <TextArea
                id="comment"
                label="Your review"
                placeholder="What did you like? What could be better?"
                disabled={isLoading}
                register={register}
                errors={errors}
                required
            />
        </div>
    );

    return (
        <Modal
            disabled={isLoading}
            isOpen={reviewModal.isOpen}
            title="Leave a review"
            actionLabel="Submit"
            onClose={closeAndReset}
            onSubmit={submit}
            body={bodyContent}
        />
    );
}

export default ReviewModal;
