"use client";

import { useEffect } from "react";
import { useAuthStore } from "../stores/UserStore";

export default function AuthHydration() {
    useEffect(() => {
        if (!useAuthStore.persist.hasHydrated()) {
            void useAuthStore.persist.rehydrate();
        }
    }, []);

    return null;
}