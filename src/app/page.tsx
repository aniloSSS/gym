"use client";

import { useState } from "react";
import { CalendarDays, CheckCircle2, Dumbbell, Flame, Scale, Search } from "lucide-react";
import { EditableField, EditToggle } from "@/components/editable-field";
import { NutritionChart } from "@/components/charts";
import { MetricCard } from "@/components/metric-card";
import { PageHeading } from "@/components/page-heading";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { dateFromIso, emptyDay, localDateIso, useFitnessStore, weekDates } from "@/lib/fitness-store";
import { progressValue } from "@/lib/utils";

export default function DashboardPage() {
  const { state, updateDay } = useFitnessStore();
  const [editing, setEditing] = useState(false);
  const today = localDateIso();
  const todayLabel = dateFromIso(today).toLocaleDateString("fr-FR", {
    weekday: "long",
    day: "2-digit",
    month: "long",
    year: "numeric"
  });
  const selected = state.tracking[today] ?? emptyDay(today);
  const workout = state.workouts.find((item) => item.id === selected.workoutId);
  const calorieProgress = progressValue(selected.calories, state.profile.caloriesGoal);
  const proteinProgress = progressValue(selected.protein, state.profile.proteinGoal);
  const week = weekDates().map((date) => {
    const day = state.tracking[date] ?? emptyDay(date);
    return {
      day: new Date(date).toLocaleDateString("fr-FR", { weekday: "short" }),
      calories: day.calories,
      protein: day.protein
    };
  });

  return (
    <>
      <PageHeading
        eyebrow="Dashboard"
        title="Ton suivi du jour, modifiable en 10 secondes."
        description="Entre tes calories, proteines, poids et choisis ta seance du jour. Tout est sauvegarde localement."
      />

      <div className="mb-5 flex flex-wrap items-center justify-between gap-3 rounded-lg border border-white/10 bg-white/[0.04] px-4 py-3">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-md bg-primary/12 text-primary">
            <CalendarDays className="h-5 w-5" />
          </div>
          <div>
            <p className="text-xs font-medium uppercase text-muted-foreground">Aujourd&apos;hui</p>
            <p className="text-sm font-semibold capitalize sm:text-base">{todayLabel}</p>
          </div>
        </div>
        <p className="text-sm text-muted-foreground">{selected.validated ? "Journee validee" : "Journee a completer"}</p>
      </div>

      <section className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        <MetricCard label="Calories" value={`${selected.calories} / ${state.profile.caloriesGoal}`} unit="kcal" icon={Flame} />
        <MetricCard label="Proteines" value={`${selected.protein} / ${state.profile.proteinGoal}`} unit="g" icon={Search} />
        <MetricCard label="Poids actuel" value={`${selected.weight || state.profile.currentWeight}`} unit="kg" icon={Scale} />
        <MetricCard label="Seance" value={workout?.code ?? "-"} unit="aujourd'hui" icon={Dumbbell} />
      </section>

      <section className="mt-6 grid gap-4 xl:grid-cols-[1.1fr_.9fr]">
        <Card>
          <CardHeader>
            <CardTitle>Progression nutrition</CardTitle>
            <CardDescription>Calories entrees sur la semaine</CardDescription>
          </CardHeader>
          <CardContent>
            <NutritionChart data={week} />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <div className="flex items-center justify-between gap-3">
              <div>
                <CardTitle>Saisie du jour</CardTitle>
                <CardDescription>Lecture claire, modification au stylo</CardDescription>
              </div>
              <EditToggle editing={editing} onToggle={() => setEditing((value) => !value)} />
            </div>
          </CardHeader>
          <CardContent className="space-y-5">
            <div className="grid grid-cols-2 gap-3">
              <EditableField
                label="Calories"
                value={selected.calories}
                suffix="kcal"
                editing={editing}
                type="number"
                onChange={(value) => updateDay(today, { calories: Number(value) })}
              />
              <EditableField
                label="Proteines"
                value={selected.protein}
                suffix="g"
                editing={editing}
                type="number"
                onChange={(value) => updateDay(today, { protein: Number(value) })}
              />
              <EditableField
                label="Poids"
                value={selected.weight}
                suffix="kg"
                editing={editing}
                type="number"
                onChange={(value) => updateDay(today, { weight: Number(value) })}
              />
              <EditableField
                label="Tour de taille"
                value={selected.waist}
                suffix="cm"
                editing={editing}
                type="number"
                onChange={(value) => updateDay(today, { waist: Number(value) })}
              />
            </div>

            <div>
              <label className="mb-2 block text-sm text-muted-foreground">Seance prevue aujourd&apos;hui</label>
              {editing ? (
                <select
                  className="h-10 w-full rounded-md border border-white/10 bg-white/[0.04] px-3 text-sm outline-none"
                  value={selected.workoutId}
                  onChange={(event) => updateDay(today, { workoutId: event.target.value })}
                >
                  <option value="">Repos / aucune seance</option>
                  {state.workouts.map((item) => (
                    <option key={item.id} value={item.id}>
                      Seance {item.code} - {item.title}
                    </option>
                  ))}
                </select>
              ) : (
                <div className="rounded-md border border-white/10 bg-white/[0.04] p-3 font-medium">
                  {workout ? `Seance ${workout.code} - ${workout.title}` : "Repos / aucune seance"}
                </div>
              )}
            </div>

            <div className="space-y-4">
              <Progress value={calorieProgress} />
              <Progress value={proteinProgress} indicatorClassName="bg-accent" />
            </div>

            <Button className="w-full" onClick={() => updateDay(today, { validated: !selected.validated })}>
              <CheckCircle2 className="h-4 w-4" />
              {selected.validated ? "Journee validee" : "Valider ma journee"}
            </Button>
          </CardContent>
        </Card>
      </section>
    </>
  );
}
