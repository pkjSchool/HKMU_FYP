import { forwardRef, useImperativeHandle, useEffect, useRef, useState } from "react";
import { CSSProperties } from "styled-components";
import "../../css/RenderResultMusicSheet.css";

import {
  OpenSheetMusicDisplay,
} from "opensheetmusicdisplay";

export type RenderResultMusicSheetRef = {
  setMusicSheet: (musicSheet: string) => void;
//   setResult: (result: any[]) => void;
};

interface RenderResultMusicSheetProps {
    handleCloseResultDetail: () => void;
    musicXML: string | null;
    sheetResult: any[] | null;
}

const RenderResultMusicSheet = (props: RenderResultMusicSheetProps,ref: React.Ref<RenderResultMusicSheetRef>) => {
  useImperativeHandle(ref, () => ({
    setMusicSheet,
  }));
  
  const containerRef = useRef<HTMLDivElement>(null);
  const resultOsmdContainerRef = useRef<HTMLDivElement>(null);
  const resultOsmdRef = useRef<OpenSheetMusicDisplay | null>(null);
  const [musicSheet, setMusicSheet] = useState<string| null>(null);
  const [sheetResult, setSheetResult] = useState<any[]>([]);

useEffect(() => {
    setMusicSheet(props.musicXML);
    if(props.sheetResult) 
      setSheetResult(props.sheetResult)
}, []);

  useEffect(() => {
    rerenderSheet(musicSheet);
  }, [musicSheet]);

  const rerenderSheet = (_musicSheet: any) => {
    if (resultOsmdContainerRef.current && _musicSheet) {
        console.log("ResultMusicSheet: musicXML");
      resultOsmdContainerRef.current.innerHTML = "";

      // Initialize OpenSheetMusicDisplay
      resultOsmdRef.current = new OpenSheetMusicDisplay(resultOsmdContainerRef.current, {
        autoResize: true,
        drawTitle: false,
        drawSubtitle: false,
        drawComposer: false,
        drawLyricist: false,
        drawPartNames: false,
        drawMeasureNumbers: false,
        drawFingerings: false,
        drawCredits: false,
        disableCursor: false,
      });

      let cursorsOptions = [{type: 0, color: "#3d5e94", alpha: 0.5, follow: true}];
      resultOsmdRef.current.setOptions({cursorsOptions: cursorsOptions});

      // Load the XML and render
      resultOsmdRef.current.load(_musicSheet).then(() => {
          // Set the options to display only one system (row)
        //   resultOsmdRef.current!.EngravingRules.RenderSingleHorizontalStaffline = true;
          resultOsmdRef.current!.render();

          drawResult();

        }).catch((e) => {
          console.error(e);
        });
    }
  }

  const fillNoteColor = (_result: any[]) => {
    if (resultOsmdRef.current) {
      let osmd = resultOsmdRef.current
      let sourceMeasures = osmd.Sheet.SourceMeasures

      for(const measure_idx in sourceMeasures) {

        for(const vsse_idx in sourceMeasures[measure_idx].VerticalSourceStaffEntryContainers) {

          for(const staEntrie_idx in sourceMeasures[measure_idx].VerticalSourceStaffEntryContainers[vsse_idx].StaffEntries) {

            for(const voiEntrie_idx in sourceMeasures[measure_idx].VerticalSourceStaffEntryContainers[vsse_idx].StaffEntries[staEntrie_idx].VoiceEntries) {

              for(const note_idx in sourceMeasures[measure_idx].VerticalSourceStaffEntryContainers[vsse_idx].StaffEntries[staEntrie_idx].VoiceEntries[voiEntrie_idx].Notes) {

                const _StemColorXml = _result[measure_idx][vsse_idx][staEntrie_idx][voiEntrie_idx][note_idx].StemColorXml
                const _NoteheadColor = _result[measure_idx][vsse_idx][staEntrie_idx][voiEntrie_idx][note_idx].NoteheadColor
                
                // console.log(sourceMeasures[measure_idx].VerticalSourceStaffEntryContainers[vsse_idx].StaffEntries[staEntrie_idx].VoiceEntries[voiEntrie_idx].Notes[note_idx])

                sourceMeasures[measure_idx].VerticalSourceStaffEntryContainers[vsse_idx].StaffEntries[staEntrie_idx].VoiceEntries[voiEntrie_idx].Notes[note_idx].StemColorXml = _StemColorXml;
                sourceMeasures[measure_idx].VerticalSourceStaffEntryContainers[vsse_idx].StaffEntries[staEntrie_idx].VoiceEntries[voiEntrie_idx].Notes[note_idx].NoteheadColor = _NoteheadColor;
              }

            }

          }

        }

      }

      osmd.render();

    }
  }

  const fillNoteEvent = () => {

    if (resultOsmdRef.current) {
      let osmd = resultOsmdRef.current
      let sourceMeasures = osmd.GraphicSheet.MeasureList

      for (let i=0; i<sourceMeasures.length; i++) {

        // for (let j=0; j<sourceMeasures[i].length; j++) {

        //   for (let k=0; k<sourceMeasures[i][j].staffEntries.length; k++) {

        //     for (let l=0; l<sourceMeasures[i][j].staffEntries[k].graphicalVoiceEntries.length; l++) {

        //       for (let m=0; m<sourceMeasures[i][j].staffEntries[k].graphicalVoiceEntries[l].notes.length; m++) {

        //         sourceMeasures[i][j].staffEntries[k].graphicalVoiceEntries[l].notes[m].getSVGGElement().addEventListener("mouseover", function() {
        //           console.log("asdasd")
        //           noteMark(sourceMeasures[i][j].staffEntries[k].graphicalVoiceEntries[l].notes[m].sourceNote)
        //         });

        //       }

        //     }

        //   }

        // }

        // const xxx = sourceMeasures[4][0].staffEntries[2].graphicalVoiceEntries[0].notes[0];
        // xxx.sourceNote.noteheadColor = "#0000FF"
        // const bbox = sourceMeasures[i][0].staffEntries[0].graphicalVoiceEntries[0].notes[0].getSVGGElement().getBBox();
        // console.log(`pos: (${bbox.x}, ${bbox.y})`);
        // osmd.Drawer.DrawOverlayLine({x: bbox.x / 10, y: bbox.y / 10}, {x: bbox.x / 10 + 2, y: bbox.y / 10}, osmd.GraphicSheet.MusicPages[0])
      }

      osmd.render();
    }
  }

  const drawResult = () => {
    // console.log(sheetResult)
    // console.log(exportResult())
    fillNoteColor(sheetResult)
    fillNoteEvent()
  }

  const closeThis = () => {
    props.handleCloseResultDetail();
  }

  const noteMark = (sourceNote:any) => {
    sourceNote.StemColorXml = "#0000FF";
    sourceNote.NoteheadColor = "#0000FF";
    if (resultOsmdRef.current) {
      resultOsmdRef.current.render();
    }
  }

  return (
    <div className="resultSheet-Wrapper">
        <div className="resultSheet-Overlay" onClick={closeThis}></div>
        <div className="resultSheet-Container" ref={containerRef}>
          <div className="pb-0 text-end">
            <button type="button" className="btn btn-danger text-center" style={{padding: "10px 18px", margin:"0"}} onClick={closeThis}>X</button>
          </div>
        <div ref={resultOsmdContainerRef} ></div>
        </div>
    </div>

  );
};

export default forwardRef(RenderResultMusicSheet);
