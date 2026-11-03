# Greyhound LLC website

Static site for **greyhound.llc**, hosted on GitHub Pages. No build step: every file here is served exactly as it is.

## How the site works
- One page (`index.html`) with a tab for each section. Clicking a tab shows that section; nothing scrolls between sections. Every tab has its own address, such as `greyhound.llc/#adaptive-reuse`.
- `assets/css/style.css` holds the colors and fonts (see the `:root` block at the top) and the layout.
- `assets/js/main.js` runs the tabs, the mobile menu and the contact form.
- `CNAME` tells GitHub the site lives at greyhound.llc. **Do not delete it.**

## Editing the words
Open `index.html` and find the section by its comment, for example `<!-- 03 WHY SMALL TOWN AMERICA -->`. Change the text between the tags (`<p>...</p>`). Commit the change on GitHub and the live site updates in a minute or two.

Section blocks, in tab order: HOME, 01 WHAT WE DO, 02 OUR APPROACH, 03 WHY SMALL TOWN AMERICA, 04 MIXED USE DEVELOPMENT, 05 EXISTING BUILDINGS AND ADAPTIVE REUSE, 06 TECHNOLOGY AND RESEARCH, 07 OUR LEADERSHIP, 08 CONTACT.

Tab names in the top bar are shorter than the section titles. To rename one, change the text inside the matching `<a>` in the `<nav class="tabs">` block, and the `data-label` on its section.

## Swapping a photo
1. Save the new photo as a `.webp` (or `.jpg`) around 1400 pixels wide, ideally under 400 KB.
2. Put it in `assets/img/` and change the `src` (and `srcset`) in that section of `index.html`.
3. Update the `alt` text, which describes the picture for screen readers and search engines.

## Leadership bios and photos
Each person on the Leadership tab is one `<li>` in `index.html`: a small headshot, name, role and bio. The headshots are deliberately small and low resolution (240 pixels wide) so they are not worth downloading; keep new ones about that size and under 20 KB. The large picture beside them is a line drawing (`assets/img/leadership-drawing.svg`).

## Contact form
The form uses the free service Web3Forms, which emails each message to you.
1. Go to web3forms.com, enter the email address that should receive messages, and copy the access key they send.
2. In `index.html`, replace `YOUR_ACCESS_KEY_HERE` with that key.
3. Commit, then send a test message from the live site.

## Making a change safely
Prefer a pull request: edit on a new branch, open a pull request, and the other person checks it before it goes live. Or edit directly on `main` for small text fixes.

## Fonts
Inter (and Inter Display) and Lora, both under the SIL Open Font License, are included in `assets/fonts/`.
