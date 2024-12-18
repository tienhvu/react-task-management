/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-empty-object-type */
import { http, HttpResponse } from "msw";
import { v4 as uuidv4 } from "uuid";
import { baseURL } from "~/api/axiosInstance";
import { ErrorResponse } from "~/types/ErrorResponse";
import { User } from "~/types/User";

type LoginResponse = {
	user: Omit<User, "password">;
};
export type AuthResponse = {
	accessToken: string;
	refreshToken: string;
};

type LoginRequestBody = {
	username: string;
	password: string;
};

export type ResetPasswordRequestBody = {
	userId: string;
	oldPassword: string;
	newPassword: string;
};

type SuccessResponse<T> = {
	data: T;
	accessToken: string;
	refreshToken: string;
};

const users: User[] = JSON.parse(localStorage.getItem("users") || "[]");

function updateLocalStorage() {
	localStorage.setItem("users", JSON.stringify(users));
}

function generateRandomToken(): string {
	return uuidv4();
}

function generateId(): string {
	return `user_${Date.now()}_${Math.random().toString(36).slice(2, 11)}`;
}

export const authHandlers = [
	//Register
	http.post<{}, User, { data: Omit<User, "password"> } | ErrorResponse>(
		`${baseURL}/auth/register`,
		async ({ request }) => {
			const userReq = await request.json();
			await new Promise((resolve) => setTimeout(resolve, 2000));
			const existingUsername = users.find(
				(user) => user.username === userReq.username,
			);
			const existingEmail = users.find((user) => user.email === userReq.email);
			if (existingUsername) {
				return HttpResponse.json(
					{
						message: "Username is already existed",
						statusCode: 409,
					},
					{ status: 409 },
				);
			} else if (existingEmail) {
				return HttpResponse.json(
					{
						message: "Email is already existed",
						statusCode: 409,
					},
					{ status: 409 },
				);
			}

			const newUser: User = {
				id: generateId(),
				username: userReq.username,
				password: userReq.password,
				email: userReq.email,
				firstName: userReq.firstName,
				lastName: userReq.lastName,
				gender: userReq.gender,
				createdAt: new Date(),
				updatedAt: new Date(),
			};

			users.push(newUser);
			updateLocalStorage();

			const { password: _, ...userWithoutPassword } = newUser;
			return HttpResponse.json({ data: userWithoutPassword }, { status: 201 });
		},
	),

	// Login
	http.post<
		{},
		LoginRequestBody,
		SuccessResponse<LoginResponse> | ErrorResponse
	>(`${baseURL}/auth/login`, async ({ request }) => {
		const { username, password } = await request.json();
		await new Promise((resolve) => setTimeout(resolve, 2000));
		if (!username || !password) {
			return HttpResponse.json(
				{
					message: "Username and password are required",
					statusCode: 400,
				},
				{ status: 400 },
			);
		}

		const foundUser = users.find(
			(u) =>
				u.username.trim() === username.trim() &&
				u.password.trim() === password.trim(),
		);
		if (foundUser) {
			const { password, ...userWithoutPassword } = foundUser;
			return HttpResponse.json(
				{
					data: {
						user: userWithoutPassword,
					},
					accessToken: generateRandomToken(),
					refreshToken: generateRandomToken(),
				},
				{ status: 200 },
			);
		} else {
			return HttpResponse.json(
				{
					message: "Invalid username or password",
					statusCode: 400,
				},
				{ status: 400 },
			);
		}
	}),

	// Logout
	http.post(`${baseURL}/auth/logout`, async () => {
		await new Promise((resolve) => setTimeout(resolve, 1000));
		return HttpResponse.json(null, {
			status: 200,
		});
	}),

	//Reset password
	http.patch<
		{},
		ResetPasswordRequestBody,
		SuccessResponse<{ message: string }> | ErrorResponse
	>(`${baseURL}/auth/reset-password`, async ({ request }) => {
		const { userId, oldPassword, newPassword } = await request.json();

		await new Promise((resolve) => setTimeout(resolve, 2000));

		if (!userId || !oldPassword || !newPassword) {
			return HttpResponse.json(
				{ message: "Missing parameters", statusCode: 400 },
				{ status: 400 },
			);
		}

		if (oldPassword === newPassword) {
			return HttpResponse.json(
				{
					message: "The new password cannot be the same as the old password",
					statusCode: 400,
				},
				{ status: 400 },
			);
		}

		const user = users.find((user) => user.id === userId);

		if (!user) {
			return HttpResponse.json(
				{ message: "User not found", statusCode: 404 },
				{ status: 404 },
			);
		}

		if (user.password !== oldPassword) {
			return HttpResponse.json(
				{ message: "Incorrect old password", statusCode: 400 },
				{ status: 400 },
			);
		}

		user.password = newPassword;
		user.updatedAt = new Date();

		updateLocalStorage();

		return HttpResponse.json(
			{ message: "Password updated successfully", statusCode: 200 },
			{ status: 200 },
		);
	}),

	// Refresh Token
	http.post<
		{},
		{ refreshToken: string; userId: string },
		SuccessResponse<LoginResponse> | ErrorResponse
	>(`${baseURL}/auth/refresh-token`, async ({ request }) => {
		const { refreshToken, userId } = await request.json();
		if (!refreshToken) {
			return HttpResponse.json(
				{
					message: "Refresh token is required",
					statusCode: 400,
				},
				{ status: 400 },
			);
		}

		const user = users.find((user) => user.id === userId);

		if (!user) {
			return HttpResponse.json(
				{
					message: "User not found",
					statusCode: 400,
				},
				{ status: 400 },
			);
		}

		const newAccessToken = generateRandomToken();
		const newRefreshToken = generateRandomToken();

		updateLocalStorage();

		const { password, ...userWithoutPassword } = user;

		return HttpResponse.json(
			{
				accessToken: newAccessToken,
				refreshToken: newRefreshToken,
				data: {
					user: userWithoutPassword,
				},
			},
			{ status: 200 },
		);
	}),

	// Logout - Xóa thông tin đăng nhập
	http.delete<{}, { userId: string }, AuthResponse | ErrorResponse>(
		`${baseURL}/auth/delete`,
		async ({ request }) => {
			const { userId } = await request.json();
			await new Promise((resolve) => setTimeout(resolve, 2000));

			const user = users.find((user) => user.id === userId);
			if (!user) {
				return HttpResponse.json(
					{
						message: "User not found",
						statusCode: 400,
					},
					{ status: 400 },
				);
			}

			const newAccessToken = "";
			const newRefreshToken = "";

			updateLocalStorage();

			return HttpResponse.json(
				{
					accessToken: newAccessToken,
					refreshToken: newRefreshToken,
				},
				{ status: 200 },
			);
		},
	),
];
