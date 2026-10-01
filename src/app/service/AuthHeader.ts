import { useAuthStore } from "../stores/UserStore";

export default function authHeader() {
	const token = useAuthStore.getState().token;
	return token ? { Authorization: `Bearer ${token}` } : {};
}
