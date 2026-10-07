import axios from "axios";
import { useAuthStore } from "./stores/UserStore";
import TokenService from "./service/TokenService";
import authHeader from "./service/AuthHeader";

const API_BASE_URL = "http://localhost:8008/api";
const instance = axios.create({
	baseURL: API_BASE_URL,
	headers: {
		"Content-Type": "application/json",
		"Access-Control-Allow-Origin": "*",
	},
});

instance.interceptors.request.use(
	(config) => {
		const token = TokenService.getToken();
		if (token) {
			config.headers.set("Authorization", `Bearer ${token}`);
		}
		return config;
	},
	(error) => {
		return Promise.reject(error);
	},
);

instance.interceptors.response.use(
	(response) => {
		return response;
	},
	async (error) => {
		const originalConfig = error.config;

		const url = originalConfig.url;
		const isAuthRequest = [
			"/v1/auth/authenticate",
			"/v1/auth/sign-out",
		].some((path) => url.includes(path));

		if (isAuthRequest || error.response?.status !== 401) {
			return Promise.reject(error);
		}
		console.log("token expired, refreshing token");
		originalConfig._retry = true;
		try {
			await refreshAuthToken();
			return instance(originalConfig);
		} catch (refreshError) {
			useAuthStore.getState().clearAuth();
			return Promise.reject(refreshError);
		}
	},
);

let refreshPromise: Promise<void> | null = null;

export const refreshAuthToken = () => {
	if (!refreshPromise) {
		const refreshToken = TokenService.getRefreshToken();
		console.log("refreshing token");
		refreshPromise = instance
			.post<{ refreshToken: string; accessToken: string }>(
				`/v1/auth/refresh-token`,
				{ refreshToken },
				{ headers: authHeader() },
			)
			.then(({ data }) => {
				TokenService.updateToken(data.accessToken);
			})
			.finally(() => {
				refreshPromise = null;
			});
	}

	return refreshPromise;
};

export default instance;
