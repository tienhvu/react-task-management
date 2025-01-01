import { format } from "date-fns";
import { useState } from "react";
import { Form, InputGroup, Table } from "react-bootstrap";
import { useFormContext } from "react-hook-form";
import { useSelector } from "react-redux";
import { Category } from "~/types/Category";
import { RootState } from "~/store/store";

export const CategoryTable = () => {
	const [searchTerm, setSearchTerm] = useState("");
	const { categories } = useSelector((state: RootState) => state.category);
	const { watch, setValue } = useFormContext();

	const selectedCategories = watch("categories") ?? [];

	const filteredCategories = categories.filter((cat) =>
		cat.name.toLowerCase().includes(searchTerm.toLowerCase()),
	);

	const isCategorySelected = (id: string) =>
		selectedCategories.some((category: Category) => category.id === id);

	const handleChange = (category: Category) => {
		const isSelected = isCategorySelected(category.id);
		const newCategories = isSelected
			? selectedCategories.filter((c: Category) => c.id !== category.id)
			: [...selectedCategories, category];

		setValue("categories", newCategories, {
			shouldDirty: true,
			shouldValidate: true,
		});
	};

	return (
		<div>
			<InputGroup className="mb-3">
				<Form.Control
					placeholder="Search category..."
					value={searchTerm}
					onChange={(e) => setSearchTerm(e.target.value)}
				/>
			</InputGroup>

			<div
				style={{ position: "relative", maxHeight: "400px", overflowY: "auto" }}
			>
				<Table striped bordered hover responsive>
					<thead
						style={{
							position: "sticky",
							top: 0,
							backgroundColor: "#f8f9fa",
							zIndex: 1,
						}}
					>
						<tr>
							<th style={{ width: "5%" }}>Select</th>
							<th style={{ width: "25%" }}>Title</th>
							<th style={{ width: "40%" }}>Description</th>
							<th style={{ width: "15%" }}>Created At</th>
							<th style={{ width: "15%" }}>Updated At</th>
						</tr>
					</thead>
					<tbody>
						{filteredCategories.map((category) => (
							<tr key={category.id}>
								<td>
									<Form.Check
										type="checkbox"
										id={`category-${category.id}`}
										checked={isCategorySelected(category.id)}
										onChange={() => handleChange(category)}
									/>
								</td>
								<td>{category.name}</td>
								<td>{category.description || "No description available"}</td>
								<td>
									{format(new Date(category.createdAt), "HH:mm:ss dd/MM/yyyy")}
								</td>
								<td>
									{format(new Date(category.updatedAt), "HH:mm:ss dd/MM/yyyy")}
								</td>
							</tr>
						))}
						{filteredCategories.length === 0 && (
							<tr>
								<td colSpan={5} className="text-center text-muted">
									No categories found
								</td>
							</tr>
						)}
					</tbody>
				</Table>
			</div>
		</div>
	);
};
