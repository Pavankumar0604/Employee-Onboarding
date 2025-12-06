// Type declarations for html2pdf.js
declare module 'html2pdf.js' {
    interface Html2PdfOptions {
        margin?: number | number[];
        filename?: string;
        image?: { type?: string; quality?: number };
        html2canvas?: { scale?: number; useCORS?: boolean; letterRendering?: boolean };
        jsPDF?: { unit?: string; format?: string; orientation?: string };
        pagebreak?: { mode?: string | string[]; before?: string | string[]; after?: string | string[]; avoid?: string | string[] };
    }

    interface Html2Pdf {
        from(element: HTMLElement): Html2Pdf;
        set(options: Html2PdfOptions): Html2Pdf;
        save(): Promise<void>;
        output(type: string, options?: any): any;
        toPdf(): Html2Pdf;
        get(type: string): any;
    }

    function html2pdf(): Html2Pdf;
    function html2pdf(element: HTMLElement, options?: Html2PdfOptions): Html2Pdf;

    export = html2pdf;
}
