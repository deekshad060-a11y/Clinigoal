import React, { useMemo } from "react";
import "./AdminDashboard.css";

export default function PaymentsSection({ derivedPayments }) {
  // Enhanced date validation function
  const isValidDate = (dateString) => {
    if (!dateString) return false;
    const date = new Date(dateString);
    return !isNaN(date.getTime());
  };

  // Format date safely
  const formatDateSafe = (dateString) => {
    if (!isValidDate(dateString)) {
      return "Invalid Date";
    }
    return new Date(dateString).toLocaleDateString('en-IN', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  };

  // Compute total revenue and summary using useMemo for performance
  const { totalRevenue, totalPayments, monthlyReport, validPayments } = useMemo(() => {
    let total = 0;
    let monthly = {};
    
    // Filter out payments with invalid dates
    const validPayments = derivedPayments.filter(p => isValidDate(p.date));

    validPayments.forEach((p) => {
      const amount = Number(p.amountPaid) || 0;
      total += amount;
      
      if (isValidDate(p.date)) {
        const month = new Date(p.date).toLocaleString("default", { 
          month: "short", 
          year: "numeric" 
        });
        monthly[month] = (monthly[month] || 0) + amount;
      }
    });

    console.log("📊 Payments Analysis:", {
      totalPayments: derivedPayments.length,
      validPayments: validPayments.length,
      invalidPayments: derivedPayments.length - validPayments.length,
      monthlyReport: monthly
    });

    return {
      totalRevenue: total,
      totalPayments: validPayments.length,
      monthlyReport: monthly,
      validPayments: validPayments
    };
  }, [derivedPayments]);

  // Debug: Log first few payments to see what's happening
  React.useEffect(() => {
    if (derivedPayments.length > 0) {
      console.log("🔍 Sample Payment Data (first 3):", derivedPayments.slice(0, 3).map(p => ({
        student: p.studentName,
        rawDate: p.date,
        formatted: formatDateSafe(p.date),
        isValid: isValidDate(p.date)
      })));
    }
  }, [derivedPayments]);

  return (
    <div className="payments-section">
      <h3>💰 Track Payments</h3>

      {/* Debug Info */}
      <div className="debug-info" style={{ 
        padding: '10px', 
        background: '#f0f8ff', 
        borderRadius: '5px', 
        marginBottom: '15px',
        fontSize: '12px',
        border: '1px solid #d1e9ff'
      }}>
        <strong>Data Status:</strong> {validPayments.length} valid payments out of {derivedPayments.length} total
        {derivedPayments.length - validPayments.length > 0 && (
          <span style={{color: '#dc2626', marginLeft: '10px'}}>
            ({derivedPayments.length - validPayments.length} with invalid dates)
          </span>
        )}
      </div>

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
        <div className="summary-card">
          <h4>Average Payment</h4>
          <p>₹{totalPayments > 0 ? Math.round(totalRevenue / totalPayments).toLocaleString() : 0}</p>
        </div>
      </div>

      {/* Monthly Breakdown */}
      <div className="monthly-report">
        <h4>📊 Monthly Revenue Report</h4>
        {Object.keys(monthlyReport).length === 0 ? (
          <p>No data available yet.</p>
        ) : (
          <div className="monthly-grid">
            {Object.entries(monthlyReport)
              .sort(([monthA], [monthB]) => {
                // Sort months chronologically
                const dateA = new Date(monthA);
                const dateB = new Date(monthB);
                return dateB - dateA;
              })
              .map(([month, amount], index) => (
                <div key={index} className="monthly-item">
                  <span className="month">{month}</span>
                  <span className="amount">₹{amount.toLocaleString()}</span>
                </div>
              ))}
          </div>
        )}
      </div>

      {/* Payments Table */}
      {validPayments.length === 0 ? (
        <div className="no-payments">
          <p>No valid payments recorded yet.</p>
          {derivedPayments.length > 0 && (
            <p style={{color: '#dc2626', fontSize: '14px'}}>
              Note: There are {derivedPayments.length} payment records, but all have invalid dates.
            </p>
          )}
        </div>
      ) : (
        <div className="table-container">
          <table className="payments-table">
            <thead>
              <tr>
                <th>Student</th>
                <th>Course</th>
                <th>Amount Paid</th>
                <th>Date</th>
              </tr>
            </thead>
            <tbody>
              {validPayments.map((p, i) => (
                <tr key={i}>
                  <td>{p.studentName}</td>
                  <td>{p.courseTitle}</td>
                  <td>₹{p.amountPaid}</td>
                  <td>{formatDateSafe(p.date)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}