import React from "react";
import "./LandingPage.css";
import image from './Assets/image.png';

function LandingPage() {
  return (
    <div className="app-container">
      <main className="main-section">
        <div className="content">
          <h2>
            Track your <br />
            Expenses to <br />
            Save Money
          </h2>

          <div className="description">
            <p>Helps you to organize your income and expenses</p>
          </div>

          <div className="expense-card">
            <div className="header-row">
              <div>
                <p className="date">LAST MONTH</p>
                <p className="amount">28</p>
                <p>Monday June 2021</p>
              </div>
              <div>
                <p className="this-month">THIS MONTH</p>
                <p className="amount">+15,200</p>
              </div>
            </div>

            <ul className="expenses">
              <li>
                <span className="left-text">🚗 Transportation</span>
                <span className="right-amount">50,000</span>
              </li>
              <li>
                <span className="left-text">🍔 Food & Beverage</span>
                <span className="right-amount">35,000</span>
              </li>
              <li>
                <span className="left-text">🛒 Groceries</span>
                <span className="right-amount">5,000</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="illustration">
          <img
            className="image"
            src={image}
            alt="Simple money tracker illustration"
          />
          <h3 className="tracker-title">Simple money tracker</h3>
          <p className="tracker-description">
            It takes seconds to record daily transactions.<br/> 
            Put them into clear and visualized categories<br/>
            such as Expense: Food, Shopping, or Income:<br/>
            Salary, Gift.
          </p>
        </div>
      </main>
    </div>
  );
}

export default LandingPage;
