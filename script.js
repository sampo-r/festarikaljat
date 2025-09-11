async function loadData() {
  const response = await fetch("data.json");
  const data = await response.json();

  const container = document.getElementById("tablesContainer");
  container.innerHTML = "";

  // Get unique years
  const years = [...new Set(data.map(d => d.year))].sort();

  years.forEach(year => {
    const yearData = data.filter(d => d.year === year);

    // Get all unique drinks for this year
    const drinks = [...new Set(yearData.map(d => d.drink))].sort();

    // Build table
    const table = document.createElement("table");

    // Header row
    let thead = `<thead><tr><th colspan="${drinks.length + 1}">${year}</th></tr><tr><th data-sort="festival">Festival ⬍</th>`;
    drinks.forEach(drink => {
      thead += `<th data-sort="${drink}">${drink} ⬍</th>`;
    });
    thead += `</tr></thead>`;

    // Body rows
    let tbody = "<tbody>";
    const festivals = [...new Set(yearData.map(d => d.festival))].sort();
    festivals.forEach(festival => {
      tbody += `<tr><td><strong>${festival}</strong></td>`;
      drinks.forEach(drink => {
        const item = yearData.find(d => d.festival === festival && d.drink === drink);
        tbody += `<td>${item ? item.price.toFixed(2) : "-"}</td>`;
      });
      tbody += "</tr>";
    });
    tbody += "</tbody>";

    table.innerHTML = thead + tbody;
    container.appendChild(table);

    // Add sorting
    enableSorting(table);
  });
}

// Sorting function
function enableSorting(table) {
  const headers = table.querySelectorAll("thead th");
  headers.forEach((th, i) => {
    th.addEventListener("click", () => {
      const tbody = table.querySelector("tbody");
      const rows = Array.from(tbody.querySelectorAll("tr"));
      const asc = th.classList.toggle("asc");

      rows.sort((a, b) => {
        const aText = a.children[i].innerText.trim();
        const bText = b.children[i].innerText.trim();

        const aNum = parseFloat(aText.replace(",", "."));
        const bNum = parseFloat(bText.replace(",", "."));

        // If both numbers are valid
        if (!isNaN(aNum) && !isNaN(bNum)) {
          return asc ? aNum - bNum : bNum - aNum;
        }
        // If only one is a number → push "-" to bottom
        if (!isNaN(aNum)) return asc ? -1 : 1;
        if (!isNaN(bNum)) return asc ? 1 : -1;

        // Fallback to text sorting
        return asc ? aText.localeCompare(bText) : bText.localeCompare(aText);
      });

      tbody.innerHTML = "";
      rows.forEach(r => tbody.appendChild(r));
    });
  });
}


loadData();
