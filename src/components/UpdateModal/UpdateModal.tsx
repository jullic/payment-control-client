import React, { FC, useEffect, useState } from 'react';
import classNames from 'classnames';
import { IUpdateModalProps } from './UpdateModal.props';
import styles from './UpdateModal.module.css';
import {
	getDateForInput,
	getNormalDate,
	getRangeForInput,
} from '../../utils/date.utils';
import { useAppDispatch, useAppSelector } from '../../hooks/redux.hooks';
import { Portal } from '../Portal/Portal';
import { Modal } from '../Modal/Modal';
import { Input } from '../Input/Input';
import { Button } from '../Button/Button';
import { updateInvoice } from '../../redux/slices/invoices.slice';
import { modalsActions } from '../../redux/slices/modals.slice';

export const UpdateModal: FC<IUpdateModalProps> = ({
	className,
	invoice,
	...props
}) => {
	const [firm, setFirm] = useState(invoice.supplier.name);
	const [inn, setInn] = useState(invoice.supplier.inn);
	const [myCompany, setMyCompany] = useState(
		localStorage.getItem('myCompany') || 'ООО Оптима'
	);
	const [timeout, setTimeout] = useState(invoice.supplier.timeout + '');
	const [invoiceId, setInvoiceId] = useState(invoice.invoiceId);
	const [startDate, setStartDate] = useState(
		getDateForInput(
			new Date(invoice.startDate).toLocaleString('ru').split(', ')[0]
		)
	);
	const [nds, setNds] = useState<string>(invoice.nds + '');
	const [sum, setSum] = useState<string>(invoice.sum + '');
	const [lastDate, setLastDate] = useState('');

	const { companies } = useAppSelector((state) => state.companiesReducer);

	const dispatch = useAppDispatch();

	const onUpdateHandler = () => {
		if (
			firm &&
			inn &&
			myCompany &&
			timeout &&
			invoiceId &&
			startDate &&
			nds &&
			sum &&
			lastDate &&
			!Number.isNaN(timeout) &&
			!Number.isNaN(nds) &&
			!Number.isNaN(sum)
		) {
			dispatch(
				updateInvoice({
					invoice: {
						firm,
						status: 'unpaid',
						inn: inn,
						invoiceId,
						lastDate: getNormalDate(lastDate),
						myCompany,
						nds: +nds,
						startDate: getNormalDate(startDate),
						sum: +sum,
						timeout: +timeout,
					},
					id: invoice.id,
				})
			);
			dispatch(modalsActions.changeModal('none'));
		}
	};

	useEffect(() => {
		if (timeout) {
			console.log(timeout);
			setLastDate(getRangeForInput(startDate, +timeout));
		} else {
			setLastDate(getRangeForInput(startDate));
		}
	}, [startDate, timeout]);

	return (
		<Portal className={classNames(styles.root, className)} {...props}>
			<Modal>
				<div
					className={classNames(styles.wrap)}
					onClick={(e) => e.stopPropagation()}
				>
					<Input
						autoFocus={firm === ''}
						placeholder='Фирма'
						value={firm}
						onChange={(e) => setFirm(e.target.value)}
					/>
					<Input
						placeholder='ИНН'
						value={inn}
						onChange={(e) => setInn(e.target.value)}
					/>
					<select
						value={myCompany}
						onChange={(e) => {
							setMyCompany(e.target.value);
							localStorage.setItem('myCompany', e.target.value);
						}}
					>
						{companies.map((comp) => (
							<option key={comp.id} value={comp.name}>
								{comp.name}
							</option>
						))}
					</select>
					<Input
						autoFocus={firm !== ''}
						placeholder='Номер накладной'
						value={invoiceId}
						onChange={(e) => setInvoiceId(e.target.value)}
					/>
					<Input
						placeholder='Сумма'
						type='number'
						value={sum}
						onChange={(e) => setSum(e.target.value)}
					/>
					<Input
						placeholder='НДС'
						type='number'
						value={nds}
						onChange={(e) => setNds(e.target.value)}
					/>
					<Input
						type='date'
						value={startDate}
						onChange={(e) => {
							if (e.target.value) {
								setStartDate(e.target.value);
							}
						}}
					/>
					<Input
						placeholder='Отсрочка'
						type='number'
						value={timeout}
						onChange={(e) => {
							setTimeout(e.target.value);
						}}
					/>
					<Input disabled type='date' value={lastDate} />
					<Button onClick={onUpdateHandler}>Создать</Button>
				</div>
			</Modal>
		</Portal>
	);
};
