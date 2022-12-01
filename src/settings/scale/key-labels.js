import { h } from 'preact';
import PropTypes from 'prop-types';
import { Fragment } from 'preact/compat';

// TODO equivSteps is generated, doesn't need to be input.
const KeyLabels = (props) => (
  <>
    <label>
      Key Labels
      <select name="key_labels" value={props.settings.key_labels} onChange={(e) => props.onChange(e.target.name, e.target.value)}>
        <option></option>
        <option value="no_labels">Blank Keys (No Labels)</option>
        <option value="enumerate">Enumerate Scale</option>
        <option value="note_names">Note Names</option>
        <option value="scale">Ratios/Cents</option>
      </select>
    </label>
    {props.settings.key_labels === "enumerate" && (
      <label>
        Steps To Equivalence Interval
        <input name="equivSteps" type="number"
               min="1" max="999"
               value={props.settings.equivSteps}
               onChange={(e) => props.onChange(e.target.name, parseInt(e.target.value))}
        />
      </label>
    )}
  </>
);

KeyLabels.propTypes = {
  onChange: PropTypes.func.isRequired,
  settings: PropTypes.shape({
    key_labels: PropTypes.string,
    equivSteps: PropTypes.number,
  }),
};

export default KeyLabels;
