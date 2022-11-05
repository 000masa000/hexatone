import axios from 'axios';

// Three concepts:
// Coordinates -> Scale degree -> Pitch/midi
export const create_sample_synth = async (fileName, fundamental) => {
  try {
    const sampleFadeout = findFadeout(fileName);
    const audioContext = new AudioContext();
    const s110 = await loadSample(audioContext, fileName, "110");
    const s220 = await loadSample(audioContext, fileName, "220");
    const s440 = await loadSample(audioContext, fileName, "440");
    const s880 = await loadSample(audioContext, fileName, "880");

    // It seems audioContext doesn't cope with simultaneous decodeAudioData calls ):
    // TODO test this statement later
    const samples = [s110, s220, s440, s880];
    return {
      makeHex: (coords, cents) => {
        return new ActiveHex(coords, cents, fundamental, sampleFadeout, samples, audioContext);
      },
    };
  } catch (e) {
    console.error(e);
  }
};

const loadSample = async (audioContext, name, freq) => {
  const file = await axios.get(`sounds/${name}${freq}.mp3`, {responseType: "arraybuffer"});
  const sample = await audioContext.decodeAudioData(file.data);
  return sample;
}

function ActiveHex(coords, cents, fundamental, sampleFadeout, sampleBuffer, audioContext) {
  this.coords = coords;// these end up being used by the keys class
  this.release = false;

  this.cents = cents;
  this.fundamental = fundamental;
  this.sampleFadeout = sampleFadeout;
  this.sampleBuffer = sampleBuffer;
  this.audioContext = audioContext;
}

// Does this need to be a param or is it constant for the hex? i think constant
ActiveHex.prototype.noteOn = function() {
  var freq = this.fundamental * Math.pow(2, this.cents / 1200);
  var source = this.audioContext.createBufferSource(); // creates a sound source
  // Choose sample
  var sampleFreq = 110;
  var sampleNumber = 0;
  if (freq > 155) {
    if (freq > 311) {
      if (freq > 622) {
        sampleFreq = 880;
        sampleNumber = 3;
      } else {
        sampleFreq = 440;
        sampleNumber = 2;
      }
    } else {
      sampleFreq = 220;
      sampleNumber = 1;
    }
  }

  if (!(this.sampleBuffer[sampleNumber])) return; // Sample not yet loaded

  source.buffer = this.sampleBuffer[sampleNumber]; // tell the source which sound to play
  source.playbackRate.value = freq / sampleFreq;
  // Create a gain node.
  var gainNode = this.audioContext.createGain();
  // Connect the source to the gain node.
  source.connect(gainNode);
  // Connect the gain node to the destination.
  gainNode.connect(this.audioContext.destination);
  source.connect(gainNode); // connect the source to the context's destination (the speakers)
  gainNode.gain.value = 0.3;
  source.start(0); // play the source now
  this.source = source;
  this.gainNode = gainNode;
};

ActiveHex.prototype.noteOff = function() {
  var fadeout = this.audioContext.currentTime + this.sampleFadeout;
  if (this.gainNode) {
    this.gainNode.gain.setTargetAtTime(0, this.audioContext.currentTime,
                                       this.sampleFadeout);
  }
  if (this.source) {
    // This is a terrible fudge. Please forgive me - it's late, I'm tired, I
    // have a deadline, I've got other shit to do
    this.source.stop(fadeout + 4);
  }
};

const findFadeout = (fileName) => {
  for (let g of instruments) {
    for (let i of g.instruments) {
      if (i.fileName === fileName) {
        return i.fade;
      }
    }
  }
  console.error("Unable to find configured instrument");
  return 0.1;
};

// TODO use url from webpack file-loader instead of filename
export const instruments = [
  {
    name: "Regular",
    instruments: [
      {
        fileName: "piano",
        name: "Piano",
        fade: 0.1
      }, {
        fileName: "rhodes",
        name: "Rhodes",
        fade: 0.1
      }, {
        fileName: "harpsichord",
        name: "Harpsichord",
        fade: 0.2
      }, {
        fileName: "lute",
        name: "Lute-Stop",
        fade: 0.2
      }, {
        fileName: "harp",
        name: "Harp",
        fade: 0.2
      }, {
        fileName: "gayageum",
        name: "Gayageum",
        fade: 1
      }, {
        fileName: "qanun",
        name: "Qanun",
        fade: 1
      }
    ],
  },
  {
    name: "Additive Synthesis Tones",
    instruments: [
      {
        fileName: "WMRI3LST",
        name: "WMRİ 3-Limit (4 Harmonics) ST",
        fade: 0.1
      },{
        fileName: "WMRI5LST",
        name: "WMRİ 5-Limit (6 Harmonics) ST",
        fade: 0.1
      },{
        fileName: "WMRI5Lpike",
        name: "WMRİ 5-Limit (6 Harmonics) Pk",
        fade: 0.1
      },{
        fileName: "WMRI7LST",
        name: "WMRİ 7-Limit (10 Harmonics) ST",
        fade: 0.1
      },{
        fileName: "WMRI11LST",
        name: "WMRİ 11-Limit (12 Harmonics) ST",
        fade: 0.1
      },{
        fileName: "WMRI13LST",
        name: "WMRİ 13-Limit (16 Harmonics) ST",
        fade: 0.1
      },{
        fileName: "WMRInLST",
        name: "WMRİ n-Limit (\"sawtooth wave\") ST",
        fade: 0.1
      },{
        fileName: "WMRIByzantineST",
        name:"WMRİ Byzantine (9 Harmonics) ST",
        fade: 0.1
      },
    ]
  }
]

export default create_sample_synth;
