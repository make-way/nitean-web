"use client";

import { useEffect, useRef } from "react";

export function useWebsocket(userId: string | undefined) {
    const socketRef = useRef<WebSocket | null>(null);

    useEffect(() => {
        if (!userId) {
            if (socketRef.current) {
                socketRef.current.close();
                socketRef.current = null;
            }
            return;
        }

        const protocol = window.location.protocol === "https:" ? "wss:" : "ws:";
        const host = window.location.hostname;
        const port = process.env.NEXT_PUBLIC_WS_PORT || "3001";
        const wsUrl = `${protocol}//${host}:${port}`;

        const connect = () => {
            const socket = new WebSocket(wsUrl);
            socketRef.current = socket;

            socket.onopen = () => {
                console.log("🔌 Connected to WebSocket");
                socket.send(JSON.stringify({ type: "AUTH", userId }));
            };

            socket.onclose = () => {
                console.log("🔌 Disconnected from WebSocket");
                // Attempt to reconnect after 5 seconds
                setTimeout(() => {
                    if (userId) connect();
                }, 5000);
            };

            socket.onerror = (error) => {
                console.error("🔌 WebSocket error:", error);
                socket.close();
            };
        };

        connect();

        return () => {
            if (socketRef.current) {
                socketRef.current.close();
                socketRef.current = null;
            }
        };
    }, [userId]);
}
