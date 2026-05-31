import { Navigate } from 'react-router-dom';
import { useRegion } from '@/hooks/useRegion';

/** Legacy route — redirects to the Partner Program page. */
export default function AgentsRedirect() {
  const { p } = useRegion();
  return <Navigate to={p('/partner')} replace />;
}
