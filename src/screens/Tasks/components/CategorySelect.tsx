import { useState, useEffect } from "react";
import { Button, Dropdown, Modal } from "react-bootstrap";
import { Category } from "~/types/Category";
import { CategoryTable } from "./CategoryTable";

interface CategorySelectProps {
	categories: Category[];
	value?: Category[];
	onChange?: (categories: Category[]) => void;
	isSelectOpen?: boolean;
}

export const CategorySelect = ({
	categories,
	value,
	onChange,
	isSelectOpen,
}: CategorySelectProps) => {
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

	useEffect(() => {
		if (isSelectOpen !== undefined) {
			setShowModal(isSelectOpen);
		}
	}, [isSelectOpen]);

	const handleCategory = (category: Category) => {
		const isSelected = selectedCategories.some((c) => c.id === category.id);
		const newSelectedCategories = isSelected
			? selectedCategories.filter((c) => c.id !== category.id)
			: [...selectedCategories, category];

		setSelectedCategories(newSelectedCategories);
		onChange?.(newSelectedCategories);
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
						: "Select category"}
				</Dropdown.Toggle>
			</Dropdown>

			<Modal show={showModal} onHide={() => setShowModal(false)} size="lg">
				<Modal.Header closeButton>
					<Modal.Title>Select category detail</Modal.Title>
				</Modal.Header>
				<Modal.Body>
					<CategoryTable
						categories={categories}
						selectedCategories={selectedCategories}
						onCategorySelect={handleCategory}
					/>
				</Modal.Body>
				<Modal.Footer>
					<Button variant="secondary" onClick={() => setShowModal(false)}>
						Cancel
					</Button>
					<Button variant="primary" onClick={handleConfirm}>
						Confirm
					</Button>
				</Modal.Footer>
			</Modal>
		</>
	);
};
