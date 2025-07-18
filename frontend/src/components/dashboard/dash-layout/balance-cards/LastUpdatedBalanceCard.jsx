import { useEffect, useState } from "react";

import { axiosPrivate } from "../../../../api/axios";

function LastUpdatedBalanceCard() {
  const [balance, setBalance] = useState(null);
  const [lastUpdated, setLastUpdated] = useState(null);
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    const fetchBalance = async () => {
      try {
        const response = await axiosPrivate.get("/user/dashboard/balance");
        const { balance, lastUpdated } = response.data;
        setBalance(balance);
        setLastUpdated(
          lastUpdated ? new Date(lastUpdated).toLocaleDateString() : "N/A"
        );
      } catch (error) {
        setErrorMessage("Unable to load balance");
      } finally {
        setLoading(false);
      }
    };

    fetchBalance();
  }, []);
  return (
    <div className="dashboard-card balance-card">
      <h2 className="balance-title">Balance</h2>

      {loading ? (
        <>Loading...</>
      ) : errorMessage ? (
        <p className="text-danger">{errorMessage}</p>
      ) : (
        <>
          <p className="balance-amount">₹ {balance.toLocaleString()}</p>
          <p className="balance-date">Last updated on {lastUpdated}</p>
        </>
      )}
    </div>
  );
}

export default LastUpdatedBalanceCard;
