import {
	Button,
	Dropdown,
	DropdownButton,
	Form,
	InputGroup,
} from "react-bootstrap";
import { ChevronLeft, ChevronRight } from "react-bootstrap-icons";
import { useSelector } from "react-redux";
import { usePagination } from "~/hook/usePagination";
import { RootState } from "~/store/store";

export const Pagination: React.FC = () => {
	const { total } = useSelector((state: RootState) => state.task.meta);

	const { currentPage, currentLimit, handlePageChange, handlePageSizeChange } =
		usePagination(1, 10);

	const totalPages = Math.ceil(total / currentLimit);
	const startItem = (currentPage - 1) * currentLimit + 1;
	const endItem = Math.min(currentPage * currentLimit, total);

	return (
		<div className="pagination-container mt-3">
			<div className="d-flex justify-content-between align-items-center mb-2">
				<div className="d-flex align-items-center">
					<span className="me-2">Rows per page:</span>
					<DropdownButton
						id="dropdown-basic-button"
						title={`${currentLimit}`}
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
						<strong>{total}</strong>
					</span>
				</div>
				<div>
					<InputGroup>
						<Button
							variant="outline-secondary"
							onClick={() => handlePageChange(currentPage - 1, totalPages)}
							disabled={currentPage === 1}
						>
							<ChevronLeft />
						</Button>
						<Form.Control
							type="number"
							min={1}
							max={totalPages}
							value={currentPage}
							onBlur={() => handlePageChange(currentPage, totalPages)}
							style={{ width: "80px", textAlign: "center" }}
						/>
						<Button
							variant="outline-secondary"
							onClick={() => handlePageChange(currentPage + 1, totalPages)}
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
