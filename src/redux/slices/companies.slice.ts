import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import axios, { AxiosError } from 'axios';
import { ICompany } from '../../interfaces/company.interface';

export const fetchCompanies = createAsyncThunk<any, undefined>(
	'companies/fetchCompanies',
	async (_, thunkApi) => {
		try {
			const { data } = await axios.get(`http://localhost:3300/companies`);
			return data;
		} catch (error) {
			if (error instanceof AxiosError) {
				thunkApi.rejectWithValue(error.response?.data || 'error');
			}
		}
	}
);

interface ICompaniesSliceState {
	status: 'loading' | 'idle' | 'error';
	companies: ICompany[];
}

const initialState: ICompaniesSliceState = {
	status: 'idle',
	companies: [],
};

export const companiesSlice = createSlice({
	name: 'companies',
	initialState,
	reducers: {},
	extraReducers: (builder) => {
		builder
			.addCase(
				fetchCompanies.pending,
				(state, action: PayloadAction<any>) => {}
			)
			.addCase(
				fetchCompanies.fulfilled,
				(state, action: PayloadAction<ICompany[]>) => {
					state.companies = action.payload;
				}
			)
			.addCase(
				fetchCompanies.rejected,
				(state, action: PayloadAction<any>) => {}
			);
	},
});

export const companiesReducer = companiesSlice.reducer;
export const companiesActions = companiesSlice.actions;
