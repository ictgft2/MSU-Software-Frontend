import type {
  ConfirmHandoverDTO,
  DispensePrescriptionDTO,
  PharmacyPrescription,
  ProtocolHandover,
} from "@src/dto/pharmacy";
import { API_V1 } from "@src/constants/api";
import http from "@src/services/http";
import { asList, unwrapData } from "@src/services/service-utils";
import { normalizeApiError } from "@src/utils/api-error";

class PharmacyService {
  private handleError(err: unknown): never {
    throw normalizeApiError(err);
  }

  async listPrescriptions(status = "Pending") {
    try {
      const response = await http.get(`${API_V1}/pharmacy/prescriptions`, {
        params: { status },
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
      return unwrapData<unknown>(response.data);
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

  async confirmHandover(handoverId: string, payload: ConfirmHandoverDTO) {
    try {
      const response = await http.post(
        `${API_V1}/protocol/handovers/${handoverId}/confirm`,
        payload
      );
      return unwrapData<unknown>(response.data);
    } catch (err) {
      this.handleError(err);
    }
  }
}

const pharmacyService = new PharmacyService();
export default pharmacyService;
