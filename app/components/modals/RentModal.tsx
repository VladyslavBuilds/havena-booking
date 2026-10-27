'use client'

import useRentModal from "@/app/hooks/useRentModal";
import useCountries from "@/app/hooks/useCountries";

import Modal from "./Modal";
import { useEffect, useMemo, useState } from "react";
import Heading from "../Heading";
import { categories } from "../navbar/Categories";
import CategoryInput from "../inputs/CategoryInput";
import { FieldValues, SubmitHandler, useForm, useWatch } from "react-hook-form";
import CountrySelect from "../inputs/CountrySelect";
import dynamic from "next/dynamic";
import Counter from "../inputs/Counter";
import ImageUpload from "../inputs/ImageUpload";
import Input from "../inputs/Input";
import axios from "axios";
import getErrorMessage from "@/app/libs/getErrorMessage";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";

// Leaflet needs the browser's window object, so the map is never
// rendered on the server.
const Map = dynamic(() => import('../Map'), {
    ssr: false
});

enum STEPS {
    CATEGORY = 0,
    LOCATION = 1,
    INFO = 2,
    IMAGES = 3,
    DESCRIPTION = 4,
    PRICE = 5
}

const emptyForm = {
    category: '',
    location: null,
    guestCount: 1,
    roomCount: 1,
    bathroomCount: 1,
    imageSrc: '',
    price: 1,
    title: '',
    description: ''
};

