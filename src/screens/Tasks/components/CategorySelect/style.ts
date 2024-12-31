export const styles = {
	container: {
		minHeight: "44px",
	},
	selectedItem: {
		gap: "4px",
	},
	removeButton: {
		width: "16px",
		height: "16px",
		display: "flex",
		alignItems: "center",
		justifyContent: "center",
		background: "#ddd",
		border: "none",
		borderRadius: "50%",
		fontSize: "12px",
		lineHeight: 1,
	},
	input: {
		border: "1px solid #dee2e6",
		outline: "none",
		background: "white",
		width: "100%",
		padding: "4px 8px",
		paddingRight: "30px",
		borderRadius: "4px",
	},
	dropdown: {
		maxHeight: "200px",
		overflowY: "auto",
		zIndex: 1000,
	},
} as const;
