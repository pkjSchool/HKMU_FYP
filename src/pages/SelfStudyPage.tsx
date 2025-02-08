import MusicNotePlayerRender from '../components/MusicNotePlayerRender';

function SelfStudyPage() {

  const music = "data:audio/midi;base64,TVRoZAAAAAYAAQACA8BNVHJrAAAACwD/UQMHoSAA/y8ATVRyawAAAIYAwQ0AkUd/g2CRRX8AgUcAg2CBRQAAkUN/g2CRQX8AgUMAg2CBQQAAkUB/g2CRPn8AgUAAg2CBPgAAkTx/g2CRO38AgTwAg2CBOwAAkTl/g2CRN38AgTkAg2CBNwAAkTV/g2CRNH8AgTUAg2CBNAAAkTJ/g2CBMgAAkTB/g2CBMADDQP8vAA=="

  return (
    // <div style={{"width":"100%", "height":"100%"}}>
      <MusicNotePlayerRender music={music}/>
    // </div>
  );
}

export default SelfStudyPage;
