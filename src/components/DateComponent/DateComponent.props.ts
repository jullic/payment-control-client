import { DetailedHTMLProps, HTMLAttributes } from 'react';
import { IInvoice } from '../../interfaces/invoice.interface';

export interface IDateComponentProps
	extends DetailedHTMLProps<HTMLAttributes<HTMLDivElement>, HTMLDivElement> {
	date: string;
	invoices: IInvoice[];
}
