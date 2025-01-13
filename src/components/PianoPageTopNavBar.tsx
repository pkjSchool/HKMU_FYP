import { useState } from "react";

const CollapsibleNavBar = () => {
  const [isCollapsed, setIsCollapsed] = useState(false);

  const toggleNavBar = () => {
    setIsCollapsed((prev) => !prev);
  };

  return (
    <div style={{
      position: "relative",
      width: "100%",
      height: "150px",
    }}>
      <div style={{ ...styles.navbar, height: isCollapsed ? "0px" : "130px" }}>
        <div style={styleFunctions.navContent(isCollapsed)}>
          <h1 style={(styles as (Styles)).logo}>Logo</h1>
          {!isCollapsed && (
            <ul style={styles.menu}>
              <li style={styles.menuItem}><a href={'/'}>Home</a></li>
              <li style={styles.menuItem}>About</li>
              <li style={styles.menuItem}>Contact</li>
            </ul>
          )}
        </div>
      </div>
      <button style={styleFunctions.floatingButton(isCollapsed)} onClick={toggleNavBar}>
        {isCollapsed ? "Expand" : "Collapse"}
      </button>
    </div>

  );
};

import { CSSProperties } from "react";
interface Styles {
  [key: string]: CSSProperties;
}

interface StyleFunctions{
  [key: string]: ((isCollapsed: boolean) => CSSProperties);
}

const styles: Styles = {
  navbar: {
    position: "relative",
    width: "100%",
    backgroundColor: "#4CAF50",
    transition: "height 0.3s ease", // Smooth transition when collapsing/expanding
    overflow: "hidden",
  },
  logo: {
    color: "white",
    fontSize: "24px",
  },
  menu: {
    listStyle: "none",
    display: "flex",
    margin: 0,
    padding: 0,
  },
  menuItem: {
    color: "white",
    marginLeft: "20px",
    cursor: "pointer",
  },

};

const styleFunctions: StyleFunctions = {
  navContent: (isCollapsed: boolean) => ({
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    padding: isCollapsed ? "0 20px" : "10px 20px",
    transition: "padding 0.3s ease",
  }),
  floatingButton: (isCollapsed: boolean) => ({
    position: "absolute",
    top: isCollapsed ? "10px" : "130px",
    left: "50%",
    transform: "translateX(-50%)",
    transition: "top 0.3s ease",
    padding: "10px 20px",
    backgroundColor: "#FF5733",
    color: "white",
    border: "none",
    borderRadius: "5px",
    cursor: "pointer",
    boxShadow: "0px 4px 6px rgba(0, 0, 0, 0.2)",
  }),
};

export default CollapsibleNavBar;
