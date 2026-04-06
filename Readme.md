# CrossFit Competition Platform (Open Source)

## Overview

Plateforme open source dédiée exclusivement à la gestion complète des compétitions de CrossFit.

Objectif : fournir un système standardisé couvrant tout le cycle de vie d’un événement :

- publication d’événements
- gestion des inscriptions (individuel / team)
- qualifications (optionnel)
- exécution opérationnelle le jour J
- scoring en temps réel
- leaderboards publics live

---

## Core Principles

- Standardisation maximale des formats CrossFit
- Temps réel natif (scores, rankings, heats)
- Auditabilité complète (historique, corrections, versioning)
- Modularité stricte (architecture découplée)
- Source de vérité unique (scores, inscriptions, rankings)
- Robustesse terrain (latence, erreurs humaines, corrections)

---

## Functional Modules

### 1. Identity & Roles
Gestion des utilisateurs et permissions.

### 2. Organizer Management
Gestion des organisateurs et de leurs événements.

### 3. Event Creation & Publication
Création structurée d’événements.

### 4. Divisions & Categories
RX / Scaled / Masters / Teams / etc.

### 5. Registration & Payments
Inscriptions + paiement.

### 6. Qualification System
Phases online / leaderboard de qualification.

### 7. Competition Programming (WODs)
Définition des workouts.

### 8. Scheduling & Heats
Planning, heats, lanes.

### 9. Scoring Engine
Calcul des scores et ranking.

### 10. Leaderboards
Classements temps réel.

### 11. Public Pages
Pages publiques événements + résultats.

### 12. Notifications
Emails / updates système.

### 13. Admin & Audit
Historique, corrections, logs.

### 14. Analytics
Données événement / participation.

---

## User Roles

### Organizer
- créer et gérer un événement
- définir divisions, WODs, planning
- gérer inscriptions et validations
- corriger scores

### Staff
- assister à l’organisation
- gérer heats / check-in
- superviser exécution

### Judge
- saisir les scores
- valider performances

### Athlete (Individual)
- s’inscrire
- participer aux WODs
- consulter résultats

### Team / Captain
- créer équipe
- gérer membres
- inscrire équipe

### Public User
- consulter événements
- consulter leaderboards live

---

## Competition Model

### Formats
- Individual
- Team
- Mixed

### WOD Types
- Time (for time)
- AMRAP
- EMOM
- Load (1RM, max weight)
- Interval
- Skill-based

### Scoring
- Rank-based
- Points system
- Tie-break support

### Structure
- Phases (qualification / finale)
- Heats
- Lanes
- Cuts (eliminations)

---

## Workflows

### Organizer Flow
1. Création événement
2. Définition divisions
3. Configuration WODs
4. Ouverture inscriptions
5. (Optionnel) qualifications
6. Génération planning / heats
7. Exécution compétition
8. Validation scores
9. Publication résultats

### Athlete Flow
1. Création compte
2. Inscription (indiv ou team)
3. Paiement
4. Participation aux WODs
5. Consultation leaderboard

### Judge Flow
1. Accès aux heats assignés
2. Saisie des scores
3. Validation / correction

### Public Flow
1. Consultation événement
2. Consultation leaderboard live
3. Suivi des heats

---

## Data Model (Simplified)

### Core Entities

- User
- Role
- Organizer
- Event
- Division
- Category
- Registration
- Team
- AthleteProfile
- WOD
- Score
- Heat
- Lane
- Leaderboard
- Payment
- QualificationResult
- AuditLog

### Key Relations

- Event → Divisions
- Division → WODs
- Event → Registrations
- Registration → Athlete / Team
- WOD → Scores
- Heat → Athletes / Teams
- Score → Athlete / Team / WOD
- Leaderboard ← Scores

---

## Business Rules

- un score appartient à un WOD + un participant
- un leaderboard est dérivé, jamais édité directement
- toute modification de score est historisée
- un athlète ne peut être inscrit qu’une fois par division
- une équipe a un captain unique
- un WOD a un type strict (time / AMRAP / load…)

---

## Edge Cases

- correction de score après publication
- égalités (tie-break)
- absence athlète
- disqualification
- panne réseau (saisie offline à synchroniser)
- modification de planning en live
- suppression d’un WOD
- changement de division post-inscription

---

## MVP Scope

- création d’événement
- divisions standardisées
- inscriptions (indiv + team)
- paiements simples
- configuration WODs
- génération heats basique
- saisie des scores
- leaderboard live
- pages publiques

---

## Post-MVP

- qualification online avancée
- multi-phase competitions
- automatisation des heats avancée
- scoring custom avancé
- notifications temps réel
- analytics détaillés
- API publique
- intégration streaming / live

---

## Out of Scope

- social network
- marketplace
- programmation d’entraînement
- coaching
- contenu média

---

## Technical Architecture

### Backend
- API REST / GraphQL
- services modulaires
- event-driven pour scoring live

### Frontend
- dashboard organisateur
- interface juge mobile-first
- pages publiques SSR

### Realtime
- WebSockets / PubSub
- sync leaderboard

### Database
- relationnel (PostgreSQL)
- audit logs versionnés

---

## Key Constraints

- cohérence concurrente des scores
- latence minimale pour leaderboard
- traçabilité complète
- tolérance aux erreurs terrain

---

## Code Generation (Codex)

Chaque module doit être implémentable via prompts structurés incluant :

- définition des entités
- endpoints API
- règles métier explicites
- validations
- gestion des erreurs

---

## License

Open source (à définir : MIT / Apache 2.0 recommandé)

---

## Vision

Devenir le standard universel pour :

- organiser une compétition CrossFit
- comparer des performances entre événements
- centraliser les résultats à l’échelle globale
