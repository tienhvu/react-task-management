import { useState } from "react";
import { Form } from "react-bootstrap";

interface SearchBarProps {
	onSearch: (query: string, type: "task" | "category") => void;
	searchType: "task" | "category";
}

export const SearchBar: React.FC<SearchBarProps> = ({
	onSearch,
	searchType,
}) => {
	const [query, setQuery] = useState("");

	const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
		const searchQuery = e.target.value;
		setQuery(searchQuery);
		onSearch(searchQuery, searchType);
	};

	return (
		<div className="mb-3">
			<Form.Control
				type="text"
				placeholder={`Search ${searchType}...`}
				value={query}
				onChange={handleSearch}
			/>
		</div>
	);
};
