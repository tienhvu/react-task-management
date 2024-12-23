import { Modal, Button } from "react-bootstrap";
import { Task } from "~/types/Task";
interface DeleteConfirmModalProps {
	isOpen: boolean;
	onClose: () => void;
	onConfirm: () => void;
	task: Task | null;
}

export const DeleteConfirmModal: React.FC<DeleteConfirmModalProps> = ({
	isOpen,
	onClose,
	onConfirm,
	task,
}) => {
	return (
		<Modal show={isOpen} onHide={onClose}>
			<Modal.Header closeButton>
				<Modal.Title>Confirm Delete</Modal.Title>
			</Modal.Header>
			<Modal.Body>
				Are you sure you want to delete task "{task?.title}"?
			</Modal.Body>
			<Modal.Footer>
				<Button variant="secondary" onClick={onClose}>
					Cancel
				</Button>
				<Button variant="danger" onClick={onConfirm} disabled={!task}>
					Delete
				</Button>
			</Modal.Footer>
		</Modal>
	);
};
