import { useAuthStore } from "../stores/UserStore";

const getRefreshToken = (): string | null => {
	return useAuthStore.getState().refreshToken;
};

const getToken = (): string | null => {
	return useAuthStore.getState().token;
};

const updateToken = (token: string) => {
	console.log("token refreshed successfully");
	useAuthStore.getState().setToken(token);
};

const TokenService = { getRefreshToken, getToken, updateToken };

export default TokenService;
