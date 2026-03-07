"use client";

import { useWebsocket } from "@/hooks/use-websocket";
import { authClient } from "@/lib/auth-client";

export function RealTimeStatus() {
    const { data: session } = authClient.useSession();

    useWebsocket(session?.user?.id);

    return null; // This component doesn't render anything
}
