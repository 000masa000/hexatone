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
        Reference Frequency (Hz value assigned to any Scale Degree)
      <input name="fundamental" type="number"
             value={props.settings.fundamental}
          step="0.000001" min="0.015625" max="16384"
          onChange={(e) => props.onChange(e.target.name, parseFloat(e.target.value))}
             />
      </label>
      <label >
        Scale Degree to which the Reference Frequency is applied
      <input name="reference_degree" type="number"
             value={props.settings.reference_degree}
             step="1" min="0" max={props.settings.equivSteps - 1}
             onChange={(e) => props.onChange(e.target.name, parseFloat(e.target.value))}/>
      </label>
      <p>
      <em>To obtain the desired absolute frequencies when using MIDI output with MTS (MIDI Tuning) messages, please set global tuning of (all) receiving instrument(s) to A4 = 440 Hz. Choosing a different Kammerton (i.e. 415 Hz or 442 Hz) will transpose everything accordingly. Commonly used values for the Reference Frequency C4 === MIDI Note 60 === Degree 0 are:<br /></em>
        261.6255653 Hz <em>(12edo)</em> or 260.740741 Hz <em>(Pythagorean / HEJI Notation)</em>.
      </p>
      <Colors {...props} />
      <KeyLabels {...props} />
      <br />
      <ScaleTable {...props} />  
      <br />
      {importing
       ?(<ScalaImport {...props}
                      onImport={doImport}
                      onCancel={cancelImport}/>)
        : (<>
          <button type="button" onClick={startImporting}>
            View / Edit / Import Scala File
          </button>
        </>)
      }
      <br />
      
  </fieldset>
  );
};

Scale.propTypes = {
  onImport: PropTypes.func.isRequired,
};

export default Scale;
