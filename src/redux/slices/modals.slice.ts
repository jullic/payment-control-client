import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export type ModalType = 'none' | 'create' | 'update' | 'choice';

interface IModalsSliceState {
	modals: ModalType;
}

const initialState: IModalsSliceState = {
	modals: 'none',
};

export const modalsSlice = createSlice({
	name: 'modalsSlice',
	initialState,
	reducers: {
		changeModal(state, action: PayloadAction<ModalType>) {
			state.modals = action.payload;
		},
	},
});

export const modalsReducer = modalsSlice.reducer;
export const modalsActions = modalsSlice.actions;
