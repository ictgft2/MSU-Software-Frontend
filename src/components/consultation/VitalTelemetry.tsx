"use client";

import React from "react";
import { HeartCrack, Thermometer, Weight, Percent } from "lucide-react";
import { VitalMetrics } from "@src/types/consultation";

const fallbackVitals: VitalMetrics = {
  bloodPressure: "—/—",
  temperatureCelsius: 0,
  weightKg: 0,
  bmi: 0,
  o2SaturationPercent: 0,
};

export default function VitalTelemetry({ vitals }: { vitals?: VitalMetrics }) {
  const vitalsData = vitals ?? fallbackVitals;

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      <div className="bg-white border-y border-r border-l-4 border-l-[#C62828] border-gray-200 p-3.5 shadow-2xs flex flex-col justify-between h-28">
        <div className="flex justify-between text-gray-400">
          <span className="text-[10px] font-black uppercase tracking-wider text-gray-400">
            Blood Pressure
          </span>
          <HeartCrack size={14} className="text-[#C62828]" />
        </div>
        <div>
          <div className="flex items-baseline gap-0.5">
            <span className="text-2xl font-black font-sans text-gray-900">
              {vitalsData.bloodPressure}
            </span>
            <span className="text-[10px] text-gray-400 font-bold">mmHg</span>
          </div>
        </div>
      </div>

      <div className="bg-white border border-gray-200 p-3.5 shadow-2xs flex flex-col justify-between h-28">
        <div className="flex justify-between text-gray-400">
          <span className="text-[10px] font-black uppercase tracking-wider">
            Temperature
          </span>
          <Thermometer size={14} />
        </div>
        <div>
          <span className="text-2xl font-black text-gray-900">
            {vitalsData.temperatureCelsius}°C
          </span>
        </div>
      </div>

      <div className="bg-white border border-gray-200 p-3.5 shadow-2xs flex flex-col justify-between h-28">
        <div className="flex justify-between text-gray-400">
          <span className="text-[10px] font-black uppercase tracking-wider">
            Weight / BMI
          </span>
          <Weight size={14} />
        </div>
        <div>
          <span className="text-2xl font-black text-gray-900">
            {vitalsData.weightKg} kg
          </span>
          <p className="text-[10px] text-gray-400 font-semibold mt-1">
            BMI: {vitalsData.bmi || "—"}
          </p>
        </div>
      </div>

      <div className="bg-white border border-gray-200 p-3.5 shadow-2xs flex flex-col justify-between h-28">
        <div className="flex justify-between text-gray-400">
          <span className="text-[10px] font-black uppercase tracking-wider">
            O2 Saturation
          </span>
          <Percent size={14} />
        </div>
        <div>
          <span className="text-2xl font-black text-gray-900">
            {vitalsData.o2SaturationPercent}%
          </span>
        </div>
      </div>
    </div>
  );
}
