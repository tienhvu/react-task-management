import { Modal, Button } from "react-bootstrap";

interface DeleteConfirmModalProps {
	show: boolean;
	onHide: () => void;
	onConfirm: () => void;
	taskTitle: string;
}

export const DeleteConfirmModal: React.FC<DeleteConfirmModalProps> = ({
	show,
	onHide,
	onConfirm,
	taskTitle,
}) => {
	return (
		<Modal show={show} onHide={onHide}>
			<Modal.Header closeButton>
				<Modal.Title>Confirm Delete</Modal.Title>
			</Modal.Header>
			<Modal.Body>
				Are you sure you want to delete task "{taskTitle}"?
			</Modal.Body>
			<Modal.Footer>
				<Button variant="secondary" onClick={onHide}>
					Cancel
				</Button>
				<Button variant="danger" onClick={onConfirm}>
					Delete
				</Button>
			</Modal.Footer>
		</Modal>
	);
};
