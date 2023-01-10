import { h } from 'preact';
import { Fragment } from 'preact/compat';
import PropTypes from 'prop-types';
import Sample from './sample';

const SampleSynth = (props) => (
  <fieldset>
    <legend>Sound Synthesis</legend>
    <label>
      Sample Synth
      <select value={props.settings.output}
        name="output"
        onChange={(e) => {
          props.onChange(e.target.name, e.target.value);
          localStorage.setItem(e.target.name, e.target.value);
        }
        }>
        <option value = "OFF">OFF</option>
        <option value="sample">Sample Synth ON</option>
        <option value="midi">(midi-synth)</option>
      </select>
    </label>
    {props.settings.output === "sample" && (
      <Sample {...props}/>
    )}
  </fieldset>  
);

SampleSynth.propTypes = {
  settings: PropTypes.shape({
    output: PropTypes.string,
  }).isRequired,
  midi: PropTypes.object,
  onChange: PropTypes.func.isRequired,
};

export default SampleSynth;
