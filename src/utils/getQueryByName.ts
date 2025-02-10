export const getQueryByName = (
  name: string,
  url = window.location.href
): string | null => {
  const ref = new URL(url);
  const searchParams = ref.searchParams;

  if (!searchParams.has(name)) {
    return null;
  }

  return searchParams.get(name);
};
