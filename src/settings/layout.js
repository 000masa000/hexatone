import { h } from 'preact';
import PropTypes from 'prop-types';

const Layout = (props) => (
  <fieldset>
    <legend>Layout</legend>
    <label>
      Right-Facing Steps
      <input name="rSteps" type="number"
             value={props.settings.rSteps}
             min="-1220" max="1220"
             onChange={(e) => props.onChange(e.target.name, parseInt(e.target.value))}/>
    </label>
    <label>
      Right-Downward-Facing Steps
      <input name="urSteps" type="number"
             value={props.settings.urSteps}
             min="-1220" max="1220"
             onChange={(e) => props.onChange(e.target.name, parseInt(e.target.value))}/>
    </label>
    <label>
      Hex Size (pixels)
      <input name="hexSize" type="number"
             step="any" min="20" max="1000"
             value={props.settings.hexSize}
             onChange={(e) => props.onChange(e.target.name, parseInt(e.target.value))}/>
    </label>
    <label>
      Rotation (degrees clockwise)
      <input name="rotation" type="number"
             value={props.settings.rotation}
             step="any" min="-360" max="360"
             onChange={(e) => props.onChange(e.target.name, parseFloat(e.target.value))}/>
    </label>
  </fieldset>
);

Layout.propTypes = {
  onChange: PropTypes.func.isRequired,
  settings: PropTypes.shape({
    rotation: PropTypes.number,
    hexSize: PropTypes.number,
    urSteps: PropTypes.number,
    rSteps: PropTypes.number,
  }),
};

export default Layout;
