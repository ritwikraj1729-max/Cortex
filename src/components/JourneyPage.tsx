import { useApp } from '../store/AppStore';
import { JourneyGrid } from './journey/JourneyGrid';
import { JourneyDetail } from './journey/JourneyDetail';

export function JourneyPage() {
  const { journeySubjectId } = useApp();
  if (journeySubjectId) return <JourneyDetail subjectId={journeySubjectId} />;
  return <JourneyGrid />;
}
