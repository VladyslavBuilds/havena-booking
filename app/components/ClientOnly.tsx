'use client';

import { useSyncExternalStore } from "react";

interface ClientOnlyProps {
    children: React.ReactNode;
}

// Nothing to subscribe to: the value only differs between server and client.
const subscribe = () => () => {};

// Renders its children only in the browser, after hydration. Use it for
// content that cannot be server-rendered consistently (e.g. depends on the
// user's time zone), not as a default wrapper.
const ClientOnly: React.FC<ClientOnlyProps> = ({ children }) => {
    const hasMounted = useSyncExternalStore(
        subscribe,
        () => true,   // value in the browser
        () => false   // value during server rendering
    );

    if (!hasMounted) {
        return null;
    }

    return <>{children}</>;
}

export default ClientOnly;
