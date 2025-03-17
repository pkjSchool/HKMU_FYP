import { useState, useEffect, forwardRef, useImperativeHandle } from "react";
import { NavLink } from "react-router-dom";

import { FaRegFolderOpen, FaPlay, FaPause, FaStop } from "react-icons/fa";
import { MdAudiotrack, MdOutlineExitToApp } from "react-icons/md";
import { CiVolume, CiVolumeHigh } from "react-icons/ci";
import { IoIosSettings } from "react-icons/io";
import { formatTime } from "../../util/utils";
import { Player, getPlayer } from "../MusicNotePlayer/player/Player.js";
import { api_user_music_list } from "../../api_request/request.tsx";
import { getLoginedUser } from "../../access_control/user";

import "../../css/VolumeSlider.css";

export type CollapsibleNavBarRef = {
  onPlayerTimeUpdated: (time: number, end: number, bpm: number) => void;
  handleUpdatePlayingTimestemp: (time: number) => void;
  setSelectedStortedMusicId: React.Dispatch<React.SetStateAction<number>>;
  updateUserMusicList: () => void;
};

interface CollapsibleNavBarProps {
  playCallback: () => void;
  pausingCallback: () => void;
  stopCallback: () => void;
  getStortedMusicFromUser: (user_music_id: number) => void;
  menuCollapsedCallback: (isCollapsed: boolean) => void;
  progressCallback: (progress: number) => void;
  setMusicFile: React.Dispatch<React.SetStateAction<File | null>>;
  volume: number;
  setVolume: React.Dispatch<React.SetStateAction<number>>;
  isCollapsed: boolean;
  setIsCollapsed: React.Dispatch<React.SetStateAction<boolean>>;
}

