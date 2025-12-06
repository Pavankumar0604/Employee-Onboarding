import React, { useState, useMemo, useRef } from 'react';
import html2pdf from 'html2pdf.js';
import { api } from '../../services/api';
import type { Organization, InvoiceStatus, InvoiceData, InvoiceItem } from '../../types/mindmesh.d';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import Toast from '../../components/ui/Toast';
import StatusChip from '../../components/ui/StatusChip';
import { Loader2, Download, Eye, X } from 'lucide-react';
import { format } from 'date-fns';
import Logo from '../../components/ui/Logo';
import AdminPageHeader from '../../components/admin/AdminPageHeader';

// Helper function to determine StatusChip variant
const getStatusVariant = (status: InvoiceStatus): 'success' | 'info' | 'default' | 'warning' | 'generated' | 'notGenerated' => {
    switch (status) {
        case 'Paid':
            return 'success';
        case 'Generated':
            return 'generated';
        case 'Sent':
            return 'warning';
        case 'Not Generated':
            return 'notGenerated';
        default:
            return 'default';
    }
};

// Mock data based on the image for attractive display
const MOCK_SITES: Organization[] = [
    { id: '1', shortName: 'Aisshwarya Excellency', name: 'Aisshwarya Excellency', address: 'Mock Address 1' },
    { id: '2', shortName: 'Embassy Manyata', name: 'Embassy Manyata', address: 'Mock Address 2' },
    { id: '3', shortName: 'Infosys Ltd', name: 'Infosys Ltd', address: 'Mock Address 3' },
    { id: '4', shortName: 'Prestige Tech Park', name: 'Prestige Tech Park', address: 'Mock Address 4' },
    { id: '5', shortName: 'RMZ Ecospace', name: 'RMZ Ecospace', address: 'Mock Address 5' },
    { id: '6', shortName: 'TATA Power', name: 'TATA Power', address: 'Mock Address 6' },
];

const MOCK_STATUSES: Record<string, InvoiceStatus> = {
    '1': 'Paid',
    '2': 'Paid',
    '3': 'Generated',
    '4': 'Paid',
    '5': 'Not Generated',
    '6': 'Not Generated',
};

