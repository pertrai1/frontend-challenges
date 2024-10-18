export async function fetchData() {
  try {
    const data = await fetch("http://localhost:8080/data.json");
    const json = await data.json();
    return json;
  } catch (error) {
    console.error(error);
  }
}
