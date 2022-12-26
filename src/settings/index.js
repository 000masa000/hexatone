import { h } from 'preact';
import Scale from './scale';
import SampleSynth from './sample';
import MIDIio from './midi';
import Layout from './layout';
import Presets from './presets';
import Info from './info';
import './settings.css';

const Settings = ({presetChanged, presets, settings, onChange, onImport, midi, instruments}) => (
  <form>
    <fieldset><legend>Tuning</legend>
     <label>   
        <Presets onChange={presetChanged} presets={presets} />
      </label>
    </fieldset>
    <Info onChange={onChange} settings={settings} />
    <Scale onChange={onChange} settings={settings} onImport={onImport}/>
    <Layout onChange={onChange} settings={settings} />
    <SampleSynth onChange={onChange} settings={settings}
      instruments={instruments} />
    <MIDIio onChange={onChange} settings={settings}
                    midi={midi} />
  </form>
);

export default Settings;
