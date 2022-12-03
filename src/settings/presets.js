import { h } from 'preact';
import { Fragment } from 'preact/compat';
import PropTypes from 'prop-types';

const Presets = (props) => (
  <select onChange={props.onChange} name="presets">
    <option>Choose Preset:</option>
    {props.presets.map(group => (
      <optgroup label={group.name}>
        {group.settings.map(setting => (
          <option value={setting.name}>{setting.name}</option>
        ))}
      </optgroup>
    ))}
  </select>);

Presets.propTypes = {
  onChange: PropTypes.func.isRequired,
  presets: PropTypes.arrayOf(PropTypes.shape({
    name: PropTypes.string.isRequired,
    settings: PropTypes.arrayOf(PropTypes.shape({
      name: PropTypes.string.isRequired,
    })),
  })).isRequired
};

export default Presets;
