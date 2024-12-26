import { useSearchParams } from "react-router-dom";
import { useEffect, useState } from "react";
import useDebounce from "~/hook/useDebounce";
import { Form } from "react-bootstrap";
interface SearchBarProps {
	placeholder?: string;
}

const SearchBar: React.FC<SearchBarProps> = ({ placeholder }) => {
	const [, setSearchParams] = useSearchParams();
	const [searchValue, setSearchValue] = useState("");
	const debouncedValue = useDebounce(searchValue, 500);

	useEffect(() => {
		const query = debouncedValue.trim()
			? { query: debouncedValue.trim() }
			: ({} as URLSearchParams);
		setSearchParams(query);
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
