"use client";

import { useState } from "react";
import { Camera } from "lucide-react";
import { EditableField, EditToggle } from "@/components/editable-field";
import { formatDayLabel, MonthCalendar } from "@/components/month-calendar";
import { PageHeading } from "@/components/page-heading";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { dateFromIso, emptyDay, localDateIso, useFitnessStore, Workout } from "@/lib/fitness-store";

export default function CalendarPage() {
  const { state, updateDay } = useFitnessStore();
  const [selectedDate, setSelectedDate] = useState(localDateIso());

  return (
    <>
      <PageHeading
        eyebrow="Calendrier"
        title="Ton mois d'entrainement et de suivi."
        description="Clique sur un jour pour ouvrir sa fiche : objectifs, poids, seance, photos et progression."
      />

      <div className="mb-6">
        <MonthCalendar
          tracking={state.tracking}
          workouts={state.workouts}
          selectedDate={selectedDate}
          onSelectDate={setSelectedDate}
          onChangeWorkout={(date, workoutId) => updateDay(date, { workoutId })}
        />
      </div>

      <DayDetail
        date={selectedDate}
        day={state.tracking[selectedDate] ?? emptyDay(selectedDate)}
        workouts={state.workouts}
        caloriesGoal={state.profile.caloriesGoal}
        proteinGoal={state.profile.proteinGoal}
        onChange={(patch) => updateDay(selectedDate, patch)}
      />
    </>
  );
}

function DayDetail({
  date,
  day,
  workouts,
  caloriesGoal,
  proteinGoal,
  onChange
}: {
  date: string;
  day: ReturnType<typeof emptyDay>;
  workouts: Workout[];
  caloriesGoal: number;
  proteinGoal: number;
  onChange: (patch: Partial<ReturnType<typeof emptyDay>>) => void;
}) {
  const [editing, setEditing] = useState(false);
  const workout = workouts.find((item) => item.id === day.workoutId);
  const isSunday = dateFromIso(date).getDay() === 0;

  return (
    <Card>
      <CardHeader>
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <CardTitle className="capitalize">{formatDayLabel(date)}</CardTitle>
            <p className="mt-1 text-sm text-muted-foreground">
              {isSunday ? "Dimanche photo : note ton poids et ajoute tes photos." : "Fiche de la journee selectionnee."}
            </p>
          </div>
          <EditToggle editing={editing} onToggle={() => setEditing((value) => !value)} />
        </div>
      </CardHeader>
      <CardContent className="grid gap-4 lg:grid-cols-[1fr_.9fr]">
        <div className="grid gap-3 sm:grid-cols-2">
          <EditableField label="Calories" value={day.calories} suffix={`/ ${caloriesGoal} kcal`} type="number" editing={editing} onChange={(value) => onChange({ calories: Number(value) })} />
          <EditableField label="Proteines" value={day.protein} suffix={`/ ${proteinGoal} g`} type="number" editing={editing} onChange={(value) => onChange({ protein: Number(value) })} />
          <EditableField label="Poids" value={day.weight || ""} suffix="kg" type="number" editing={editing} onChange={(value) => onChange({ weight: Number(value) })} />
          <EditableField label="Tour taille" value={day.waist || ""} suffix="cm" type="number" editing={editing} onChange={(value) => onChange({ waist: Number(value) })} />
          <div className="rounded-md border border-white/10 bg-white/[0.04] p-3 sm:col-span-2">
            <p className="text-xs font-medium uppercase text-muted-foreground">Seance</p>
            {editing ? (
              <select
                className="mt-2 h-10 w-full rounded-md border border-white/10 bg-background px-3 text-sm outline-none"
                value={day.workoutId}
                onChange={(event) => onChange({ workoutId: event.target.value })}
              >
                <option value="">Repos</option>
                {workouts.map((item) => (
                  <option key={item.id} value={item.id}>
                    Seance {item.code} - {item.title}
                  </option>
                ))}
              </select>
            ) : (
              <p className="mt-2 text-lg font-semibold">{workout ? `Seance ${workout.code} - ${workout.title}` : "Repos"}</p>
            )}
          </div>
        </div>

        <div className="grid gap-3 sm:grid-cols-2">
          <PhotoPreview label="Avant" value={day.photoBefore} editing={editing} onChange={(value) => onChange({ photoBefore: value })} />
          <PhotoPreview label="Apres" value={day.photoAfter} editing={editing} onChange={(value) => onChange({ photoAfter: value })} />
        </div>
      </CardContent>
    </Card>
  );
}

function PhotoPreview({
  label,
  value,
  editing,
  onChange
}: {
  label: string;
  value: string;
  editing: boolean;
  onChange: (value: string) => void;
}) {
  return (
    <div className="space-y-2">
      <div className="flex aspect-[4/5] items-center justify-center overflow-hidden rounded-lg border border-white/10 bg-white/[0.04] text-sm text-muted-foreground">
        {value ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={value} alt={label} className="h-full w-full object-cover" />
        ) : (
          <div className="text-center">
            <Camera className="mx-auto h-7 w-7" />
            <p className="mt-2">{label} - aucune photo</p>
          </div>
        )}
      </div>
      {editing && (
        <Input value={value} onChange={(event) => onChange(event.target.value)} placeholder={`URL photo ${label.toLowerCase()}`} />
      )}
    </div>
  );
}
