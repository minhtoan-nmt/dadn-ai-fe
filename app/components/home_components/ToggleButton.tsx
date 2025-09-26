import { useState } from "react";

type buttonProps = {power: any, setPower: any};

export default function ToggleButton({power, setPower}: buttonProps) {
  const [enabled, setEnabled] = useState(false);

  return (
    <button
      onClick={() => {
        setEnabled(!enabled);
        power === "On" ? setPower("Off") : setPower("On");
    }}
      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
        enabled ? "bg-blue-600" : "bg-gray-300"
      }`}
    >
      <span
        className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
          enabled ? "translate-x-6" : "translate-x-1"
        }`}
      />
    </button>
  );
}
