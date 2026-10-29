# DeutschLab 🇩🇪

A beginner-friendly **interactive German-learning website** made with plain HTML, CSS, and JavaScript.

## Features

- Flip German flashcards to see their English meaning and an example sentence.
- Hear German expressions using your browser's speech synthesis (quality depends on your device).
- Mark expressions as mastered.
- Test yourself with a five-question multiple-choice quiz.
- Filter vocabulary by Academic, Law, Informatics, and Everyday German.
- Add new vocabulary without writing code.
- Save your custom vocabulary and progress **in this browser** using `localStorage`.

**Important:** Your added words and progress are stored locally in your browser. They **do not** automatically sync to GitHub, other browsers, or devices. Clearing browser storage may delete them. If you want your new vocabulary in the GitHub repository permanently, also add it to `starterCards` in `app.js` and commit that change.

## Step 1 — Open the website on your computer

1. Unzip the downloaded folder.
2. Open the folder in [Visual Studio Code](https://code.visualstudio.com/), or any code editor.
3. For a quick preview, double-click `index.html` to open it in your browser. Browser storage behavior for `file://` pages can vary.
4. For reliable local testing, you can use VS Code's **Live Server** extension (right-click `index.html` → **Open with Live Server**). Alternatively, if Python is installed, run `python -m http.server 8000` inside the folder and visit `http://localhost:8000`.

## Step 2 — Publish the site with GitHub Pages

1. Sign in at [github.com](https://github.com/).
2. Create a new **public** repository named `deutsch-lab` (GitHub Free supports Pages for public repositories).
3. On the repository's main page, choose **Add file → Upload files**.
4. Upload these individual files **to the repository root**: `index.html`, `styles.css`, `app.js`, and `README.md`. The `index.html` file must not be buried inside an extra folder.
5. Commit the changes.
6. Go to **Settings → Pages → Build and deployment**.
7. Set **Source: Deploy from a branch**; **Branch: main**, folder **/(root)**. Click **Save**.
8. Your site will usually appear at `https://YOUR-USERNAME.github.io/deutsch-lab/`. It can take several minutes.

GitHub's official documentation: [Creating a GitHub Pages site](https://docs.github.com/en/pages/getting-started-with-github-pages/creating-a-github-pages-site).

## The programming curriculum: learn by changing your own app

**Lesson 1: HTML (structure)** — Open `index.html`. Change the hero heading from `Make German your own.` to your own motto. Reload the page.

**Lesson 2: CSS (appearance)** — Open `styles.css`. Change `--teal:#197c72` to `--teal:#8e5285`. Reload and see what changed. The leading `--` means it's a reusable CSS custom property (variable).

**Lesson 3: JavaScript (data)** — Open `app.js`. Find `const starterCards = [...]` and add a new entry:

```js
{
  id: "a5",
  german: "etwas nachvollziehen können",
  english: "to be able to follow or understand something",
  example: "Ich kann Ihre Argumentation gut nachvollziehen.",
  category: "Academic"
},
```

Put it between existing items, with a comma separating objects. Reload and check **My Library**.

**Lesson 4: Functions** — Find `function changeCard(delta)`. Try to explain how it chooses the next flashcard. Change the button labels in `index.html`.

**Lesson 5: Events** — Find `addEventListener("click", ...)`. This is how JavaScript reacts to a user's click.

**Lesson 6: Browser storage** — Find `save()` and `readSavedData()` in `app.js`. Understand why your progress stays after a reload.

## Optional: use Git from the terminal later

Once you have Git installed and your local project linked to GitHub, the basic workflow becomes:

```bash
git add .
git commit -m "Add new C1 German expressions"
git push
```

These commands are **not needed** for your first browser-based upload.

## Safety / privacy

GitHub Pages websites are public. Do not upload private lecture recordings, classmates' information, passwords, or other material you lack permission to publish. These sample words and examples are original educational content.

## Ideas for your next version

- Add a fill-in-the-blank quiz for German prepositions.
- Record commonly confused **da-words** (`darauf`, `damit`, `davon`).
- Add spaced-repetition scheduling.
- Add an optional export/import vocabulary backup feature.
- Write one weekly summary of what you learned, in German, as a GitHub Markdown file.
