import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import type { Issue, IssueFilters, PaginationInfo, StatusCounts, CreateIssueData, UpdateIssueData } from '../../types';
import { issuesAPI } from '../../services/api';
import toast from 'react-hot-toast';

interface IssueState {
  issues: Issue[];
  selectedIssue: Issue | null;
  statusCounts: StatusCounts;
  pagination: PaginationInfo;
  filters: IssueFilters;
  loading: boolean;
  submitting: boolean;
}

const initialState: IssueState = {
  issues: [],
  selectedIssue: null,
  statusCounts: {
    open: 0,
    in_progress: 0,
    resolved: 0,
    closed: 0,
  },
  pagination: {
    page: 1,
    totalPages: 1,
    total: 0,
    hasMore: false,
  },
  filters: {
    status: 'all',
    priority: 'all',
    search: '',
  },
  loading: false,
  submitting: false,
};

export const fetchIssues = createAsyncThunk(
  'issues/fetchAll',
  async (_, { getState, rejectWithValue }) => {
    try {
      const state = getState() as { issues: IssueState };
      const { filters, pagination } = state.issues;
      const response = await issuesAPI.getAll({
        ...filters,
        page: pagination.page,
        limit: 10,
      });
      return response.data;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.error || 'Failed to fetch issues');
    }
  }
);

export const fetchIssueById = createAsyncThunk(
  'issues/fetchById',
  async (id: number, { rejectWithValue }) => {
    try {
      const response = await issuesAPI.getById(id);
      return response.data;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.error || 'Failed to fetch issue');
    }
  }
);

export const createIssue = createAsyncThunk(
  'issues/create',
  async (data: CreateIssueData, { rejectWithValue, dispatch }) => {
    try {
      const response = await issuesAPI.create(data);
      toast.success('Issue created successfully');
      dispatch(fetchIssues());
      return response.data;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      toast.error(error.response?.data?.error || 'Failed to create issue');
      return rejectWithValue(error.response?.data?.error);
    }
  }
);

export const updateIssue = createAsyncThunk(
  'issues/update',
  async ({ id, data }: { id: number; data: UpdateIssueData }, { rejectWithValue, dispatch }) => {
    try {
      const response = await issuesAPI.update(id, data);
      toast.success('Issue updated successfully');
      dispatch(fetchIssues());
      return response.data;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      toast.error(error.response?.data?.error || 'Failed to update issue');
      return rejectWithValue(error.response?.data?.error);
    }
  }
);

export const deleteIssue = createAsyncThunk(
  'issues/delete',
  async (id: number, { rejectWithValue, dispatch }) => {
    try {
      await issuesAPI.delete(id);
      toast.success('Issue deleted successfully');
      dispatch(fetchIssues());
      return id;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      toast.error(error.response?.data?.error || 'Failed to delete issue');
      return rejectWithValue(error.response?.data?.error);
    }
  }
);

const issueSlice = createSlice({
  name: 'issues',
  initialState,
  reducers: {
    setFilters: (state, action: PayloadAction<Partial<IssueFilters>>) => {
      state.filters = { ...state.filters, ...action.payload };
      state.pagination.page = 1;
    },
    setPage: (state, action: PayloadAction<number>) => {
      state.pagination.page = action.payload;
    },
    clearFilters: (state) => {
      state.filters = initialState.filters;
      state.pagination.page = 1;
    },
    clearSelectedIssue: (state) => {
      state.selectedIssue = null;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(fetchIssues.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(fetchIssues.fulfilled, (state, action) => {
      state.loading = false;
      state.issues = action.payload.issues;
      state.pagination = action.payload.pagination;
      state.statusCounts = action.payload.statusCounts;
    });
    builder.addCase(fetchIssues.rejected, (state) => {
      state.loading = false;
    });
    
    builder.addCase(fetchIssueById.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(fetchIssueById.fulfilled, (state, action) => {
      state.loading = false;
      state.selectedIssue = action.payload;
    });
    builder.addCase(fetchIssueById.rejected, (state) => {
      state.loading = false;
    });
    
    builder.addCase(createIssue.pending, (state) => {
      state.submitting = true;
    });
    builder.addCase(createIssue.fulfilled, (state) => {
      state.submitting = false;
    });
    builder.addCase(createIssue.rejected, (state) => {
      state.submitting = false;
    });
    
    builder.addCase(updateIssue.pending, (state) => {
      state.submitting = true;
    });
    builder.addCase(updateIssue.fulfilled, (state, action) => {
      state.submitting = false;
      if (state.selectedIssue?.id === action.payload.issue.id) {
        state.selectedIssue = action.payload.issue;
      }
    });
    builder.addCase(updateIssue.rejected, (state) => {
      state.submitting = false;
    });
    
    builder.addCase(deleteIssue.fulfilled, (state, action) => {
      state.issues = state.issues.filter((issue) => issue.id !== action.payload);
      if (state.selectedIssue?.id === action.payload) {
        state.selectedIssue = null;
      }
    });
  },
});

export const { setFilters, setPage, clearFilters, clearSelectedIssue } = issueSlice.actions;
export default issueSlice.reducer;