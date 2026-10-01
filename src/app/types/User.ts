export default interface User {
	id: string;
	username: string;
	email: string;
}

export interface AuthResponse extends User {
	token: string;
	refreshToken: string;
}
