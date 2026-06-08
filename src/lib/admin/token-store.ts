// Armazena os tokens JWT do admin em localStorage e notifica assinantes
// (para o hook useAdminAuth re-renderizar no login/logout/expiração).
const ACCESS_KEY = "lh_admin_access";
const REFRESH_KEY = "lh_admin_refresh";

type Listener = () => void;
const listeners = new Set<Listener>();

let access: string | null = null;
let refresh: string | null = null;
let loaded = false;

function load() {
  if (loaded) return;
  if (typeof window !== "undefined") {
    access = window.localStorage.getItem(ACCESS_KEY);
    refresh = window.localStorage.getItem(REFRESH_KEY);
  }
  loaded = true;
}

function emit() {
  listeners.forEach((l) => l());
}

export const tokenStore = {
  load,
  getAccess(): string | null {
    load();
    return access;
  },
  getRefresh(): string | null {
    load();
    return refresh;
  },
  set(accessToken: string, refreshToken: string) {
    access = accessToken;
    refresh = refreshToken;
    loaded = true;
    if (typeof window !== "undefined") {
      window.localStorage.setItem(ACCESS_KEY, accessToken);
      window.localStorage.setItem(REFRESH_KEY, refreshToken);
    }
    emit();
  },
  clear() {
    access = null;
    refresh = null;
    if (typeof window !== "undefined") {
      window.localStorage.removeItem(ACCESS_KEY);
      window.localStorage.removeItem(REFRESH_KEY);
    }
    emit();
  },
  subscribe(listener: Listener): () => void {
    listeners.add(listener);
    return () => listeners.delete(listener);
  },
};
