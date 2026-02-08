/**
 * Formatta timestamp con data completa e leggibile
 * Accetta sia millisecondi (number) che nanosecondi (BigInt dal backend Motoko)
 * @param {number|bigint} timestamp - timestamp da convertire
 * @returns {string} Formato: "8 Feb 2026, 14:30"
 */
export function formatDate(timestamp) {
  if (!timestamp && timestamp !== 0) return "Data sconosciuta";
  
  // Converti BigInt a number se necessario
  let ts = typeof timestamp === 'bigint' ? Number(timestamp) : timestamp;
  
  // Se è in nanosecondi (numero molto grande), converti a millisecondi
  // Nanosecondi dal backend Motoko sono ~1.7e18, millisecondi sono ~1.7e12
  if (ts > 1e15) {
    ts = Math.floor(ts / 1_000_000); // Nanosecondi → Millisecondi
  }
  
  const date = new Date(ts);
  const monthNames = ["Gen", "Feb", "Mar", "Apr", "Mag", "Giu", 
                      "Lug", "Ago", "Set", "Ott", "Nov", "Dic"];
  
  const day = date.getDate();
  const month = monthNames[date.getMonth()];
  const year = date.getFullYear();
  const hours = String(date.getHours()).padStart(2, "0");
  const minutes = String(date.getMinutes()).padStart(2, "0");
  
  return `${day} ${month} ${year}, ${hours}:${minutes}`;
}
