import { h } from 'preact';
import { Fragment } from 'preact/compat';
import PropTypes from 'prop-types';

export const colorProp = function(props, propName, componentName) {
  if (!/#[a-zA-Z0-9]{6}/.test(props[propName])) {
    return new Error(
      'Invalid hex color for prop `' + propName + '` supplied to' +
        ' `' + componentName + '`. Validation failed.'
    );
  }
};

const Colors = (props) => (
  <>
    <label>
      Use Spectrum Colors
      <input name="spectrum_colors" type="checkbox"
             checked={props.settings.spectrum_colors}
             onChange={(e) => props.onChange(e.target.name, e.target.checked)} />

    </label>
    {props.settings.spectrum_colors && (
      <label>
        Choose Central Hue
        <input name="fundamental_color" type="color"
               onChange={(e) => props.onChange(e.target.name, e.target.value)}
               value={props.settings.fundamental_color}/>
      </label>
    )}
  </>
);

Colors.propTypes = {
  onChange: PropTypes.func.isRequired,
  settings: PropTypes.shape({
    spectrum_colors: PropTypes.bool,
    fundamental_color: colorProp,
  }),
};

export default Colors;
