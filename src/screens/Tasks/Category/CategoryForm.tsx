import { useState } from "react";
import { Form, Button } from "react-bootstrap";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as Yup from "yup";
import { Category } from "~/types/Category";

export interface CategoryFormData {
	name: string;
	description?: string;
}

interface CategoryFormProps {
	initialData?: Category;
	onSubmit: (data: CategoryFormData) => Promise<void>;
	buttonLabel: string;
}

const categorySchema = Yup.object().shape({
	name: Yup.string()
		.trim()
		.required("Tên danh mục không được để trống")
		.min(2, "Tên danh mục phải có ít nhất 2 ký tự"),
	description: Yup.string()
		.optional()
		.max(500, "Mô tả không được vượt quá 500 ký tự"),
});

const CategoryForm: React.FC<CategoryFormProps> = ({
	initialData,
	onSubmit,
	buttonLabel,
}) => {
	const [isSubmitting, setIsSubmitting] = useState(false);

	const {
		register,
		handleSubmit,
		reset,
		formState: { errors, isValid, isDirty },
	} = useForm<CategoryFormData>({
		resolver: yupResolver(categorySchema),
		mode: "onChange",
		defaultValues: {
			name: initialData?.name,
			description: initialData?.description,
		},
	});

	const handleFormSubmit = async (data: CategoryFormData) => {
		setIsSubmitting(true);
		try {
			await onSubmit(data);
			if (!initialData) {
				reset();
			}
		} finally {
			setIsSubmitting(false);
		}
	};

	return (
		<Form onSubmit={handleSubmit(handleFormSubmit)}>
			<Form.Group controlId="categoryName" className="mb-3">
				<Form.Label>Tên Danh Mục</Form.Label>
				<Form.Control
					type="text"
					{...register("name")}
					isInvalid={!!errors.name}
					placeholder="Nhập tên danh mục"
				/>
				<Form.Control.Feedback type="invalid">
					{errors.name?.message}
				</Form.Control.Feedback>
			</Form.Group>

			<Form.Group controlId="categoryDescription" className="mb-3">
				<Form.Label>Mô Tả</Form.Label>
				<Form.Control
					as="textarea"
					{...register("description")}
					isInvalid={!!errors.description}
					placeholder="Nhập mô tả danh mục (tùy chọn)"
					rows={3}
				/>
				<Form.Control.Feedback type="invalid">
					{errors.description?.message}
				</Form.Control.Feedback>
			</Form.Group>

			<Button
				variant="primary"
				type="submit"
				disabled={isSubmitting || !isValid || (!isDirty && !!initialData)}
			>
				{isSubmitting ? "Đang xử lý..." : buttonLabel}
			</Button>
		</Form>
	);
};

export default CategoryForm;
