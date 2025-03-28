import { forwardRef, useImperativeHandle, useEffect, useRef, useState } from "react";
import { CSSProperties } from "styled-components";
import "../../css/RenderResultMusicSheet.css";
import { formatTime } from "../../util/utils.js";

import Chart from 'chart.js/auto';

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
  historySummary: HistorySummary | null;
}

export interface HistorySummary {
  musicTime: number | null;
  score: number | null;
  noteEntered: number | null;
  totalNote: number | null;
  datetime: any | null;
}

const RenderResultMusicSheet = (props: RenderResultMusicSheetProps,ref: React.Ref<RenderResultMusicSheetRef>) => {
  useImperativeHandle(ref, () => ({
    setMusicSheet,
  }));
  
  const chartRef_1 = useRef<HTMLCanvasElement>(null);

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

  const isHistorySummaryExist = () => {
    return props.historySummary !== undefined && props.historySummary !== null
  }

  const formatDatetime = () => {
    if(isHistorySummaryExist() && props.historySummary) {
      return props.historySummary.datetime
    } else {
      return null
    }
  }

  const formatMusicTime = () => {
    if(isHistorySummaryExist() && props.historySummary && props.historySummary.musicTime) {
      return formatTime(props.historySummary.musicTime)
    } else {
      return null
    }
  }

  const formatScore = () => {
    if(isHistorySummaryExist() && props.historySummary) {
      return props.historySummary.score
    } else {
      return null
    }
  }

  const formatNoteEntered = () => {
    if(isHistorySummaryExist() && props.historySummary) {
      return props.historySummary.noteEntered
    } else {
      return null
    }
  }

  const formatTotalNote = () => {
    if(isHistorySummaryExist() && props.historySummary) {
      return props.historySummary.totalNote
    } else {
      return null
    }
  }

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

              try {
                const dataEle = _result[measure_idx][vsse_idx][staEntrie_idx][voiEntrie_idx][note_idx]
                const targetEle = sourceMeasures[measure_idx].VerticalSourceStaffEntryContainers[vsse_idx].StaffEntries[staEntrie_idx].VoiceEntries[voiEntrie_idx].Notes[note_idx]

                  let _StemColorXml = "#ff0000"
                  let _NoteheadColor = "#ff0000"

                if(dataEle.entered === true) {
                  _StemColorXml = "#00ff00"
                  _NoteheadColor = "#00ff00"
                }

                targetEle.StemColorXml = _StemColorXml;
                targetEle.NoteheadColor = _NoteheadColor;
              } catch (error) { }

              }

            }

          }

        }

      }

      osmd.render();

    }
  }

  const drawResult = () => {
    fillNoteColor(sheetResult)
    initialChart()
  }

  const closeThis = () => {
    props.handleCloseResultDetail();
  }

  const initialChart = () => {
    if (isHistorySummaryExist() && chartRef_1.current) {
        const data = [];

        data.push({date: "Note Played", value: formatNoteEntered()})
        data.push({date: "Note Missed", value: (formatTotalNote() - formatNoteEntered())})
    
        const chart = Chart.getChart(chartRef_1.current);
        if(chart !== undefined) {
            chart.destroy();
        }
    
        new Chart(
            chartRef_1.current,
            {
            type: 'pie',
            data: {
                labels: data.map(row => row.date),
                datasets: [
                {
                    data: data.map(row => row.value)
                }
                ]
            },
            options: {
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                    display: false
                    },
                    title: {
                        display: true,
                        text: "Note Played",
                        font: {
                            size: 20
                        }
                    }
                    
                }
            },
            }
        );
    }
  }

  let xxx = null
  if(isHistorySummaryExist()){
    xxx = <><h2 className="text-center">{ formatDatetime() }</h2>

    <div className="row">
      <div className="col-6">
        <div style={{"position": "relative", "width": "100%", "maxWidth": "200px", "marginLeft": "auto", "paddingTop": "40px"}}>
          <div>Total Note: {formatTotalNote()}</div>
          <div>Music Time: {formatMusicTime()}</div>
          <div>Score: {formatScore()}</div>
          <div>Note Played: {formatNoteEntered()}</div>
        </div>
      </div>
      <div className="col-6"><div style={{"position": "relative", "width": "100%", "height": "200px", "maxWidth": "200px"}}><canvas ref={chartRef_1}></canvas></div></div>
    </div>
    </>
  }

  return (
    <div className="resultSheet-Wrapper">
        <div className="resultSheet-Overlay" onClick={closeThis}></div>
        <div className="resultSheet-Container" ref={containerRef}>
          <div className="pb-0 text-end">
            <button type="button" className="btn btn-danger text-center" style={{padding: "10px 18px", margin:"0"}} onClick={closeThis}>X</button>
          </div>
          { xxx }
        <div ref={resultOsmdContainerRef} ></div>
        </div>
    </div>

  );
};

export default forwardRef(RenderResultMusicSheet);
