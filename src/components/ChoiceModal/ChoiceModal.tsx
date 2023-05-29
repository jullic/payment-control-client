import React, { FC, useEffect, useMemo } from 'react';
import classNames from 'classnames';
import { IChoiceModalProps } from './ChoiceModal.props';
import styles from './ChoiceModal.module.css';
import { Portal } from '../Portal/Portal';
import { Modal } from '../Modal/Modal';
import { Input } from '../Input/Input';
import { Button } from '../Button/Button';
import { useAppDispatch, useAppSelector } from '../../hooks/redux.hooks';
import { modalsActions } from '../../redux/slices/modals.slice';
import {
	fetchSuppliers,
	suppliersActions,
} from '../../redux/slices/suppliers.slice';
import { searchActions } from '../../redux/slices/search.slice';

export const ChoiceModal: FC<IChoiceModalProps> = ({ className, ...props }) => {
	const { suppliers } = useAppSelector((state) => state.suppliersReducer);
	const { search } = useAppSelector((state) => state.searchReducer);
	const dispatch = useAppDispatch();

	const currentSuppliers = suppliers.filter(
		(supplier) =>
			supplier.name.match(new RegExp(search, 'gim')) ||
			supplier.inn.match(new RegExp(search, 'gim'))
	);

	useEffect(() => {
		dispatch(fetchSuppliers());
	}, []);

	return (
		<Portal className={classNames(styles.root, className)} {...props}>
			<Modal>
				<div
					onClick={(e) => e.stopPropagation()}
					className={classNames(styles.wrap)}
				>
					<div className={classNames(styles.head)}>
						<Input
							autoFocus
							value={search}
							onChange={(e) =>
								dispatch(
									searchActions.changeSearch(e.target.value)
								)
							}
							placeholder='Поиск по названию или ИНН'
						/>
						<Button
							onClick={(e) => {
								dispatch(suppliersActions.getSupplier(null));
								dispatch(modalsActions.changeModal('create'));
							}}
						>
							Новый поставщик
						</Button>
					</div>
					<div className={classNames(styles.suppliers)}>
						{currentSuppliers.map((supplier) => (
							<div
								onClick={(e) => {
									dispatch(
										modalsActions.changeModal('create')
									);
									dispatch(
										suppliersActions.getSupplier(supplier)
									);
								}}
								key={supplier.id}
								className={classNames(styles.supplier)}
							>
								<div className={classNames(styles.info)}>
									<span>
										<b>{supplier.name}</b>
									</span>
									<span>
										ИНН: <b>{supplier.inn}</b>
									</span>
								</div>
								<div className={classNames(styles.timeout)}>
									<span>
										Отсрочка: <b>{supplier.timeout}</b> дней
									</span>
								</div>
							</div>
						))}
					</div>
				</div>
			</Modal>
		</Portal>
	);
};
