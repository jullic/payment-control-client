import React, { FC, MouseEvent } from 'react';
import classNames from 'classnames';
import { IDateComponentProps } from './DateComponent.props';
import styles from './DateComponent.module.css';
import { Title } from '../Title/Title';
import { Invoice } from '../Invoice/Invoice';
import { Button } from '../Button/Button';
import { TotalResults } from '../TotalResults/TotalResults';
import { IInvoice } from '../../interfaces/invoice.interface';

export const DateComponent: FC<IDateComponentProps> = ({
	className,
	date,
	invoices,
	...props
}) => {
	const normalDate = new Date(date).toLocaleString('ru').split(', ')[0];
	const isToday =
		new Date().toLocaleString('ru').split(', ')[0] === normalDate;

	const onCopyHandler = (e: MouseEvent<HTMLButtonElement>) => {
		e.stopPropagation();
		window.navigator.clipboard.writeText(getCopyText(normalDate, invoices));
	};

	return (
		<div className={classNames(styles.root, className)} {...props}>
			<div className={classNames(styles.wrap)}>
				<div className={classNames(styles.head)}>
					<Title className={classNames(styles.title)} level={2}>
						{isToday ? `Сегодня (${normalDate})` : normalDate}
					</Title>
					<Button onClick={onCopyHandler}>Скопировать</Button>
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

const getCopyText = (date: string, invoices: IInvoice[]) => {
	const companies = Array.from(
		new Set(invoices.map((invoice) => invoice.myCompany.name))
	);
	const comps = companies.reduce<{ company: string; messages: string[] }[]>(
		(prev, company) => [...prev, { company, messages: [] }],
		[]
	);
	invoices.forEach((invoice) => {
		comps.forEach((comp, i, comps) => {
			if (invoice.myCompany.name === comp.company) {
				comps[i].messages.push(getMessage(invoice));
			}
		});
	});
	let text = `${date}\n\n\n`;
	comps.forEach((comp) => {
		text = text + comp.company + '\n\n';
		text = text + comp.messages.join('\n');
		text = text + '\n\n\n';
	});
	return text;
};

const getMessage = (invoice: IInvoice) => {
	let message = `\t- ${invoice.supplier.name}, ИНН: ${
		invoice.supplier.inn
	}, от ${
		new Date(invoice.startDate).toLocaleString('ru').split(', ')[0]
	}, № ${invoice.invoiceId}, Сумма: ${invoice.sum} руб, НДС: ${
		invoice.nds
	} руб`;
	return message;
};
