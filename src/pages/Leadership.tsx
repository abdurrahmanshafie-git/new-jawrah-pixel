import { useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import { useRegion } from '@/hooks/useRegion';

export default function Leadership() {
  const { p } = useRegion();

  // Redirect to 404
  return <Navigate to={p('/404')} replace />;
}
