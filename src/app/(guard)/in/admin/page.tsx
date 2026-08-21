"use client";

import { useCallback, useEffect, useState, FormEvent } from "react";
import {
  Shield,
  Users,
  Activity,
  Download,
  RefreshCw,
} from "lucide-react";
import { toast } from "react-toastify";
import { PageHeader } from "@src/components/ui/page-header";
import { Button } from "@src/components/ui/button";
import { KpiCard } from "@src/components/ui/kpi-card";
import { Card, CardHeader, CardTitle, CardFooter } from "@src/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@src/components/ui/table";
import type { DrugRegisterEntry, ServiceWindow } from "@src/dto/operations";
import operationsService from "@src/services/operations.service";
import healthService from "@src/services/health.service";
import { getApiErrorMessage } from "@src/utils/api-error";
import {
  getStaffId,
  isUuid,
  setStaffId,
  toAspNetDate,
  toAspNetTime,
  type StaffRole,
} from "@src/utils/staff";

function todayIso() {
  return new Date().toISOString().slice(0, 10);
}

export default function AdminPage() {
  const [drugs, setDrugs] = useState<DrugRegisterEntry[]>([]);
  const [windowInfo, setWindowInfo] = useState<ServiceWindow | null>(null);
  const [windowError, setWindowError] = useState<string | null>(null);
  const [healthOk, setHealthOk] = useState<string>("—");
  const [isLoading, setIsLoading] = useState(true);
  const [date, setDate] = useState(todayIso());
  const [openTime, setOpenTime] = useState("08:00:00");
  const [closeTime, setCloseTime] = useState("16:00:00");
  const [createdBy, setCreatedBy] = useState("");
  const [staffDraft, setStaffDraft] = useState<Record<StaffRole, string>>({
    registrar: "",
    nurse: "",
    doctor: "",
    pharmacist: "",
    protocolOfficer: "",
    scientist: "",
    dressingNurse: "",
  });
  const [savingWindow, setSavingWindow] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  useEffect(() => {
    const registrar = getStaffId("registrar");
    setCreatedBy(registrar);
    setStaffDraft({
      registrar,
      nurse: getStaffId("nurse"),
      doctor: getStaffId("doctor"),
      pharmacist: getStaffId("pharmacist"),
      protocolOfficer: getStaffId("protocolOfficer"),
      scientist: getStaffId("scientist"),
      dressingNurse: getStaffId("dressingNurse"),
    });
  }, []);

  const load = useCallback(async () => {
    setIsLoading(true);
    setWindowError(null);
    try {
      const register = await operationsService
        .listDrugRegister({ page: 1, limit: 50 })
        .catch(() => []);
      setDrugs(register || []);

      try {
        const serviceWindow = await operationsService.getServiceWindow();
        setWindowInfo(serviceWindow);
        if (serviceWindow?.coldCaseOpenTime) {
          setOpenTime(toAspNetTime(serviceWindow.coldCaseOpenTime));
        }
        if (serviceWindow?.coldCaseCloseTime) {
          setCloseTime(toAspNetTime(serviceWindow.coldCaseCloseTime));
        }
        if (serviceWindow?.date) {
          setDate(toAspNetDate(serviceWindow.date));
        }
      } catch (error) {
        setWindowInfo(null);
        setWindowError(
          getApiErrorMessage(
            error,
            "Current service window could not be loaded (backend database error)."
          )
        );
      }

      try {
        await healthService.check();
        setHealthOk("OK");
      } catch {
        setHealthOk("DOWN");
      }
    } catch (error) {
      toast.error(getApiErrorMessage(error, "Unable to load admin data"));
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  const handleExport = async () => {
    try {
      const blob = await operationsService.exportDrugRegister({
        date: toAspNetDate(date),
        format: "csv",
      });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `drug-register-${toAspNetDate(date)}.csv`;
      a.click();
      URL.revokeObjectURL(url);
    } catch (error) {
      toast.error(getApiErrorMessage(error, "Unable to export drug register"));
    }
  };

  const handleSaveWindow = async (e: FormEvent) => {
    e.preventDefault();
    setFormError(null);

    if (!isUuid(createdBy)) {
      setFormError("createdBy must be a UUID. The API rejects values like \"admin\".");
      return;
    }

    setStaffId("registrar", createdBy);
    setSavingWindow(true);
    try {
      const open = toAspNetTime(openTime);
      const close = toAspNetTime(closeTime);
      const saved = windowInfo?.id
        ? await operationsService.updateServiceWindow(windowInfo.id, {
            coldCaseOpenTime: open,
            coldCaseCloseTime: close,
          })
        : await operationsService.createServiceWindow({
            date: toAspNetDate(date),
            coldCaseOpenTime: open,
            coldCaseCloseTime: close,
            createdBy: createdBy.trim(),
          });
      setWindowInfo(saved);
      setWindowError(null);
      toast.success(windowInfo?.id ? "Service window updated" : "Service window opened");
    } catch (error) {
      const message = getApiErrorMessage(error, "Unable to save service window");
      setFormError(message);
      toast.error(message);
    } finally {
      setSavingWindow(false);
    }
  };

  return (
    <div className="w-full min-w-0 space-y-6">
      <PageHeader
        title="Administration Console"
        description="Cold-case consult hours (after 1st service until last sermon) and the collated drug register after protocol handover"
        actions={
          <div className="flex flex-wrap gap-2">
            <Button variant="outline" size="sm" onClick={() => void load()}>
              <RefreshCw className="w-3.5 h-3.5" />
              Refresh
            </Button>
            <Button size="sm" onClick={() => void handleExport()}>
              <Download className="w-3.5 h-3.5" />
              Export CSV
            </Button>
          </div>
        }
      />

      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        <KpiCard
          label="API Health"
          value={healthOk}
          hint="GET /health"
          icon={Activity}
          accent
        />
        <KpiCard
          label="Service Window"
          value={windowInfo?.isOpen ? "OPEN" : windowInfo?.id ? "SET" : "—"}
          hint={windowError ? "Current window API is down" : windowInfo?.date || "No current window"}
          icon={Shield}
        />
        <KpiCard
          label="Drug Register"
          value={isLoading ? "—" : String(drugs.length)}
          hint="GET /register/drugs"
          icon={Users}
        />
        <KpiCard
          className="min-w-0"
          label="Hours"
          value={
            <span className="block truncate text-2xl xl:text-3xl">
              {windowInfo?.coldCaseOpenTime || "—"}
            </span>
          }
          hint={windowInfo?.coldCaseCloseTime || "Set times below"}
          icon={Activity}
        />
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-[minmax(0,1.35fr)_minmax(320px,0.9fr)] gap-5 items-start">
        <Card className="min-w-0">
          <CardHeader>
            <CardTitle>Cold-case service window</CardTitle>
          </CardHeader>
          <form onSubmit={handleSaveWindow} className="p-4 sm:p-5 space-y-4">
            {windowError && (
              <p className="text-amber-800 bg-amber-50 border border-amber-200 rounded-md p-3 text-xs leading-relaxed">
                {windowError} Set a UUID createdBy and times as HH:mm:ss, then try Open window.
              </p>
            )}
            {formError && (
              <p className="text-[#C62828] bg-red-50 border border-red-200 rounded-md p-3 text-xs leading-relaxed">
                {formError}
              </p>
            )}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <label className="space-y-1.5 min-w-0">
                <span className="block uppercase text-surface-muted font-bold text-[10px] tracking-wide">
                  Date
                </span>
                <input
                  type="date"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  className="w-full min-w-0 h-10 border border-surface-border rounded-md px-3 text-sm bg-white"
                />
              </label>
              <label className="space-y-1.5 min-w-0">
                <span className="block uppercase text-surface-muted font-bold text-[10px] tracking-wide">
                  Open time
                </span>
                <input
                  type="time"
                  step="1"
                  value={openTime}
                  onChange={(e) => setOpenTime(toAspNetTime(e.target.value))}
                  className="w-full min-w-0 h-10 border border-surface-border rounded-md px-3 text-sm bg-white"
                />
              </label>
              <label className="space-y-1.5 min-w-0">
                <span className="block uppercase text-surface-muted font-bold text-[10px] tracking-wide">
                  Close time
                </span>
                <input
                  type="time"
                  step="1"
                  value={closeTime}
                  onChange={(e) => setCloseTime(toAspNetTime(e.target.value))}
                  className="w-full min-w-0 h-10 border border-surface-border rounded-md px-3 text-sm bg-white"
                />
              </label>
            </div>
            <label className="block space-y-1.5 min-w-0">
              <span className="block uppercase text-surface-muted font-bold text-[10px] tracking-wide">
                createdBy UUID
              </span>
              <input
                value={createdBy}
                onChange={(e) => setCreatedBy(e.target.value)}
                placeholder="xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx"
                className="w-full min-w-0 h-10 border border-surface-border rounded-md px-3 text-sm font-mono bg-white"
              />
            </label>
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-end gap-3 pt-1">
              <p className="text-[11px] text-surface-muted leading-relaxed sm:mr-auto">
                Uses POST /api/v1/service-window. This is the cold-case consult window only — emergencies are seen any time.
              </p>
              <Button type="submit" size="sm" disabled={savingWindow} className="shrink-0 self-start sm:self-auto">
                {savingWindow ? "Saving..." : windowInfo?.id ? "Update window" : "Open window"}
              </Button>
            </div>
          </form>
        </Card>

        <Card className="min-w-0">
          <CardHeader>
            <CardTitle>Staff actor UUIDs</CardTitle>
          </CardHeader>
          <div className="p-4 sm:p-5 grid grid-cols-1 gap-3">
            {(
              [
                ["registrar", "Registrar / createdBy"],
                ["nurse", "Nurse / vitals"],
                ["doctor", "Doctor / consultation"],
                ["pharmacist", "Pharmacist / dispense"],
                ["scientist", "Scientist / lab results"],
                ["protocolOfficer", "Protocol officer / handover"],
                ["dressingNurse", "Dressing nurse"],
              ] as const
            ).map(([role, label]) => (
              <label key={role} className="space-y-1.5 min-w-0">
                <span className="block uppercase text-surface-muted font-bold text-[10px] tracking-wide">
                  {label}
                </span>
                <input
                  value={staffDraft[role]}
                  onChange={(e) => {
                    const value = e.target.value;
                    setStaffDraft((prev) => ({ ...prev, [role]: value }));
                    if (isUuid(value)) setStaffId(role, value);
                    if (role === "registrar") setCreatedBy(value);
                  }}
                  placeholder="xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx"
                  className="w-full min-w-0 h-10 border border-surface-border rounded-md px-3 text-sm font-mono bg-white"
                />
              </label>
            ))}
          </div>
        </Card>
      </div>

      <Card className="min-w-0">
        <CardHeader>
          <CardTitle>Drug Register</CardTitle>
        </CardHeader>
        <Table>
          <TableHeader>
            <TableRow className="border-0">
              <TableHead>Drug</TableHead>
              <TableHead>Dosage</TableHead>
              <TableHead>Batch</TableHead>
              <TableHead>Qty</TableHead>
              <TableHead>Expiry</TableHead>
              <TableHead>Handover</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading && (
              <TableRow>
                <TableCell colSpan={6}>Loading...</TableCell>
              </TableRow>
            )}
            {!isLoading && drugs.length === 0 && (
              <TableRow>
                <TableCell colSpan={6}>No register rows yet.</TableCell>
              </TableRow>
            )}
            {drugs.map((row, idx) => (
              <TableRow key={row.id || row.prescriptionId || `${row.drugName}-${idx}`}>
                <TableCell className="font-semibold">{row.drugName || "—"}</TableCell>
                <TableCell>{row.dosage || "—"}</TableCell>
                <TableCell>{row.batchNumber || "—"}</TableCell>
                <TableCell>{row.quantityDispensed ?? row.quantity ?? "—"}</TableCell>
                <TableCell>{row.expiryDate || "—"}</TableCell>
                <TableCell>{row.handoverAt || "—"}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        <CardFooter className="flex-wrap gap-2">
          <span>GET /api/v1/register/drugs</span>
        </CardFooter>
      </Card>
    </div>
  );
}
