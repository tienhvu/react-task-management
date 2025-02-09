import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import {
	add,
	CreateTaskRequest,
	get,
	remove,
	update,
	UpdateTaskRequest,
} from "~/services/taskApi";
import { Task } from "~/types/Task";

interface TaskState {
	tasks: Task[];
	meta: {
		total: number;
		page: number;
		limit: number;
	};
	isLoading: boolean;
	error: string | null;
	isEditingTask: boolean;
}

const initialState: TaskState = {
	tasks: [],
	meta: {
		total: 0,
		page: 1,
		limit: 10,
	},
	isLoading: false,
	error: null,
	isEditingTask: false,
};

// Async thunks
export const addTask = createAsyncThunk(
	"task/add",
	async (taskData: CreateTaskRequest, { rejectWithValue }) => {
		try {
			const response = await add(taskData);
			return response.data;
		} catch (error: unknown) {
			const err = error as { response?: { data?: { message?: string } } };
			return rejectWithValue(err.response?.data?.message ?? "Add task failed");
		}
	},
);

export const updateTask = createAsyncThunk(
	"task/update",
	async (
		{ taskId, taskData }: { taskId: string; taskData: UpdateTaskRequest },
		{ rejectWithValue },
	) => {
		try {
			const response = await update(taskId, taskData);
			return response.data;
		} catch (error: unknown) {
			const err = error as { response?: { data?: { message?: string } } };
			return rejectWithValue(
				err.response?.data?.message ?? "Update task failed",
			);
		}
	},
);

export const deleteTask = createAsyncThunk(
	"task/delete",
	async (taskId: string, { rejectWithValue }) => {
		try {
			await remove(taskId);
			return taskId;
		} catch (error: unknown) {
			const err = error as { response?: { data?: { message?: string } } };
			return rejectWithValue(
				err.response?.data?.message ?? "Delete task failed",
			);
		}
	},
);

export const getTasks = createAsyncThunk(
	"task/getTasks",
	async (
		{ page, limit, query }: { page: number; limit: number; query?: string },
		{ rejectWithValue },
	) => {
		try {
			const response = await get(page, limit, query);
			return {
				items: response.data.items,
				meta: response.data.meta,
			};
		} catch (error: unknown) {
			const err = error as { response?: { data?: { message?: string } } };
			return rejectWithValue(err.response?.data?.message ?? "Get tasks failed");
		}
	},
);

const taskSlice = createSlice({
	name: "task",
	initialState,
	reducers: {
		clearTaskError: (state) => {
			state.error = null;
		},
		setIsEditingTask: (state, action: { payload: boolean }) => {
			state.isEditingTask = action.payload;
		},
	},
	extraReducers: (builder) => {
		builder
			.addCase(addTask.pending, (state) => {
				state.isLoading = true;
				state.error = null;
			})
			.addCase(addTask.fulfilled, (state, action) => {
				state.isLoading = false;
				state.tasks.push(action.payload);
			})
			.addCase(addTask.rejected, (state, action) => {
				state.isLoading = false;
				state.error = action.payload as string;
			})
			.addCase(updateTask.pending, (state) => {
				state.isLoading = true;
				state.error = null;
			})
			.addCase(updateTask.fulfilled, (state) => {
				state.isLoading = false;
				state.error = null;
			})
			.addCase(updateTask.rejected, (state, action) => {
				state.isLoading = false;
				state.error = action.payload as string;
			})
			.addCase(deleteTask.pending, (state) => {
				state.isLoading = true;
				state.error = null;
			})
			.addCase(deleteTask.fulfilled, (state, action) => {
				state.isLoading = false;
				state.tasks = state.tasks.filter((task) => task.id !== action.payload);
			})
			.addCase(deleteTask.rejected, (state, action) => {
				state.isLoading = false;
				state.error = action.payload as string;
			})
			.addCase(getTasks.pending, (state) => {
				state.isLoading = true;
				state.error = null;
			})
			.addCase(getTasks.fulfilled, (state, action) => {
				state.isLoading = false;
				state.tasks = action.payload.items;
				state.meta = action.payload.meta;
				state.error = null;
			})
			.addCase(getTasks.rejected, (state, action) => {
				state.isLoading = false;
				state.error = action.payload as string;
			});
	},
});

export const { clearTaskError, setIsEditingTask } = taskSlice.actions;
export default taskSlice.reducer;
