import { h, Fragment } from 'preact';
import PropTypes from 'prop-types';

const ScalaImport = (props) => (
  <>
    <label>
      copy/paste or type using the Scala file format:<br />
      first line: scale-name or leave blank / second line: scale length<br />
      followed by a list of ratios (b/a) or cents (floats)<br />
      <a href="http://www.huygens-fokker.org/scala/scl_format.html" target="new">[ Scala format ]</a>
      <textarea name="scale_import" onChange={(e) => props.onChange(e.target.name, e.target.value)}
                rows="12" value={props.settings.scale_import}
      />
    </label>
    <br />
    <button type="button" onClick={props.onImport} >Build Layout</button>&nbsp;&nbsp;
    <button type="button" onClick={props.onCancel} >Cancel</button>
    <br />
  </>
);

ScalaImport.propTypes = {
  onChange: PropTypes.func.isRequired,
  settings: PropTypes.shape({
    scale_import: PropTypes.string,
  }).isRequired,
};

export default ScalaImport;
