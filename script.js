async function loadData() {
  const response = await fetch("data.json");
  const data = await response.json();
  renderTable(data);

  // Add search functionality
  document.getElementById("search").addEventListener("keyup", function() {
    const keyword = this.value.toLowerCase();
    const filtered = data.filter(item =>
      item.festival.toLowerCase().includes(keyword) ||
      item.drink.toLowerCase().includes(keyword)
    );
    renderTable(filtered);
  });
}

function renderTable(data) {
  const tbody = document.querySelector("#drinkTable tbody");
  tbody.innerHTML = "";
  data.forEach(item => {
    const row = `<tr>
      <td>${item.festival}</td>
      <td>${item.drink}</td>
      <td>${item.price.toFixed(2)}</td>
    </tr>`;
    tbody.innerHTML += row;
  });
}

loadData();
