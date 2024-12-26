import { useState } from "react";
import {
	Button,
	Form,
	InputGroup,
	Dropdown,
	DropdownButton,
} from "react-bootstrap";
import { ChevronLeft, ChevronRight } from "react-bootstrap-icons";

interface PaginationProps {
	totalPages: number;
	currentPage: number;
	onPageChange: (page: number) => void;
	totalItems: number;
	pageSize: number;
	onPageSizeChange: (newPageSize: number) => void;
}

export const Pagination: React.FC<PaginationProps> = ({
	totalPages,
	currentPage,
	onPageChange,
	totalItems,
	pageSize,
	onPageSizeChange,
}) => {
	const [inputPage, setInputPage] = useState(currentPage);

	const handlePageChange = (page: number) => {
		if (page > 0 && page <= totalPages) {
			setInputPage(page);
			onPageChange(page);
		}
	};

	const handlePageSizeChange = (eventKey: string | null) => {
		if (eventKey) {
			const newSize = Number(eventKey);
			onPageSizeChange(newSize);
		}
	};

	const startItem = (currentPage - 1) * pageSize + 1;
	const endItem = Math.min(currentPage * pageSize, totalItems);

	return (
		<div className="pagination-container mt-3">
			<div className="d-flex justify-content-between align-items-center mb-2">
				<div className="d-flex align-items-center">
					<span className="me-2">Rows per page:</span>
					<DropdownButton
						id="dropdown-basic-button"
						title={`${pageSize}`}
						onSelect={handlePageSizeChange}
						variant="outline-secondary"
						className="me-3"
					>
						{[1, 2, 5, 10, 20].map((size) => (
							<Dropdown.Item eventKey={size.toString()} key={size}>
								{size}
							</Dropdown.Item>
						))}
					</DropdownButton>
					<span>
						<strong>{startItem}</strong> - <strong>{endItem}</strong> of{" "}
						<strong>{totalItems}</strong>
					</span>
				</div>
				<div>
					<InputGroup>
						<Button
							variant="outline-secondary"
							onClick={() => handlePageChange(currentPage - 1)}
							disabled={currentPage === 1}
						>
							<ChevronLeft />
						</Button>
						<Form.Control
							type="number"
							min={1}
							max={totalPages}
							value={inputPage}
							onChange={(e) => setInputPage(Number(e.target.value))}
							onBlur={() => handlePageChange(inputPage)}
							style={{ width: "80px", textAlign: "center" }}
						/>
						<Button
							variant="outline-secondary"
							onClick={() => handlePageChange(currentPage + 1)}
							disabled={currentPage === totalPages}
						>
							<ChevronRight />
						</Button>
					</InputGroup>
				</div>
			</div>
			<div className="text-center">
				Page <strong>{currentPage}</strong> of <strong>{totalPages}</strong>
			</div>
		</div>
	);
};
