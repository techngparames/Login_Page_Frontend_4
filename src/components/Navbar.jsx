import React from "react";

const Navbar = ({ user, onLogout }) => {
  return (
    <div style={styles.navbar}>

      <div style={styles.left}>
        <img src="/logo.png" alt="logo" style={styles.logo} />

        <h3 style={{ margin: 0, color: "#0f4bbf" }}>
         TechNg Nexus
        </h3>
      </div>

      <div style={styles.right}>
        <div style={styles.userBox}>
          👤 {user?.name}
        </div>

        <button style={styles.logout} onClick={onLogout}>
          Logout
        </button>
      </div>

    </div>
  );
};

const styles = {

  navbar: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "18px 28px",
    backdropFilter: "blur(14px)",
    background: "rgba(255,255,255,0.85)",
    borderRadius: "22px",
    boxShadow: "0 8px 30px rgba(0,0,0,0.06)",
    marginBottom: "35px"
  },

  left: {
    display: "flex",
    alignItems: "center",
    gap: "15px"
  },

  right: {
    display: "flex",
    alignItems: "center",
    gap: "20px"
  },

  logo: {
    width: "48px",
    height: "48px",
    objectFit: "contain"
  },

  userBox: {
    padding: "8px 16px",
    background: "#eef3ff",
    borderRadius: "10px",
    color: "#0f4bbf",
    fontWeight: "500"
  },

  logout: {
    padding: "9px 20px",
    background: "#1565c0",
    color: "white",
    border: "none",
    borderRadius: "10px",
    cursor: "pointer"
  }

};

export default Navbar;