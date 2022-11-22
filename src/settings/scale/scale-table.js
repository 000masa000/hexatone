import { h } from 'preact';
import PropTypes from 'prop-types';

const ScaleTable = (props) => {
  const scale = [...(props.settings.scale || [])];
  const equiv_interval = scale.length ? scale.pop() : 0;
  scale.unshift(0);

  let degrees; {
    degrees = [...Array(scale.length).keys()];
   }
    
    let names;{
    names = props.settings.names || [];
  }

  let colors;
  if (props.settings.spectrum_colors) {
    colors = Array(scale.length).fill(props.settings.fundamental_color);
  } else {
    colors = props.settings.note_colors || [];
  }
  const rows = scale.map((x, i) => [x, degrees[i], names[i], colors[i]]);

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
        <th>Frequency Ratio | Cents</th>
        <th>Degree</th>
        <th>Name</th>
        <th>Color</th>
      </thead>
      <tbody>
        <tr>
          <td><em>1/1</em> = <em>0 cents</em></td>
          <td>
            <input type="text" disabled={editable_labels}
                   name="degree0" value={degrees[0]} onChange={nameChange}
                   aria-label="pitch degree 0"
            />
          </td>
          <td>
            <input type="text" disabled={editable_labels}
                   name="name0" value={names[0]} onChange={nameChange}
                   aria-label="pitch name 0"
            />
          </td>
          <td>
            <input type="color" disabled={editable_colors}
                   name="color0" value={colors[0]} onChange={colorChange}
                   aria-label="pitch color 0"
            />
          </td>
        </tr>
        {rows.slice(1).map(([freq, degree, name, color], i) => (
          <tr>
            <td>
              <input type="text" name={`scale${i}`}
                     value={freq} onChange={scaleChange}
                     aria-label={`pitch value ${i}`}
              />
            </td>
            <td>
              <input type="text"
                     name={`degree${i + 1}}`} value={degree}
                     aria-label={`pitch degree ${i}`}
              />
            </td>
            <td>
              <input type="text" disabled={editable_labels}
                     name={`name${i+1}`} value={name}
                     onChange={nameChange}
                     aria-label={`pitch name ${i}`}
              />
            </td>
            <td>
              <input type="color" disabled={editable_colors}
                     name={`color${i+1}`} value={color}
                     onChange={colorChange}
                     aria-label={`pitch color ${i}`}
              />
            </td>
          </tr>
          ))}
          <tr>
            <td>
              <input type="text"
                    name={`scale${scale.length - 1}`}
                    value={equiv_interval} onChange={scaleChange}
                    aria-label={`pitch ${scale.length - 1}`}
              />
            </td>
            <td>
              <input type="text"
                  value={scale.length}
              />
            </td>
            <td><em>{names[0]}</em></td>
            <td><input type="color" disabled={true} value={colors[0]} aria-label={`pitch color 0`}/></td>
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
