import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import axios, { AxiosError } from 'axios';
import { ISupplier } from '../../interfaces/supplier.interface';

export const fetchSuppliers = createAsyncThunk<any, undefined>(
	'suppliers/fetchSuppliers',
	async (_, thunkApi) => {
		try {
			const { data } = await axios.get(`http://localhost:3300/suppliers`);
			return data;
		} catch (error) {
			if (error instanceof AxiosError) {
				thunkApi.rejectWithValue(error.response?.data || 'error');
			}
		}
	}
);

interface ISuppliersSliceState {
	status: 'loading' | 'idle' | 'error';
	suppliers: ISupplier[];
	supplier: ISupplier | null;
}

const initialState: ISuppliersSliceState = {
	status: 'idle',
	suppliers: [],
	supplier: null,
};

export const suppliersSlice = createSlice({
	name: 'suppliers',
	initialState,
	reducers: {
		getSupplier(state, action: PayloadAction<ISupplier | null>) {
			state.supplier = action.payload;
		},
	},
	extraReducers: (builder) => {
		builder
			.addCase(
				fetchSuppliers.pending,
				(state, action: PayloadAction<any>) => {}
			)
			.addCase(
				fetchSuppliers.fulfilled,
				(state, action: PayloadAction<any>) => {
					state.suppliers = action.payload;
				}
			)
			.addCase(
				fetchSuppliers.rejected,
				(state, action: PayloadAction<any>) => {}
			);
	},
});

export const suppliersReducer = suppliersSlice.reducer;
export const suppliersActions = suppliersSlice.actions;