// New component for the invoice modal content
const InvoiceContent: React.FC<{
    invoiceData: InvoiceData,
    discount: number,
    setDiscount: (d: number) => void,
    roundOff: number,
    setRoundOff: (r: number) => void
}> = ({ invoiceData, discount, setDiscount, roundOff, setRoundOff }) => {
    
    const formatCurrency = (amount: number) => new Intl.NumberFormat('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(amount);

    const calculations = useMemo(() => {
        if (!invoiceData) return null;
        const subTotal = invoiceData.lineItems.reduce((acc: number, item: InvoiceItem) => {
            const amount = item.deployment * item.ratePerMonth;
            const isDeduction = item.description.toLowerCase().includes('deduction');
            return isDeduction ? acc - amount : acc + amount;
        }, 0);
        const serviceCharge = subTotal * 0.10;
        const grandTotal = subTotal + serviceCharge - discount;
        const gst = grandTotal * 0.09;
        const finalTotal = grandTotal + gst + gst + roundOff;
        return { subTotal, serviceCharge, grandTotal, gst, finalTotal };
    }, [invoiceData, discount, roundOff]);

    if (!calculations) return null;

    return (
         <div className="p-4 bg-white text-black text-[10px] printable-area">
            <div className="grid grid-cols-2">
                <div>
                    <p>Name : {invoiceData.siteName}</p>
                    <p>Address : {invoiceData.siteAddress}</p>
                    <p>City : {invoiceData.siteAddress.split(',').pop()?.trim()}</p>
                </div>
                <div className="">
                    <div className="grid grid-cols-2">
                        <div className="p-1">Invoice No</div>
                        <div className="p-1">{invoiceData.invoiceNumber}</div>
                    </div>
                    <div className="grid grid-cols-2">
                        <div className="p-1">Date</div>
                        <div className="p-1">{invoiceData.invoiceDate}</div>
                    </div>
                     <div className="grid grid-cols-2">
                        <div className="p-1">Month</div>
                        <div className="p-1">{invoiceData.statementMonth.split('-')[0]}</div>
                    </div>
                    <div className="grid grid-cols-2">
                        <div className="p-1">Due Date</div>
                        <div className="p-1">January 15, 2023</div>
                    </div>
                </div>
            </div>
            
            <div className="my-4 flex justify-center">
                <Logo className="h-10"/>
            </div>
            
            <h2 className="text-center font-bold text-sm underline mb-2">{invoiceData.siteName} Summary Statement for the month of {invoiceData.statementMonth}</h2>
            
            <table className="w-full border-collapse">
                <thead>
                    <tr className="font-bold bg-gray-200">
                        <td className="p-1">Sl.No</td>
                        <td className="p-1">Description</td>
                        <td className="p-1">Deployment</td>
                        <td className="p-1">No of Days</td>
                        <td className="p-1">Rate/Day</td>
                        <td className="p-1">Rate/Month</td>
                        <td className="p-1">Amount(Rs)</td>
                    </tr>
                </thead>
                <tbody>
                     <tr>
                        <td className="p-1 font-bold" colSpan={7}>SERVICES (01/{format(new Date(invoiceData.statementMonth), 'MM/yyyy')} to {format(new Date(invoiceData.invoiceDate), 'dd/MM/yyyy')})</td>
                    </tr>
                    {invoiceData.lineItems.map((item: InvoiceItem, index: number) => {
                        const amount = item.deployment * item.ratePerMonth;
                        const isDeduction = item.description.toLowerCase().includes('deduction');
                        const isSpecial = item.deployment === 0;
                        return (
                        <tr key={item.id}>
                            <td className="p-1 text-center">{index + 1}</td>
                            <td className={`${isDeduction ? 'text-red-600' : ''}`}>{item.description}</td>
                            <td className="p-1 text-center">{isSpecial ? '-' : item.deployment}</td>
                            <td className="p-1 text-center">{isSpecial ? '-' : item.noOfDays}</td>
                            <td className="p-1 text-right">{isSpecial ? '-' : formatCurrency(item.ratePerDay)}</td>
                            <td className="p-1 text-right">{isSpecial ? '-' : formatCurrency(item.ratePerMonth)}</td>
                            <td className={`p-1 text-right ${isDeduction ? 'text-red-600' : ''}`}>{formatCurrency(amount)}</td>
                        </tr>
                    )})}
                </tbody>
                <tfoot>
                    <tr>
                        <td colSpan={5} className="p-1 font-bold">Sub Total</td>
                        <td colSpan={2} className="p-1 text-right font-bold">{formatCurrency(calculations.subTotal)}</td>
                    </tr>
                    <tr>
                        <td colSpan={5} className="p-1">Admin,Overheads and Service Charges 10% on Sub Total</td>
                        <td colSpan={2} className="p-1 text-right">{formatCurrency(calculations.serviceCharge)}</td>
                    </tr>
                    <tr className="no-print">
                        <td colSpan={5} className="p-1 font-bold text-red-600">Discount</td>
                        <td colSpan={2} className="p-1 text-right">
                            <Input type="number" value={discount} onChange={e => setDiscount(parseFloat(e.target.value) || 0)} className="text-right !p-1" />
                        </td>
                    </tr>
                     <tr>
                        <td colSpan={5} className="p-1 font-bold">Grand Total</td>
                        <td colSpan={2} className="p-1 text-right font-bold">{formatCurrency(calculations.grandTotal)}</td>
                    </tr>
                     <tr>
                        <td colSpan={3} className="p-1">Central GST</td>
                        <td colSpan={2} className="p-1 text-center">9.00%</td>
                        <td colSpan={2} className="p-1 text-right">{formatCurrency(calculations.gst)}</td>
                    </tr>
                      <tr>
                        <td colSpan={3} className="p-1">State GST</td>
                        <td colSpan={2} className="p-1 text-center">9.00%</td>
                        <td colSpan={2} className="p-1 text-right">{formatCurrency(calculations.gst)}</td>
                    </tr>
                     <tr>
                        <td colSpan={5} className="p-1">Round off</td>
                        <td colSpan={2} className="p-1 text-right">
                           <span className="print-only">{formatCurrency(roundOff)}</span>
                           <span className="no-print"><Input type="number" step="0.01" value={roundOff} onChange={e => setRoundOff(parseFloat(e.target.value) || 0)} className="text-right !p-1" /></span>
                        </td>
                    </tr>
                     <tr className="bg-gray-200 font-bold text-base">
                        <td colSpan={5} className="p-2">Payable for Services rendered</td>
                        <td colSpan={2} className="p-2 text-right">{formatCurrency(calculations.finalTotal)}</td>
                    </tr>
                </tfoot>
            </table>
        </div>
    );
};

const InvoiceSummary: React.FC = () => {
    // Using mock data for attractive display
    const [sites] = useState<Organization[]>(MOCK_SITES);
    const [isLoadingSites] = useState(false);
    const [isLoadingStatuses] = useState(false);
    
    const [selectedMonth, setSelectedMonth] = useState(format(new Date(), 'yyyy-MM'));
    const [statuses] = useState<Record<string, InvoiceStatus>>(MOCK_STATUSES);
    
    // Modal State
    const [modalState, setModalState] = useState<{
        isOpen: boolean;
        site: Organization | null;
        invoiceData: InvoiceData | null;
        isLoading: boolean;
    }>({ isOpen: false, site: null, invoiceData: null, isLoading: false });

    const [discount, setDiscount] = useState(0);
    const [roundOff, setRoundOff] = useState(0.20);
    
    const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);
    const pdfRef = useRef<HTMLDivElement>(null);

    // Removed useEffect for fetching organizations and statuses to use mock data
    // The original API calls are commented out below for reference if needed later.

    /*
    useEffect(() => {
        api.getOrganizations()
            .then((orgs: Organization[] | null) => setSites((orgs || []).sort((a,b) => a.shortName.localeCompare(b.shortName))))
            .catch(() => setToast({ message: "Failed to load sites.", type: 'error' }))
            .finally(() => setIsLoadingSites(false));
    }, []);

    const fetchStatuses = useCallback(async (month: string) => {
        setIsLoadingStatuses(true);
        try {
            const date = new Date(month + '-02');
            const statusData = await api.getInvoiceStatuses(date);
            setStatuses(statusData);
        } catch (error) {
            setToast({ message: "Failed to fetch invoice statuses.", type: 'error' });
        } finally {
            setIsLoadingStatuses(false);
        }
    }, []);

    useEffect(() => {
        if (selectedMonth) {
            fetchStatuses(selectedMonth);
        }
    }, [selectedMonth, fetchStatuses]);
    */

    const handleViewInvoice = async (site: Organization) => {
        setModalState({ isOpen: true, site, invoiceData: null, isLoading: true });
        try {
            const date = new Date(selectedMonth + '-02');
            // NOTE: This still relies on the API for invoice data, which is fine for now.
            const data = await api.getInvoiceSummaryData(site.id, date);
            setModalState({ isOpen: true, site, invoiceData: data, isLoading: false });
        } catch (error) {
            setToast({ message: 'Failed to fetch invoice data.', type: 'error' });
            setModalState({ isOpen: false, site: null, invoiceData: null, isLoading: false });
        }
    };

    const handleModalDownload = () => {
        const element = pdfRef.current;
        if (!element || !modalState.invoiceData) {
            setToast({ message: 'Could not find invoice to export.', type: 'error' });
            return;
        }
        const opt = {
            margin: 0.25,
            filename: `Invoice_${modalState.invoiceData.siteName.replace(' ','_')}_${modalState.invoiceData.statementMonth}.pdf`,
            image: { type: 'jpeg' as const, quality: 0.98 },
            html2canvas: { scale: 2, useCORS: true },
            jsPDF: { unit: 'in', format: 'a4', orientation: 'portrait' as const }
        };
        html2pdf().from(element).set(opt).save();
    };

    const closeModal = () => {
        setModalState({ isOpen: false, site: null, invoiceData: null, isLoading: false });
        setDiscount(0);
        setRoundOff(0.20);
    };

    if (isLoadingSites) {
        return <div className="flex justify-center items-center h-64"><Loader2 className="h-8 w-8 animate-spin text-accent"/></div>;
    }

    return (
        <div className="p-6 bg-white min-h-screen">
            {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
            
            <AdminPageHeader title="Invoice Summary" />

            <div className="bg-white p-6 rounded-lg space-y-6">
                <div className="flex flex-col md:flex-row justify-between md:items-center gap-4">
                    <h3 className="text-2xl font-bold text-gray-800">Monthly Invoice Status</h3>
                    <div className="relative w-full md:w-auto">
                        <Input
                            label=""
                            id="month-select"
                            type="month"
                            value={selectedMonth}
                            onChange={e => setSelectedMonth(e.target.value)}
                            className="!py-2 !pl-4 !pr-3 !text-sm !rounded-lg bg-white shadow-sm"
                        />
                    </div>
                </div>

                <div className="overflow-x-auto rounded-lg">
                    <table className="min-w-full text-sm bg-white">
                        <thead className="bg-gray-100">
                            <tr>
                                <th className="px-6 py-3 text-left font-semibold text-gray-700">Site Name</th>
                                <th className="px-6 py-3 text-center font-semibold text-gray-700">Invoice Status</th>
                                <th className="px-6 py-3 text-center font-semibold text-gray-700">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200">
                            {sites.map((site: Organization) => (
                                <tr key={site.id} className="hover:bg-gray-50">
                                    <td className="px-6 py-4 font-medium text-gray-900">{site.shortName}</td>
                                    <td className="px-6 py-4 text-center">
                                        {isLoadingStatuses ? (
                                            <Loader2 className="h-4 w-4 animate-spin mx-auto text-accent" />
                                        ) : (
                                            <StatusChip
                                                status={statuses[site.id] || 'Not Generated'}
                                                variant={getStatusVariant(statuses[site.id] || 'Not Generated')}
                                            />
                                        )}
                                    </td>
                                    <td className="px-6 py-4 text-center">
                                        <div className="flex items-center justify-center gap-4">
                                            <Button variant="icon" size="sm" onClick={() => handleViewInvoice(site)} disabled={statuses[site.id] === 'Not Generated' || isLoadingStatuses} title="View Invoice">
                                                <Eye className="h-5 w-5 text-gray-600 hover:text-blue-600" />
                                            </Button>
                                            <Button variant="icon" size="sm" onClick={() => handleViewInvoice(site)} disabled={statuses[site.id] === 'Not Generated' || isLoadingStatuses} title="Download Invoice">
                                                <Download className="h-5 w-5 text-gray-600 hover:text-blue-600" />
                                            </Button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {modalState.isOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-60 p-4" onClick={closeModal}>
                    <div className="bg-white rounded-lg shadow-lg w-full max-w-4xl m-4 animate-fade-in-scale flex flex-col" onClick={e => e.stopPropagation()}>
                        <div className="p-4 border-b border-gray-200 flex justify-between items-center no-print">
                            <h3 className="text-xl font-bold text-gray-800">Invoice for {modalState.site?.shortName}</h3>
                            <Button variant="icon" onClick={closeModal}><X className="h-5 w-5"/></Button>
                        </div>
                        <div className="flex-grow overflow-y-auto p-4 max-h-[70vh]">
                            {modalState.isLoading ? (
                                <div className="flex justify-center items-center h-64"><Loader2 className="h-8 w-8 animate-spin text-accent"/></div>
                            ) : modalState.invoiceData ? (
                                <div ref={pdfRef}>
                                    <InvoiceContent invoiceData={modalState.invoiceData} discount={discount} setDiscount={setDiscount} roundOff={roundOff} setRoundOff={setRoundOff} />
                                </div>
                            ) : (
                                <p className="text-center text-gray-500">No data to display.</p>
                            )}
                        </div>
                         <div className="p-4 border-t border-gray-200 flex justify-end no-print">
                            <Button onClick={handleModalDownload} disabled={!modalState.invoiceData}>
                                <Download className="mr-2 h-4 w-4"/> Download PDF
                            </Button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default InvoiceSummary;