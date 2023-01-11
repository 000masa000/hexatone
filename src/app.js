import { h, render } from 'preact';
import { useState, useEffect } from 'preact/hooks';
import "regenerator-runtime/runtime";

import Keyboard from './keyboard';
import { presets, default_settings } from './settings/preset_values';
import { parseScale, scalaToCents, scalaToLabels, parsedScaleToLabels } from './settings/scale/parse-scale.js';
import { create_sample_synth } from './sample_synth';
import { instruments } from './sample_synth/instruments';
import { create_midi_synth} from './midi_synth';
import keyCodeToCoords from './settings/keycodes';
import { useQuery, Extract, ExtractInt, ExtractString, ExtractFloat, ExtractBool, ExtractJoinedString } from './use-query';
import Settings from './settings';
import Blurb from './blurb';

import PropTypes from 'prop-types';

import "normalize.css";
import "./terpstra-style.css";
import LoadingIcon from './hex.svg';
import './loader.css';

export const Loading = () => <LoadingIcon />;

let notChrome = !/Chrome/.test(navigator.userAgent);
let alertMessage = "Please use a desktop version of Google Chrome or Microsoft Edge to fully access this site.\nSome key features of the Web MIDI API do not currently work on phones or in other browsers."
if (notChrome) alert(alertMessage);

const findPreset = (preset) => {
  for (let g of presets) {
    for (let p of g.settings) {
      if (p.name === preset) {
        return p;
      }
    }
  }
  console.log("Unable to find preset");
  return default_settings;
};

