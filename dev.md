# 🛠️ nsi-projects — DEV ROADMAP (version interne)

Ce document liste **tout ce qui est à développer**, dans un **ordre logique**,
avec une description technique de chaque fonctionnalité.

Objectif :
- ne rien oublier
- avancer étape par étape
- garder une vision claire du projet

---

## 🧱 PHASE 1 — Fondations indispensables

### 1️⃣ Système de rôles & permissions (core)
**Priorité : MAXIMALE**

#### À faire :
- Revoir complètement le système de promote / demote
- Appliquer strictement les règles validées :
  - Rank 3 : promote 1 → 2 | demote 2 → 1 → 0
  - Rank 4 : promote 0 → 1 | demote 1 → 0
  - Rank 5 : promote 0 → 5 | demote 4 → 0 + Rank 5
- Toute action met à jour :
  - le champ `rank` en DB
  - les permissions RLS associées

#### Contraintes :
- Même sans refresh de session, une requête non autorisée doit échouer
- Le frontend n’est **jamais** une source de vérité

---

### 2️⃣ Affichage des permissions par rank
**Priorité : ÉLEVÉE**

#### À faire :
- Associer chaque rank à une liste claire de permissions
- Afficher ces permissions :
  - dans le profil utilisateur
  - de façon lisible (texte simple)

#### Objectif :
- transparence
- compréhension du rôle par l’utilisateur

---

## 🗃️ PHASE 2 — Refonte de la gestion des projets

### 4️⃣ Vérification d’unicité des titres
**Priorité : ÉLEVÉE**

#### À faire :
- Contrainte d’unicité côté DB
- Vérification côté backend avant update
- Message d’erreur clair si le titre existe déjà

---

## 🟢 PHASE 3 — Guides (Rank 1)

### 5️⃣ Édition contrôlée (Guides)
**Priorité : MOYENNE**

#### À faire :
- Autoriser les Guides à modifier :
  - `short_description`
  - `tags`
- Appliquer les changements directement
- Vérifier permissions via RLS

#### À ne PAS faire :
- pas de report interne
- pas de notes internes
- pas de validation pour l’instant

---

## 🔵 PHASE 4 — Modérateurs (Rank 2)

### 6️⃣ Permissions Modérateurs (état actuel)
**Priorité : MOYENNE**

#### À faire :
- Même permissions que Guides
- Modifier description / tags sans approbation

---

### 7️⃣ (Prévision) Système d’approbation
**Priorité : FAIBLE / FUTUR**

#### À prévoir (pas maintenant) :
- Guides :
  - soumettent une modification
- Modérateurs :
  - approuvent / rejettent
- Système stocké en DB (status pending / approved / rejected)

---

## 🟣 PHASE 5 — Responsables Modérateurs (Rank 3)

### 8️⃣ Édition avancée projets
**Priorité : MOYENNE**

#### À faire :
- Autoriser Rank 3 à modifier :
  - titles
  - descriptions
  - tags
- Application immédiate des changements

---

### 9️⃣ Recrutement & promotion
**Priorité : MOYENNE**

#### À faire :
- Interface pour :
  - recruter un Guide (0 → 1)
  - promouvoir Guide → Modérateur (1 → 2)
- Vérification stricte des permissions

---

## 🔴 PHASE 6 — Administrateurs (Rank 4)

### 🔟 Messages de statut (homepage)
**Priorité : MOYENNE**

#### À faire :
- Champ en DB pour message global
- Affichage sur la page d’accueil
- Édition réservée aux Admins+

Exemples :
- maintenance DB
- bugs possibles
- info importante

---

### 1️⃣1️⃣ Promotions Admin
**Priorité : MOYENNE**

#### À faire :
- Permettre aux Admins :
  - promouvoir 0 → 1
- Démotion limitée :
  - 1 → 0

---

## ⚫ PHASE 7 — Responsables Administrateurs (Rank 5)

### 1️⃣2️⃣ Mode maintenance
**Priorité : MOYENNE**

#### À faire :
- Flag global en DB
- Si actif :
  - site en lecture seule
  - message global visible
- Bypass uniquement pour Rank 5

---

### 1️⃣3️⃣ Promotions critiques
**Priorité : MOYENNE**

#### À faire :
- Interface pour :
  - promouvoir Rank 3 → 4
  - promouvoir Rank 4 → 5
- Démotion :
  - Rank 4 → 0
  - Rank 5 → Rank 0 (par le Fondateur)

---

## 📜 PHASE 8 — Logs (À FAIRE À LA FIN)

### 1️⃣4️⃣ Logs d’actions critiques
**Priorité : BASSE**

#### À faire :
- Logger :
  - changement de rank
  - changement de titre
- Table `logs`
  - actor
  - action
  - target
  - timestamp

---

## 🌱 PHASE 9 — Fonctionnalités tardives (NON PRIORITAIRES)

À faire **uniquement quand tout le reste est terminé** :

- Avatar
- Profils publics
- Bio
- Favoris
- Thème clair / sombre (localStorage)
- Langue

---

## 🐢 Note développeur

Ce document est volontairement :
- progressif
- réaliste
- sans fonctionnalités gadgets

Chaque phase peut être développée indépendamment.
