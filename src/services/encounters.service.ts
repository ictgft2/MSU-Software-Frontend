import type {
  ConsultationRecord,
  CreateConsultationDTO,
  Encounter,
  EncounterVitals,
  OpenEncounterDTO,
  RecordVitalsDTO,
  UpdateEncounterStatusDTO,
} from "@src/dto/encounter";
import type { EncounterStatus } from "@src/dto/common";
import { API_V1 } from "@src/constants/api";
import http from "@src/services/http";
import { asList, unwrapData } from "@src/services/service-utils";
import { normalizeApiError } from "@src/utils/api-error";

class EncountersService {
  private handleError(err: unknown): never {
    throw normalizeApiError(err);
  }

  async open(payload: OpenEncounterDTO) {
    try {
      const response = await http.post(`${API_V1}/encounters`, payload);
      return unwrapData<Encounter>(response.data);
    } catch (err) {
      this.handleError(err);
    }
  }

  async getById(encounterId: string) {
    try {
      const response = await http.get(`${API_V1}/encounters/${encounterId}`);
      return unwrapData<Encounter>(response.data);
    } catch (err) {
      this.handleError(err);
    }
  }

  async listByStatus(status: EncounterStatus) {
    try {
      const response = await http.get(`${API_V1}/encounters`, {
        params: { status },
      });
      return asList<Encounter>(response.data);
    } catch (err) {
      this.handleError(err);
    }
  }

  async updateStatus(encounterId: string, payload: UpdateEncounterStatusDTO) {
    try {
      const response = await http.patch(
        `${API_V1}/encounters/${encounterId}/status`,
        payload
      );
      return unwrapData<Encounter>(response.data);
    } catch (err) {
      this.handleError(err);
    }
  }

  async getLatestVitals(encounterId: string) {
    try {
      const response = await http.get(
        `${API_V1}/encounters/${encounterId}/vitals/latest`
      );
      return unwrapData<EncounterVitals>(response.data);
    } catch (err) {
      this.handleError(err);
    }
  }

  async recordVitals(encounterId: string, payload: RecordVitalsDTO) {
    try {
      const response = await http.post(
        `${API_V1}/encounters/${encounterId}/vitals`,
        payload
      );
      return unwrapData<EncounterVitals>(response.data);
    } catch (err) {
      this.handleError(err);
    }
  }

  async getConsultation(encounterId: string) {
    try {
      const response = await http.get(
        `${API_V1}/encounters/${encounterId}/consultation`
      );
      return unwrapData<ConsultationRecord>(response.data);
    } catch (err) {
      this.handleError(err);
    }
  }

  async createConsultation(encounterId: string, payload: CreateConsultationDTO) {
    try {
      const response = await http.post(
        `${API_V1}/encounters/${encounterId}/consultation`,
        payload
      );
      return unwrapData<ConsultationRecord>(response.data);
    } catch (err) {
      this.handleError(err);
    }
  }

  async getContactTrace(encounterId: string) {
    try {
      const response = await http.get(
        `${API_V1}/encounters/${encounterId}/contact-trace`
      );
      return unwrapData<unknown>(response.data);
    } catch (err) {
      this.handleError(err);
    }
  }
}

const encountersService = new EncountersService();
export default encountersService;
