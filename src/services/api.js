import axios from 'axios';

// Gunakan API Online
const API_BASE_URL = 'https://dramaboxapi-v3.vercel.app/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Response Interceptor untuk membersihkan data
api.interceptors.response.use(
  (response) => {
    // Jika response sukses dan punya property .data, kembalikan .data langsung
    // Struktur API: { success: true, data: { ... }, meta: ... }
    if (response.data && response.data.success) {
      return response.data; // Return full response body (kita butuh meta juga kadang)
    }
    return response.data;
  },
  (error) => {
    console.error('API Error:', error);
    throw error;
  }
);

export const getHome = async (page = 1, size = 12) => {
  const response = await api.get('/home', { params: { page, size } });
  return response; // akan dihandle di component
};

export const searchDrama = async (keyword, page = 1) => {
  const response = await api.get('/search', { params: { keyword, page } });
  return response;
};

export const getDramaDetail = async (bookId) => {
  // Coba V2 endpoint
  const response = await api.get(`/detail/${bookId}/v2`);
  // Interceptor sudah mengembalikan body data.
  // Struktur mungkin { data: { ... } } atau langsung { ... } tergantung backend.
  // Return apa adanya, biarkan component menormalisasi.
  return response;
};

export const getEpisodes = async (bookId) => {
  const response = await api.get(`/chapters/${bookId}`);
  return response.data; // array chapters
};

export const searchDramaById = async (bookId) => {
  // Use VIP endpoint which has complete drama data with chapterCount
  const response = await api.get('/vip');

  // Search through all columns for the drama
  if (response && response.data && response.data.data && response.data.data.columnVoList) {
    for (const column of response.data.data.columnVoList) {
      if (column.bookList) {
        const found = column.bookList.find(book => book.bookId === bookId);
        if (found) {
          return { data: found };
        }
      }
    }
  }

  return null;
};

export const getStreamUrl = async (bookId, episode) => {
  const response = await api.get('/stream', { params: { bookId, episode } });
  return response.data; // { video: {...}, ... }
};

export const getRecommendations = async () => {
  const response = await api.get('/recommend');
  return response;
};

export default api;
