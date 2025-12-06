import React, { useState } from 'react';
import { Download, Loader2 } from 'lucide-react';
import Button from './Button';
import Toast from './Toast';
import { api } from '../../services/api'; // Import the API service

/**
 * @description Props for the ReportGenerationModalContent component.
 */
interface ReportGenerationModalContentProps {
  /**
   * @description Callback function to close the modal.
   */
  onClose: () => void;
}

/**
 * @description Utility function to handle report generation logic.
 * @param {string} reportType - The format of the report (e.g., 'PDF', 'CSV').
 * @param {string} period - The period for which the report is generated (e.g., 'last_month', 'last_week').
 * @param {(progress: number) => void} onProgress - Callback to update generation progress.
 * @returns {Promise<{ success: boolean; message: string; downloadUrl?: string }>} A promise that resolves to the report generation status.
 */
const generateReport = async (
  reportType: string,
  period: string,
  onProgress: (progress: number) => void
): Promise<{ success: boolean; message: string; downloadUrl?: string }> => {
  onProgress(0); // Reset progress
  let currentProgress = 0;
  const interval = setInterval(() => {
    currentProgress += 10;
    onProgress(currentProgress);
    if (currentProgress >= 100) {
      clearInterval(interval);
    }
  }, 200);

  try {
    const result = await api.generateAttendanceReport(reportType, period);
    clearInterval(interval); // Ensure interval is cleared on API response
    onProgress(100); // Ensure progress is 100% on success
    return result;
  } catch (error) {
    clearInterval(interval); // Ensure interval is cleared on error
    onProgress(0); // Reset or indicate error state
    console.error("Error generating report:", error);
    return { success: false, message: 'Failed to generate report due to an error.' };
  }
};

/**
 * @description Content for the report generation modal, allowing users to select report format and period.
 * @param {ReportGenerationModalContentProps} props - The props for the component.
 * @returns {JSX.Element} The rendered modal content.
 */
const ReportGenerationModalContent: React.FC<ReportGenerationModalContentProps> = ({ onClose }) => {
    const [reportType, setReportType] = useState('PDF');
    const [period, setPeriod] = useState('last_month');
    const [isGenerating, setIsGenerating] = useState(false);
    const [progress, setProgress] = useState(0);
    const [toastMessage, setToastMessage] = useState<string | null>(null);

    const handleGenerate = async () => {
        setIsGenerating(true);
        setToastMessage(null);

        const result = await generateReport(reportType, period, setProgress);

        if (result.success) {
            setToastMessage(result.message);
            // Optionally trigger download here using result.downloadUrl
            if (result.downloadUrl) {
                window.open(result.downloadUrl, '_blank');
            }
            setTimeout(() => {
                setToastMessage(null);
                onClose();
            }, 1500); 
        } else {
            setToastMessage(result.message);
            setIsGenerating(false); // Stop loading on error
        }
    };

    return (
        <div className="space-y-4">
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Report Format</label>
                <select 
                    value={reportType} 
                    onChange={(e) => setReportType(e.target.value)}
                    className="w-full p-2 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500"
                >
                    <option value="PDF">PDF</option>
                    <option value="CSV">CSV</option>
                </select>
            </div>
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Period</label>
                <select 
                    value={period} 
                    onChange={(e) => setPeriod(e.target.value)}
                    className="w-full p-2 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500"
                >
                    <option value="last_week">Last 7 Days</option>
                    <option value="last_month">Last 30 Days</option>
                    <option value="custom">Custom Date Range (Not implemented)</option>
                </select>
            </div>

            {isGenerating && (
                <div className="mt-4 space-y-2">
                    <div className="flex justify-between text-sm font-medium text-gray-700">
                        <span>Generating Report...</span>
                        <span>{progress}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2.5">
                        <div 
                            className={`h-2.5 rounded-full bg-indigo-500 transition-all duration-200 ease-linear`} 
                            style={{ width: `${progress}%` }}
                        ></div>
                    </div>
                </div>
            )}

            <div className="flex justify-end gap-3 pt-4 border-t mt-4">
                <Button variant="secondary" onClick={onClose} disabled={isGenerating}>Cancel</Button>
                <Button onClick={handleGenerate} disabled={isGenerating}>
                    {isGenerating ? (
                        <>
                            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                            Generating...
                        </>
                    ) : (
                        <>
                            <Download className="w-4 h-4 mr-2" />
                            Export {reportType}
                        </>
                    )}
                </Button>
            </div>
            {toastMessage && <Toast message={toastMessage} type="success" onClose={() => setToastMessage(null)} />}
        </div>
    );
};

export default ReportGenerationModalContent;