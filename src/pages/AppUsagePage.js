import React, { useState, useEffect } from "react";

const officeLat = 12.9698;
const officeLng = 80.2446;

const Dashboard = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [loginTime, setLoginTime] = useState("");
  const [logoutTime, setLogoutTime] = useState("");
  const [locationText, setLocationText] = useState("");
  const [date, setDate] = useState("");

  const userName = "Parameswari";

  useEffect(() => {
    const now = new Date();
    setLoginTime(now.toLocaleTimeString());
    setDate(now.toLocaleDateString());

    const logout = new Date(now.getTime() + 8 * 60 * 60 * 1000);
    setLogoutTime(logout.toLocaleTimeString());

    getLocation();
  }, []);

  const getDistance = (lat1, lon1, lat2, lon2) => {
    const R = 6371e3;
    const φ1 = lat1 * Math.PI / 180;
    const φ2 = lat2 * Math.PI / 180;
    const Δφ = (lat2 - lat1) * Math.PI / 180;
    const Δλ = (lon2 - lon1) * Math.PI / 180;

    const a =
      Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
      Math.cos(φ1) *
        Math.cos(φ2) *
        Math.sin(Δλ / 2) *
        Math.sin(Δλ / 2);

    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  };

  const getLocation = () => {
    navigator.geolocation.getCurrentPosition((position) => {
      const userLat = position.coords.latitude;
      const userLng = position.coords.longitude;

      const distance = getDistance(userLat, userLng, officeLat, officeLng);

      if (distance <= 200) {
        setLocationText(
          "TechNG, 23/24 Rajiv Gandhi Salai, Perungudi, Chennai - 600096"
        );
      } else {
        setLocationText("Outside Office Location");
      }
    });
  };

  const handleLogout = () => {
    alert("Logged Out Successfully");
  };

  return (
    <div style={styles.container}>
      
      {/* Sidebar */}
      <div
        style={{
          ...styles.sidebar,
          left: menuOpen ? "0" : "-260px",
        }}
      >
        <h3 style={styles.menuTitle}>Menu</h3>
        <p style={styles.menuItem}>Attendance Overview</p>
        <p style={styles.menuItem}>Application Usage</p>
        <p style={styles.menuItem}>Monthly Report</p>
        <p style={styles.menuItem}>Attendance Sheet</p>
      </div>

      {/* Main Content */}
      <div style={styles.mainContent}>
        
        {/* Top Bar */}
        <div style={styles.topBar}>
          <div
            style={styles.hamburger}
            onClick={() => setMenuOpen(!menuOpen)}
          >
            ☰
          </div>

          <button style={styles.logoutBtn} onClick={handleLogout}>
            Logout
          </button>
        </div>

        {/* Welcome */}
        <h2 style={styles.welcome}>
          Welcome, {userName}
        </h2>

        {/* Attendance Card */}
        <div style={styles.card}>
          <h3 style={styles.cardTitle}>Attendance Overview</h3>

          <div style={styles.row}>
            <InfoBox title="Date" value={date} />
            <InfoBox title="Login Time" value={loginTime} />
            <InfoBox title="Logout Time" value={logoutTime} />
          </div>

          <div style={{ marginTop: "20px" }}>
            <InfoBox title="Location" value={locationText} fullWidth />
          </div>
        </div>
      </div>
    </div>
  );
};

const InfoBox = ({ title, value, fullWidth }) => (
  <div
    style={{
      background: "#eaf4ff",
      padding: "18px",
      borderRadius: "14px",
      minWidth: fullWidth ? "100%" : "220px",
      flex: fullWidth ? 1 : "unset",
    }}
  >
    <p style={{ margin: 0, fontSize: "14px", color: "#4a90e2" }}>
      {title}
    </p>
    <h4 style={{ margin: "6px 0 0", color: "#1e3a8a" }}>
      {value}
    </h4>
  </div>
);

const styles = {
  container: {
    display: "flex",
    minHeight: "100vh",
    background: "#f4f9ff",
    fontFamily: "'Segoe UI', 'Poppins', sans-serif",
  },
  sidebar: {
    position: "fixed",
    top: 0,
    left: 0,
    width: "250px",
    height: "100%",
    background: "#ffffff",
    padding: "25px",
    boxShadow: "4px 0 20px rgba(0,0,0,0.05)",
    transition: "0.3s",
    zIndex: 1000,
  },
  menuTitle: {
    color: "#4a90e2",
    marginBottom: "25px",
  },
  menuItem: {
    padding: "12px 0",
    cursor: "pointer",
    fontWeight: 500,
    color: "#2c5282",
  },
  mainContent: {
    flex: 1,
    padding: "30px",
    marginLeft: "0px",
    width: "100%",
  },
  topBar: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
  },
  hamburger: {
    fontSize: "28px",
    cursor: "pointer",
    color: "#4a90e2",
  },
  logoutBtn: {
    background: "#4a90e2",
    color: "#fff",
    border: "none",
    padding: "10px 18px",
    borderRadius: "8px",
    cursor: "pointer",
  },
  welcome: {
    marginTop: "30px",
    color: "#2c5282",
  },
  card: {
    marginTop: "30px",
    background: "#ffffff",
    padding: "30px",
    borderRadius: "18px",
    boxShadow: "0 8px 25px rgba(0,0,0,0.05)",
  },
  cardTitle: {
    color: "#4a90e2",
  },
  row: {
    display: "flex",
    gap: "20px",
    flexWrap: "wrap",
    marginTop: "20px",
  },
};

export default Dashboard;