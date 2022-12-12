export const useActiveBlock = (component?: string, fallback = "Feed") => {
  return useState("activeBlock", () => {
    return component ? component : fallback;
  });
};
