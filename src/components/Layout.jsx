import React from "react";

const Layout = ({ children }) => {
  return (
    <div style={styles.page}>
      <div style={styles.container}>
        {children}
      </div>
    </div>
  );
};

const styles = {

  page: {
    minHeight: "100vh",
    background: "linear-gradient(135deg,#e8f0ff,#f5f9ff)",
    display: "flex",
    justifyContent: "center",
    padding: "30px"
  },

  container: {
    width: "100%",
    maxWidth: "1300px"
  }

};

export default Layout;