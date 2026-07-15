"use client";

import { useCallback, useEffect, useState } from "react";
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

export default function AdminPage() {
  const [drugs, setDrugs] = useState<DrugRegisterEntry[]>([]);
  const [windowInfo, setWindowInfo] = useState<ServiceWindow | null>(null);
  const [healthOk, setHealthOk] = useState<string>("—");
  const [isLoading, setIsLoading] = useState(true);

  const load = useCallback(async () => {
    setIsLoading(true);
    try {
      const [register, serviceWindow] = await Promise.all([
        operationsService.listDrugRegister(1, 50).catch(() => []),
        operationsService.getServiceWindow().catch(() => null),
      ]);
      setDrugs(register || []);
      setWindowInfo(serviceWindow);
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
      const blob = await operationsService.exportDrugRegisterCsv();
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "drug-register.csv";
      a.click();
      URL.revokeObjectURL(url);
    } catch (error) {
      toast.error(getApiErrorMessage(error, "Unable to export drug register"));
    }
  };

  return (
    <>
      <PageHeader
        title="Administration Console"
        description="Service window, health, and drug register"
        actions={
          <>
            <Button variant="outline" size="sm" onClick={() => void load()}>
              <RefreshCw className="w-3.5 h-3.5" />
              Refresh
            </Button>
            <Button size="sm" onClick={() => void handleExport()}>
              <Download className="w-3.5 h-3.5" />
              Export CSV
            </Button>
          </>
        }
      />

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <KpiCard
          label="API Health"
          value={healthOk}
          hint="GET /health"
          icon={Activity}
          accent
        />
        <KpiCard
          label="Service Window"
          value={windowInfo?.isOpen ? "OPEN" : windowInfo ? "CLOSED" : "—"}
          hint={windowInfo?.label || "GET /service-window/current"}
          icon={Shield}
        />
        <KpiCard
          label="Drug Register"
          value={isLoading ? "—" : String(drugs.length)}
          hint="Page 1 · limit 50"
          icon={Users}
        />
        <KpiCard
          label="Message"
          value={windowInfo?.message ? "NOTE" : "—"}
          hint={windowInfo?.message || "No service message"}
          icon={Activity}
        />
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Drug Register</CardTitle>
        </CardHeader>
        <Table className="min-w-[560px]">
          <TableHeader>
            <TableRow className="border-0">
              <TableHead>Drug</TableHead>
              <TableHead>Batch</TableHead>
              <TableHead>Qty</TableHead>
              <TableHead>Expiry</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading && (
              <TableRow>
                <TableCell colSpan={4}>Loading...</TableCell>
              </TableRow>
            )}
            {!isLoading && drugs.length === 0 && (
              <TableRow>
                <TableCell colSpan={4}>No register rows.</TableCell>
              </TableRow>
            )}
            {drugs.map((row, idx) => (
              <TableRow key={row.id || `${row.drugName}-${idx}`}>
                <TableCell className="font-semibold">{row.drugName || "—"}</TableCell>
                <TableCell>{row.batchNumber || "—"}</TableCell>
                <TableCell>{row.quantity ?? "—"}</TableCell>
                <TableCell>{row.expiryDate || "—"}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        <CardFooter>
          <span>GET /api/v1/register/drugs</span>
        </CardFooter>
      </Card>
    </>
  );
}
