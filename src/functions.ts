export function formatTime(date = new Date()) {
  const hours = date.getHours();
  const minutes = date.getMinutes().toString().padStart(2, "0");
  const seconds = date.getSeconds().toString().padStart(2, "0");
  const ampm = hours >= 12 ? "PM" : "AM";
  const formattedHours = (hours % 12 || 12).toString();

  return `${formattedHours}:${minutes}:${seconds} ${ampm}`;
}

function getDaySuffix(day: number): string {
  if (day > 3 && day < 21) return "th";
  switch (day % 10) {
    case 1:
      return "st";
    case 2:
      return "nd";
    case 3:
      return "rd";
    default:
      return "th";
  }
}

export function formatDateTime(date = new Date()) {
  const day = date.getDate();
  const suffix = getDaySuffix(day);
  const month = date.toLocaleString("default", { month: "short" });
  const year = date.getFullYear();
  const time = formatTime(date).replace(/:\d{2} /, " ");

  return `${day}${suffix} ${month}, ${year} ${time}`;
}
