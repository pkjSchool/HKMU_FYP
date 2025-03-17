import { forwardRef, useImperativeHandle, useEffect, useRef, useState } from "react";
import { api_get_user_music_record } from "../../api_request/request.tsx";
import {
  OpenSheetMusicDisplay,
} from "opensheetmusicdisplay";

export type RenderStatisticsMusicSheetRef = {
  setMusicSheet: (musicSheet: string) => void;
//   setResult: (result: any[]) => void;
};

interface RenderStatisticsMusicSheetProps {
    handleCloseResultDetail: () => void;
    musicXML: string | null;
    sheetResult: any[] | null;
    userId: number;
    userMusicId: number;
}

const RenderStatisticsMusicSheet = (props: RenderStatisticsMusicSheetProps,ref: React.Ref<RenderStatisticsMusicSheetRef>) => {
    useImperativeHandle(ref, () => ({
        setMusicSheet,
    }));
    
    const containerRef = useRef<HTMLDivElement>(null);
    const resultOsmdContainerRef = useRef<HTMLDivElement>(null);
    const resultOsmdRef = useRef<OpenSheetMusicDisplay | null>(null);
    const formatedHistory = useRef<any[]>([]);
    const noteStatistics = useRef<any[]>([]);
    const sheetHistory = useRef<any[]>([]);
    const sheetResult = useRef<any[]>([]);

    const [musicSheet, setMusicSheet] = useState<string| null>(null);
    const [noteEventList, setNoteEventList] = useState<any[]>([]);

    const setFormatedHistory = (_formatedHistory:any[]) => {
        formatedHistory.current = _formatedHistory
    }

    const getFormatedHistory = () => {
        return formatedHistory.current
    }

    const setNoteStatistics = (_noteStatistics:any[]) => {
        noteStatistics.current = _noteStatistics
    }

    const getNoteStatistics = () => {
        return noteStatistics.current
    }

    const setSheetHistory = (_sheetHistory:any[]) => {
        sheetHistory.current = _sheetHistory
    }

    const getSheetHistory = () => {
        return sheetHistory.current
    }

    const setSheetResult = (_sheetResult:any[]) => {
        sheetResult.current = _sheetResult
    }

    const getSheetResult = () => {
        return sheetResult.current
    }

    useEffect(() => {
        setMusicSheet(props.musicXML);
        if(props.sheetResult) {
            setSheetResult(props.sheetResult)
        }

        const handleResize = () => {
            setTimeout(fillNoteEvent, 500)
        };

        window.addEventListener("resize", handleResize);
        return () => {
            window.removeEventListener("resize", handleResize);
        };

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

            getUserHistory()
            // drawResult();

            }).catch((e) => {
            console.error(e);
            });
        }
    }

    const fillNoteColor = (_result: any[]) => {
        if (resultOsmdRef.current && _result) {
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

                                    const _StemColorXml = dataEle.StemColorXml
                                    const _NoteheadColor = dataEle.NoteheadColor

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

    const fillNoteEvent = () => {

        if (resultOsmdRef.current) {
            const _noteEventList:any[] = []
            
            const osmd = resultOsmdRef.current
            const sourceMeasures = osmd.GraphicSheet.MeasureList
            const _noteStatistics = getNoteStatistics()

            for (let i=0; i<sourceMeasures.length; i++) {

                for (let j=0; j<sourceMeasures[i].length; j++) {

                    for (let k=0; k<sourceMeasures[i][j].staffEntries.length; k++) {

                        for (let l=0; l<sourceMeasures[i][j].staffEntries[k].graphicalVoiceEntries.length; l++) {

                            for (let m=0; m<sourceMeasures[i][j].staffEntries[k].graphicalVoiceEntries[l].notes.length; m++) {

                                // i=group -> j=line?? -> k=note -> 0 -> 0 -> 0
                                const bbox = sourceMeasures[i][j].staffEntries[k].graphicalVoiceEntries[l].notes[m].getSVGGElement().getBBox();
                                let _statistics = null

                                try {
                                    // group -> note -> 0 -> 0 -> 0
                                    _statistics = _noteStatistics[i][k][0][0][0]
                                } catch (error) {
                                    _statistics = {
                                        "yes": 0,
                                        "no": 0
                                    }
                                }

                                _noteEventList.push({
                                    x: bbox.x - 10,
                                    y: bbox.y - 10,
                                    statistics: _statistics
                                })
                            }

                        }

                    }

                }

            }

            setNoteEventList(_noteEventList)

            osmd.render();

            // console.log(_noteStatistics)
            // console.log(sourceMeasures)
            // console.log(_noteEventList)
        }
    }

    // const drawResult = () => {
    //     fillNoteColor(getSheetResult())
    // }

    const closeThis = () => {
        props.handleCloseResultDetail();
    }

    const getUserHistory = () => {
        api_get_user_music_record(props.userId, props.userMusicId).then((response) => {
            const result = response.data
            setSheetHistory(result.data);
            formatUserHistory(result.data);
            fillNoteEvent();
        });
    }

    const formatUserHistory = (_history: any) => {
        let _formatedHistory = []
        for (let i=0; i<_history.length; i++) {
            let item = _history[i]
            _formatedHistory.push(JSON.parse(item["noteDetail"]))
        }
        setFormatedHistory(_formatedHistory)
        formatNoteStatistics(getFormatedHistory())
    }

    const formatNoteStatistics = (_formatedHistory: any) => {
        let _noteStatistics:any[] = []

        if (resultOsmdRef.current) {
            let osmd = resultOsmdRef.current
            let sourceMeasures = osmd.Sheet.SourceMeasures
    
            for(const measure_idx in sourceMeasures) {
                _noteStatistics[measure_idx] = []
                for(const vsse_idx in sourceMeasures[measure_idx].VerticalSourceStaffEntryContainers) {
                    _noteStatistics[measure_idx][vsse_idx] = []
                    for(const staEntrie_idx in sourceMeasures[measure_idx].VerticalSourceStaffEntryContainers[vsse_idx].StaffEntries) {
                        _noteStatistics[measure_idx][vsse_idx][staEntrie_idx] = []
                        for(const voiEntrie_idx in sourceMeasures[measure_idx].VerticalSourceStaffEntryContainers[vsse_idx].StaffEntries[staEntrie_idx].VoiceEntries) {
                            _noteStatistics[measure_idx][vsse_idx][staEntrie_idx][voiEntrie_idx] = []
                            for(const note_idx in sourceMeasures[measure_idx].VerticalSourceStaffEntryContainers[vsse_idx].StaffEntries[staEntrie_idx].VoiceEntries[voiEntrie_idx].Notes) {
                                _noteStatistics[measure_idx][vsse_idx][staEntrie_idx][voiEntrie_idx][note_idx] = {
                                    "yes": 0,
                                    "no": 0
                                }

                                for(let _his of _formatedHistory) {

                                    try {
                                        const dataEle = _his[measure_idx][vsse_idx][staEntrie_idx][voiEntrie_idx][note_idx]

    
                                        if(dataEle.entered === true){
                                            _noteStatistics[measure_idx][vsse_idx][staEntrie_idx][voiEntrie_idx][note_idx]["yes"] += 1
                                        } else {
                                            _noteStatistics[measure_idx][vsse_idx][staEntrie_idx][voiEntrie_idx][note_idx]["no"] += 1
                                        }
    
                                    } catch (error) {
                                        console.log(error)
                                    }

                                }
    
                            }
    
                        }
    
                    }
    
                }
    
            }
        }

        setNoteStatistics(_noteStatistics)
    }

    return (
        <div className="resultSheet-Wrapper">
            <div className="resultSheet-Overlay" onClick={closeThis}></div>
            <div className="resultSheet-Container" ref={containerRef}>
                <div className="pb-0 text-end">
                    <button type="button" className="btn btn-danger text-center" style={{padding: "10px 18px", margin:"0"}} onClick={closeThis}>X</button>
                </div>
                <div style={{position: "relative"}}>
                    <div ref={resultOsmdContainerRef}></div>
                    { noteEventList.map((event, index) => (
                        <div key={index} className="noteEventButton" style={{ position: 'absolute', left: event.x, top: event.y }}>
                            {event.statistics.yes}<br/>{event.statistics.no}
                        </div>
                    )) }
                </div>
            </div>
        </div>

    );
};

export default forwardRef(RenderStatisticsMusicSheet);
