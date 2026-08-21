"use client";

import DashboardHeader from "@src/components/dashboard/Header";
import StatCards from "@src/components/dashboard/StatCards";
import PatientFlow from "@src/components/dashboard/PatientFlow";
import AlertsPanel, { UnitHeatmap } from "@src/components/dashboard/AlertsPanel";

export default function DashboardPage() {
  return (
    <>
      <DashboardHeader />
      <StatCards />

      <div className="grid grid-cols-1 xl:grid-cols-[2.2fr_1fr] gap-5 items-start">
        <PatientFlow />
        <AlertsPanel />
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-[2.2fr_1fr] gap-5 items-start">
        <div className="flex flex-wrap items-center gap-x-5 gap-y-2 text-[11.5px] text-surface-muted px-1 py-1.5">
          <span>Live counts from encounters, queue, and pharmacy APIs</span>
        </div>
        <UnitHeatmap />
      </div>

      <div className="text-right text-[10px] text-[#b5b5b9] pt-1">
        GILEAD_PORTAL_SECURE_V4.2.0 // UNIT_CMD_ALPHA_5
      </div>
    </>
  );
}
