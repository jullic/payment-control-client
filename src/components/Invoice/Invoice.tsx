import React, { FC, MouseEvent, useEffect, useRef, useState } from 'react';
import classNames from 'classnames';
import { IInvoiceProps } from './Invoice.props';
import styles from './Invoice.module.css';
import { Button } from '../Button/Button';
import { useAppDispatch } from '../../hooks/redux.hooks';
import {
	changeInvoiceStatus,
	deleteInvoice,
	invoicesActions,
} from '../../redux/slices/invoices.slice';
import { modalsActions } from '../../redux/slices/modals.slice';
import { useDebounce } from '../../hooks/useDebounce';

export const Invoice: FC<IInvoiceProps> = ({
	className,
	invoice,
	...props
}) => {
	const dispatch = useAppDispatch();
	const [status, setStatus] = useState(invoice.status === 'paid');
	const updatedValue = useDebounce(status, 1000);
	const isFirst = useRef(true);

	const onOpenHandler = () => {
		dispatch(invoicesActions.getInvoice(invoice));
		dispatch(modalsActions.changeModal('update'));
	};

	const onDeleteHandler = (e: MouseEvent<HTMLButtonElement>) => {
		e.stopPropagation();
		dispatch(deleteInvoice(invoice.id));
	};

	useEffect(() => {
		if (!isFirst.current) {
			dispatch(
				changeInvoiceStatus({
					id: invoice.id,
					invoice: {
						firm: invoice.supplier.name,
						myCompany: invoice.myCompany.name,
						inn: invoice.supplier.inn,
						timeout: invoice.supplier.timeout,
						invoiceId: invoice.invoiceId,
						startDate: new Date(invoice.startDate)
							.toLocaleString('ru')
							.split(', ')[0],
						lastDate: new Date(invoice.lastDate)
							.toLocaleString('ru')
							.split(', ')[0],
						sum: invoice.sum,
						nds: invoice.nds,
						status: invoice.status,
					},
				})
			);
		}
		isFirst.current = false;
	}, [updatedValue]);

	return (
		<div
			onDoubleClick={onOpenHandler}
			className={classNames(styles.root, className)}
			{...props}
		>
			<div className={classNames(styles.wrap)}>
				<div
					onClick={(e) => e.stopPropagation()}
					className={classNames(styles.item)}
				>
					<input
						id={invoice.id + 'check'}
						type='checkbox'
						checked={status}
						onChange={(e) => setStatus((p) => !p)}
					/>
					<label htmlFor={invoice.id + 'check'}>
						<div className={classNames(styles.text)}>
							<span>
								<b>{invoice.supplier.name}</b>
							</span>
							<span className={classNames(styles.thin)}>
								{invoice.myCompany.name}
							</span>
						</div>
					</label>
				</div>
				<div className={classNames(styles.item)}>
					<span>
						ИНН: <b>{invoice.supplier.inn}</b>
					</span>
				</div>
				<div className={classNames(styles.item)}>
					№ <b>{invoice.invoiceId}</b>
				</div>
				<div className={classNames(styles.item)}>
					<span>
						от{' '}
						<b>
							{
								new Date(invoice.startDate)
									.toLocaleString('ru')
									.split(', ')[0]
							}
						</b>
					</span>
				</div>
				<div className={classNames(styles.item)}>
					<span>
						Сумма: <b>{invoice.sum}</b> руб
					</span>
				</div>
				<div className={classNames(styles.item)}>
					<span>
						НДС: <b>{invoice.nds}</b> руб
					</span>
				</div>
			</div>
			<Button onDoubleClick={onDeleteHandler}>Удалить</Button>
		</div>
	);
};
