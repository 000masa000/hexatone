import { h } from 'preact';
import { Fragment } from 'preact/compat';
import PropTypes from 'prop-types';
import MidiOut from './midiout';

const MIDIio = (props) => (
  <fieldset>
    <legend>MIDI</legend>
    <label>
      Input Port
      <select value={props.settings.midiin_device}
              name="midiin_device"
              onChange={(e) => props.onChange(e.target.name, e.target.value)}>
        <option value="-1">OFF</option>
        {props.midi && Array.from(props.midi.inputs.values()).map(m => (
      <option value={m.id}>{m.name}</option>
    ))}
      </select>
    </label>
    <label>
      Output
      <select value={props.settings.output}
              name="output"
              onChange={(e) => props.onChange(e.target.name, e.target.value)}>
        <option>OFF</option>
        {props.midi && (<option value="midi">MIDI Synth ON</option>)}
      </select>
    </label>
    {(props.settings.output === "midi" && props.midi) && (
      <MidiOut {...props}/>
    )}
  </fieldset>  
);

MIDIio.propTypes = {
  settings: PropTypes.shape({
    output: PropTypes.string,
  }).isRequired,
  midi: PropTypes.object,
  onChange: PropTypes.func.isRequired,
};

export default MIDIio;
