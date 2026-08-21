import type {
  ConfirmHandoverDTO,
  DispensePrescriptionDTO,
  PharmacyPrescription,
  ProtocolHandover,
} from "@src/dto/pharmacy";
import type { DateStatusQuery } from "@src/dto/common";
import { API_V1 } from "@src/constants/api";
import http from "@src/services/http";
import { asList, unwrapData } from "@src/services/service-utils";
import { normalizeApiError } from "@src/utils/api-error";

class PharmacyService {
  private handleError(err: unknown): never {
    throw normalizeApiError(err);
  }

  async listPrescriptions(query: DateStatusQuery | string = { status: "Pending" }) {
    try {
      const params =
        typeof query === "string" ? { status: query } : query;
      const response = await http.get(`${API_V1}/pharmacy/prescriptions`, {
        params,
      });
      return asList<PharmacyPrescription>(response.data);
    } catch (err) {
      this.handleError(err);
    }
  }

  async getPrescription(prescriptionId: string) {
    try {
      const response = await http.get(
        `${API_V1}/pharmacy/prescriptions/${prescriptionId}`
      );
      return unwrapData<PharmacyPrescription>(response.data);
    } catch (err) {
      this.handleError(err);
    }
  }

  async dispense(prescriptionId: string, payload: DispensePrescriptionDTO) {
    try {
      const response = await http.post(
        `${API_V1}/pharmacy/prescriptions/${prescriptionId}/dispense`,
        payload
      );
      return unwrapData<PharmacyPrescription>(response.data);
    } catch (err) {
      this.handleError(err);
    }
  }

  async listHandovers(status = "Pending") {
    try {
      const response = await http.get(`${API_V1}/protocol/handovers`, {
        params: { status },
      });
      return asList<ProtocolHandover>(response.data);
    } catch (err) {
      this.handleError(err);
    }
  }

  async getHandover(handoverId: string) {
    try {
      const response = await http.get(
        `${API_V1}/protocol/handovers/${handoverId}`
      );
      return unwrapData<ProtocolHandover>(response.data);
    } catch (err) {
      this.handleError(err);
    }
  }

  async confirmHandover(handoverId: string, payload: ConfirmHandoverDTO) {
    try {
      const response = await http.post(
        `${API_V1}/protocol/handovers/${handoverId}/confirm`,
        payload
      );
      return unwrapData<ProtocolHandover>(response.data);
    } catch (err) {
      this.handleError(err);
    }
  }
}

const pharmacyService = new PharmacyService();
export default pharmacyService;
