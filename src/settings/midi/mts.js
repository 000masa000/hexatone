import { h } from 'preact';
import { Fragment } from 'preact/compat';
import PropTypes from 'prop-types';
import Keys from '../../keyboard/keys';


const MidiTuning = (props) => (
  <>
    <legend><b>MIDI Tuning Map Output</b></legend>
    <br />
    <label>
      Send Sysex
      <input name="sysex_auto" type="checkbox"
        checked={props.settings.sysex_auto}
        onChange={(e) => {
          props.onChange(e.target.name, e.target.checked);
          sessionStorage.setItem(e.target.name, e.target.checked);
          console.log("MTS Sysex Auto-Send: ", sessionStorage.getItem("sysex_auto"))
        }
        } />

    </label>
    <label>
      Type of Sysex Message(s)
      <select value={props.settings.sysex_type}
        name="sysex_type"
        onChange={(e) => {
          props.onChange(e.target.name, e.target.value);
          sessionStorage.setItem(e.target.name, e.target.value);
          console.log("MTS Sysex Message Type: ", sessionStorage.getItem(e.target.name));
        }
        }>
        <option value = "127">real-time (127)</option>
        <option value = "126">non-real-time (126)</option>
      </select>
    </label>
    <label>
      Device ID (127 = "all devices")
      <input name="device_id" type="number"
        value={props.settings.device_id}
        step="1" min="0" max="127"
        onChange={(e) => {
          if ((e.target.value >= 0) && (e.target.value <= 127)) {
            props.onChange(e.target.name, parseInt(e.target.value));
            sessionStorage.setItem(e.target.name, e.target.value);
            console.log("Device ID selected: ", sessionStorage.getItem(e.target.name));
          };
        }
        } />
    </label>
    <label>
      Tuning Map Number
      <input name="tuning_map_number" type="number"
        value={props.settings.tuning_map_number}
        step="1" min="0" max="127"
        onChange={(e) => {
          if ((e.target.value >= 0) && (e.target.value <= 127)) {
            props.onChange(e.target.name, parseInt(e.target.value));
            sessionStorage.setItem(e.target.name, e.target.value);
            console.log("Target Tuning Map: ", sessionStorage.getItem(e.target.name));
          };
        }
        } />
    </label>
    <label>
      MIDI Note for Degree 0
      <input name="tuning_map_degree0" type="number"
        value={props.settings.tuning_map_degree0}
        step="1" min="0" max="127"
        onChange={(e) => {
          if ((e.target.value >= 0) && (e.target.value <= 127)) {
            props.onChange(e.target.name, parseInt(e.target.value));
            sessionStorage.setItem(e.target.name, e.target.value);
            console.log("Degree 0 Mapped to MIDI Note: ", sessionStorage.getItem(e.target.name));
          };
        }
        } />
    </label>
  
    <p>
    <em>The <a href="http://www.microtonal-synthesis.com/MIDItuning.html" target="_new">MIDI Tuning Standard</a>, described in detail at <a href="https://www.midi.org/specifications/midi1-specifications/general-midi-specifications/general-midi-2/midi-tuning-updated" target="_new">midi.org</a>, allows external synthesizers to receive data modifying the tuning of each MIDI note. This is done by system exclusive messages: either a non-real-time "Bulk Tuning Dump" or 128 real-time "Single-Note Tuning Changes". The receiving synth will need to be set to receive sysex into the specified Tuning Map slot. Using the free <a href="https://oddsound.com/mtsespmini.php" target="_new">Oddsound MTS-ESP Mini</a> plug-in, it is possible to translate MTS data to retune softsynths using other protocols (MPE or multichannel pitchbend).</em>
    </p>
  </>  
);

MidiTuning.propTypes = {
  settings: PropTypes.shape({    
    sysex_auto: PropTypes.bool,
    sysex_type: PropTypes.string,
    device_id: PropTypes.number,
    tuning_map_number: PropTypes.number
  }).isRequired,
  onChange: PropTypes.func.isRequired,
};

export default MidiTuning;
