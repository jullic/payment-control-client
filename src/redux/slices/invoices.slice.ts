import { IInvoice } from './../../interfaces/invoice.interface';
import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import axios, { AxiosError } from 'axios';
import { getDefaultDateRange } from '../../utils/date.utils';
import { store } from '../store';
import { ICreateInvoice } from '../../interfaces/create-invoice.interface';

export type IInvoicesType = 'unpaid' | 'paid' | 'all';

export const fetchInvoices = createAsyncThunk<any, undefined>(
	'invoices/fetchInvoices',
	async (dates, thunkApi) => {
		try {
			const state = thunkApi.getState() as ReturnType<
				typeof store.getState
			>;
			const { data } = await axios.get(
				`http://localhost:3300/invoices/${state.invoicesReducer.type}?startDate=${state.invoicesReducer.startDate}&lastDate=${state.invoicesReducer.lastDate}`
			);
			return data;
		} catch (error) {
			if (error instanceof AxiosError) {
				thunkApi.rejectWithValue(error.response?.data || 'error');
			}
		}
	}
);

export const fetchRange = createAsyncThunk<any, undefined>(
	'invoices/fetchRange',
	async (_, thunkApi) => {
		try {
			const { data } = await axios.get(
				`http://localhost:3300/invoices/range`
			);
			const startDate = new Date(data.startDate)
				.toLocaleString('ru')
				.split(', ')[0]
				.split('.')
				.reverse()
				.join('-');

			const lastDate = new Date(data.lastDate)
				.toLocaleString('ru')
				.split(', ')[0]
				.split('.')
				.reverse()
				.join('-');

			thunkApi.dispatch(
				invoicesActions.changeRange({ lastDate, startDate })
			);
			return data;
		} catch (error) {
			if (error instanceof AxiosError) {
				thunkApi.rejectWithValue(error.response?.data || 'error');
			}
		}
	}
);

export const changeInvoiceStatus = createAsyncThunk<
	any,
	{ invoice: ICreateInvoice; id: string }
>('invoices/changeInvoiceStatus', async (args, thunkApi) => {
	const state = thunkApi.getState() as ReturnType<typeof store.getState>;
	try {
		const { data } = await axios.patch(
			`http://localhost:3300/invoices/${args.id}`,
			{
				...args.invoice,
				status: args.invoice.status === 'unpaid' ? 'paid' : 'unpaid',
			}
		);
		await Promise.all([thunkApi.dispatch(fetchInvoices())]);

		return data;
	} catch (error) {
		if (error instanceof AxiosError) {
			thunkApi.rejectWithValue(error.response?.data || 'error');
		}
	}
});

export const createInvoice = createAsyncThunk<any, ICreateInvoice>(
	'invoices/createInvoice',
	async (invoice, thunkApi) => {
		try {
			const { data } = await axios.post(
				`http://localhost:3300/invoices`,
				{
					...invoice,
				}
			);
			await thunkApi.dispatch(fetchInvoices());
			await thunkApi.dispatch(fetchRange());
			return data;
		} catch (error) {
			if (error instanceof AxiosError) {
				thunkApi.rejectWithValue(error.response?.data || 'error');
			}
		}
	}
);

export const updateInvoice = createAsyncThunk<
	any,
	{ invoice: ICreateInvoice; id: string }
>('invoices/updateInvoice', async (args, thunkApi) => {
	const state = thunkApi.getState() as ReturnType<typeof store.getState>;
	try {
		const { data } = await axios.patch(
			`http://localhost:3300/invoices/${args.id}`,
			{
				...args.invoice,
			}
		);
		if (args.invoice.status !== 'paid') {
			await thunkApi.dispatch(fetchRange());
		}
		await thunkApi.dispatch(fetchInvoices());
		return data;
	} catch (error) {
		if (error instanceof AxiosError) {
			thunkApi.rejectWithValue(error.response?.data || 'error');
		}
	}
});

export const deleteInvoice = createAsyncThunk<any, string>(
	'invoices/deleteInvoice',
	async (id, thunkApi) => {
		try {
			const { data } = await axios.delete(
				`http://localhost:3300/invoices/${id}`
			);
			await thunkApi.dispatch(fetchInvoices());
			return data;
		} catch (error) {
			if (error instanceof AxiosError) {
				thunkApi.rejectWithValue(error.response?.data || 'error');
			}
		}
	}
);

interface IInvoicesSliceState {
	status: 'loading' | 'idle' | 'error';
	startDate: string;
	lastDate: string;
	type: IInvoicesType;
	paid: IInvoice[];
	unpaid: IInvoice[];
	invoices: IInvoice[];
	invoice: IInvoice | null;
}

const { lastDate, startDate } = getDefaultDateRange();

const initialState: IInvoicesSliceState = {
	status: 'idle',
	type: 'unpaid',
	startDate,
	lastDate,
	invoices: [],
	paid: [],
	unpaid: [],
	invoice: null,
};

export const invoicesSlice = createSlice({
	name: 'invoices',
	initialState,
	reducers: {
		getInvoice(state, action: PayloadAction<IInvoice | null>) {
			state.invoice = action.payload;
		},
		changeInvoicesType(state, action: PayloadAction<IInvoicesType>) {
			state.type = action.payload;
		},
		changeRange(
			state,
			action: PayloadAction<{ startDate: string; lastDate: string }>
		) {
			state.startDate = action.payload.startDate;
			state.lastDate = action.payload.lastDate;
		},
	},
	extraReducers: (builder) => {
		builder
			.addCase(
				fetchInvoices.pending,
				(state, action: PayloadAction<any>) => {
					state.status = 'loading';
				}
			)
			.addCase(
				fetchInvoices.fulfilled,
				(state, action: PayloadAction<any>) => {
					state.status = 'idle';
					state.invoices = action.payload;
				}
			)
			.addCase(
				fetchInvoices.rejected,
				(state, action: PayloadAction<any>) => {
					state.status = 'error';
				}
			);
	},
});

export const invoicesReducer = invoicesSlice.reducer;
export const invoicesActions = invoicesSlice.actions;
