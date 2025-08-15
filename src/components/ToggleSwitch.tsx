'use client';

interface ToggleSwitchProps {
  enabled: boolean;
  onToggle: (enabled: boolean) => void;
}

export default function ToggleSwitch({ enabled, onToggle }: ToggleSwitchProps) {
  return (
    <div className="">
      <button
        type="button"
        className={`relative inline-flex h-5 w-8 items-center rounded-full  ${
          enabled ? 'bg-yellow-400' : 'bg-[#aaaaaa]'
        }`}
        onClick={() => onToggle(!enabled)}
      >
        <span
          className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
            enabled ? 'translate-x-11/12' : 'translate-x-1/12'
          }`}
        />
      </button>
    </div>
  );
}
