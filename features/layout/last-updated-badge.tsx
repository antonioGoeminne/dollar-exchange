import { getLastUpdate } from "@/features/currency/api/get-last-update";

function formatRelativeTime(ms: number): string {
  const now = Date.now();
  const diffMs = now - ms;
  const diffSec = Math.floor(diffMs / 1000);
  const diffMin = Math.floor(diffSec / 60);
  const diffHr = Math.floor(diffMin / 60);

  if (diffSec < 45) return "Actualizado ahora";
  if (diffSec < 60) return "Actualizado hace unos segundos";
  if (diffMin === 1) return "Actualizado hace 1 minuto";
  if (diffMin < 60) return `Actualizado hace ${diffMin} minutos`;
  if (diffHr === 1) return "Actualizado hace 1 hora";
  if (diffHr < 24) return `Actualizado hace ${diffHr} horas`;
  return "Actualizado hace más de 1 día";
}

function formatTime(ms: number): string {
  return new Date(ms).toLocaleTimeString("es-AR", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
    timeZone: "America/Argentina/Buenos_Aires",
  });
}

export async function LastUpdatedBadge() {
  const { lastUpdate } = await getLastUpdate();

  if (lastUpdate == null) return null;

  const lastUpdateMs = new Date(lastUpdate).getTime();
  const label = formatRelativeTime(lastUpdateMs);
  const timeLabel = formatTime(lastUpdateMs);

  return (
    <span
      className="inline-flex items-center gap-1.5 px-3 text-xs lg:text-sm font-semibold text-emerald-800 dark:text-emerald-200"
      title={`Última actualización: ${timeLabel} hs`}
    >
      <span
        className="size-2 shrink-0 rounded-full bg-emerald-500 dark:bg-emerald-400 live-badge-dot"
        aria-hidden
      />
      {label}
    </span>
  );
}
