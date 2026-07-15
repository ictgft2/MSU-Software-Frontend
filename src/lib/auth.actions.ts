/**
 * @deprecated Prefer domain services under @src/services.
 * Kept as a thin re-export for any legacy imports.
 */
import authService from "@src/services/auth.service";
import type { RegisterDTO } from "@src/dto/auth";

export async function UserSignUp(params: RegisterDTO) {
  return authService.register(params);
}
