# Vidy — Suivi d’habitudes & focus (React Native / Expo)

> **Vidy** ("prêt / accompli" en malgache) est une application mobile de suivi
> d’habitudes : cochez vos routines du jour, entretenez vos séries (streaks) et
> recevez des rappels locaux. Conçue et développée avec React Native + Expo et
> TypeScript, 100 % hors-ligne.

<p>
  <img alt="Expo SDK 52" src="https://img.shields.io/badge/Expo-SDK%2052-000?logo=expo">
  <img alt="React Native" src="https://img.shields.io/badge/React%20Native-0.76-61dafb?logo=react">
  <img alt="TypeScript" src="https://img.shields.io/badge/TypeScript-strict-3178c6?logo=typescript">
  <img alt="license" src="https://img.shields.io/badge/license-MIT-green">
</p>

## ✨ Fonctionnalités

- 🗓️ Vue du jour avec **anneau de progression animé** (Reanimated) et pourcentage de complétion
- ✅ Complétion d’une habitude en un tap, avec **retour haptique**
- 🔥 Calcul des **séries en cours** et du **meilleur record** par habitude
- ➕ Création d’habitudes : nom, emoji, couleur, fréquence et heure de rappel
- 🔔 **Notifications locales** quotidiennes planifiées par habitude (expo-notifications)
- 📴 100 % hors-ligne : stockage local **SQLite** via **Drizzle ORM** (requêtes réactives `useLiveQuery`)
- 🌗 Thème clair / sombre automatique
- 🇫🇷 Interface entièrement en français (dates via `date-fns` / locale `fr`)

## 🧱 Stack technique

| Domaine         | Choix |
|-----------------|-------|
| Framework       | React Native 0.76 + Expo SDK 52 (New Architecture) |
| Langage         | TypeScript (mode `strict`) |
| Navigation      | expo-router (typed routes) |
| Base de données | expo-sqlite + Drizzle ORM |
| State           | Zustand |
| Animations      | Reanimated 3 |
| Notifications   | expo-notifications + expo-haptics |
| Dates           | date-fns (locale `fr`) |
| Qualité         | Jest + Testing Library, ESLint, GitHub Actions |

## 🏗️ Architecture

```
app/                      # Routes (expo-router)
  _layout.tsx             # Stack racine + migration DB + config notifications
  (tabs)/                 # Onglets : Aujourd’hui, Habitudes, Réglages
    index.tsx             # Vue du jour : anneau de progression + toggles
    habits.tsx            # CRUD des habitudes + séries (streaks)
    settings.tsx          # Rappel par défaut, haptique, thème, version
  modals/new-habit.tsx    # Création d’une habitude + planification du rappel
src/
  components/             # UI réutilisable (Card, HabitRow, ProgressRing)
  db/                     # Schéma Drizzle + client SQLite + migration initiale
  store/                  # Zustand (préférences)
  lib/                    # streak (+ tests), notifications, dates
  theme/                  # Design tokens + hook de thème
```

## 🚀 Démarrage

```bash
npm install
npm start          # puis 'i' (iOS), 'a' (Android) ou scanner le QR avec Expo Go
```

### Scripts

```bash
npm run typecheck  # vérification TypeScript
npm run lint       # ESLint
npm test           # tests unitaires (Jest)
npm run db:generate# génération des migrations Drizzle
```

## 🧪 Tests

La logique de calcul des séries (`src/lib/streak.ts`) est couverte par des tests
unitaires (`src/lib/streak.test.ts`) : série continue, série cassée, jour du
présent non encore complété, doublons et indépendance à l’ordre des dates.

## 🗺️ Roadmap

- [ ] Historique en calendrier (heatmap type GitHub)
- [ ] Habitudes hebdomadaires avec objectif de X fois / semaine
- [ ] Statistiques et graphiques de progression
- [ ] Widgets écran d’accueil
- [ ] Synchronisation cloud optionnelle (Supabase)

## 📄 Licence

MIT © [ADH Studio](https://github.com/adh-studio) — Henintsoa Andriamaholy
