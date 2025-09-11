// Script to fetch data from Google Sheets JSON feed and render tables

const sheetId = "2PACX-1vRgHePLMMCG5HB9M9UeW97ZydyHIQdwaqkHWkpGxgtAeKGbU1gYv7G3A5wAZx4n7tFT4AioQq6DfGcd";
const url = `https://spreadsheets.google.com/feeds/list/${sheetId}/od6/public/values?alt=json`;

async function loadData() {
  try {
    const response = await fetch(url);
    const dataJSON = await response.json();
    
    // Extract rows
    const entries = dataJSON.feed.entry;

    const data = entries.map(row => ({
      festival: row.gsx$festival.$t.trim(),
      year: parseInt(row.gsx$year.$t),
      beer_brand: row.gsx$beer_brand.$t.trim(),
      size_liters: parseFloat(row.gsx$size_liters.$t),
      price_eur: parseFloat(row.gsx$price_eur.$t),
      price_per_liter: parseFloat(row.gsx$price_per_liter.$t)
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

  // Unique years
  const years = [...new Set(data.map(d => d.year))].sort();

  years.forEach(year => {
    const yearData = data.filter(d => d.year === year);

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

// Load data on page load
loadData();
