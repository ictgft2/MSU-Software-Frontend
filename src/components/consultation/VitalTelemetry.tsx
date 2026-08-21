"use client";

import React, { ChangeEvent } from "react";
import { HeartCrack, Thermometer, Weight, Percent, Activity } from "lucide-react";
import { VitalMetrics } from "@src/types/consultation";

const emptyVitals: VitalMetrics = {
  bloodPressureSystolic: "",
  bloodPressureDiastolic: "",
  pulseRate: "",
  temperatureCelsius: "",
  weightKg: "",
  spo2: "",
  respiratoryRate: "",
  notes: "",
};

export default function VitalTelemetry({
  vitals,
  onChange,
}: {
  vitals?: VitalMetrics;
  onChange?: (next: VitalMetrics) => void;
}) {
  const vitalsData = vitals ?? emptyVitals;
  const editable = Boolean(onChange);

  const update = (patch: Partial<VitalMetrics>) => {
    onChange?.({ ...vitalsData, ...patch });
  };

  const numberField = (
    label: string,
    key: keyof VitalMetrics,
    icon: React.ReactNode,
    suffix?: string,
    accent?: boolean
  ) => (
    <div
      className={`bg-white border p-3.5 shadow-2xs flex flex-col justify-between h-28 ${
        accent ? "border-y border-r border-l-4 border-l-[#C62828] border-gray-200" : "border-gray-200"
      }`}
    >
      <div className="flex justify-between text-gray-400">
        <span className="text-[10px] font-black uppercase tracking-wider">{label}</span>
        {icon}
      </div>
      {editable ? (
        <div className="flex items-baseline gap-1">
          <input
            type="number"
            value={vitalsData[key] as number | ""}
            onChange={(e) =>
              update({
                [key]: e.target.value === "" ? "" : Number(e.target.value),
              } as Partial<VitalMetrics>)
            }
            className="w-full text-2xl font-black text-gray-900 bg-transparent border-b border-gray-200 outline-none"
          />
          {suffix && <span className="text-[10px] text-gray-400 font-bold">{suffix}</span>}
        </div>
      ) : (
        <div className="flex items-baseline gap-0.5">
          <span className="text-2xl font-black text-gray-900">
            {vitalsData[key] === "" ? "—" : String(vitalsData[key])}
          </span>
          {suffix && <span className="text-[10px] text-gray-400 font-bold">{suffix}</span>}
        </div>
      )}
    </div>
  );

  return (
    <div className="space-y-3">
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white border-y border-r border-l-4 border-l-[#C62828] border-gray-200 p-3.5 shadow-2xs flex flex-col justify-between h-28">
          <div className="flex justify-between text-gray-400">
            <span className="text-[10px] font-black uppercase tracking-wider">Blood Pressure</span>
            <HeartCrack size={14} className="text-[#C62828]" />
          </div>
          {editable ? (
            <div className="flex items-baseline gap-1">
              <input
                type="number"
                value={vitalsData.bloodPressureSystolic}
                onChange={(e) =>
                  update({
                    bloodPressureSystolic: e.target.value === "" ? "" : Number(e.target.value),
                  })
                }
                className="w-16 text-2xl font-black text-gray-900 bg-transparent border-b border-gray-200 outline-none"
              />
              <span className="text-xl font-bold text-gray-400">/</span>
              <input
                type="number"
                value={vitalsData.bloodPressureDiastolic}
                onChange={(e) =>
                  update({
                    bloodPressureDiastolic: e.target.value === "" ? "" : Number(e.target.value),
                  })
                }
                className="w-16 text-2xl font-black text-gray-900 bg-transparent border-b border-gray-200 outline-none"
              />
              <span className="text-[10px] text-gray-400 font-bold">mmHg</span>
            </div>
          ) : (
            <div className="flex items-baseline gap-0.5">
              <span className="text-2xl font-black text-gray-900">
                {vitalsData.bloodPressureSystolic || "—"}/{vitalsData.bloodPressureDiastolic || "—"}
              </span>
              <span className="text-[10px] text-gray-400 font-bold">mmHg</span>
            </div>
          )}
        </div>
        {numberField("Temperature", "temperatureCelsius", <Thermometer size={14} />, "°C")}
        {numberField("Weight", "weightKg", <Weight size={14} />, "kg")}
        {numberField("O2 Saturation", "spo2", <Percent size={14} />, "%")}
      </div>
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {numberField("Pulse", "pulseRate", <Activity size={14} />, "bpm")}
        {numberField("Resp. Rate", "respiratoryRate", <Activity size={14} />, "/min")}
        <div className="col-span-2 bg-white border border-gray-200 p-3.5 shadow-2xs">
          <span className="text-[10px] font-black uppercase tracking-wider text-gray-400">Notes</span>
          {editable ? (
            <textarea
              value={vitalsData.notes}
              onChange={(e: ChangeEvent<HTMLTextAreaElement>) => update({ notes: e.target.value })}
              rows={2}
              className="w-full mt-1 text-sm border-b border-gray-200 outline-none resize-none"
            />
          ) : (
            <p className="text-sm mt-1">{vitalsData.notes || "—"}</p>
          )}
        </div>
      </div>
    </div>
  );
}
