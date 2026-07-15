import type {
  CompleteDressingDTO,
  DressingOrder,
  LabRequest,
  SubmitLabResultDTO,
} from "@src/dto/lab";
import { API_V1 } from "@src/constants/api";
import http from "@src/services/http";
import { asList, unwrapData } from "@src/services/service-utils";
import { normalizeApiError } from "@src/utils/api-error";

class LabService {
  private handleError(err: unknown): never {
    throw normalizeApiError(err);
  }

  async listRequests(status = "Pending") {
    try {
      const response = await http.get(`${API_V1}/lab/requests`, {
        params: { status },
      });
      return asList<LabRequest>(response.data);
    } catch (err) {
      this.handleError(err);
    }
  }

  async submitResult(requestId: string, payload: SubmitLabResultDTO) {
    try {
      const response = await http.post(
        `${API_V1}/lab/requests/${requestId}/results`,
        payload
      );
      return unwrapData<unknown>(response.data);
    } catch (err) {
      this.handleError(err);
    }
  }

  async listDressingOrders(status = "Pending") {
    try {
      const response = await http.get(`${API_V1}/dressing/orders`, {
        params: { status },
      });
      return asList<DressingOrder>(response.data);
    } catch (err) {
      this.handleError(err);
    }
  }

  async completeDressing(orderId: string, payload: CompleteDressingDTO) {
    try {
      const response = await http.patch(
        `${API_V1}/dressing/orders/${orderId}/complete`,
        payload
      );
      return unwrapData<unknown>(response.data);
    } catch (err) {
      this.handleError(err);
    }
  }
}

const labService = new LabService();
export default labService;
