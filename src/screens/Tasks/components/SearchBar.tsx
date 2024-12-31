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
		const params = new URLSearchParams(searchParams);
		params.set("query", debouncedValue.trim() ?? "");
		setSearchParams(params);
	}, [debouncedValue, searchParams, setSearchParams]);

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
