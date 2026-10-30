'use client';

import { useTheme } from "next-themes";
import { FiMoon, FiSun } from "react-icons/fi";

// Sun in light mode, moon in dark mode. Both icons are rendered and CSS
// (the `dark` class on <html>) decides which one is visible, so the
// server and the client render the same markup.
const ThemeToggle = () => {
    const { resolvedTheme, setTheme } = useTheme();

    return (
        <button
            type="button"
            onClick={() => setTheme(resolvedTheme === "dark" ? "light" : "dark")}
            aria-label="Toggle dark mode"
            title="Toggle dark mode"
            className="
                p-3
                rounded-full
                hover:bg-neutral-100
                dark:hover:bg-neutral-800
                transition
                cursor-pointer
            "
        >
            <FiSun size={18} className="block dark:hidden" aria-hidden="true" />
            <FiMoon size={18} className="hidden dark:block" aria-hidden="true" />
        </button>
    );
}

export default ThemeToggle;
