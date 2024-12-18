import { useState, useEffect, useRef } from "react";
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
import { searchCategories } from "~/store/slices/categorySlice";
import { AppDispatch } from "~/store/store";
import { Category } from "~/types/Category";

interface CategoryMultiSelectProps {
	categories: Category[];
}

export const CategoryMultiSelect = ({
	categories,
}: CategoryMultiSelectProps) => {
	const [searchTerm, setSearchTerm] = useState("");
	const debouncedSearchTerm = useDebounce(searchTerm, 500);
	const [showModal, setShowModal] = useState(false);
	const [isDropdownOpen, setIsDropdownOpen] = useState(false);
	const [selectedCategories, setSelectedCategories] = useState<Category[]>([]);
	const dispatch = useDispatch<AppDispatch>();

	const isFirstRender = useRef(true);

	const filteredCategories = categories.filter((cat) =>
		cat.name.toLowerCase().includes(searchTerm.toLowerCase()),
	);

	const handleCategoryToggle = (category: Category) => {
		const isSelected = selectedCategories.some((c) => c.id === category.id);
		if (isSelected) {
			setSelectedCategories(
				selectedCategories.filter((c) => c.id !== category.id),
			);
		} else {
			setSelectedCategories([...selectedCategories, category]);
		}
	};

	// Handle search term change
	const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
		setSearchTerm(e.target.value);
	};

	useEffect(() => {
		if (isFirstRender.current) {
			isFirstRender.current = false;
			return;
		}

		if (debouncedSearchTerm) {
			dispatch(searchCategories(debouncedSearchTerm));
		} else {
			dispatch(searchCategories(""));
		}
	}, [debouncedSearchTerm, dispatch]);

	return (
		<>
			<Dropdown
				show={isDropdownOpen}
				onToggle={(isOpen) => {
					setIsDropdownOpen(isOpen);
					if (isOpen) {
						setShowModal(true);
					}
				}}
				className="w-100"
				style={{ maxWidth: "300px", overflow: "hidden" }}
			>
				<Dropdown.Toggle variant="outline-secondary" className="w-100">
					{selectedCategories.length > 0
						? selectedCategories.map((cat) => cat.name).join(", ")
						: "Chọn danh mục"}
				</Dropdown.Toggle>
			</Dropdown>

			<Modal show={showModal} onHide={() => setShowModal(false)} size="lg">
				<Modal.Header closeButton>
					<Modal.Title>Chọn Danh Mục Chi Tiết</Modal.Title>
				</Modal.Header>
				<Modal.Body>
					<InputGroup className="mb-3">
						<Form.Control
							placeholder="Tìm kiếm danh mục"
							value={searchTerm}
							onChange={handleSearch}
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
							{filteredCategories.map((category) => (
								<tr
									key={category.id}
									className={
										selectedCategories.some((c) => c.id === category.id)
											? "table-active cursor-pointer"
											: "cursor-pointer"
									}
									onClick={() => handleCategoryToggle(category)}
								>
									<td>
										<Form.Check
											type="checkbox"
											id={`category-${category.id}`}
											checked={selectedCategories.some(
												(c) => c.id === category.id,
											)}
											onChange={() => handleCategoryToggle(category)}
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
