const DRAFT_PREFIX = 'jawrah:form-draft:';

export function saveFormDraft<T>(key: string, value: T): void {
  if (typeof window === 'undefined') return;

  try {
    window.localStorage.setItem(`${DRAFT_PREFIX}${key}`, JSON.stringify(value));
  } catch {
    // Ignore quota or privacy mode failures.
  }
}

export function loadFormDraft<T>(key: string): T | null {
  if (typeof window === 'undefined') return null;

  try {
    const raw = window.localStorage.getItem(`${DRAFT_PREFIX}${key}`);
    if (!raw) return null;
    return JSON.parse(raw) as T;
  } catch {
    return null;
  }
}

export function clearFormDraft(key: string): void {
  if (typeof window === 'undefined') return;
  window.localStorage.removeItem(`${DRAFT_PREFIX}${key}`);
}
