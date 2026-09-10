import { useMemo, useState } from "react";
import { CalendarDays, Fish, Gift, Heart, PackageCheck } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  AQUATIC_OVERPOPULATION_BY_SEASON,
  CALENDAR_BIRTHDAYS,
  CALENDAR_EVENTS,
  MARRIAGE_CANDIDATES,
  QUESTS,
  SEASON_HIGHLIGHTS,
  SEASONS,
  type CalendarEvent,
  type QuestTask,
  type Season,
} from "@/lib/stardew-guide";
import { cn } from "@/lib/utils";

const WEEKDAYS = ["Seg", "Ter", "Qua", "Qui", "Sex", "Sáb", "Dom"];

const SEASON_EMOJI: Record<Exclude<Season, "Qualquer estação">, string> = {
  Primavera: "🌷",
  Verão: "☀️",
  Outono: "🍂",
  Inverno: "❄️",
};

type YearChoice = 1 | 2 | "3+";

type ProgressMap = Record<string, boolean>;

interface SeasonCalendarProps {
  query: string;
  checked: ProgressMap;
  toggle: (id: string) => void;
}

function normalize(value: string) {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase();
}

function matchesQuery(values: Array<string | undefined>, query: string) {
  if (!query) return true;
  return normalize(values.filter(Boolean).join(" ")).includes(normalize(query));
}

function matchesYear(year: number | undefined, selectedYear: YearChoice) {
  if (!year) return true;
  if (selectedYear === "3+") return year >= 3;
  return year === selectedYear;
}

function eventOccursOnDay(event: CalendarEvent, day: number) {
  return day >= event.startDay && day <= (event.endDay ?? event.startDay);
}

function CalendarEventDetail({
  event,
  checked,
  onToggle,
}: {
  event: CalendarEvent;
  checked: boolean;
  onToggle: () => void;
}) {
  const content = (
    <div className="min-w-0 flex-1">
      <div className="flex flex-wrap items-center gap-2">
        <p className={cn("font-semibold text-foreground", checked && "text-muted-foreground line-through")}>
          {event.title}
        </p>
        <Badge variant="outline">{event.label}</Badge>
        {event.year && <Badge variant="secondary">Ano {event.year}</Badge>}
      </div>
      {event.description && (
        <p className="mt-1 text-xs leading-relaxed text-muted-foreground">{event.description}</p>
      )}
    </div>
  );

  if (!event.trackable) {
    return <div className="flex gap-3 rounded-xl bg-secondary/45 p-3">{content}</div>;
  }

  return (
    <label className="flex cursor-pointer gap-3 rounded-xl bg-secondary/45 p-3 transition-colors hover:bg-secondary/70">
      <Checkbox checked={checked} onCheckedChange={onToggle} className="mt-0.5" />
      {content}
    </label>
  );
}

function CalendarQuestDetail({
  quest,
  checked,
  onToggle,
}: {
  quest: QuestTask;
  checked: boolean;
  onToggle: () => void;
}) {
  return (
    <label className="flex cursor-pointer gap-3 rounded-xl border border-border bg-card p-3 transition-colors hover:bg-secondary/35">
      <Checkbox checked={checked} onCheckedChange={onToggle} className="mt-0.5" />
      <div className="min-w-0 flex-1">
        <div className="flex flex-wrap items-center gap-2">
          <p className={cn("font-semibold text-foreground", checked && "text-muted-foreground line-through")}>
            {quest.title}
          </p>
          <Badge variant="secondary">{quest.kind}</Badge>
          {quest.year && <Badge variant="outline">Ano {quest.year}</Badge>}
        </div>
        <p className="mt-1 text-xs leading-relaxed text-muted-foreground">{quest.objective}</p>
        <div className="mt-2 flex flex-wrap gap-x-3 gap-y-1 text-xs text-muted-foreground">
          {quest.npc && <span>👤 {quest.npc}</span>}
          {quest.item && <span>📦 {quest.item}</span>}
          {quest.reward && <span>🏆 {quest.reward}</span>}
        </div>
        {quest.note && (
          <p className="mt-2 rounded-lg bg-secondary/60 px-2.5 py-2 text-xs text-secondary-foreground">
            💡 {quest.note}
          </p>
        )}
      </div>
    </label>
  );
}

