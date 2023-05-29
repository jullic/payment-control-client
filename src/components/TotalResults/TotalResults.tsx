import React, { FC } from 'react';
import classNames from 'classnames';
import { ITotalResultsProps } from './TotalResults.props';
import styles from './TotalResults.module.css';
import { getUniqueCompanies } from '../../utils/companies.utils';
import { Title } from '../Title/Title';

export const TotalResults: FC<ITotalResultsProps> = ({
	className,
	invoices,
	type = 'total',
	...props
}) => {
	const companies = getUniqueCompanies(invoices);

	return (
		<div className={classNames(styles.root, className)} {...props}>
			<div className={classNames(styles.item)}>
				<Title
					level={type === 'total' ? 1 : 2}
					className={classNames(styles.title)}
				>
					Итого:{' '}
					<span className={classNames(styles.danger)}>
						{invoices
							.reduce((prev, invoice) => prev + invoice.sum, 0)
							.toLocaleString('ru')}
					</span>{' '}
					руб
				</Title>
				{companies.map((company) => (
					<Title
						key={company}
						className={classNames(styles.subtitle)}
						level={type === 'total' ? 3 : 4}
					>
						{company}:{' '}
						<span className={classNames(styles.danger)}>
							{invoices
								.filter(
									(invoice) =>
										invoice.myCompany.name === company
								)
								.reduce(
									(prev, invoice) => prev + invoice.sum,
									0
								)
								.toLocaleString('ru')}
						</span>{' '}
						руб
					</Title>
				))}
			</div>
			<div className={classNames(styles.item)}>
				<Title
					level={type === 'total' ? 1 : 2}
					className={classNames(styles.title)}
				>
					Количество:{' '}
					<span className={classNames(styles.danger)}>
						{invoices.length.toLocaleString('ru')}
					</span>
				</Title>
				{companies.map((company) => (
					<Title
						key={company}
						className={classNames(styles.subtitle)}
						level={type === 'total' ? 3 : 4}
					>
						{company}:{' '}
						<span className={classNames(styles.danger)}>
							{invoices
								.filter(
									(invoice) =>
										invoice.myCompany.name === company
								)
								.length.toLocaleString('ru')}
						</span>
					</Title>
				))}
			</div>
		</div>
	);
};
