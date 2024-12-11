/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-empty-object-type */
import { User } from "~/types/User";
import { http, HttpResponse } from "msw";
import { baseURL } from "~/api/axiosInstance";
import { ErrorResponse } from "~/types/ErrorResponse";
import { v4 as uuidv4 } from "uuid";

type LoginResponse = {
	user: Omit<User, "password">;
};

type LoginRequestBody = {
	username: string;
	password: string;
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
	http.post(`${baseURL}/auth/logout`, async ({ request }) => {
		await new Promise((resolve) => setTimeout(resolve, 1000));
		return HttpResponse.json(null, {
			status: 200,
		});
	}),
];
