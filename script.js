async function loadData() {
  const response = await fetch("data.json");
  const data = await response.json();

  const container = document.getElementById("tablesContainer");
  container.innerHTML = "";

  // Group data by festival
  const festivals = [...new Set(data.map(d => d.festival))];

  festivals.forEach(festival => {
    // Group by year
    const festivalData = data.filter(d => d.festival === festival);
    const years = [...new Set(festivalData.map(d => d.year))].sort();

    years.forEach(year => {
      const yearData = festivalData.filter(d => d.year === year);

      // Build table HTML
      const table = document.createElement("table");
      table.innerHTML = `
        <thead>
          <tr><th colspan="2">${festival} – ${year}</th></tr>
          <tr>
            <th>Drink</th>
            <th>Price (€)</th>
          </tr>
        </thead>
        <tbody>
          ${yearData.map(item =>
            `<tr><td>${item.drink}</td><td>${item.price.toFixed(2)}</td></tr>`
          ).join('')}
        </tbody>
      `;
      container.appendChild(table);
    });
  });

  // Add search filter
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
