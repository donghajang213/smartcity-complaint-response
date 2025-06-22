import React, { useEffect, useState } from 'react';
import { fetchCategoryStats  } from '../../api/statApi';
import CategoryBarChart from '../../components/stats/CategoryBarChart';
import CategoryPieChart from '../../components/stats/CategoryPieChart';

const StatPage = () => {
    const [chartData, setChartData] = useState([]);

    useEffect(() => {
        const loadData = async () => {
            try {
                const data = await fetchCategoryStats();
                setChartData(data);
            } catch (error) {
                console.error("통계 데이터를 불러오는 중 오류 발생:", error);
            }
        };
        loadData();
    }, []);

    return (
        <div>
            <h2>카테고리별 질문 통계</h2>
            <CategoryBarChart data={chartData} />
            <CategoryPieChart data={chartData} />
        </div>
    );
};

export default StatPage;