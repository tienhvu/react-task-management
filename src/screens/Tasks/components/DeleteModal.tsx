import { Button, Modal } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { useToast } from "~/components/Toast";
import { useTasks } from "~/hook/useTasks";
import { deleteCategory, getCategories } from "~/store/slices/categorySlice";
import { deleteTask } from "~/store/slices/taskSlice";
import { AppDispatch, RootState } from "~/store/store";
import { usePagination } from "~/hook/usePagination";

interface DeletableItem {
	id: string;
	name?: string;
	title?: string;
}

interface DeleteModalProps<T extends DeletableItem> {
	isOpen: boolean;
	item: T;
	itemType: "category" | "task";
	onClose: () => void;
}

const DeleteModal = <T extends DeletableItem>({
	isOpen,
	item,
	itemType,
	onClose,
}: DeleteModalProps<T>) => {
	const dispatch = useDispatch<AppDispatch>();
	const { showToast } = useToast();
	const { fetchTasks } = useTasks();
	const { total } = useSelector((state: RootState) => state.task.meta);

	const { currentLimit, handlePageChange } = usePagination(1, 10);

	const totalPages = Math.ceil(total / currentLimit);

	const handleDelete = async () => {
		try {
			if (itemType === "category") {
				await dispatch(deleteCategory(item.id)).unwrap();
				showToast("Xóa danh mục thành công");
				dispatch(getCategories({ query: "" }));
			} else if (itemType === "task") {
				await dispatch(deleteTask(item.id)).unwrap();
				showToast("Xóa công việc thành công");
				fetchTasks();
				handlePageChange(1, totalPages);
			}

			onClose();
		} catch {
			showToast(
				`Xóa ${itemType === "category" ? "danh mục" : "công việc"} thất bại!`,
				"danger",
			);
		}
	};

	const getItemName = (item: T) => {
		if (itemType === "category") return item.name;
		return item.title;
	};

	return (
		<Modal show={isOpen} onHide={onClose}>
			<Modal.Header closeButton>
				<Modal.Title>Xác Nhận Xóa</Modal.Title>
			</Modal.Header>
			<Modal.Body>
				Bạn có chắc chắn muốn xóa{" "}
				{itemType === "category" ? "danh mục" : "công việc"} "
				{getItemName(item)}" không?
			</Modal.Body>
			<Modal.Footer>
				<Button variant="secondary" onClick={onClose}>
					Hủy
				</Button>
				<Button variant="danger" onClick={handleDelete}>
					Xóa
				</Button>
			</Modal.Footer>
		</Modal>
	);
};

export default DeleteModal;
