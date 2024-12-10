/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-empty-object-type */
import { User } from "~/types/interface/User";
import { http, HttpResponse } from "msw";
import { baseURL } from "~/api/axiosInstance";
import { ErrorResponse } from "~/types/interface/ErrorResponse";
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

type UpdateUserRequest = {
	username?: string;
	email?: string;
	firstName?: string;
	lastName?: string;
	gender?: string;
	updatedAt?: Date;
};

type UpdateUserResponse = {
	data: {
		user: Omit<User, "password">;
	};
	message: string;
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

function isTokenValid(token: string | null): boolean {
	const activeTokens = JSON.parse(localStorage.getItem("activeTokens") || "{}");
	return token !== null && activeTokens[token] !== undefined;
}
export const authHandlers = [
	// http.all("*", async ({ request }) => {
	// 	const publicRoutes = [`${baseURL}/auth/login`, `${baseURL}/auth/register`];

	// 	if (request.url.startsWith(baseURL)) {
	// 		if (publicRoutes.some((route) => request.url.startsWith(route))) {
	// 			return;
	// 		}

	// 		const authHeader = request.headers.get("Authorization");
	// 		const token = authHeader ? authHeader.replace("Bearer ", "") : null;

	// 		if (!token || !isTokenValid(token)) {
	// 			return HttpResponse.json(
	// 				{
	// 					message: "Unauthorized. Please log in.",
	// 					statusCode: 401,
	// 					redirectUrl: "/login",
	// 				},
	// 				{
	// 					status: 401,
	// 					headers: {
	// 						"X-Redirect": "/login",
	// 					},
	// 				},
	// 			);
	// 		}
	// 	}
	// }),

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

	// Update user
	http.patch<
		{ userId: string },
		UpdateUserRequest,
		UpdateUserResponse | ErrorResponse
	>(`${baseURL}/users/:userId`, async ({ params, request }) => {
		const { userId } = params;
		const userUpdate = await request.json();
		await new Promise((resolve) => setTimeout(resolve, 2000));
		const existingUser = users.find((user) => user.id === userId);
		if (!existingUser) {
			return HttpResponse.json(
				{
					message: "User not found",
					statusCode: 404,
				},
				{ status: 404 },
			);
		}
		if (userUpdate.username) {
			if (
				users.some(
					(user) => user.username === userUpdate.username && user.id !== userId,
				)
			) {
				return HttpResponse.json(
					{
						message: "Username already exists",
						statusCode: 409,
					},
					{ status: 409 },
				);
			}
		}

		if (userUpdate.email) {
			if (
				users.some(
					(user) => user.email === userUpdate.email && user.id !== userId,
				)
			) {
				return HttpResponse.json(
					{
						message: "Email already exists",
						statusCode: 409,
					},
					{ status: 409 },
				);
			}
		}

		existingUser.firstName = userUpdate.firstName ?? existingUser.firstName;
		existingUser.lastName = userUpdate.lastName ?? existingUser.lastName;
		existingUser.gender = userUpdate.gender ?? existingUser.gender;
		existingUser.username = userUpdate.username ?? existingUser.username;
		existingUser.email = userUpdate.email ?? existingUser.email;
		existingUser.updatedAt = new Date();

		updateLocalStorage();

		return HttpResponse.json(
			{
				data: { user: existingUser },
				message: "User updated successfully",
			},
			{ status: 200 },
		);
	}),

	http.delete<{ userId: string }, {}, ErrorResponse | null>(
		`${baseURL}/users/:userId`,
		async ({ params }) => {
			const { userId } = params;
			await new Promise((resolve) => setTimeout(resolve, 2000));
			const userIndex = users.findIndex((user) => user.id === userId);
			if (userIndex === -1) {
				return HttpResponse.json(
					{
						message: "User not found",
						statusCode: 404,
					},
					{
						status: 404,
					},
				);
			}

			users.splice(userIndex, 1);
			updateLocalStorage();
			return HttpResponse.json(null, { status: 204 });
		},
	),
];
