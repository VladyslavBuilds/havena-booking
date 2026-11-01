'use client';

import { useCallback, useEffect, useRef, useState } from "react";
import { IoMdClose } from "react-icons/io";
import Button from "../Button";

interface ModalProps {
    isOpen?:boolean;
    onClose: () => void;
    onSubmit: () => void;
    title?: string;
    body?: React.ReactElement;
    footer?: React.ReactElement;
    actionLabel: string;
    disabled?: boolean;
    secondaryAction?: () => void;
    secondaryActionLabel?: string
    }

const Modal: React.FC<ModalProps> = ({
    isOpen,
    onClose,
    onSubmit,
    title,
    body,
    footer,
    actionLabel,
    disabled,
    secondaryAction,
    secondaryActionLabel
}) =>{
    // Opening is animated with CSS (animate-modal-in) when the modal
    // mounts; closing plays the reverse transition before onClose() is
    // called, so the parent only removes the modal once it has slid out.
    const [isClosing, setIsClosing] = useState(false);

    const handleClose = useCallback(() => {
        if (disabled) {
            return;
        }

        setIsClosing(true);

        setTimeout(() => {
            setIsClosing(false);
            onClose();
        }, 300);
    }, [disabled, onClose])

    const handleSubmit = useCallback (() => {
        if (disabled) {
            return;
        }
        onSubmit();
    }, [disabled, onSubmit]);
  
    const handleSecondaryAction = useCallback(() => {
        if(disabled || !secondaryAction) {
            return;
        }

        secondaryAction();
    }, [disabled, secondaryAction]);

    // Escape closes the modal too, unless it was pressed inside an open
    // dropdown (react-select sets aria-expanded="true" on its input while
    // the list is open): then the key only closes that list. The listener
    // runs in the capture phase, i.e. before the widget reacts to the key,
    // so the attribute still shows the state at the moment of the press.
    useEffect(() => {
        if (!isOpen) {
            return;
        }

        const handleKeyDown = (event: KeyboardEvent) => {
            if (event.key !== 'Escape') {
                return;
            }

            const target = event.target as HTMLElement | null;
            if (target?.getAttribute('aria-expanded') === 'true') {
                return;
            }

            handleClose();
        };

        document.addEventListener('keydown', handleKeyDown, true);

        return () => document.removeEventListener('keydown', handleKeyDown, true);
    }, [isOpen, handleClose]);

    // A click on the dark backdrop closes the modal. Both the press and the
    // release must land on the backdrop itself (not on the panel), so
    // dragging a text selection out of an input doesn't close it.
    const pressedOnBackdrop = useRef(false);

    const handleBackdropMouseDown = (event: React.MouseEvent<HTMLDivElement>) => {
        pressedOnBackdrop.current = event.target === event.currentTarget;
    };

    const handleBackdropClick = (event: React.MouseEvent<HTMLDivElement>) => {
        if (pressedOnBackdrop.current && event.target === event.currentTarget) {
            handleClose();
        }

        pressedOnBackdrop.current = false;
    };

    if (!isOpen) {
        return null;
    }

    return(
        <>
            <div
            onMouseDown={handleBackdropMouseDown}
            onClick={handleBackdropClick}
            className="
            justify-center
            flex
            overflow-x-hidden
            overflow-y-auto
            fixed
            inset-0
            z-50
            py-6
            outline-none
            focus:outline-none
            bg-neutral-800/70
            "
            >
                {/* my-auto centres the panel like items-center would, but when
                    the panel is taller than the screen the margins collapse to
                    zero and the overlay scrolls, so the header stays reachable */}
                <div
                    className="
                    relative
                    w-full
                    md:w-4/6
                    lg:w-3/6
                    xl:w-2/5
                    my-auto
                    mx-auto
                    h-full
                    lg:h-auto
                    md:h-auto
                    "
                >
                {/*CONTENT*/}
                    <div
                    className={`
                        animate-modal-in
                        transition
                        duration-300
                        h-full
                        ${isClosing ? 'translate-y-full' : 'translate-y-0'}
                        ${isClosing ? 'opacity-0' : 'opacity-100'}
                        `}
                    >
                        <div className="
                            h-full
                            lg:h-auto
                            md:h-auto
                            border-0
                            rounded-lg
                            shadow-lg
                            relative
                            flex
                            flex-col
                            w-full
                            bg-white dark:bg-neutral-900
                            outline-none
                            focus:outline-none   
                            "
                        >
                            {/* HEADER */}
                            <div
                                className="
                                flex
                                items-center
                                p-6
                                rounded-t
                                justify-center
                                relative
                                border-b-[1px]
                                "
                            >
                                <button
                                    onClick={handleClose}
                                    className="
                                    p-1
                                    border-0
                                    hover:opacity-70
                                    transition
                                    absolute
                                    left-9
                                    "
                                >
                                    <IoMdClose size={18} />
                                </button>
                                <div className="text-lg font-semibold">
                                    {title}
                                </div>
                            </div>
                            {/* BODY */}
                            <div className="relative p-6 flex-auto">
                                    {body}
                           </div>
                           {/* FOOTER */}
                            <div className="flex flex-col gap-2 p-6">
                                <div 
                                    className="
                                    flex
                                    flex-row
                                    items-center
                                    gap-4
                                    w-full
                                    "
                                >   
                                    {secondaryAction && secondaryActionLabel && (
                                     <Button 
                                        outline
                                        disabled={disabled}
                                        label={secondaryActionLabel}
                                        onClick={handleSecondaryAction}
                                    />
                                    )}
                                    <Button 
                                        disabled={disabled}
                                        label={actionLabel}
                                        onClick={handleSubmit}
                                    />
                                </div>
                                {footer}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}

export default Modal;