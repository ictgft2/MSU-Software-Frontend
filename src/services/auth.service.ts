import type { LoginDTO, RegisterDTO, AuthUser } from "@src/dto/auth";
import http from "@src/services/http";
import { unwrapData } from "@src/services/service-utils";
import { normalizeApiError } from "@src/utils/api-error";

type AuthRecord = Record<string, unknown>;

class AuthService {
  private getPayloadData(payload: unknown) {
    if (!payload || typeof payload !== "object") {
      return undefined;
    }

    const root = payload as AuthRecord;
    return (root.data as AuthRecord | undefined) ?? root;
  }

  private saveAuthSession(payload: unknown) {
    if (typeof window === "undefined") {
      return;
    }

    const data = this.getPayloadData(payload);
    if (!data) {
      return;
    }

    const token =
      (data.token as string | undefined) ??
      (data.authToken as string | undefined) ??
      (data.accessToken as string | undefined) ??
      (data.access_token as string | undefined);

    const user =
      (data.user as AuthRecord | undefined) ??
      (data.profile as AuthRecord | undefined) ??
      undefined;

    if (token) {
      sessionStorage.setItem("authToken", token);
    }

    if (user) {
      sessionStorage.setItem("authUser", JSON.stringify(user));
    }
  }

  private handleError(err: unknown): never {
    throw normalizeApiError(err);
  }

  async login(formData: LoginDTO) {
    try {
      const response = await http.post("/user/login", formData);
      this.saveAuthSession(response.data);
      return response.data;
    } catch (err) {
      this.handleError(err);
    }
  }

  async register(formData: RegisterDTO) {
    try {
      const response = await http.post("/user/register", formData);
      this.saveAuthSession(response.data);
      return response.data;
    } catch (err) {
      this.handleError(err);
    }
  }

  async getProfile(): Promise<AuthUser | null> {
    try {
      const response = await http.get("/user/me");
      return unwrapData<AuthUser>(response.data);
    } catch (err) {
      this.handleError(err);
    }
  }

  async logout() {
    if (typeof window !== "undefined") {
      sessionStorage.removeItem("authToken");
      sessionStorage.removeItem("authUser");
    }

    return { message: "Logged out" };
  }

  getStoredToken() {
    if (typeof window === "undefined") return null;
    return sessionStorage.getItem("authToken");
  }

  getStoredUser(): AuthUser | null {
    if (typeof window === "undefined") return null;
    const raw = sessionStorage.getItem("authUser");
    if (!raw) return null;
    try {
      return JSON.parse(raw) as AuthUser;
    } catch {
      return null;
    }
  }
}

const authService = new AuthService();
export default authService;
