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

	return (
		<div>
			<InputGroup className="mb-3">
				<Form.Control
					placeholder="Search category..."
					value={searchTerm}
					onChange={(e) => setSearchTerm(e.target.value)}
				/>
			</InputGroup>

			<div style={{ position: "relative" }}>
				<Table striped bordered hover>
					<thead>
						<tr>
							<th>Select</th>
							<th>Title</th>
							<th>Description</th>
							<th>Created At</th>
							<th>Updated At</th>
						</tr>
					</thead>
				</Table>

				<div style={{ maxHeight: "400px", overflowY: "auto" }}>
					<Table striped bordered hover>
						<tbody>
							{filteredCategories.map((category) => (
								<tr
									key={category.id}
									className={
										selectedCategories.some((c) => c.id === category.id)
											? "table-active cursor-pointer"
											: "cursor-pointer"
									}
									onClick={() => onCategorySelect(category)}
								>
									<td>
										<Form.Check
											type="checkbox"
											id={`category-${category.id}`}
											checked={selectedCategories.some(
												(c) => c.id === category.id,
											)}
											onChange={() => onCategorySelect(category)}
										/>
									</td>
									<td>{category.name}</td>
									<td>{category.description || "No description available"}</td>
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
				</div>
			</div>
		</div>
	);
};
