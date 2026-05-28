"use client";

import { useState } from "react";
import { Plus, Search, Trash2, Utensils } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { EditToggle } from "@/components/editable-field";
import { ImageUploadButton } from "@/components/image-upload";
import { PageHeading } from "@/components/page-heading";
import { FoodProductsSection } from "@/components/food-products-section";
import { localDateIso, Meal, useFitnessStore } from "@/lib/fitness-store";

const mealTabs: { label: string; value: Meal["slot"] }[] = [
  { label: "Petit dej", value: "petit-dej" },
  { label: "Midi", value: "midi" },
  { label: "Soir", value: "soir" },
  { label: "Collation", value: "collation" }
];

export default function MealsPage() {
  const { state, setMeal, deleteMeal, addMeal, updateDay, setFoodGroup, addFoodGroup, addFoodItem } = useFitnessStore();
  const [tab, setTab] = useState<"meals" | "products">("meals");
  const [mealSlot, setMealSlot] = useState<Meal["slot"]>("midi");
  const [selectedMealId, setSelectedMealId] = useState<string | null>(null);
  const today = localDateIso();
  const todayTracking = state.tracking[today];
  const visibleMeals = state.meals
    .filter((meal) => meal.slot === mealSlot)
    .sort((a, b) => {
      if (a.category === "Midi gourmand propre" && b.category !== "Midi gourmand propre") return -1;
      if (b.category === "Midi gourmand propre" && a.category !== "Midi gourmand propre") return 1;
      return a.name.localeCompare(b.name);
    });
  const selectedMeal = state.meals.find((meal) => meal.id === selectedMealId) ?? visibleMeals[0];

  function addToDay(meal: Meal) {
    updateDay(today, {
      calories: (todayTracking?.calories ?? 0) + meal.calories,
      protein: (todayTracking?.protein ?? 0) + meal.protein
    });
  }

  return (
    <>
      <PageHeading
        eyebrow="Repas & snacks"
        title="Repas, snacks et produits au meme endroit."
        description="Les recettes sont compactes. Clique sur une tuile pour ouvrir les details et ajouter une photo."
      />

      <div className="mb-5 grid grid-cols-2 rounded-lg border border-white/10 bg-white/[0.04] p-1">
        <button
          type="button"
          onClick={() => setTab("meals")}
          className={`rounded-md px-4 py-2 text-sm font-semibold transition-colors ${tab === "meals" ? "bg-primary text-primary-foreground" : "text-muted-foreground"}`}
        >
          Recettes
        </button>
        <button
          type="button"
          onClick={() => setTab("products")}
          className={`rounded-md px-4 py-2 text-sm font-semibold transition-colors ${tab === "products" ? "bg-primary text-primary-foreground" : "text-muted-foreground"}`}
        >
          Produits
        </button>
      </div>

      {tab === "products" ? (
        <FoodProductsSection
          groups={state.foodGroups}
          onChangeGroup={setFoodGroup}
          onAddGroup={addFoodGroup}
          onAddItem={addFoodItem}
        />
      ) : (
        <>
          <div className="mb-5 grid grid-cols-4 rounded-lg border border-white/10 bg-white/[0.04] p-1">
            {mealTabs.map((item) => (
              <button
                key={item.value}
                type="button"
                onClick={() => {
                  setMealSlot(item.value);
                  setSelectedMealId(null);
                }}
                className={`rounded-md px-2 py-2 text-xs font-semibold transition-colors sm:text-sm ${mealSlot === item.value ? "bg-secondary text-foreground" : "text-muted-foreground"}`}
              >
                {item.label}
              </button>
            ))}
          </div>

          <div className="mb-5 flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
            <div className="relative w-full lg:max-w-md">
              <Search className="pointer-events-none absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input placeholder="Rechercher un repas" className="pl-9" />
            </div>
            <Button onClick={() => addMeal(mealSlot)}>
              <Plus className="h-4 w-4" />
              Ajouter une recette
            </Button>
          </div>

          <section className="grid grid-cols-4 gap-2 md:grid-cols-6 xl:grid-cols-8">
            {visibleMeals.map((meal) => (
              <MealTile
                key={meal.id}
                meal={meal}
                selected={meal.id === selectedMeal?.id}
                onClick={() => setSelectedMealId(meal.id)}
              />
            ))}
          </section>

          {selectedMeal && (
            <MealDetail
              meal={selectedMeal}
              onChange={setMeal}
              onDelete={() => {
                deleteMeal(selectedMeal.id);
                setSelectedMealId(null);
              }}
              onAdd={() => addToDay(selectedMeal)}
            />
          )}
        </>
      )}
    </>
  );
}

