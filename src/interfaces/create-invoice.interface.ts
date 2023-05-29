export interface ICreateInvoice {
	myCompany: string;
	firm: string;
	inn: string;
	timeout: number;
	invoiceId: string;
	startDate: string;
	lastDate: string;
	sum: number;
	nds: number;
	status: 'paid' | 'unpaid';
}
