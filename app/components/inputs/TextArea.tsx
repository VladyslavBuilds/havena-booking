'use client';

import {
    FieldErrors,
    FieldValues,
    UseFormRegister
} from "react-hook-form";

interface TextAreaProps {
    id: string;
    label: string;
    placeholder?: string;
    rows?: number;
    disabled?: boolean;
    required?: boolean;
    register: UseFormRegister<FieldValues>;
    errors: FieldErrors;
}

// Multi-line counterpart of Input, wired to react-hook-form the same way.
const TextArea: React.FC<TextAreaProps> = ({
    id,
    label,
    placeholder,
    rows = 4,
    disabled,
    required,
    register,
    errors
}) => {
    return (
        <div className="w-full flex flex-col gap-2">
            <label
                htmlFor={id}
                className={`text-md ${errors[id] ? 'text-rose-500' : 'text-zinc-500'}`}
            >
                {label}
            </label>
            <textarea
                id={id}
                rows={rows}
                disabled={disabled}
                placeholder={placeholder}
                {...register(id, { required })}
                className={`
                    w-full
                    p-4
                    font-light
                    bg-white
                    border-2
                    rounded-md
                    outline-none
                    transition
                    resize-none
                    disabled:opacity-70
                    disabled:cursor-not-allowed
                    ${errors[id] ? 'border-rose-500' : 'border-neutral-300'}
                    ${errors[id] ? 'focus:border-rose-500' : 'focus:border-black'}
                `}
            />
        </div>
    );
}

export default TextArea;
