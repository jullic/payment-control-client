import React, { FC, useMemo } from 'react';
import classNames from 'classnames';
import { IContentProps } from './Content.props';
import styles from './Content.module.css';
import { useAppSelector } from '../../hooks/redux.hooks';
import { getUniqueDates } from '../../utils/date.utils';
import { DateComponent } from '../DateComponent/DateComponent';

export const Content: FC<IContentProps> = ({ className, ...props }) => {
	const { type, status, paid, unpaid } = useAppSelector(
		(state) => state.invoicesReducer
	);

	const invoices = useMemo(() => {
		if (type === 'paid') {
			return paid;
		}
		if (type === 'unpaid') {
			return unpaid;
		}
		if (type === 'all') {
			return [...paid, ...unpaid];
		}
		return [...paid, ...unpaid];
	}, [paid, unpaid, type]);

	const dates = useMemo(() => getUniqueDates(invoices), [invoices]);
	return (
		<div className={classNames(styles.root, className)} {...props}>
			{dates.map((date) => (
				<DateComponent
					key={date}
					invoices={invoices.filter(
						(invoice) => invoice.lastDate === date
					)}
					date={date}
				/>
			))}
		</div>
	);
};
