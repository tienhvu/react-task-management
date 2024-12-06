export interface User {
	id: string;
	username: string;
	password: string;
	email: string;
	firstName: string;
	lastName: string;
	gender?: string;
	createdAt: Date;
	updatedAt: Date;
}
