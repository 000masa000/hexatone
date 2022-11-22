import { h, render } from 'preact';
import { useState, useEffect } from 'preact/hooks';
import "regenerator-runtime/runtime";
import Keyboard from './keyboard';
import { presets, default_settings } from './settings/preset_values';
import { scalaToCents, parseScale } from './settings/scale/parse-scale.js';
import { create_sample_synth, instruments } from './sample_synth';
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

export const Loading = () => <LoadingIcon width="50vw" height="50vh"/>;

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

// TODO eliminate the need for this.
const normalize = (settings) => {
  const fundamental_color = (settings.fundamental_color || "").replace(/#/, '');
  const note_colors = settings.note_colors.map(c => c ? c.replace(/#/, '') : "fafafa");
  const rotation = settings.rotation * Math.PI / 180.0; // convert to radians
  const result = {...settings, fundamental_color, keyCodeToCoords, note_colors, rotation};
  if (settings.key_labels === "enumerate") {
    result["number_or_name"] = true;
  } else if (settings.key_labels === "no_labels") {
    result["no_labels"] = true;
  }

  if (settings.scale) {
    const scale = settings.scale.map(i => scalaToCents(i));
    const equivInterval = scale.pop();
    scale.unshift(0);
    result["scale"] = scale;
    result["equivInterval"] = equivInterval;
  }
  return result;
};

export const App = () => {
  const [loading, setLoading] = useState(0);
  /*
  const [settings, setSettings] = useState(default_settings);
  */
  const [settings, setSettings] = useQuery({
    name: ExtractString,
    description: ExtractString,
    // Output
    output: ExtractString,
    instrument: ExtractString,
    fundamental: ExtractFloat,
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
    // TODO consistent snake case
    equivSteps: ExtractInt,
    // TODO rename to note_names
    names: ExtractJoinedString,
    spectrum_colors: ExtractBool,
    fundamental_color: ExtractString,
    note_colors: ExtractJoinedString
  }, default_settings);

  const [active, setActive] = useState(false);
  const [synth, setSynth] = useState(null);
  const [midi, setMidi] = useState(null);
  const wait = l => l + 1;
  const signal = l => l - 1;

  useEffect(() => {
    if (navigator.requestMIDIAccess) {
      setLoading(wait);
      navigator.requestMIDIAccess().then(m => {
        setLoading(signal);
        setMidi(m);
      }); // todo error handling
    }
  }, []);

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
    if (midi && settings.output === "midi" && settings.midi_device &&
        typeof settings.midi_channel === "number" &&
        typeof settings.midi_velocity === "number") {
      setLoading(wait);

      create_midi_synth(midi.outputs.get(settings.midi_device),
                        settings.midi_channel,
                        settings.midi_velocity)
        .then(s => {
          setLoading(signal);
          setSynth(s);
        }); // todo error handling
    }
  }, [settings.instrument, settings.fundamental,
      settings.midi_device, settings.midi_channel,
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
        const { equivSteps, scale, labels, colors } = parseScale(s.scale_import);
        return {...s, equivSteps, scale, note_colors: colors, names: labels };
      } else {
        return s;
      }
    });
  };

  const valid = s => (
    ((s.output === "midi" && s.midi_device && typeof s.midi_channel === "number" && typeof s.midi_velocity === "number") ||
     (s.output === "sample" && s.fundamental && s.instrument)) &&
      s.rSteps && s.urSteps &&
      s.hexSize && s.hexSize >= 30 && typeof s.rotation === "number" &&
      s.scale && s.equivSteps &&
      (s.no_labels || s.number_or_name && s.names || !s.number_or_name) &&
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
          <a href="https://www.plainsound.org/hex">Terpstra Keyboard</a>
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
