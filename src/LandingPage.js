import React from "react";
import styles from './LandingPage.module.css';
import image from './Assets/image.png';

function LandingPage() {
  return (
    <div className={styles.appContainer}>
      <main className={styles.mainSection}>
        <div className={styles.content}>
          <h2>
            Track your <br />
            Expenses to <br />
            Save Money
          </h2>

          <div className={styles.description}>
            <p>Helps you to organize your income and expenses</p>
          </div>

          <div className={styles.expenseCard}>
            <div className={styles.headerRow}>
              <div>
                <p className={styles.date}>LAST MONTH</p>
                <p className={styles.amount}>28</p>
                <p>Monday June 2021</p>
              </div>
              <div>
                <p className={styles.thisMonth}>THIS MONTH</p>
                <p className={styles.amount}>+15,200</p>
              </div>
            </div>

            <ul className={styles.expenses}>
              <li>
                <span className={styles.leftText}>🚗 Transportation</span>
                <span className={styles.rightAmount}>50,000</span>
              </li>
              <li>
                <span className={styles.leftText}>🍔 Food & Beverage</span>
                <span className={styles.rightAmount}>35,000</span>
              </li>
              <li>
                <span className={styles.leftText}>🛒 Groceries</span>
                <span className={styles.rightAmount}>5,000</span>
              </li>
            </ul>
          </div>
        </div>

        <div className={styles.illustration}>
          
          <img
            className={styles.image}
            src={image}
            alt="Simple money tracker illustration"
          />
          <h3 className={styles.trackerTitle}>Simple money tracker</h3>
          <p className={styles.trackerDescription}>
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