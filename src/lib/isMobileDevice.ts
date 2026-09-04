/** True on phones/tablets where the Web Share API can hand off PDFs to WhatsApp. */
export function isMobileDevice(): boolean {
  if (typeof navigator === 'undefined') return false
  return /Android|iPhone|iPad|iPod|Mobile|webOS|BlackBerry|IEMobile|Opera Mini/i.test(
    navigator.userAgent,
  )
}
