import React, { FC, KeyboardEvent, useEffect, useRef, useState } from 'react';
import classNames from 'classnames';
import { ICreateModalProps } from './CreateModal.props';
import styles from './CreateModal.module.css';
import { Portal } from '../Portal/Portal';
import { Modal } from '../Modal/Modal';
import { Input } from '../Input/Input';
import { Button } from '../Button/Button';
import { useAppDispatch, useAppSelector } from '../../hooks/redux.hooks';
import {
	getDateForInput,
	getNormalDate,
	getRangeForInput,
} from '../../utils/date.utils';
import { createInvoice } from '../../redux/slices/invoices.slice';
import { modalsActions } from '../../redux/slices/modals.slice';

export const CreateModal: FC<ICreateModalProps> = ({
	className,
	supplier,
	...props
}) => {
	const [firm, setFirm] = useState(supplier?.name || '');
	const [inn, setInn] = useState(supplier ? supplier.inn + '' : '');
	const [myCompany, setMyCompany] = useState(
		localStorage.getItem('myCompany') || 'ООО Оптима'
	);
	const [timeout, setTimeout] = useState(
		supplier ? supplier.timeout + '' : ''
	);
	const [invoiceId, setInvoiceId] = useState('');
	const [startDate, setStartDate] = useState(getDateForInput(new Date()));
	const [nds, setNds] = useState<string>('');
	const [sum, setSum] = useState<string>('');
	const [lastDate, setLastDate] = useState('');
	const wrapRef = useRef<HTMLDivElement>(null);

	const { companies } = useAppSelector((state) => state.companiesReducer);

	const dispatch = useAppDispatch();

	const onCreateHandler = () => {
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
				createInvoice({
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
				})
			);
			dispatch(modalsActions.changeModal('none'));
		}
	};

	const onKeyDownHandler = (e: KeyboardEvent<HTMLInputElement>) => {
		if (e.key === 'Enter') {
			const parent = e.currentTarget.parentElement!;
			const index = e.currentTarget.getAttribute('data-create-input')!;
			console.log(e.currentTarget);
			const next = parent.querySelector(
				`[data-create-input="${+index + 1}"]`
			);
			if (!next) {
				// @ts-ignore
				parent.querySelector('[data-create-btn]').click();
				return;
			}
			// @ts-ignore
			next.focus();
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
					ref={wrapRef}
					className={classNames(styles.wrap)}
					onClick={(e) => e.stopPropagation()}
				>
					<Input
						data-create-input='1'
						onKeyDown={onKeyDownHandler}
						autoFocus={firm === ''}
						placeholder='Фирма'
						value={firm}
						onChange={(e) => setFirm(e.target.value)}
					/>
					<Input
						data-create-input='2'
						onKeyDown={onKeyDownHandler}
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
						data-create-input='3'
						onKeyDown={onKeyDownHandler}
						autoFocus={firm !== ''}
						placeholder='Номер накладной'
						value={invoiceId}
						onChange={(e) => setInvoiceId(e.target.value)}
					/>
					<Input
						data-create-input='4'
						onKeyDown={onKeyDownHandler}
						placeholder='Сумма'
						type='number'
						value={sum}
						onChange={(e) => setSum(e.target.value)}
					/>
					<Input
						data-create-input='5'
						onKeyDown={onKeyDownHandler}
						placeholder='НДС'
						type='number'
						value={nds}
						onChange={(e) => setNds(e.target.value)}
					/>
					<Input
						data-create-input='6'
						onKeyDown={onKeyDownHandler}
						type='date'
						value={startDate}
						onChange={(e) => {
							if (e.target.value) {
								setStartDate(e.target.value);
							}
						}}
					/>
					<Input
						data-create-input='7'
						onKeyDown={onKeyDownHandler}
						placeholder='Отсрочка'
						type='number'
						value={timeout}
						onChange={(e) => {
							setTimeout(e.target.value);
						}}
					/>
					<Input disabled type='date' value={lastDate} />
					<Button data-create-btn onClick={onCreateHandler}>
						Создать
					</Button>
				</div>
			</Modal>
		</Portal>
	);
};
