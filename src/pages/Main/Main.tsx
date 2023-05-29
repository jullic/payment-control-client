import React, { FC, useEffect, useMemo } from 'react';
import classNames from 'classnames';
import { IMainProps } from './Main.props';
import styles from './Main.module.css';
import { Button } from '../../components/Button/Button';
import { Input } from '../../components/Input/Input';
import { Title } from '../../components/Title/Title';
import { ChoiceModal } from '../../components/ChoiceModal/ChoiceModal';
import { useAppDispatch, useAppSelector } from '../../hooks/redux.hooks';
import { fetchSuppliers } from '../../redux/slices/suppliers.slice';
import { modalsActions } from '../../redux/slices/modals.slice';
import { Modals } from '../../components/Modals/Modals';
import { fetchCompanies } from '../../redux/slices/companies.slice';
import {
	fetchInvoices,
	fetchRange,
	invoicesActions,
} from '../../redux/slices/invoices.slice';
import { Content } from '../../components/Content/Content';
import { TotalResults } from '../../components/TotalResults/TotalResults';

export const Main: FC<IMainProps> = ({ className, ...props }) => {
	const dispatch = useAppDispatch();

	const { type, invoices } = useAppSelector((state) => state.invoicesReducer);

	const { lastDate, startDate } = useAppSelector(
		(state) => state.invoicesReducer
	);

	useEffect(() => {
		dispatch(fetchSuppliers());
		dispatch(fetchCompanies());
		dispatch(fetchRange());
	}, []);

	useEffect(() => {
		dispatch(fetchInvoices());
	}, [type, dispatch, lastDate, startDate]);

	return (
		<div className={classNames(styles.root, className)} {...props}>
			<Modals />
			<Button
				onClick={(e) => dispatch(modalsActions.changeModal('choice'))}
				className={classNames(styles.create)}
			>
				Создать
			</Button>
			<div className={classNames(styles.header)}>
				<div className={classNames(styles.btns)}>
					<Button
						onClick={(e) =>
							dispatch(
								invoicesActions.changeInvoicesType('unpaid')
							)
						}
						active={type === 'unpaid'}
					>
						Неоплаченные
					</Button>
					<Button
						onClick={(e) =>
							dispatch(invoicesActions.changeInvoicesType('paid'))
						}
						active={type === 'paid'}
					>
						Оплаченные
					</Button>
					<Button
						onClick={(e) =>
							dispatch(invoicesActions.changeInvoicesType('all'))
						}
						active={type === 'all'}
					>
						Все
					</Button>
				</div>
				<div className={classNames(styles.dates)}>
					<Input
						value={startDate}
						type='date'
						onChange={(e) => {
							if (e.target.value) {
								dispatch(
									invoicesActions.changeRange({
										startDate: e.target.value,
										lastDate,
									})
								);
							}
						}}
					/>
					<Input
						value={lastDate}
						type='date'
						onChange={(e) => {
							if (e.target.value) {
								dispatch(
									invoicesActions.changeRange({
										startDate,
										lastDate: e.target.value,
									})
								);
							}
						}}
					/>
				</div>
			</div>
			<main className={classNames(styles.main)}>
				<div className={classNames(styles.head)}>
					<TotalResults invoices={invoices} />
					{/* <div className={classNames(styles.item)}>
						<Title className={classNames(styles.title)}>
							Итого:{' '}
							<span className={classNames(styles.danger)}>
								{0}
							</span>{' '}
							руб
						</Title>
						<Title
							className={classNames(styles.subtitle)}
							level={3}
						>
							ООО Оптима:{' '}
							<span className={classNames(styles.danger)}>
								12000
							</span>{' '}
							руб
						</Title>
						<Title
							className={classNames(styles.subtitle)}
							level={3}
						>
							ИП Шурко:{' '}
							<span className={classNames(styles.danger)}>
								12000
							</span>{' '}
							руб
						</Title>
					</div>
					<div className={classNames(styles.item)}>
						<Title className={classNames(styles.title)}>
							Количество:{' '}
							<span className={classNames(styles.danger)}>
								{0}
							</span>
						</Title>
						<Title
							className={classNames(styles.subtitle)}
							level={3}
						>
							ООО Оптима:{' '}
							<span className={classNames(styles.danger)}>1</span>
						</Title>
						<Title
							className={classNames(styles.subtitle)}
							level={3}
						>
							ИП Шурко:{' '}
							<span className={classNames(styles.danger)}>3</span>
						</Title>
					</div> */}
				</div>
				<div className={classNames(styles.content)}>
					<Content />
				</div>
			</main>
		</div>
	);
};
