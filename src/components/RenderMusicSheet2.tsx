import { forwardRef, useEffect, useRef, useState } from "react";
import { CSSProperties } from "styled-components";
import { OpenSheetMusicDisplay } from "opensheetmusicdisplay";

interface RenderMusicSheetProps {
  musicXML: string | null;
  isFileLoaded: boolean;
  activeNotes: number[];
  isCollapsed: boolean;
}

const RenderMusicSheet = (props: RenderMusicSheetProps) => {
  const osmdContainerRef = useRef<HTMLDivElement>(null);
  const osmdRef = useRef<OpenSheetMusicDisplay | null>(null);

  useEffect(() => {
    console.log("RenderMusicSheet: musicXML");
    if (osmdContainerRef.current && props.musicXML) {
      // Initialize OpenSheetMusicDisplay
      osmdRef.current = new OpenSheetMusicDisplay(osmdContainerRef.current, {
        autoResize: true,
        drawTitle: false,
        drawSubtitle: false,
        drawComposer: false,
        drawLyricist: false,
        drawPartNames: false,
        drawMeasureNumbers: false,
        drawFingerings: false,
        drawCredits: false,
      });

      console.log("RenderMusicSheet: musicXML1");
      // Load the XML and render
      if (props.musicXML) {
        osmdRef.current
          .load(props.musicXML)
          .then(() => {
            console.log("RenderMusicSheet: musicXML2");
            // Set the options to display only one system (row)
            osmdRef.current!.EngravingRules.RenderSingleHorizontalStaffline =
              true;
            osmdRef.current!.render();
          })
          .catch((e) => {
            console.error(e);
          });
      }
    }
  }, [props.musicXML]);

  return (
    <div
      className="sheet-container"
      style={
        true
          ? {
              ...styles.sheetContainer,
              top: props.isCollapsed ? "-40px" : "70px",
            }
          : { visibility: "hidden" }
      }
    >
      <div ref={osmdContainerRef} style={{ width: "100%", height: "200px" }} />
    </div>
  );
};

const styles: { [key: string]: CSSProperties } = {
  sheetContainer: {
    position: "relative",
    top: "64px",
    backgroundColor: "#fff",
    display: "flex",
    height: "450",
    width: "100%",
    marginTop: "5px",
    overflowX: "auto",
    overflowY: "hidden",
    whiteSpace: "nowrap",
    justifyContent: "space-between",
    transition: "top 0.3s ease",
  },
  leftMusicSheetControlButton: {
    display: "flex",
    alignContent: "center",
    justifyContent: "center",
    verticalAlign: "middle",
    width: "30px",
  },
  rightMusicSheetControlButton: {
    display: "flex",
    alignContent: "center",
    justifyContent: "center",
    verticalAlign: "middle",
    width: "30px",
  },
};

export default RenderMusicSheet;
