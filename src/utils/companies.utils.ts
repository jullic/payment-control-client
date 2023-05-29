import { IInvoice } from '../interfaces/invoice.interface';

export const getUniqueCompanies = (invoices: IInvoice[]) => {
	return Array.from(
		new Set(invoices.map((invoice) => invoice.myCompany.name))
	);
};
