'use client';

import { useRouter } from "next/navigation"

// Havena wordmark: a small house ("haven") next to the name.
// Drawn inline so it needs no image file and scales crisply.
const Logo = () => {
    const router = useRouter();

    return (
        <div
            onClick={() => router.push('/')}
            className="hidden md:flex flex-row items-center gap-2 cursor-pointer select-none"
            aria-label="Havena home"
            role="link"
        >
            <svg
                width="32"
                height="32"
                viewBox="0 0 32 32"
                aria-hidden="true"
                className="text-rose-500"
            >
                <path
                    d="M16 3 L29 14 V28 a1 1 0 0 1 -1 1 H20 V21 a4 4 0 0 0 -8 0 V29 H4 a1 1 0 0 1 -1 -1 V14 Z"
                    fill="currentColor"
                />
            </svg>
            <span className="text-2xl font-bold tracking-tight text-rose-500">
                havena
            </span>
        </div>
    )
}

export default Logo;
