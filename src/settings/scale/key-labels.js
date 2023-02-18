import { h } from 'preact';
import PropTypes from 'prop-types';
import { Fragment } from 'preact/compat';

// choose options for the displayed text on the keys
const KeyLabels = (props) => (
  <>
    <label>
      Key Labels
      <select name="key_labels" value={props.settings.key_labels} onChange={(e) => props.onChange(e.target.name, e.target.value)}>
        <option value="equaves">Octaves/Equaves</option>
        <option value="no_labels">Blank Keys</option>
        <option value="enumerate">Scale Degrees</option>
        <option value="note_names">Note Names</option>
        <option value="scala_names">Ratios/Cents</option>
      </select>
    </label>
  </>
);

KeyLabels.propTypes = {
  onChange: PropTypes.func.isRequired,
  settings: PropTypes.shape({
    key_labels: PropTypes.string,
  }),
};

export default KeyLabels;
