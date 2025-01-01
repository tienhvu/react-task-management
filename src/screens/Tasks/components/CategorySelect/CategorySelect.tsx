import { useMemo, useRef, useState } from "react";
import { ChevronDown } from "react-bootstrap-icons";
import { useFormContext, useWatch } from "react-hook-form";
import { useSelector } from "react-redux";
import useDebounce from "~/hook/useDebounce";
import { useOnClickOutside } from "~/hook/useOnclickOutside";
import { RootState } from "~/store/store";
import { Category } from "~/types/Category";
import { styles } from "./style";

export const CategorySelect = () => {
	const [isOpen, setIsOpen] = useState(false);
	const [searchTerm, setSearchTerm] = useState("");
	const { categories } = useSelector((state: RootState) => state.category);
	const debouncedSearch = useDebounce(searchTerm, 500);
	const containerRef = useRef(null);
	const inputRef = useRef<HTMLInputElement>(null);
	const [highlightedIndex, setHighlightedIndex] = useState<number>(-1);
	const { setValue, control } = useFormContext();

	const selectedCategories = useWatch({
		control: control,
		name: "categories",
	}) as Category[];

	const filteredCategories = useMemo(
		() =>
			categories.filter(
				(category) =>
					category.name.toLowerCase().includes(debouncedSearch.toLowerCase()) &&
					!selectedCategories.some((v: Category) => v.id === category.id),
			),
		[categories, debouncedSearch, selectedCategories],
	);

	const handleKeyDown = (e: React.KeyboardEvent) => {
		if (e.key === "Enter") {
			e.preventDefault();
			if (
				highlightedIndex >= 0 &&
				highlightedIndex < filteredCategories.length
			) {
				handleAddCategory(filteredCategories[highlightedIndex]);
			}
			setIsOpen(false);
			setHighlightedIndex(-1);
		} else if (e.key === "ArrowDown") {
			e.preventDefault();
			setHighlightedIndex((prev) =>
				prev < filteredCategories.length - 1 ? prev + 1 : prev,
			);
		} else if (e.key === "ArrowUp") {
			e.preventDefault();
			setHighlightedIndex((prev) => (prev > 0 ? prev - 1 : prev));
		}
	};

	useOnClickOutside(containerRef, () => {
		setIsOpen(false);
		setHighlightedIndex(-1);
	});

	const handleAddCategory = (category: Category) => {
		setValue("categories", [...selectedCategories, category], {
			shouldDirty: true,
			shouldValidate: true,
		});
		setSearchTerm("");
		setHighlightedIndex(-1);
	};

	const handleRemoveCategory = (category: Category) => {
		const newCategories = selectedCategories.filter(
			(c: Category) => c.id !== category.id,
		);
		setValue("categories", newCategories, {
			shouldDirty: true,
			shouldValidate: true,
		});
	};

	const toggleDropdown = () => {
		setIsOpen(!isOpen);
		if (!isOpen) {
			inputRef.current?.focus();
		} else {
			setHighlightedIndex(-1);
		}
	};

	return (
		<div ref={containerRef} className="position-relative">
			<div className="border rounded bg-white p-2" style={styles.container}>
				<div className="d-flex flex-wrap gap-2">
					<div className="d-flex flex-wrap gap-2 mb-2 w-100">
						{selectedCategories.map((category: Category) => (
							<div
								key={category.id}
								className="d-flex align-items-center bg-light rounded py-1 px-2"
								style={styles.selectedItem}
							>
								<span>{category.name}</span>
								<button
									type="button"
									className="btn p-0 ms-1"
									onClick={(e) => {
										e.stopPropagation();
										handleRemoveCategory(category);
									}}
									style={styles.removeButton}
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
									setHighlightedIndex(-1);
								}}
								onKeyDown={handleKeyDown}
								onFocus={() => setIsOpen(true)}
								className="form-control form-control-sm pe-4"
								placeholder="Search categories..."
								style={styles.input}
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

			{isOpen && (
				<div
					className="position-absolute w-100 bg-white border rounded mt-1 shadow-sm"
					style={styles.dropdown}
				>
					{filteredCategories.length > 0 ? (
						filteredCategories.map((category, index) => (
							<div
								key={category.id}
								className={`px-3 py-2 cursor-pointer ${
									index === highlightedIndex ? "bg-light" : "hover:bg-gray-100"
								}`}
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
