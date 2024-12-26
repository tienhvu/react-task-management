import { format } from "date-fns";
import { useState } from "react";
import { Form, InputGroup, Table } from "react-bootstrap";
import { Category } from "~/types/Category";

interface CategoryTableProps {
	categories: Category[];
	selectedCategories: Category[];
	onCategorySelect: (category: Category) => void;
}

export const CategoryTable = ({
	categories,
	selectedCategories,
	onCategorySelect,
}: CategoryTableProps) => {
	const [searchTerm, setSearchTerm] = useState("");

	const filteredCategories = categories.filter((cat) =>
		cat.name.toLowerCase().includes(searchTerm.toLowerCase()),
	);

	const isCategorySelected = (id: string) =>
		selectedCategories.some((category) => category.id === id);

	const handleCheckboxChange = (category: Category) => {
		onCategorySelect(category);
	};

	return (
		<div>
			{/* Search Bar */}
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
										onChange={() => handleCheckboxChange(category)}
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

export default CategoryTable;
