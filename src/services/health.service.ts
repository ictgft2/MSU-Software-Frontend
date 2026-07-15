import http from "@src/services/http";
import { unwrapData } from "@src/services/service-utils";
import { normalizeApiError } from "@src/utils/api-error";

class HealthService {
  private handleError(err: unknown): never {
    throw normalizeApiError(err);
  }

  async check() {
    try {
      const response = await http.get("/health");
      return unwrapData<unknown>(response.data);
    } catch (err) {
      this.handleError(err);
    }
  }
}

const healthService = new HealthService();
export default healthService;
