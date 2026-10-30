'use client';

import { ThemeProvider as NextThemesProvider } from "next-themes";

interface ThemeProviderProps {
    children: React.ReactNode;
}

// Light / dark / system theme. next-themes stores the choice in
// localStorage and sets the `dark` class on <html> before the first paint
// (an inline script), so there is no flash of the wrong theme.
const ThemeProvider: React.FC<ThemeProviderProps> = ({ children }) => {
    return (
        <NextThemesProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
        >
            {children}
        </NextThemesProvider>
    );
}

export default ThemeProvider;
