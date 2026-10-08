import { useApp } from '../store/AppStore';
import { ReportingsGrid } from './reportings/ReportingsGrid';
import { ReportingDetail } from './reportings/ReportingDetail';

export function ReportingsPage() {
  const { reportingDetailId } = useApp();
  if (reportingDetailId) return <ReportingDetail reportingId={reportingDetailId} />;
  return <ReportingsGrid />;
}
