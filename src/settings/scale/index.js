import { h } from 'preact';
import { useState } from 'preact/hooks';
import { Fragment } from 'preact/compat';
import PropTypes from 'prop-types';
import Colors, { colorProp } from './colors';
import KeyLabels from './key-labels';
import ScaleTable from './scale-table';
import ScalaImport from './scala-import';

// import a file with scala data and optionally key labels and colors
const Scale = (props) => {
  const [importing, setImporting] = useState(false);

  const doImport = () => {
    props.onImport();
    setImporting(false);
  };
  const cancelImport = () => setImporting(false);
  const startImporting = () => setImporting(true);

  return (
  <fieldset>
      <legend><b>Scale</b></legend>
      <label >
        Reference Frequency (Hz value assigned to Scale Degree 0)
      <input name="fundamental" type="number"
             value={props.settings.fundamental}
             step="any" min="0.015625" max="16384"
             onChange={(e) => props.onChange(e.target.name, parseFloat(e.target.value))}/>
      </label>
      <br />
      <em>Note: To obtain the desired absolute frequencies when using MIDI output with MTS real-time tuning messages, please set global tuning of (all) receiving instrument(s) to A4 = 440 Hz! Choosing a different Kammerton (i.e. 415 Hz or 442 Hz) will transpose everything accordingly.<br />
        Common standard values for the Reference Frequency of C4 === MIDI Note 60 === are:<br /></em>
        261.6255653 Hz <em>(12-edo)</em>, 260.74074 Hz <em>(Pythagorean)</em>, 264 Hz <em>(5-Limit JI)</em>.
      <br />
      <br />
      {importing
       ?(<ScalaImport {...props}
                      onImport={doImport}
                      onCancel={cancelImport}/>)
       :(<>
            <button type="button" onClick={startImporting}>
            Import a Scala File
          </button>
          <br /><br />
          <ScaleTable {...props} />       
        </>)
      }
      <br />
      <Colors {...props} />
      <KeyLabels {...props} />
  </fieldset>
  );
};

Scale.propTypes = {
  onImport: PropTypes.func.isRequired,
};

export default Scale;
