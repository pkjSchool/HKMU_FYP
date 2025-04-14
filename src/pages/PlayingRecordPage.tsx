import { useState, useEffect, useRef } from "react";
import { api_user_music_list, api_user_music_get, api_fileMidiToXml } from "../api_request/request";
import { getLoginedUser } from "../access_control/user";
import RenderStatisticsMusicSheet from "../components/PianoPlayingPage/RenderStatisticsMusicSheet.js";

import { HiMiniCalendarDateRange } from "react-icons/hi2";

function PlayingRecordPage() {
    const userInfo = getLoginedUser();
    const [userMusicList, setUserMusicList] = useState<any[]>([]);
    const userMusicId = useRef(0);
    const [musicXML, setMusicXML] = useState<string | null>(null);

    const [isShowResultStatistics, setIsShowResultStatistics] = useState(false);
    const [isGetStortedMusicFromUser, setIsGetStortedMusicFromUser] = useState<boolean>(false);
    const [isMidi2XML, setIsMidi2XML] = useState<boolean>(false);

    useEffect(() => {
        api_user_music_list(parseInt(userInfo.user_id)).then((response) => {
            const result = response.data
            const musicList = result.data;
            setUserMusicList(musicList);
        })
    }, []);

    const getUserMusicId = () => {
        return userMusicId.current
    };
    
    const setUserMusicId = (id: number) => {
        userMusicId.current = id;
    };

    const handleOpenResultDetail = () => {
        setIsShowResultStatistics(true);
    }
    
    const handleCloseResultDetail = () => {
        setIsShowResultStatistics(false);
    }

    const getStortedMusicFromUser = (user_music_id: number) => {
        setIsGetStortedMusicFromUser(true);

        api_user_music_get(user_music_id).then((response) => {
        const result = response.data

        const midiBlob = new Blob([result], { type: "audio/midi" });
        const midiFile = new File([midiBlob], "downloaded.mid", { type: "audio/midi" });
        setUserMusicId(user_music_id);
        fileMidiToXml(midiFile);
        setIsGetStortedMusicFromUser(false);
    });
    };

    const fileMidiToXml = (midi_file: any) => {
        if (midi_file) {
            if (midi_file.type === "audio/midi"  || midi_file.type === "audio/mid") {
                console.log("midi file entered");
                setIsMidi2XML(true);
        
                const formData = new FormData();
                formData.append("midi", midi_file);
                console.log("start to parse midi file");
        
                api_fileMidiToXml(formData).then((res) => {
                    setMusicXML(res.data);
                    setIsMidi2XML(false);
                    handleOpenResultDetail();
                });
            }
        }
    };

    const selectStortedMusic = (user_music_id:number) => {
        getStortedMusicFromUser(user_music_id);
    }

    let resultDetailComp = null;

    if (isShowResultStatistics) {
        resultDetailComp = (
        <RenderStatisticsMusicSheet musicXML={musicXML} handleCloseResultDetail={handleCloseResultDetail} sheetResult={[]} userId={parseInt(userInfo.user_id)} userMusicId={getUserMusicId()} />
        );
    }

    return (
        <>
            <div className="card">
                <div className="card-body">
                    <div className="PianoPageTopNavBarMusicList-ItemList">
                    {userMusicList.map((musicSheet, index) => (
                        <div 
                            key={index} 
                            className="PianoPageTopNavBarMusicList-Item"
                            onClick={() => {selectStortedMusic(musicSheet.user_music_id)}}
                        >
                        <div className="PianoPageTopNavBarMusicList-Item-Title">{ musicSheet.filename }</div>
                        <div className="PianoPageTopNavBarMusicList-Item-Date"><HiMiniCalendarDateRange /> { musicSheet.datetime }</div>
                        </div>
                    ))}
                    </div>
                </div>
            </div>
            {resultDetailComp}
            {(isMidi2XML || isGetStortedMusicFromUser) ? <div className="loader-wrapper"><div className="loader"></div></div> : null}
        </>
    );
}

export default PlayingRecordPage;
