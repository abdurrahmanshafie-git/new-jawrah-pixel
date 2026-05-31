export function getClientPlatform(): string {
  if (typeof navigator === 'undefined') return 'Jawrah Pixel Web';

  const ua = navigator.userAgent.toLowerCase();
  if (/iphone|ipad|ipod/.test(ua)) return 'Jawrah Pixel Web (iOS)';
  if (/android/.test(ua)) return 'Jawrah Pixel Web (Android)';
  if (/mobile/.test(ua)) return 'Jawrah Pixel Web (Mobile)';
  return 'Jawrah Pixel Web (Desktop)';
}
