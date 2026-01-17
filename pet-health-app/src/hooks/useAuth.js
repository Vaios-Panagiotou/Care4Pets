//Απλό hook για έλεγχο αν ο χρήστης είναι συνδεδεμένος και τι ρόλο έχει.
//Διαβάζει από το localStorage το κλειδί "auth", που περιέχει JSON με
//{ token: string, user: { id, name, role }, isAuthenticated?: boolean }

export function useAuth() {
  if (typeof window === 'undefined') {
    return { isAuthenticated: false, user: null };
  }

  const raw = window.localStorage.getItem('auth');
  if (!raw) {
    return { isAuthenticated: false, user: null };
  }

  try {
    const parsed = JSON.parse(raw);
    const user = parsed?.user ?? null;
    const isAuthenticated = Boolean(parsed?.isAuthenticated || parsed?.token || user);
    return { isAuthenticated, user };
  } catch {
    // If parsing fails, treat as not authenticated
    return { isAuthenticated: false, user: null };
  }
}
