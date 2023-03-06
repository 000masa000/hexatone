import { h, Fragment } from 'preact';
import PropTypes from 'prop-types';

const ScalaImport = (props) => (
  <>
    copy/paste or type below using the Scala file format:&nbsp; <a href="http://www.huygens-fokker.org/scala/scl_format.html" target="new">[ Scala format ]</a>&nbsp; <a href="https://sevish.com/scaleworkshop" target="new">[ Scale Workshop ]</a>
    <p>
      <b>Name</b> <em>(optional):</em> "!" followed by scala file name, e.g. "! myScale.scl"<br />
      "<b>!</b>" <em>(optional):</em> precedes a comment or empty line<br />
      <b>Description</b>: some text about the scale<br />
      <b>Size</b>: the number of scale degrees<br />
      <b>Scale</b>: a list of ratios (b/a) or cents (numbers with a decimal point)<br /><br />
      
      <em>Note: Degree 0 (1/1 or 0.0 cents) is set automatically from the Reference Frequency; the scale starts with Degree 1 and ends with the interval, usually an octave (2/1 or 1200.0 cents), at which the scale will recur.<br /><br />
        For convenience using this app, scale degrees may be placed in any order; each degree may also be followed by a label (text) and a color (#xxxxxx). To copy/paste HEJI accidentals, which are embedded in the font used for this web app, refer to the sMuFL home page: <a href="https://w3c.github.io/smufl/latest/tables/extended-helmholtz-ellis-accidentals-just-intonation.html" target="new">w3c.github.io/smufl/latest/tables</a>.</em>
    </p>
    <label>      
      <textarea name="scale_import" onChange={(e) => props.onChange(e.target.name, e.target.value)}
                value={props.settings.scale_import}
      />
    </label>
    <br />
    <button type="button" onClick={props.onImport} >Build Layout</button>&nbsp;&nbsp;
    <button type="button" onClick={props.onCancel} >Hide Scala File</button>
  </>
);

ScalaImport.propTypes = {
  onChange: PropTypes.func.isRequired,
  /*settings: PropTypes.shape({
    scale_import: PropTypes.string,
  }).isRequired,*/
};

export default ScalaImport;
