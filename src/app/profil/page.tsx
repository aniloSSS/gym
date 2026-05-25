"use client";

import { useState } from "react";
import { Save } from "lucide-react";
import { EditableField, EditToggle } from "@/components/editable-field";
import { PageHeading } from "@/components/page-heading";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useFitnessStore } from "@/lib/fitness-store";

export default function ProfilePage() {
  const { state, setProfile } = useFitnessStore();
  const [editing, setEditing] = useState(false);
  const profile = state.profile;
  const fields = [
    ["Taille", profile.height],
    ["Poids actuel", `${profile.currentWeight} kg`],
    ["Objectif poids", `${profile.targetWeight} kg`],
    ["Objectif calories", `${profile.caloriesGoal} kcal`],
    ["Objectif proteines", `${profile.proteinGoal} g`],
    ["Seances", `${profile.trainingFrequency}/semaine`],
    ["Objectif physique", profile.physiqueGoal]
  ];

  return (
    <>
      <PageHeading
        eyebrow="Profil / objectifs"
        title="Tes objectifs sont modifiables et pilotent tout le suivi."
        description="Change tes cibles quand tu veux : le dashboard et les barres de progression s'ajustent automatiquement."
      />

      <section className="grid gap-4 lg:grid-cols-[.8fr_1.2fr]">
        <Card>
          <CardHeader>
            <CardTitle>Resume</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {fields.map(([label, value]) => (
              <div key={label} className="flex items-center justify-between rounded-md bg-white/[0.04] p-3 text-sm">
                <span className="text-muted-foreground">{label}</span>
                <span className="font-medium">{value}</span>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <div className="flex items-center justify-between gap-3">
              <CardTitle>Mes objectifs</CardTitle>
              <EditToggle editing={editing} onToggle={() => setEditing((value) => !value)} />
            </div>
          </CardHeader>
          <CardContent className="grid gap-4 sm:grid-cols-2">
            <EditableField label="Taille" value={profile.height} editing={editing} onChange={(value) => setProfile({ ...profile, height: value })} />
            <EditableField label="Poids actuel" value={profile.currentWeight} suffix="kg" type="number" editing={editing} onChange={(value) => setProfile({ ...profile, currentWeight: Number(value) })} />
            <EditableField label="Objectif poids" value={profile.targetWeight} suffix="kg" type="number" editing={editing} onChange={(value) => setProfile({ ...profile, targetWeight: Number(value) })} />
            <EditableField label="Objectif calories" value={profile.caloriesGoal} suffix="kcal" type="number" editing={editing} onChange={(value) => setProfile({ ...profile, caloriesGoal: Number(value) })} />
            <EditableField label="Objectif proteines" value={profile.proteinGoal} suffix="g" type="number" editing={editing} onChange={(value) => setProfile({ ...profile, proteinGoal: Number(value) })} />
            <EditableField label="Frequence entrainement" value={profile.trainingFrequency} suffix="/semaine" type="number" editing={editing} onChange={(value) => setProfile({ ...profile, trainingFrequency: Number(value) })} />
            <div className="sm:col-span-2">
              <EditableField label="Objectif physique" value={profile.physiqueGoal} editing={editing} onChange={(value) => setProfile({ ...profile, physiqueGoal: value })} />
            </div>
            <Button className="sm:col-span-2">
              <Save className="h-4 w-4" />
              Sauvegarde automatique active
            </Button>
          </CardContent>
        </Card>
      </section>
    </>
  );
}
