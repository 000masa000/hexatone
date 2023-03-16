import { h } from 'preact';
import { Fragment } from 'preact/compat';
import PropTypes from 'prop-types';
import MidiOut from './midiout';
import MidiTuning from './mts';

const MIDIio = (props) => (
  <fieldset>
    <legend><b>MIDI Settings</b></legend>
    <label>
      Input Port
      <select value={props.settings.midiin_device}
        name="midiin_device"
        onChange={(e) => {
          props.onChange(e.target.name, e.target.value);
          sessionStorage.setItem(e.target.name, e.target.value);
          console.log("MIDI In device selected: ", sessionStorage.getItem(e.target.name));
        }
        }>
        <option value="OFF">OFF</option>
        {props.midi && Array.from(props.midi.inputs.values()).map(m => (
      <option value={m.id}>{m.name}</option>
    ))}
      </select>
    </label>
    <label>
    Central Input Channel
      <select value={props.settings.midiin_channel}
        name="midiin_channel"
        onChange={(e) => {
          props.onChange(e.target.name, parseInt(e.target.value));
          sessionStorage.setItem(e.target.name, e.target.value);
          let ch = parseInt(sessionStorage.getItem(e.target.name)) + 1;
          if (ch == 0) {
            ch = "OFF";
          }
          console.log("MIDI In channel selected: ", ch);
        }
        }>
        <option value="-1">---choose a channel on which input is untransposed---</option>
        {[...Array(16).keys()].map(i => <option value={i}>{i + 1}</option>)}
      </select>
    </label>
    <br />
    <em>Input is received on all channels. Notes on the Central Input Channel remain untransposed. Other channels are transposed by multiples of the selected scale&rsquo;s interval of repetition (usually an octave, but it may be any value). Thus, multichannel controllers are automatically mapped onto transpositions of the selected scale (up to 128 pitches per channel).</em>
    <br /><br />    
    
    {(props.settings.output === "midi" && props.midi) && (
      <MidiOut {...props}/>
    )}
    {(props.settings.output === "midi" && props.midi) && (
      <MidiTuning {...props}/>
    )}
  </fieldset>
);

MIDIio.propTypes = {
  settings: PropTypes.shape({    
    midiin_device: PropTypes.string,
    midiin_channel: PropTypes.number,
    output: PropTypes.string
  }).isRequired,
  midi: PropTypes.object,
  onChange: PropTypes.func.isRequired,
};

export default MIDIio;
