/*import { h } from 'preact';
import { shallow } from 'enzyme';
import { act } from 'preact/test-utils';
import App, {Loading} from './app';
import Keyboard from './keyboard';
import Settings from './settings';
import "web-audio-test-api";
import moxios from "moxios";

jest.mock('./sample_synth');
import {create_sample_synth} from './sample_synth';

describe("The application", () => {
  const synth_promise = Promise.resolve({});
  beforeEach(() => {
    create_sample_synth.mockReturnValue(synth_promise);
    moxios.install();
  });

  afterEach(() => {
    moxios.uninstall();
  });
  describe("the settings popup", () => {
    describe("the settings are active", () => {
      it("there is a class applied to the top element", () => {
        const c = shallow(<App/>);
        expect(c.prop("className")).toBe("show");
      });
      // This fails since values are parsed from query string.
      it.skip("should mark the keyboard inactive", () => {
        const c = shallow(<App/>);
        return synth_promise.then(() => {
          expect(c.find(Keyboard).prop("active")).toBe(false);
        });
      });
    });
    describe("the settings are inactive", () => {
      it("there is a class applied to the top element", () => {
        const c = shallow(<App/>);
        c.find("button#sidebar-button").simulate("click");
        expect(c.prop("className")).toBe("hide");
      });
    });
  });
  describe("the loading indicator", () => {
    it("should not render if the loading semaphore is inactive.", () => {
      const c = shallow(<App/>);
      const synth = Promise.resolve({});
      global.navigator.requestMIDIAccess = () => synth;
      create_sample_synth.mockReturnValue(synth);
      return synth.then(() => {
        expect(c.exists(Loading)).toBe(false);
      });
    });
    it("should render if the loading semaphore is active.", () => {
      const dummy = new Promise(()=>{});
      global.navigator.requestMIDIAccess = () => dummy;
      const c = shallow(<App/>);
      expect(c.exists(Loading)).toBe(true);
    });
  });
  describe("Loading available MIDI devices.", () => {
    it("should load the devices if midi access is available.", () => {
      const dummy = Promise.resolve({ mock : true });
      global.navigator.requestMIDIAccess = () => dummy;
      const c = shallow(<App/>);
      return dummy.then(() => {
        expect(c.find(Settings).props().midi).toStrictEqual({ mock : true });
      });
    });
  });
});
*/