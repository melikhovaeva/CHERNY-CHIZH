import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import type { User } from '@/entities/session/api/types';
import { sessionApi } from '@/entities/session/api/session.api';

type SessionStatus = 'idle' | 'loading' | 'succeeded' | 'failed';

type SessionState = {
  user: User | null;
  isAuthenticated: boolean;
  status: SessionStatus;
  error: string | null;
};

const initialState: SessionState = {
  user: null,
  isAuthenticated: false,
  status: 'idle',
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
      state.status = 'idle';
      state.error = null;
    },
    setStatus: (state, action: PayloadAction<SessionStatus>) => {
      state.status = action.payload;
    },
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addMatcher(
        sessionApi.endpoints.login.matchPending,
        (state) => {
          state.status = 'loading';
          state.error = null;
        },
      )
      .addMatcher(
        sessionApi.endpoints.login.matchFulfilled,
        (state, action) => {
          state.user = action.payload;
          state.isAuthenticated = true;
          state.status = 'succeeded';
          state.error = null;
        },
      )
      .addMatcher(
        sessionApi.endpoints.login.matchRejected,
        (state, action) => {
          state.status = 'failed';
          const errorData = (action.payload as { data?: unknown } | undefined)
            ?.data as { detail?: string } | undefined;
          state.error = errorData?.detail ?? 'Не удалось войти';
        },
      )
      .addMatcher(
        sessionApi.endpoints.registerStep2.matchPending,
        (state) => {
          state.status = 'loading';
          state.error = null;
        },
      )
      .addMatcher(
        sessionApi.endpoints.registerStep2.matchFulfilled,
        (state, action) => {
          state.user = action.payload;
          state.isAuthenticated = true;
          state.status = 'succeeded';
          state.error = null;
        },
      )
      .addMatcher(
        sessionApi.endpoints.registerStep2.matchRejected,
        (state, action) => {
          state.status = 'failed';
          const errorData = (action.payload as { data?: unknown } | undefined)
            ?.data as { detail?: string } | undefined;
          state.error = errorData?.detail ?? 'Не удалось завершить регистрацию';
        },
      )
      .addMatcher(
        sessionApi.endpoints.me.matchPending,
        (state) => {
          if (state.status === 'idle') {
            state.status = 'loading';
          }
          state.error = null;
        },
      )
      .addMatcher(
        sessionApi.endpoints.me.matchFulfilled,
        (state, action) => {
          state.user = action.payload;
          state.isAuthenticated = true;
          state.status = 'succeeded';
          state.error = null;
        },
      )
      .addMatcher(
        sessionApi.endpoints.me.matchRejected,
        (state) => {
          state.user = null;
          state.isAuthenticated = false;
          state.status = 'failed';
        },
      )
      .addMatcher(
        sessionApi.endpoints.logout.matchFulfilled,
        (state) => {
          state.user = null;
          state.isAuthenticated = false;
          state.status = 'idle';
          state.error = null;
        },
      );
  },
});

export const {
  setUser,
  clearSession,
  setStatus,
  setError,
} = sessionSlice.actions;

export const selectCurrentUser = (state: { session: SessionState }) =>
  state.session.user;

export const selectIsAuthenticated = (state: { session: SessionState }) =>
  state.session.isAuthenticated;

export const selectSessionStatus = (state: { session: SessionState }) =>
  state.session.status;

export const selectSessionError = (state: { session: SessionState }) =>
  state.session.error;