const RentModal = () => {
    const router = useRouter();
    const rentModal = useRentModal();
    const { getByValue } = useCountries();

    // When the modal was opened with rentModal.onEdit(listing), the same
    // steps edit that listing instead of creating a new one.
    const editingListing = rentModal.listing;
    const isEditing = editingListing !== null;

    const [step, setStep] = useState(STEPS.CATEGORY);
    const [isLoading, setIsLoading] = useState(false)

    const {
        register,
        handleSubmit,
        setValue,
        control,
        formState: {
            errors,
        },
        reset
    } = useForm<FieldValues>({
        defaultValues: emptyForm
    });

    // Pre-fill the form with the listing being edited.
    useEffect(() => {
        if (editingListing) {
            reset({
                category: editingListing.category,
                location: getByValue(editingListing.locationValue) ?? null,
                guestCount: editingListing.guestCount,
                roomCount: editingListing.roomCount,
                bathroomCount: editingListing.bathroomCount,
                imageSrc: editingListing.imageSrc,
                price: editingListing.price,
                title: editingListing.title,
                description: editingListing.description
            });
        }
    }, [editingListing, reset, getByValue]);

    const closeAndReset = () => {
        rentModal.onClose();
        reset(emptyForm);
        setStep(STEPS.CATEGORY);
    };

    // useWatch subscribes to single fields (watch() re-renders on any change
    // and is not supported by the React Compiler).
    const category = useWatch({ control, name: 'category' });
    const location = useWatch({ control, name: 'location' });
    const guestCount = useWatch({ control, name: 'guestCount' });
    const roomCount = useWatch({ control, name: 'roomCount' });
    const bathroomCount = useWatch({ control, name: 'bathroomCount' });
    const imageSrc = useWatch({ control, name: 'imageSrc' });

    const setCustomValue = (id: string, value: unknown) => {
        setValue(id, value, {
            shouldValidate: true,
            shouldDirty: true,
            shouldTouch: true,
        })
    }


    const onBack = () => {
        setStep((value) => value - 1);
    };

    const onNext = () => {
        setStep((value) => value + 1);
    };

    const onSubmit: SubmitHandler<FieldValues> = (data) => {
        if (step === STEPS.CATEGORY && !category) {
            toast.error('Please select a category.');
            return;
        }

        if (step === STEPS.LOCATION && !location) {
            toast.error('Please select a location.');
            return;
        }

        if (step === STEPS.IMAGES && !imageSrc) {
            toast.error('Please upload a photo.');
            return;
        }

        if (step !== STEPS.PRICE) {
            return onNext();
        }

        setIsLoading(true);

        const request = isEditing
            ? axios.patch(`/api/listings/${editingListing.id}`, data)
            : axios.post('/api/listings', data);

        request
        .then(() => {
            toast.success(isEditing ? 'Listing updated!' : 'Listing created!');
            router.refresh();
            closeAndReset();
        })
        .catch((error) => {
            toast.error(getErrorMessage(error));
        }).finally(() => {
            setIsLoading(false);
        })

    }

    const actionLabel = useMemo(() => {
        if (step === STEPS.PRICE) {
            return isEditing ? 'Save' : 'Create';
        }

        return 'Next';
    }, [step, isEditing]);

     const secondaryActionLabel = useMemo(() => {
        if (step === STEPS.CATEGORY) {
            return undefined;
        }

        return 'Back';
    }, [step]);

    let bodyContent = (
        <div className="flex flex-col gap-8">
            <Heading
            title="Which of these best describes your place?"
            subtitle="Pick a category"
            />
            <div 
                className="
                grid
                grid-cols-1
                md:grid-cols-2
                gap-3
                max-h-[50vh]
                overflow-y-auto
            "
            >
            {categories.map((item) => (
                <div key={item.label} className="col-span-1">
                    <CategoryInput
                        onClick={(category) => 
                            setCustomValue('category', category)}
                        selected={category === item.label}
                        label={item.label}
                        icon={item.icon}
                    />
                </div>
            ))}

            </div>
        </div>
    )

    if (step === STEPS.LOCATION) {
        bodyContent = (
            <div className="flex flex-col gap-8">
                <Heading 
                    title="Where is your place located?"
                    subtitle="Help guests find you!"
                />
                <CountrySelect
                value={location}
                     onChange={(value) => setCustomValue('location', value)}
                />
                <Map 
                    center={location?.latlng}
                />
            </div>
        )
    }

    if (step ===STEPS.INFO) {
        bodyContent = (
            <div className="flex flex-col gap-8">
                <Heading 
                    title="Share some basics about your place"
                    subtitle="What amenities do you have?"
                />
                <Counter 
                    title="Guests"
                    subtitle="How many guests do you allow?"
                    value={guestCount}
                    onChange={(value) => setCustomValue('guestCount', value )}
                />
                <hr />
                <Counter 
                    title="Rooms"
                    subtitle="How many rooms do you have?"
                    value={roomCount}
                    onChange={(value) => setCustomValue('roomCount', value )}
                />
                <hr />
                <Counter 
                    title="Bathrooms"
                    subtitle="How many bathrooms do you have?"
                    value={bathroomCount}
                    onChange={(value) => setCustomValue('bathroomCount', value )}
                />
            </div>
        )
    }

    if (step === STEPS.IMAGES) {
        bodyContent = (
            <div className="flex flex-col gap-8">
                <Heading 
                    title="Add a photo of your place"
                    subtitle="Show guests what your place looks like!"
                />
                <ImageUpload 
                    value={imageSrc}
                    onChange={(value) => setCustomValue('imageSrc', value)}
                />
            </div>
        )
    }

    if (step === STEPS.DESCRIPTION) {
        bodyContent = (
            <div className="flex flex-col gap-8">
                <Heading 
                    title="How would you describe your place?"
                    subtitle="Short and sweet works best!"
                />
                <Input 
                    id="title"
                    label="Title"
                    disabled={isLoading}
                    register={register}
                    errors={errors}
                    required
                />
                <hr />
                <Input 
                    id="description"
                    label="Description"
                    disabled={isLoading}
                    register={register}
                    errors={errors}
                    required
                />
            </div>
        )
    }

    if (step === STEPS.PRICE) {
        bodyContent = (
            <div className="flex flex-col gap-8">
                <Heading 
                    title="Now, set your price"
                    subtitle="How much do you charge per night?"
                />
                <Input 
                    id="price"
                    label="Price"
                    formatPrice
                    type="number"
                    disabled={isLoading}
                    register={register}
                    errors={errors}
                    required
                />
            </div>
        )
    }

    return (
        <Modal
        disabled={isLoading}
        isOpen={rentModal.isOpen}
        onClose={closeAndReset}
        onSubmit={handleSubmit(onSubmit)}
        actionLabel={actionLabel}
        secondaryActionLabel={secondaryActionLabel}
        secondaryAction={step === STEPS.CATEGORY ? undefined : onBack}
        title={isEditing ? 'Edit your home' : 'Airbnb your home!'}
        body={bodyContent}
        />
    );
}

export default RentModal;