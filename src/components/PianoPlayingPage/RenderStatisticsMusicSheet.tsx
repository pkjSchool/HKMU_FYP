import { forwardRef, useImperativeHandle, useEffect, useRef, useState } from "react";
import { api_get_user_music_record } from "../../api_request/request.tsx";
import {
  OpenSheetMusicDisplay,
} from "opensheetmusicdisplay";
import { formatTime } from "../../util/utils.js";
import { FaAnglesUp, FaAnglesDown } from "react-icons/fa6";

import RenderResultMusicSheet, { HistorySummary } from "./RenderResultMusicSheet.js";

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

    const sheetHistory = useRef<any[]>([]);
    const sheetResult = useRef<any[]>([]);

    const formatedHistory = useRef<any[]>([]);
    const noteStatistics = useRef<any[]>([]);

    const formatedScore = useRef<any[]>([]);
    const formatedNoteEntered = useRef<any[]>([]);
    const formatedTotalNote = useRef<any[]>([]);
    const formatedMusicTime = useRef<any[]>([]);

    const historySummary = useRef<HistorySummary|null>(null);

    const [musicSheet, setMusicSheet] = useState<string| null>(null);
    const [noteEventList, setNoteEventList] = useState<any[]>([]);

    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [isShowResultDetail, setIsShowResultDetail] = useState(false);
    const [isShowHistoryButton, setIsShowHistoryButton] = useState(false);

    const setFormatedScore = (_formatedScore:any[]) => {
        formatedScore.current = _formatedScore
    }

    const getFormatedScore = () => {
        return formatedScore.current
    }

    const getAverageScore = () => {
        let _t = getFormatedScore().length
        let _count = 0
        if(_t == 0){
            return 0
        } else {
            for(let x of getFormatedScore()){
                _count += x
            }

            return (_count / _t).toFixed(2)
        }
    }

    const getMaxScore = () => {
        let _t = getFormatedScore().length
        let _count = 0
        if(_t == 0){
            return 0
        } else {
            return Math.max(...getFormatedScore())
        }
    }

    const getMinScore = () => {
        let _t = getFormatedScore().length
        let _count = 0
        if(_t == 0){
            return 0
        } else {
            return Math.min(...getFormatedScore())
        }
    }

    const setFormatedNoteEntered = (_formatedNoteEntered:any[]) => {
        formatedNoteEntered.current = _formatedNoteEntered
    }

    const getFormatedNoteEntered = () => {
        return formatedNoteEntered.current
    }

    const getAverageNoteEntered = () => {
        let _t = getFormatedNoteEntered().length
        let _count = 0
        if(_t == 0){
            return 0
        } else {
            for(let x of getFormatedNoteEntered()){
                _count += x
            }

            return (_count / _t).toFixed(2)
        }
    }

    const getMaxNoteEntered = () => {
        let _t = getFormatedNoteEntered().length
        let _count = 0
        if(_t == 0){
            return 0
        } else {
            return Math.max(...getFormatedNoteEntered())
        }
    }

    const getMinNoteEntered = () => {
        let _t = getFormatedNoteEntered().length
        let _count = 0
        if(_t == 0){
            return 0
        } else {
            return Math.min(...getFormatedNoteEntered())
        }
    }

    const setFormatedTotalNote = (_formatedTotalNote:any[]) => {
        formatedTotalNote.current = _formatedTotalNote
    }

    const getFormatedTotalNote = () => {
        if(formatedTotalNote.current.length > 0){
            return formatedTotalNote.current[0]
        } else {
            return null
        }
    }

    const setFormatedMusicTime = (_formatedMusicTime:any[]) => {
        formatedMusicTime.current = _formatedMusicTime
    }

    const getFormatedMusicTime = () => {
        if(formatedMusicTime.current.length > 0){
            return formatTime(formatedMusicTime.current[0])
        } else {
            return null
        }
    }

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

    const countSheetHistory = () => {
        return getSheetHistory().length
    }

    const setSheetResult = (_sheetResult:any[]) => {
        sheetResult.current = _sheetResult
    }

    const getSheetResult = () => {
        return sheetResult.current
    }

    const setHistorySummary = (_historySummary:HistorySummary) => {
        historySummary.current = _historySummary
    }

    const getHistorySummary = () => {
        return historySummary.current
    }

    useEffect(() => {
        if(props.sheetResult) {
            setSheetResult(props.sheetResult)
        }

        setMusicSheet(props.musicXML);

        const handleResize = () => {
            setTimeout(fillNoteEvent, 500)
        };

        window.addEventListener("resize", handleResize);
        return () => {
            window.removeEventListener("resize", handleResize);
        };

    }, []);

    useEffect(() => {
        if (resultOsmdContainerRef.current && musicSheet) {
            getUserHistory()
        }
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

            setIsLoading(false)
            drawResult();
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

    const drawResult = () => {
        // fillNoteColor(getSheetResult())
        if(countSheetHistory() > 0){
            formatUserHistory(getSheetHistory())
            formatNoteStatistics(getFormatedHistory())

            fillNoteEvent();
        }
    }

    const closeThis = () => {
        props.handleCloseResultDetail();
    }

    const getUserHistory = () => {
        setIsLoading(true)
        api_get_user_music_record(props.userId, props.userMusicId).then((response) => {
            const result = response.data
            setSheetHistory(result.data);
            rerenderSheet(musicSheet);
        });
    }

    const formatUserHistory = (_history: any) => {
        let _formatedHistory = []
        let _formatedScore = []
        let _formatedNoteEntered = []
        let _formatedTotalNote = []
        let _formatedMusicTime = []

        for (let i=0; i<_history.length; i++) {
            let item = _history[i]
            _formatedHistory.push(JSON.parse(item["noteDetail"]))
            _formatedScore.push(item["score"])
            _formatedNoteEntered.push(item["noteEntered"])
            _formatedTotalNote.push(item["totalNote"])
            _formatedMusicTime.push(item["musicTime"])
        }
        setFormatedHistory(_formatedHistory)
        setFormatedScore(_formatedScore)
        setFormatedNoteEntered(_formatedNoteEntered)
        setFormatedTotalNote(_formatedTotalNote)
        setFormatedMusicTime(_formatedMusicTime)
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

    const getNoteEventButtonClassName = (statistics:any) => {
        const probility = getEnteredProbability(statistics)
        const classList = ["noteEvent-button"]
        if(probility >= 0.75){
            classList.push("green")
        } else if(probility >= 0.5){
            classList.push("yellow")
        } else {
            classList.push("red")
        }
        return classList.join(" ")
    }

    const getEnteredProbability = (statistics:any) => {
        const total = (statistics.yes + statistics.no)
        if(total <= 0) {
            return 0
        } else {
            return statistics.yes / (statistics.yes + statistics.no)
        }
    }
    
    const openSheetResultDetail = (_history:any) => {
        setSheetResult(JSON.parse(_history["noteDetail"]))

        setHistorySummary({
            musicTime: _history["musicTime"],
            score: _history["score"],
            noteEntered: _history["noteEntered"],
            totalNote: _history["totalNote"],
            datetime: _history["datetime"],
        })

        handleOpenResultDetail()
    }

    const handleOpenResultDetail = () => {
        setIsShowResultDetail(true);
      }
    
    const handleCloseResultDetail = () => {
        setIsShowResultDetail(false);
    }

    const toggleShowHistoryButton = () => {
        setIsShowHistoryButton((prev) => !prev);
    }

    let resultDetailComp = null

    if ((isShowResultDetail)) {
        resultDetailComp = (
        <RenderResultMusicSheet musicXML={musicSheet} historySummary={getHistorySummary()} sheetResult={getSheetResult()} handleCloseResultDetail={handleCloseResultDetail} />
        );
    }

    return (
        <>
            <div className="resultSheet-Wrapper">
                <div className="resultSheet-Overlay" onClick={closeThis}></div>
                <div className="resultSheet-Container" ref={containerRef}>
                    <div className="pb-0 text-end">
                        <button type="button" className="btn btn-danger text-center" style={{padding: "10px 18px", margin:"0"}} onClick={closeThis}>X</button>
                    </div>
                    <div>
                    { getSheetHistory().map((history, index)=> (
                        (isShowHistoryButton || index < 6) ? 
                            <button key={index} className="btn btn-primary btn-sm" onClick={() => openSheetResultDetail(history)} style={{margin: 1}}>{ index + 1 } | { history.datetime }</button>
                        :null
                    )) }
                    </div>
                    {countSheetHistory() > 6?<button className="btn btn-secondary btn-sm w-100" onClick={toggleShowHistoryButton}>{isShowHistoryButton?<FaAnglesUp/>:<FaAnglesDown/>}</button>:null}
                    <div>Total History: {countSheetHistory()}</div>
                    <hr/>
                    <div>Total Note: {getFormatedTotalNote()}</div>
                    <div>Music Time: {getFormatedMusicTime()}</div>

                    <div>Score | Average: {getAverageScore()} | Max: {getMaxScore()} | Min: {getMinScore()}</div>
                    <div>Note Entered | Average: {getAverageNoteEntered()} | Max: {getMaxNoteEntered()} | Min: {getMinNoteEntered()}</div>

                    <div style={{position: "relative"}}>
                        <div ref={resultOsmdContainerRef}></div>
                        { noteEventList.map((event, index) => (
                            <div key={index} className="noteEvent-wrapper" style={{ position: 'absolute', left: event.x, top: event.y }}>
                                <div className={getNoteEventButtonClassName(event.statistics)}></div>
                                <div className="noteEvent-popper">
                                    True : {event.statistics.yes}<br/>False : {event.statistics.no}<hr/>Entered : {(getEnteredProbability(event.statistics) * 100).toFixed(2)}%
                                </div>
                            </div>
                        )) }
                    </div>
                </div>
                {(isLoading) ? <div className="loader-wrapper"><div className="loader"></div></div> : null}
            </div>
            {resultDetailComp}
        </>
    );
};

export default forwardRef(RenderStatisticsMusicSheet);
