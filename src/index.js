import { h, render } from 'preact';
import "regenerator-runtime/runtime";
import {options} from 'preact';
import PropTypes from 'prop-types';
import App from './app.js';

if (process.env.NODE_ENV !== "production") {
  // installs global prop type checking for app preact components
  options.vnode = vnode => {
    let Component = vnode.type;
    if (Component && Component.propTypes) {
      PropTypes.checkPropTypes(
        Component.propTypes,
        vnode.props
      );
    }
  };
}

render(<App />, document.getElementById('application'));
