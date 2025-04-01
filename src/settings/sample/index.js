import { h } from 'preact';
import { Fragment } from 'preact/compat';
import PropTypes from 'prop-types';
import Sample from './sample';

const SampleSynth = (props) => (
  <fieldset>
    <legend><b>Sound Synthesis</b></legend>
    <label>
      Built-In Synth / MIDI Output
      <select value={props.settings.output}
        name="output"
        onChange={(e) => {
          props.onChange(e.target.name, e.target.value);
          sessionStorage.setItem(e.target.name, e.target.value);
          //console.log("Sound Synthesis selected: ", sessionStorage.getItem(e.target.name));
        }
        }>
        <option value = "OFF">OFF</option>
        <option value="sample">Built-In Synth ON</option>
        <option value="midi">MIDI Output ON</option>
      </select>
    </label>
    <label>
          Fixed velocity (touch input)
          <input name="midi_velocity" type="number"
            value={props.settings.midi_velocity}
            step="1" min="1" max="127"
            onChange={(e) => {
              if (parseInt(e.target.value) >= 1 && parseInt(e.target.value) <= 127) {
                props.onChange(e.target.name, parseInt(e.target.value));
                sessionStorage.setItem(e.target.name, parseInt(e.target.value));
              };
            }
            } />
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
