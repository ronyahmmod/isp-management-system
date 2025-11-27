export const fetcher = (url) =>
  fetch(url).then(async (res) => {
    if (!res.ok) {
      const error = new Error("Fetch error");
      error.info = await res.json();
      error.status = res.status;
      throw error;
    }
    return res.json();
  });
