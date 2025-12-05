import React from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';

const CATEGORY_COLORS = {
    '교통': '#FFB347',
    '도로': '#888888',
    '환경': '#61C27C',
    '행정': '#4B9EFF',
    '정책': '#A066D3',
    '시설': '#F76E6E',
};

const CategoryBarChart = ({ data }) => {
    return (
        <ResponsiveContainer width="100%" height={400}>
        <BarChart data={data}>
            <XAxis dataKey="categoryName" />
            <YAxis />
            <Tooltip />
            <Bar dataKey="count">
            {data.map((entry, index) => (
                <Cell
                key={`cell-${index}`}
                fill={CATEGORY_COLORS[entry.categoryName] || '#ccc'} // fallback 색상
                />
            ))}
            </Bar>
        </BarChart>
        </ResponsiveContainer>
    );
};

export default CategoryBarChart;
