import type {
  CompleteDressingDTO,
  DressingOrder,
  LabRequest,
  LabResult,
  SubmitLabResultDTO,
} from "@src/dto/lab";
import type { DateStatusQuery, DressingOrderStatus } from "@src/dto/common";
import { API_V1 } from "@src/constants/api";
import http from "@src/services/http";
import { asList, unwrapData } from "@src/services/service-utils";
import { normalizeApiError } from "@src/utils/api-error";

class LabService {
  private handleError(err: unknown): never {
    throw normalizeApiError(err);
  }

  async listRequests(query: DateStatusQuery = { status: "Pending" }) {
    try {
      const response = await http.get(`${API_V1}/lab/requests`, {
        params: query,
      });
      return asList<LabRequest>(response.data);
    } catch (err) {
      this.handleError(err);
    }
  }

  async getRequest(requestId: string) {
    try {
      const response = await http.get(`${API_V1}/lab/requests/${requestId}`);
      return unwrapData<LabRequest>(response.data);
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
      return unwrapData<LabResult>(response.data);
    } catch (err) {
      this.handleError(err);
    }
  }

  async getEncounterLabResults(encounterId: string) {
    try {
      const response = await http.get(
        `${API_V1}/encounters/${encounterId}/lab-results`
      );
      return asList<LabResult>(response.data);
    } catch (err) {
      this.handleError(err);
    }
  }

  async listDressingOrders(status: DressingOrderStatus = "Pending") {
    try {
      const response = await http.get(`${API_V1}/dressing/orders`, {
        params: { status },
      });
      return asList<DressingOrder>(response.data);
    } catch (err) {
      this.handleError(err);
    }
  }

  async getDressingOrder(orderId: string) {
    try {
      const response = await http.get(`${API_V1}/dressing/orders/${orderId}`);
      return unwrapData<DressingOrder>(response.data);
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
      return unwrapData<DressingOrder>(response.data);
    } catch (err) {
      this.handleError(err);
    }
  }
}

const labService = new LabService();
export default labService;
