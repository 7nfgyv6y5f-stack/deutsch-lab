"use strict";

/*
  LESSON 3: JavaScript makes your website interactive.
  Try editing a German expression below, save the file, and reload the page.
*/

// These are your starter flashcards. Add a new object to this array as a coding exercise.
const starterCards = [
  { id: "a1", german: "auf etwas näher eingehen", english: "to discuss something in more detail", example: "Könnten Sie auf diesen Aspekt näher eingehen?", category: "Academic" },
  { id: "a2", german: "eine Frage aufwerfen", english: "to raise a question", example: "Das wirft eine wichtige Frage auf.", category: "Academic" },
  { id: "a3", german: "etwas in Betracht ziehen", english: "to take something into consideration", example: "Wir müssen weitere Faktoren in Betracht ziehen.", category: "Academic" },
  { id: "a4", german: "im Gegensatz dazu", english: "in contrast to that", example: "Im Gegensatz dazu ist diese Regelung strenger.", category: "Academic" },
  { id: "l1", german: "personenbezogene Daten", english: "personal data", example: "Die DSGVO schützt personenbezogene Daten.", category: "Law" },
  { id: "l2", german: "die Einwilligung", english: "consent", example: "Die Einwilligung muss freiwillig erfolgen.", category: "Law" },
  { id: "l3", german: "einen Anspruch geltend machen", english: "to assert a:> legal claim", example: "Die betroffene Person kann ihren Anspruch geltend machen.", category: "Law" },
  { id: "l4", german: "die Rechtsgrundlage", english: "legal basis", example: "Für die Verarbeitung ist eine Rechtsgrundlage erforderlich.", category: "Law" },
  { id: "i1", german: "die Schleife", english: "loop (in programming)", example: "Die Schleife wiederholt den Vorgang fünfmal.", category: "Informatics" },
  { id: "i2", german: "die Variable", english: "variable", example: "Die Variable speichert einen Wert.", category: "Informatics" },
  { id: "i3", german: "der Datentyp", english: "data type", example: "Der Datentyp legt fest, welche Werte erlaubt sind.", category: "Informatics" },
  { id: "e1", german: "Das kommt darauf an.", english: "It depends.", example: "Ob ich morgen Zeit habe? Das kommt darauf an.", category: "Everyday" }
];

// localStorage saves small amounts of data in the current browser, not on GitHub.
const STORAGE_KEY = "deutschlab-v1";
function readSavedData() {
  try { return JSON.parse(localStorage.getItem(STORAGE_KEY)) || {}; }
  catch { return {}; }  // The website can still run if storage is unavailable.
}
const saved = readSavedData();
let customCards = Array.isArray(saved.customCards) ? saved.customCards.filter(c => c && typeof c.german === "string" && typeof c.english === "string") : [];
let mastered = new Set(Array.isArray(saved.mastered) ? saved.mastered : []);
let lastScore = typeof saved.lastScore === "string" ? saved.lastScore : "—";
let currentCardIndex = 0;
let revealed = false;
let quiz = null;

const $ = (selector) => document.querySelector(selector);
function allCards() { return [...starterCards, ...customCards]; }
function save() {
  try { localStorage.setItem(STORAGE_KEY, JSON.stringify({ customCards, mastered: [...mastered], lastScore })); }
  catch { console.warn("Browser storage is unavailable. Progress may not persist."); }
}
function updateStats() {
  $("#total-count").textContent = allCards().length;
  $("#known-count").textContent = mastered.size;
  $("#last-score").textContent = lastScore;
}

// A "function" is a reusable set of instructions. This function redraws a flashcard.
function renderCard() {
  const cards = allCards();
  const card = cards[currentCardIndex % cards.length];
  $("#card-position").textContent = `${currentCardIndex + 1} / ${cards.length}`;
  $("#flash-category").textContent = card.category;
  $("#flash-german").textContent = card.german;
  $("#flash-english").textContent = card.english;
  $("#flash-example").textContent = card.example;
  $("#flash-answer").hidden = !revealed;
  $("#reveal-btn").textContent = revealed ? "Hide answer" : "Reveal answer";
  $("#mastered-btn").textContent = mastered.has(card.id) ? "↶ Mark as still learning" : "✓ Mark as mastered";
}
function changeCard(delta) {
  currentCardIndex = (currentCardIndex + delta + allCards().length) % allCards().length;
  revealed = false;
  renderCard();
}
$("#reveal-btn").addEventListener("click", () => { revealed = !revealed; renderCard(); });
$("#previous-btn").addEventListener("click", () => changeCard(-1));
$("#next-btn").addEventListener("click", () => changeCard(1));
$("#mastered-btn").addEventListener("click", () => {
  const id = allCards()[currentCardIndex].id;
  if (mastered.has(id)) mastered.delete(id); else mastered.add(id);
  save(); updateStats(); renderCard(); renderLibrary();
});
$("#listen-btn").addEventListener("click", () => {
  if (!("speechSynthesis" in window)) { alert("Speech playback is not supported by this browser."); return; }
  window.speechSynthesis.cancel();
  const voice = new SpeechSynthesisUtterance(allCards()[currentCardIndex].german);
  voice.lang = "de-DE"; voice.rate = 0.85;
  window.speechSynthesis.speak(voice);
});

