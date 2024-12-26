import { useRef, useState, useEffect } from "react";
import useDebounce from "~/hook/useDebounce";
import { useOnClickOutside } from "~/hook/useOnclickOutside";
import { Category } from "~/types/Category";
import { ChevronDown } from "react-bootstrap-icons";

interface CategorySelectProps {
	categories: Category[];
	value?: Category[];
	onSave: (categories: Category[]) => void;
	isLoading?: boolean;
}

export const CategorySelect = ({
	categories,
	value = [],
	onSave,
	isLoading = false,
}: CategorySelectProps) => {
	const [isOpen, setIsOpen] = useState(false);
	const [searchTerm, setSearchTerm] = useState("");
	const [selectedCategories, setSelectedCategories] =
		useState<Category[]>(value);
	const [isDirty, setIsDirty] = useState(false);
	const debouncedSearch = useDebounce(searchTerm, 500);
	const containerRef = useRef(null);
	const inputRef = useRef<HTMLInputElement>(null);

	useEffect(() => {
		const hasChanges =
			selectedCategories.length !== value.length ||
			selectedCategories.some((cat) => !value.find((v) => v.id === cat.id));
		setIsDirty(hasChanges);
	}, [selectedCategories, value]);

	const filteredCategories = categories.filter(
		(category) =>
			category.name.toLowerCase().includes(debouncedSearch.toLowerCase()) &&
			!selectedCategories.some((v) => v.id === category.id),
	);

	const handleSave = () => {
		if (!isDirty) return;
		onSave(selectedCategories);
		setIsDirty(false);
		setIsOpen(false);
		setSearchTerm("");
	};

	useOnClickOutside(containerRef, () => {
		if (isDirty) {
			handleSave();
		}
		setIsOpen(false);
	});

	const handleAddCategory = (category: Category) => {
		setSelectedCategories((prev) => [...prev, category]);
		setSearchTerm("");
	};

	const handleRemoveCategory = (category: Category) => {
		setSelectedCategories((prev) => prev.filter((c) => c.id !== category.id));
	};

	const handleKeyDown = (e: React.KeyboardEvent) => {
		if (e.key === "Enter") {
			e.preventDefault();
			if (searchTerm && filteredCategories.length > 0) {
				handleAddCategory(filteredCategories[0]);
			} else if (isDirty) {
				handleSave();
			}
			setIsOpen(false);
		}
	};

	const toggleDropdown = () => {
		setIsOpen(!isOpen);
		if (!isOpen) {
			inputRef.current?.focus();
		}
	};

	return (
		<div ref={containerRef} className="position-relative">
			<div
				className="border rounded bg-white p-2"
				style={{ minHeight: "44px" }}
			>
				<div className="d-flex flex-wrap gap-2">
					{/* Selected Categories */}
					<div className="d-flex flex-wrap gap-2 mb-2 w-100">
						{selectedCategories.map((category) => (
							<div
								key={category.id}
								className="d-flex align-items-center bg-light rounded py-1 px-2"
								style={{ gap: "4px" }}
							>
								<span>{category.name}</span>
								<button
									type="button"
									className="btn p-0 ms-1"
									onClick={(e) => {
										e.stopPropagation();
										handleRemoveCategory(category);
									}}
									style={{
										width: "16px",
										height: "16px",
										display: "flex",
										alignItems: "center",
										justifyContent: "center",
										background: "#ddd",
										border: "none",
										borderRadius: "50%",
										fontSize: "12px",
										lineHeight: 1,
									}}
								>
									×
								</button>
							</div>
						))}
					</div>

					<div
						className="w-100 position-relative"
						style={{
							borderTop:
								selectedCategories.length > 0 ? "1px solid #dee2e6" : "none",
							paddingTop: selectedCategories.length > 0 ? "8px" : "0",
						}}
					>
						<div className="position-relative">
							<input
								ref={inputRef}
								type="text"
								value={searchTerm}
								onChange={(e) => {
									setSearchTerm(e.target.value);
									setIsOpen(true);
								}}
								onKeyDown={handleKeyDown}
								onFocus={() => setIsOpen(true)}
								className="form-control form-control-sm pe-4"
								placeholder="Search categories..."
								style={{
									border: "1px solid #dee2e6",
									outline: "none",
									background: "white",
									width: "100%",
									padding: "4px 8px",
									paddingRight: "30px",
									borderRadius: "4px",
								}}
							/>
							<button
								type="button"
								onClick={toggleDropdown}
								className="position-absolute top-50 end-0 translate-middle-y bg-transparent border-0 p-2"
								style={{ cursor: "pointer" }}
							>
								<ChevronDown size={16} />
							</button>
						</div>
					</div>
				</div>
			</div>

			{/* Dropdown */}
			{isOpen && (
				<div
					className="position-absolute w-100 bg-white border rounded mt-1 shadow-sm"
					style={{
						maxHeight: "200px",
						overflowY: "auto",
						zIndex: 1000,
					}}
				>
					{isLoading ? (
						<div className="p-3 text-center">Loading...</div>
					) : filteredCategories.length > 0 ? (
						filteredCategories.map((category) => (
							<div
								key={category.id}
								className="px-3 py-2 cursor-pointer hover:bg-gray-100"
								onClick={() => handleAddCategory(category)}
								style={{ cursor: "pointer" }}
							>
								{category.name}
							</div>
						))
					) : (
						<div className="p-3 text-center text-muted">
							No categories found
						</div>
					)}
				</div>
			)}
		</div>
	);
};

export default CategorySelect;
