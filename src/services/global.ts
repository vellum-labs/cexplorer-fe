import { useQuery } from "@tanstack/react-query";

export const fetchTVL = async () => {
  const url = "https://api.llama.fi/charts/cardano";

  return fetch(url).then(data => data.json()) as Promise<
    {
      date: number;
      totalLiquidityUSD: number;
    }[]
  >;
};

export const useFetchTVL = () =>
  useQuery({
    queryKey: ["llama-fi"],
    queryFn: async () => {
      const data = await fetchTVL();

      return data;
    },
  });
