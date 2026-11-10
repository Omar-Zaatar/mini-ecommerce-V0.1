import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import ChartCard from './ChartCard';
import { formatMoney } from '../../utils/dashboardStats';

function MonthlySalesChart({ data }) {
    return (
        <ChartCard title="Monthly Sales" isEmpty={data.length === 0}>
            <ResponsiveContainer width="100%" height="100%">
                <BarChart data={data}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip formatter={(value) => [formatMoney(value), 'Sales']} />
                    <Bar dataKey="sales" fill="#007bff" />
                </BarChart>
            </ResponsiveContainer>
        </ChartCard>
    );
}

export default MonthlySalesChart;