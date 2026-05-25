"use client";

import { useState } from "react";
import { Check, ChevronDown, Clock, Dumbbell, Plus, PlayCircle } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { EditToggle } from "@/components/editable-field";
import { PageHeading } from "@/components/page-heading";
import { Exercise, useFitnessStore, Workout } from "@/lib/fitness-store";

export default function WorkoutsPage() {
  const { state, setWorkout, addExercise } = useFitnessStore();
  const [editing, setEditing] = useState(false);
  const [openWorkoutId, setOpenWorkoutId] = useState<string | null>(null);

  return (
    <>
      <PageHeading
        eyebrow="Mes seances"
        title="Tes seances, compactes et faciles a ouvrir."
        description="Chaque seance reste repliee pour gagner de la place. Clique dessus pour voir les exercices."
      />

      <div className="mb-4 flex justify-end">
        <EditToggle editing={editing} onToggle={() => setEditing((value) => !value)} />
      </div>

      <div className="space-y-6">
        {state.workouts.map((workout) => (
          <WorkoutEditor
            key={workout.id}
            workout={workout}
            editing={editing}
            open={openWorkoutId === workout.id}
            onToggleOpen={() => setOpenWorkoutId((current) => (current === workout.id ? null : workout.id))}
            onChange={setWorkout}
            onAddExercise={() => addExercise(workout.id)}
          />
        ))}
      </div>
    </>
  );
}

function WorkoutEditor({
  workout,
  editing,
  open,
  onToggleOpen,
  onChange,
  onAddExercise
}: {
  workout: Workout;
  editing: boolean;
  open: boolean;
  onToggleOpen: () => void;
  onChange: (workout: Workout) => void;
  onAddExercise: () => void;
}) {
  function updateExercise(exercise: Exercise) {
    onChange({
      ...workout,
      exercises: workout.exercises.map((item) => (item.id === exercise.id ? exercise : item))
    });
  }

  return (
    <section>
      {editing && (
        <Card className="mb-3">
          <CardContent className="grid gap-3 p-4 md:grid-cols-[80px_1fr_1fr_120px]">
            <Input value={workout.code} onChange={(event) => onChange({ ...workout, code: event.target.value })} aria-label="Code seance" />
            <Input value={workout.title} onChange={(event) => onChange({ ...workout, title: event.target.value })} aria-label="Titre seance" />
            <Input value={workout.focus} onChange={(event) => onChange({ ...workout, focus: event.target.value })} aria-label="Focus" />
            <Input value={workout.duration} onChange={(event) => onChange({ ...workout, duration: event.target.value })} aria-label="Duree" />
          </CardContent>
        </Card>
      )}

      <button
        type="button"
        onClick={onToggleOpen}
        className="mb-3 flex w-full items-center justify-between gap-3 rounded-lg border border-white/10 bg-white/[0.04] p-4 text-left transition-colors hover:border-primary/50 hover:bg-white/[0.07]"
      >
        <div className="min-w-0">
          <Badge>Seance {workout.code}</Badge>
          <h2 className="mt-2 text-xl font-semibold">{workout.title}</h2>
          <p className="mt-1 text-sm text-muted-foreground">{workout.focus}</p>
        </div>
        <div className="flex shrink-0 items-center gap-3">
          <span className="hidden items-center gap-2 text-sm text-muted-foreground sm:flex">
            <Clock className="h-4 w-4 text-primary" />
            {workout.duration}
          </span>
          <ChevronDown className={`h-5 w-5 text-primary transition-transform ${open ? "rotate-180" : ""}`} />
        </div>
      </button>

      {open && (
        <>
          {editing && (
            <div className="mb-3 flex justify-end">
              <Button variant="secondary" onClick={onAddExercise}>
                <Plus className="h-4 w-4" />
                Exercice
              </Button>
            </div>
          )}
          <div className="grid gap-4 xl:grid-cols-2">
            {workout.exercises.map((exercise) => (
              <ExerciseEditor key={exercise.id} exercise={exercise} editing={editing} onChange={updateExercise} />
            ))}
          </div>
        </>
      )}
    </section>
  );
}

