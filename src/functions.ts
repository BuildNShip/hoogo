export function formatTime(date = new Date()) {
  const hours = date.getHours();
  const minutes = date.getMinutes().toString().padStart(2, "0");
  const seconds = date.getSeconds().toString().padStart(2, "0");
  const ampm = hours >= 12 ? "PM" : "AM";
  const formattedHours = (hours % 12 || 12).toString();

  return `${formattedHours}:${minutes}:${seconds} ${ampm}`;
}
