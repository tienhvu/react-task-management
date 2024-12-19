import { useState } from "react";
import { Dropdown } from "react-bootstrap";
import { TaskStatus } from "~/types/StatusEnum";

interface StatusDropdownProps {
	selectedStatus: TaskStatus;
	changeStatus: (status: TaskStatus) => void;
}

export const StatusDropdown: React.FC<StatusDropdownProps> = ({
	selectedStatus,
	changeStatus,
}) => {
	const [isOpen, setIsOpen] = useState(false);
	const statuses = Object.values(TaskStatus);

	return (
		<Dropdown
			show={isOpen}
			onToggle={(isOpen) => setIsOpen(isOpen)}
			className="w-100"
		>
			<Dropdown.Toggle variant="outline-secondary" className="w-100">
				{selectedStatus || "Chọn trạng thái"}
			</Dropdown.Toggle>

			<Dropdown.Menu>
				{statuses.map((status) => (
					<Dropdown.Item
						key={status}
						onClick={() => {
							changeStatus(status);
							setIsOpen(false);
						}}
					>
						{status}
					</Dropdown.Item>
				))}
			</Dropdown.Menu>
		</Dropdown>
	);
};
