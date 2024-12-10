import React, { createContext, useState, useContext, ReactNode } from "react";
import { Toast, ToastContainer } from "react-bootstrap";

type ToastType = "success" | "danger" | "warning" | "info";

interface ToastContextType {
	showToast: (message: string, type?: ToastType) => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export const ToastProvider: React.FC<{ children: ReactNode }> = ({
	children,
}) => {
	const [show, setShow] = useState(false);
	const [message, setMessage] = useState("");
	const [type, setType] = useState<ToastType>("success");

	const showToast = (newMessage: string, newType: ToastType = "success") => {
		setMessage(newMessage);
		setType(newType);
		setShow(true);
	};

	const handleClose = () => {
		setShow(false);
	};

	return (
		<ToastContext.Provider value={{ showToast }}>
			{children}
			<ToastContainer position="top-end" className="p-3">
				<Toast
					onClose={handleClose}
					show={show}
					delay={3000}
					autohide
					bg={type}
				>
					<Toast.Header>
						<strong className="me-auto">
							{type === "success" ? "Thành công" : "Thông báo"}
						</strong>
					</Toast.Header>
					<Toast.Body className="text-white">{message}</Toast.Body>
				</Toast>
			</ToastContainer>
		</ToastContext.Provider>
	);
};

export const useToast = () => {
	const context = useContext(ToastContext);
	if (context === undefined) {
		throw new Error("useToast must be used within a ToastProvider");
	}
	return context;
};