// Tabs change which section appears on the page, without loading a new website.
function switchTab(name) {
  for (const tab of ["learn", "quiz", "library"]) {
    $(`#${tab}-panel`).hidden = tab !== name;
  }
  document.querySelectorAll(".tab").forEach(button => {
    const active = button.dataset.tab === name;
    button.classList.toggle("active", active);
    if (active) button.setAttribute("aria-current", "page");
    else button.removeAttribute("aria-current");
  });
  if (name === "library") renderLibrary();
}
document.querySelectorAll(".tab").forEach(button => button.addEventListener("click", () => switchTab(button.dataset.tab)));

function shuffle(items) {
  const result = [...items];
  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [result[i], result[j]] = [result[j], result[i]];
  }
  return result;
}
function startQuiz() {
  const questions = shuffle(allCards()).slice(0, 5);
  quiz = { questions, index: 0, correct: 0, answered: false };
  $("#quiz-intro").hidden = true;
  $("#quiz-finished").hidden = true;
  $("#quiz-playing").hidden = false;
  renderQuestion();
}
function renderQuestion() {
  quiz.answered = false;
  const card = quiz.questions[quiz.index];
  $("#quiz-counter").textContent = `Question ${quiz.index + 1} of ${quiz.questions.length}`;
  $("#quiz-running-score").textContent = `${quiz.correct} correct`;
  $("#quiz-progress").style.width = `${(quiz.index / quiz.questions.length) * 100}%`;
  $("#quiz-word").textContent = card.german;
  $("#quiz-feedback").textContent = "";
  $("#quiz-next-btn").hidden = true;
  const wrong = shuffle(allCards().filter(other => other.english !== card.english)).slice(0, 3);
  const choices = shuffle([card, ...wrong]);
  const container = $("#quiz-choices");
  container.replaceChildren();
  choices.forEach(choice => {
    const button = document.createElement("button");
    button.type = "button";
    button.className = "choice";
    button.textContent = choice.english; // textContent keeps user-added content safe.
    button.addEventListener("click", () => {
      if (quiz.answered) return;
      quiz.answered = true;
      if (choice.id === card.id) quiz.correct++;
      container.querySelectorAll("button").forEach(item => {
        item.disabled = true;
        if (item.textContent === card.english) item.classList.add("correct");
        else if (item === button) item.classList.add("wrong");
      });
      $("#quiz-feedback").textContent = choice.id === card.id ? "Richtig! Great work." : `Not quite. Correct answer: ${card.english}`;
      $("#quiz-running-score").textContent = `${quiz.correct} correct`;
      $("#quiz-next-btn").textContent = quiz.index === quiz.questions.length - 1 ? "See my results →" : "Next question →";
      $("#quiz-next-btn").hidden = false;
    });
    container.appendChild(button);
  });
}
function advanceQuiz() {
  if (!quiz || !quiz.answered) return;
  quiz.index++;
  if (quiz.index < quiz.questions.length) { renderQuestion(); return; }
  lastScore = `${quiz.correct}/${quiz.questions.length}`;
  save(); updateStats();
  $("#quiz-progress").style.width = "100%";
  $("#quiz-playing").hidden = true;
  $("#quiz-finished").hidden = false;
  $("#quiz-final-score").textContent = lastScore;
  $("#quiz-final-message").textContent = quiz.correct === quiz.questions.length ? "Excellent recall! Add a few new phrases for your next challenge." : "Every attempt is practice. Review your flashcards and try again.";
}
$("#start-quiz-btn").addEventListener("click", startQuiz);
$("#quiz-again-btn").addEventListener("click", startQuiz);
$("#quiz-next-btn").addEventListener("click", advanceQuiz);

function renderLibrary() {
  const filter = $("#category-filter").value;
  const cards = allCards().filter(card => filter === "All" || card.category === filter);
  const list = $("#vocab-list");
  list.replaceChildren();
  cards.forEach(card => {
    const item = document.createElement("article");
    item.className = "vocab-item";
    const main = document.createElement("div");
    const german = document.createElement("strong"); german.textContent = card.german;
    const english = document.createElement("span"); english.className = "translation"; english.textContent = card.english;
    const category = document.createElement("div"); category.className = "pill"; category.textContent = card.category;
    main.append(german, english, category);
    const status = document.createElement("span"); status.className = "vocab-status";
    status.textContent = mastered.has(card.id) ? "✓ Mastered" : "○ Learning";
    item.append(main, status);
    list.append(item);
  });
  if (!cards.length) list.textContent = "No expressions in this category yet. Add one below!";
}
$("#category-filter").addEventListener("change", renderLibrary);
$("#add-form").addEventListener("submit", event => {
  event.preventDefault();
  const form = event.currentTarget;
  const values = new FormData(form);
  const german = String(values.get("german") || "").trim();
  const english = String(values.get("english") || "").trim();
  const example = String(values.get("example") || "").trim();
  const category = String(values.get("category") || "Academic");
  if (!german || !english || !example) return;
  const id = `custom-${Date.now()}-${Math.random().toString(36).slice(2)}`;
  customCards.push({ id, german, english, example, category });
  save(); updateStats(); renderLibrary();
  form.reset();
  $("#category-filter").value = "All";
  renderLibrary();
  $("#form-feedback").textContent = "✓ Added! Your new expression is ready to practice.";
  window.setTimeout(() => { $("#form-feedback").textContent = ""; }, 4500);
});
$("#reset-progress").addEventListener("click", () => {
  if (!confirm("Reset mastered words and quiz scores? Your custom vocabulary will be kept.")) return;
  mastered.clear(); lastScore = "—";
  save(); updateStats(); renderCard(); renderLibrary();
});

// LESSON 4: Initializing = running functions once when the page first loads.
updateStats();
renderCard();
renderLibrary();
