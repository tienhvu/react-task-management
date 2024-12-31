import { useSearchParams } from "react-router-dom";

export const usePagination = (
	defaultPage: number = 1,
	defaultLimit: number = 10,
) => {
	const [searchParams, setSearchParams] = useSearchParams();

	const getParamValue = (param: string, defaultValue: number) => {
		const value = searchParams.get(param);
		return value ? Number(value) : defaultValue;
	};

	const currentPage = getParamValue("page", defaultPage);
	const currentLimit = getParamValue("limit", defaultLimit);

	// Function to update search params
	const updateSearchParams = (params: Record<string, string>) => {
		const updatedParams = new URLSearchParams(searchParams);
		Object.keys(params).forEach((key) => {
			updatedParams.set(key, params[key]);
		});
		setSearchParams(updatedParams);
	};

	// Handle page change
	const handlePageChange = (newPage: number, totalPages: number) => {
		if (newPage > 0 && newPage <= totalPages) {
			updateSearchParams({ page: newPage.toString() });
		}
	};

	// Handle page size change
	const handlePageSizeChange = (eventKey: string | null) => {
		if (eventKey && Number(eventKey) !== currentLimit) {
			updateSearchParams({ limit: eventKey, page: "1" });
		}
	};

	return {
		currentPage,
		currentLimit,
		handlePageChange,
		handlePageSizeChange,
	};
};
