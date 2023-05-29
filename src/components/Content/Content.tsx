import React, { FC, useMemo } from 'react';
import classNames from 'classnames';
import { IContentProps } from './Content.props';
import styles from './Content.module.css';
import { useAppSelector } from '../../hooks/redux.hooks';
import { getUniqueDates } from '../../utils/date.utils';
import { DateComponent } from '../DateComponent/DateComponent';

export const Content: FC<IContentProps> = ({ className, ...props }) => {
	const { type, status, invoices } = useAppSelector(
		(state) => state.invoicesReducer
	);

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
