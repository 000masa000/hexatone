import { h } from 'preact';
import { Fragment } from 'preact/compat';
import PropTypes from 'prop-types';

const MidiIn = (props) => (
  <>
    <label>
      MIDI Channel
      <select value={props.settings.midiin_channel}
              name="midiin_channel"
              onChange={(e) => props.onChange(e.target.name, parseInt(e.target.value))}>
        <option>Location of the scale fundamental (1/1 = C4 = note 60):</option>
        {[...Array(16).keys()].map(i => <option value={i}>{i + 1}</option>)}
      </select>
    </label>
    <label>
      MIDI Mapping
      <select value={props.settings.midiin_mapping}
              name="midiin_mapping"
        onChange={(e) => props.onChange(e.target.name, e.target.value)}>
        <option>Scale layout across 16 MIDI channels:</option>
        <option value="multichannel">multichannel: one cycle/channel, starting on note 60</option>
        <option value="sequential">sequential: using all notes 0-127</option>
      </select>
    </label>
  </>
);

MidiIn.propTypes = {
  settings: PropTypes.shape({  
    midiin_channel: PropTypes.number,
    midiin_mapping: PropTypes.string
  }).isRequired,
  midi: PropTypes.object,
  onChange: PropTypes.func.isRequired,
};

export default MidiIn;
