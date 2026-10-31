import { Suspense } from "react";

import Container from "../Container";
import Categories from "./Categories";
import Logo from "./Logo"
import Search from "./Search";
import ThemeToggle from "./ThemeToggle";
import UserMenu from "./UserMenu";

import { SafeUser } from "@/app/types";

interface NavbarProps {
    currentUser?: SafeUser | null;
}

// Search and Categories read useSearchParams(). On statically rendered
// pages (e.g. the 404 page) Next.js requires a Suspense boundary around
// such components; on dynamic pages they render immediately.
const Navbar: React.FC<NavbarProps> = ({
    currentUser
}) => {
    return(
        <div className="fixed w-full bg-white dark:bg-neutral-950 z-10 shadow-sm">
            <div className="
            py-4
            border-b-[1px]
            "
            >
            <Container>
            <div
                className="
                flex
                flex-row
                items-center
                justify-between
                gap-3
                md:gap-0
                "
                >
                <Logo />
                <Suspense fallback={null}>
                    <Search />
                </Suspense>
                <div className="flex flex-row items-center gap-1">
                    <ThemeToggle />
                    <UserMenu currentUser={currentUser} />
                </div>
            </div>
            </Container>

            </div>
            <Suspense fallback={null}>
                <Categories />
            </Suspense>
        </div>
    );
}

export default Navbar;
