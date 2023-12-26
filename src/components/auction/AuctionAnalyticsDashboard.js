import React, { useState } from 'react';
import { Bar, Line, Pie } from 'react-chartjs-2';
import './AuctionAnalyticsDashboard';

const AnalyticsDashboard = () => {
    const [timeFilter, setTimeFilter] = useState('monthly');

    // Example datasets for different time periods
    const datasets = {
        monthly: {
            bids: [65, 59, 80, 81, 56, 55],
            participation: [28, 48, 40, 19, 86, 27]
        },
        quarterly: {
            bids: [120, 150, 100],
            participation: [60, 70, 80]
        },
        yearly: {
            bids: [450, 560, 600],
            participation: [200, 300, 400]
        }
    };

    const barData = {
        labels: timeFilter === 'monthly' ? ['January', 'February', 'March', 'April', 'May', 'June'] : timeFilter === 'quarterly' ? ['Q1', 'Q2', 'Q3'] : ['2019', '2020', '2021'],
        datasets: [{
            label: 'Total Bids',
            data: datasets[timeFilter].bids,
            backgroundColor: 'rgba(75,192,192,0.6)'
        }]
    };

    const lineData = {
        labels: timeFilter === 'monthly' ? ['January', 'February', 'March', 'April', 'May', 'June'] : timeFilter === 'quarterly' ? ['Q1', 'Q2', 'Q3'] : ['2019', '2020', '2021'],
        datasets: [{
            label: 'Auction Participation',
            data: datasets[timeFilter].participation,
            backgroundColor: 'rgba(153,102,255,0.6)'
        }]
    };

    const pieData = {
        labels: ['Electronics', 'Books', 'Clothing', 'Furniture'],
        datasets: [{
            label: 'Categories',
            data: [300, 50, 100, 80],
            backgroundColor: ['rgba(255,99,132,0.6)', 'rgba(54,162,235,0.6)', 'rgba(255,206,86,0.6)', 'rgba(75,192,192,0.6)'],
            hoverBackgroundColor: ['rgba(255,99,132,0.8)', 'rgba(54,162,235,0.8)', 'rgba(255,206,86,0.8)', 'rgba(75,192,192,0.8)']
        }]
    };  
    
        

    const handleFilterChange = (e) => {
        setTimeFilter(e.target.value);
        // Add logic to fetch data based on the selected filter
    };

    return (
        <div className="analytics-dashboard" style={{ padding: '20px' }}>
            <h2 style={{ textAlign: 'center' }}>Analytics Dashboard</h2>

            <div style={{ marginBottom: '20px' }}>
                <h3 style={{ textAlign: 'center' }}>Filter by Time Period</h3>
                <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '20px' }}>
                    <select onChange={handleFilterChange} value={timeFilter} style={{ padding: '10px', width: '200px' }}>
                        <option value="monthly">Monthly</option>
                        <option value="quarterly">Quarterly</option>
                        <option value="yearly">Yearly</option>
                    </select>
                </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-around', flexWrap: 'wrap' }}>
                <div style={{ width: '30%', minWidth: '300px' }}>
                    <h3>Total Bids Over Time</h3>
                    <Bar data={barData} />
                </div>

                <div style={{ width: '30%', minWidth: '300px' }}>
                    <h3>Auction Participation by Month</h3>
                    <Line data={lineData} />
                </div>

                <div style={{ width: '20%', minWidth: '100px' }}>
                    <h3>Category Breakdown</h3>
                    <Pie data={pieData} />
                </div>
            </div>
        </div>
    );
};

export default AnalyticsDashboard;
