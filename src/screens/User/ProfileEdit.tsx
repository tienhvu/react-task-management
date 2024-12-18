import { yupResolver } from "@hookform/resolvers/yup";
import {
	Alert,
	Button,
	Card,
	Col,
	Container,
	Form,
	Row,
} from "react-bootstrap";
import { useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { useToast } from "~/components/Toast";
import { UpdateUserRequest } from "~/services/userApi";
import { updateUser } from "~/store/slices/authSlice";
import { AppDispatch, RootState } from "~/store/store";
import { PATH } from "~/utils/constants/constants";
import yup from "~/validations/schema/yup";

const profileUpdateSchema = yup.object().shape({
	username: yup.string().username().optional(),
	email: yup.string().emailTest().optional(),
	firstName: yup.string().firstName().optional(),
	lastName: yup.string().lastName().optional(),
	gender: yup.string().gender().optional(),
});

const ProfileEdit = () => {
	const navigate = useNavigate();
	const { showToast } = useToast();
	const dispatch = useDispatch<AppDispatch>();
	const { isLoading, error, user } = useSelector(
		(state: RootState) => state.auth,
	);
	const {
		register,
		handleSubmit: handleProfileUpdate,
		formState: { errors: profileErrors, isDirty, isValid },
	} = useForm({
		resolver: yupResolver(profileUpdateSchema),
		mode: "onChange",
		defaultValues: user || {},
	});

	const backToProfile = () => {
		dispatch(clearError());
		navigate(PATH.PROFILE);
	};

	const updateProfile = async (data: UpdateUserRequest) => {
		if (!user?.id) return;
		const result = await dispatch(
			updateUser({
				userId: user.id,
				userData: data,
			}),
		);
		if (updateUser.fulfilled.match(result)) {
			showToast("Cập nhật người dùng thành công!");
		} else {
			showToast("Cập nhật người dùng thất bại!", "danger");
		}
	};
	return (
		<Container className="mt-5">
			<Row className="justify-content-md-center">
				<Col md={8}>
					<Card>
						<Card.Header as="h3">Chỉnh sửa thông tin</Card.Header>
						<Card.Body>
							<Form onSubmit={handleProfileUpdate(updateProfile)}>
								{error && <Alert variant="danger">{error}</Alert>}
								<Form.Group as={Row} className="mb-3">
									<Form.Label column sm="4">
										Tên Đăng Nhập
									</Form.Label>
									<Col sm="8">
										<Form.Control
											type="text"
											{...register("username")}
											isInvalid={!!profileErrors.username}
										/>
										<Form.Control.Feedback type="invalid">
											{profileErrors.username?.message}
										</Form.Control.Feedback>
									</Col>
								</Form.Group>
								<Form.Group as={Row} className="mb-3">
									<Form.Label column sm="4">
										Email
									</Form.Label>
									<Col sm="8">
										<Form.Control
											type="email"
											{...register("email")}
											isInvalid={!!profileErrors.email}
										/>
										<Form.Control.Feedback type="invalid">
											{profileErrors.email?.message}
										</Form.Control.Feedback>
									</Col>
								</Form.Group>
								<Form.Group as={Row} className="mb-3">
									<Form.Label column sm="4">
										Họ
									</Form.Label>
									<Col sm="8">
										<Form.Control
											type="text"
											{...register("lastName")}
											isInvalid={!!profileErrors.lastName}
										/>
										<Form.Control.Feedback type="invalid">
											{profileErrors.lastName?.message}
										</Form.Control.Feedback>
									</Col>
								</Form.Group>
								<Form.Group as={Row} className="mb-3">
									<Form.Label column sm="4">
										Tên
									</Form.Label>
									<Col sm="8">
										<Form.Control
											type="text"
											{...register("firstName")}
											isInvalid={!!profileErrors.firstName}
										/>
										<Form.Control.Feedback type="invalid">
											{profileErrors.firstName?.message}
										</Form.Control.Feedback>
									</Col>
								</Form.Group>
								<Form.Group as={Row} className="mb-3">
									<Form.Label column sm="4">
										Giới Tính
									</Form.Label>
									<Col sm="8">
										<Form.Select
											{...register("gender")}
											isInvalid={!!profileErrors.gender}
										>
											<option value="">Chọn giới tính</option>
											<option value="Male">Nam</option>
											<option value="Female">Nữ</option>
											<option value="Other">Khác</option>
										</Form.Select>
										<Form.Control.Feedback type="invalid">
											{profileErrors.gender?.message}
										</Form.Control.Feedback>
									</Col>
								</Form.Group>
								<div className="d-flex justify-content-between">
									<Button
										variant="success"
										type="submit"
										disabled={isLoading || !isDirty || !isValid}
									>
										{isLoading ? "Đang lưu..." : "Lưu Thay Đổi"}
									</Button>
									<Button
										variant="secondary"
										onClick={() => navigate("/profile")}
									>
										Hủy
									</Button>
								</div>
							</Form>
						</Card.Body>
					</Card>
				</Col>
			</Row>
		</Container>
	);
};

export default ProfileEdit;
