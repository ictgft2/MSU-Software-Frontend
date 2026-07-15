"use client";

import { useCallback, useEffect, useState } from "react";
import {
  Stethoscope,
  ClipboardList,
  Clock3,
  UserRound,
  RefreshCw,
} from "lucide-react";
import { toast } from "react-toastify";
import { PageHeader } from "@src/components/ui/page-header";
import { Button } from "@src/components/ui/button";
import { KpiCard } from "@src/components/ui/kpi-card";
import { Card, CardHeader, CardTitle, CardFooter } from "@src/components/ui/card";
import { Badge } from "@src/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@src/components/ui/table";
import type { Encounter, ConsultationRecord } from "@src/dto/encounter";
import encountersService from "@src/services/encounters.service";
import { getApiErrorMessage } from "@src/utils/api-error";

export default function DoctorsPage() {
  const [encounters, setEncounters] = useState<Encounter[]>([]);
  const [selected, setSelected] = useState<ConsultationRecord | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const load = useCallback(async () => {
    setIsLoading(true);
    try {
      const [inConsult, pharmacy] = await Promise.all([
        encountersService.listByStatus("InConsultation").catch(() => []),
        encountersService.listByStatus("PharmacyPending").catch(() => []),
      ]);
      setEncounters([...(inConsult || []), ...(pharmacy || [])]);
    } catch (error) {
      toast.error(getApiErrorMessage(error, "Unable to load doctor board"));
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  const openConsultation = async (encounterId: string) => {
    try {
      const data = await encountersService.getConsultation(encounterId);
      setSelected(data);
    } catch (error) {
      toast.error(getApiErrorMessage(error, "No consultation on this encounter yet"));
      setSelected(null);
    }
  };

  return (
    <>
      <PageHeader
        title="Doctors Station"
        description="Encounters in consultation / pharmacy pending"
        actions={
          <Button variant="outline" size="sm" onClick={() => void load()}>
            <RefreshCw className="w-3.5 h-3.5" />
            Refresh
          </Button>
        }
      />

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <KpiCard
          label="Active Board"
          value={isLoading ? "—" : String(encounters.length).padStart(2, "0")}
          hint="InConsultation + PharmacyPending"
          icon={ClipboardList}
          accent
        />
        <KpiCard label="Consultations" value={selected ? "01" : "00"} hint="Detail pane" icon={Stethoscope} />
        <KpiCard label="Avg Wait" value="—" hint="From queue service" icon={Clock3} />
        <KpiCard label="On Duty" value="—" hint="Staff IDs via env" icon={UserRound} />
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-[2.2fr_1fr] gap-5 items-start">
        <Card>
          <CardHeader>
            <CardTitle>Encounter Board</CardTitle>
            <Badge variant="live">LIVE</Badge>
          </CardHeader>
          <Table className="min-w-[640px]">
            <TableHeader>
              <TableRow className="border-0">
                <TableHead>Encounter</TableHead>
                <TableHead>Patient</TableHead>
                <TableHead>Complaint</TableHead>
                <TableHead>Status</TableHead>
                <TableHead />
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading && (
                <TableRow>
                  <TableCell colSpan={5}>Loading...</TableCell>
                </TableRow>
              )}
              {!isLoading && encounters.length === 0 && (
                <TableRow>
                  <TableCell colSpan={5}>No encounters found.</TableCell>
                </TableRow>
              )}
              {encounters.map((row) => (
                <TableRow key={row.id}>
                  <TableCell className="font-mono text-xs">{row.id.slice(0, 8)}</TableCell>
                  <TableCell>{row.patientName || row.fullName || row.patientId || "—"}</TableCell>
                  <TableCell>{row.chiefComplaint || "—"}</TableCell>
                  <TableCell>{row.status || "—"}</TableCell>
                  <TableCell>
                    <Button size="xs" onClick={() => void openConsultation(row.id)}>
                      Open
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          <CardFooter>
            <span>GET /api/v1/encounters?status=...</span>
          </CardFooter>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Consultation Detail</CardTitle>
          </CardHeader>
          <div className="p-4 text-[12.5px] space-y-2">
            {!selected && (
              <p className="text-surface-muted">Select an encounter with a consultation.</p>
            )}
            {selected && (
              <>
                <div>
                  <div className="text-[11px] uppercase text-surface-muted font-semibold">Diagnosis</div>
                  <div>{(selected.diagnosis || []).join(", ") || "—"}</div>
                </div>
                <div>
                  <div className="text-[11px] uppercase text-surface-muted font-semibold">Notes</div>
                  <div className="whitespace-pre-wrap">{selected.clinicalNotes || "—"}</div>
                </div>
                <div>
                  <div className="text-[11px] uppercase text-surface-muted font-semibold">Prescriptions</div>
                  <ul className="list-disc pl-4">
                    {(selected.treatmentPlan?.prescriptions || []).map((rx, idx) => (
                      <li key={idx}>
                        {rx.drugName} · {rx.dosage} · {rx.frequency}
                      </li>
                    ))}
                  </ul>
                </div>
              </>
            )}
          </div>
        </Card>
      </div>
    </>
  );
}
