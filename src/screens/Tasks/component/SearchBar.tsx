/* eslint-disable @typescript-eslint/no-unused-vars */
import { useSearchParams } from "react-router-dom";
import { useEffect, useState } from "react";
import useDebounce from "~/hook/useDebounce";
import { Form } from "react-bootstrap";
interface SearchBarProps {
	placeholder?: string;
}

const SearchBar: React.FC<SearchBarProps> = ({ placeholder }) => {
	const [searchParams, setSearchParams] = useSearchParams();
	const [searchValue, setSearchValue] = useState("");
	const debouncedValue = useDebounce(searchValue, 500);

	useEffect(() => {
		if (debouncedValue?.trim() !== undefined) {
			if (debouncedValue.trim()) {
				setSearchParams({ query: debouncedValue.trim() });
			} else {
				setSearchParams({});
			}
		}
	}, [debouncedValue, setSearchParams]);

	return (
		<Form.Control
			type="text"
			placeholder={placeholder || "Tìm kiếm..."}
			value={searchValue}
			onChange={(e) => setSearchValue(e.target.value)}
		/>
	);
};

export default SearchBar;