function ExerciseEditor({
  exercise,
  editing,
  onChange
}: {
  exercise: Exercise;
  editing: boolean;
  onChange: (exercise: Exercise) => void;
}) {
  return (
    <Card className="overflow-hidden">
      <div className="grid sm:grid-cols-[190px_1fr]">
        <div className="relative min-h-44 bg-white/[0.04]">
          {exercise.demo ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={exercise.demo} alt="" className="h-full w-full object-cover opacity-85" />
          ) : (
            <div className="flex h-full min-h-44 items-center justify-center text-muted-foreground">
              <PlayCircle className="h-10 w-10" />
            </div>
          )}
        </div>
        <div>
          <CardHeader className="pb-3">
            <div className="flex items-start justify-between gap-3">
              {editing ? (
                <Input
                  value={exercise.name}
                  onChange={(event) => onChange({ ...exercise, name: event.target.value })}
                  aria-label="Nom exercice"
                />
              ) : (
                <CardTitle>{exercise.name}</CardTitle>
              )}
              <Dumbbell className="mt-2 h-5 w-5 text-primary" />
            </div>
            {editing ? (
              <div className="grid grid-cols-3 gap-2">
                <Input value={exercise.sets} inputMode="numeric" onChange={(event) => onChange({ ...exercise, sets: Number(event.target.value) })} aria-label="Series" />
                <Input value={exercise.reps} onChange={(event) => onChange({ ...exercise, reps: event.target.value })} aria-label="Repetitions" />
                <Input value={exercise.rest} onChange={(event) => onChange({ ...exercise, rest: event.target.value })} aria-label="Repos" />
              </div>
            ) : (
              <div className="flex flex-wrap gap-2">
                <Badge>{exercise.sets} series</Badge>
                <Badge>{exercise.reps} reps</Badge>
                <Badge>{exercise.rest}</Badge>
              </div>
            )}
          </CardHeader>
          <CardContent className="space-y-3">
            {editing ? (
              <>
                <Input value={exercise.demo} onChange={(event) => onChange({ ...exercise, demo: event.target.value })} placeholder="URL photo / GIF / video" />
                <Input value={exercise.muscles} onChange={(event) => onChange({ ...exercise, muscles: event.target.value })} placeholder="Muscles cibles" />
                <textarea
                  className="min-h-20 w-full rounded-md border border-white/10 bg-white/[0.04] p-3 text-sm outline-none"
                  value={exercise.tips}
                  onChange={(event) => onChange({ ...exercise, tips: event.target.value })}
                  placeholder="Conseils d'execution"
                />
                <textarea
                  className="min-h-20 w-full rounded-md border border-white/10 bg-white/[0.04] p-3 text-sm outline-none"
                  value={exercise.mistakes}
                  onChange={(event) => onChange({ ...exercise, mistakes: event.target.value })}
                  placeholder="Erreurs a eviter"
                />
              </>
            ) : (
              <>
                <div className="flex flex-wrap gap-2">
                  {exercise.muscles.split(",").map((muscle) => (
                    <Badge key={muscle.trim()} className="text-primary">{muscle.trim()}</Badge>
                  ))}
                </div>
                <p className="text-sm"><span className="text-muted-foreground">Conseil : </span>{exercise.tips || "-"}</p>
                <p className="text-sm"><span className="text-muted-foreground">A eviter : </span>{exercise.mistakes || "-"}</p>
              </>
            )}
            <div className="grid grid-cols-2 gap-3">
              <Input value={exercise.weightUsed} onChange={(event) => onChange({ ...exercise, weightUsed: event.target.value })} placeholder="Poids utilise" />
              <Input value={exercise.repsDone} onChange={(event) => onChange({ ...exercise, repsDone: event.target.value })} placeholder="Reps realisees" />
            </div>
            <Button variant={exercise.completed ? "default" : "secondary"} className="w-full" onClick={() => onChange({ ...exercise, completed: !exercise.completed })}>
              <Check className="h-4 w-4" />
              {exercise.completed ? "Termine" : "Exercice termine"}
            </Button>
          </CardContent>
        </div>
      </div>
    </Card>
  );
}
