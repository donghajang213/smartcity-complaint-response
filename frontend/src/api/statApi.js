import axios from 'axios';

export const fetchCategoryStats = async () => {
    const response = await axios.get('/api/stats/category');
    return response.data;
}

export const fetchHourlyStats = async () => {
    const response = await axios.get('/api/stats/hourly');
    return response.data;
}