const normalize = (settings) => {
  const fundamental_color = (settings.fundamental_color || "").replace(/#/, '');
  const note_colors = settings.note_colors.map(c => c ? c.replace(/#/, '') : "ffffff");
  const rotation = settings.rotation * Math.PI / 180.0; // convert to radians
  const result = { ...settings, fundamental_color, keyCodeToCoords, note_colors, rotation };
  
  if (settings.key_labels === "enumerate") {
    result["degree"] = true; // if true label scale with degree numbers, else use names
  } else if (settings.key_labels === "note_names") {
    result["note"] = true;
  } else if (settings.key_labels === "scala_names") {
    result["scala"] = true;
  } else if (settings.key_labels === "no_labels") {
    result["no_labels"] = true;
  };

  if (settings.scale) {
    const scala_names = settings.scale.map(i => scalaToLabels(i)); // convert Scala file data to possible key labels
    const scale = settings.scale.map(i => scalaToCents(i)); // convert Scala file to cents
    const equivInterval = scale.pop(); // determine equave
    scale.unshift(0); // add the implicit fundamental to the scale
    scala_names.pop(); // drop equave
    scala_names.unshift("1/1"); // add implicit fundamental
    result["scala_names"] = scala_names;
    result["scale"] = scale;
    result["equivInterval"] = equivInterval;
  }
  return result;
};

//var counter = 0; //TODO why is the App() called so many times?

const App = () => {
  //counter += 1;
  //console.log("counter", counter);
  const [loading, setLoading] = useState(0);

  const [settings, setSettings] = useQuery({
    name: ExtractString,
    description: ExtractString,

    // Input
    midiin_device: ExtractString,
    midiin_channel: ExtractInt,

    // Output
    output: ExtractString,
    instrument: ExtractString,
    fundamental: ExtractFloat,
    midi_mapping: ExtractString,
    midi_device: ExtractString,
    midi_channel: ExtractInt,
    midi_velocity: ExtractInt,

    // Layout
    rSteps: ExtractInt,
    urSteps: ExtractInt,
    hexSize: ExtractInt,
    rotation: ExtractInt,
    // Scale
    scale: ExtractJoinedString,
    key_labels: ExtractString,
    equivSteps: ExtractInt,
    note_names: ExtractJoinedString,
    spectrum_colors: ExtractBool,
    fundamental_color: ExtractString,
    note_colors: ExtractJoinedString
  }, default_settings);

  const [active, setActive] = useState(false);
  const [synth, setSynth] = useState(null);
  const [midi, setMidi] = useState(null); // global const "midi" will store MIDIAccess
  const wait = l => l + 1;
  const signal = l => l - 1;

  useEffect(() => {
    if (navigator.requestMIDIAccess) {
      setLoading(wait);
      navigator.requestMIDIAccess( { sysex: true } ).then 
        (m => {
        setLoading(signal);
          onMIDISuccess(m);
      }, onMIDIFailure); 
    }
  }, []);

  function onMIDISuccess(midiAccess) {
    console.log("Web MIDI API with sysex for MTS messages is ready!"); // post success    
    setMidi(midiAccess); // MIDIAccess stored
  }

  function onMIDIFailure() {
    console.log('Web MIDI API could not initialise!');
  } // MIDI failure error

  // if localStorage values have been set for preferred output (sample/MIDI) and settings, use them

  if (localStorage.getItem("output")) {
   // console.log("localstorage output", localStorage.getItem("output"))
    settings.output = localStorage.getItem("output");
  } else {
    settings.output = "sample";
  };

  if (localStorage.getItem("instrument")) {
   // console.log("localstorage instrument", localStorage.getItem("instrument"))
    settings.instrument = localStorage.getItem("instrument");
  } else {
    settings.instrument = "hammond";
  };
  
  if (localStorage.getItem("midiin_device")) {
   // console.log("localstorage midiin_device", localStorage.getItem("midiin_device"))
    settings.midiin_device = localStorage.getItem("midiin_device");
  } else {
    settings.midiin_device = "OFF";
  };

  if (localStorage.getItem("midiin_channel")) {
   // console.log("localstorage midiin_channel", localStorage.getItem("midiin_channel"))
    settings.midiin_channel = parseInt(localStorage.getItem("midiin_channel"));
  } else {
    settings.midiin_channel = 0;
  };

  if (localStorage.getItem("midi_device")) {
   // console.log("localstorage midi_device", localStorage.getItem("midi_device"))
    settings.midi_device = localStorage.getItem("midi_device");
  } else {
    settings.midi_device = "OFF";
  };

  if (localStorage.getItem("midi_channel")) {
   // console.log("localstorage midi_channel", localStorage.getItem("midi_channel"))
    settings.midi_channel = parseInt(localStorage.getItem("midi_channel"));
  } else {
    settings.midi_channel = 0;
  };
  
  if (localStorage.getItem("midi_mapping")) {
   // console.log("localstorage midi_mapping", localStorage.getItem("midi_mapping"))
    settings.midi_mapping = localStorage.getItem("midi_mapping");
  } else {
    settings.midi_mapping = "sequential";
  };

  if (localStorage.getItem("midi_velocity")) {
  // console.log("localstorage midi_velocity", localStorage.getItem("midi_velocity"))
    settings.midi_velocity = parseInt(localStorage.getItem("midi_velocity"));
  } else {
    settings.midi_velocity = 64;
  };

  useEffect(() => {
    if (settings.output === "sample"
        && settings.instrument && settings.fundamental) {
      setLoading(wait);
      create_sample_synth(settings.instrument,
                          settings.fundamental)
        .then(s => {
          setLoading(signal);
          setSynth(s);
        }); // todo error handling
    }
    if (midi && settings.output === "midi" && (settings.midi_device !== "OFF") &&
      typeof settings.midi_channel === "number" && settings.midi_mapping &&
      typeof settings.midi_velocity === "number") {
      setLoading(wait);

      create_midi_synth(midi.outputs.get(settings.midi_device), settings.midi_channel, settings.midi_mapping, settings.midi_velocity)
        .then(s => { 
          setLoading(signal);
          setSynth(s);
        }); // todo error handling
    }
  }, [settings.instrument, settings.fundamental, settings.midiin_device, settings.midiin_channel,
      settings.midi_device, settings.midi_channel, settings.midi_mapping,
      settings.midi_velocity, settings.output, midi]);

  const onChange = (key, value) => {
    setSettings(s => ({...s, [key]: value}));
  };

  const presetChanged = e => {
    setSettings(_ => findPreset(e.target.value));
  };

  const onImport = () => {
    setSettings(s => {
      if (s.scale_import) {
        const { equivSteps, description, scale, labels, colors } = parseScale(s.scale_import);
        const scala_names = parsedScaleToLabels(scale);
        return {...s, description, equivSteps, scale, scala_names, note_names: labels, note_colors: colors };
      } else {
        return s;
      }
    });
  };

  const valid = s => (
    ((s.output === "midi" && (s.midi_device !== "OFF") && typeof s.midi_channel === "number" && s.midi_mapping &&
      typeof s.midi_velocity === "number" && s.midi_velocity > 0) ||
     (s.output === "sample" && s.fundamental && s.instrument)) &&
      s.rSteps && s.urSteps &&
      s.hexSize && s.hexSize >= 20 && typeof s.rotation === "number" &&
      s.scale && s.equivSteps &&
      (s.no_labels || s.degree && s.note_names || !s.degree) &&
      ((s.spectrum_colors && s.fundamental_color) || s.note_colors)
  );

  return (
    <div className={active ? "hide" : "show"}>
      {loading === 0 && valid(settings) && synth && (
        <Keyboard synth={synth} settings={normalize(settings)}
                  active={active} />
      )}

      {loading > 0 && <Loading/>}
      <button id="sidebar-button" onClick={() => setActive(s => !s)}>
        <div>&gt;</div>
      </button>
	  <nav id="sidebar">
        <h1>
          Hexatone
        </h1>
        <Settings presetChanged={presetChanged}
                    presets={presets}
                    onChange={onChange}
                    onImport={onImport}
                    settings={settings}
                    midi={midi}
                    instruments={instruments}/>
        <Blurb />
	  </nav>
    </div>
  );
};

export default App;
