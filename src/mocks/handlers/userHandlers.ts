/* eslint-disable @typescript-eslint/no-empty-object-type */
import { http, HttpResponse } from "msw";
import { baseURL } from "~/api/axiosInstance";
import { ErrorResponse } from "~/types/ErrorResponse";
import { User } from "~/types/User";

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

export const userHandlers = [
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
