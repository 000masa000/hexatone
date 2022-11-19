import { h, render } from 'preact';

const Info = (props) => (
  <fieldset><legend>Name</legend>
    <label>     
      <input name="name" type="text" width="100%"
             value={props.settings.name}
             onChange={(e) => props.onChange(e.target.name, e.target.value)}/>
    </label>
    <label>
      Description
      <textarea name="description"
             value={props.settings.description}
             onChange={(e) => props.onChange(e.target.name, e.target.value)}/>
    </label>
  </fieldset>
);
export default Info;
