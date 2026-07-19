// =============================================================================
// REDUX STORE — Central store configuration
// =============================================================================
import { configureStore } from '@reduxjs/toolkit';
import { baseApi } from '@/services/api/baseApi';
import incidentReducer from '@/features/incidents/slices/incidentSlice';

export const store = configureStore({
  reducer: {
    [baseApi.reducerPath]: baseApi.reducer,
    incidents: incidentReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(baseApi.middleware),
  devTools: import.meta.env.DEV,
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
