import { h } from 'preact';
import { Fragment } from 'preact/compat';
import PropTypes from 'prop-types';
import MidiOut from './midiout';

const MIDIio = (props) => (
  <fieldset>
    <legend><b>MIDI Settings</b></legend>
    <label>
      Input Port
      <select value={props.settings.midiin_device}
        name="midiin_device"
        onChange={(e) => {
          props.onChange(e.target.name, e.target.value);
          localStorage.setItem(e.target.name, e.target.value);
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
          localStorage.setItem(e.target.name, e.target.value);
        }
        }>
        <option value="-1">---choose a channel on which input is untransposed---</option>
        {[...Array(16).keys()].map(i => <option value={i}>{i + 1}</option>)}
      </select>
    </label>
    <br />
    <em>Note: Input is always received on all channels. The Central Input Channel chosen above remains untransposed. Other channels are transposed by multiples of the selected scale's interval of repetition (usually an octave, but it may be any value, commonly called "equave"). Multichannel controllers are automatically mapped onto transpositions of the selected scale (up to 128 pitches per channel).</em>
    <br /><br />    
    <label>
      (Sound Synthesis)
      <select value={props.settings.output}
              name="output"
        onChange={(e) => {
          props.onChange(e.target.name, e.target.value);
          localStorage.setItem(e.target.name, e.target.value);
        }
        }>
        <option value="OFF">OFF</option>
        {props.midi && (<option value="midi">(MIDI-output)</option>)}
        <option value="sample">(sample-synth)</option>
      </select>
    </label>
    {(props.settings.output === "midi" && props.midi) && (
      <MidiOut {...props}/>
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
