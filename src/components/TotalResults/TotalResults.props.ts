import { DetailedHTMLProps, HTMLAttributes } from 'react';
import { IInvoice } from '../../interfaces/invoice.interface';

export interface ITotalResultsProps
	extends DetailedHTMLProps<HTMLAttributes<HTMLDivElement>, HTMLDivElement> {
	invoices: IInvoice[];
	type?: 'total' | 'date';
}
