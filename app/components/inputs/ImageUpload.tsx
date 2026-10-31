'use client';

import { CldUploadWidget, CldUploadWidgetProps } from "next-cloudinary";
import Image from "next/image";
import { useCallback } from "react";
import { TbPhotoPlus } from "react-icons/tb";

interface ImageUploadProps {
    onChange: (value: string) => void
    value: string;
}

// What the widget passes to onSuccess (next-cloudinary does not export it).
type UploadResult = Parameters<NonNullable<CldUploadWidgetProps["onSuccess"]>>[0];

const ImageUpload: React.FC<ImageUploadProps> = ({
    onChange,
    value
}) => {
    const handleUpload = useCallback((result: UploadResult) => {
        // info is a string for some widget events; only an object carries the URL
        if (typeof result.info === "object" && result.info?.secure_url) {
            onChange(result.info.secure_url);
        }
    }, [onChange]);

    return (
        <CldUploadWidget
            onSuccess={handleUpload}
            uploadPreset={process.env.NEXT_PUBLIC_UPLOAD_PRESET}
            options={{
                maxFiles: 1
            }}
        >
            {({ open, isLoading }) => {
                return (
                    <div
                        onClick={() => {
                            // The widget script is loaded from Cloudinary;
                            // opening it before it is ready throws an error.
                            if (!isLoading) {
                                open?.();
                            }
                        }}
                        className={`
                            relative
                            ${isLoading ? 'cursor-wait' : 'cursor-pointer'}
                            hover:opacity-70
                            transition
                            border-dashed
                            border-2
                            p-20
                            border-neutral-300 dark:border-neutral-600
                            flex
                            flex-col
                            justify-center
                            items-center
                            gap-4
                            text-neutral-600 dark:text-neutral-300
                        `}
                    >
                        <TbPhotoPlus size={50} />
                        <div className="font-semibold text-lg">
                            {isLoading ? 'Loading…' : 'Click to upload'}
                        </div>
                        {value && (
                            <div 
                                className="absolute inset-0 w-full h-full"
                            >
                                <Image
                                    alt="upload"
                                    fill
                                    sizes="(max-width: 768px) 100vw, 50vw"
                                    style={{objectFit: 'cover'}}
                                    src={value}
                                />
                            </div>
                        )}
                    </div>
                )
            }}
        </CldUploadWidget>
    );
}

export default ImageUpload;