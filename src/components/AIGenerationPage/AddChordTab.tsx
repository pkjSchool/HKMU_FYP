import { useEffect, useState } from 'react';

import { api_add_chord } from '../../api_request/request';
import RenderMusicSheet2 from '../PianoPlayingPage/RenderMusicSheet2';

import { api_fileMidiToXml } from '../../api_request/request';
import { Link } from 'react-router-dom';

import { useTranslation } from 'react-i18next';

import ChordProgressionInfoDialog from './ChordProgressionInfoDialog';
import progression_info1 from '../../assets/chord_progression/progression_1_2_5_3.png'
import progression_info2 from '../../assets/chord_progression/progression_1_5_4_5.png'
import progression_info3 from '../../assets/chord_progression/progression_3_6_2_5.png'
import progression_info4 from '../../assets/chord_progression/progression_2_5_1.png'
import progression_info5 from '../../assets/chord_progression/progression_1_6_2_5.png'

const FIELD_INFO = {
  key: {
    en: "The musical key determines the root note and scale for the composition (e.g., C Major, G Minor).",
    "zh-HK": "音樂調決定了樂曲的根音和音階（例如，C 大調、G 小調）。"
  },
  mode: {
    en: "Major = happy/bright sound, Minor = sad/melancholic sound. Determines chord quality.",
    "zh-HK": "大調 = 歡快/明亮的聲音，小調 = 悲傷/憂鬱的聲音。決定和弦品質。"
  },
  progression: {
    en: "Chord sequence using scale degree numbers (e.g., 1-4-5 for I-IV-V). Numbers correspond to positions in the chosen scale. Example: In C Major, 1=C, 4=F, 5=G",
    "zh-HK": "使用音階度數數字的和弦序列（例如，I-IV-V 的和弦度數為 1-4-5）。數字對應於所選音階中的位置。例如：在 C 大調中，1=C，4=F，5=G"
  },
  time_sig: {
    en: "Format: beats per measure/note value. Common: 4/4 (four quarter notes), 3/4 (waltz time)",
    "zh-HK": "格式：每小節/音符值的拍子數。常見：4/4（四個四分音符）、3/4（華爾滋拍子）"
  },
  tempo: {
    en: "Speed of the music in beats per minute (BPM). Typical range: 60-200 BPM",
    "zh-HK": "音樂的速度，以每分鐘節拍數 (BPM) 為單位。典型範圍：60-200 BPM"
  }
};