const CollapsibleNavBar = (props: CollapsibleNavBarProps,ref: React.Ref<CollapsibleNavBarRef>) => {
  const progressBarReadonly = false;
  const userInfo = getLoginedUser();

  useImperativeHandle(ref, () => ({
    setSelectedStortedMusicId,
    onPlayerTimeUpdated,
    handleUpdatePlayingTimestemp,
    updateUserMusicList,
  }));

  const [selectedStortedMusicId, setSelectedStortedMusicId] = useState<number>(0);
  const [userStortedMusicList, setUserStortedMusicList] = useState<any[]>([]);
  const [isMusicListOpened, setIsMusicListOpened] = useState(false);
  const [isButtonHovered, setIsButtonHovered] = useState(false);
  const [hoveredButton, setHoveredButton] = useState<number>(-1);
  const [valProgress, setValProgress] = useState<number>(0);
  const [valSongEndSecond, setValSongEndSecond] = useState<number>(0);
  const [valSongCurSecond, setValSongCurSecond] = useState<number>(0);
  const [valBpm, setValBpm] = useState<number>(0);
  const [valPrePlay, setValPrePlay] = useState<number>(-2);
  const [playingTimestemp, setPlayingTimestemp] = useState<number>(0);

  const handleMouseEnter = (index: number) => {
    setHoveredButton(index);
  };

  const handleMouseLeave = () => {
    setHoveredButton(-1);
  };

  const handleUpdatePlayingTimestemp = (time: number) => {
    setPlayingTimestemp(time);
  };

  const handleVolumeButtonOnClick = () => {
    // setVolume((prev) => (prev === 0 ? 1 : 0));
  };

  const toggleMusicListOpened = () => {
    setIsMusicListOpened((prev) => !prev);
  };

  const closeMusicListOpened = () => {
    setIsMusicListOpened(false);
  };

  const activeMusicListOpened = () => {
    setIsMusicListOpened(true);
  };

  const toggleNavBar = () => {
    props.setIsCollapsed((prev) => !prev);
    props.menuCollapsedCallback(!props.isCollapsed);
  };

  const handleFileChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ): void => {
    const uploadedFile = event.target.files?.[0] || null;

    if (!uploadedFile) {
      console.log("No file uploaded");
      return;
    }

    props.setMusicFile(uploadedFile);
  };

  const clickPlay = () => {
    props.playCallback();
  };

  const clickPause = () => {
    props.pausingCallback();
  };

  const clickStop = () => {
    props.stopCallback();
  };

  const progressChanged = (progress: number) => {
    clickPause();
    setValProgress(progress);
    props.progressCallback(progress);
    // (progress / 100) * (getPlayer().song.getEnd() / 1000)
  };

  const onPlayerTimeUpdated = (time: number, end: number, bpm: number) => {
    // setValProgress((time / (end / 1000 / 100)));
    setValProgress(time);
    setValSongCurSecond(time);
    setValSongEndSecond(end / 1000);
    setValBpm(bpm);
  };

  const updateUserMusicList = () => {
    setUserStortedMusicList([])
    api_user_music_list(parseInt(userInfo.user_id)).then((response) => {
      const result = response.data
      const musicList = result.data;
      setUserStortedMusicList(musicList);
    });
  }
  
  const selectStortedMusic = (user_music_id: number) => {
    if(selectedStortedMusicId !== user_music_id) {
      props.getStortedMusicFromUser(user_music_id)
      closeMusicListOpened()
    }
  }

  useEffect(() => {
    updateUserMusicList();

    setValPrePlay(getPlayer().startDelay);
    props.menuCollapsedCallback(props.isCollapsed);
  }, []);

  return (
    <>
      <div style={styleFunctions.topNavBarContainer(props.isCollapsed)}>
        <div
          className="topnavbar-warrper"
          style={{ ...styles.navbar, height: "100%" }}
        >
          <div className="container" style={styles.container}>
            <div className="topContainer-1" style={styles.topContainer}>
              <div className="btn-group-1" style={styles.btnGroup}>
                <label
                  style={{
                    ...buttonStyles.TopNavBarBtn(hoveredButton, 1),
                    height: "45.69px",
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                  onMouseEnter={() => handleMouseEnter(1)}
                  onMouseLeave={handleMouseLeave}
                >
                  <div className="glyph">
                    <FaRegFolderOpen size={25} />
                  </div>
                  <input
                    type="file"
                    accept=".midi, .mid, .wav"
                    style={{ display: "none" }}
                    onChange={(e) => handleFileChange(e)}
                  />
                  <span className="text" style={styles.text}>
                    Upload
                  </span>
                </label>
                <button
                  style={buttonStyles.TopNavBarBtn(hoveredButton, 2)}
                  onMouseEnter={() => handleMouseEnter(2)}
                  onMouseLeave={handleMouseLeave}
                  onClick={activeMusicListOpened}
                >
                  <div className="glyph">
                    <MdAudiotrack size={25} />
                  </div>
                  <span className="text" style={styles.text}>
                    Music
                  </span>
                </button>
              </div>
            </div>

            <div className="topContainer-2" style={styles.topContainer}>
              <div
                className="btn-group-2"
                style={{ ...styles.btnGroup, flexDirection: "row" }}
              >
                <button
                  style={buttonStyles.TopNavBarBtn(hoveredButton, 3)}
                  onMouseEnter={() => handleMouseEnter(3)}
                  onMouseLeave={handleMouseLeave}
                  onClick={() => {
                    clickPlay();
                  }}
                >
                  <div className="glyph">
                    <FaPlay size={40} color="white" />
                  </div>
                </button>
                <button
                  style={buttonStyles.TopNavBarBtn(hoveredButton, 4)}
                  onMouseEnter={() => handleMouseEnter(4)}
                  onMouseLeave={handleMouseLeave}
                  onClick={() => {
                    clickPause();
                  }}
                >
                  <div className="glyph">
                    <FaPause size={40} color="white" />
                  </div>
                </button>
                <button
                  style={buttonStyles.TopNavBarBtn(hoveredButton, 5)}
                  onMouseEnter={() => handleMouseEnter(5)}
                  onMouseLeave={handleMouseLeave}
                  onClick={() => {
                    clickStop();
                  }}
                >
                  <div className="glyph">
                    <FaStop size={40} color="white" />
                  </div>
                </button>
              </div>
            </div>

            <div className="topContainer-3" style={styles.topContainer}>
              <div
                className="btn-group-3"
                style={{ ...styles.btnGroup, flexDirection: "row", gap: "50px" }}
              >
                <div className="left-group" style={styles.innerGroup}>
                  <div
                    className="volume-container"
                    style={{ ...styles.volumeContainer, width: "150px" }}
                  >
                    <label style={styles.volumeLabel}>
                      <span style={{ color: "white" }}>Volume</span>
                      <button
                        className="volume-btn"
                        style={buttonStyles.TopNavBarBtn(hoveredButton, 6)}
                        onMouseEnter={() => handleMouseEnter(6)}
                        onMouseLeave={handleMouseLeave}
                        onClick={handleVolumeButtonOnClick}
                      >
                        {props.volume === 0 ? (
                          <CiVolume
                            size={25}
                            color="white"
                            style={{ pointerEvents: "none" }}
                          />
                        ) : (
                          <CiVolumeHigh
                            size={25}
                            color="white"
                            style={{ pointerEvents: "none" }}
                          />
                        )}
                      </button>
                    </label>
                    <input
                      type="range"
                      className="volume-slider"
                      min={0}
                      max={1}
                      step={0.01}
                      value={props.volume}
                      style={styles.volumeSlider}
                      onChange={(e) => {
                        props.setVolume(parseFloat(e.target.value));
                      }}
                    />
                  </div>
                </div>
                <div className="right-group" style={{ ...styles.innerGroup }}>
                  <div>
                    <NavLink to="/" style={{ color: "white" }}>
                      <button
                        className="left-btn"
                        style={buttonStyles.TopNavBarBtn(hoveredButton, 7)}
                        onMouseEnter={() => handleMouseEnter(7)}
                        onMouseLeave={handleMouseLeave}
                      >
                        <div className="glyph">
                          <MdOutlineExitToApp size={25} />
                        </div>
                      </button>
                    </NavLink>
                    <button
                      className="settings-btn"
                      style={buttonStyles.TopNavBarBtn(hoveredButton, 8)}
                      onMouseEnter={() => handleMouseEnter(8)}
                      onMouseLeave={handleMouseLeave}
                    >
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
        <div style={progressBarStyles}>
          <input
            type="range"
            className="musicProgressBar"
            name="valPrograss"
            min={valPrePlay}
            max={valSongEndSecond}
            step="0.01"
            value={valProgress}
            disabled={progressBarReadonly}
            onChange={(e) => {
              progressChanged(parseFloat(e.target.value));
            }}
          />
        </div>
        <div style={statusBarStyles}>
          <div>
            {formatTime(valSongCurSecond)} / {formatTime(valSongEndSecond)} |{" "}
            {valBpm} BPM | {formatTime(playingTimestemp)}
          </div>
        </div>
        <button
          style={{
            ...styleFunctions.floatingButton(props.isCollapsed),
            opacity: isButtonHovered ? 1 : 0.1,
          }}
          onClick={toggleNavBar}
          onMouseEnter={() => setIsButtonHovered(true)}
          onMouseLeave={() => setIsButtonHovered(false)}
        >
          {props.isCollapsed ? "Expand" : "Collapse"}
        </button>
      </div>
      <div className="PianoPageTopNavBarMusicList-Wrapper" style={{ display: isMusicListOpened ? "flex" : "none" }}>
        <div className="PianoPageTopNavBarMusicList-Container">
          <div className="pb-0 text-end">
            <button type="button" className="btn btn-danger text-center" style={{padding: "10px 18px", margin:"0"}} onClick={closeMusicListOpened}>X</button>
          </div>
          {userStortedMusicList.map((musicSheet, index) => (
            <div 
              key={index} 
              className={(selectedStortedMusicId === musicSheet.user_music_id)?"PianoPageTopNavBarMusicList-Item active":"PianoPageTopNavBarMusicList-Item"} 
              onClick={() => {selectStortedMusic(musicSheet.user_music_id)}}
            >
              <div className="PianoPageTopNavBarMusicList-Item-Title">{ musicSheet.filename }</div>
              <div className="PianoPageTopNavBarMusicList-Item-Date">{ musicSheet.datetime }</div>
            </div>
          ))}
          
        </div>
        <div className="PianoPageTopNavBarMusicList-Overlay" onClick={closeMusicListOpened}></div>
      </div>
    </>
  );
};

import { CSSProperties } from "react";
interface Styles {
  [key: string]: CSSProperties;
}

interface StyleFunctions {
  [key: string]: (isCollapsed: boolean) => CSSProperties;
}

const styles: Styles = {
  navbar: {
    position: "relative",
    width: "100%",
    backgroundColor: "#5f5f5f",
    // transition: "height 0.3s ease",
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
    display: "flex",
    width: "100%",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: "10px",
  },
  text: {
    marginLeft: "5px",
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
  topNavBarContainer: (isCollapsed: boolean) => ({
    position: "relative",
    top: isCollapsed ? "-130px" : "0px",
    left: "0px",
    width: "100%",
    height: "130px",
    zIndex: 100,
    transition: "top 0.3s ease",
  }),
  navContent: (isCollapsed: boolean) => ({
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    padding: isCollapsed ? "0 20px" : "10px 20px",
    transition: "padding 0.3s ease",
  }),
  floatingButton: (isCollapsed: boolean) => ({
    position: "absolute",
    top: "210px",
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

const buttonStyles: {
  [key: string]: (hoveredButton: number, hoverIndex: number) => CSSProperties;
} = {
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
};

const progressBarStyles: Object = {
  backgroundColor: "#757575",
  padding: "10px 20px",
};

const statusBarStyles: Object = {
  background: "Black",
  color: "white",
  padding: "0 20px",
};

export default forwardRef(CollapsibleNavBar);
