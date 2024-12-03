export interface PaginatedResponse<T> {
	data: T[];
	meta: {
		page: number;
		pageSize: number;
		totalPages: number;
		totalItems: number;
	};
}
