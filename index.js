const cols = document.querySelectorAll(".col");

document.addEventListener("keydown", (e) => {
  e.preventDefault();
  if (e.code.toLocaleLowerCase() === "space") {
    setRandomColors();
  }
});

document.addEventListener("click", (e) => {
  const type = e.target.dataset.type;

  if (type === "lock") {
    const node = e.target.tagName.toLocaleLowerCase() === "i" ? e.target : e.target.children[0];

    node.classList.toggle("fa-lock-open");
    node.classList.toggle("fa-lock");
  } else if (type === "copy") {
    copyToClickboard(e.target.textContent);
  }
});

function copyToClickboard(text) {
  return navigator.clipboard.writeText(text);
}

function setRandomColors(isInitial) {
  const colors = isInitial ? getColorsFromHash() : [];

  cols.forEach((col, i) => {
    const isLocked = col.querySelector("i").classList.contains("fa-lock");
    const text = col.querySelector("h2");
    const button = col.querySelector("button");

    const color = isInitial ? (colors[i] ? colors[i] : chroma.random()) : chroma.random();

    if (isLocked) {
      colors.push(text.textContent);
      return;
    }
    if (!isInitial) {
      colors.push(color);
    }

    text.textContent = color;
    col.style.background = color;

    setTextColor(text, color);
    setTextColor(button, color);
  });

  updateColorsHash(colors);
}

function setTextColor(text, color) {
  const luminance = chroma(color).luminance();

  text.style.color = luminance > 0.5 ? "black" : "white";
}

function updateColorsHash(colors = []) {
  document.location.hash = colors
    .map((col) => {
      return col.toString().substring(1);
    })
    .join("-");
}

function getColorsFromHash() {
  if (document.location.hash.length > 1) {
    return document.location.hash
      .substring(1)
      .split("-")
      .map((color) => "#" + color);
  }
  return [];
}

setRandomColors(true);
