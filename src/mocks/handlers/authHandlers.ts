/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-empty-object-type */
import { User } from "~/types/interface/User";
import { http, HttpResponse } from "msw";
import { baseURL } from "~/interceptor/Interceptor";
import { ErrorResponse } from "~/types/interface/ErrorResponse";
import { v4 as uuidv4 } from "uuid";

type LoginResponse = {
	user: Omit<User, "password">;
	accessToken: string;
	refreshToken: string;
};

type LoginRequestBody = {
	username: string;
	password: string;
};

type UpdateUserBody = {
	firstName?: string;
	lastName?: string;
	gender?: string;
	image?: string;
	username?: string;
	email?: string;
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
	http.post<{}, User, Omit<User, "password"> | ErrorResponse>(
		`${baseURL}/auth/register`,
		async ({ request }) => {
			const userReq = await request.json();

			const existingUsername = users.find(
				(user) => user.username === userReq.username,
			);
			const existingEmail = users.find((user) => user.email === userReq.email);
			if (existingUsername) {
				return HttpResponse.json(
					{
						message: "Username đã tồn tại",
						statusCode: 409,
					},
					{ status: 409 },
				);
			} else if (existingEmail) {
				return HttpResponse.json(
					{
						message: "Email đã tồn tại",
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
				image: "https://via.placeholder.com/150",
				createdAt: new Date(),
				updatedAt: new Date(),
			};

			users.push(newUser);
			updateLocalStorage();

			const { password: _, ...userWithoutPassword } = newUser;
			return HttpResponse.json(userWithoutPassword, { status: 201 });
		},
	),

	// Login
	http.post<{}, LoginRequestBody, LoginResponse | ErrorResponse>(
		`${baseURL}/auth/login`,
		async ({ request }) => {
			const { username, password } = await request.json();
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
						user: userWithoutPassword,
						accessToken: generateRandomToken(),
						refreshToken: generateRandomToken(),
					},
					{ status: 200 },
				);
			} else {
				return HttpResponse.json(
					{
						message: "Invalid username or password",
						statusCode: 401,
					},
					{ status: 401 },
				);
			}
		},
	),

	// Logout
	http.post(`${baseURL}/auth/logout`, () => {
		return HttpResponse.json(null, { status: 200 });
	}),

	// Update user
	http.patch<{ userId: string }, UpdateUserBody, User | ErrorResponse>(
		`${baseURL}/users/:userId`,
		async ({ params, request }) => {
			const { userId } = params;
			const userUpdate = await request.json();

			const existingUser = users.find((user) => user.id === userId);
			if (!existingUser) {
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

			if (
				userUpdate.username &&
				users.some(
					(user) => user.username === userUpdate.username && user.id !== userId,
				)
			) {
				return HttpResponse.json(
					{
						message: "Username đã tồn tại",
						statusCode: 409,
					},
					{ status: 409 },
				);
			}

			if (
				userUpdate.email &&
				users.some(
					(user) => user.email === userUpdate.email && user.id !== userId,
				)
			) {
				return HttpResponse.json(
					{
						message: "Email đã tồn tại",
						statusCode: 409,
					},
					{ status: 409 },
				);
			}

			existingUser.firstName = userUpdate.firstName || existingUser.firstName;
			existingUser.lastName = userUpdate.lastName || existingUser.lastName;
			existingUser.gender = userUpdate.gender || existingUser.gender;
			existingUser.image = userUpdate.image || existingUser.image;
			existingUser.username = userUpdate.username || existingUser.username;
			existingUser.email = userUpdate.email || existingUser.email;
			existingUser.updatedAt = new Date();

			updateLocalStorage();

			return HttpResponse.json(existingUser, { status: 200 });
		},
	),

	http.delete<{ userId: string }, {}, ErrorResponse | null>(
		`${baseURL}/users/:userId`,
		({ params }) => {
			const { userId } = params;

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
