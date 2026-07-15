import type { Patient, RegisterPatientDTO } from "@src/dto/patient";
import { API_V1 } from "@src/constants/api";
import http from "@src/services/http";
import { asList, unwrapData } from "@src/services/service-utils";
import { normalizeApiError } from "@src/utils/api-error";

class PatientsService {
  private handleError(err: unknown): never {
    throw normalizeApiError(err);
  }

  async register(payload: RegisterPatientDTO) {
    try {
      const response = await http.post(`${API_V1}/patients`, payload);
      return unwrapData<Patient>(response.data);
    } catch (err) {
      this.handleError(err);
    }
  }

  async getById(patientId: string) {
    try {
      const response = await http.get(`${API_V1}/patients/${patientId}`);
      return unwrapData<Patient>(response.data);
    } catch (err) {
      this.handleError(err);
    }
  }

  async searchByName(name: string) {
    try {
      const response = await http.get(`${API_V1}/patients/search`, {
        params: { name },
      });
      return asList<Patient>(response.data);
    } catch (err) {
      this.handleError(err);
    }
  }
}

const patientsService = new PatientsService();
export default patientsService;
