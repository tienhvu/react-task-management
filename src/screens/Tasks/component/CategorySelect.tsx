import { useEffect, useState } from "react";
import {
	Button,
	Dropdown,
	Form,
	InputGroup,
	Modal,
	Table,
} from "react-bootstrap";
import { Category } from "~/types/Category";
import { format } from "date-fns";

interface CategorySelectProps {
	categories: Category[];
	value?: Category[];
	onChange?: (categories: Category[]) => void;
}

export const CategorySelect = ({
	categories,
	value,
	onChange,
}: CategorySelectProps) => {
	const [searchTerm, setSearchTerm] = useState("");
	const [showModal, setShowModal] = useState(false);
	const [isDropdownOpen, setIsDropdownOpen] = useState(false);
	const [selectedCategories, setSelectedCategories] = useState<Category[]>(
		value || [],
	);

	useEffect(() => {
		if (value) {
			setSelectedCategories(value);
		}
	}, [value]);

	const filteredCategories = categories.filter((cat) =>
		cat.name.toLowerCase().includes(searchTerm.toLowerCase()),
	);

	const handleCategory = (category: Category) => {
		const isSelected = selectedCategories.some((c) => c.id === category.id);
		let newSelectedCategories;

		if (isSelected) {
			newSelectedCategories = selectedCategories.filter(
				(c) => c.id !== category.id,
			);
		} else {
			newSelectedCategories = [...selectedCategories, category];
		}

		setSelectedCategories(newSelectedCategories);
		onChange?.(newSelectedCategories);
	};

	const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
		setSearchTerm(e.target.value);
	};

	const handleConfirm = () => {
		onChange?.(selectedCategories);
		setShowModal(false);
	};

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
								<th>Thời gian thêm</th>
								<th>Thời gian cập nhật</th>
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
									onClick={() => handleCategory(category)}
								>
									<td>
										<Form.Check
											type="checkbox"
											id={`category-${category.id}`}
											checked={selectedCategories.some(
												(c) => c.id === category.id,
											)}
											onChange={() => handleCategory(category)}
										/>
									</td>
									<td>{category.name}</td>
									<td>{category.description}</td>
									<td>
										{format(
											new Date(category.updatedAt),
											"HH:mm:ss dd/MM/yyyy",
										)}
									</td>
									<td>
										{format(
											new Date(category.createdAt),
											"HH:mm:ss dd/MM/yyyy",
										)}
									</td>
								</tr>
							))}
						</tbody>
					</Table>
				</Modal.Body>
				<Modal.Footer>
					<Button variant="secondary" onClick={() => setShowModal(false)}>
						Đóng
					</Button>
					<Button variant="primary" onClick={handleConfirm}>
						Xác Nhận
					</Button>
				</Modal.Footer>
			</Modal>
		</>
	);
};
