import { Navigate } from 'react-router-dom';
import { useRegion } from '@/hooks/useRegion';
import { SEO } from '@/components/layout/SEO';

/** Legacy route — redirects to the Partner Program page. */
export default function AgentsRedirect() {
  const { p } = useRegion();
  return (
    <>
      <SEO
        title="Partner Program Redirect | Jawrah Pixel"
        description="Jawrah Pixel partner program route redirecting to the current regional partner page."
        canonicalUrl={p('/partner')}
        noIndex
      />
      <Navigate to={p('/partner')} replace />
    </>
  );
}
