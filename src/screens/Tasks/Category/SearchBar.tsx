import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { Form } from "react-bootstrap";
import useDebounce from "~/hook/useDebounce";
import { searchCategories, getCategories } from "~/store/slices/categorySlice";
import { AppDispatch } from "~/store/store";

const SearchBar = () => {
	const dispatch = useDispatch<AppDispatch>();
	const [searchTerm, setSearchTerm] = useState("");
	const debouncedSearchTerm = useDebounce(searchTerm, 500);

	React.useEffect(() => {
		if (debouncedSearchTerm) {
			dispatch(searchCategories(debouncedSearchTerm));
		} else {
			dispatch(getCategories());
		}
	}, [debouncedSearchTerm, dispatch]);

	const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		setSearchTerm(e.target.value);
	};

	return (
		<Form.Control
			type="text"
			placeholder="Tìm kiếm danh mục"
			value={searchTerm}
			onChange={handleChange}
		/>
	);
};

export default SearchBar;
