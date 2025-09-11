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
    let thead = `<thead><tr><th>Festival</th>`;
    drinks.forEach(drink => {
      thead += `<th>${drink}</th>`;
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

    // Wrap table with title
    table.innerHTML = `
      <thead>
        <tr><th colspan="${drinks.length + 1}">${year}</th></tr>
      </thead>
      ${thead}
      ${tbody}
    `;
    container.appendChild(table);
  });

  // Search filter
  document.getElementById("search").addEventListener("input", function() {
    const keyword = this.value.toLowerCase();
    const tables = container.querySelectorAll("table");

    tables.forEach(table => {
      const text = table.innerText.toLowerCase();
      table.style.display = text.includes(keyword) ? "table" : "none";
    });
  });
}

loadData();
