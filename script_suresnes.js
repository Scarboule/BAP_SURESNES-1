const validCodes = ["AAAA"];

function checkCode() {
  const input = document.getElementById("codeInput");
  // Récupération du code entré par l'utilisateur
  const code = input.value;
  if (validCodes.includes(code)) {
    // Affichage du message de victoire
    const winMessage = document.getElementById("winMessage");
    winMessage.classList.remove("hidden");
    return false; // Empêche l'envoi du formulaire
  } else {
    const loseMessage = document.getElementById("loseMessage");
    loseMessage.classList.remove("hidden");
    return false; // Empêche l'envoi du formulaire
  }
}
// Vérification si le code est valide