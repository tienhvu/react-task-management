import { useState, useRef } from "react";
import { Dropdown } from "react-bootstrap";
import { useFormContext } from "react-hook-form";
import { TaskStatus } from "~/types/StatusEnum";

export const StatusDropdown = () => {
	const [isOpen, setIsOpen] = useState(false);
	const dropdownRef = useRef(null);
	const { watch, setValue } = useFormContext();

	const selectedStatus = watch("status");
	const statuses = Object.values(TaskStatus);

	const handleStatusChange = (status: TaskStatus) => {
		setValue("status", status, { shouldDirty: true });
		setIsOpen(false);
	};

	return (
		<Dropdown
			ref={dropdownRef}
			show={isOpen}
			onToggle={(isOpen) => setIsOpen(isOpen)}
			className="w-100"
		>
			<Dropdown.Toggle variant="outline-secondary" className="w-100">
				{selectedStatus || "Chọn trạng thái"}
			</Dropdown.Toggle>

			<Dropdown.Menu className="w-100">
				{statuses.map((status) => (
					<Dropdown.Item
						key={status}
						onClick={() => handleStatusChange(status)}
					>
						{status}
					</Dropdown.Item>
				))}
			</Dropdown.Menu>
		</Dropdown>
	);
};