export function SeasonCalendar({ query, checked, toggle }: SeasonCalendarProps) {
  const [selectedSeason, setSelectedSeason] = useState<Exclude<Season, "Qualquer estação">>("Primavera");
  const [selectedYear, setSelectedYear] = useState<YearChoice>(1);
  const [selectedDay, setSelectedDay] = useState(1);

  const calendarDays = useMemo(() => {
    return Array.from({ length: 28 }, (_, index) => {
      const day = index + 1;
      const events = CALENDAR_EVENTS.filter(
        (event) =>
          event.season === selectedSeason &&
          eventOccursOnDay(event, day) &&
          matchesYear(event.year, selectedYear) &&
          matchesQuery([event.title, event.description, event.label], query),
      );
      const birthdays = CALENDAR_BIRTHDAYS.filter((birthday) => {
        const candidate = birthday.marriageCandidateId
          ? MARRIAGE_CANDIDATES.find((item) => item.id === birthday.marriageCandidateId)
          : undefined;

        return (
          birthday.season === selectedSeason &&
          birthday.day === day &&
          matchesQuery(
            [
              birthday.name,
              "aniversário",
              "presente",
              birthday.marriageCandidateId ? "casamento" : undefined,
              candidate?.lovedGifts.join(" "),
              candidate?.giftTip,
            ],
            query,
          )
        );
      });
      const quests = QUESTS.filter(
        (quest) =>
          quest.season === selectedSeason &&
          quest.day === day &&
          matchesYear(quest.year, selectedYear) &&
          matchesQuery(
            [quest.title, quest.kind, quest.npc, quest.item, quest.objective, quest.reward, quest.note],
            query,
          ),
      );

      return { day, events, birthdays, quests };
    });
  }, [query, selectedSeason, selectedYear]);

  const selected = calendarDays.find((entry) => entry.day === selectedDay) ?? calendarDays[0];

  const undatedQuests = useMemo(
    () =>
      QUESTS.filter(
        (quest) =>
          quest.season === selectedSeason &&
          !quest.day &&
          matchesYear(quest.year, selectedYear) &&
          matchesQuery(
            [quest.title, quest.kind, quest.npc, quest.item, quest.objective, quest.reward, quest.note],
            query,
          ),
      ),
    [query, selectedSeason, selectedYear],
  );

  const selectedDayHasContent =
    selected.events.length > 0 || selected.birthdays.length > 0 || selected.quests.length > 0;

  return (
    <div className="space-y-6">
      <section className="rounded-3xl border border-border bg-card p-5 shadow-sm sm:p-6">
        <div className="flex flex-col gap-5 xl:flex-row xl:items-center xl:justify-between">
          <div className="flex items-start gap-3">
            <div className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-secondary text-secondary-foreground">
              <CalendarDays className="h-5 w-5" />
            </div>
            <div>
              <h3 className="font-display text-xl font-semibold">Calendário da fazenda</h3>
              <p className="mt-1 max-w-2xl text-sm text-muted-foreground">
                Os 28 dias da estação reúnem festivais, aniversários e missões com data fixa. Clique em um dia para abrir os detalhes e marcar o que já fez.
              </p>
            </div>
          </div>

          <div className="flex flex-wrap gap-2">
            {([1, 2, "3+"] as YearChoice[]).map((year) => (
              <Button
                key={String(year)}
                type="button"
                size="sm"
                variant={selectedYear === year ? "default" : "outline"}
                onClick={() => setSelectedYear(year)}
                className="rounded-xl"
              >
                Ano {year}
              </Button>
            ))}
          </div>
        </div>

        <div className="mt-5 grid grid-cols-2 gap-2 sm:grid-cols-4 xl:grid-cols-4">
          {SEASONS.map((season) => (
            <Button
              key={season}
              type="button"
              variant={selectedSeason === season ? "default" : "outline"}
              onClick={() => {
                setSelectedSeason(season);
                setSelectedDay(1);
              }}
              className="justify-start rounded-xl"
            >
              <span className="mr-2">{SEASON_EMOJI[season]}</span>
              {season}
            </Button>
          ))}
        </div>
      </section>

      <section className="overflow-hidden rounded-3xl border border-border bg-card shadow-sm">
        <div className="border-b border-border px-5 py-4 sm:px-6">
          <div className="flex flex-col gap-1 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Ano {selectedYear}</p>
              <h3 className="font-display text-2xl font-semibold">
                {SEASON_EMOJI[selectedSeason]} {selectedSeason}
              </h3>
            </div>
            <p className="text-sm text-muted-foreground">4 semanas · 28 dias</p>
          </div>
        </div>

        <div className="hidden grid-cols-7 border-b border-border bg-muted/30 sm:grid">
          {WEEKDAYS.map((weekday) => (
            <div key={weekday} className="px-3 py-2 text-center text-xs font-semibold uppercase tracking-wide text-muted-foreground">
              {weekday}
            </div>
          ))}
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-7">
          {calendarDays.map(({ day, events, birthdays, quests }) => {
            const hasContent = events.length > 0 || birthdays.length > 0 || quests.length > 0;
            const isSelected = selectedDay === day;
            const completedQuests = quests.filter((quest) => checked[quest.id]).length;

            return (
              <button
                key={day}
                type="button"
                onClick={() => setSelectedDay(day)}
                className={cn(
                  "min-h-36 border-b border-r border-border p-3 text-left transition-colors hover:bg-secondary/35 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-inset",
                  isSelected && "bg-secondary/55",
                  query && !hasContent && "opacity-40",
                )}
              >
                <div className="flex items-start justify-between gap-2">
                  <span className={cn("grid h-8 w-8 place-items-center rounded-full text-sm font-bold", isSelected ? "bg-primary text-primary-foreground" : "bg-muted text-foreground")}>
                    {day}
                  </span>
                  {quests.length > 0 && (
                    <span className="text-[11px] font-medium text-muted-foreground">
                      {completedQuests}/{quests.length} ✓
                    </span>
                  )}
                </div>

                <div className="mt-3 space-y-1.5">
                  {events.slice(0, 2).map((event) => (
                    <div key={event.id} className="truncate rounded-lg bg-primary/10 px-2 py-1 text-[11px] font-medium text-primary">
                      🎉 {event.title}
                    </div>
                  ))}
                  {birthdays.slice(0, 2).map((birthday) => (
                    <div key={birthday.id} className="truncate rounded-lg bg-secondary px-2 py-1 text-[11px] font-medium text-secondary-foreground">
                      🎂 {birthday.name}{birthday.marriageCandidateId ? " 💍" : ""}
                    </div>
                  ))}
                  {quests.slice(0, 2).map((quest) => (
                    <div
                      key={quest.id}
                      className={cn(
                        "truncate rounded-lg border border-border px-2 py-1 text-[11px] font-medium",
                        checked[quest.id] && "text-muted-foreground line-through",
                      )}
                    >
                      📦 {quest.title}
                    </div>
                  ))}
                  {events.length + birthdays.length + quests.length > 6 && (
                    <p className="px-1 text-[10px] text-muted-foreground">+ mais lembretes</p>
                  )}
                </div>
              </button>
            );
          })}
        </div>
      </section>

      <div className="grid gap-6 xl:grid-cols-[1.45fr_0.75fr]">
        <section className="rounded-3xl border border-border bg-card p-5 shadow-sm sm:p-6">
          <div className="flex items-center justify-between gap-3">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                {selectedSeason} · dia {selectedDay}
              </p>
              <h3 className="mt-1 font-display text-xl font-semibold">O que fazer neste dia</h3>
            </div>
            <Badge variant="outline">
              {selected.events.length + selected.birthdays.length + selected.quests.length} lembretes
            </Badge>
          </div>

          <div className="mt-5 space-y-5">
            {selected.events.length > 0 && (
              <div>
                <h4 className="mb-2 flex items-center gap-2 text-sm font-semibold">
                  <CalendarDays className="h-4 w-4 text-primary" /> Eventos
                </h4>
                <div className="space-y-2">
                  {selected.events.map((event) => (
                    <CalendarEventDetail
                      key={event.id}
                      event={event}
                      checked={!!checked[`calendar-event-${event.id}`]}
                      onToggle={() => toggle(`calendar-event-${event.id}`)}
                    />
                  ))}
                </div>
              </div>
            )}

            {selected.birthdays.length > 0 && (
              <div>
                <h4 className="mb-2 flex items-center gap-2 text-sm font-semibold">
                  <Gift className="h-4 w-4 text-primary" /> Aniversários
                </h4>
                <div className="space-y-2">
                  {selected.birthdays.map((birthday) => {
                    const candidate = birthday.marriageCandidateId
                      ? MARRIAGE_CANDIDATES.find((item) => item.id === birthday.marriageCandidateId)
                      : undefined;
                    const progressId = `calendar-birthday-${birthday.id}`;
                    const isDone = !!checked[progressId];

                    return (
                      <label key={birthday.id} className="flex cursor-pointer gap-3 rounded-xl bg-secondary/45 p-3 transition-colors hover:bg-secondary/70">
                        <Checkbox checked={isDone} onCheckedChange={() => toggle(progressId)} className="mt-0.5" />
                        <div className="min-w-0 flex-1">
                          <div className="flex flex-wrap items-center gap-2">
                            <p className={cn("font-semibold", isDone && "text-muted-foreground line-through")}>
                              Dar presente de aniversário para {birthday.name}
                            </p>
                            {candidate && (
                              <Badge className="gap-1">
                                <Heart className="h-3 w-3" /> candidato(a) a casamento
                              </Badge>
                            )}
                          </div>
                          <p className="mt-1 text-xs text-muted-foreground">
                            Presentes dados no aniversário recebem um bônus muito maior de amizade.
                          </p>
                          {candidate && (
                            <p className="mt-2 text-xs text-muted-foreground">
                              ❤️ Presentes amados: {candidate.lovedGifts.slice(0, 4).join(", ")}
                            </p>
                          )}
                        </div>
                      </label>
                    );
                  })}
                </div>
              </div>
            )}

            {selected.quests.length > 0 && (
              <div>
                <h4 className="mb-2 flex items-center gap-2 text-sm font-semibold">
                  <PackageCheck className="h-4 w-4 text-primary" /> Missões e entregas
                </h4>
                <div className="space-y-2">
                  {selected.quests.map((quest) => (
                    <CalendarQuestDetail
                      key={quest.id}
                      quest={quest}
                      checked={!!checked[quest.id]}
                      onToggle={() => toggle(quest.id)}
                    />
                  ))}
                </div>
              </div>
            )}

            {!selectedDayHasContent && (
              <div className="rounded-2xl border border-dashed border-border p-8 text-center">
                <p className="font-medium text-foreground">Nenhum compromisso fixo neste dia.</p>
                <p className="mt-1 text-sm text-muted-foreground">
                  Bom momento para cuidar da fazenda, pescar, minerar ou visitar moradores.
                </p>
              </div>
            )}
          </div>
        </section>

        <aside className="space-y-4">
          <section className="rounded-3xl border border-border bg-card p-5 shadow-sm">
            <h3 className="font-display text-lg font-semibold">📦 Preparar nesta estação</h3>
            <ul className="mt-3 space-y-2 text-sm text-muted-foreground">
              {SEASON_HIGHLIGHTS[selectedSeason].prepare.map((tip) => (
                <li key={tip}>• {tip}</li>
              ))}
            </ul>
          </section>

          {undatedQuests.length > 0 && (
            <section className="rounded-3xl border border-border bg-card p-5 shadow-sm">
              <h3 className="font-display text-lg font-semibold">📝 Ao longo da estação</h3>
              <p className="mt-1 text-xs text-muted-foreground">Missões desta estação que não possuem um dia fixo.</p>
              <div className="mt-3 space-y-2">
                {undatedQuests.map((quest) => (
                  <CalendarQuestDetail
                    key={quest.id}
                    quest={quest}
                    checked={!!checked[quest.id]}
                    onToggle={() => toggle(quest.id)}
                  />
                ))}
              </div>
            </section>
          )}

          <section className="rounded-3xl border border-border bg-card p-5 shadow-sm">
            <div className="flex items-center gap-2">
              <Fish className="h-4 w-4 text-primary" />
              <h3 className="font-display text-lg font-semibold">Superpopulação Aquática</h3>
            </div>
            <p className="mt-2 text-xs leading-relaxed text-muted-foreground">
              Se o pedido especial de Demetrius aparecer, estes peixes podem ser solicitados nesta estação.
            </p>
            <div className="mt-3 flex flex-wrap gap-2">
              {AQUATIC_OVERPOPULATION_BY_SEASON[selectedSeason].map((fish) => (
                <Badge key={fish} variant="outline">{fish}</Badge>
              ))}
            </div>
          </section>
        </aside>
      </div>
    </div>
  );
}
