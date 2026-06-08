import { useCallback, useEffect, useState } from "react";
import { tokenStore } from "./token-store";
import { adminLogin } from "./api";

/**
 * Estado de autenticação do admin, baseado em localStorage.
 * Client-only: `initialized` fica false até o efeito rodar no cliente,
 * evitando mismatch de hidratação no SSR.
 */
export function useAdminAuth() {
  const [token, setToken] = useState<string | null>(null);
  const [initialized, setInitialized] = useState(false);

  useEffect(() => {
    tokenStore.load();
    setToken(tokenStore.getAccess());
    setInitialized(true);
    return tokenStore.subscribe(() => setToken(tokenStore.getAccess()));
  }, []);

  const login = useCallback(async (email: string, password: string) => {
    const res = await adminLogin(email, password);
    tokenStore.set(res.accessToken, res.refreshToken);
  }, []);

  const logout = useCallback(() => {
    tokenStore.clear();
  }, []);

  return { token, initialized, isAuthenticated: !!token, login, logout };
}
