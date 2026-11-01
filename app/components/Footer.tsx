import Link from "next/link";

import Container from "./Container";
import { OPERATOR, SITE } from "../libs/legal";

// Site-wide footer: who runs the site, that it is a demo, and the links
// to the legal pages.
const Footer = () => {
    const year = new Date().getFullYear();

    return (
        <footer className="border-t border-neutral-200 dark:border-neutral-800">
            <Container>
                <div className="
                    flex
                    flex-col
                    md:flex-row
                    md:items-center
                    md:justify-between
                    gap-4
                    py-8
                    text-sm
                    text-neutral-500 dark:text-neutral-400
                ">
                    <div>
                        © {year} {SITE.name} · a portfolio project by {OPERATOR.name}.
                        {" "}Demo only: no real bookings, no payments.
                    </div>
                    <nav aria-label="Legal" className="flex flex-row flex-wrap gap-x-6 gap-y-2">
                        <Link href="/privacy" className="hover:underline">Privacy</Link>
                        <Link href="/terms" className="hover:underline">Terms of Use</Link>
                        <Link href="/imprint" className="hover:underline">Imprint</Link>
                        <a
                            href={SITE.repo}
                            target="_blank"
                            rel="noreferrer"
                            className="hover:underline"
                        >
                            GitHub
                        </a>
                    </nav>
                </div>
            </Container>
        </footer>
    );
};

export default Footer;
