import { sessionApi } from '@/entities/session/api/session.api';
import type { User } from '@/entities/session/api/types';
import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import { ROLE_CODES } from './roleCodes';

export enum SessionStatusEnum {
  IDLE = 'idle',
  LOADING = 'loading',
  SUCCEEDED = 'succeeded',
  FAILED = 'failed',
}

export interface SessionState {
  user: User | null;
  isAuthenticated: boolean;
  status: SessionStatusEnum;
  error: string | null;
}

const initialState: SessionState = {
  user: null,
  isAuthenticated: false,
  status: SessionStatusEnum.IDLE,
  error: null,
};

export const sessionSlice = createSlice({
  name: 'session',
  initialState,
  reducers: {
    setUser: (state, action: PayloadAction<User | null>) => {
      state.user = action.payload;
      state.isAuthenticated = !!action.payload;
    },
    clearSession: (state) => {
      state.user = null;
      state.isAuthenticated = false;
      state.status = SessionStatusEnum.IDLE;
      state.error = null;
    },
    setStatus: (state, action: PayloadAction<SessionStatusEnum>) => {
      state.status = action.payload;
    },
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addMatcher(sessionApi.endpoints.v1UsersAuthLoginCreate.matchPending, (state) => {
        state.status = SessionStatusEnum.LOADING;
        state.error = null;
      })
      .addMatcher(sessionApi.endpoints.v1UsersAuthLoginCreate.matchFulfilled, (state, action) => {
        state.user = action.payload;
        state.isAuthenticated = true;
        state.status = SessionStatusEnum.SUCCEEDED;
        state.error = null;
      })
      .addMatcher(sessionApi.endpoints.v1UsersAuthLoginCreate.matchRejected, (state, action) => {
        state.status = SessionStatusEnum.FAILED;
        const errorData = (action.payload as { data?: unknown } | undefined)
          ?.data as { detail?: string } | undefined;
        state.error = errorData?.detail ?? 'Не удалось войти';
      })
      .addMatcher(sessionApi.endpoints.v1UsersRegisterStep2Create.matchPending, (state) => {
        state.status = SessionStatusEnum.LOADING;
        state.error = null;
      })
      .addMatcher(
        sessionApi.endpoints.v1UsersRegisterStep2Create.matchFulfilled,
        (state, action) => {
          state.user = action.payload;
          state.isAuthenticated = true;
          state.status = SessionStatusEnum.SUCCEEDED;
          state.error = null;
        },
      )
      .addMatcher(
        sessionApi.endpoints.v1UsersRegisterStep2Create.matchRejected,
        (state, action) => {
          state.status = SessionStatusEnum.FAILED;
          const errorData = (action.payload as { data?: unknown } | undefined)
            ?.data as { detail?: string } | undefined;
          state.error = errorData?.detail ?? 'Не удалось завершить регистрацию';
        },
      )
      .addMatcher(sessionApi.endpoints.v1UsersMeRetrieve.matchPending, (state) => {
        if (state.status === SessionStatusEnum.IDLE) {
          state.status = SessionStatusEnum.LOADING;
        }
        state.error = null;
      })
      .addMatcher(sessionApi.endpoints.v1UsersMeRetrieve.matchFulfilled, (state, action) => {
        state.user = action.payload;
        state.isAuthenticated = true;
        state.status = SessionStatusEnum.SUCCEEDED;
        state.error = null;
      })
      .addMatcher(sessionApi.endpoints.v1UsersMeRetrieve.matchRejected, (state) => {
        state.user = null;
        state.isAuthenticated = false;
        state.status = SessionStatusEnum.FAILED;
      })
      .addMatcher(sessionApi.endpoints.v1UsersAuthLogoutCreate.matchFulfilled, (state) => {
        state.user = null;
        state.isAuthenticated = false;
        state.status = SessionStatusEnum.IDLE;
        state.error = null;
      });
  },
});

export const { setUser, clearSession, setStatus, setError } =
  sessionSlice.actions;

export const selectCurrentUser = (state: { session: SessionState }) =>
  state.session.user;

export const selectIsAuthenticated = (state: { session: SessionState }) =>
  state.session.isAuthenticated;

export const selectSessionStatus = (state: { session: SessionState }) =>
  state.session.status;

export const selectSessionError = (state: { session: SessionState }) =>
  state.session.error;

export const selectCurrentUserRole = (state: { session: SessionState }) =>
  state.session.user?.role ?? null;

export const selectIsAdmin = (state: { session: SessionState }) =>
  state.session.user?.role?.code === ROLE_CODES.ADMIN;

