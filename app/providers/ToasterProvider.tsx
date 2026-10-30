'use client';

import { useTheme } from 'next-themes';
import { Toaster } from 'react-hot-toast';

// react-hot-toast styles its toasts inline, so the dark colours have to be
// passed as styles rather than classes.
const ToasterProvider = () => {
    const { resolvedTheme } = useTheme();
    const isDark = resolvedTheme === 'dark';

    return (
        <Toaster
            toastOptions={{
                style: isDark
                    ? { background: '#262626', color: '#f5f5f5' }
                    : undefined,
            }}
        />
    )
}

export default ToasterProvider;
