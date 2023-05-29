import React, { FC } from 'react';

import { IModalsProps } from './Modals.props';
import { ChoiceModal } from '../ChoiceModal/ChoiceModal';
import { useAppSelector } from '../../hooks/redux.hooks';
import { CreateModal } from '../CreateModal/CreateModal';
import { UpdateModal } from '../UpdateModal/UpdateModal';

export const Modals: FC<IModalsProps> = ({ className, ...props }) => {
	const { modals } = useAppSelector((state) => state.modalsReducer);
	const { supplier } = useAppSelector((state) => state.suppliersReducer);
	const { invoice } = useAppSelector((state) => state.invoicesReducer);

	return (
		<>
			{modals === 'choice' && <ChoiceModal />}
			{modals === 'create' && <CreateModal supplier={supplier} />}
			{modals === 'update' && invoice && (
				<UpdateModal invoice={invoice} />
			)}
		</>
	);
};
