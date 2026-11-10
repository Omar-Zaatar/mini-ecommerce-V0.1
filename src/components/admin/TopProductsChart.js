import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import ChartCard from './ChartCard';

function TopProductsChart({ data }) {
    return (
        <ChartCard title="Top 5 Selling Products" isEmpty={data.length === 0}>
            <ResponsiveContainer width="100%" height="100%">
                <BarChart data={data} layout="vertical">
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis type="number" allowDecimals={false} />
                    <YAxis type="category" dataKey="name" width={110} />
                    <Tooltip formatter={(value) => [value, 'Quantity sold']} />
                    <Bar dataKey="quantity" fill="#28a745" />
                </BarChart>
            </ResponsiveContainer>
        </ChartCard>
    );
}

export default TopProductsChart;