export const getInitials = (nome) => {
  if (!nome) return "P";
  return nome
    .split(" ")
    .map((n) => n[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
};
