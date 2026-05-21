import { create } from "zustand";
import { jwtDecode } from "jwt-decode";
import axiosPublic from "@/src/apis/axiosPublic";
import axiosPrivate from "../apis/axiosPrivate";

type DecodedToken = {
  usuario_id: number;
  rol: string;
  correo: string;
  nombre: string;
  foto: string;
  iat: number;
  exp: number;
};

type ProfileData = {
  nombre: string;
  correo: string;
  foto: string;
};

type AuthState = {
  token: string | null;
  refreshToken: string | null;
  decodedToken: DecodedToken | null;
  profileData: ProfileData | null;
  permissions: string[];
  isLoading: boolean;
  setTokens: (access_token: string, refresh_token: string) => void;
  updateToken: (newToken: string) => void;
  setProfileData: (data: Partial<ProfileData>) => void;
  logout: () => void;
  logoutAsync: () => Promise<void>;
  initAuth: () => void;
};

export const useAuthStore = create<AuthState>((set) => ({
  token: null,
  refreshToken: null,
  decodedToken: null,
  profileData: null,
  permissions: [],
  isLoading: true,

  setTokens: (token, refreshToken) => {
    localStorage.setItem("token", token);
    localStorage.setItem("refresh_token", refreshToken);
    const decoded = jwtDecode<DecodedToken>(token);

    set({
      token: token,
      refreshToken: refreshToken,
      decodedToken: decoded,
      profileData: { nombre: decoded.nombre, correo: decoded.correo, foto: decoded.foto },
      permissions: decoded.rol ? [decoded.rol] : [],
    });
  },

  updateToken: (newToken) => {
    localStorage.setItem("token", newToken);
    const decoded = jwtDecode<DecodedToken>(newToken);

    set({
      token: newToken,
      decodedToken: decoded,
      profileData: { nombre: decoded.nombre, correo: decoded.correo, foto: decoded.foto },
      permissions: decoded.rol ? [decoded.rol] : [],
    });
  },

  setProfileData: (data) =>
    set((state) => ({
      profileData: { ...(state.profileData ?? { nombre: "", correo: "", foto: "" }), ...data },
    })),

  logout: () => {
    localStorage.removeItem("token");
    localStorage.removeItem("refresh_token");
    localStorage.removeItem("fcm_token");
    set({
      token: null,
      refreshToken: null,
      decodedToken: null,
      profileData: null,
      permissions: [],
    });
  },

  logoutAsync: async () => {
    const refreshToken = localStorage.getItem("refresh_token");
    if (refreshToken) {
      try {
        await axiosPrivate.post(
          process.env.NEXT_PUBLIC_LOGOUT_AUTH!,
          { refreshToken }
        );
      } catch {
        // Siempre cerrar sesión localmente aunque falle la API
      }
    }
    localStorage.removeItem("token");
    localStorage.removeItem("refresh_token");
    localStorage.removeItem("fcm_token");
    set({
      token: null,
      refreshToken: null,
      decodedToken: null,
      profileData: null,
      permissions: [],
    });
  },

  initAuth: () => {
    const token = localStorage.getItem("token");
    const refresh_token = localStorage.getItem("refresh_token");

    if (token && refresh_token) {
      try {
        const decoded = jwtDecode<DecodedToken>(token);
        set({
          token,
          refreshToken: refresh_token,
          decodedToken: decoded,
          profileData: { nombre: decoded.nombre, correo: decoded.correo, foto: decoded.foto },
          permissions: decoded.rol ? [decoded.rol] : [],
        });
      } catch (err) {
        console.warn("Token inválido o modificado. Limpiando sesión.");
        localStorage.removeItem("token");
        localStorage.removeItem("refresh_token");
        set({
          token: null,
          refreshToken: null,
          decodedToken: null,
          permissions: [],
        });
      }
    } else {
      // Tokens no existen
      set({
        token: null,
        refreshToken: null,
        decodedToken: null,
        permissions: [],
      });
    }

    set({ isLoading: false });
  },
}));