const AddChordTab = () => {
    const { t, i18n } = useTranslation();

    const [uploadFile, setUploadFile] = useState<File | null>(null);
    const [respFile, setRespFile] = useState<File>();
    const [xmlFile, setXmlFile] = useState<string>();
    const [progression, setProgression] = useState('1,2,5,3');
    const [formData, setFormData] = useState({
        file: null,
        key: 'C',
        mode: 'Major',
        progression: progression,
        time_sig: '4,4',
        tempo: '90'
    });
    const [generatedMidi, setGeneratedMidi] = useState<string>("");
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');
    const [showHelp, setShowHelp] = useState<keyof typeof FIELD_INFO | null>(null);
    
    const chordProgressionOptions = ['1,2,5,3', '1,5,4,5', '3,6,2,5', '2,5,1', '1,6,2,5']
    const chordProgressionInfo = [
        progression_info1,
        progression_info2,
        progression_info3,
        progression_info4,
        progression_info5
    ];

    const getInfo = (showHelp:keyof typeof FIELD_INFO) => {
      if(FIELD_INFO[showHelp]){
        return FIELD_INFO[showHelp][i18n.language]
      }
    }

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            setUploadFile(e.target.files[0]);
        }
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = async (e: React.ChangeEvent<HTMLFormElement>) => {
        e.preventDefault();
        setIsLoading(true);
        setError('');

        try {
            const data = new FormData();
            if (uploadFile) data.append('file', uploadFile);
            data.append('key', formData.key);
            data.append('mode', formData.mode);
            data.append('progression', formData.progression);
            data.append('time_sig', formData.time_sig);
            data.append('tempo', formData.tempo);

            api_add_chord(data).then((response) => {
                const blob = new Blob([response.data], { type: 'audio/midi' });
                const midiFile = new File([blob], `${uploadFile?.name}_added_chord.mid`, { type: 'audio/midi' });
                const url = URL.createObjectURL(blob);
                setRespFile(midiFile);
                setGeneratedMidi(url);
            });

        } catch (err) {
            setError('Failed to generate MIDI file. Please try again.');
            console.error(err);
        } finally {
            setIsLoading(false);
        }
    };

    const handleProgressionChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { value } = e.target;
        setProgression(value);
        setFormData(prev => ({
            ...prev,
            progression: value
        }));
    }

    useEffect(() => {
        if (respFile) {
            const formData = new FormData();
            formData.append('midi', respFile);
            api_fileMidiToXml(formData).then((response) => {
                setXmlFile(response.data);
            }).catch((error) => {
                console.error('Error converting MIDI to XML:', error);
            });
        }
    }, [respFile]);

    const HelpButton = ({ field }: { field: keyof typeof FIELD_INFO }) => (
        <button
          type="button"
          className="btn btn-info btn-sm ms-2"
          style={{ boxShadow: 'none' }}
          onClick={() => setShowHelp(field)}
          aria-label="Show help"
        >
          {t("info")}
        </button>
      );

    return (
      <div className="">
        <div className="card shadow">
          <h1 className="card-header">{t("Add Chord Progression")}</h1>
          <div className="card-body p-4">
            
            <form onSubmit={handleSubmit}>
              <div className="row g-3 mb-4">
                {/* MIDI File Upload */}
                <div className="col-12">
                  <label className="form-label">{t("MIDI File (Optional)")}</label>
                  <input 
                    type="file"
                    onChange={handleFileChange}
                    accept=".mid,.midi"
                    className="form-control"
                  />
                </div>
  
                {/* Chord Progression Options */}
                <div className="col-12">
                  <label className="form-label">{t("Default Progression Options")}</label>
                  <div className="d-flex flex-wrap gap-2">
                    {chordProgressionOptions.map((option, index) => (
                      <div key={index} className="form-check form-check-inline">
                        <input
                          type="radio"
                          name="progression"
                          value={option}
                          checked={formData.progression === option}
                          onChange={handleProgressionChange}
                          className="form-check-input"
                          id={`option-${index}`}
                        />
                        <label htmlFor={`option-${index}`} className="form-check-label">{option}</label>
                        <br/>
                        <img
                          src={chordProgressionInfo[index]}
                          alt={`Progression Info ${index + 1}`}
                          style={{
                            borderRadius: '8px',
                            margin: '10px 0',
                            width: "350px"
                          }}
                        />
                        {/* <ChordProgressionInfoDialog
                          progressionIndex={index}
                          chordProgressionInfo={chordProgressionInfo}
                        /> */}
                      </div>
                    ))}
                  </div>
                </div>
  
                {/* Key */}
                <div className="col-md-6">
                  <label className="form-label d-flex align-items-center">
                    {t("key")}
                    {/* <HelpButton field="key" /> */}
                  </label>
                  <select
                    name="key"
                    value={formData.key}
                    onChange={handleInputChange}
                    className="form-select"
                  >
                    {['C', 'D', 'E', 'F', 'G', 'A', 'B'].map(key => (
                      <option key={key} value={key}>{key}</option>
                    ))}
                  </select>
                  <small className="caption">{getInfo("key")}</small>
                </div>
  
                {/* Mode */}
                <div className="col-md-6">
                  <label className="form-label d-flex align-items-center">
                    {t("Mode")}
                    {/* <HelpButton field="mode" /> */}
                  </label>
                  <select
                    name="mode"
                    value={formData.mode}
                    onChange={handleInputChange}
                    className="form-select"
                  >
                    <option value="Major">{t("Major")}</option>
                    <option value="Minor">{t("Minor")}</option>
                  </select>
                  <small className="caption">{getInfo("mode")}</small>
                </div>
  
                {/* Chord Progression */}
                <div className="col-md-6">
                  <label className="form-label d-flex align-items-center">
                    {t("Chord Progression (comma separated)")}
                    {/* <HelpButton field="progression" /> */}
                  </label>
                  <input
                    type="text"
                    name="progression"
                    value={formData.progression}
                    onChange={handleInputChange}
                    className="form-control"
                  />
                  <small className="caption">{getInfo("progression")}</small>
                </div>
  
                {/* Time Signature */}
                <div className="col-md-6">
                  <label className="form-label d-flex align-items-center">
                    {t("Time Signature (comma separated)")}
                    {/* <HelpButton field="time_sig" /> */}
                  </label>
                  <input
                    type="text"
                    name="time_sig"
                    value={formData.time_sig}
                    onChange={handleInputChange}
                    className="form-control"
                  />
                  <small className="caption">{getInfo("time_sig")}</small>
                </div>
  
                {/* Tempo */}
                <div className="col-md-6">
                  <label className="form-label d-flex align-items-center">
                    {t("Tempo (BPM)")}
                    {/* <HelpButton field="tempo" /> */}
                  </label>
                  <input
                    type="number"
                    name="tempo"
                    value={formData.tempo}
                    onChange={handleInputChange}
                    className="form-control"
                  />
                  <small className="caption">{getInfo("tempo")}</small>
                </div>
              </div>
  
              {/* Submit Button */}
              <div className="d-flex justify-content-end">
                <button
                  type="submit"
                  disabled={isLoading}
                  className={`btn btn-primary ${isLoading ? 'disabled' : ''}`}
                >
                  {isLoading ? (
                    <>
                      <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                      {t("Generating...")}
                    </>
                  ) : t('Generate MIDI')}
                </button>
              </div>
            </form>
  
            {/* Help Modal */}
            {showHelp && (
              <div className="modal show d-block" tabIndex={-1} role="dialog" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
                <div className="modal-dialog modal-dialog-centered">
                  <div className="modal-content">
                    <div className="modal-header">
                      <h5 className="modal-title">{t("Help Information")}</h5>
                      <button
                        type="button"
                        className="btn-close"
                        onClick={() => setShowHelp(null)}
                        aria-label="Close"
                      ></button>
                    </div>
                    <div className="modal-body">
                      {getInfo(showHelp)}
                    </div>
                    <div className="modal-footer">
                      <button
                        type="button"
                        className="btn btn-secondary"
                        onClick={() => setShowHelp(null)}
                      >
                        {t("close")}
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}
  
            {/* Error and Results sections remain the same */}
            {error && (
              <div className="alert alert-danger mt-4">
                {error}
              </div>
            )}
  
            {generatedMidi && (
              <div className="mt-4 p-4 bg-light rounded border">
                <h2 className="h5 mb-3">{t("Your Generated MIDI")}</h2>
                <div className="d-flex justify-content-between align-items-center mb-3">
                  <div className="d-flex align-items-center gap-3">
                    <a
                      href={generatedMidi}
                      download="chord_progression.mid"
                      className="btn btn-success"
                    >
                      {t("Download MIDI")}
                    </a>

                  </div>
                  <div>
                    <Link to='/playing' className="btn btn-warning mt-3" state={{respFile: respFile}}>{t("upload_study")}</Link>
                  </div>
                </div>
                <RenderMusicSheet2 musicXML={xmlFile} cssProps={{top: 0}} singleHorizontalStaffline={false}/>
              </div>
            )}
          </div>
        </div>
      </div>
    );
};

export default AddChordTab;