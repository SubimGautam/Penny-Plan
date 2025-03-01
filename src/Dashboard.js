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
  const [currency, setCurrency] = useState("USD");
  const navigate = useNavigate();

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

  useEffect(() => {
    const savedCurrency = localStorage.getItem("currency");
    if (savedCurrency) {
      setCurrency(savedCurrency);
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("currency", currency);
  }, [currency]);

  useEffect(() => {
    const checkAuthAndFetch = async () => {
      const token = localStorage.getItem('token');
      console.log('Token on mount:', token);
      if (!token) {
        console.log('No token found, logging out');
        handleLogout();
        navigate('/login');
        return;
      }
      try {
        await fetchTransactions();
      } catch (error) {
        console.error('Initial fetch error:', error);
        handleLogout();
        navigate('/login');
      }
    };
    checkAuthAndFetch();
  }, []);

  const getCurrencySymbol = (currency) => {
    const symbols = {
      USD: '$',
      EUR: '€',
      GBP: '£',
      JPY: '¥',
      INR: '₹',
      AUD: 'A$',
      CAD: 'C$',
      CNY: '¥',
      NPR: 'रू'
    };
    return symbols[currency] || '$';
  };

  const fetchTransactions = async () => {
    try {
      const token = localStorage.getItem('token');
      console.log('Fetching transactions with token:', token);
      if (!token) {
        console.log('No token available for fetch');
        handleLogout();
        navigate('/login');
        return;
      }

      console.log('Making request to http://localhost:5000/api/transactions');
      const response = await fetch('http://localhost:5000/api/transactions', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      console.log('Response status:', response.status);
      if (response.status === 401) {
        console.log('Unauthorized - Logging out');
        handleLogout();
        navigate('/login');
        return;
      }

      if (!response.ok) {
        const errorText = await response.text();
        console.error('Fetch failed with status:', response.status, 'Response:', errorText);
        throw new Error(`Failed to fetch transactions: ${response.status} - ${errorText}`);
      }

      const contentType = response.headers.get("content-type");
      if (contentType && contentType.includes("application/json")) {
        const data = await response.json();
        console.log('Received transactions:', data);
        // Ensure type is a string
        const transactionsWithNumbers = data.map(t => ({
          ...t,
          type: String(t.type || ''), // Convert to string, default to empty if missing
          amount: parseFloat(t.amount || 0),
        }));
        setTransactions(transactionsWithNumbers);
      } else {
        const text = await response.text();
        console.error("Expected JSON but received:", text);
        throw new Error("Server did not return JSON");
      }
    } catch (error) {
      console.error('Error fetching transactions:', error.message);
      if (error.message === 'Failed to fetch') {
        console.log('Network error or server unreachable');
        handleLogout();
        navigate('/login');
      }
      alert('Failed to fetch transactions. Please try again.');
    }
  };

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        handleLogout();
        navigate('/login');
        return;
      }

      const response = await fetch('http://localhost:5000/api/transactions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          ...formData,
          amount: parseFloat(formData.amount),
        }),
      });

      if (response.status === 401) {
        handleLogout();
        navigate('/login');
        return;
      }

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
        console.log('Transaction added:', newTransaction);
        setFormData({
          date: "",
          type: "income",
          category: "",
          amount: "",
          description: "",
        });
        await fetchTransactions();
      } else {
        const text = await response.text();
        console.error("Expected JSON but received on add:", text);
        throw new Error("Server did not return JSON on add transaction");
      }
    } catch (error) {
      console.error('Error adding transaction:', error);
      alert(error.message);
    }
  };

  const handleDelete = async (id) => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        handleLogout();
        navigate('/login');
        return;
      }

      const response = await fetch(`http://localhost:5000/api/transactions/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (response.status === 401) {
        handleLogout();
        navigate('/login');
        return;
      }

      if (!response.ok) {
        throw new Error('Failed to delete transaction');
      }

      await fetchTransactions();
    } catch (error) {
      console.error('Error deleting transaction:', error);
      alert('Failed to delete transaction. Please try again.');
    }
  };

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

  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode);
  };

  const chartData = {
    labels: ["Income", "Expense", "Investment", "Saving"],
    datasets: [
      {
        label: `Total Amount (${currency})`,
        data: ["income", "expense", "investment", "saving"].map((type) =>
          transactions
            .filter((t) => t.type === type)
            .reduce((sum, t) => sum + t.amount, 0)
        ),
        backgroundColor: ["#4caf50", "#f44336", "#2196f3", "#ffeb3b"],
      },
    ],
  };

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

  const calculateTotal = (type) => {
    const total = transactions
      .filter((t) => t.type === type)
      .reduce((sum, t) => sum + (t.amount || 0), 0);
    return Number.isFinite(total) ? total.toFixed(2) : "0.00";
  };

  return (
    <div className={`${styles.dashboardContainer} ${isDarkMode ? styles.darkMode : ""}`}>
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

      <main className={styles.mainContent}>
        {activeSection === "dashboard" && (
          <div className={styles.contentWrapper}>
            <section className={styles.summarySection}>
              <div className={styles.summaryGrid}>
                <div className={`${styles.summaryCard} ${styles.income}`}>
                  <h3>Income</h3>
                  <div className={styles.summaryAmount}>
                    {getCurrencySymbol(currency)}{calculateTotal("income")}
                  </div>
                  <div className={styles.summaryPercentage}>▲87%</div>
                </div>
                <div className={`${styles.summaryCard} ${styles.expense}`}>
                  <h3>Expense</h3>
                  <div className={styles.summaryAmount}>
                    {getCurrencySymbol(currency)}{calculateTotal("expense")}
                  </div>
                  <div className={styles.summaryPercentage}>▼55%</div>
                </div>
                <div className={`${styles.summaryCard} ${styles.investment}`}>
                  <h3>Investment</h3>
                  <div className={styles.summaryAmount}>
                    {getCurrencySymbol(currency)}{calculateTotal("investment")}
                  </div>
                  <div className={styles.summaryPercentage}>▼55%</div>
                </div>
                <div className={`${styles.summaryCard} ${styles.saving}`}>
                  <h3>Saving</h3>
                  <div className={styles.summaryAmount}>
                    {getCurrencySymbol(currency)}{calculateTotal("saving")}
                  </div>
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
                      <td>{getCurrencySymbol(currency)}{t.amount.toFixed(2)}</td>
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
                          {typeof t.type === 'string' && t.type.length > 0 
                            ? t.type.charAt(0).toUpperCase() + t.type.slice(1) 
                            : t.type || 'Unknown'}
                        </span>
                      </td>
                      <td>{t.category}</td>
                      <td>{getCurrencySymbol(currency)}{t.amount.toFixed(2)}</td>
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
          <div className={styles.settingsSection}>
            <h2>Settings</h2>
            <div className={styles.settingItem}>
              <label>Preferred Currency:</label>
              <select 
                value={currency} 
                onChange={(e) => setCurrency(e.target.value)}
                className={styles.currencySelect}
              >
                <option value="USD">US Dollar (USD)</option>
                <option value="EUR">Euro (EUR)</option>
                <option value="GBP">British Pound (GBP)</option>
                <option value="JPY">Japanese Yen (JPY)</option>
                <option value="INR">Indian Rupee (INR)</option>
                <option value="AUD">Australian Dollar (AUD)</option>
                <option value="CAD">Canadian Dollar (CAD)</option>
                <option value="CNY">Chinese Yuan (CNY)</option>
                <option value="NPR">Nepalese Rupee (NPR)</option>
              </select>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}