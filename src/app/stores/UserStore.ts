import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import User, { AuthResponse } from "../types/User";

interface IAuth {
	user: User | null;
	loading: boolean;
	token: string | null;
	refreshToken: string | null;
	hydrated: boolean;
	setAuth: (auth: AuthResponse) => void;
	setToken: (token: string) => void;
	clearAuth: () => void;
	setLoading: (loading: boolean) => void;
	setHydrated: (hydrated: boolean) => void;
}

type PersistedAuth = Pick<IAuth, "user" | "token" | "refreshToken">;

export const useAuthStore = create<IAuth>()(
	persist<IAuth, [], [], PersistedAuth>(
		(set) => ({
			user: null,
			token: null,
			refreshToken: null,
			loading: false,
			hydrated: false,
			setAuth: ({ token, refreshToken, ...user }) =>
				set({ user, token, refreshToken }),
			setToken: (token) => set({ token }),
			clearAuth: () =>
				set({ user: null, token: null, refreshToken: null }),
			setLoading: (loading) => set({ loading }),
			setHydrated: (hydrated) => set({ hydrated }),
		}),
		{
			name: "activity-tracker-auth",
			storage: createJSONStorage<PersistedAuth>(() => localStorage),
			partialize: ({ user, token, refreshToken }) => ({
				user,
				token,
				refreshToken,
			}),
			skipHydration: true,
			onRehydrateStorage: () => (state) => state?.setHydrated(true),
		},
	),
);

export const useAuth = () => useAuthStore();
