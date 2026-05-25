import {
  Activity,
  Apple,
  Beef,
  CalendarCheck,
  Dumbbell,
  Flame,
  Goal,
  Leaf,
  Scale,
  Utensils,
  Wheat,
  Zap
} from "lucide-react";

export const profile = {
  height: "1m83",
  currentWeight: 75,
  targetWeight: 72,
  caloriesGoal: 2300,
  proteinGoal: 150,
  trainingFrequency: 3,
  physiqueGoal: "Physique sec et athlétique"
};

export const today = {
  calories: 1850,
  protein: 120,
  workout: "Séance A - Pecs lourds",
  weeklyProgress: 76,
  weight: 75
};

export const weeklyNutrition = [
  { day: "Lun", calories: 2180, protein: 146 },
  { day: "Mar", calories: 2260, protein: 152 },
  { day: "Mer", calories: 1990, protein: 133 },
  { day: "Jeu", calories: 2310, protein: 158 },
  { day: "Ven", calories: 1850, protein: 120 },
  { day: "Sam", calories: 0, protein: 0 },
  { day: "Dim", calories: 0, protein: 0 }
];

export const workouts = [
  {
    code: "A",
    title: "Pecs lourds",
    focus: "Pecs, épaules, triceps, abdos",
    duration: "65 min",
    exercises: [
      {
        name: "Développé couché barre",
        sets: 4,
        reps: "5-8",
        rest: "2 min 30",
        muscles: ["Pectoraux", "Triceps", "Épaules avant"],
        tips: "Omoplates serrées, trajectoire contrôlée, pieds ancrés.",
        mistakes: "Rebondir sur la poitrine, coudes trop ouverts, fesses décollées.",
        demo: "https://media.giphy.com/media/3o7TKQ7yuCKEEW72nK/giphy.gif"
      },
      {
        name: "Développé incliné haltères",
        sets: 3,
        reps: "8-10",
        rest: "2 min",
        muscles: ["Haut des pecs", "Épaules"],
        tips: "Descente lente, haltères alignés au haut de poitrine.",
        mistakes: "Inclinaison trop haute, amplitude raccourcie."
      },
      {
        name: "Élévations latérales",
        sets: 4,
        reps: "12-18",
        rest: "75 sec",
        muscles: ["Deltoïdes moyens"],
        tips: "Mains légèrement devant le corps, tempo propre.",
        mistakes: "Balancer le dos, monter les épaules vers les oreilles."
      },
      {
        name: "Extensions triceps poulie",
        sets: 3,
        reps: "10-14",
        rest: "75 sec",
        muscles: ["Triceps"],
        tips: "Coudes fixes, verrouillage fort en bas.",
        mistakes: "Avancer les épaules, charger trop lourd."
      },
      {
        name: "Crunch câble",
        sets: 3,
        reps: "12-15",
        rest: "60 sec",
        muscles: ["Abdos"],
        tips: "Enrouler la colonne, expiration complète.",
        mistakes: "Tirer avec les bras, garder le dos plat."
      }
    ]
  },
  {
    code: "B",
    title: "Dos & biceps",
    focus: "Dos, biceps, rappel pec léger, abdos",
    duration: "60 min",
    exercises: [
      {
        name: "Tractions pronation",
        sets: 4,
        reps: "6-10",
        rest: "2 min",
        muscles: ["Grand dorsal", "Biceps"],
        tips: "Tirer les coudes vers les hanches, poitrine ouverte.",
        mistakes: "Demi-amplitude, menton projeté en avant."
      },
      {
        name: "Rowing poulie basse",
        sets: 4,
        reps: "8-12",
        rest: "90 sec",
        muscles: ["Milieu du dos", "Trapèzes"],
        tips: "Pause d'une seconde en contraction.",
        mistakes: "Tirer avec les lombaires, arrondir le dos."
      },
      {
        name: "Écarté poulie léger",
        sets: 3,
        reps: "14-18",
        rest: "60 sec",
        muscles: ["Pectoraux"],
        tips: "Chercher l'étirement sans casser les coudes.",
        mistakes: "Transformer le mouvement en développé."
      },
      {
        name: "Curl incliné haltères",
        sets: 3,
        reps: "10-12",
        rest: "75 sec",
        muscles: ["Biceps"],
        tips: "Épaules en arrière, supination complète.",
        mistakes: "Balancer les coudes, remonter trop vite."
      },
      {
        name: "Relevés de jambes",
        sets: 3,
        reps: "10-15",
        rest: "60 sec",
        muscles: ["Bas des abdos"],
        tips: "Contrôler la descente, bassin rétroversé.",
        mistakes: "Creuser le bas du dos."
      }
    ]
  },
  {
    code: "C",
    title: "Haut du corps complet",
    focus: "Haut des pecs, dos largeur, épaules, bras, abdos",
    duration: "70 min",
    exercises: [
      {
        name: "Développé incliné machine",
        sets: 4,
        reps: "8-10",
        rest: "2 min",
        muscles: ["Haut des pecs"],
        tips: "Rester collé au dossier, pousser en arc naturel.",
        mistakes: "Épaules qui prennent tout le mouvement."
      },
      {
        name: "Tirage vertical neutre",
        sets: 4,
        reps: "8-12",
        rest: "90 sec",
        muscles: ["Dos largeur"],
        tips: "Épaules basses, coudes sous la barre.",
        mistakes: "Tirer derrière la nuque, utiliser l'élan."
      },
      {
        name: "Développé épaules haltères",
        sets: 3,
        reps: "8-10",
        rest: "2 min",
        muscles: ["Épaules", "Triceps"],
        tips: "Gainage solide, trajectoire verticale.",
        mistakes: "Cambrer fort, verrouiller violemment."
      },
      {
        name: "Superset curl + extension",
        sets: 3,
        reps: "10-12",
        rest: "90 sec",
        muscles: ["Biceps", "Triceps"],
        tips: "Qualité avant charge, reps nettes.",
        mistakes: "Perdre la posture en fin de série."
      },
      {
        name: "Planche lestée",
        sets: 3,
        reps: "40-60 sec",
        rest: "60 sec",
        muscles: ["Abdos", "Gainage"],
        tips: "Bassin neutre, respiration calme.",
        mistakes: "Hanches basses, tension dans la nuque."
      }
    ]
  }
];

