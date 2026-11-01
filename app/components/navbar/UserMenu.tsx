'use client';

import { useRouter } from "next/navigation";
import { AiOutlineMenu } from "react-icons/ai";
import Avatar from "../Avatar";
import { useCallback, useEffect, useRef, useState } from "react";
import { signOut } from "next-auth/react";

import MenuItem from "./MenuItem";

import useRegisterModal from "@/app/hooks/useRegisterModal";
import useLoginModal from "@/app/hooks/useLoginModal";
import useRentModal from "@/app/hooks/useRentModal";

import { SafeUser } from "@/app/types";

interface UserMenuProps {
    currentUser?: SafeUser | null
}

const UserMenu: React.FC<UserMenuProps> = ({
    currentUser
}) =>{
    const router = useRouter();
    const registerModal = useRegisterModal();
    const loginModal = useLoginModal();
    const rentModal = useRentModal();
    const [isOpen, setIsOpen] = useState(false);
    const menuRef = useRef<HTMLDivElement>(null);

    const toggleOpen = useCallback(() => {
        setIsOpen((value) => !value);
    }, []);

    // Close the dropdown when the user presses anywhere outside of it.
    // The navbar stays mounted while navigating, so without this the
    // menu would simply stay open on the next page.
    useEffect(() => {
        if (!isOpen) {
            return;
        }

        const handlePointerDown = (event: PointerEvent) => {
            if (!menuRef.current?.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };

        document.addEventListener('pointerdown', handlePointerDown);

        return () => document.removeEventListener('pointerdown', handlePointerDown);
    }, [isOpen]);

    // Every item closes the menu first and then does its job.
    const select = useCallback((action: () => void) => () => {
        setIsOpen(false);
        action();
    }, []);

    const onRent = useCallback(() => {
        if (!currentUser) {
            return loginModal.onOpen();
        }

        rentModal.onOpen();
    }, [currentUser, loginModal, rentModal])

    return(
        <div ref={menuRef} className="relative">
            <div className="flex flex-row items-center gap-3">
                <div
                onClick={onRent}
                className="
                hidden
                md:block
                text-sm
                font-semibold
                py-3
                px-4
                rounded-full
                hover:bg-neutral-100 dark:hover:bg-neutral-800
                transition
                cursor-pointer
                "
                >
                    List your home
                </div>
                <div
                onClick={toggleOpen}
                className="
                p-4
                md:py-1
                md:px-2
                border-[1px]
                border-neutral-200 dark:border-neutral-700
                flex
                flex-row
                items-center
                gap-3
                rounded-full
                cursor-pointer
                hover:shadow-md
                transition
                "
                >
                    <AiOutlineMenu />
                    <div className="hidden md:block">
                        <Avatar src={currentUser?.image}/>
                    </div>
                </div>
            </div>
            {isOpen && (
                <div
                    className="
                    absolute
                    rounded-xl
                    shadow-md
                    w-[40vw]
                    md:w-3/4
                    bg-white dark:bg-neutral-900
                    overflow-hidden
                    right-0
                    top-12
                    text-sm
                    "
                    >
                    <div className="flex flex-col cursor-pointer">
                        {currentUser ? (
                                <>
                                    <MenuItem
                                        onClick={select(() => router.push("/trips"))}
                                        label="My trips"
                                    />
                                    <MenuItem
                                        onClick={select(() => router.push("/favorites"))}
                                        label="My favorites"
                                    />
                                    <MenuItem
                                        onClick={select(() => router.push("/reservations"))}
                                        label="My reservations"
                                    />
                                    <MenuItem
                                        onClick={select(() => router.push("/properties"))}
                                        label="My properties"
                                    />
                                    <MenuItem
                                        onClick={select(rentModal.onOpen)}
                                        label="List my home"
                                    />
                                    <hr />
                                    <MenuItem
                                        onClick={select(() => signOut())}
                                        label="Logout"
                                    />
                                </>
                        ) : (
                                <>
                                    <MenuItem
                                        onClick={select(loginModal.onOpen)}
                                        label="Login"
                                    />
                                    <MenuItem
                                        onClick={select(registerModal.onOpen)}
                                        label="Sign up"
                                    />
                                </>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}

export default UserMenu;
