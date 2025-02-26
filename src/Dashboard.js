import React, { useState, useEffect } from "react";
import { Bar, Pie } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
} from "chart.js";
import Switch from "react-switch";
import { useNavigate } from "react-router-dom";

// Import your icons
import logoIcon from "./Assets/Logo.png";
import homeIcon from "./Assets/Home.png";
import transactionIcon from "./Assets/transaction.png";
import settingsIcon from "./Assets/Setting.png";
import moonIcon from "./Assets/moon.png";
import logoutIcon from "./Assets/Logout.png";

import styles from "./Dashboard.module.css";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
);

export default function Dashboard({ handleLogout }) {
  const [transactions, setTransactions] = useState([]);
  const [activeSection, setActiveSection] = useState("dashboard");
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [userId, setUserId] = useState(null);
  const navigate = useNavigate();

  // Filter state
  const [filters, setFilters] = useState({
    minAmount: '',
    maxAmount: '',
    startDate: '',
    endDate: ''
  });
  const [showFilters, setShowFilters] = useState(false);

  const [formData, setFormData] = useState({
    date: "",
    type: "income",
    category: "",
    amount: "",
    description: "",
  });

  // Fetch user ID and transactions on initial load


  // Fetch transactions from the backend
  const fetchTransactions = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('/api/transactions', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
  
      if (!response.ok) {
        throw new Error('Failed to fetch transactions');
      }
  
      const contentType = response.headers.get("content-type");
      if (contentType && contentType.includes("application/json")) {
        const data = await response.json();
        // Ensure amount is a number
        const transactionsWithNumbers = data.map(t => ({
          ...t,
          amount: parseFloat(t.amount),
        }));
        setTransactions(transactionsWithNumbers);
      } else {
        const text = await response.text();
        console.error("Expected JSON but received:", text);
        throw new Error("Server did not return JSON");
      }
    } catch (error) {
      console.error('Error fetching transactions:', error);
      alert('Failed to fetch transactions. Please try again.');
    }
  };

  // Handle form input changes
  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  // Handle form submission (add new transaction)
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('http://localhost:5000/api/transactions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          amount: parseFloat(formData.amount), // Ensure amount is a number
        }),
      });
  
      if (!response.ok) {
        let errorData;
        try {
          errorData = await response.json();
        } catch (jsonError) {
          errorData = { error: 'Failed to add transaction' };
        }
        throw new Error(errorData.error || 'Failed to add transaction');
      }
  
      const contentType = response.headers.get("content-type");
      if (contentType && contentType.includes("application/json")) {
        const newTransaction = await response.json();
        // Ensure new transaction's amount is a number
        setTransactions([...transactions, {
          ...newTransaction,
          amount: parseFloat(newTransaction.amount),
        }]);
        setFormData({
          date: "",
          type: "income",
          category: "",
          amount: "",
          description: "",
        });
      } else {
        const text = await response.text();
        console.error("Expected JSON but received:", text);
        throw new Error("Server did not return JSON on add transaction");
      }
    } catch (error) {
      console.error('Error adding transaction:', error);
      alert(error.message);
    }
  };
  // Handle transaction deletion
  const handleDelete = async (id) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`/api/transactions/${id}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Failed to delete transaction');
      }

      setTransactions(transactions.filter((t) => t.id !== id));
    } catch (error) {
      console.error('Error deleting transaction:', error);
      alert('Failed to delete transaction. Please try again.');
    }
  };

  // Filter handlers
  const handleFilterChange = (e) => {
    setFilters({ ...filters, [e.target.id]: e.target.value });
  };

  const applyFilters = () => {
    setShowFilters(false);
  };

  const clearFilters = () => {
    setFilters({
      minAmount: '',
      maxAmount: '',
      startDate: '',
      endDate: ''
    });
  };

  // Filtered transactions
  const filteredTransactions = transactions.filter(t => {
    const transactionDate = new Date(t.date);
    const startDateFilter = filters.startDate ? new Date(filters.startDate) : null;
    const endDateFilter = filters.endDate ? new Date(filters.endDate) : null;
    const minAmount = parseFloat(filters.minAmount) || 0;
    const maxAmount = parseFloat(filters.maxAmount) || Infinity;

    return (
      (!startDateFilter || transactionDate >= startDateFilter) &&
      (!endDateFilter || transactionDate <= endDateFilter) &&
      t.amount >= minAmount &&
      t.amount <= maxAmount
    );
  });

  // Toggle dark mode
  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode);
  };

  // Chart Data
  const chartData = {
    labels: ["Income", "Expense", "Investment", "Saving"],
    datasets: [
      {
        label: "Total Amount",
        data: ["income", "expense", "investment", "saving"].map((type) =>
          transactions
            .filter((t) => t.type === type)
            .reduce((sum, t) => sum + t.amount, 0)
        ),
        backgroundColor: ["#4caf50", "#f44336", "#2196f3", "#ffeb3b"],
      },
    ],
  };

  // Breakdown Data
  const incomeBreakdownData = {
    labels: transactions.filter((t) => t.type === "income").map((t) => t.category),
    datasets: [{
      data: transactions.filter((t) => t.type === "income").map((t) => t.amount),
      backgroundColor: ["#4caf50", "#81c784", "#a5d6a7", "#c8e6c9"]
    }]
  };

  const expenseBreakdownData = {
    labels: transactions.filter((t) => t.type === "expense").map((t) => t.category),
    datasets: [{
      data: transactions.filter((t) => t.type === "expense").map((t) => t.amount),
      backgroundColor: ["#f44336", "#e57373", "#ef9a9a", "#ffcdd2"]
    }]
  };

  // Calculate total for a specific type
  const calculateTotal = (type) => {
    const total = transactions
      .filter((t) => t.type === type)
      .reduce((sum, t) => sum + (t.amount || 0), 0); // Ensure amount is a valid number
  
    return Number.isFinite(total) ? total.toFixed(2) : "0.00"; // Handle cases where total is NaN or undefined
  };
  
  return (
    <div className={`${styles.dashboardContainer} ${isDarkMode ? styles.darkMode : ""}`}>
      {/* Sidebar */}
      <nav className={styles.sidebar}>
        <div className={styles.sidebarHeader}>
          <img src={logoIcon} alt="Logo" className={styles.logo} />
          <h1>PennyPLAN</h1>
        </div>

        <div className={styles.sidebarMenu}>
          <button
            className={`${styles.sidebarButton} ${activeSection === "dashboard" ? styles.active : ""}`}
            onClick={() => setActiveSection("dashboard")}
          >
            <img src={homeIcon} alt="Dashboard" className={styles.sidebarIcon} />
            Dashboard
          </button>

          <button
            className={`${styles.sidebarButton} ${activeSection === "transactions" ? styles.active : ""}`}
            onClick={() => setActiveSection("transactions")}
          >
            <img src={transactionIcon} alt="Transactions" className={styles.sidebarIcon} />
            View Transaction
          </button>

          <button
            className={`${styles.sidebarButton} ${activeSection === "settings" ? styles.active : ""}`}
            onClick={() => setActiveSection("settings")}
          >
            <img src={settingsIcon} alt="Settings" className={styles.sidebarIcon} />
            Settings
          </button>
        </div>

        <div className={styles.sidebarFooter}>
          <div className={styles.darkModeToggle}>
            <img src={moonIcon} alt="Moon Icon" className={styles.sidebarIcon} />
            <span>Dark Mode</span>
            <Switch
              checked={isDarkMode}
              onChange={toggleDarkMode}
              offColor="#888"
              onColor="#3e6ff4"
              handleDiameter={20}
              uncheckedIcon={false}
              checkedIcon={false}
              height={22}
              width={40}
              className={styles.switch}
            />
          </div>

          <button className={styles.logoutButton} onClick={handleLogout}>
            <img src={logoutIcon} alt="Logout Icon" className={styles.sidebarIcon} />
            Logout
          </button>
        </div>
      </nav>

      {/* Main Content */}
      <main className={styles.mainContent}>
        {activeSection === "dashboard" && (
          <div className={styles.contentWrapper}>
            <section className={styles.summarySection}>
              <div className={styles.summaryGrid}>
                <div className={`${styles.summaryCard} ${styles.income}`}>
                  <h3>Income</h3>
                  <div className={styles.summaryAmount}>${calculateTotal("income")}</div>
                  <div className={styles.summaryPercentage}>▲87%</div>
                </div>
                <div className={`${styles.summaryCard} ${styles.expense}`}>
                  <h3>Expense</h3>
                  <div className={styles.summaryAmount}>${calculateTotal("expense")}</div>
                  <div className={styles.summaryPercentage}>▼55%</div>
                </div>
                <div className={`${styles.summaryCard} ${styles.investment}`}>
                  <h3>Investment</h3>
                  <div className={styles.summaryAmount}>${calculateTotal("investment")}</div>
                  <div className={styles.summaryPercentage}>▼55%</div>
                </div>
                <div className={`${styles.summaryCard} ${styles.saving}`}>
                  <h3>Saving</h3>
                  <div className={styles.summaryAmount}>${calculateTotal("saving")}</div>
                  <div className={styles.summaryPercentage}>▲59%</div>
                </div>
              </div>
            </section>

            <div className={styles.topSection}>
              <section className={`${styles.formContainer} ${styles.card}`}>
                <h2>Add Transaction</h2>
                <form onSubmit={handleSubmit}>
                  <div className={styles.formRow}>
                    <label htmlFor="date">Date</label>
                    <input
                      id="date"
                      type="date"
                      value={formData.date}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                  <div className={styles.formRow}>
                    <label htmlFor="category">Category</label>
                    <input
                      id="category"
                      type="text"
                      value={formData.category}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                  <div className={styles.formRow}>
                    <label htmlFor="amount">Amount</label>
                    <input
                      id="amount"
                      type="number"
                      step="0.01"
                      value={formData.amount}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                  <div className={styles.formRow}>
                    <label htmlFor="description">Description</label>
                    <input
                      id="description"
                      type="text"
                      value={formData.description}
                      onChange={handleInputChange}
                    />
                  </div>
                  <div className={styles.formRow}>
                    <label htmlFor="type">Type</label>
                    <select
                      id="type"
                      value={formData.type}
                      onChange={handleInputChange}
                    >
                      {["income", "expense", "investment", "saving"].map((t) => (
                        <option key={t} value={t}>
                          {t.charAt(0).toUpperCase() + t.slice(1)}
                        </option>
                      ))}
                    </select>
                  </div>
                  <button type="submit" className={styles.submitButton}>
                    Add Transaction
                  </button>
                </form>
              </section>

              <section className={`${styles.chartContainer} ${styles.card}`}>
                <h2>Overview</h2>
                <Bar data={chartData} />
              </section>
            </div>

            <section className={`${styles.tableContainer} ${styles.card}`}>
              <h2>Transactions</h2>
              <table>
                <thead>
                  <tr>
                    <th>#</th>
                    <th>Date</th>
                    <th>Type</th>
                    <th>Category</th>
                    <th>Amount</th>
                    <th>Description</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredTransactions.map((t, index) => (
                    <tr key={t.id}>
                      <td>{index + 1}</td>
                      <td>{t.date}</td>
                      <td>{t.type}</td>
                      <td>{t.category}</td>
                      <td>${t.amount.toFixed(2)}</td>
                      <td>{t.description || "-"}</td>
                      <td>
                        <button
                          onClick={() => handleDelete(t.id)}
                          className={styles.deleteButton}
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </section>
          </div>
        )}

        {activeSection === "transactions" && (
          <div className={styles.contentWrapper}>
            <div className={styles.topSection}>
              <section className={`${styles.chartContainer} ${styles.card}`}>
                <h2>Income Breakdown</h2>
                <Pie data={incomeBreakdownData} />
              </section>
              <section className={`${styles.chartContainer} ${styles.card}`}>
                <h2>Expense Breakdown</h2>
                <Pie data={expenseBreakdownData} />
              </section>
            </div>

            <section className={`${styles.tableContainer} ${styles.card}`}>
              <div className={styles.tableHeader}>
                <h2>Transaction History</h2>
                <div className={styles.tableControls}>
                  <div className={styles.filterContainer}>
                    <button 
                      className={styles.filterButton}
                      onClick={() => setShowFilters(!showFilters)}
                    >
                      Filter
                    </button>
                    
                    {showFilters && (
                      <div className={styles.filterDropdown}>
                        <div className={styles.filterGroup}>
                          <label>Date Range:</label>
                          <input
                            type="date"
                            id="startDate"
                            value={filters.startDate}
                            onChange={handleFilterChange}
                          />
                          <span>to</span>
                          <input
                            type="date"
                            id="endDate"
                            value={filters.endDate}
                            onChange={handleFilterChange}
                          />
                        </div>
                        
                        <div className={styles.filterGroup}>
                          <label>Amount Range:</label>
                          <input
                            type="number"
                            id="minAmount"
                            placeholder="Min"
                            value={filters.minAmount}
                            onChange={handleFilterChange}
                          />
                          <span>to</span>
                          <input
                            type="number"
                            id="maxAmount"
                            placeholder="Max"
                            value={filters.maxAmount}
                            onChange={handleFilterChange}
                          />
                        </div>
                        
                        <div className={styles.filterActions}>
                          <button 
                            className={styles.applyButton}
                            onClick={applyFilters}
                          >
                            Apply
                          </button>
                          <button 
                            className={styles.clearButton}
                            onClick={clearFilters}
                          >
                            Clear
                          </button>
                        </div>
                      </div>
                    )}
                    
                    <button 
                      className={styles.addButton}
                      onClick={() => setActiveSection("dashboard")}
                    >
                      + Add Transaction
                    </button>
                  </div>
                </div>
              </div>
              <table className={styles.transactionTable}>
                <thead>
                  <tr>
                    <th>Index</th>
                    <th>Type</th>
                    <th>Category</th>
                    <th>Amount</th>
                    <th>Date</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredTransactions.map((t, index) => (
                    <tr key={t.id}>
                      <td>{index + 1}</td>
                      <td>
                        <span className={`${styles.typePill} ${styles[t.type]}`}>
                          {t.type.charAt(0).toUpperCase() + t.type.slice(1)}
                        </span>
                      </td>
                      <td>{t.category}</td>
                      <td>${t.amount.toFixed(2)}</td>
                      <td>{new Date(t.date).toLocaleDateString('en-US')}</td>
                      <td>
                        <button
                          onClick={() => handleDelete(t.id)}
                          className={styles.deleteButton}
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </section>
          </div>
        )}

        {activeSection === "settings" && (
          <div className={styles.blankSection}>
            <h2>Settings</h2>
            <p>This page is intentionally left blank.</p>
          </div>
        )}
      </main>
    </div>
  );
}
