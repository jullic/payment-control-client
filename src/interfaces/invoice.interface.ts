import { ICompany } from './company.interface';
import { ISupplier } from './supplier.interface';

export interface IInvoice {
	id: string;
	companiesId: string;
	supplierId: string;
	invoiceId: string;
	startDate: string;
	lastDate: string;
	sum: number;
	nds: number;
	status: 'unpaid' | 'paid';
	deleted: boolean;
	deletedDate: null | string;
	createdAt: string;
	updatedAt: string;
	myCompany: ICompany;
	supplier: ISupplier;
}
