async function loadData() {
  const url = "https://docs.google.com/spreadsheets/d/e/2PACX-1vRgHePLMMCG5HB9M9UeW97ZydyHIQdwaqkHWkpGxgtAeKGbU1gYv7G3A5wAZx4n7tFT4AioQq6DfGcd/pub?gid=0&single=true&output=csv"; // replace with your link

  const response = await fetch(url);
  const csvText = await response.text();

  // Parse CSV using PapaParse
  const parsed = Papa.parse(csvText, { header: true });
  const data = parsed.data.map(row => ({
    festival: row.festival.trim(),
    year: parseInt(row.year),
    beer_brand: row.beer_brand.trim(),
    size_liters: parseFloat(row.size_liters.replace(",", ".")),
    price_eur: parseFloat(row.price_eur.replace(",", ".")),
    price_per_liter: parseFloat(row.price_per_liter.replace(",", "."))
  }));

  renderTables(data);
}
