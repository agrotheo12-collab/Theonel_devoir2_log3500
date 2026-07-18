// ===============================================
// 1. On récupère les éléments de la page (avec querySelector)
// ===============================================
const input = document.querySelector("#pays");
const stage = document.querySelector("#resultat");
const resetLink = document.querySelector("#resetLink");


// ===============================================
// 2. Fonctions utilitaires : transforment les données brutes de l'API en texte lisible
// ===============================================

// Ajoute des espaces dans les grands nombres : 11500000 -> "11 500 000"
function formatPopulation(nombre) {
  return nombre.toLocaleString("fr-FR");
}

// L'API renvoie les monnaies sous forme de LISTE : [{ code: "HTG", name: "Gourde haïtienne", symbol: "G" }]
function formatCurrencies(currencies) {
  if (!currencies || currencies.length === 0) return "—";
  const liste = currencies.map(
    (c) => c.name + (c.symbol ? ` (${c.symbol})` : "")
  );
  return liste.join(", ");
}

// L'API renvoie les langues sous forme de LISTE : [{ name: "French", ... }, { name: "Haitian Creole", ... }]
function formatLanguages(languages) {
  if (!languages || languages.length === 0) return "—";
  return languages.map((l) => l.name).join(", ");
}


// ===============================================
// 3. Fonctions d'affichage : elles remplissent #resultat selon la situation
// ===============================================

// Affiche le spinner de chargement
function showLoading() {
  stage.innerHTML = `
    <div class="state-box">
      <div class="spinner"></div>
      <p>Recherche en cours…</p>
    </div>
  `;
}

// Affiche un message d'erreur
function showError(message) {
  stage.innerHTML = `
    <div class="state-box error-box">
      <p>❌ ${message}</p>
    </div>
  `;
}

// Affiche la carte d'identité complète d'un pays
function showCountry(pays) {
  const drapeauUrl = pays.flags?.svg || pays.flags?.png || "";
  const drapeauAlt = "Drapeau de " + pays.name;
  const nom = pays.name;
  const capitale = pays.capital || "—";
  const population = formatPopulation(pays.population);
  const region = pays.region || "—";
  const monnaie = formatCurrencies(pays.currencies);
  const langues = formatLanguages(pays.languages);

  stage.innerHTML = `
    <div class="card">
      <div class="flag-wrap">
        <img src="${drapeauUrl}" alt="${drapeauAlt}">
      </div>
      <div class="info">
        <h1>${nom}</h1>

        <div class="info-row">
          <div class="icon-circle">🏛️</div>
          <div class="label">Nom :</div>
          <div class="value">${nom}</div>
        </div>

        <div class="info-row">
          <div class="icon-circle">📍</div>
          <div class="label">Capitale :</div>
          <div class="value">${capitale}</div>
        </div>

        <div class="info-row">
          <div class="icon-circle">👥</div>
          <div class="label">Population :</div>
          <div class="value">${population}</div>
        </div>

        <div class="info-row">
          <div class="icon-circle">🌍</div>
          <div class="label">Région :</div>
          <div class="value">${region}</div>
        </div>

        <div class="info-row">
          <div class="icon-circle">💳</div>
          <div class="label">Monnaie :</div>
          <div class="value">${monnaie}</div>
        </div>

        <div class="info-row">
          <div class="icon-circle">💬</div>
          <div class="label">Langues :</div>
          <div class="value">${langues}</div>
        </div>
      </div>
    </div>
  `;
}

// Affiche une liste de boutons quand plusieurs pays correspondent à la recherche
function showChoices(listePays) {
  stage.innerHTML = `
    <div class="state-box">
      <p>Plusieurs pays correspondent, précise ton choix :</p>
      <div class="choices">
        ${listePays
          .map(
            (p, i) =>
              `<button class="choice-btn" data-index="${i}">${p.name}</button>`
          )
          .join("")}
      </div>
    </div>
  `;

  // On ajoute un clic sur chaque bouton créé
  const boutons = document.querySelectorAll(".choice-btn");
  boutons.forEach((bouton) => {
    bouton.addEventListener("click", () => {
      const i = parseInt(bouton.dataset.index, 10);
      showCountry(listePays[i]);
    });
  });
}


// ===============================================
// 4. La fonction principale : va chercher les données sur l'API
// ===============================================
async function rechercherPays() {
  const texte = input.value.trim();
  if (texte === "") return; // rien tapé -> on ne fait rien

  showLoading(); // étape 1 : on affiche le spinner

  // API : countries.dev (gratuite, sans clé) — remplace RestCountries v3.1, qui a été fermée
  const champs = "name,capital,population,region,flags,currencies,languages";
  const url = `https://countries.dev/name/${encodeURIComponent(texte)}?fields=${champs}`;

  try {
    const reponse = await fetch(url); // étape 2 : on part chercher les données

    if (reponse.status === 404) {
      showError(`Aucun pays trouvé pour « ${texte} ».`);
      return;
    }
    if (!reponse.ok) {
      showError(`Erreur du serveur (code ${reponse.status}). Réessaie.`);
      return;
    }

    const donnees = await reponse.json(); // étape 3 : on déballe la réponse

    // étape 4 : on affiche le bon résultat
    if (donnees.length === 1) {
      showCountry(donnees[0]);
    } else {
      // Si un des pays correspond exactement au texte tapé, on l'affiche directement
      const correspondanceExacte = donnees.find(
        (p) => p.name.toLowerCase() === texte.toLowerCase()
      );
      if (correspondanceExacte) {
        showCountry(correspondanceExacte);
      } else {
        showChoices(donnees);
      }
    }
  } catch (erreur) {
    showError("Impossible de contacter le serveur. Vérifie ta connexion.");
  }
}


// ===============================================
// 5. Écouteurs d'événements
// ===============================================

// Recherche quand on appuie sur Entrée dans le champ de texte
input.addEventListener("keydown", (e) => {
  if (e.key === "Enter") {
    rechercherPays();
  }
});

// Réinitialise la page quand on clique sur "← Nouvelle recherche"
resetLink.addEventListener("click", () => {
  input.value = "";
  stage.innerHTML = `
    <div class="state-box">
      <p>Tapez un nom de pays puis appuyez sur Entrée pour commencer.</p>
    </div>
  `;
});