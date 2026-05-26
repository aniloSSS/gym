"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import type { User } from "@supabase/supabase-js";
import { createSupabaseBrowserClient, isSupabaseConfigured } from "@/lib/supabase/browser";
import type { Json } from "@/types/database";

export type Exercise = {
  id: string;
  name: string;
  sets: number;
  reps: string;
  rest: string;
  muscles: string;
  tips: string;
  mistakes: string;
  demo: string;
  weightUsed: string;
  repsDone: string;
  completed: boolean;
};

export type Workout = {
  id: string;
  code: string;
  title: string;
  focus: string;
  duration: string;
  exercises: Exercise[];
};

export type Meal = {
  id: string;
  name: string;
  slot: "petit-dej" | "midi" | "soir" | "collation";
  category: string;
  calories: number;
  protein: number;
  prep: string;
  ingredients: string;
  image: string;
};

export type FoodGroup = {
  id: string;
  name: string;
  items: string[];
  tone: string;
};

export type DayTracking = {
  date: string;
  calories: number;
  protein: number;
  workoutId: string;
  weight: number;
  waist: number;
  validated: boolean;
  photoBefore: string;
  photoAfter: string;
};

export type Profile = {
  height: string;
  currentWeight: number;
  targetWeight: number;
  caloriesGoal: number;
  proteinGoal: number;
  trainingFrequency: number;
  physiqueGoal: string;
};

export type FitnessState = {
  profile: Profile;
  workouts: Workout[];
  meals: Meal[];
  foodGroups: FoodGroup[];
  tracking: Record<string, DayTracking>;
};

export type SyncStatus = "local" | "loading" | "synced" | "saving" | "error";

const todayIso = localDateIso();

