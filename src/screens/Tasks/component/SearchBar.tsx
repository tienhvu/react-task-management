/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect } from "react";
import { Form } from "react-bootstrap";
import useDebounce from "~/hook/useDebounce";

interface SearchBarProps {
	onSearch: (query: string) => void;
	onReset: () => void;
	placeholder?: string;
	debounceTime?: number;
}

const SearchBar: React.FC<SearchBarProps> = ({
	onSearch,
	onReset,
	placeholder,
	debounceTime = 500,
}) => {
	const [searchTerm, setSearchTerm] = useState("");
	const debouncedSearchTerm = useDebounce(searchTerm, debounceTime);

	useEffect(() => {
		if (debouncedSearchTerm.trim() === "") {
			onReset();
		} else {
			onSearch(debouncedSearchTerm);
		}
	}, [debouncedSearchTerm]);

	const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		setSearchTerm(e.target.value);
	};

	return (
		<Form.Control
			type="text"
			placeholder={placeholder || "Search..."}
			value={searchTerm}
			onChange={handleChange}
		/>
	);
};

export default SearchBar;
