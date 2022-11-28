import axios from 'axios';

// Three concepts:
// Coordinates -> Scale degree -> Pitch/midi
export const create_sample_synth = async (fileName, fundamental) => {
  try {
    const sampleGain = findGain(fileName);
    const sampleAttack = findAttack(fileName);
    const sampleRelease = findRelease(fileName);
    const sampleLoop = findLoop(fileName);
    const audioContext = new AudioContext();
    const s110 = await loadSample(audioContext, fileName, "110");
    const s220 = await loadSample(audioContext, fileName, "220");
    const s440 = await loadSample(audioContext, fileName, "440");
    const s880 = await loadSample(audioContext, fileName, "880");

    const samples = [s110, s220, s440, s880];
    return {
      makeHex: (coords, cents) => {
        return new ActiveHex(coords, cents, fundamental, sampleGain, sampleAttack, sampleRelease, sampleLoop, samples, audioContext);
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

function ActiveHex(coords, cents, fundamental, sampleGain, sampleAttack, sampleRelease, sampleLoop, sampleBuffer, audioContext) {
  this.coords = coords;// these end up being used by the keys class
  this.release = false;

  this.cents = cents;
  this.fundamental = fundamental;
  this.sampleGain = sampleGain;
  this.sampleAttack = sampleAttack;
  this.sampleRelease = sampleRelease;
  this.sampleLoop = sampleLoop;
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
  source.loop = this.sampleLoop; // tell it lo loop if needed
  source.playbackRate.value = freq / sampleFreq;
  // Create a gain node.
  var gainNode = this.audioContext.createGain();
  // Connect the source to the gain node.
  source.connect(gainNode);
  // Connect the gain node to the destination.
  gainNode.connect(this.audioContext.destination);
  source.connect(gainNode); // connect the source to the context's destination (the speakers)
  gainNode.gain.value = 0;
  source.start(0); // play the source now
  gainNode.gain.setTargetAtTime(this.sampleGain, this.audioContext.currentTime, this.sampleAttack);
  this.source = source;
  this.gainNode = gainNode;
};

ActiveHex.prototype.noteOff = function () {
  var fadeout = this.audioContext.currentTime + this.sampleRelease;
  if (this.gainNode) {
    this.gainNode.gain.setTargetAtTime(0, this.audioContext.currentTime, this.sampleRelease);
  }
  if (this.source) {
    this.source.stop(fadeout + 4);
  }
};

const findGain = (fileName) => {
  for (let g of instruments) {
    for (let i of g.instruments) { 
      if (i.fileName === fileName) {
        return i.gain;
      }
    }
  }
  console.error("Unable to find configured instrument");
  return 0;
};

const findAttack = (fileName) => {
  for (let g of instruments) {
    for (let i of g.instruments) { 
      if (i.fileName === fileName) {
        return i.attack;
      }
    }
  }
  console.error("Unable to find configured instrument");
  return 0;
};

const findRelease = (fileName) => {
  for (let g of instruments) {
    for (let i of g.instruments) { 
      if (i.fileName === fileName) {
        return i.release;
      }
    }
  }
  console.error("Unable to find configured instrument");
  return 0.1;
};

const findLoop = (fileName) => {
  for (let g of instruments) {
    for (let i of g.instruments) { 
      if (i.fileName === fileName) {
        return i.loop;
      }
    }
  }
  console.error("Unable to find configured instrument");
  return 0.1;
};

// TODO use url from webpack file-loader instead of filename
export const instruments = [
  {
    name: "Acoustic Instruments",
    instruments: [
      {
        fileName: "piano",
        name: "Piano",
        gain: 0.36,
        attack: 0,
        release: 0.1,
        loop: false
      }, {
        fileName: "rhodes",
        name: "Rhodes",
        gain: 0.38,
        attack: 0,
        release: 0.001,
        loop: false
      }, {
        fileName: "vibes",
        name: "Vibraphone",
        gain: 0.34,
        attack: 0,
        release: 1.5,
        loop: false
      }, {
        fileName: "hammond",
        name: "Hammond",
        gain: 0.5,
        attack: 0.002,
        release: 0.002,
        loop: true
      }, {
        fileName: "harpsichord",
        name: "Harpsichord",
        gain: 0.25,
        attack: 0,
        release: 0.2,
        loop: false
      }, {
        fileName: "lute",
        name: "Lute-Stop",
        gain: 0.26,
        attack: 0,
        release: 0.2,
        loop: false
      }, {
        fileName: "harp",
        name: "Harp",
        gain: 0.33,
        attack: 0,
        release: 1.5,
        loop: false
      }, {
        fileName: "cello-viola",
        name: "Pizzicato",
        gain: 0.35,
        attack: 0,
        release: 1.5,
        loop: false
      }, {
        fileName: "qanun",
        name: "Qanun",
        gain: 0.27,
        attack: 0,
        release: 1.5,
        loop: false
      }, {
        fileName: "gayageum",
        name: "Gayageum",
        gain: 0.22,
        attack: 0,
        release: 1.5,
        loop: false
      }
    ],
  },
  {
    name: "Additive Synthesis Tones",
    instruments: [
      {
        fileName: "WMRI3LST",
        name: "3-Limit (4 Harmonics)",
        gain: 0.69,
        attack: 0.1,
        release: 0.08,
        loop: true
      }, {
        fileName: "WMRI5LST",
        name: "5-Limit (6 Harmonics)",
        gain: 0.68,
        attack: 0.12,
        release: 0.08,
        loop: true
      }, {
        fileName: "WMRI7LST",
        name: "7-Limit (10 Harmonics)",
        gain: 0.66,
        attack: 0.12,
        release: 0.08,
        loop: true
      }, {
        fileName: "WMRI11LST",
        name: "11-Limit (12 Harmonics)",
        gain: 0.635,
        attack: 0.14,
        release: 0.08,
        loop: true
      }, {
        fileName: "WMRI13LST",
        name: "13-Limit (16 Harmonics)",
        gain: 0.62,
        attack: 0.16,
        release: 0.08,
        loop: true
      }, {
        fileName: "WMRIByzantineST",
        name: "Byzantine (9 Harmonics)",
        gain: 0.67,
        attack: 0.12,
        release: 0.08,
        loop: true
      }
    ]
  }
]

export default create_sample_synth;
