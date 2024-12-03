export interface User {
	id: string;
	username: string;
	password: string;
	email: string;
	firstName: string;
	lastName: string;
	gender?: string;
	image?: string;
	createdAt: Date;
	updatedAt: Date;
}
