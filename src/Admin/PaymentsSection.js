import React, { useMemo } from "react";
import "./AdminDashboard.css";

export default function PaymentsSection({ derivedPayments }) {
  // Compute total revenue and summary using useMemo for performance
  const { totalRevenue, totalPayments, monthlyReport } = useMemo(() => {
    let total = 0;
    let monthly = {};

    derivedPayments.forEach((p) => {
      total += Number(p.amountPaid);
      const month = new Date(p.date).toLocaleString("default", { month: "short", year: "numeric" });
      monthly[month] = (monthly[month] || 0) + Number(p.amountPaid);
    });

    return {
      totalRevenue: total,
      totalPayments: derivedPayments.length,
      monthlyReport: monthly
    };
  }, [derivedPayments]);

  return (
    <div className="payments-section">
      <h3>💰 Track Payments</h3>

      {/* Revenue Summary */}
      <div className="revenue-summary">
        <div className="summary-card">
          <h4>Total Revenue</h4>
          <p>₹{totalRevenue.toLocaleString()}</p>
        </div>
        <div className="summary-card">
          <h4>Total Payments</h4>
          <p>{totalPayments}</p>
        </div>
      </div>

      {/* Monthly Breakdown */}
      <div className="monthly-report">
        <h4>📊 Monthly Revenue Report</h4>
        {Object.keys(monthlyReport).length === 0 ? (
          <p>No data available yet.</p>
        ) : (
          <ul>
            {Object.entries(monthlyReport).map(([month, amount], index) => (
              <li key={index}>
                <strong>{month}</strong>: ₹{amount.toLocaleString()}
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* Payments Table */}
      {derivedPayments.length === 0 ? (
        <p>No payments recorded yet.</p>
      ) : (
        <table>
          <thead>
            <tr>
              <th>Student</th>
              <th>Course</th>
              <th>Amount Paid</th>
              <th>Date</th>
            </tr>
          </thead>
          <tbody>
            {derivedPayments.map((p, i) => (
              <tr key={i}>
                <td>{p.studentName}</td>
                <td>{p.courseTitle}</td>
                <td>₹{p.amountPaid}</td>
                <td>{new Date(p.date).toLocaleDateString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
