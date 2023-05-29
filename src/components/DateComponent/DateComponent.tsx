import React, { FC } from 'react';
import classNames from 'classnames';
import { IDateComponentProps } from './DateComponent.props';
import styles from './DateComponent.module.css';
import { Title } from '../Title/Title';
import { Invoice } from '../Invoice/Invoice';
import { Button } from '../Button/Button';
import { TotalResults } from '../TotalResults/TotalResults';

export const DateComponent: FC<IDateComponentProps> = ({
	className,
	date,
	invoices,
	...props
}) => {
	const normalDate = new Date(date).toLocaleString('ru').split(', ')[0];
	const isToday =
		new Date().toLocaleString('ru').split(', ')[0] === normalDate;
	return (
		<div className={classNames(styles.root, className)} {...props}>
			<div className={classNames(styles.wrap)}>
				<div className={classNames(styles.head)}>
					<Title className={classNames(styles.title)} level={2}>
						{isToday ? `Сегодня (${normalDate})` : normalDate}
					</Title>
					<Button>Скопировать</Button>
				</div>
				<div className={classNames(styles.invoices)}>
					{invoices.map((invoice) => (
						<Invoice
							key={invoice.id}
							className={classNames(styles.invoice)}
							invoice={invoice}
						/>
					))}
				</div>
				<div className={classNames(styles.footer)}>
					<TotalResults type='date' invoices={invoices} />
				</div>
			</div>
		</div>
	);
};
