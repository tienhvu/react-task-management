import React, { useEffect, useState } from "react";
import {
	Button,
	Dropdown,
	Form,
	InputGroup,
	Modal,
	Table,
} from "react-bootstrap";
import { useDispatch } from "react-redux";
import useDebounce from "~/hook/useDebounce";
import { getCategories, searchCategories } from "~/store/slices/categorySlice";
import { AppDispatch } from "~/store/store";
import { Category } from "~/types/Category";

interface CategoryDropDownProps {
	categories: Category[];
	selectedCategories: Category[];
	onChange: (categories: Category[]) => void;
}

export const CategoryDropDown: React.FC<CategoryDropDownProps> = ({
	categories,
	selectedCategories,
	onChange,
}) => {
	const [showModal, setShowModal] = useState(false);
	const [searchTerm, setSearchTerm] = useState("");

	const dispatch = useDispatch<AppDispatch>();
	const debouncedSearchTerm = useDebounce(searchTerm, 500);
	useEffect(() => {
		if (debouncedSearchTerm) {
			dispatch(searchCategories(debouncedSearchTerm));
		} else {
			dispatch(getCategories());
		}
	}, [debouncedSearchTerm, dispatch]);

	const handleCategoryToggle = (category: Category) => {
		const isSelected = selectedCategories.some((c) => c.id === category.id);
		const newSelectedCategories = isSelected
			? selectedCategories.filter((c) => c.id !== category.id)
			: [...selectedCategories, category];

		onChange(newSelectedCategories);
	};

	return (
		<>
			<Dropdown>
				<Dropdown.Toggle
					variant="outline-secondary"
					onClick={() => setShowModal(true)}
				>
					{selectedCategories.length > 0
						? selectedCategories.map((cat) => cat.name).join(", ")
						: "Chọn danh mục"}
				</Dropdown.Toggle>
			</Dropdown>

			<Modal show={showModal} onHide={() => setShowModal(false)} size="lg">
				<Modal.Header closeButton>
					<Modal.Title>Chọn Danh Mục</Modal.Title>
				</Modal.Header>
				<Modal.Body>
					<InputGroup className="mb-3">
						<Form.Control
							placeholder="Tìm kiếm danh mục"
							value={searchTerm}
							onChange={(e) => setSearchTerm(e.target.value)}
						/>
					</InputGroup>

					<Table striped bordered hover>
						<thead>
							<tr>
								<th>Chọn</th>
								<th>Tên Danh Mục</th>
								<th>Mô Tả</th>
							</tr>
						</thead>
						<tbody>
							{categories.map((category) => (
								<tr
									key={category.id}
									onClick={() => handleCategoryToggle(category)}
								>
									<td>
										<Form.Check
											type="checkbox"
											checked={selectedCategories.some(
												(c) => c.id === category.id,
											)}
											readOnly
										/>
									</td>
									<td>{category.name}</td>
									<td>{category.description}</td>
								</tr>
							))}
						</tbody>
					</Table>
				</Modal.Body>
				<Modal.Footer>
					<Button variant="secondary" onClick={() => setShowModal(false)}>
						Đóng
					</Button>
					<Button variant="primary" onClick={() => setShowModal(false)}>
						Xác Nhận
					</Button>
				</Modal.Footer>
			</Modal>
		</>
	);
};
