import axios from 'axios';

// export const fetchCategoryStats = async () => {
//     const response = await axios.get('/api/stats/category');
//     return response.data;
// }

// src/api/statApi.js

const USE_DUMMY = true;

export const fetchCategoryStats = async () => {
    if (USE_DUMMY) {
        return [
            { categoryName: '교통', count: 70 },
            { categoryName: '도로', count: 20 },
            { categoryName: '환경', count: 7 },
            { categoryName: '행정', count: 10 },
            { categoryName: '정책', count: 3 },
            { categoryName: '시설', count: 15 },
        ];
    }

    const response = await axios.get('/api/stats/category');
    return response.data;
};
