"use client";

import { useEffect, useState } from "react";
import {
  HeartPulse,
  Bed,
  UserRoundCheck,
  FlaskConical,
} from "lucide-react";
import { KpiCard } from "@src/components/ui/kpi-card";
import encountersService from "@src/services/encounters.service";
import operationsService from "@src/services/operations.service";
import pharmacyService from "@src/services/pharmacy.service";

function todayIso() {
  return new Date().toISOString().slice(0, 10);
}

function isEmergencyType(value?: string) {
  return String(value || "").toLowerCase().includes("emergency");
}

export default function StatCards() {
  const [emergency, setEmergency] = useState("—");
  const [queued, setQueued] = useState("—");
  const [inConsult, setInConsult] = useState("—");
  const [pharmacy, setPharmacy] = useState("—");

  useEffect(() => {
    let active = true;
    const date = todayIso();

    async function load() {
      const [emergencies, queue, consult, pharmacyPending, prescriptions] =
        await Promise.all([
          encountersService.list({ type: "Emergency", date }).catch(() => []),
          operationsService.getQueue().catch(() => []),
          encountersService.list({ status: "InConsultation", date }).catch(() => []),
          encountersService.list({ status: "PharmacyPending", date }).catch(() => []),
          pharmacyService.listPrescriptions({ status: "Pending", date }).catch(() => []),
        ]);

      if (!active) return;

      const coldQueue = (queue || []).filter((item) => !isEmergencyType(item.admissionType));
      setEmergency(String((emergencies || []).length).padStart(2, "0"));
      setQueued(String(coldQueue.length).padStart(2, "0"));
      setInConsult(String((consult || []).length).padStart(2, "0"));
      setPharmacy(
        String(
          Math.max((pharmacyPending || []).length, (prescriptions || []).length)
        ).padStart(2, "0")
      );
    }

    void load();
    return () => {
      active = false;
    };
  }, []);

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      <KpiCard
        label="Emergency ward"
        value={emergency}
        hint="Skip the waitlist"
        icon={HeartPulse}
        accent
      />
      <KpiCard
        label="Cold-case queue"
        value={queued}
        hint="Walk-ins waiting for doctor"
        icon={Bed}
      />
      <KpiCard
        label="In Consultation"
        value={inConsult}
        hint="Today"
        icon={UserRoundCheck}
      />
      <KpiCard
        label="Pharmacy pending"
        value={pharmacy}
        hint="After consult"
        icon={FlaskConical}
      />
    </div>
  );
}
