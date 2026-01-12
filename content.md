# 📜 Système de gestion des utilisateurs — nsi-projects

Ce document décrit **l’intégralité du système de rôles, permissions et évolutions prévues**
pour le site **nsi-projects**.

Il sert de **référence officielle** pour le développement et l’évolution du projet.

---

## 🧱 Principes généraux

- Le système repose sur des **ranks numériques** (0 → 5)
- Les permissions sont **strictement contrôlées côté base de données (RLS)**
- Toute décision de promotion / démotion peut être prise **hors plateforme**
- Le site applique la décision, il ne la débat pas
- Une modification de rank est **effective immédiatement en base**
  - Même sans rechargement de session
  - Toute requête non autorisée est refusée côté backend

---

## 👤 Fonctionnalités globales (tous les utilisateurs)

### ✅ Déjà en place
- Authentification
- Rank visible dans le profil
- Dernière connexion visible dans le profil personnel

### 🔜 À ajouter prochainement
- Affichage clair des **permissions associées à son rank**
  - Objectif : transparence et compréhension du rôle

---

## 🗃️ Gestion des projets — structure des données

### 📌 Évolution validée
- Les champs suivants doivent être **déplacés depuis les README GitHub vers la base de données** :
  - `title` (titre affiché du projet)
  - `short_description`
  - `tags / catégories`

### 📄 README GitHub
- Conserve uniquement :
  - contenu long
  - explications détaillées
  - documentation technique

### 🔒 Contraintes importantes
- Le **titre d’un projet doit être UNIQUE**
- Toute modification de titre doit :
  - vérifier l’unicité
  - être refusée si un projet porte déjà ce titre

---

## 🟢 Rank 0 — Utilisateur

- Consultation des projets
- Aucune action de modification
- Aucune action sur les utilisateurs

---

## 🟢 Rank 1 — Guides

### 🎯 Rôle
Aider à améliorer la qualité des projets (contenu, clarté, organisation).

### ✅ Permissions
- Modifier **sans approbation** :
  - description courte
  - tags / catégories
- Les modifications sont **appliquées directement**

### 📬 Communication
- Les retours (bugs, incohérences, problèmes de compréhension)
  se font **hors plateforme** (mail, etc.)

### ❌ Restrictions
- Pas de modification de titre
- Pas de report interne
- Pas de notes internes
- Pas de gestion d’utilisateurs
- Ne peuvent promouvoir ni démoter personne

---

## 🔵 Rank 2 — Modérateurs

### 🎯 Rôle
Maintenir la cohérence globale des projets.

### ✅ Permissions actuelles
- Toutes les permissions des Guides
- Modifier description et tags **sans approbation**

### 🔜 Évolution prévue (non implémentée pour l’instant)
- Les Guides ne modifieront plus directement
- Les Modérateurs pourront :
  - approuver
  - rejeter
  les modifications des Guides

### ❌ Restrictions
- Pas de modification de titre
- Pas de gestion d’utilisateurs
- Pas de messages système

---

## 🟣 Rank 3 — Responsables Modérateurs

### 🎯 Rôle
Coordination de la modération et recrutement initial.

### ✅ Permissions
- Toutes les permissions des Modérateurs
- Modifier **sans approbation** :
  - descriptions
  - tags
  - **titres des projets**
- Les titres modifiés sont :
  - appliqués immédiatement
  - visibles directement sur le site

### 👥 Gestion des utilisateurs
- Recruter des Guides (Rank 1)
- Promouvoir :
  - Rank 1 → Rank 2

### ⬇️ Démotions autorisées
- Rank 2 → Rank 1
- Rank 1 → Rank 0

---

## 🔴 Rank 4 — Administrateurs

### 🎯 Rôle
Gestion globale du site et de son état.

### ✅ Permissions
- Toutes les permissions précédentes
- Modifier :
  - titres
  - descriptions
  - tags
- Ajouter / modifier des **messages de statut**
  - affichés sur la page d’accueil
  - ex : maintenance DB, bugs possibles, infos importantes

### 👥 Gestion des utilisateurs
- Promouvoir :
  - Rank 0 → Rank 1
- Participent aux décisions de promotion / démotion
  (décisions prises en externe, appliquées sur le site)

### ⬇️ Démotions autorisées
- Rank 1 → Rank 0

---

## ⚫ Rank 5 — Responsables Administrateurs (Fondateurs / Co-fondateurs)

### 🎯 Rôle
Autorité maximale — très peu de comptes.

### ✅ Permissions
- Toutes les permissions de **tous** les autres ranks
- **Mode maintenance**
  - site en lecture seule
  - message global
- Contrôle total du système de rôles

### ⬆️ Promotions autorisées
- Peut promouvoir :
  - Rank 0 → 1 → 2 → 3 → 4 → 5

### ⬇️ Démotions autorisées
- Rank 4 → Rank 0
- Peut démoter **un autre Rank 5**
  - réservé au Fondateur

---

## 🔐 Règles générales de promotion / démotion

| Rank | Peut promouvoir | Peut démoter |
|----|----------------|-------------|
| 0 | ❌ | ❌ |
| 1 | ❌ | ❌ |
| 2 | ❌ | ❌ |
| 3 | 1 → 2 | 2 → 1 → 0 |
| 4 | 0 → 1 | 1 → 0 |
| 5 | 0 → 5 | 4 → 0 (+ Rank 5) |

- Toute modification de rank :
  - met à jour la base de données
  - est immédiatement prise en compte par les RLS
- Une session non rafraîchie ne donne **aucun pouvoir supplémentaire**

---

## 🗑️ Suppression de projets

- Aucune suppression via l’interface du site
- Les projets sont des **dossiers physiques**
- Supprimer le dossier = supprimer le projet
- Gestion exclusivement côté développement

---

## 📜 Logs (prévision)

- Sujet jugé important
- À implémenter **après toutes les fonctionnalités principales**
- Concernera notamment :
  - changements de rank
  - changements de titre
  - actions critiques

---

## 🔚 Fonctionnalités validées mais À FAIRE EN DERNIER

- Avatar
- Profils publics
- Bio
- Favoris
- Thème clair / sombre (localStorage)
- Langue

---

## 🐢 Note finale

Ce système est conçu pour être :
- progressif
- sécurisé
- sans sur-ingénierie
- évolutif dans le temps

Les décisions humaines priment,
le site applique strictement les règles définies ici.