export const defaultFitnessState: FitnessState = {
  profile: {
    height: "1m83",
    currentWeight: 75,
    targetWeight: 72,
    caloriesGoal: 2300,
    proteinGoal: 150,
    trainingFrequency: 3,
    physiqueGoal: "Physique sec et athletique"
  },
  workouts: [
    {
      id: "workout-a",
      code: "A",
      title: "Pectoraux • Epaules • Triceps • Abdos",
      focus: "Pecs plus epais, haut des pecs rempli, epaules larges, triceps visibles, torse athletique",
      duration: "1h10",
      exercises: [
        {
          id: "a-incline-db",
          name: "Developpe incline halteres",
          sets: 4,
          reps: "8-10",
          rest: "2 min",
          muscles: "Haut des pectoraux, pectoraux, epaules avant",
          tips: "Exercice prioritaire. Poitrine sortie, descendre lentement, controler la montee, amplitude complete.",
          mistakes: "Prendre trop lourd, mouvement trop rapide, epaules qui montent, cambrer excessivement.",
          demo: "",
          weightUsed: "",
          repsDone: "",
          completed: false
        },
        {
          id: "a-bench",
          name: "Developpe couche barre ou halteres",
          sets: 4,
          reps: "8-12",
          rest: "2 min",
          muscles: "Pectoraux, triceps, epaules avant",
          tips: "Construire l'epaisseur generale des pectoraux. Controler la descente, pousser fort mais proprement, garder les epaules stables.",
          mistakes: "Rebondir sur les pecs, decoller les fesses du banc.",
          demo: "",
          weightUsed: "",
          repsDone: "",
          completed: false
        },
        {
          id: "a-pec-deck",
          name: "Pec Deck / Machine papillon",
          sets: 3,
          reps: "12-15",
          rest: "1 min 15",
          muscles: "Pectoraux",
          tips: "Congestion et isolation. Mouvement lent, bien etirer les pecs, serrer fort a la fin.",
          mistakes: "Mettre trop lourd, utiliser les epaules au lieu des pecs.",
          demo: "",
          weightUsed: "",
          repsDone: "",
          completed: false
        },
        {
          id: "a-lateral-raises",
          name: "Elevations laterales halteres",
          sets: 4,
          reps: "15-20",
          rest: "1 min",
          muscles: "Epaules, deltoides moyens",
          tips: "Elargir les epaules. Leger pli des bras, mouvement controle, monter a hauteur d'epaule.",
          mistakes: "Balancer le corps, monter trop haut.",
          demo: "",
          weightUsed: "",
          repsDone: "",
          completed: false
        },
        {
          id: "a-shoulder-press",
          name: "Developpe epaules halteres ou machine",
          sets: 3,
          reps: "8-12",
          rest: "1 min 30",
          muscles: "Epaules, triceps",
          tips: "Developper les epaules. Mouvement propre, gainage solide.",
          mistakes: "Cambrer le bas du dos, aller trop vite.",
          demo: "",
          weightUsed: "",
          repsDone: "",
          completed: false
        },
        {
          id: "a-pushdown",
          name: "Pushdown triceps corde",
          sets: 3,
          reps: "10-15",
          rest: "1 min",
          muscles: "Triceps",
          tips: "Dessiner les triceps. Coudes fixes, extension complete.",
          mistakes: "Bouger les coudes, utiliser les epaules.",
          demo: "",
          weightUsed: "",
          repsDone: "",
          completed: false
        },
        {
          id: "a-overhead-triceps",
          name: "Extension triceps au-dessus de la tete",
          sets: 3,
          reps: "10-12",
          rest: "1 min",
          muscles: "Triceps longue portion",
          tips: "Travailler la longue portion du triceps. Amplitude complete, coudes stables.",
          mistakes: "Raccourcir le mouvement, cambrer.",
          demo: "",
          weightUsed: "",
          repsDone: "",
          completed: false
        },
        {
          id: "a-leg-raises",
          name: "Releves de jambes",
          sets: 3,
          reps: "10-15",
          rest: "45 sec",
          muscles: "Bas des abdos",
          tips: "Monter lentement, controler la descente.",
          mistakes: "Balancer les jambes, creuser le bas du dos.",
          demo: "",
          weightUsed: "",
          repsDone: "",
          completed: false
        },
        {
          id: "a-plank",
          name: "Gainage",
          sets: 3,
          reps: "45 sec",
          rest: "45 sec",
          muscles: "Abdos, gainage",
          tips: "Corps aligne, respiration controlee, bassin neutre.",
          mistakes: "Hanches trop basses, epaules relachees.",
          demo: "",
          weightUsed: "",
          repsDone: "",
          completed: false
        }
      ]
    },
    {
      id: "workout-b",
      code: "B",
      title: "Dos • Biceps • Rappel pec • Abdos",
      focus: "Dos plus large, effet V, bras plus epais, frequence elevee sur les pecs",
      duration: "1h10",
      exercises: [
        {
          id: "b-lat-pulldown-wide",
          name: "Tirage vertical prise large",
          sets: 4,
          reps: "8-12",
          rest: "2 min",
          muscles: "Grand dorsal, dos largeur",
          tips: "Elargir le dos. Tirer avec les coudes, poitrine sortie, controle du mouvement.",
          mistakes: "Tirer derriere la nuque, balancer le dos.",
          demo: "",
          weightUsed: "",
          repsDone: "",
          completed: false
        },
        {
          id: "b-seated-row",
          name: "Rowing assis poulie",
          sets: 4,
          reps: "8-12",
          rest: "1 min 30",
          muscles: "Milieu du dos, dorsaux, trapezes",
          tips: "Epaissir le dos. Controler le retour, tirer vers le nombril.",
          mistakes: "Arrondir le dos, tirer avec les lombaires.",
          demo: "",
          weightUsed: "",
          repsDone: "",
          completed: false
        },
        {
          id: "b-neutral-row",
          name: "Tirage horizontal prise neutre",
          sets: 3,
          reps: "10-12",
          rest: "1 min 30",
          muscles: "Dos complet",
          tips: "Travail complet du dos. Garder la poitrine ouverte et les epaules basses.",
          mistakes: "Utiliser l'elan, relacher la posture.",
          demo: "",
          weightUsed: "",
          repsDone: "",
          completed: false
        },
        {
          id: "b-face-pull",
          name: "Face pull corde",
          sets: 3,
          reps: "15-20",
          rest: "1 min",
          muscles: "Epaules arriere, posture",
          tips: "Posture + epaules arriere. Tirer vers le visage, ouvrir les coudes.",
          mistakes: "Tirer trop bas, charger trop lourd.",
          demo: "",
          weightUsed: "",
          repsDone: "",
          completed: false
        },
        {
          id: "b-pec-deck-light",
          name: "Pec Deck leger",
          sets: 3,
          reps: "12-15",
          rest: "1 min",
          muscles: "Pectoraux",
          tips: "Rappel pectoraux sans fatigue excessive. Leger, mouvement lent, congestion.",
          mistakes: "Aller trop lourd, transformer en mouvement d'epaules.",
          demo: "",
          weightUsed: "",
          repsDone: "",
          completed: false
        },
        {
          id: "b-db-curl",
          name: "Curl halteres",
          sets: 3,
          reps: "10-12",
          rest: "1 min",
          muscles: "Biceps",
          tips: "Developper les biceps. Eviter l'elan, controler la descente.",
          mistakes: "Balancer le corps, avancer les coudes.",
          demo: "",
          weightUsed: "",
          repsDone: "",
          completed: false
        },
        {
          id: "b-hammer-curl",
          name: "Curl marteau",
          sets: 3,
          reps: "10-12",
          rest: "1 min",
          muscles: "Biceps, brachial, avant-bras",
          tips: "Epaissir les bras et avant-bras. Poignets neutres, controle.",
          mistakes: "Monter avec l'elan, raccourcir l'amplitude.",
          demo: "",
          weightUsed: "",
          repsDone: "",
          completed: false
        },
        {
          id: "b-floor-crunch",
          name: "Crunch au sol",
          sets: 3,
          reps: "15-20",
          rest: "45 sec",
          muscles: "Abdos",
          tips: "Mouvement lent, contracter les abdos.",
          mistakes: "Tirer la nuque, aller trop vite.",
          demo: "",
          weightUsed: "",
          repsDone: "",
          completed: false
        },
        {
          id: "b-side-plank",
          name: "Gainage lateral",
          sets: 2,
          reps: "30 sec par cote",
          rest: "45 sec",
          muscles: "Obliques, gainage",
          tips: "Bassin haut, corps aligne, respiration controlee.",
          mistakes: "S'affaisser, tourner le buste.",
          demo: "",
          weightUsed: "",
          repsDone: "",
          completed: false
        }
      ]
    },
    {
      id: "workout-c",
      code: "C",
      title: "Haut des pecs • Haut du corps • Jambes • Abdos",
      focus: "Physique athletique equilibre, haut des pecs, epaules larges, jambes pour l'equilibre",
      duration: "1h10",
      exercises: [
        {
          id: "c-incline-machine",
          name: "Developpe incline machine",
          sets: 4,
          reps: "8-12",
          rest: "2 min",
          muscles: "Haut des pectoraux",
          tips: "Focus haut des pectoraux. Controle total, amplitude complete.",
          mistakes: "Epaules qui prennent tout le mouvement, trop charger.",
          demo: "",
          weightUsed: "",
          repsDone: "",
          completed: false
        },
        {
          id: "c-pec-deck",
          name: "Pec Deck",
          sets: 3,
          reps: "12-15",
          rest: "1 min 15",
          muscles: "Pectoraux",
          tips: "Congestion et isolation des pecs. Mouvement lent, contraction forte.",
          mistakes: "Mettre trop lourd, perdre l'etirement.",
          demo: "",
          weightUsed: "",
          repsDone: "",
          completed: false
        },
        {
          id: "c-lat-pulldown",
          name: "Tirage vertical prise large",
          sets: 4,
          reps: "8-12",
          rest: "1 min 30",
          muscles: "Dos largeur, grand dorsal",
          tips: "Creer un dos en V. Tirer avec les coudes, poitrine sortie.",
          mistakes: "Tirer derriere la nuque, balancer le dos.",
          demo: "",
          weightUsed: "",
          repsDone: "",
          completed: false
        },
        {
          id: "c-lateral-raises",
          name: "Elevations laterales",
          sets: 4,
          reps: "15-20",
          rest: "1 min",
          muscles: "Epaules, deltoides moyens",
          tips: "Elargir les epaules. Controle, monter a hauteur d'epaule.",
          mistakes: "Balancer, monter trop haut.",
          demo: "",
          weightUsed: "",
          repsDone: "",
          completed: false
        },
        {
          id: "c-leg-press",
          name: "Presse a cuisses",
          sets: 4,
          reps: "10-12",
          rest: "2 min",
          muscles: "Quadriceps, fessiers, jambes",
          tips: "Jambes equilibrees sans enorme focus. Descendre controle, pousser avec les talons.",
          mistakes: "Decoller le bassin, verrouiller brutalement les genoux.",
          demo: "",
          weightUsed: "",
          repsDone: "",
          completed: false
        },
        {
          id: "c-rdl-db",
          name: "Souleve de terre roumain halteres",
          sets: 3,
          reps: "10-12",
          rest: "1 min 30",
          muscles: "Ischios, fessiers, posture",
          tips: "Arriere des jambes + posture. Dos droit, descente lente.",
          mistakes: "Arrondir le dos, plier trop les genoux.",
          demo: "",
          weightUsed: "",
          repsDone: "",
          completed: false
        },
        {
          id: "c-preacher-curl",
          name: "Curl pupitre ou machine",
          sets: 3,
          reps: "10-12",
          rest: "1 min",
          muscles: "Biceps",
          tips: "Controle complet, contraction en haut, descente lente.",
          mistakes: "Decoller les bras, charger trop lourd.",
          demo: "",
          weightUsed: "",
          repsDone: "",
          completed: false
        },
        {
          id: "c-triceps-cable",
          name: "Extension triceps poulie",
          sets: 3,
          reps: "10-15",
          rest: "1 min",
          muscles: "Triceps",
          tips: "Coudes fixes, extension complete.",
          mistakes: "Bouger les epaules, raccourcir le mouvement.",
          demo: "",
          weightUsed: "",
          repsDone: "",
          completed: false
        },
        {
          id: "c-leg-raises",
          name: "Releves de jambes",
          sets: 3,
          reps: "10-15",
          rest: "45 sec",
          muscles: "Bas des abdos",
          tips: "Controle, bassin stable, descente lente.",
          mistakes: "Balancer, creuser le bas du dos.",
          demo: "",
          weightUsed: "",
          repsDone: "",
          completed: false
        },
        {
          id: "c-plank",
          name: "Gainage",
          sets: 3,
          reps: "45 sec",
          rest: "45 sec",
          muscles: "Abdos, gainage",
          tips: "Corps aligne, respiration controlee, bassin neutre.",
          mistakes: "Hanches basses, relacher le ventre.",
          demo: "",
          weightUsed: "",
          repsDone: "",
          completed: false
        }
      ]
    }
  ],
  meals: [
    {
      id: "meal-chicken",
      name: "Poulet pommes de terre legumes",
      slot: "midi",
      category: "Repas riches en proteines",
      calories: 620,
      protein: 52,
      prep: "25 min",
      ingredients: "Poulet, pommes de terre, brocoli, huile d'olive",
      image: "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=900&q=80"
    },
    {
      id: "meal-salmon",
      name: "Saumon riz courgettes",
      slot: "soir",
      category: "Post training",
      calories: 690,
      protein: 45,
      prep: "22 min",
      ingredients: "Saumon, riz basmati, courgettes, citron",
      image: "https://images.unsplash.com/photo-1467003909585-2f8a72700288?auto=format&fit=crop&w=900&q=80"
    },
    {
      id: "snack-skyr",
      name: "Skyr banane",
      slot: "collation",
      category: "Collations",
      calories: 220,
      protein: 22,
      prep: "3 min",
      ingredients: "Skyr, banane",
      image: ""
    },
    {
      id: "breakfast-skyr-oats",
      name: "Skyr avoine banane",
      slot: "petit-dej",
      category: "Petit dej proteine",
      calories: 420,
      protein: 34,
      prep: "5 min",
      ingredients: "Skyr, flocons d'avoine, banane, cannelle",
      image: ""
    },
    {
      id: "lunch-crispy-paprika",
      name: "Poulet croustillant paprika & potatoes",
      slot: "midi",
      category: "Midi gourmand propre",
      calories: 720,
      protein: 52,
      prep: "30 min",
      ingredients: "180 g poulet, 300 g pommes de terre, 40 g chapelure legere, paprika fume, ail, herbes, sauce fromage blanc, citron, ciboulette",
      image: ""
    },
    {
      id: "lunch-burger-deluxe",
      name: "Burger fitness deluxe",
      slot: "midi",
      category: "Midi gourmand propre",
      calories: 760,
      protein: 45,
      prep: "25 min",
      ingredients: "150 g steak 5 %, pain burger complet, cheddar allege, salade, tomates, oignons caramelises legers, potatoes au four, sauce burger legere maison",
      image: ""
    },
    {
      id: "lunch-wrap-crispy",
      name: "Wrap crispy poulet epice",
      slot: "midi",
      category: "Midi gourmand propre",
      calories: 730,
      protein: 50,
      prep: "20 min",
      ingredients: "2 wraps complets, 180 g poulet pane leger, salade iceberg, tomates, oignons rouges, fromage blanc, epices, citron",
      image: ""
    },
    {
      id: "lunch-pasta-parmesan",
      name: "Pates cremeuses poulet parmesan",
      slot: "midi",
      category: "Midi gourmand propre",
      calories: 780,
      protein: 55,
      prep: "25 min",
      ingredients: "180 g poulet, 200 g pates completes cuites, parmesan leger, creme legere, ail, champignons",
      image: ""
    },
    {
      id: "lunch-salmon-spicy",
      name: "Bowl saumon avocat spicy",
      slot: "midi",
      category: "Midi gourmand propre",
      calories: 760,
      protein: 42,
      prep: "20 min",
      ingredients: "150 g saumon, 150 g riz, 70 g avocat, concombre, mangue legere, graines de sesame, soja legere, sriracha, citron vert",
      image: ""
    },
    {
      id: "lunch-burrito-bowl",
      name: "Burrito bowl tex mex",
      slot: "midi",
      category: "Midi gourmand propre",
      calories: 790,
      protein: 48,
      prep: "25 min",
      ingredients: "150 g steak 5 %, 180 g riz, mais, haricots rouges, tomates, salade, cheddar leger, salsa legere maison",
      image: ""
    },
    {
      id: "lunch-honey-mustard",
      name: "Poulet miel moutarde premium",
      slot: "midi",
      category: "Midi gourmand propre",
      calories: 700,
      protein: 50,
      prep: "25 min",
      ingredients: "180 g poulet, 250 g pommes de terre grenaille, haricots verts, miel leger, moutarde, fromage blanc",
      image: ""
    },
    {
      id: "lunch-tacos-bowl",
      name: "Tacos bowl healthy",
      slot: "midi",
      category: "Midi gourmand propre",
      calories: 750,
      protein: 50,
      prep: "20 min",
      ingredients: "180 g dinde epicee, riz basmati, tomates, salade, avocat, fromage rape leger, sauce yaourt epicee",
      image: ""
    },
    {
      id: "lunch-thai-peanut",
      name: "Poulet thai cacahuete leger",
      slot: "midi",
      category: "Midi gourmand propre",
      calories: 780,
      protein: 52,
      prep: "25 min",
      ingredients: "180 g poulet, nouilles de riz, carottes, courgettes, cacahuetes concassees, soja, beurre de cacahuete leger, citron vert",
      image: ""
    },
    {
      id: "lunch-bagel-salmon",
      name: "Bagel saumon avocat",
      slot: "midi",
      category: "Midi gourmand propre",
      calories: 760,
      protein: 42,
      prep: "15 min",
      ingredients: "Bagel complet, 120 g saumon fume, avocat, fromage frais leger, salade, pommes de terre au four",
      image: ""
    },
    {
      id: "lunch-pesto-mozza",
      name: "Poulet pesto mozzarella legere",
      slot: "midi",
      category: "Midi gourmand propre",
      calories: 790,
      protein: 55,
      prep: "25 min",
      ingredients: "180 g poulet, mozzarella light, pesto leger, tomates cerises, pates completes",
      image: ""
    },
    {
      id: "lunch-cantonais",
      name: "Riz cantonais musculation",
      slot: "midi",
      category: "Midi gourmand propre",
      calories: 760,
      protein: 50,
      prep: "20 min",
      ingredients: "180 g poulet, 180 g riz, 2 oeufs, petits pois, oignons, soja legere, ail, gingembre",
      image: ""
    },
    {
      id: "lunch-italian-sandwich",
      name: "Sandwich chaud italien fitness",
      slot: "midi",
      category: "Midi gourmand propre",
      calories: 740,
      protein: 48,
      prep: "15 min",
      ingredients: "Pain ciabatta complet, blanc de poulet, mozzarella light, tomates, roquette, pesto leger",
      image: ""
    },
    {
      id: "lunch-chicken-parmesan",
      name: "Poulet parmesan croustillant",
      slot: "midi",
      category: "Midi gourmand propre",
      calories: 800,
      protein: 58,
      prep: "30 min",
      ingredients: "180 g poulet, chapelure legere, parmesan, sauce tomate maison, spaghetti complets",
      image: ""
    },
    {
      id: "lunch-chili",
      name: "Chili con carne gourmand",
      slot: "midi",
      category: "Midi gourmand propre",
      calories: 790,
      protein: 50,
      prep: "30 min",
      ingredients: "150 g steak 5 %, haricots rouges, tomates, mais, riz, fromage rape leger, coriandre",
      image: ""
    },
    {
      id: "lunch-mediterranean",
      name: "Bowl mediterraneen feta poulet",
      slot: "midi",
      category: "Midi gourmand propre",
      calories: 760,
      protein: 50,
      prep: "25 min",
      ingredients: "180 g poulet, pommes de terre grenaille, concombre, tomates, olives, feta legere, yaourt grec citron",
      image: ""
    },
    {
      id: "lunch-tikka",
      name: "Poulet tikka leger",
      slot: "midi",
      category: "Midi gourmand propre",
      calories: 740,
      protein: 52,
      prep: "25 min",
      ingredients: "180 g poulet marine epices tikka, riz basmati, sauce tomate creme legere, coriandre",
      image: ""
    },
    {
      id: "lunch-beef-noodles",
      name: "Nouilles asiatiques boeuf healthy",
      slot: "midi",
      category: "Midi gourmand propre",
      calories: 780,
      protein: 45,
      prep: "20 min",
      ingredients: "150 g steak 5 %, nouilles, legumes wok, ail, gingembre, soja legere, miel leger",
      image: ""
    },
    {
      id: "lunch-grilled-cheese",
      name: "Grilled cheese proteine",
      slot: "midi",
      category: "Midi gourmand propre",
      calories: 760,
      protein: 50,
      prep: "15 min",
      ingredients: "Pain complet, blanc de poulet, cheddar leger, mozzarella light, salade, potatoes au four",
      image: ""
    },
    {
      id: "lunch-shrimp-poke",
      name: "Pokebowl crevettes mangue",
      slot: "midi",
      category: "Midi gourmand propre",
      calories: 730,
      protein: 45,
      prep: "20 min",
      ingredients: "200 g crevettes, riz, mangue, concombre, avocat, edamame, soja citron vert",
      image: ""
    },
    {
      id: "lunch-mac-cheese",
      name: "Mac & cheese fitness",
      slot: "midi",
      category: "Midi gourmand propre",
      calories: 820,
      protein: 58,
      prep: "25 min",
      ingredients: "Pates completes, poulet, cheddar leger, creme legere, parmesan",
      image: ""
    },
    {
      id: "lunch-buffalo",
      name: "Poulet buffalo leger",
      slot: "midi",
      category: "Midi gourmand propre",
      calories: 760,
      protein: 52,
      prep: "25 min",
      ingredients: "180 g poulet croustillant leger, potatoes, salade iceberg, buffalo legere, ranch proteine",
      image: ""
    },
    {
      id: "dinner-crispy-salmon",
      name: "Saumon croustillant & legumes rotis",
      slot: "soir",
      category: "Soir gourmand propre",
      calories: 700,
      protein: 42,
      prep: "25 min",
      ingredients: "150 g saumon, 250 g pommes de terre grenaille, courgettes, carottes, ail, herbes, yaourt grec citron aneth",
      image: ""
    },
    {
      id: "dinner-wrap-pesto",
      name: "Wrap poulet mozzarella pesto",
      slot: "soir",
      category: "Soir gourmand propre",
      calories: 720,
      protein: 50,
      prep: "15 min",
      ingredients: "2 wraps complets, 160 g poulet, mozzarella light, tomates, roquette, pesto leger",
      image: ""
    },
    {
      id: "dinner-eggs-salmon",
      name: "Bowl oeufs avocat saumon fume",
      slot: "soir",
      category: "Soir gourmand propre",
      calories: 680,
      protein: 40,
      prep: "15 min",
      ingredients: "2 oeufs, 100 g saumon fume, 70 g avocat, pommes de terre vapeur, salade",
      image: ""
    },
    {
      id: "dinner-steak-pepper",
      name: "Steak, potatoes & sauce poivre legere",
      slot: "soir",
      category: "Soir gourmand propre",
      calories: 730,
      protein: 42,
      prep: "20 min",
      ingredients: "150 g steak 5 %, 250 g pommes de terre, salade, creme legere, poivre, moutarde",
      image: ""
    },
    {
      id: "dinner-tuna-pasta",
      name: "Pates cremeuses thon parmesan",
      slot: "soir",
      category: "Soir gourmand propre",
      calories: 760,
      protein: 52,
      prep: "20 min",
      ingredients: "1 boite thon, 180 g pates completes, parmesan leger, creme legere, ail",
      image: ""
    },
    {
      id: "dinner-tikka",
      name: "Poulet tikka soir leger",
      slot: "soir",
      category: "Soir gourmand propre",
      calories: 690,
      protein: 50,
      prep: "25 min",
      ingredients: "180 g poulet, riz basmati, sauce tomate legere, epices tikka",
      image: ""
    },
    {
      id: "dinner-grilled-cheese",
      name: "Grilled cheese proteine",
      slot: "soir",
      category: "Soir gourmand propre",
      calories: 700,
      protein: 48,
      prep: "12 min",
      ingredients: "Pain complet, blanc de poulet, cheddar leger, mozzarella light, salade verte",
      image: ""
    },
    {
      id: "dinner-omelette",
      name: "Omelette gourmande musculation",
      slot: "soir",
      category: "Soir gourmand propre",
      calories: 680,
      protein: 45,
      prep: "15 min",
      ingredients: "3 oeufs, 150 g blancs d'oeufs, champignons, fromage leger, pommes de terre sautees legeres",
      image: ""
    },
    {
      id: "dinner-buffalo",
      name: "Poulet buffalo maison",
      slot: "soir",
      category: "Soir gourmand propre",
      calories: 760,
      protein: 52,
      prep: "25 min",
      ingredients: "180 g poulet croustillant leger, potatoes maison, salade iceberg, buffalo legere, ranch proteine fromage blanc",
      image: ""
    },
    {
      id: "dinner-asian-rice",
      name: "Riz saute asiatique proteine",
      slot: "soir",
      category: "Soir gourmand propre",
      calories: 730,
      protein: 50,
      prep: "20 min",
      ingredients: "180 g poulet, 180 g riz, legumes wok, 1 oeuf, soja legere",
      image: ""
    },
    {
      id: "dinner-mediterranean",
      name: "Bowl mediterraneen du soir",
      slot: "soir",
      category: "Soir gourmand propre",
      calories: 700,
      protein: 48,
      prep: "20 min",
      ingredients: "180 g dinde, concombre, tomates, feta legere, pommes de terre grenaille, yaourt grec citron",
      image: ""
    },
    {
      id: "dinner-tacos-light",
      name: "Tacos bowl leger",
      slot: "soir",
      category: "Soir gourmand propre",
      calories: 760,
      protein: 45,
      prep: "20 min",
      ingredients: "150 g steak 5 %, riz, mais, tomates, avocat, fromage leger",
      image: ""
    },
    {
      id: "dinner-thai-noodles",
      name: "Nouilles thai poulet cacahuete",
      slot: "soir",
      category: "Soir gourmand propre",
      calories: 780,
      protein: 50,
      prep: "20 min",
      ingredients: "180 g poulet, nouilles, legumes sautes, sauce cacahuete legere",
      image: ""
    },
    {
      id: "dinner-tortilla-pizza",
      name: "Pizza tortilla fitness",
      slot: "soir",
      category: "Soir gourmand propre",
      calories: 650,
      protein: 48,
      prep: "12 min",
      ingredients: "Tortilla complete, sauce tomate, blanc de poulet, mozzarella light, champignons, origan",
      image: ""
    },
    {
      id: "dinner-bagel-eggs",
      name: "Bagel oeufs bacon de dinde",
      slot: "soir",
      category: "Soir gourmand propre",
      calories: 730,
      protein: 45,
      prep: "15 min",
      ingredients: "Bagel complet, 2 oeufs, bacon de dinde, cheddar leger, salade",
      image: ""
    },
    {
      id: "dinner-chicken-parmesan",
      name: "Poulet parmesan du soir",
      slot: "soir",
      category: "Soir gourmand propre",
      calories: 780,
      protein: 55,
      prep: "25 min",
      ingredients: "180 g poulet, parmesan, sauce tomate maison, pates completes",
      image: ""
    },
    {
      id: "dinner-shrimp-lemon",
      name: "Crevettes ail citron & riz",
      slot: "soir",
      category: "Soir gourmand propre",
      calories: 670,
      protein: 45,
      prep: "18 min",
      ingredients: "200 g crevettes, riz basmati, ail, citron, legumes verts",
      image: ""
    },
    {
      id: "dinner-croque",
      name: "Croque monsieur fitness",
      slot: "soir",
      category: "Soir gourmand propre",
      calories: 690,
      protein: 45,
      prep: "12 min",
      ingredients: "Pain complet, jambon de poulet, fromage leger, oeuf, salade",
      image: ""
    },
    {
      id: "dinner-teriyaki",
      name: "Poulet teriyaki maison",
      slot: "soir",
      category: "Soir gourmand propre",
      calories: 730,
      protein: 50,
      prep: "22 min",
      ingredients: "180 g poulet, riz, brocolis, soja legere, miel leger, ail, gingembre",
      image: ""
    },
    {
      id: "dinner-salmon-avocado",
      name: "Bowl saumon avocat riz",
      slot: "soir",
      category: "Soir gourmand propre",
      calories: 780,
      protein: 42,
      prep: "20 min",
      ingredients: "150 g saumon, riz, avocat, concombre, edamame",
      image: ""
    },
    {
      id: "dinner-quesadillas",
      name: "Quesadillas proteinees",
      slot: "soir",
      category: "Soir gourmand propre",
      calories: 740,
      protein: 50,
      prep: "18 min",
      ingredients: "Tortillas completes, poulet, cheddar leger, poivrons, salsa legere",
      image: ""
    },
    {
      id: "dinner-chili",
      name: "Chili con carne du soir",
      slot: "soir",
      category: "Soir gourmand propre",
      calories: 770,
      protein: 48,
      prep: "25 min",
      ingredients: "Steak 5 %, haricots rouges, tomates, riz, cheddar leger",
      image: ""
    },
    {
      id: "dinner-cod-crispy",
      name: "Cabillaud croustillant & potatoes",
      slot: "soir",
      category: "Soir gourmand propre",
      calories: 680,
      protein: 48,
      prep: "25 min",
      ingredients: "200 g cabillaud, pommes de terre au four, salade verte, sauce tartare legere fromage blanc",
      image: ""
    },
    {
      id: "dinner-burrata-pasta",
      name: "Pates tomate burrata proteinees",
      slot: "soir",
      category: "Soir gourmand propre",
      calories: 800,
      protein: 52,
      prep: "20 min",
      ingredients: "Pates completes, blanc de poulet, burrata legere, tomates cerises, basilic",
      image: ""
    },
    {
      id: "breakfast-skyr-granola",
      name: "Bowl skyr banane granola",
      slot: "petit-dej",
      category: "Petit dej gourmand propre",
      calories: 620,
      protein: 35,
      prep: "5 min",
      ingredients: "250 g skyr, 60 g flocons d'avoine, 1 banane, 15 g beurre de cacahuete, cannelle",
      image: ""
    },
    {
      id: "breakfast-protein-pancakes",
      name: "Pancakes proteines",
      slot: "petit-dej",
      category: "Petit dej gourmand propre",
      calories: 650,
      protein: 42,
      prep: "15 min",
      ingredients: "2 oeufs, 150 g blancs d'oeufs, 60 g flocons d'avoine, 1 banane, cannelle, skyr, fruits rouges",
      image: ""
    },
    {
      id: "breakfast-avocado-salmon-toast",
      name: "Toast avocat oeufs saumon",
      slot: "petit-dej",
      category: "Petit dej gourmand propre",
      calories: 680,
      protein: 38,
      prep: "10 min",
      ingredients: "2 tranches pain complet, 2 oeufs, 80 g saumon fume, 50 g avocat",
      image: ""
    },
    {
      id: "breakfast-bagel-chicken",
      name: "Bagel proteine complet",
      slot: "petit-dej",
      category: "Petit dej gourmand propre",
      calories: 700,
      protein: 45,
      prep: "10 min",
      ingredients: "1 bagel complet, 120 g blanc de poulet, cheddar leger, salade, tomates",
      image: ""
    },
    {
      id: "breakfast-overnight-oats",
      name: "Overnight oats proteines",
      slot: "petit-dej",
      category: "Petit dej gourmand propre",
      calories: 590,
      protein: 38,
      prep: "5 min",
      ingredients: "60 g flocons d'avoine, 250 g skyr, 100 ml lait, fruits rouges, miel leger",
      image: ""
    },
    {
      id: "breakfast-omelette",
      name: "Omelette complete musculation",
      slot: "petit-dej",
      category: "Petit dej gourmand propre",
      calories: 650,
      protein: 45,
      prep: "12 min",
      ingredients: "3 oeufs, 150 g blancs d'oeufs, fromage leger, pain complet",
      image: ""
    },
    {
      id: "breakfast-french-toast",
      name: "French toast healthy",
      slot: "petit-dej",
      category: "Petit dej gourmand propre",
      calories: 670,
      protein: 40,
      prep: "12 min",
      ingredients: "3 tranches pain complet, 2 oeufs, cannelle, skyr, fruits rouges",
      image: ""
    },
    {
      id: "breakfast-choco-peanut",
      name: "Bowl chocolat beurre de cacahuete",
      slot: "petit-dej",
      category: "Petit dej gourmand propre",
      calories: 640,
      protein: 35,
      prep: "5 min",
      ingredients: "250 g fromage blanc, 60 g flocons d'avoine, cacao non sucre, 15 g beurre de cacahuete, banane",
      image: ""
    },
    {
      id: "breakfast-english-muffin",
      name: "Muffins anglais oeufs bacon de dinde",
      slot: "petit-dej",
      category: "Petit dej gourmand propre",
      calories: 690,
      protein: 42,
      prep: "12 min",
      ingredients: "Muffin anglais complet, 2 oeufs, bacon de dinde, cheddar leger",
      image: ""
    },
    {
      id: "breakfast-smoothie",
      name: "Smoothie proteine complet",
      slot: "petit-dej",
      category: "Petit dej gourmand propre",
      calories: 600,
      protein: 38,
      prep: "5 min",
      ingredients: "250 g skyr, banane, fruits rouges, 40 g flocons d'avoine, lait",
      image: ""
    },
    {
      id: "breakfast-burrito",
      name: "Breakfast burrito fitness",
      slot: "petit-dej",
      category: "Petit dej gourmand propre",
      calories: 720,
      protein: 50,
      prep: "15 min",
      ingredients: "Tortilla complete, 2 oeufs, blancs d'oeufs, blanc de poulet, fromage leger",
      image: ""
    },
    {
      id: "breakfast-greek-apple",
      name: "Yaourt grec pommes cannelle",
      slot: "petit-dej",
      category: "Petit dej gourmand propre",
      calories: 610,
      protein: 35,
      prep: "5 min",
      ingredients: "250 g yaourt grec leger, pommes, cannelle, granola proteine",
      image: ""
    },
    {
      id: "snack-skyr-banana",
      name: "Skyr banane",
      slot: "collation",
      category: "Collation proteinee",
      calories: 250,
      protein: 25,
      prep: "2 min",
      ingredients: "250 g skyr, 1 banane",
      image: ""
    },
    {
      id: "snack-fromage-berries",
      name: "Fromage blanc fruits rouges",
      slot: "collation",
      category: "Collation proteinee",
      calories: 220,
      protein: 22,
      prep: "3 min",
      ingredients: "250 g fromage blanc, fruits rouges, miel leger",
      image: ""
    },
    {
      id: "snack-shake-simple",
      name: "Shake proteine simple",
      slot: "collation",
      category: "Collation proteinee",
      calories: 220,
      protein: 30,
      prep: "2 min",
      ingredients: "Whey, lait, glacons",
      image: ""
    },
    {
      id: "snack-almond-greek",
      name: "Amandes & yaourt grec",
      slot: "collation",
      category: "Collation proteinee",
      calories: 320,
      protein: 22,
      prep: "2 min",
      ingredients: "20 g amandes, 200 g yaourt grec leger",
      image: ""
    },
    {
      id: "snack-peanut-toast",
      name: "Toast beurre de cacahuete banane",
      slot: "collation",
      category: "Collation proteinee",
      calories: 350,
      protein: 15,
      prep: "5 min",
      ingredients: "2 tranches pain complet, beurre de cacahuete, banane",
      image: ""
    },
    {
      id: "snack-cold-wrap",
      name: "Wrap proteine froid",
      slot: "collation",
      category: "Collation proteinee",
      calories: 330,
      protein: 28,
      prep: "5 min",
      ingredients: "Tortilla complete, blanc de poulet, fromage frais leger, salade",
      image: ""
    },
    {
      id: "snack-eggs-fruit",
      name: "Oeufs durs & fruit",
      slot: "collation",
      category: "Collation proteinee",
      calories: 240,
      protein: 14,
      prep: "8 min",
      ingredients: "2 oeufs durs, 1 pomme",
      image: ""
    },
    {
      id: "snack-skyr-choco",
      name: "Skyr chocolat crunchy",
      slot: "collation",
      category: "Collation proteinee",
      calories: 320,
      protein: 27,
      prep: "3 min",
      ingredients: "250 g skyr, cacao non sucre, granola proteine",
      image: ""
    },
    {
      id: "snack-chia-pudding",
      name: "Pudding chia proteine",
      slot: "collation",
      category: "Collation proteinee",
      calories: 340,
      protein: 24,
      prep: "5 min",
      ingredients: "Graines de chia, lait, skyr, fruits rouges",
      image: ""
    },
    {
      id: "snack-light-bagel",
      name: "Bagel poulet leger",
      slot: "collation",
      category: "Collation proteinee",
      calories: 360,
      protein: 30,
      prep: "5 min",
      ingredients: "Demi bagel complet, blanc de poulet, fromage leger",
      image: ""
    },
    {
      id: "snack-greek-honey-nuts",
      name: "Yaourt grec miel noix",
      slot: "collation",
      category: "Collation proteinee",
      calories: 330,
      protein: 20,
      prep: "3 min",
      ingredients: "200 g yaourt grec, miel leger, noix",
      image: ""
    },
    {
      id: "snack-post-training",
      name: "Smoothie post training",
      slot: "collation",
      category: "Collation proteinee",
      calories: 420,
      protein: 35,
      prep: "4 min",
      ingredients: "Whey, banane, lait, flocons d'avoine",
      image: ""
    },
    {
      id: "snack-protein-rice-pudding",
      name: "Riz au lait proteine",
      slot: "collation",
      category: "Collation proteinee",
      calories: 350,
      protein: 25,
      prep: "10 min",
      ingredients: "Riz, lait, whey vanille, cannelle",
      image: ""
    },
    {
      id: "snack-fast-sandwich",
      name: "Sandwich proteine rapide",
      slot: "collation",
      category: "Collation proteinee",
      calories: 380,
      protein: 32,
      prep: "5 min",
      ingredients: "Pain complet, blanc de poulet, cheddar leger",
      image: ""
    },
    {
      id: "snack-homemade-bar",
      name: "Barre proteinee maison",
      slot: "collation",
      category: "Collation proteinee",
      calories: 320,
      protein: 24,
      prep: "10 min",
      ingredients: "Flocons d'avoine, beurre de cacahuete, whey, miel leger",
      image: ""
    }
  ],
  foodGroups: [
    {
      id: "food-protein",
      name: "Proteines",
      items: ["Poulet", "Dinde", "Oeufs", "Thon", "Saumon", "Skyr"],
      tone: "text-red-300"
    },
    {
      id: "food-carbs",
      name: "Glucides",
      items: ["Riz", "Pommes de terre", "Patate douce", "Avoine", "Pain complet"],
      tone: "text-amber-200"
    },
    {
      id: "food-veg",
      name: "Legumes",
      items: ["Brocoli", "Courgettes", "Epinards", "Haricots verts", "Salade"],
      tone: "text-emerald-300"
    },
    {
      id: "food-fat",
      name: "Bons lipides",
      items: ["Avocat", "Huile d'olive", "Amandes", "Noix", "Saumon"],
      tone: "text-cyan-200"
    },
    {
      id: "food-limit",
      name: "A limiter",
      items: ["Sodas", "Alcool", "Snacks frits", "Sauces sucrees", "Patisseries"],
      tone: "text-orange-300"
    }
  ],
  tracking: {
    [todayIso]: {
      date: todayIso,
      calories: 0,
      protein: 0,
      workoutId: "",
      weight: 0,
      waist: 0,
      validated: false,
      photoBefore: "",
      photoAfter: ""
    }
  }
};

