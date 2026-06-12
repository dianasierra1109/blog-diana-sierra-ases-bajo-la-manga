/* ── Filters & Search ── */
const randomBtn = document.getElementById("randomBtn");
const searchInput = document.getElementById("searchInput");
const filterButtons = document.querySelectorAll(".filter-btn");
const cards = document.querySelectorAll(".command-card");
const copyButtons = document.querySelectorAll(".copy-btn");
const resultsInfo = document.getElementById("resultsInfo");

let activeFilter = "all";

const applyFilters = () => {
  const query = searchInput.value.toLowerCase().trim();
  let visibleCount = 0;

  cards.forEach((card) => {
    const category = card.dataset.category;
    const keywords = card.dataset.keywords.toLowerCase();

    // Mejora: Buscar solo en el título y la descripción, ignorando el botón y el número
    const title = card.querySelector("h3").textContent.toLowerCase();
    const desc = card.querySelector("p").textContent.toLowerCase();
    const searchText = `${title} ${desc}`;

    const matchesCategory = activeFilter === "all" || category === activeFilter;
    const matchesSearch = !query || keywords.includes(query) || searchText.includes(query);
    const shouldShow = matchesCategory && matchesSearch;

    card.classList.toggle("hidden", !shouldShow);
    if (shouldShow) visibleCount += 1;
  });

  resultsInfo.textContent =
    visibleCount === 0
      ? "Sin resultados. Prueba con otra palabra o categoría."
      : `${visibleCount} comando(s) visible(s) para practicar.`;
};

filterButtons.forEach((button) => {
  button.addEventListener("click", () => {
    filterButtons.forEach((btn) => btn.classList.remove("active"));
    button.classList.add("active");
    activeFilter = button.dataset.filter;
    applyFilters();
  });
});

searchInput.addEventListener("input", applyFilters);

/* ── Random command ── */
randomBtn.addEventListener("click", () => {
  const visibleCards = [...cards].filter((card) => !card.classList.contains("hidden"));
  if (!visibleCards.length) {
    resultsInfo.textContent = "No hay tarjetas visibles para seleccionar.";
    return;
  }

  visibleCards.forEach((card) => card.classList.remove("flash"));
  const selected = visibleCards[Math.floor(Math.random() * visibleCards.length)];
  selected.classList.add("flash");
  selected.scrollIntoView({ behavior: "smooth", block: "center" });
  setTimeout(() => selected.classList.remove("flash"), 1600);
});

/* ── Copy to clipboard ── */
const copyToClipboard = async (text) => {
  if (navigator.clipboard?.writeText) {
    await navigator.clipboard.writeText(text);
    return;
  }
  const temp = document.createElement("textarea");
  temp.value = text;
  temp.style.position = "fixed";
  temp.style.left = "-9999px";
  document.body.appendChild(temp);
  temp.select();
  document.execCommand("copy");
  document.body.removeChild(temp);
};

copyButtons.forEach((button) => {
  button.addEventListener("click", async () => {
    const command = button.dataset.command;
    const original = button.textContent;

    try {
      await copyToClipboard(command);
      button.textContent = "Copiado ✓";
      button.classList.add("done");
      setTimeout(() => {
        button.textContent = original;
        button.classList.remove("done");
      }, 1100);
    } catch {
      button.textContent = "Error";
      setTimeout(() => {
        button.textContent = original;
      }, 1100);
    }
  });
});

applyFilters();