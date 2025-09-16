/*
 * Reaction Nano – logique principale du jeu de test de temps de réaction.
 *
 * États possibles :
 *  - 'idle'    : attente de démarrage (instructions visibles)
 *  - 'waiting' : délai aléatoire avant d'être prêt (fond rouge)
 *  - 'ready'   : l'utilisateur peut cliquer pour mesurer son temps (fond vert)
 *  - 'result'  : temps affiché, options pour rejouer ou partager
 */

(function () {
  // Sélecteurs DOM
  const container = document.getElementById('game-container');
  const statusOverlay = document.getElementById('status');
  const message = document.getElementById('message');
  const startButton = document.getElementById('start-button');
  const resultScreen = document.getElementById('result-screen');
  const timeDisplay = document.getElementById('time-display');
  const retryButton = document.getElementById('retry');
  const shareButton = document.getElementById('share');

  let state = 'idle';
  let startTime = 0;
  let timeoutId = null;

  /**
   * Réinitialise le jeu à l'état initial (idle) et affiche les instructions.
   */
  function showIdle() {
    clearTimeout(timeoutId);
    state = 'idle';
    statusOverlay.style.display = 'flex';
    resultScreen.style.display = 'none';
    container.style.backgroundColor = '#e55c6e';
    message.innerHTML =
      'Cliquez sur <strong>Démarrer</strong> pour tester votre temps de réaction.';
  }

  /**
   * Lance le jeu : passe en état « waiting » puis « ready » après un délai aléatoire.
   */
  function startGame() {
    if (state !== 'idle') return;
    state = 'waiting';
    statusOverlay.style.display = 'none';
    resultScreen.style.display = 'none';
    container.style.backgroundColor = '#e55c6e';

    // Choisir un délai aléatoire entre 2 et 5 secondes
    const delay = Math.random() * 3000 + 2000;
    timeoutId = setTimeout(() => {
      state = 'ready';
      container.style.backgroundColor = '#4caf50';
      // Enregistrer le temps de départ lorsque l'utilisateur peut cliquer
      startTime = performance.now();
    }, delay);
  }

  /**
   * Gère un clic alors que l'état est « waiting » (trop tôt).
   */
  function handleEarlyClick() {
    clearTimeout(timeoutId);
    state = 'idle';
    statusOverlay.style.display = 'flex';
    message.innerHTML =
      'Trop tôt ! Attendez que la couleur devienne verte avant de cliquer.';
  }

  /**
   * Termine le jeu lorsqu'un clic survient en état « ready » et affiche le résultat.
   */
  function completeGame() {
    const reactionTime = Math.round(performance.now() - startTime);
    timeDisplay.textContent = reactionTime.toString();
    state = 'result';
    resultScreen.style.display = 'flex';
    container.style.backgroundColor = '#e55c6e';
  }

  /**
   * Prépare et ouvre l'interface de partage de score sur X/Twitter.
   */
  function shareScore() {
    const time = timeDisplay.textContent;
    const url = window.location.href;
    const text =
      'Je viens de faire un temps de ' + time + ' ms sur Reaction Nano ! Essaye toi aussi → ';
    const shareURL =
      'https://twitter.com/intent/tweet?text=' +
      encodeURIComponent(text) +
      '&url=' +
      encodeURIComponent(url);
    window.open(shareURL, '_blank');
  }

  // Écouteurs d'événements
  startButton.addEventListener('click', startGame);
  retryButton.addEventListener('click', showIdle);
  shareButton.addEventListener('click', shareScore);

  // Gérer les clics sur le conteneur pour l'interaction principale
  container.addEventListener('click', () => {
    if (state === 'waiting') {
      handleEarlyClick();
    } else if (state === 'ready') {
      completeGame();
    }
  });

  // Afficher l'écran d'instructions au chargement
  showIdle();
})();
