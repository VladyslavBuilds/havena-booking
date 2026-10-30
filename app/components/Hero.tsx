'use client';

import Image from "next/image";

import useSearchModal from "@/app/hooks/useSearchModal";
import useRentModal from "@/app/hooks/useRentModal";
import useLoginModal from "@/app/hooks/useLoginModal";
import { SafeUser } from "@/app/types";

import Button from "./Button";

interface HeroProps {
    currentUser?: SafeUser | null;
    listingCount: number;
}

// Photo from the demo set (Lago di Braies boathouse), hosted on Cloudinary.
const HERO_IMAGE = "https://res.cloudinary.com/ix8tmyj9/image/upload/v1793231667/havena-demo/photo-1470770841072-f978cf4d019e.jpg";

// Landing banner shown on the home page when no filters are active.
const Hero: React.FC<HeroProps> = ({ currentUser, listingCount }) => {
    const searchModal = useSearchModal();
    const rentModal = useRentModal();
    const loginModal = useLoginModal();

    const onListHome = () => {
        if (!currentUser) {
            return loginModal.onOpen();
        }

        rentModal.onOpen();
    };

    return (
        <section
            className="
                relative
                overflow-hidden
                rounded-2xl
                h-[52vh]
                min-h-[360px]
                flex
                items-end
            "
        >
            <Image
                src={HERO_IMAGE}
                alt="Boathouse on an alpine lake at sunrise"
                fill
                priority
                sizes="(max-width: 1280px) 100vw, 1280px"
                className="object-cover"
            />
            {/* Dark gradient so the text stays readable on any photo */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/25 to-transparent" />

            <div className="relative p-8 md:p-12 text-white flex flex-col gap-4 max-w-2xl">
                <h1 className="text-4xl md:text-6xl font-bold tracking-tight">
                    Find your haven
                </h1>
                <p className="text-lg md:text-xl font-light text-white/90">
                    {listingCount} unique homes from cabins to villas, handpicked hosts
                    and honest reviews from guests who stayed there.
                </p>
                <div className="flex flex-col sm:flex-row gap-3 mt-2 sm:w-[28rem]">
                    <Button
                        label="Start exploring"
                        onClick={searchModal.onOpen}
                    />
                    <Button
                        label="List your home"
                        outline
                        onClick={onListHome}
                    />
                </div>
            </div>
        </section>
    );
}

export default Hero;
