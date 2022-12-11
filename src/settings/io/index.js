import { h } from 'preact';
import { Fragment } from 'preact/compat';
import PropTypes from 'prop-types';
import Sample from './sample';
import MidiIn from './midiin';
import MidiOut from './midiout';

const MidiInSelect = (props) => (
  <select name="midiin_device" onChange={(e) => props.onChange(e.target.name, e.target.value)}>
    <option>Input Devices:</option>
    {Array.from(props.midi.inputs.values()).map(m => (
      <option value={m.id}>{m.name}</option>
    ))}
  </select>
); // make this work!


const Output = (props) => (
  <fieldset>
    <legend>Sound Synthesis / MIDI</legend>
    <label>
      MIDI Input
    </label>
    <label>
      Output (built-in / MIDI)
      <select value={props.settings.output}
              name="output"
              onChange={(e) => props.onChange(e.target.name, e.target.value)}>
        <option>Choose Output:</option>
        {props.midi && (<option value="midi">MIDI</option>)}
        <option value="sample">Sample Synthesis</option>
      </select>
    </label>
    {(props.settings.output === "midi" && props.midi) && (
      <MidiOut {...props}/>
    )}
    {props.settings.output === "sample" && (
      <Sample {...props}/>
    )}
  </fieldset>
);

Output.propTypes = {
  settings: PropTypes.shape({
    output: PropTypes.string,
  }).isRequired,
  midi: PropTypes.object,
  onChange: PropTypes.func.isRequired,
};

export default Output;
