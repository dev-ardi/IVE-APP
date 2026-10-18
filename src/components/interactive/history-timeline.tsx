"use client";

interface Props {
  config?: Record<string, unknown>;
}

interface TimelineEvent {
  year: string;
  title: string;
  description: string;
}

const DEFAULT_EVENTS: TimelineEvent[] = [
  { year: "15 Agustus 1945", title: "Jepang menyerah", description: "Jepang menyerah kepada Sekutu setelah bom atom Hiroshima dan Nagasaki." },
  { year: "16 Agustus 1945", title: "Peristiwa Rengasdengklok", description: "Golongan muda membawa Soekarno dan Hatta ke Rengasdengklok untuk mendesak proklamasi." },
  { year: "17 Agustus 1945", title: "Proklamasi Kemerdekaan", description: "Soekarno membacakan teks proklamasi di Jalan Pegangsaan Timur 56, Jakarta." },
  { year: "18 Agustus 1945", title: "PPKI bersidang", description: "PPKI mengesahkan UUD 1945 dan memilih Soekarno-Hatta sebagai presiden dan wakil presiden." },
];

/**
 * History Timeline (history-timeline, §10).
 * Vertical timeline of events related to Indonesian independence.
 */
export default function HistoryTimeline({ config = {} }: Props) {
  const startYear = Number(config.startYear ?? 1945);
  const events = DEFAULT_EVENTS.filter((e) => Number.parseInt(e.year) >= startYear);

  return (
    <ol className="relative ml-4 space-y-6 border-l border-border pl-6">
      {events.map((ev, i) => (
        <li key={i} className="relative">
          <span className="absolute -left-[31px] top-1 h-3 w-3 rounded-full border-2 border-background bg-primary" />
          <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">{ev.year}</p>
          <h4 className="mt-1 font-semibold">{ev.title}</h4>
          <p className="mt-1 text-sm text-foreground/80">{ev.description}</p>
        </li>
      ))}
    </ol>
  );
}