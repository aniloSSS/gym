"use client";

import { useState } from "react";
import { Beef, CalendarCheck, Camera, Flame, Scale } from "lucide-react";
import { EditableField, EditToggle } from "@/components/editable-field";
import { ProgressChart, SessionsChart } from "@/components/charts";
import { MetricCard } from "@/components/metric-card";
import { PageHeading } from "@/components/page-heading";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { dateFromIso, emptyDay, localDateIso, monthSundays, useFitnessStore, weekDates } from "@/lib/fitness-store";

export default function TrackingPage() {
  const { state, updateDay } = useFitnessStore();
  const [editing, setEditing] = useState(false);
  const dates = weekDates();
  const rows = dates.map((date, index) => {
    const day = state.tracking[date] ?? emptyDay(date);
    return {
      date,
      label: `J${index + 1}`,
      weight: day.weight || state.profile.currentWeight,
      protein: day.protein,
      sessions: day.workoutId ? 1 : 0,
      waist: day.waist
    };
  });
  const avgCalories = Math.round(rows.reduce((sum, row) => sum + (state.tracking[row.date]?.calories ?? 0), 0) / rows.length);
  const avgProtein = Math.round(rows.reduce((sum, row) => sum + row.protein, 0) / rows.length);
  const sessions = rows.reduce((sum, row) => sum + row.sessions, 0);
  const today = localDateIso();
  const todayTracking = state.tracking[today] ?? emptyDay(today);
  const sundays = monthSundays();
  const [selectedPhotoDate, setSelectedPhotoDate] = useState(sundays.includes(today) ? today : sundays[0] ?? today);
  const selectedPhotoDay = state.tracking[selectedPhotoDate] ?? emptyDay(selectedPhotoDate);
  const isSunday = dateFromIso(today).getDay() === 0;

  return (
    <>
      <PageHeading
        eyebrow="Suivi progression"
        title="Photos, mesures et progression modifiables."
        description="Entre tes donnees quand tu veux. Pour les photos, colle une URL d'image maintenant, puis Supabase Storage prendra le relais."
      />

      <section className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        <MetricCard label="Calories moyennes" value={`${avgCalories}`} icon={Flame} />
        <MetricCard label="Proteines moyennes" value={`${avgProtein} g`} icon={Beef} />
        <MetricCard label="Seances realisees" value={`${sessions}`} icon={CalendarCheck} />
        <MetricCard label="Poids actuel" value={`${todayTracking.weight || state.profile.currentWeight} kg`} icon={Scale} />
      </section>

      <section className="mt-6 grid gap-4 xl:grid-cols-[1.1fr_.9fr]">
        <Card>
          <CardHeader>
            <CardTitle>Evolution du poids</CardTitle>
          </CardHeader>
          <CardContent>
            <ProgressChart data={rows.map((row) => ({ date: row.label, weight: row.weight, protein: row.protein, sessions: row.sessions }))} />
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Seances realisees</CardTitle>
          </CardHeader>
          <CardContent>
            <SessionsChart data={rows.map((row) => ({ date: row.label, protein: row.protein, sessions: row.sessions }))} />
          </CardContent>
        </Card>
      </section>

      <section className="mt-6 grid gap-4 lg:grid-cols-[.9fr_1.1fr]">
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between gap-3">
              <div>
                <CardTitle>Timeline photos du mois</CardTitle>
                <p className="mt-1 text-sm text-muted-foreground">
                  {isSunday ? "Aujourd'hui est un check photo." : "Chaque dimanche a sa fiche photo pour comparer proprement."}
                </p>
              </div>
              <EditToggle editing={editing} onToggle={() => setEditing((value) => !value)} />
            </div>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="grid gap-2 sm:grid-cols-2">
              {sundays.map((date) => {
                const day = state.tracking[date] ?? emptyDay(date);
                const hasPhoto = Boolean(day.photoBefore || day.photoAfter);
                return (
                  <button
                    type="button"
                    key={date}
                    onClick={() => setSelectedPhotoDate(date)}
                    className={`rounded-md border p-3 text-left text-sm transition-colors ${selectedPhotoDate === date ? "border-primary bg-primary/10" : "border-white/10 bg-white/[0.04] hover:border-primary/50"}`}
                  >
                    <span className="font-medium capitalize">{dateFromIso(date).toLocaleDateString("fr-FR", { weekday: "short", day: "2-digit", month: "short" })}</span>
                    <span className="mt-1 block text-xs text-muted-foreground">{hasPhoto ? "Photo ajoutee" : "A completer"}</span>
                  </button>
                );
              })}
            </div>
            <div className="grid gap-3 sm:grid-cols-2">
              <PhotoField label="Avant" editing={editing} value={selectedPhotoDay.photoBefore} onChange={(value) => updateDay(selectedPhotoDate, { photoBefore: value })} />
              <PhotoField label="Apres" editing={editing} value={selectedPhotoDay.photoAfter} onChange={(value) => updateDay(selectedPhotoDate, { photoAfter: value })} />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <div className="flex items-center justify-between gap-3">
              <CardTitle>Mesures par jour</CardTitle>
              <EditToggle editing={editing} onToggle={() => setEditing((value) => !value)} />
            </div>
          </CardHeader>
          <CardContent className="space-y-3">
            {dates.map((date) => {
              const day = state.tracking[date] ?? emptyDay(date);
              return (
                <div key={date} className="grid gap-2 rounded-md bg-white/[0.04] p-3 text-sm sm:grid-cols-[90px_1fr_1fr]">
                  <span className="font-medium">{new Date(date).toLocaleDateString("fr-FR", { weekday: "short", day: "2-digit" })}</span>
                  <EditableField label="Poids" value={day.weight || ""} suffix="kg" type="number" editing={editing} onChange={(value) => updateDay(date, { weight: Number(value) })} />
                  <EditableField label="Tour taille" value={day.waist || ""} suffix="cm" type="number" editing={editing} onChange={(value) => updateDay(date, { waist: Number(value) })} />
                </div>
              );
            })}
          </CardContent>
        </Card>
      </section>
    </>
  );
}

function PhotoField({
  label,
  editing,
  value,
  onChange
}: {
  label: string;
  editing: boolean;
  value: string;
  onChange: (value: string) => void;
}) {
  return (
    <div className="grid gap-3 sm:grid-cols-[180px_1fr]">
      <div className="flex aspect-[4/5] items-center justify-center overflow-hidden rounded-lg border border-dashed border-white/15 bg-white/[0.04] text-muted-foreground">
        {value ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={value} alt={label} className="h-full w-full object-cover" />
        ) : (
          <div className="text-center">
            <Camera className="mx-auto h-8 w-8" />
            <p className="mt-3 text-sm font-medium">{label}</p>
          </div>
        )}
      </div>
      {editing ? (
        <EditableField
          label={`URL photo ${label.toLowerCase()}`}
          value={value}
          editing={editing}
          onChange={onChange}
          placeholder="https://..."
        />
      ) : (
        <div className="rounded-md border border-white/10 bg-white/[0.04] p-3">
          <p className="text-xs font-medium uppercase text-muted-foreground">Photo {label.toLowerCase()}</p>
          <p className="mt-2 text-sm font-medium">{value ? "Photo ajoutee" : "Aucune photo"}</p>
        </div>
      )}
    </div>
  );
}
