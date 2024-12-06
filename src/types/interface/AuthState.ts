import { User } from "./User";

export interface AuthState {
	user: User | null;
	accessToken: string | null;
	refreshToken: string | null;
	error: string | null;
	loading: boolean;
}
