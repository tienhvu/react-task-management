/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-empty-object-type */
import { User } from "~/types/interface/User";
import { http, HttpResponse } from "msw";
import { baseURL } from "~/intercepter/intercepter";
import { ErrorResponse } from "~/types/interface/ErrorResponse";

type LoginResponse = {
	user: Omit<User, "password">;
	access_token: string;
	refresh_token: string;
};

type LoginRequestBody = {
	username: string;
	password: string;
};

type RegisterRequestBody = {
	username: string;
	password: string;
	email: string;
};

type UpdateUserBody = {
	firstName?: string;
	lastName?: string;
	gender?: string;
	image?: string;
};

const users: User[] = [];

export const authHandlers = [
	//Register
	http.post<{}, RegisterRequestBody, Omit<User, "password"> | ErrorResponse>(
		`${baseURL}/auth/register`,
		async ({ request }) => {
			const { username, email, password } =
				(await request.json()) as RegisterRequestBody;

			const existingUser = users.find(
				(user) => user.username === username || user.email === email,
			);
			if (existingUser) {
				return HttpResponse.json({
					message: "Username hoặc email đã tồn tại",
					statusCode: 400,
				});
			}

			const newUser: User = {
				id: users.length + 1,
				username,
				password,
				email,
				firstName: "DefaultFirstName",
				lastName: "DefaultLastName",
				gender: "Male",
				image: "https://via.placeholder.com/150",
				createdAt: new Date(),
				updatedAt: new Date(),
			};

			users.push(newUser);
			const { password: _, ...userWithoutPassword } = newUser;
			return HttpResponse.json(userWithoutPassword, { status: 201 });
		},
	),

	// Login
	http.post<{}, LoginRequestBody, LoginResponse | ErrorResponse>(
		`${baseURL}/auth/login`,
		async ({ request }) => {
			const { username, password } = await request.json();
			console.log("Received username:", username);
			console.log("Received password:", password);
			if (!username || !password) {
				return HttpResponse.json({
					message: "Username and password are required",
					statusCode: 400,
				});
			}

			const validUsers = [
				{
					username: "john.doe",
					password: "password123",
					user: {
						id: 1,
						username: "john.doe",
						email: "john.doe@example.com",
						firstName: "John",
						lastName: "Doe",
						gender: "Male",
						image: "https://via.placeholder.com/150",
						createdAt: new Date(),
						updatedAt: new Date(),
					},
				},
				{
					username: "jane.doe",
					password: "password456",
					user: {
						id: 2,
						username: "jane.doe",
						email: "jane.doe@example.com",
						firstName: "Jane",
						lastName: "Doe",
						gender: "Female",
						image: "https://via.placeholder.com/150",
						createdAt: new Date(),
						updatedAt: new Date(),
					},
				},
			];

			const foundUser = validUsers.find(
				(u) =>
					u.username.trim() === username.trim() &&
					u.password.trim() === password.trim(),
			);

			console.log(foundUser);

			if (foundUser) {
				return HttpResponse.json(
					{
						user: foundUser.user,
						access_token: "access_token_example",
						refresh_token: "refresh_token_example",
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
			const { firstName, lastName, gender, image } = await request.json();

			const existingUser = users.find((user) => user.id === Number(userId));
			if (!existingUser) {
				return HttpResponse.json({
					message: "User not found",
					statusCode: 404,
				});
			}

			existingUser.firstName = firstName || existingUser.firstName;
			existingUser.lastName = lastName || existingUser.lastName;
			existingUser.gender = gender || existingUser.gender;
			existingUser.image = image || existingUser.image;
			existingUser.updatedAt = new Date();

			return HttpResponse.json(existingUser, { status: 200 });
		},
	),

	http.delete<{ userId: string }, {}, ErrorResponse | null>(
		`${baseURL}/users/:userId`,
		({ params }) => {
			const { userId } = params;

			const userIndex = users.findIndex((user) => user.id === Number(userId));
			if (userIndex === -1) {
				return HttpResponse.json({
					message: "User not found",
					statusCode: 404,
				});
			}

			users.splice(userIndex, 1);

			return HttpResponse.json(null, { status: 204 });
		},
	),
];
