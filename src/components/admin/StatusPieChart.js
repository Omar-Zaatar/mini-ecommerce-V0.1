import React from 'react';
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import ChartCard from './ChartCard';
import { STATUS_COLORS } from '../../utils/dashboardStats';

function StatusPieChart({ data }) {
    return (
        <ChartCard title="Orders by Status" isEmpty={data.length === 0}>
            <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                    <Pie data={data} dataKey="value" nameKey="name" outerRadius={100} label>
                        {data.map(entry => (
                            <Cell key={entry.name} fill={STATUS_COLORS[entry.name] || '#6c757d'} />
                        ))}
                    </Pie>
                    <Tooltip />
                    <Legend />
                </PieChart>
            </ResponsiveContainer>
        </ChartCard>
    );
}

export default StatusPieChart;