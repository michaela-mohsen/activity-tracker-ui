"use client";

import { useAuthStore } from "../stores/UserStore";

export default function Dashboard() {
    const user = useAuthStore((state) => state.user);
    const hydrated = useAuthStore((state) => state.hydrated);

    if (!hydrated) {
        return <main>Loading account...</main>;
    }

    if (!user) {
        return <main>Please log in to view your dashboard.</main>;
    }

    return (
        <main>
            <h1>Dashboard</h1>
            <p>Welcome, {user.username}.</p>
        </main>
    );
}