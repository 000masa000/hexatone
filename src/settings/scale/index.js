import { h } from 'preact';
import { useState } from 'preact/hooks';
import { Fragment } from 'preact/compat';
import PropTypes from 'prop-types';
import Colors, { colorProp } from './colors';
import KeyLabels from './key-labels';
import ScaleTable from './scale-table';
import ScalaImport from './scala-import';

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
    <legend>Scale</legend>
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
      <label >
      Fundamental (Hz)
      <input name="fundamental" type="number"
             value={props.settings.fundamental}
             step="any" min="0.015625" max="16384"
             onChange={(e) => props.onChange(e.target.name, parseFloat(e.target.value))}/>
      </label>
      <KeyLabels {...props} />
  </fieldset>
  );
};

Scale.propTypes = {
  onImport: PropTypes.func.isRequired,
};

export default Scale;
