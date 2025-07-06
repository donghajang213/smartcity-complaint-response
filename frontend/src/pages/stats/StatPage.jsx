import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/Card";
import { fetchCategoryStats, fetchKeywordStats  } from '../../api/statApi';
import CategoryPieChart from '../../components/stats/CategoryPieChart';
import KeywordTable from "../../components/stats/KeywordTable";

const StatPage = () => {
    const [categoryChartData, setCategoryChartData] = useState([]);
    const [keywordData, setKeywordData] = useState([]);
    const [categoryFilter, setCategoryFilter] = useState(""); // "" = 전체
    
    useEffect(() => {
        const loadData = async () => {
            try {
                const data = await fetchCategoryStats();
                setCategoryChartData(data);
            } catch (error) {
                console.error("통계 데이터를 불러오는 중 오류 발생:", error);
            }
        };
        loadData();
    }, []);

// 워드 클라우드
// 카테고리 선택 변경 핸들러
const handleCategoryChange = (e) => {
        setCategoryFilter(e.target.value);
    };
    // 카테고리별 워드클라우드 데이터 호출
    useEffect(() => {
    const loadKeywords = async () => {
        try {
        const data = await fetchKeywordStats(categoryFilter);
        console.info("data: ")
        console.info(data)
        const transformedData = data.map(item => ({
        text: item.text,
        value: item.count,
        }));
        console.info("transformedData: ")
        console.info(transformedData)
        setKeywordData(transformedData);
        } catch (error) {
        console.error("키워드 데이터 불러오기 실패:", error);
        }
    };
    loadKeywords();
}, [categoryFilter]);

    return (
        <div className="min-h-screen bg-gradient-to-b from-indigo-50 to-white relative">

        <div className="max-w-7xl mx-auto px-6 py-12 space-y-12">

            {/* 대시보드 차트 */}
            <Card className="rounded-2xl shadow-md bg-white">
            <CardHeader>
                <CardTitle className="text-2xl font-bold">📊 SmartCity 대시보드</CardTitle>
            </CardHeader>
            <CardContent className="px-6 pb-10 pt-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* 파이 차트 */}
                <div>
                    <h3 className="text-lg font-semibold text-gray-700 mb-2">카테고리별 민원 비율</h3>
                    <CategoryPieChart data={categoryChartData} />
                </div>

                {/* 키워드 순위 */}
                <div className="mb-4">
                    <h3 className="text-lg font-semibold text-gray-700 mb-2">카테고리별 주요 키워드</h3>
                    <label htmlFor="category-select" className="mr-2 font-semibold text-gray-700">카테고리 선택:</label>
                    <select
                    id="category-select"
                    value={categoryFilter}
                    onChange={handleCategoryChange}
                    className="border rounded px-2 py-1"
                    >
                    <option value="">전체</option>
                    <option value="교통">교통</option>
                    <option value="환경">환경</option>
                    <option value="시설">시설</option>
                    <option value="정책">정책</option>
                    </select>

                    <div className="h-72">
                    <KeywordTable keywords={keywordData} />
                    </div>
                </div>
                </div>
            </CardContent>
            </Card>

        </div>
    </div>
    );
};

export default StatPage;