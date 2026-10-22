import { ComponentType, lazy, LazyExoticComponent } from 'react';

type ComponentImport<T extends ComponentType<any>> = () => Promise<{ default: T }>;

export interface PreloadableComponent<T extends ComponentType<any>> extends LazyExoticComponent<T> {
  preload: () => Promise<{ default: T }>;
}

/**
 * Enhanced lazy loader that provides:
 * 1. Automatic transient network retry before failing
 * 2. Seamless chunk-mismatch recovery across new deployments
 * 3. Preload capability for instant navigation without loading flashes
 */
export function lazyWithRetry<T extends ComponentType<any>>(
  componentImport: ComponentImport<T>,
  chunkName = 'module'
): PreloadableComponent<T> {
  let factoryPromise: Promise<{ default: T }> | null = null;

  const loadWithRetry = async (attemptsLeft = 2): Promise<{ default: T }> => {
    const retryKey = `jp_chunk_retry_${chunkName}`;
    try {
      const module = await componentImport();
      if (typeof window !== 'undefined') {
        sessionStorage.removeItem(retryKey);
      }
      return module;
    } catch (error: any) {
      // If we have transient attempts left, retry after a short delay
      if (attemptsLeft > 0) {
        await new Promise((resolve) => setTimeout(resolve, 250));
        return loadWithRetry(attemptsLeft - 1);
      }

      // Check if error is a chunk loading error (common after new production builds)
      const errorMessage = [
        error?.message,
        error?.cause?.message,
        String(error ?? ''),
      ]
        .filter(Boolean)
        .join(' ');

      const isChunkError =
        error?.name === 'ChunkLoadError' ||
        errorMessage.includes('Failed to fetch dynamically imported module') ||
        errorMessage.includes('error loading dynamically imported module') ||
        errorMessage.includes('Loading chunk') ||
        // Chromium can report the root cause directly instead of wrapping it
        // in "Failed to fetch dynamically imported module". This commonly
        // happens when a stale tab requests a chunk from the previous deploy
        // and the SPA fallback responds with index.html.
        /not a valid JavaScript MIME type/i.test(errorMessage) ||
        /MIME type.{0,80}text\/html|text\/html.{0,80}MIME type/i.test(errorMessage);

      if (typeof window !== 'undefined') {
        const hasRetried = sessionStorage.getItem(retryKey);
        if (isChunkError && !hasRetried) {
          sessionStorage.setItem(retryKey, 'true');
          // Force a reload to fetch the latest index.html and modern chunks
          window.location.reload();
          return new Promise<{ default: T }>(() => {});
        }
        sessionStorage.removeItem(retryKey);
      }

      console.error(`[Jawrah Pixel] Failed to load chunk "${chunkName}":`, error);
      throw error;
    }
  };

  const lazyComponent = lazy(() => {
    if (!factoryPromise) {
      factoryPromise = loadWithRetry();
    }
    return factoryPromise;
  }) as PreloadableComponent<T>;

  // Attach preload method
  lazyComponent.preload = () => {
    if (!factoryPromise) {
      factoryPromise = loadWithRetry();
    }
    return factoryPromise;
  };

  return lazyComponent;
}

/**
 * Prefetches high-priority routes in the background during idle moments
 */
export function scheduleIdlePreload(preloadFns: Array<() => Promise<any>>) {
  if (typeof window === 'undefined') return;

  const execute = () => {
    preloadFns.forEach((fn) => {
      try {
        fn();
      } catch {
        // Silently swallow background prefetch errors
      }
    });
  };

  if ('requestIdleCallback' in window) {
    (window as any).requestIdleCallback(execute, { timeout: 2500 });
  } else {
    setTimeout(execute, 1200);
  }
}
