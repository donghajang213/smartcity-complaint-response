import React from 'react';
import {
    BarChart, Bar, XAxis, YAxis, Tooltip,
    ResponsiveContainer, CartesianGrid
} from 'recharts';

const HourlyBarChart = ({ data }) => {
    return (
        <ResponsiveContainer width="100%" height={240}>
        <BarChart
            data={data}
            margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
        >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis
            dataKey="hour"
                tickFormatter={(tick) => `${tick}시`}
                ticks={[0, 3, 6, 9, 12, 15, 18, 21]}
                interval={0}
            />
            <YAxis label={{ value: '질문 수', angle: -90, position: 'insideLeft' }} />
            <Tooltip formatter={(value) => [value, '질문 수']} />
            <Bar dataKey="count" fill="#4B9EFF" />
        </BarChart>
        </ResponsiveContainer>
    );
};

export default HourlyBarChart;
