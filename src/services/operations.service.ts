import type {
  DrugRegisterEntry,
  QueueEntry,
  QueuePosition,
  ServiceWindow,
} from "@src/dto/operations";
import { API_V1 } from "@src/constants/api";
import http from "@src/services/http";
import { asList, unwrapData } from "@src/services/service-utils";
import { normalizeApiError } from "@src/utils/api-error";

class OperationsService {
  private handleError(err: unknown): never {
    throw normalizeApiError(err);
  }

  async getServiceWindow() {
    try {
      const response = await http.get(`${API_V1}/service-window/current`);
      return unwrapData<ServiceWindow>(response.data);
    } catch (err) {
      this.handleError(err);
    }
  }

  async getQueue() {
    try {
      const response = await http.get(`${API_V1}/queue`);
      return asList<QueueEntry>(response.data);
    } catch (err) {
      this.handleError(err);
    }
  }

  async joinQueue(encounterId: string) {
    try {
      const response = await http.post(`${API_V1}/queue/${encounterId}/join`);
      return unwrapData<unknown>(response.data);
    } catch (err) {
      this.handleError(err);
    }
  }

  async getQueuePosition(encounterId: string) {
    try {
      const response = await http.get(
        `${API_V1}/queue/${encounterId}/position`
      );
      return unwrapData<QueuePosition>(response.data);
    } catch (err) {
      this.handleError(err);
    }
  }

  async listDrugRegister(page = 1, limit = 50) {
    try {
      const response = await http.get(`${API_V1}/register/drugs`, {
        params: { page, limit },
      });
      return asList<DrugRegisterEntry>(response.data);
    } catch (err) {
      this.handleError(err);
    }
  }

  async exportDrugRegisterCsv() {
    try {
      const response = await http.get(`${API_V1}/register/drugs/export`, {
        params: { format: "csv" },
        responseType: "blob",
      });
      return response.data as Blob;
    } catch (err) {
      this.handleError(err);
    }
  }
}

const operationsService = new OperationsService();
export default operationsService;
