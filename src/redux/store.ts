import { invoicesReducer } from './slices/invoices.slice';
import { modalsReducer } from './slices/modals.slice';
import { companiesReducer } from './slices/companies.slice';
import { searchReducer } from './slices/search.slice';
import { suppliersReducer } from './slices/suppliers.slice';
import { configureStore } from '@reduxjs/toolkit';

export const store = configureStore({
	reducer: {
		suppliersReducer,
		searchReducer,
		companiesReducer,
		modalsReducer,
		invoicesReducer,
	},
	middleware: (getDefaultMiddleware) => getDefaultMiddleware(),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
