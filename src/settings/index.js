import { h } from 'preact';

import Presets from './presets';
import Info from './info';
import Scale from './scale';
import Layout from './layout';
import SampleSynth from './sample';
import MIDIio from './midi';

import './settings.css';

// set up the fieldset to enter the app settings 
const Settings = ({presetChanged, presets, settings, onChange, onImport, midi, instruments}) => (
  <form>
    <fieldset><legend><b>Tuning</b></legend>
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
