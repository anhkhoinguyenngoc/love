const arena = document.querySelector("#buttonArena");
const noButton = document.querySelector("#btnNo");
const noResponse = document.querySelector("#noResponse");
const yesButton = document.querySelector("#btnYes");
const restartButton = document.querySelector("#btnRestart");
const questionScreen = document.querySelector("#questionScreen");
const successScreen = document.querySelector("#successScreen");
const celebration = document.querySelector("#celebration");
const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");

function moveNoButton() {
    const arenaBounds = arena.getBoundingClientRect();
    const yesBounds = yesButton.getBoundingClientRect();
    const noBounds = noButton.getBoundingClientRect();
    const gap = 14;
    const maxX = arena.clientWidth - noBounds.width;
    const maxY = arena.clientHeight - noBounds.height;
    const safeSpots = [];

    for (let y = 0; y <= maxY; y += 12) {
        for (let x = 0; x <= maxX; x += 12) {
            const overlapsYes =
                x < yesBounds.right - arenaBounds.left + gap &&
                x + noBounds.width > yesBounds.left - arenaBounds.left - gap &&
                y < yesBounds.bottom - arenaBounds.top + gap &&
                y + noBounds.height > yesBounds.top - arenaBounds.top - gap;

            if (!overlapsYes) {
                safeSpots.push({ x, y });
            }
        }
    }

    if (safeSpots.length === 0) return;

    const currentX = noButton.offsetLeft;
    const currentY = noButton.offsetTop;
    const alternatives = safeSpots.filter(
        ({ x, y }) => Math.hypot(x - currentX, y - currentY) > 42,
    );
    const options = alternatives.length > 0 ? alternatives : safeSpots;
    const nextSpot = options[Math.floor(Math.random() * options.length)];

    noButton.style.left = `${nextSpot.x}px`;
    noButton.style.top = `${nextSpot.y}px`;
    noButton.style.transform = "none";
}

function celebrate() {
    celebration.replaceChildren();
    const pieces = reducedMotion.matches ? 8 : 34;
    const colors = ["#ef668c", "#ff947b", "#e7b34c", "#a7c98b", "#a88cbd"];

    for (let index = 0; index < pieces; index += 1) {
        const piece = document.createElement("span");
        const angle = (Math.PI * 2 * index) / pieces + Math.random() * 0.25;
        const distance = 90 + Math.random() * 230;
        piece.className = "celebration-piece";
        piece.textContent = index % 3 === 0 ? "✦" : "♥";
        piece.style.setProperty("--piece-x", `${Math.cos(angle) * distance}px`);
        piece.style.setProperty("--piece-y", `${Math.sin(angle) * distance}px`);
        piece.style.setProperty("--piece-rotation", `${Math.random() * 100 - 50}deg`);
        piece.style.setProperty("--piece-size", `${12 + Math.random() * 20}px`);
        piece.style.setProperty("--piece-duration", `${reducedMotion.matches ? 700 : 1100 + Math.random() * 700}ms`);
        piece.style.setProperty("--piece-color", colors[index % colors.length]);
        celebration.append(piece);
    }

    window.setTimeout(() => celebration.replaceChildren(), reducedMotion.matches ? 800 : 2000);
}

noButton.addEventListener("pointerenter", (event) => {
    if (event.pointerType === "mouse") moveNoButton();
});

noButton.addEventListener("pointerdown", (event) => {
    noResponse.hidden = false;
    if (event.pointerType !== "mouse") moveNoButton();
});

noButton.addEventListener("click", (event) => {
    if (event.detail === 0) {
        noResponse.hidden = false;
        moveNoButton();
    }
});

yesButton.addEventListener("click", () => {
    questionScreen.hidden = true;
    successScreen.hidden = false;
    celebrate();
});

restartButton.addEventListener("click", () => {
    successScreen.hidden = true;
    questionScreen.hidden = false;
    celebration.replaceChildren();
    noButton.style.left = "";
    noButton.style.top = "";
    noButton.style.transform = "";
});

window.addEventListener("resize", () => {
    if (!questionScreen.hidden && noButton.style.left) {
        noButton.classList.add("position-reset");
        moveNoButton();
        window.requestAnimationFrame(() => noButton.classList.remove("position-reset"));
    }
});