// Make sure you include PapaParse in index.html
// <script src="https://cdn.jsdelivr.net/npm/papaparse@5.4.1/papaparse.min.js"></script>

async function loadData() {
  const url = "https://docs.google.com/spreadsheets/d/e/2PACX-1vRgHePLMMCG5HB9M9UeW97ZydyHIQdwaqkHWkpGxgtAeKGbU1gYv7G3A5wAZx4n7tFT4AioQq6DfGcd/pub?gid=0&single=true&output=csv"; // replace with your sheet link

  try {
    const response = await fetch(url);
    const csvText = await response.text();

    const parsed = Papa.parse(csvText, { header: true, skipEmptyLines: true });

    // Map CSV rows to usable data
    const data = parsed.data.map(row => ({
      festival: row.festival.trim(),
      year: parseInt(row.year),
      beer_brand: row.beer_brand.trim(),
      size_liters: parseFloat(row.size_liters),
      price_eur: parseFloat(row.price_eur),
      price_per_liter: parseFloat(row.price_per_liter)
    }));

    renderTables(data);
  } catch (error) {
    console.error("Error loading data:", error);
    document.getElementById("tablesContainer").innerHTML = "<p>Failed to load data.</p>";
  }
}

function renderTables(data) {
  const container = document.getElementById("tablesContainer");
  container.innerHTML = "";

  // Get unique years
  const years = [...new Set(data.map(d => d.year))].sort();

  years.forEach(year => {
    const yearData = data.filter(d => d.year === year);

    // Unique drink labels for header
    const drinks = [...new Set(yearData.map(d => `${d.size_liters}l ${d.beer_brand}`))].sort();
    const festivals = [...new Set(yearData.map(d => d.festival))].sort();

    const table = document.createElement("table");

    // Table header
    let thead = `<thead>
      <tr><th colspan="${drinks.length + 1}">${year}</th></tr>
      <tr><th>Festival</th>`;
    drinks.forEach(drink => thead += `<th>${drink}</th>`);
    thead += "</tr></thead>";

    // Table body
    let tbody = "<tbody>";
    festivals.forEach(festival => {
      tbody += `<tr><td><strong>${festival}</strong></td>`;
      drinks.forEach(drink => {
        const item = yearData.find(d =>
          d.festival === festival && `${d.size_liters}l ${d.beer_brand}` === drink
        );
        tbody += `<td>${item ? item.price_eur.toFixed(2) : "-"}</td>`;
      });
      tbody += "</tr>";
    });
    tbody += "</tbody>";

    table.innerHTML = thead + tbody;
    container.appendChild(table);

    enableSorting(table);
  });
}

// Sorting function
function enableSorting(table) {
  const headers = table.querySelectorAll("thead tr:nth-child(2) th"); // skip year title row
  headers.forEach((th, i) => {
    th.addEventListener("click", () => {
      const tbody = table.querySelector("tbody");
      const rows = Array.from(tbody.querySelectorAll("tr"));
      const asc = th.classList.toggle("asc");

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
