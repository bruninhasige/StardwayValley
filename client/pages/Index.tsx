import { useMemo, useState } from "react";
import {
  CalendarDays,
  ChefHat,
  ClipboardList,
  Fish,
  Gem,
  Gift,
  Hammer,
  Heart,
  Landmark,
  Leaf,
  PackageCheck,
  Pickaxe,
  RotateCcw,
  Search,
  Sprout,
  Trophy,
  Warehouse,
  Wheat,
  type LucideIcon,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import { useChecklistProgress } from "@/hooks/use-checklist-progress";
import { CHECKLIST_CATEGORIES } from "@/lib/stardew-checklist";
import {
  AQUATIC_OVERPOPULATION_BY_SEASON,
  FRIENDSHIP_MILESTONES,
  FRIENDSHIP_PROGRESS_IDS,
  GUIDE_TASK_IDS,
  MARRIAGE_CANDIDATES,
  QUESTS,
  SEASON_HIGHLIGHTS,
  SEASONS,
  type QuestTask,
  type Season,
} from "@/lib/stardew-guide";
import { cn } from "@/lib/utils";

const ICONS: Record<string, LucideIcon> = {
  landmark: Landmark,
  sprout: Sprout,
  hammer: Hammer,
  warehouse: Warehouse,
  pickaxe: Pickaxe,
  wheat: Wheat,
  leaf: Leaf,
  fish: Fish,
  "chef-hat": ChefHat,
  gem: Gem,
  heart: Heart,
  trophy: Trophy,
};

const SEASON_EMOJI: Record<Exclude<Season, "Qualquer estação">, string> = {
  Primavera: "🌷",
  Verão: "☀️",
  Outono: "🍂",
  Inverno: "❄️",
};

const QUEST_KIND_LABEL: Record<QuestTask["kind"], string> = {
  História: "História",
  Entrega: "Entrega",
  "Pedido Especial": "Pedido especial",
  Desbloqueio: "Desbloqueio",
};

function normalize(value: string) {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase();
}

function questMatches(quest: QuestTask, query: string) {
  if (!query) return true;
  const searchable = [
    quest.title,
    quest.kind,
    quest.season,
    quest.npc ?? "",
    quest.item ?? "",
    quest.objective,
    quest.reward ?? "",
    quest.note ?? "",
  ]
    .map(normalize)
    .join(" ");

  return searchable.includes(normalize(query));
}

function formatQuestDate(quest: QuestTask) {
  const pieces: string[] = [];
  if (quest.day) pieces.push(`dia ${quest.day}`);
  if (quest.year) pieces.push(`ano ${quest.year}`);
  return pieces.length ? pieces.join(" · ") : "sem dia fixo";
}

function QuestCard({
  quest,
  checked,
  onToggle,
}: {
  quest: QuestTask;
  checked: boolean;
  onToggle: () => void;
}) {
  return (
    <article
      className={cn(
        "rounded-2xl border border-border bg-card p-4 shadow-sm transition-colors",
        checked && "bg-secondary/35",
      )}
    >
      <div className="flex items-start gap-3">
        <Checkbox
          checked={checked}
          onCheckedChange={onToggle}
          aria-label={`Marcar ${quest.title}`}
          className="mt-1"
        />
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <h4
              className={cn(
                "font-display font-semibold text-foreground",
                checked && "text-muted-foreground line-through",
              )}
            >
              {quest.title}
            </h4>
            <Badge variant="secondary">{QUEST_KIND_LABEL[quest.kind]}</Badge>
            {(quest.day || quest.year) && (
              <Badge variant="outline">{formatQuestDate(quest)}</Badge>
            )}
          </div>

          <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
            {quest.objective}
          </p>

          <div className="mt-3 flex flex-wrap gap-x-4 gap-y-1 text-xs text-muted-foreground">
            {quest.npc && (
              <span>
                <strong className="text-foreground">NPC:</strong> {quest.npc}
              </span>
            )}
            {quest.item && (
              <span>
                <strong className="text-foreground">Levar:</strong> {quest.item}
              </span>
            )}
            {quest.reward && (
              <span>
                <strong className="text-foreground">Recompensa:</strong>{" "}
                {quest.reward}
              </span>
            )}
          </div>

          {quest.note && (
            <p className="mt-3 rounded-xl bg-secondary/70 px-3 py-2 text-xs text-secondary-foreground">
              💡 {quest.note}
            </p>
          )}
        </div>
      </div>
    </article>
  );
}

export default function Index() {
  const { checked, toggle, setMany, reset } = useChecklistProgress();
  const [query, setQuery] = useState("");

  const baseTaskIds = useMemo(
    () => CHECKLIST_CATEGORIES.flatMap((category) => category.items.map((item) => item.id)),
    [],
  );

  const allProgressIds = useMemo(
    () => Array.from(new Set([...baseTaskIds, ...GUIDE_TASK_IDS, ...FRIENDSHIP_PROGRESS_IDS])),
    [baseTaskIds],
  );

  const completedCount = useMemo(
    () => allProgressIds.filter((id) => checked[id]).length,
    [allProgressIds, checked],
  );
  const totalTasks = allProgressIds.length;
  const overallPercent = totalTasks
    ? Math.round((completedCount / totalTasks) * 100)
    : 0;

  const filteredCategories = useMemo(() => {
    const q = normalize(query.trim());
    return CHECKLIST_CATEGORIES.map((category) => ({
      category,
      visibleItems: q
        ? category.items.filter((item) => normalize(item.label).includes(q))
        : category.items,
    })).filter(({ visibleItems }) => visibleItems.length > 0);
  }, [query]);

  const filteredQuests = useMemo(
    () => QUESTS.filter((quest) => questMatches(quest, query.trim())),
    [query],
  );

  const filteredCandidates = useMemo(() => {
    const q = normalize(query.trim());
    if (!q) return MARRIAGE_CANDIDATES;

    return MARRIAGE_CANDIDATES.filter((candidate) =>
      normalize(
        [
          candidate.name,
          candidate.birthday.season,
          candidate.lovedGifts.join(" "),
          candidate.giftTip ?? "",
        ].join(" "),
      ).includes(q),
    );
  }, [query]);

  return (
    <div className="min-h-screen pb-24">
      <header className="sticky top-0 z-20 border-b border-border/70 bg-card/80 backdrop-blur-sm">
        <div className="container flex flex-col gap-4 py-5 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-3">
            <div className="grid h-11 w-11 shrink-0 place-items-center rounded-2xl bg-primary text-primary-foreground shadow-cozy">
              <Sprout className="h-6 w-6" />
            </div>
            <div>
              <h1 className="font-display text-xl font-semibold leading-tight text-foreground sm:text-2xl">
                Stardew Valley Companion
              </h1>
              <p className="text-sm text-muted-foreground">
                Checklist, estações, missões, presentes e casamento
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="hidden text-right sm:block">
              <p className="font-display text-lg font-semibold text-primary">
                {completedCount}/{totalTasks}
              </p>
              <p className="text-xs text-muted-foreground">objetivos concluídos</p>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                if (confirm("Reiniciar todo o progresso salvo?")) reset();
              }}
              className="gap-2 rounded-xl border-border"
            >
              <RotateCcw className="h-4 w-4" />
              Reiniciar
            </Button>
          </div>
        </div>
      </header>

      <main className="container mt-8 space-y-8">
        <section className="overflow-hidden rounded-3xl border border-border bg-gradient-to-br from-primary to-primary/80 p-6 text-primary-foreground shadow-cozy sm:p-8">
          <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-sm font-semibold uppercase tracking-wide text-primary-foreground/70">
                Progresso geral
              </p>
              <h2 className="mt-1 font-display text-3xl font-semibold sm:text-4xl">
                {overallPercent}% da jornada concluída
              </h2>
              <p className="mt-2 max-w-2xl text-sm text-primary-foreground/80">
                Agora o progresso reúne o checklist original, missões e entregas,
                planejamento por estação e as etapas de amizade e casamento.
              </p>
            </div>
            <div className="grid grid-cols-3 gap-2 text-center">
              <div className="rounded-2xl bg-primary-foreground/10 px-4 py-3 backdrop-blur-sm">
                <p className="font-display text-lg font-semibold">{GUIDE_TASK_IDS.length}</p>
                <p className="text-xs text-primary-foreground/70">missões</p>
              </div>
              <div className="rounded-2xl bg-primary-foreground/10 px-4 py-3 backdrop-blur-sm">
                <p className="font-display text-lg font-semibold">{MARRIAGE_CANDIDATES.length}</p>
                <p className="text-xs text-primary-foreground/70">pretendentes</p>
              </div>
              <div className="rounded-2xl bg-primary-foreground/10 px-4 py-3 backdrop-blur-sm">
                <p className="font-display text-lg font-semibold">4</p>
                <p className="text-xs text-primary-foreground/70">estações</p>
              </div>
            </div>
          </div>
          <Progress value={overallPercent} className="mt-6 h-3 bg-primary-foreground/20" />
        </section>

        <div className="relative">
          <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Buscar tarefa, missão, item, presente ou morador..."
            className="h-12 rounded-2xl border-border bg-card pl-11 text-base shadow-sm"
          />
        </div>

        <Tabs defaultValue="checklist" className="space-y-6">
          <TabsList className="grid h-auto w-full grid-cols-2 gap-2 rounded-2xl bg-muted/70 p-2 lg:grid-cols-4">
            <TabsTrigger value="checklist" className="gap-2 rounded-xl py-2.5">
              <ClipboardList className="h-4 w-4" />
              Checklist geral
            </TabsTrigger>
            <TabsTrigger value="seasons" className="gap-2 rounded-xl py-2.5">
              <CalendarDays className="h-4 w-4" />
              Por estação
            </TabsTrigger>
            <TabsTrigger value="quests" className="gap-2 rounded-xl py-2.5">
              <PackageCheck className="h-4 w-4" />
              Missões & entregas
            </TabsTrigger>
            <TabsTrigger value="friendship" className="gap-2 rounded-xl py-2.5">
              <Gift className="h-4 w-4" />
              Amizade & casamento
            </TabsTrigger>
          </TabsList>

          <TabsContent value="checklist" className="mt-0">
            <div className="grid gap-6 lg:grid-cols-2">
              {filteredCategories.map(({ category, visibleItems }) => {
                const Icon = ICONS[category.icon] ?? Sprout;
                const doneInCategory = category.items.filter((item) => checked[item.id]).length;
                const total = category.items.length;
                const percent = total ? Math.round((doneInCategory / total) * 100) : 0;
                const allDone = total > 0 && doneInCategory === total;

                return (
                  <section
                    key={category.id}
                    className="flex flex-col rounded-3xl border border-border bg-card p-5 shadow-sm transition-shadow hover:shadow-md sm:p-6"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-center gap-3">
                        <div
                          className={cn(
                            "grid h-10 w-10 shrink-0 place-items-center rounded-xl",
                            allDone
                              ? "bg-accent text-accent-foreground"
                              : "bg-secondary text-secondary-foreground",
                          )}
                        >
                          <Icon className="h-5 w-5" />
                        </div>
                        <div>
                          <h3 className="font-display text-lg font-semibold text-foreground">
                            {category.title}
                          </h3>
                          <p className="text-xs text-muted-foreground">{category.description}</p>
                        </div>
                      </div>

                      <div className="text-right">
                        <p className="font-display text-sm font-semibold text-primary">
                          {doneInCategory}/{total}
                        </p>
                        <button
                          type="button"
                          onClick={() =>
                            setMany(
                              category.items.map((item) => item.id),
                              !allDone,
                            )
                          }
                          className="text-xs font-medium text-muted-foreground underline-offset-2 hover:text-primary hover:underline"
                        >
                          {allDone ? "desmarcar tudo" : "marcar tudo"}
                        </button>
                      </div>
                    </div>

                    <Progress value={percent} className="mt-4 h-2" />
                    <ul className="mt-4 max-h-72 space-y-1 overflow-y-auto pr-1">
                      {visibleItems.map((item) => {
                        const isChecked = !!checked[item.id];
                        return (
                          <li key={item.id}>
                            <label
                              className={cn(
                                "flex cursor-pointer items-center gap-3 rounded-xl px-2 py-1.5 text-sm transition-colors hover:bg-secondary/60",
                                isChecked && "text-muted-foreground",
                              )}
                            >
                              <Checkbox checked={isChecked} onCheckedChange={() => toggle(item.id)} />
                              <span
                                className={cn(
                                  isChecked && "line-through decoration-primary/50",
                                )}
                              >
                                {item.label}
                              </span>
                            </label>
                          </li>
                        );
                      })}
                    </ul>
                  </section>
                );
              })}

              {filteredCategories.length === 0 && (
                <EmptySearch query={query} />
              )}
            </div>
          </TabsContent>

          <TabsContent value="seasons" className="mt-0 space-y-6">
            <section className="rounded-3xl border border-border bg-card p-5 shadow-sm sm:p-6">
              <div className="flex items-start gap-3">
                <div className="grid h-10 w-10 place-items-center rounded-xl bg-secondary text-secondary-foreground">
                  <CalendarDays className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="font-display text-xl font-semibold">Planejamento sazonal</h3>
                  <p className="mt-1 text-sm text-muted-foreground">
                    Use esta visão antes de iniciar cada estação para separar itens,
                    lembrar aniversários e não perder missões com data marcada.
                  </p>
                </div>
              </div>
            </section>

            {SEASONS.map((season) => {
              const quests = filteredQuests
                .filter((quest) => quest.season === season)
                .sort((a, b) => (a.day ?? 99) - (b.day ?? 99));
              const birthdays = filteredCandidates
                .filter((candidate) => candidate.birthday.season === season)
                .sort((a, b) => a.birthday.day - b.birthday.day);

              if (query && quests.length === 0 && birthdays.length === 0) return null;

              return (
                <section
                  key={season}
                  className="rounded-3xl border border-border bg-card p-5 shadow-sm sm:p-6"
                >
                  <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                      <h3 className="font-display text-2xl font-semibold">
                        {SEASON_EMOJI[season]} {season}
                      </h3>
                      <p className="text-sm text-muted-foreground">
                        {quests.length} missões desta estação · {birthdays.length} aniversários de pretendentes
                      </p>
                    </div>
                    <Badge variant="outline">Pedidos e presentes</Badge>
                  </div>

                  <div className="mt-5 grid gap-5 xl:grid-cols-[1.4fr_0.8fr]">
                    <div className="space-y-3">
                      <h4 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">
                        Missões com relação à estação
                      </h4>
                      {quests.length > 0 ? (
                        quests.map((quest) => (
                          <QuestCard
                            key={quest.id}
                            quest={quest}
                            checked={!!checked[quest.id]}
                            onToggle={() => toggle(quest.id)}
                          />
                        ))
                      ) : (
                        <p className="rounded-2xl border border-dashed border-border p-4 text-sm text-muted-foreground">
                          Nenhuma missão encontrada nesta estação para a busca atual.
                        </p>
                      )}
                    </div>

                    <div className="space-y-4">
                      <div>
                        <h4 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">
                          Aniversários
                        </h4>
                        <div className="mt-3 space-y-2">
                          {birthdays.map((candidate) => (
                            <div
                              key={candidate.id}
                              className="rounded-2xl bg-secondary/60 p-3"
                            >
                              <div className="flex items-center justify-between gap-2">
                                <p className="font-semibold text-foreground">{candidate.name}</p>
                                <Badge>dia {candidate.birthday.day}</Badge>
                              </div>
                              <p className="mt-2 text-xs text-muted-foreground">
                                ❤️ Sugestão amada: {candidate.lovedGifts.slice(0, 3).join(", ")}
                              </p>
                            </div>
                          ))}
                          {birthdays.length === 0 && (
                            <p className="text-sm text-muted-foreground">Nenhum aniversário encontrado.</p>
                          )}
                        </div>
                      </div>

                      <div className="rounded-2xl border border-border bg-secondary/35 p-4">
                        <h4 className="font-semibold">📅 Datas importantes</h4>
                        <ul className="mt-3 space-y-2 text-xs text-muted-foreground">
                          {SEASON_HIGHLIGHTS[season].festivals.map((event) => (
                            <li key={event}>• {event}</li>
                          ))}
                        </ul>
                      </div>

                      <div className="rounded-2xl border border-border bg-secondary/35 p-4">
                        <h4 className="font-semibold">📦 O que vale preparar</h4>
                        <ul className="mt-3 space-y-2 text-xs text-muted-foreground">
                          {SEASON_HIGHLIGHTS[season].prepare.map((tip) => (
                            <li key={tip}>• {tip}</li>
                          ))}
                        </ul>
                      </div>

                      <div className="rounded-2xl border border-border bg-secondary/35 p-4">
                        <div className="flex items-center gap-2">
                          <Fish className="h-4 w-4 text-primary" />
                          <h4 className="font-semibold">Superpopulação Aquática</h4>
                        </div>
                        <p className="mt-2 text-xs leading-relaxed text-muted-foreground">
                          Se o pedido especial de Demetrius aparecer, estes são os peixes que podem ser solicitados nesta estação:
                        </p>
                        <div className="mt-3 flex flex-wrap gap-2">
                          {AQUATIC_OVERPOPULATION_BY_SEASON[season].map((fish) => (
                            <Badge key={fish} variant="outline">{fish}</Badge>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                </section>
              );
            })}
          </TabsContent>

          <TabsContent value="quests" className="mt-0 space-y-6">
            <section className="grid gap-4 md:grid-cols-3">
              <InfoCard
                icon={ClipboardList}
                title="Precisa-se de Ajuda"
                text="Confira o quadro do Pierre diariamente. As entregas rendem ouro e amizade e podem pedir cultivos, forragem, peixes, minerais ou produtos animais."
              />
              <InfoCard
                icon={PackageCheck}
                title="Pedidos Especiais"
                text="O quadro maior é liberado no Outono do Ano 1. Confira-o às segundas e planeje o prazo antes de aceitar."
              />
              <InfoCard
                icon={Gift}
                title="Entregas contam para amizade"
                text="Quando a missão pede que você entregue um item a um morador, fale com ele e faça a entrega pelo diálogo da missão."
              />
            </section>

            {[...SEASONS, "Qualquer estação" as const].map((season) => {
              const quests = filteredQuests
                .filter((quest) => quest.season === season)
                .sort((a, b) => (a.day ?? 99) - (b.day ?? 99));
              if (quests.length === 0) return null;

              const completed = quests.filter((quest) => checked[quest.id]).length;
              return (
                <section
                  key={season}
                  className="rounded-3xl border border-border bg-card p-5 shadow-sm sm:p-6"
                >
                  <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
                    <div>
                      <h3 className="font-display text-xl font-semibold">
                        {season === "Qualquer estação" ? "🧺" : SEASON_EMOJI[season]} {season}
                      </h3>
                      <p className="text-sm text-muted-foreground">
                        {completed}/{quests.length} concluídas
                      </p>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setMany(quests.map((quest) => quest.id), completed !== quests.length)}
                    >
                      {completed === quests.length ? "Desmarcar grupo" : "Marcar grupo"}
                    </Button>
                  </div>
                  <Progress
                    value={quests.length ? Math.round((completed / quests.length) * 100) : 0}
                    className="mt-4 h-2"
                  />
                  <div className="mt-5 grid gap-3 lg:grid-cols-2">
                    {quests.map((quest) => (
                      <QuestCard
                        key={quest.id}
                        quest={quest}
                        checked={!!checked[quest.id]}
                        onToggle={() => toggle(quest.id)}
                      />
                    ))}
                  </div>
                </section>
              );
            })}

            {filteredQuests.length === 0 && <EmptySearch query={query} />}
          </TabsContent>

          <TabsContent value="friendship" className="mt-0 space-y-6">
            <section className="grid gap-4 md:grid-cols-3">
              <InfoCard
                icon={Gift}
                title="2 presentes por semana"
                text="Mantenha uma rotina de presentes. O aniversário permite um presente extra e é o melhor momento para acelerar a amizade."
              />
              <InfoCard
                icon={Heart}
                title="8 → 10 corações"
                text="Com um pretendente em 8 corações, compre o Buquê no Pierre e entregue para iniciar o namoro e liberar os próximos corações."
              />
              <InfoCard
                icon={Landmark}
                title="Pedido de casamento"
                text="Com 10 corações, casa melhorada e a ponte da praia reparada, compre o Pingente de Sereia do Velho Marinheiro em um dia chuvoso."
              />
            </section>

            <section className="rounded-3xl border border-border bg-card p-5 shadow-sm sm:p-6">
              <div className="flex items-start gap-3">
                <div className="grid h-10 w-10 place-items-center rounded-xl bg-secondary text-secondary-foreground">
                  <Heart className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="font-display text-xl font-semibold">Roteiro do casamento</h3>
                  <p className="mt-1 text-sm text-muted-foreground">
                    Acompanhe cada pretendente individualmente. O progresso abaixo também fica salvo no navegador.
                  </p>
                </div>
              </div>
            </section>

            <div className="grid gap-6 lg:grid-cols-2">
              {filteredCandidates.map((candidate) => {
                const milestoneIds = FRIENDSHIP_MILESTONES.map(
                  (milestone) => `friendship-${candidate.id}-${milestone.key}`,
                );
                const done = milestoneIds.filter((id) => checked[id]).length;
                const percent = Math.round((done / milestoneIds.length) * 100);

                return (
                  <section
                    key={candidate.id}
                    className="rounded-3xl border border-border bg-card p-5 shadow-sm sm:p-6"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <div className="flex flex-wrap items-center gap-2">
                          <h3 className="font-display text-xl font-semibold">{candidate.name}</h3>
                          <Badge variant="outline">
                            🎂 {candidate.birthday.day} de {candidate.birthday.season}
                          </Badge>
                        </div>
                        <p className="mt-1 text-sm text-muted-foreground">
                          {done}/{milestoneIds.length} etapas concluídas
                        </p>
                      </div>
                      <span className="font-display text-lg font-semibold text-primary">{percent}%</span>
                    </div>

                    <Progress value={percent} className="mt-4 h-2" />

                    <div className="mt-5">
                      <div className="flex items-center gap-2">
                        <Gift className="h-4 w-4 text-primary" />
                        <h4 className="text-sm font-semibold">Presentes amados</h4>
                      </div>
                      <div className="mt-3 flex flex-wrap gap-2">
                        {candidate.lovedGifts.map((gift) => (
                          <Badge key={gift} variant="secondary">{gift}</Badge>
                        ))}
                      </div>
                      {candidate.giftTip && (
                        <p className="mt-3 rounded-xl bg-secondary/60 px-3 py-2 text-xs text-muted-foreground">
                          💡 {candidate.giftTip}
                        </p>
                      )}
                    </div>

                    <div className="mt-5 border-t border-border pt-4">
                      <h4 className="mb-2 text-sm font-semibold">Etapas</h4>
                      <div className="grid gap-1 sm:grid-cols-2">
                        {FRIENDSHIP_MILESTONES.map((milestone) => {
                          const id = `friendship-${candidate.id}-${milestone.key}`;
                          const isChecked = !!checked[id];
                          return (
                            <label
                              key={id}
                              className={cn(
                                "flex cursor-pointer items-center gap-2 rounded-xl px-2 py-2 text-sm hover:bg-secondary/60",
                                isChecked && "text-muted-foreground",
                              )}
                            >
                              <Checkbox checked={isChecked} onCheckedChange={() => toggle(id)} />
                              <span className={cn(isChecked && "line-through")}>{milestone.label}</span>
                            </label>
                          );
                        })}
                      </div>
                    </div>
                  </section>
                );
              })}

              {filteredCandidates.length === 0 && <EmptySearch query={query} />}
            </div>
          </TabsContent>
        </Tabs>
      </main>

      <footer className="container mt-10 text-center text-xs text-muted-foreground">
        Dados de missões, amizade e casamento organizados com base na Stardew Valley Wiki ·
        seu progresso continua salvo automaticamente neste dispositivo.
      </footer>
    </div>
  );
}

function InfoCard({
  icon: Icon,
  title,
  text,
}: {
  icon: LucideIcon;
  title: string;
  text: string;
}) {
  return (
    <article className="rounded-3xl border border-border bg-card p-5 shadow-sm">
      <div className="flex items-center gap-3">
        <div className="grid h-9 w-9 place-items-center rounded-xl bg-secondary text-secondary-foreground">
          <Icon className="h-4 w-4" />
        </div>
        <h3 className="font-display font-semibold">{title}</h3>
      </div>
      <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{text}</p>
    </article>
  );
}

function EmptySearch({ query }: { query: string }) {
  return (
    <div className="col-span-full rounded-3xl border border-dashed border-border p-10 text-center text-muted-foreground">
      Nenhum resultado encontrado para “{query}”.
    </div>
  );
}
