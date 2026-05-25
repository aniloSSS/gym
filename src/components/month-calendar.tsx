"use client";

import { Camera, Dumbbell } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { dateFromIso, DayTracking, emptyDay, localDateIso, Workout } from "@/lib/fitness-store";
import { cn } from "@/lib/utils";

const weekdays = ["Lun", "Mar", "Mer", "Jeu", "Ven", "Sam", "Dim"];

export function MonthCalendar({
  tracking,
  workouts,
  selectedDate,
  onSelectDate,
  onChangeWorkout
}: {
  tracking: Record<string, DayTracking>;
  workouts: Workout[];
  selectedDate: string;
  onSelectDate: (date: string) => void;
  onChangeWorkout: (date: string, workoutId: string) => void;
}) {
  const today = new Date();
  const monthLabel = today.toLocaleDateString("fr-FR", { month: "long", year: "numeric" });
  const days = monthGrid(today);

  return (
    <Card>
      <CardHeader>
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <CardTitle className="capitalize">{monthLabel}</CardTitle>
            <p className="mt-1 text-sm text-muted-foreground">
              Planifie tes seances sur le mois. Chaque dimanche est reserve au check photo.
            </p>
          </div>
          <Badge className="text-primary">
            <Camera className="mr-1 h-3.5 w-3.5" />
            Photo chaque dimanche
          </Badge>
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-7 gap-1 pb-2 text-center text-xs font-medium text-muted-foreground">
          {weekdays.map((day) => (
            <span key={day}>{day}</span>
          ))}
        </div>
        <div className="grid grid-cols-7 gap-2">
          {days.map((day) => {
            const isCurrentMonth = day.getMonth() === today.getMonth();
            const iso = localDateIso(day);
            const data = tracking[iso] ?? emptyDay(iso);
            const workout = workouts.find((item) => item.id === data.workoutId);
            const isSunday = day.getDay() === 0;
            const isToday = iso === localDateIso(today);
            const selected = iso === selectedDate;

            return (
              <button
                type="button"
                key={iso}
                onClick={() => onSelectDate(iso)}
                className={cn(
                  "min-h-[118px] rounded-md border border-white/10 bg-white/[0.04] p-2 text-left transition-colors hover:border-primary/50 hover:bg-white/[0.07]",
                  !isCurrentMonth && "opacity-35",
                  isToday && "border-primary/70 bg-primary/10",
                  selected && "ring-2 ring-primary/60"
                )}
              >
                <div className="flex items-center justify-between gap-1">
                  <span className="text-sm font-semibold">{day.getDate()}</span>
                  {isSunday && <Camera className="h-4 w-4 text-accent" />}
                </div>
                <select
                  className="mt-3 h-8 w-full rounded-md border border-white/10 bg-background px-1.5 text-xs outline-none"
                  value={data.workoutId}
                  onClick={(event) => event.stopPropagation()}
                  onChange={(event) => onChangeWorkout(iso, event.target.value)}
                >
                  <option value="">Repos</option>
                  {workouts.map((item) => (
                    <option key={item.id} value={item.id}>
                      {item.code}
                    </option>
                  ))}
                </select>
                <div className="mt-2 min-h-8 text-[11px] text-muted-foreground">
                  {workout ? (
                    <span className="inline-flex items-center gap-1 text-primary">
                      <Dumbbell className="h-3 w-3" />
                      {workout.title}
                    </span>
                  ) : isSunday ? (
                    "Photo progression"
                  ) : (
                    "Repos"
                  )}
                </div>
              </button>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}

export function formatDayLabel(iso: string) {
  return dateFromIso(iso).toLocaleDateString("fr-FR", {
    weekday: "long",
    day: "2-digit",
    month: "long",
    year: "numeric"
  });
}

function monthGrid(date: Date) {
  const first = new Date(date.getFullYear(), date.getMonth(), 1);
  const start = new Date(first);
  const weekday = first.getDay() || 7;
  start.setDate(first.getDate() - weekday + 1);

  return Array.from({ length: 42 }, (_, index) => {
    const item = new Date(start);
    item.setDate(start.getDate() + index);
    return item;
  });
}
