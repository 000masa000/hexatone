import { h } from 'preact';
import { Fragment } from 'preact/compat';
import PropTypes from 'prop-types';

const MidiSelect = (props) => (
  <select name="midi_device" onChange={(e) => props.onChange(e.target.name, e.target.value)}>
    <option>Output Devices:</option>
    {Array.from(props.midi.outputs.values()).map(m => (
      <option value={m.id}>{m.name}</option>
    ))}
  </select>
);

const Midi = (props) => (
  <>
    <label>
      Port
      <MidiSelect value={props.settings.midi}
                  midi={props.midi}
                  onChange={props.onChange}/>
    </label>
    <label>
      MIDI Channel
      <select value={props.settings.midi_channel}
              name="midi_channel"
              onChange={(e) => props.onChange(e.target.name, parseInt(e.target.value))}>
        <option>Location of the scale fundamental (1/1 = C4 = note 60):</option>
        {[...Array(16).keys()].map(i => <option value={i}>{i + 1}</option>)}
      </select>
    </label>
    <label>
      MIDI Mapping
      <select value={props.settings.midi_mapping}
              name="midi_mapping"
        onChange={(e) => props.onChange(e.target.name, e.target.value)}>
        <option>Scale layout across 16 MIDI channels:</option>
        <option value="multichannel">multichannel: one cycle/channel, starting on note 60</option>
        <option value="sequential">sequential: using all notes 0-127</option>
      </select>
    </label>
    <label>
      Velocity
      <input name="midi_velocity" type="number"
             value={props.settings.midi_velocity}
             step="1" min="0" max="127"
             onChange={(e) => props.onChange(e.target.name, parseInt(e.target.value))} />
    </label>
  </>
);

Midi.propTypes = {
  settings: PropTypes.shape({  
    midi_device: PropTypes.string,
    midi_channel: PropTypes.number,
    midi_mapping: PropTypes.string,   
    midi_velocity: PropTypes.number,
  }).isRequired,
  midi: PropTypes.object,
  onChange: PropTypes.func.isRequired,
};

export default Midi;
