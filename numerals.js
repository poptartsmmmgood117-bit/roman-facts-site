// Roman numeral converter: numbers <-> numerals, plus today's date.
(function () {
  const $ = (s) => document.querySelector(s);
  const TABLE = [[1000, "M"], [900, "CM"], [500, "D"], [400, "CD"], [100, "C"], [90, "XC"], [50, "L"], [40, "XL"], [10, "X"], [9, "IX"], [5, "V"], [4, "IV"], [1, "I"]];
  const VAL = { I: 1, V: 5, X: 10, L: 50, C: 100, D: 500, M: 1000 };

  function toRoman(n) {
    let out = "";
    for (const [v, s] of TABLE) while (n >= v) { out += s; n -= v; }
    return out;
  }
  function fromRoman(s) {
    let total = 0;
    for (let i = 0; i < s.length; i++) {
      const a = VAL[s[i]], b = VAL[s[i + 1]] || 0;
      total += a < b ? -a : a;
    }
    // Only accept the standard form (so "IIII" or "VX" are rejected).
    return toRoman(total) === s ? total : null;
  }
  function loose(s) {
    let total = 0;
    for (let i = 0; i < s.length; i++) total += VAL[s[i]] < (VAL[s[i + 1]] || 0) ? -VAL[s[i]] : VAL[s[i]];
    return total;
  }
  function explain(n) {
    const parts = [];
    for (const [v, s] of TABLE) {
      let k = 0;
      while (n >= v) { n -= v; k++; }
      if (k) parts.push(`${s.repeat(k)} (${v * k})`);
    }
    return parts.join(" + ");
  }

  const input = $("#num-input"), out = $("#num-out");
  function render() {
    const raw = input.value.trim().toUpperCase();
    if (!raw) { out.innerHTML = `<div class="translit">Enter a number like 2026, or numerals like MMXXVI.</div>`; return; }
    if (/^\d+$/.test(raw)) {
      const n = parseInt(raw, 10);
      if (n < 1 || n > 3999) { out.innerHTML = `<div class="translit">Standard numerals only go from 1 to 3999. Romans had no zero, and bigger numbers needed a bar drawn over the top.</div>`; return; }
      out.innerHTML = `<div class="big-numeral">${toRoman(n)}</div><div class="translit">${n} = ${explain(n)}</div>`;
    } else if (/^[IVXLCDM]+$/.test(raw)) {
      const n = fromRoman(raw);
      out.innerHTML = n
        ? `<div class="big-numeral">${n}</div><div class="translit">${raw} = ${explain(n)}</div>`
        : `<div class="translit">"${raw}" isn't written the standard way.${loose(raw) >= 1 && loose(raw) <= 3999 ? ` Did you mean <b>${toRoman(loose(raw))}</b> (${loose(raw)})?` : ""}</div>`;
    } else {
      out.innerHTML = `<div class="translit">Use digits (0–9) or the letters I, V, X, L, C, D and M.</div>`;
    }
  }
  input.addEventListener("input", render);
  document.querySelectorAll("[data-try]").forEach((b) => b.addEventListener("click", () => { input.value = b.dataset.try; render(); }));

  const d = new Date();
  $("#today").textContent = `${toRoman(d.getDate())} · ${toRoman(d.getMonth() + 1)} · ${toRoman(d.getFullYear())}`;
  input.value = String(d.getFullYear());
  render();
})();
