import { h } from 'preact';
import PropTypes from 'prop-types';

const ScaleTable = (props) => {
  const scale = [...(props.settings.scale || [])];
  const equiv_interval = scale.length ? scale.pop() : 0;
  scale.unshift(0);

  let names;
  if (props.settings.key_labels === "enumerate") {
    names = [...Array(scale.length).keys()];
  } else if (props.settings.key_labels === "names") {
    names = props.settings.names || [];
  } else {
    names = Array(scale.length).fill("");
  }

  let colors;
  if (props.settings.spectrum_colors) {
    colors = Array(scale.length).fill(props.settings.fundamental_color);
  } else {
    colors = props.settings.note_colors || [];
  }
  const rows = scale.map((x, i) => [x, names[i], colors[i]]);

  const scaleChange = e => {
    const next = [... (props.settings.scale || [])];
    next[parseInt(e.target.name.replace(/scale/, ""))] = e.target.value;
    props.onChange("scale", next);
  };

  const colorChange = e => {
    const next = [...(props.settings.note_colors || [])];
    next[parseInt(e.target.name.replace(/color/, ""))] = e.target.value;
    props.onChange("note_colors", next);
  };

  const nameChange = e => {
    const next = [...(props.settings.names || [])];
    next[parseInt(e.target.name.replace(/name/, ""))] = e.target.value;
    props.onChange("names", next);
  };

  const editable_labels = props.settings.key_labels !== "names";
  const editable_colors = props.settings.spectrum_colors;
  return (
    <table>
      <thead>
        <th>Frequency</th>
        <th>Name</th>
        <th>Color</th>
      </thead>
      <tbody>
        <tr>
          <td><em>0</em></td>
          <td>
            <input type="text" disabled={editable_labels}
                   name="name0" value={names[0]} onChange={nameChange}/>
          </td>
          <td>
            <input type="color" disabled={editable_colors}
                   name="color0" value={colors[0]} onChange={colorChange}/>
          </td>
        </tr>
        {rows.slice(1).map(([freq, name, color], i) => (
          <tr>
            <td>
              <input type="text" name={`scale${i}`}
                     value={freq} onChange={scaleChange}/>
            </td>
            <td>
              <input type="text" disabled={editable_labels}
                     name={`name${i+1}`} value={name}
                     onChange={nameChange}/>
            </td>
            <td>
              <input type="color" disabled={editable_colors}
                     name={`color${i+1}`} value={color}
                     onChange={colorChange}/>
            </td>
          </tr>
        ))}
        <tr>
          <td>
            <input type="text"
                   name={`scale${scale.length - 1}`}
                   value={equiv_interval} onChange={scaleChange}/>
          </td>
          <td><em>{names[0]}</em></td>
          <td><em>{colors[0]}</em></td>
        </tr>
      </tbody>
    </table>
  );
};

ScaleTable.propTypes = {
  onChange: PropTypes.func.isRequired,
  settings: PropTypes.shape({
    scale: PropTypes.arrayOf(PropTypes.string),
    key_labels: PropTypes.string,
    spectrum_colors: PropTypes.bool,
    fundamental_color: PropTypes.number,
    note_colors: PropTypes.arrayOf(colorProp),
    names: PropTypes.arrayOf(PropTypes.string),
  }),
};

export default ScaleTable;
