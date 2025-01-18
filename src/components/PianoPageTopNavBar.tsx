import { useState } from "react";
import { NavLink } from "react-router-dom";

import "../css/VolumeSlider.css";

import { FaRegFolderOpen, FaPlay, FaPause, FaStop } from "react-icons/fa";
import { MdAudiotrack, MdOutlineExitToApp } from "react-icons/md";
import { CiVolume, CiVolumeHigh } from "react-icons/ci";
import { IoIosSettings } from "react-icons/io";



const CollapsibleNavBar = (props:any) => {
  const {playCallback, pausingCallback, stopCallback} = props;

  const [isCollapsed, setIsCollapsed] = useState(false);
  const [hoveredButton, setHoveredButton] = useState<number>(-1);
  const [volume, setVolume] = useState<number>(100);

  const handleMouseEnter = (index: number) => {
    setHoveredButton(index);
  };

  const handleMouseLeave = () => {
    setHoveredButton(-1);
  }

  const handleVolumeButtonOnClick = () => {
    setVolume((prev) => prev === 0 ? 100 : 0);
  }

  const toggleNavBar = () => {
    setIsCollapsed((prev) => !prev);
  };


  return (
    <div style={{
      position: "relative",
      width: "100%",
      height: "150px",
    }}>

      <div className="topnavbar-warrper" style={{ ...styles.navbar, height: isCollapsed ? "0px" : "130px" }}>
        <div className="container" style={styles.container}>
          <div className="topContainer-1" style={styles.topContainer}>
            <div className="btn-group-1" style={styles.btnGroup}>
              <button style={buttonStyles.TopNavBarBtn(hoveredButton, 1)} onMouseEnter={() => handleMouseEnter(1)} onMouseLeave={handleMouseLeave}>
                <div className="glyph">
                  <FaRegFolderOpen size={25} />
                </div>
                <span className="text" style={styles.text}>
                  Open
                </span>
              </button>
              <button style={buttonStyles.TopNavBarBtn(hoveredButton, 2)} onMouseEnter={() => handleMouseEnter(2)} onMouseLeave={handleMouseLeave}>
                <div className="glyph">
                  <MdAudiotrack size={25} />
                </div>
                <span className="text" style={styles.text}>
                  Songs
                </span>
              </button>
            </div>
          </div>

          <div className="topContainer-2" style={styles.topContainer}>
            <div className="btn-group-2" style={{ ...styles.btnGroup, flexDirection: "row" }}>
              <button style={buttonStyles.TopNavBarBtn(hoveredButton, 3)} onMouseEnter={() => handleMouseEnter(3)} onMouseLeave={handleMouseLeave} onClick={() => { playCallback() }}>
                <div className="glyph">
                  <FaPlay size={40} color="white" />
                </div>
              </button>
              <button style={buttonStyles.TopNavBarBtn(hoveredButton, 4)} onMouseEnter={() => handleMouseEnter(4)} onMouseLeave={handleMouseLeave} onClick={() => { pausingCallback() }}>
                <div className="glyph">
                  <FaPause size={40} color="white" />
                </div>
              </button>
              <button style={buttonStyles.TopNavBarBtn(hoveredButton, 5)} onMouseEnter={() => handleMouseEnter(5)} onMouseLeave={handleMouseLeave} onClick={() => { stopCallback() }}>
                <div className="glyph">
                  <FaStop size={40} color="white" />
                </div>
              </button>
            </div>
          </div>

          <div className="topContainer-3" style={styles.topContainer}>
            <div className="btn-group-3" style={{ ...styles.btnGroup, flexDirection: "row", gap: '50px' }}>
              <div className="left-group" style={styles.innerGroup}>
                <div className="volume-container" style={{ ...styles.volumeContainer, width: "150px" }}>
                  <label style={styles.volumeLabel}>
                    <span style={{ color: "white" }}>
                      Volume
                    </span>
                    <button className="volume-btn" style={buttonStyles.TopNavBarBtn(hoveredButton, 6)} onMouseEnter={() => handleMouseEnter(6)} onMouseLeave={handleMouseLeave}>
                      {volume === 0 ? (
                        <CiVolume size={25} color="white" onClick={handleVolumeButtonOnClick} />
                      ) : (
                        <CiVolumeHigh size={25} color="white" onClick={handleVolumeButtonOnClick} />
                      )}
                    </button>
                  </label>
                  <input type="range" className="volume-slider" min={0} max={100} step={1} defaultValue={100} value={volume} style={styles.volumeSlider} onChange={(e) => { setVolume(parseInt(e.target.value)) }} />
                </div>
              </div>
              <div className="right-group" style={{ ...styles.innerGroup }}>
                <div>
                  <NavLink to="/" style={{ color: "white" }}>
                    <button className="left-btn" style={buttonStyles.TopNavBarBtn(hoveredButton, 7)} onMouseEnter={() => handleMouseEnter(7)} onMouseLeave={handleMouseLeave}>
                      <div className="glyph">
                        <MdOutlineExitToApp size={25} />
                      </div>

                    </button>
                  </NavLink>
                  <button className="settings-btn" style={buttonStyles.TopNavBarBtn(hoveredButton, 8)} onMouseEnter={() => handleMouseEnter(8)} onMouseLeave={handleMouseLeave}>
                    <div className="glyph">
                      <IoIosSettings size={25} />
                    </div>
                  </button>
                </div>
              </div>
            </div>
          </div>
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

interface StyleFunctions {
  [key: string]: ((isCollapsed: boolean) => CSSProperties);
}

const styles: Styles = {
  navbar: {
    position: "relative",
    width: "100%",
    backgroundColor: "#5f5f5f",
    transition: "height 0.3s ease",
    overflow: "hidden",
  },
  container: {
    display: "grid",
    gridTemplateColumns: "1fr 3fr 1fr",
    width: "100%",
    height: "100%",
  },
  topContainer: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    height: "100%",
  },
  btnGroup: {
    display: "flex",
    flexDirection: "column",
    justifyContent: "space-around",
  },
  innerGroup: {
    display: "flex",
    justifyContent: "space-between",
  },
  volumeLabel: {
    display: 'flex',
    width: "100%",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: "10px",
  },
  text: {
    marginLeft: "5px",
  }
  ,
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

const buttonStyles: { [key: string]: (hoveredButton: number, hoverIndex: number) => CSSProperties } = {

  TopNavBarBtn: (hoveredButton: number, hoverIndex: number) => ({
    display: "flex",
    margin: "5px",
    backgroundColor: hoveredButton === hoverIndex ? "#4e4e4e" : "#6e6e6e",
    color: "white",
    border: "none",
    borderRadius: "5px",
    cursor: "pointer",
    boxShadow: "0px 4px 6px rgba(0, 0, 0, 0.2)",

  }),
}

export default CollapsibleNavBar;