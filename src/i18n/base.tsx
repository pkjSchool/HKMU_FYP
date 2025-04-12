import i18n from "i18next";
import { initReactI18next } from "react-i18next";

i18n
    .use(initReactI18next)
    .init({
    resources: {
        "en": {
            translation: {
                "welcome": "Welcome",
                "score": "Score",
                "average": "Average",
                "max": "Max",
                "min": "Min",
                "true": "True",
                "false": "False",
                "history": "History",
                "detail": "Detail",
                "again": "Again",
                "back": "Back",
                "total_history": "Total History",
                "skip": "Skip",
                "next": "Next",
                "prev": "Previous",
                "complete": "Complete",
                "note": "Note",
                "info": "Info",
                "close": "Close",
                "key": "Key",
                "Mode": "Mode",
                "Major": "Major",
                "Minor": "Minor",
                "exit": "Exit",
                "finish": "Finish",
                "open_dialog": "Open",
                "nextLabelWithProgress": 'Next (Step {step} of {steps})',
                "here": "Here"
            }
        },
        "zh-HK": {
            translation: {
                "welcome": "Welcome",
                "score": "分數",
                "average": "平均值",
                "max": "最大",
                "min": "最少",
                "true": "正確",
                "false": "錯誤",
                "history": "歷史記錄",
                "detail": "詳細資料",
                "again": "再次",
                "back": "返回",
                "skip": "跳過",
                "next": "下一頁",
                "prev": "上一頁",
                "complete": "完成",
                "note": "音符",
                "info": "資訊",
                "close": "關閉",
                "key": "調",
                "Mode": "模式",
                "Major": "主要",
                "Minor": "次要",
                "exit": "退出",
                "finish": "結束",
                "open_dialog": "打開",
                "nextLabelWithProgress": '下一頁 (步驟 {step} 於 {steps})',
                "here": "這裡"
            }
        }
    },
    lng: "en",
    fallbackLng: "en",
    debug: true,

    interpolation: {
        escapeValue: false
    }
    });