// API URL from your Vercel backend
const sheetUrl = "https://festarikaljat-backend.vercel.app/api/beers";

async function loadData() {
  try {
    const response = await fetch(sheetUrl);
    if (!response.ok) throw new Error(`HTTP error ${response.status}`);

    // Parse JSON directly (backend returns JSON, not CSV)
    const data = await response.json();
    renderTables(data);
  } catch (error) {
    console.error("Error loading data:", error);
    document.getElementById("tablesContainer").innerHTML = "<p>Failed to load data.</p>";
  }
}

function renderTables(data) {
  const container = document.getElementById("tablesContainer");
  container.innerHTML = "";

  // Latest year first
  const years = [...new Set(data.map(d => d.year))].sort((a, b) => b - a);

  years.forEach(year => {
    const yearData = data.filter(d => d.year === year);
    const table = document.createElement("table");

    // Table header
    let thead = `<thead>
      <tr class="year-row"><th colspan="5">${year}</th></tr>
      <tr>
        <th>Festival</th>
        <th>Beer Brand</th>
        <th>Size (L)</th>
        <th>Price (€)</th>
        <th>Price/L (€)</th>
      </tr>
    </thead>`;

    // Table body
    let tbody = "<tbody>";
    yearData.forEach(item => {
      tbody += `<tr>
        <td>${item.festival}</td>
        <td>${item.beer_brand}</td>
        <td>${item.size_liters.toFixed(2)}</td>
        <td>${item.price_eur.toFixed(2)}</td>
        <td>${item.price_per_liter.toFixed(2)}</td>
      </tr>`;
    });
    tbody += "</tbody>";

    table.innerHTML = thead + tbody;
    container.appendChild(table);

    enableSorting(table);
  });
}

function enableSorting(table) {
  const headers = table.querySelectorAll("thead tr:nth-child(2) th");
  headers.forEach((th, i) => {
    th.addEventListener("click", () => {
      const tbody = table.querySelector("tbody");
      const rows = Array.from(tbody.querySelectorAll("tr"));
      const asc = th.classList.toggle("asc");
      th.classList.toggle("desc", !asc);

      rows.sort((a, b) => {
        const aText = a.children[i].innerText.trim();
        const bText = b.children[i].innerText.trim();

        const aNum = parseFloat(aText);
        const bNum = parseFloat(bText);

        if (!isNaN(aNum) && !isNaN(bNum)) return asc ? aNum - bNum : bNum - aNum;
        return asc ? aText.localeCompare(bText) : bText.localeCompare(aText);
      });

      tbody.innerHTML = "";
      rows.forEach(r => tbody.appendChild(r));
    });
  });
}

// Load data on page load
loadData();
