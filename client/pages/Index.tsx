import { useMemo, useState } from "react";
import {
  ChefHat,
  Fish,
  Gem,
  Hammer,
  Heart,
  Landmark,
  Leaf,
  Pickaxe,
  RotateCcw,
  Search,
  Sprout,
  Trophy,
  Warehouse,
  Wheat,
  type LucideIcon,
} from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";
import { Progress } from "@/components/ui/progress";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useChecklistProgress } from "@/hooks/use-checklist-progress";
import {
  CHECKLIST_CATEGORIES,
  TOTAL_TASKS,
} from "@/lib/stardew-checklist";

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

export default function Index() {
  const { checked, toggle, setMany, reset } = useChecklistProgress();
  const [query, setQuery] = useState("");

  const completedCount = useMemo(
    () => Object.values(checked).filter(Boolean).length,
    [checked],
  );
  const overallPercent = Math.round((completedCount / TOTAL_TASKS) * 100);

  const filteredCategories = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return CHECKLIST_CATEGORIES;
    return CHECKLIST_CATEGORIES.map((category) => ({
      ...category,
      items: category.items.filter((item) =>
        item.label.toLowerCase().includes(q),
      ),
    })).filter((category) => category.items.length > 0);
  }, [query]);

  return (
    <div className="min-h-screen pb-24">
      <header className="border-b border-border/70 bg-card/70 backdrop-blur-sm sticky top-0 z-20">
        <div className="container flex flex-col gap-4 py-5 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-3">
            <div className="grid h-11 w-11 shrink-0 place-items-center rounded-2xl bg-primary text-primary-foreground shadow-cozy">
              <Sprout className="h-6 w-6" />
            </div>
            <div>
              <h1 className="font-display text-xl font-semibold leading-tight text-foreground sm:text-2xl">
                Checklist da Fazenda
              </h1>
              <p className="text-sm text-muted-foreground">
                Todas as tarefas de Stardew Valley em um só lugar
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="hidden text-right sm:block">
              <p className="font-display text-lg font-semibold text-primary">
                {completedCount}/{TOTAL_TASKS}
              </p>
              <p className="text-xs text-muted-foreground">tarefas concluídas</p>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                if (confirm("Reiniciar todo o progresso do checklist?")) {
                  reset();
                }
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
                {overallPercent}% da Vila explorada
              </h2>
              <p className="mt-2 max-w-md text-sm text-primary-foreground/80">
                Marque cada tarefa conforme você completa habilidades,
                pacotes da Central Comunitária, coleções e relacionamentos
                em Pelican Town.
              </p>
            </div>
            <div className="flex flex-wrap gap-3">
              {CHECKLIST_CATEGORIES.slice(0, 4).map((category) => {
                const done = category.items.filter(
                  (item) => checked[item.id],
                ).length;
                return (
                  <div
                    key={category.id}
                    className="rounded-2xl bg-primary-foreground/10 px-4 py-3 text-center backdrop-blur-sm"
                  >
                    <p className="font-display text-lg font-semibold">
                      {done}/{category.items.length}
                    </p>
                    <p className="text-xs text-primary-foreground/70">
                      {category.title}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>
          <Progress
            value={overallPercent}
            className="mt-6 h-3 bg-primary-foreground/20"
          />
        </section>

        <div className="relative">
          <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Buscar tarefa, item ou morador..."
            className="h-12 rounded-2xl border-border bg-card pl-11 text-base shadow-sm"
          />
        </div>

        <div className="grid gap-6 lg:grid-cols-2">
          {filteredCategories.map((category) => {
            const Icon = ICONS[category.icon] ?? Sprout;
            const doneInCategory = category.items.filter(
              (item) => checked[item.id],
            ).length;
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
                      <p className="text-xs text-muted-foreground">
                        {category.description}
                      </p>
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
                          category.items.map((i) => i.id),
                          doneInCategory !== total,
                        )
                      }
                      className="text-xs font-medium text-muted-foreground underline-offset-2 hover:text-primary hover:underline"
                    >
                      {doneInCategory === total ? "desmarcar tudo" : "marcar tudo"}
                    </button>
                  </div>
                </div>

                <Progress value={percent} className="mt-4 h-2" />

                <ul className="mt-4 max-h-72 space-y-1 overflow-y-auto pr-1">
                  {category.items.map((item) => {
                    const isChecked = !!checked[item.id];
                    return (
                      <li key={item.id}>
                        <label
                          className={cn(
                            "flex cursor-pointer items-center gap-3 rounded-xl px-2 py-1.5 text-sm transition-colors hover:bg-secondary/60",
                            isChecked && "text-muted-foreground",
                          )}
                        >
                          <Checkbox
                            checked={isChecked}
                            onCheckedChange={() => toggle(item.id)}
                          />
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
            <div className="col-span-full rounded-3xl border border-dashed border-border p-10 text-center text-muted-foreground">
              Nenhuma tarefa encontrada para "{query}".
            </div>
          )}
        </div>
      </main>

      <footer className="container mt-10 text-center text-xs text-muted-foreground">
        Feito com carinho para os fazendeiros de Pelican Town · seu progresso
        é salvo automaticamente neste dispositivo.
      </footer>
    </div>
  );
}
