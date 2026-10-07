"use client";

import { useEffect } from "react";
import { refreshAuthToken } from "../http-common";
import { useAuthStore } from "../stores/UserStore";

const TOKEN_REFRESH_INTERVAL_MS = 5 * 60 * 1000;

export default function AuthKeepAlive() {
    const hydrated = useAuthStore((state) => state.hydrated);
    const refreshToken = useAuthStore((state) => state.refreshToken);

    useEffect(() => {
        if (!hydrated || !refreshToken) {
            return;
        }

        const intervalId = window.setInterval(() => {
            void refreshAuthToken().catch(() => {
                useAuthStore.getState().clearAuth();
            });
        }, TOKEN_REFRESH_INTERVAL_MS);

        return () => window.clearInterval(intervalId);
    }, [hydrated, refreshToken]);

    return null;
}