import { h, Fragment } from 'preact';
import PropTypes from 'prop-types';

const ScalaImport = (props) => (
  <>
    copy/paste or type using the Scala file format: <a href="http://www.huygens-fokker.org/scala/scl_format.html" target="new">[ Scala format ]</a> <a href="https://sevish.com/scaleworkshop" target="new">[ Scale Workshop ]</a>
      <p>
        first line: (optional) "!" followed by scale name, i.e. "! myScale.scl"<br />
        second line: scale description (text string)<br />
        third line: scale size (number of degrees)<br />
        followed by a list of ratios (b/a) or cents (floats with a decimal point)<br /><br />
      <em>each degree may also be followed by a name and color in hex format (#xxxxxx);<br />
        to copy/paste HEJI accidentals, which are embedded in the font used for this web app, please use the link to the sMuFL home page at the bottom of this sidebar</em>
    </p>
    <label>      
      <textarea name="scale_import" onChange={(e) => props.onChange(e.target.name, e.target.value)}
                value={props.settings.scale_import}
      />
    </label>
    <br />
    <button type="button" onClick={props.onImport} >Build Layout</button>&nbsp;&nbsp;
    <button type="button" onClick={props.onCancel} >Cancel</button>
  </>
);

ScalaImport.propTypes = {
  onChange: PropTypes.func.isRequired,
  /*settings: PropTypes.shape({
    scale_import: PropTypes.string,
  }).isRequired,*/
};

export default ScalaImport;
