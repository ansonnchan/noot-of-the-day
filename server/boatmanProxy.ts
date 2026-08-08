const DEFAULT_BOATMAN_URL =
  "https://saa-s-penguin-api.vercel.app/api/v1/fact/random";

export async function requestBoatmanFact(
  signal?: AbortSignal,
): Promise<unknown> {
  const response = await fetch(
    process.env.BOATMAN_API_URL ?? DEFAULT_BOATMAN_URL,
    {
      headers: { Accept: "application/json" },
      signal,
    },
  );

  if (!response.ok) {
    throw new Error(`Boatman responded with ${response.status}`);
  }

  return response.json() as Promise<unknown>;
}

