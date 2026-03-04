export function toUserMessage(error, fallback) {
  const status = error?.response?.status;
  const serverMsg = error?.response?.data?.message || error?.userMessage || error?.message;

  if (status === 500) return "Serverda ichki xatolik (500). Iltimos, keyinroq urinib ko'ring.";
  if (status === 404) return "Ma'lumot topilmadi (404).";
  if (status === 401) return "Avtorizatsiya talab qilinadi (401).";
  if (status === 403) return "Ruxsat etilmagan amal (403).";
  if (status === 400) {
    if (String(serverMsg || '').toLowerCase().includes('holat')) {
      return "Noto'g'ri holat. Quyidagilardan birini tanlang: yangi, jarayonda, tayyor, yetkazildi, bekor_qilindi.";
    }
    return "So'rov noto'g'ri (400). Ma'lumotlarni tekshirib, qayta yuboring.";
  }

  return fallback || serverMsg || "Noma'lum xatolik yuz berdi.";
}






