export const checkInternetSpeed = async () => {
  const start = performance.now();

  try {
    const res = await fetch("https://jsonplaceholder.typicode.com/posts/1");
    const end = performance.now();

    if (!res.ok) {
      return undefined;
    }

    return Math.round(end - start);
  } catch (e) {
    return undefined;
  }
};
