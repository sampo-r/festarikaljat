// Make sure you include PapaParse in your HTML
// <script src="https://cdn.jsdelivr.net/npm/papaparse@5.4.1/papaparse.min.js"></script>

const sheetUrl = "REMOVED";

async function loadData() {
  try {
    const response = await fetch(sheetUrl);
    if (!response.ok) throw new Error(`HTTP error ${response.status}`);
    
    const csvText = await response.text();
    const parsed = Papa.parse(csvText, { header: true, skipEmptyLines: true });

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

  // Sort years descending so latest year is on top
const years = [...new Set(data.map(d => d.year))].sort((a, b) => b - a);


  years.forEach(year => {
    const yearData = data.filter(d => d.year === year);

    const table = document.createElement("table");

    // Table header
    const thead = `
      <thead>
        <tr><th colspan="5">${year}</th></tr>
        <tr>
          <th>Festival</th>
          <th>Beer Brand</th>
          <th>Size (L)</th>
          <th>Price (€)</th>
          <th>Price/L (€)</th>
        </tr>
      </thead>
    `;

    // Table body
    let tbody = "<tbody>";
    yearData.forEach(item => {
      tbody += `
        <tr>
          <td>${item.festival}</td>
          <td>${item.beer_brand}</td>
          <td>${item.size_liters.toFixed(2)}</td>
          <td>${item.price_eur.toFixed(2)}</td>
          <td>${item.price_per_liter.toFixed(2)}</td>
        </tr>
      `;
    });
    tbody += "</tbody>";

    table.innerHTML = thead + tbody;
    container.appendChild(table);

    enableSorting(table); // keep sorting by any column
  });
}


function enableSorting(table) {
  const headers = table.querySelectorAll("thead tr:nth-child(2) th");
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

loadData();
