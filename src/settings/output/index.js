import { h } from 'preact';
import { Fragment } from 'preact/compat';
import PropTypes from 'prop-types';
import Sample from './sample';
import Midi from './midi';

const Output = (props) => (
  <fieldset>
    <legend>Sound Synthesis / MIDI</legend>
    <label>
      Output
      <select value={props.settings.output}
              name="output"
              onChange={(e) => props.onChange(e.target.name, e.target.value)}>
        <option>Choose output</option>
        {props.midi && (<option value="midi">MIDI</option>)}
        <option value="sample">Sample Synthesis</option>
      </select>
    </label>
    {(props.settings.output === "midi" && props.midi) && (
      <Midi {...props}/>
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