const key = "fit-transform-state-v5";

export function useFitnessStore() {
  const [state, setState] = useState<FitnessState>(defaultFitnessState);
  const [ready, setReady] = useState(false);
  const [remoteReady, setRemoteReady] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [syncStatus, setSyncStatus] = useState<SyncStatus>("local");
  const userId = user?.id ?? "";
  const stateRef = useRef(state);
  const lastSavedRef = useRef("");
  const saveTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    stateRef.current = state;
  }, [state]);

  useEffect(() => {
    try {
      const saved = window.localStorage.getItem(key);
      if (saved) {
        setState(normalizeState(JSON.parse(saved) as Partial<FitnessState>));
      }
    } catch (error) {
      console.error(error);
      window.localStorage.removeItem(key);
    }

    setReady(true);
  }, []);

  useEffect(() => {
    let mounted = true;
    let unsubscribe: (() => void) | undefined;

    if (!isSupabaseConfigured()) {
      setRemoteReady(true);
      setSyncStatus("local");
      return () => {
        mounted = false;
      };
    }

    try {
      const supabase = createSupabaseBrowserClient();

      supabase.auth
        .getSession()
        .then(({ data, error }) => {
          if (!mounted) {
            return;
          }

          if (error) {
            console.error(error);
            setRemoteReady(true);
            setSyncStatus("error");
            return;
          }

          const sessionUser = data.session?.user ?? null;
          setUser(sessionUser);
          setRemoteReady(!sessionUser);
          setSyncStatus(sessionUser ? "loading" : "local");
        })
        .catch((error) => {
          console.error(error);
          setRemoteReady(true);
          setSyncStatus("error");
        });

      const { data } = supabase.auth.onAuthStateChange((_event, session) => {
        const sessionUser = session?.user ?? null;
        setUser(sessionUser);
        setRemoteReady(!sessionUser);
        setSyncStatus(sessionUser ? "loading" : "local");
      });

      unsubscribe = () => data.subscription.unsubscribe();
    } catch (error) {
      console.error(error);
      setRemoteReady(true);
      setSyncStatus("local");
    }

    return () => {
      mounted = false;
      unsubscribe?.();
    };
  }, []);

  useEffect(() => {
    if (!ready || !userId || !isSupabaseConfigured()) {
      return;
    }

    let supabase: ReturnType<typeof createSupabaseBrowserClient>;
    try {
      supabase = createSupabaseBrowserClient();
    } catch (error) {
      console.error(error);
      setRemoteReady(true);
      setSyncStatus("local");
      return;
    }

    const currentUserId = userId;
    let cancelled = false;

    async function loadRemoteState() {
      setSyncStatus("loading");

      try {
        const { data, error } = await supabase
          .from("app_state")
          .select("state")
          .eq("user_id", currentUserId)
          .maybeSingle();

        if (cancelled) {
          return;
        }

        if (error) {
          console.error(error);
          setRemoteReady(true);
          setSyncStatus("error");
          return;
        }

        if (data?.state) {
          const remoteState = normalizeState(data.state as Partial<FitnessState>);
          const serialized = JSON.stringify(remoteState);
          lastSavedRef.current = serialized;
          setState(remoteState);
          window.localStorage.setItem(key, serialized);
          setSyncStatus("synced");
        } else {
          const currentState = stateRef.current;
          const serialized = JSON.stringify(currentState);
          lastSavedRef.current = serialized;
          await supabase.from("app_state").upsert(
            {
              user_id: currentUserId,
              state: currentState as unknown as Json
            },
            { onConflict: "user_id" }
          );
          setSyncStatus("synced");
        }

        setRemoteReady(true);
      } catch (error) {
        console.error(error);
        setRemoteReady(true);
        setSyncStatus("error");
      }
    }

    loadRemoteState();

    return () => {
      cancelled = true;
    };
  }, [ready, userId]);

  useEffect(() => {
    if (!ready) {
      return;
    }

    const serialized = JSON.stringify(state);
    window.localStorage.setItem(key, serialized);

    if (!user || !isSupabaseConfigured()) {
      setSyncStatus("local");
      return;
    }

    const currentUser = user;

    if (!remoteReady || serialized === lastSavedRef.current) {
      return;
    }

    if (saveTimerRef.current) {
      clearTimeout(saveTimerRef.current);
    }

    setSyncStatus("saving");
    saveTimerRef.current = setTimeout(async () => {
      try {
        const supabase = createSupabaseBrowserClient();
        const { error } = await supabase.from("app_state").upsert(
          {
            user_id: currentUser.id,
            state: state as unknown as Json
          },
          { onConflict: "user_id" }
        );

        if (error) {
          console.error(error);
          setSyncStatus("error");
          return;
        }

        lastSavedRef.current = serialized;
        setSyncStatus("synced");
      } catch (error) {
        console.error(error);
        setSyncStatus("error");
      }
    }, 700);

    return () => {
      if (saveTimerRef.current) {
        clearTimeout(saveTimerRef.current);
      }
    };
  }, [ready, remoteReady, state, user]);

  const api = useMemo(
    () => ({
      state,
      user,
      syncStatus,
      isAuthenticated: Boolean(user),
      setProfile: (profile: Profile) => setState((current) => ({ ...current, profile })),
      updateDay: (date: string, patch: Partial<DayTracking>) =>
        setState((current) => ({
          ...current,
          tracking: {
            ...current.tracking,
            [date]: {
              ...(current.tracking[date] ?? emptyDay(date)),
              ...patch
            }
          }
        })),
      setWorkout: (workout: Workout) =>
        setState((current) => ({
          ...current,
          workouts: current.workouts.map((item) => (item.id === workout.id ? workout : item))
        })),
      addExercise: (workoutId: string) =>
        setState((current) => ({
          ...current,
          workouts: current.workouts.map((workout) =>
            workout.id === workoutId
              ? {
                  ...workout,
                  exercises: [
                    ...workout.exercises,
                    {
                      id: crypto.randomUUID(),
                      name: "Nouvel exercice",
                      sets: 3,
                      reps: "8-12",
                      rest: "90 sec",
                      muscles: "",
                      tips: "",
                      mistakes: "",
                      demo: "",
                      weightUsed: "",
                      repsDone: "",
                      completed: false
                    }
                  ]
                }
              : workout
          )
        })),
      setMeal: (meal: Meal) =>
        setState((current) => ({
          ...current,
          meals: current.meals.map((item) => (item.id === meal.id ? meal : item))
        })),
      deleteMeal: (mealId: string) =>
        setState((current) => ({
          ...current,
          meals: current.meals.filter((meal) => meal.id !== mealId)
        })),
      addMeal: (slot: Meal["slot"] = "midi") =>
        setState((current) => ({
          ...current,
          meals: [
            {
              id: crypto.randomUUID(),
              name: "Nouvelle recette",
              slot,
              category: "Meal prep",
              calories: 500,
              protein: 35,
              prep: "15 min",
              ingredients: "",
              image: ""
            },
            ...current.meals
          ]
        })),
      setFoodGroup: (group: FoodGroup) =>
        setState((current) => ({
          ...current,
          foodGroups: current.foodGroups.map((item) => (item.id === group.id ? group : item))
        })),
      addFoodGroup: () =>
        setState((current) => ({
          ...current,
          foodGroups: [
            {
              id: crypto.randomUUID(),
              name: "Nouvelle categorie",
              items: ["Nouvel aliment"],
              tone: "text-primary"
            },
            ...current.foodGroups
          ]
        })),
      addFoodItem: (groupId: string) =>
        setState((current) => ({
          ...current,
          foodGroups: current.foodGroups.map((group) =>
            group.id === groupId ? { ...group, items: [...group.items, "Nouvel aliment"] } : group
          )
        })),
      reset: () => setState(defaultFitnessState)
    }),
    [state, syncStatus, user]
  );

  return api;
}