export const meals = [
  {
    name: "Poulet pommes de terre légumes",
    category: "Repas riches en protéines",
    calories: 620,
    protein: 52,
    prep: "25 min",
    ingredients: ["Poulet", "Pommes de terre", "Brocoli", "Huile d'olive"],
    image: "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=900&q=80"
  },
  {
    name: "Saumon riz courgettes",
    category: "Post training",
    calories: 690,
    protein: 45,
    prep: "22 min",
    ingredients: ["Saumon", "Riz basmati", "Courgettes", "Citron"],
    image: "https://images.unsplash.com/photo-1467003909585-2f8a72700288?auto=format&fit=crop&w=900&q=80"
  },
  {
    name: "Steak patate douce",
    category: "Repas rapides",
    calories: 710,
    protein: 48,
    prep: "20 min",
    ingredients: ["Steak 5%", "Patate douce", "Haricots verts"],
    image: "https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=900&q=80"
  },
  {
    name: "Skyr avoine banane",
    category: "Collations",
    calories: 420,
    protein: 34,
    prep: "5 min",
    ingredients: ["Skyr", "Flocons d'avoine", "Banane", "Cannelle"],
    image: "https://images.unsplash.com/photo-1511690656952-34342bb7c2f2?auto=format&fit=crop&w=900&q=80"
  },
  {
    name: "Thon riz salade",
    category: "Meal prep",
    calories: 540,
    protein: 42,
    prep: "12 min",
    ingredients: ["Thon", "Riz", "Salade", "Tomates"],
    image: "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?auto=format&fit=crop&w=900&q=80"
  },
  {
    name: "Œufs pain complet",
    category: "Repas rapides",
    calories: 510,
    protein: 31,
    prep: "10 min",
    ingredients: ["Œufs", "Pain complet", "Avocat", "Épinards"],
    image: "https://images.unsplash.com/photo-1525351484163-7529414344d8?auto=format&fit=crop&w=900&q=80"
  }
];

export const snacks = [
  { name: "Skyr banane", calories: 220, protein: 22 },
  { name: "Fromage blanc fruits rouges", calories: 190, protein: 18 },
  { name: "Amandes", calories: 180, protein: 6 },
  { name: "Yaourt grec miel", calories: 240, protein: 20 },
  { name: "Shake protéiné", calories: 160, protein: 28 }
];

export const foodGroups = [
  {
    name: "Protéines",
    icon: Beef,
    items: ["Poulet", "Dinde", "Œufs", "Thon", "Saumon", "Skyr"],
    tone: "text-red-300"
  },
  {
    name: "Glucides",
    icon: Wheat,
    items: ["Riz", "Pommes de terre", "Patate douce", "Avoine", "Pain complet"],
    tone: "text-amber-200"
  },
  {
    name: "Légumes",
    icon: Leaf,
    items: ["Brocoli", "Courgettes", "Épinards", "Haricots verts", "Salade"],
    tone: "text-emerald-300"
  },
  {
    name: "Bons lipides",
    icon: Apple,
    items: ["Avocat", "Huile d'olive", "Amandes", "Noix", "Saumon"],
    tone: "text-cyan-200"
  },
  {
    name: "À limiter",
    icon: Zap,
    items: ["Sodas", "Alcool", "Snacks frits", "Sauces sucrées", "Pâtisseries"],
    tone: "text-orange-300"
  }
];

export const progressData = [
  { date: "S1", weight: 77.2, waist: 84, protein: 126, sessions: 2 },
  { date: "S2", weight: 76.5, waist: 83, protein: 138, sessions: 3 },
  { date: "S3", weight: 75.9, waist: 82, protein: 145, sessions: 3 },
  { date: "S4", weight: 75.4, waist: 81.5, protein: 148, sessions: 3 },
  { date: "S5", weight: 75, waist: 81, protein: 150, sessions: 3 }
];

export const dashboardStats = [
  { label: "Calories", value: `${today.calories} / ${profile.caloriesGoal}`, unit: "kcal", icon: Flame },
  { label: "Protéines", value: `${today.protein} / ${profile.proteinGoal}`, unit: "g", icon: Beef },
  { label: "Poids actuel", value: `${profile.currentWeight}`, unit: "kg", icon: Scale },
  { label: "Séance", value: "A", unit: "aujourd'hui", icon: Dumbbell }
];

export const trackingHighlights = [
  { label: "Calories moyennes", value: "2180", icon: Flame },
  { label: "Protéines moyennes", value: "144 g", icon: Beef },
  { label: "Séances réalisées", value: "14", icon: CalendarCheck },
  { label: "Objectif atteint", value: "76%", icon: Goal },
  { label: "Rythme", value: "Stable", icon: Activity },
  { label: "Repas ajoutés", value: "32", icon: Utensils }
];