function MealTile({ meal, selected, onClick }: { meal: Meal; selected: boolean; onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`group overflow-hidden rounded-lg border bg-white/[0.04] text-left transition-all hover:border-primary/60 hover:bg-white/[0.07] ${selected ? "border-primary ring-2 ring-primary/40" : "border-white/10"}`}
    >
      <div className="relative aspect-square bg-white/[0.04]">
        {meal.image ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={meal.image} alt={meal.name} className="h-full w-full object-cover transition-transform group-hover:scale-105" />
        ) : (
          <div className="flex h-full flex-col items-center justify-center gap-2 text-muted-foreground">
            <Utensils className="h-8 w-8" />
            <span className="text-xs">Photo</span>
          </div>
        )}
        <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/85 to-transparent p-2">
          <h3 className="line-clamp-2 text-[11px] font-semibold leading-tight text-white sm:text-xs">{meal.name}</h3>
        </div>
      </div>
      <div className="grid grid-cols-2 gap-1 p-1 text-[9px] text-muted-foreground sm:p-1.5 sm:text-[10px]">
        <span className="truncate rounded-md bg-white/[0.06] px-1.5 py-1">{meal.calories} kcal</span>
        <span className="truncate rounded-md bg-white/[0.06] px-1.5 py-1">{meal.protein} g</span>
      </div>
    </button>
  );
}

function MealDetail({
  meal,
  onChange,
  onDelete,
  onAdd
}: {
  meal: Meal;
  onChange: (meal: Meal) => void;
  onDelete: () => void;
  onAdd: () => void;
}) {
  const [editing, setEditing] = useState(false);
  const hasLocalImage = meal.image.startsWith("data:");

  return (
    <Card className="mt-5 overflow-hidden">
      <div className="grid lg:grid-cols-[340px_1fr]">
        <div className="relative aspect-square bg-white/[0.04] lg:aspect-auto">
          {meal.image ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={meal.image} alt={meal.name} className="h-full w-full object-cover" />
          ) : (
            <div className="flex h-full min-h-72 flex-col items-center justify-center gap-3 text-muted-foreground">
              <Utensils className="h-10 w-10" />
              <span>Ajoute une photo avec Modifier</span>
            </div>
          )}
          <div className="absolute left-3 top-3">
            <Badge className="bg-background/70 text-foreground backdrop-blur">{meal.category}</Badge>
          </div>
        </div>

        <CardContent className="space-y-4 p-5">
          <div className="flex items-start justify-between gap-3">
            <div>
              <h2 className="text-2xl font-semibold">{meal.name}</h2>
              <p className="mt-1 text-sm text-muted-foreground">{meal.category} · {meal.prep}</p>
            </div>
            <div className="flex shrink-0 items-center gap-2">
              {editing && (
                <Button variant="outline" size="icon" onClick={onDelete} aria-label="Supprimer la recette">
                  <Trash2 className="h-4 w-4 text-destructive" />
                </Button>
              )}
              <EditToggle editing={editing} onToggle={() => setEditing((value) => !value)} />
            </div>
          </div>

          {editing && (
            <div className="space-y-3">
              <Input value={meal.name} onChange={(event) => onChange({ ...meal, name: event.target.value })} aria-label="Nom recette" />
              <select
                className="h-10 w-full rounded-md border border-white/10 bg-white/[0.04] px-3 text-sm outline-none"
                value={meal.slot}
                onChange={(event) => onChange({ ...meal, slot: event.target.value as Meal["slot"] })}
              >
                {mealTabs.map((item) => (
                  <option key={item.value} value={item.value}>
                    {item.label}
                  </option>
                ))}
              </select>
              <Input value={meal.category} onChange={(event) => onChange({ ...meal, category: event.target.value })} aria-label="Categorie" />
              <div className="rounded-md border border-white/10 bg-white/[0.04] p-3">
                <p className="mb-2 text-xs font-medium uppercase text-muted-foreground">Photo de la recette</p>
                <ImageUploadButton
                  value={meal.image}
                  compact
                  maxSize={1100}
                  onChange={(image) => onChange({ ...meal, image })}
                  onRemove={() => onChange({ ...meal, image: "" })}
                />
                {hasLocalImage && <p className="mt-2 text-xs text-muted-foreground">Photo importee depuis ton appareil.</p>}
                <Input
                  className="mt-2"
                  value={hasLocalImage ? "" : meal.image}
                  onChange={(event) => onChange({ ...meal, image: event.target.value })}
                  placeholder="Ou colle une URL photo"
                />
              </div>
              <div className="grid grid-cols-3 gap-2">
                <Input value={meal.calories} inputMode="numeric" onChange={(event) => onChange({ ...meal, calories: Number(event.target.value) })} aria-label="Calories" />
                <Input value={meal.protein} inputMode="numeric" onChange={(event) => onChange({ ...meal, protein: Number(event.target.value) })} aria-label="Proteines" />
                <Input value={meal.prep} onChange={(event) => onChange({ ...meal, prep: event.target.value })} aria-label="Preparation" />
              </div>
              <textarea
                className="min-h-24 w-full rounded-md border border-white/10 bg-white/[0.04] p-3 text-sm outline-none"
                value={meal.ingredients}
                onChange={(event) => onChange({ ...meal, ingredients: event.target.value })}
                placeholder="Ingredients"
              />
            </div>
          )}

          {!editing && <p className="text-sm leading-6 text-muted-foreground">{meal.ingredients || "Aucun ingredient ajoute"}</p>}

          <div className="grid grid-cols-2 gap-2 text-sm">
            <div className="rounded-md bg-white/[0.05] p-3">{meal.calories} kcal</div>
            <div className="rounded-md bg-white/[0.05] p-3">{meal.protein} g proteines</div>
          </div>

          <Button className="w-full" onClick={onAdd}>
            <Plus className="h-4 w-4" />
            Ajouter a ma journee
          </Button>
        </CardContent>
      </div>
    </Card>
  );
}
