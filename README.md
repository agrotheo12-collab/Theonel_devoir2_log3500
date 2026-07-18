#  Atlas Mondial Interactif

## Description
L'Atlas Mondial Interactif est une application web qui permet de rechercher des informations sur n'importe quel pays du monde. Elle utilise l'API REST Countries pour obtenir les données.

## Objectif du Projet
Ce projet a été créé dans le cadre du devoir 2 pour le cours **LOG3500 - Conception et programmation de sites Web I** (Été 2026). Il démontre mes compétences en :
- Utilisation d'API (Fetch, Async/Await)
- Création d'une interface utilisateur esthétique et adaptative (responsive)
- Gestion des erreurs et validation des formulaires
- Accessibilité numérique (a11y)

## Technologies utilisées
| Technologie | Description |
|-------------|-------------|
| **HTML5** | Structure sémantique (header, main, section, footer) |
| **CSS3** | Flexbox, Grid, Media Queries, animations |
| **JavaScript (ES6)** | Fetch API, Async/Await, manipulation du DOM |
| **REST Countries API** | Source des données des pays |
| **Git/GitHub** | Versionnement et dépôt public |

##  Fonctionnalités
- ✅ Recherche de pays par nom (nettoyage automatique)
- ✅ Affichage du drapeau officiel (SVG) avec description alternative
- ✅ Affichage des informations clés :
  - Nom commun du pays
  - Capitale
  - Population (formatée avec des espaces)
  - Région géographique
  - Monnaie officielle
  - Langues parlées
- ✅ Spinner de chargement pendant la recherche
- ✅ Validation du formulaire (aria-invalid, aria-describedby)
- ✅ Gestion des erreurs :
  - "Aucun résultat trouvé" (404)
  - "Connexion impossible" (erreur réseau)
- ✅ Responsive Design (smartphone, tablette, ordinateur)
- ✅ Sécurité (textContent au lieu de innerHTML)

##  Structure des fichiers