const BASE_URL = "https://pokeapi.co/api/v2";

export async function fetchPokemon(name, signal) {
  const response = await fetch(
    `${BASE_URL}/pokemon/${name.toLowerCase()}`,
    { signal }
  );

  if (!response.ok) {
    throw new Error(`Pokemon "${name}" no encontrado`);
  }

  return await response.json();
}

export async function fetchMove(url) {
  const response = await fetch(url);

  if (!response.ok) {
    throw new Error(`No se encuentra el move: "${url}"`);
  }

  return await response.json();
}
   



