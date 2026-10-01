import httpCommon from "../http-common";
import Login from "../types/Login";
import { AuthResponse } from "../types/User";
import { useAuthStore } from "../stores/UserStore";
import authHeader from "./AuthHeader";

const login = (data: Login) => {
	return httpCommon.post<AuthResponse>("/v1/auth/authenticate", data);
};

const logout = async () => {
	await httpCommon.get("/v1/auth/sign-out", { headers: authHeader() });
	useAuthStore.getState().clearAuth();
};
const AuthService = { login, logout };

export default AuthService;
