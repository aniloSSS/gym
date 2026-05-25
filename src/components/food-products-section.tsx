"use client";

import { useMemo, useState } from "react";
import { Apple, Plus, Search } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { EditToggle } from "@/components/editable-field";
import { FoodGroup } from "@/lib/fitness-store";

export function FoodProductsSection({
  groups,
  onChangeGroup,
  onAddGroup,
  onAddItem
}: {
  groups: FoodGroup[];
  onChangeGroup: (group: FoodGroup) => void;
  onAddGroup: () => void;
  onAddItem: (groupId: string) => void;
}) {
  const [query, setQuery] = useState("");
  const [editing, setEditing] = useState(false);
  const filteredGroups = useMemo(() => {
    const search = query.trim().toLowerCase();
    if (!search) {
      return groups;
    }

    return groups
      .map((group) => ({
        ...group,
        items: group.items.filter((item) => item.toLowerCase().includes(search))
      }))
      .filter((group) => group.name.toLowerCase().includes(search) || group.items.length > 0);
  }, [groups, query]);

  return (
    <>
      <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-center">
        <div className="relative flex-1">
          <Search className="pointer-events-none absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
          <Input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Recherche rapide" className="pl-9" />
        </div>
        <EditToggle editing={editing} onToggle={() => setEditing((value) => !value)} />
        {editing && (
          <Button onClick={onAddGroup}>
            <Plus className="h-4 w-4" />
            Categorie
          </Button>
        )}
      </div>

      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {filteredGroups.map((group) => (
          <FoodGroupCard
            key={group.id}
            group={group}
            editing={editing}
            onChange={onChangeGroup}
            onAddItem={() => onAddItem(group.id)}
          />
        ))}
      </section>
    </>
  );
}

function FoodGroupCard({
  group,
  editing,
  onChange,
  onAddItem
}: {
  group: FoodGroup;
  editing: boolean;
  onChange: (group: FoodGroup) => void;
  onAddItem: () => void;
}) {
  function updateItem(index: number, value: string) {
    onChange({
      ...group,
      items: group.items.map((item, itemIndex) => (itemIndex === index ? value : item))
    });
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between gap-3">
          {editing ? (
            <Input value={group.name} onChange={(event) => onChange({ ...group, name: event.target.value })} aria-label="Categorie" />
          ) : (
            <CardTitle>{group.name}</CardTitle>
          )}
          <Apple className={`h-6 w-6 ${group.tone}`} />
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        {editing ? (
          <div className="space-y-2">
            {group.items.map((item, index) => (
              <Input key={`${group.id}-${index}`} value={item} onChange={(event) => updateItem(index, event.target.value)} />
            ))}
            <Button variant="secondary" className="w-full" onClick={onAddItem}>
              <Plus className="h-4 w-4" />
              Ajouter un aliment
            </Button>
          </div>
        ) : (
          <div className="flex flex-wrap gap-2">
            {group.items.map((item) => (
              <Badge key={item}>{item}</Badge>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