export function emptyDay(date: string): DayTracking {
  return {
    date,
    calories: 0,
    protein: 0,
    workoutId: "",
    weight: 0,
    waist: 0,
    validated: false,
    photoBefore: "",
    photoAfter: ""
  };
}

export function localDateIso(date = new Date()) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

export function dateFromIso(iso: string) {
  const [year, month, day] = iso.split("-").map(Number);
  return new Date(year, month - 1, day);
}

export function weekDates(from = new Date()) {
  const monday = new Date(from);
  const day = monday.getDay() || 7;
  monday.setDate(monday.getDate() - day + 1);

  return Array.from({ length: 7 }, (_, index) => {
    const date = new Date(monday);
    date.setDate(monday.getDate() + index);
    return localDateIso(date);
  });
}

export function monthSundays(from = new Date()) {
  const first = new Date(from.getFullYear(), from.getMonth(), 1);
  const result: string[] = [];
  const cursor = new Date(first);

  while (cursor.getMonth() === from.getMonth()) {
    if (cursor.getDay() === 0) {
      result.push(localDateIso(cursor));
    }
    cursor.setDate(cursor.getDate() + 1);
  }

  return result;
}

function normalizeState(saved: Partial<FitnessState>): FitnessState {
  const savedMeals = saved.meals?.map((meal) => ({
    ...meal,
    slot: meal.slot ?? "midi"
  })) as Meal[] | undefined;
  const mergedMeals = [
    ...(savedMeals ?? []),
    ...defaultFitnessState.meals.filter(
      (defaultMeal) => !(savedMeals ?? []).some((meal) => meal.id === defaultMeal.id)
    )
  ];

  return {
    ...defaultFitnessState,
    ...saved,
    profile: {
      ...defaultFitnessState.profile,
      ...saved.profile
    },
    workouts: saved.workouts ?? defaultFitnessState.workouts,
    meals: mergedMeals,
    foodGroups: saved.foodGroups ?? defaultFitnessState.foodGroups,
    tracking: {
      ...defaultFitnessState.tracking,
      ...(saved.tracking ?? {})
    }
  };
}
