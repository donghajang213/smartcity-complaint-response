import axios from 'axios';

export const fetchCategoryStats = async () => {
    const response = await axios.get('/api/stats/category');
    return response.data;
}

export const fetchHourlyStats = async () => {
    const response = await axios.get('/api/stats/hourly');
    return response.data;
}

// category가 있으면 쿼리 파라미터로, 없으면 전체 키워드 가져오기
export const fetchKeywordStats = async (category) => {
    const url = category ? `/api/stats/keywords?category=${encodeURIComponent(category)}` : '/api/stats/keywords';
    const response = await axios.get(url);
    return response.data;
}