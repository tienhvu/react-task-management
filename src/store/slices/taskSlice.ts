import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import {
	add,
	deleteTaskApi,
	search,
	update,
	get,
	UpdateTaskRequest,
	CreateTaskRequest,
} from "~/services/taskApi";
import { Task } from "~/types/Task";

interface TaskState {
	tasks: Task[];
	total: number;
	page: number;
	limit: number;
	isLoading: boolean;
	error: string | null;
}

const initialState: TaskState = {
	tasks: [],
	total: 0,
	page: 1,
	limit: 10,
	isLoading: false,
	error: null,
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
			await deleteTaskApi(taskId);
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
		{ page, limit }: { page: number; limit: number },
		{ rejectWithValue },
	) => {
		try {
			const response = await get(page, limit);
			return response.data;
		} catch (error: unknown) {
			const err = error as { response?: { data?: { message?: string } } };
			return rejectWithValue(err.response?.data?.message ?? "Get tasks failed");
		}
	},
);

export const searchTasks = createAsyncThunk(
	"task/search",
	async (
		{ query, page, limit }: { query: string; page: number; limit: number },
		{ rejectWithValue },
	) => {
		try {
			const response = await search(query, page, limit);
			return response.data;
		} catch (error: unknown) {
			const err = error as { response?: { data?: { message?: string } } };
			return rejectWithValue(
				err.response?.data?.message ?? "Search tasks failed",
			);
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
			.addCase(updateTask.fulfilled, (state, action) => {
				state.isLoading = false;
				const updatedTask = action.payload;
				const index = state.tasks.findIndex(
					(task) => task.id === updatedTask.id,
				);
				if (index !== -1) {
					state.tasks[index] = updatedTask;
				}
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
			.addCase(searchTasks.pending, (state) => {
				state.isLoading = true;
				state.error = null;
			})
			.addCase(searchTasks.fulfilled, (state, action) => {
				state.isLoading = false;
				state.tasks = action.payload.tasks;
				state.total = action.payload.total;
				state.page = action.payload.page;
				state.limit = action.payload.limit;
			})
			.addCase(searchTasks.rejected, (state, action) => {
				state.isLoading = false;
				state.error = action.payload as string;
			})
			.addCase(getTasks.pending, (state) => {
				state.isLoading = true;
				state.error = null;
			})
			.addCase(getTasks.fulfilled, (state, action) => {
				state.isLoading = false;
				state.tasks = action.payload.tasks;
				state.total = action.payload.total;
				state.page = action.payload.page;
				state.limit = action.payload.limit;
			})
			.addCase(getTasks.rejected, (state, action) => {
				state.isLoading = false;
				state.error = action.payload as string;
			});
	},
});

export const { clearTaskError } = taskSlice.actions;
export default taskSlice.reducer;
