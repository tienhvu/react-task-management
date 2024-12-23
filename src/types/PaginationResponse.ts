export type PaginatedResponse<T> = {
	data: {
		items: T[];
		meta: {
			total: number;
			page: number;
			limit: number;
		};
	};
	message: string;
};
