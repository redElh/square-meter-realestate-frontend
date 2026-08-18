export function getCookie(name: string): string | null {
  const match = document.cookie.match(new RegExp('(?:^|; )' + name + '=([^;]*)'));
  return match ? decodeURIComponent(match[1]) : null;
}

export const AUTH_USER_CHANGED_EVENT = 'auth-user-changed';

export function getCachedUser<T = any>(): T | null {
  const cached = sessionStorage.getItem('auth_user') || localStorage.getItem('auth_user');
  if (!cached) return null;
  try {
    return JSON.parse(cached);
  } catch {
    return null;
  }
}

export function storeAuthUser(user: any): void {
  localStorage.setItem('auth_user', JSON.stringify(user));
  window.dispatchEvent(new Event(AUTH_USER_CHANGED_EVENT));
}

export async function refreshAccessToken(): Promise<boolean> {
  try {
    const res = await fetch('/auth/refresh', {
      method: 'POST',
      credentials: 'include',
      headers: { 'Content-Type': 'application/json' },
    });
    return res.ok && getCookie('accessToken') !== null;
  } catch {
    return false;
  }
}
