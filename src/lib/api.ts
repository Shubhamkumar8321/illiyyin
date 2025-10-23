export async function fetchData(endpoint: string) {
  const res = await fetch(endpoint);
  return res.json();
}
