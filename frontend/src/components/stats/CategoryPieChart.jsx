import React from 'react';
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from 'recharts';

const CATEGORY_COLORS = {
    '교통': '#FFB347',
    '도로': '#888888',
    '환경': '#61C27C',
    '행정': '#4B9EFF',
    '정책': '#A066D3',
    '시설': '#F76E6E',
};

const CategoryPieChart = ({ data }) => {
    return (
        <ResponsiveContainer width="100%" height={400}>
        <PieChart>
            <Pie
            data={data}
            dataKey="count"
            nameKey="categoryName"
            cx="50%"
            cy="50%"
            outerRadius={120}
            fill="#8884d8"
            label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
            >
            {data.map((entry, index) => (
                <Cell
                key={`cell-${index}`}
                fill={CATEGORY_COLORS[entry.categoryName] || '#ccc'}
                />
            ))}
            </Pie>
            <Tooltip />
        </PieChart>
        </ResponsiveContainer>
    );
};

export default CategoryPieChart;
