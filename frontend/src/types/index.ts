export interface User {
  id: number;
  email: string;
  name: string;
  created_at: string;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterData {
  name: string;
  email: string;
  password: string;
}

export interface AuthResponse {
  message: string;
  token: string;
  user: User;
}

export interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  loading: boolean;
}

export type IssueStatus = 'open' | 'in_progress' | 'resolved' | 'closed';
export type IssuePriority = 'low' | 'medium' | 'high' | 'critical';
export type IssueSeverity = 'minor' | 'major' | 'critical' | 'blocker';

export interface Issue {
  id: number;
  title: string;
  description: string | null;
  status: IssueStatus;
  priority: IssuePriority;
  severity: IssueSeverity;
  user_id: number;
  created_at: string;
  updated_at: string;
}

export interface CreateIssueData {
  title: string;
  description?: string;
  status?: IssueStatus;
  priority?: IssuePriority;
  severity?: IssueSeverity;
}

export type UpdateIssueData = Partial<CreateIssueData>;

export interface IssueFilters {
  status: IssueStatus | 'all';
  priority: IssuePriority | 'all';
  search: string;
}

export interface PaginationInfo {
  page: number;
  totalPages: number;
  total: number;
  hasMore: boolean;
}

export interface StatusCounts {
  open: number;
  in_progress: number;
  resolved: number;
  closed: number;
}

export interface IssuesResponse {
  issues: Issue[];
  pagination: PaginationInfo;
  statusCounts: StatusCounts;
}

export interface ApiError {
  error: string;
  errors?: Array<{ msg: string; param?: string }>;
}