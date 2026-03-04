import { useMutation, useQuery } from '@tanstack/react-query';
import { api } from '../index';

// parseAxiosError hozir faqat obyektni qaytaradi — komponentlarda ishlatiladi
export const parseAxiosError = (error) => {
  if (error?.response) {
    const status = error.response.status;
    const data = error.response.data;
    if (status === 404) {
      const serverText = typeof data === 'string' ? data : JSON.stringify(data);
      return `Endpoint topilmadi (404). URL: ${error.config?.baseURL || ''}${error.config?.url || ''}. Server: ${serverText}`;
    }
    if (status === 401) {
      return data?.message || `Username yoki parol noto'g'ri (401)`;
    }
    if (status === 400) {
      return data?.message || `Noto'g'ri ma'lumot yuborildi (400)`;
    }
    return data?.message || `Server xatosi (${status})`;
  } else if (error?.request) {
    return `Serverga ulanib bo'lmadi. Server ishga tushganligini tekshiring. (${error.message})`;
  } else {
    return error?.message || 'Noma\'lum xato';
  }
};

export const useAdmin = () => {
  return useMutation({
    mutationFn: async (credentials) => {
      // Debug: ko'rish uchun payloadni konsolga yozamiz
      const payload = {
        // backend nima kutishini aniq bilmasak, hozir ikkala varianti ham qo'shamiz.
        // Agar backend aniq bitta maydonni kutsa, uni o'chiring.
        username: credentials.username || undefined,
        telefon: credentials.telefon || undefined,
        password: credentials.password
      };

      // undefined maydonlarni olib tashlash
      Object.keys(payload).forEach(k => payload[k] === undefined && delete payload[k]);

      console.debug('[useAdmin] admin login payload:', payload);
      console.debug('[useAdmin] credentials:', credentials);

      const response = await api.post('/admin/login', payload);
      console.debug('[useAdmin] admin login response:', response?.data);
      return response.data;
    },
    onSuccess: (data) => {
      if (data?.token) {
        localStorage.setItem('token', data.token);
      }
      if (data?.admin) {
        localStorage.setItem('user', JSON.stringify({
          ...data.admin,
          role: 'admin'
        }));
      }
    },
    onError: (error) => {
      // Faoliyat uchun: console da qulayroq xabar qoldiramiz, ammo "throw" qilmaymiz.
      const parsed = parseAxiosError(error);
      console.error('useAdmin onError:', parsed);
      // Eslatma: mutateAsync ichidagi catch (component) da original error oladi
    }
  });
};

// boshqa funksiyalarni o'zgartirish shart emas, lekin onErrorlarda parseAxiosError ishlatsa foydali:
export const useGetAdmins = () => {
  return useQuery({
    queryKey: ['admins'],
    queryFn: async () => {
      const res = await api.get('/admin');
      return res.data;
    },
    onError: (error) => {
      console.error('Get admins error:', parseAxiosError(error));
    }
  });
};
