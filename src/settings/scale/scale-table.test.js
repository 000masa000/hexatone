import { h } from 'preact';
import { shallow, mount } from 'enzyme';
import { act } from 'preact/test-utils';

import ScaleTable from './scale-table';

const scale_values = ["100", "200", "300", "400", "500", "600", "700", "800", "900", "1000", "1100", "1200"];
const scale_labels = ["C", "C#", "D", "D#", "E", "F", "F#", "G", "G#", "A", "A#", "B"];
const scale_colors = ["#ffffff", "#7b7b7b", "#ffffff", "#7b7b7b", "#ffffff", "#ffffff", "#7b7b7b", "#ffffff", "#7b7b7b", "#ffffff", "#7b7b7b", "#ffffff"];
describe("The scale table", () => {
  describe("Key labels", () => {
    describe("Using enumerated key labels", () => {
      const settings = {
        scale: scale_values,
        key_labels: "enumerate",
        spectrum_colors: true,
        fundamental_color: "#abcdef",
      };
      it("should disable all the label inputs and set the values to the generated values", () => {
        const c = shallow(<ScaleTable settings={settings} onChange={()=>{}}/>);
        const input = c.find('input[name="name4"]');
        expect(input.prop("disabled")).toBe(true);
        expect(input.prop("value")).toBe(4);
      });
    });
    describe("Using blank key labels", () => {
      const settings = {
        scale: scale_values,
        key_labels: "no_labels",
        spectrum_colors: true,
        fundamental_color: "#abcdef",
      };
      it("should disable all the label inputs and set the value blank", () => {
        const c = shallow(<ScaleTable settings={settings} onChange={()=>{}}/>);
        const input = c.find('input[name="name4"]');
        expect(input.prop("disabled")).toBe(true);
        expect(input.prop("value")).toBe("");
      });
    });
    describe("Using explicit key labels", () => {
      const settings = {
        scale: scale_values,
        key_labels: "note_names",
        note_names: scale_labels,
        spectrum_colors: true,
        fundamental_color: "#abcdef",
      };
      it("should enable all the label inputs and populate values.", () => {
        const c = shallow(<ScaleTable settings={settings} onChange={()=>{}}/>);
        const input = c.find('input[name="name4"]');
        expect(input.prop("disabled")).toBe(false);
        expect(input.prop("value")).toBe(scale_labels[4]);
      });
      it("should update a value", () => {
        const mockChange = jest.fn();
        const c = shallow(<ScaleTable settings={settings} onChange={mockChange}/>);
        const input = c.find('input[name="name3"]');
        const event = { target: { value: 'X', name: 'name3'}};
        input.prop('onChange')(event);

        const expected = [...scale_labels];
        expected[3] = 'X';

        expect(mockChange.mock.calls.length).toBe(1);
        expect(mockChange.mock.calls[0][0]).toBe("note_names");
        expect(mockChange.mock.calls[0][1]).toStrictEqual(expected);
      });
    });
  });

  describe("Scale colors", () => {
    describe("Using explicit colors", () => {
      const settings = {
        scale: scale_values,
        key_labels: "no_labels",
        spectrum_colors: false,
        note_colors: scale_colors,
      };
      it("should enable all the color inputs and populate values.", () => {
        const c = shallow(<ScaleTable settings={settings} onChange={()=>{}}/>);
        const input = c.find('input[name="color3"]');
        expect(input.prop("disabled")).toBe(false);
        expect(input.prop("value")).toBe(scale_colors[3]);
      });
      it("should update a value", () => {
        const mockChange = jest.fn();
        const c = shallow(<ScaleTable settings={settings} onChange={mockChange}/>);
        const input = c.find('input[name="color3"]');
        const event = { target: { value: '#fedcba', name: 'color3'}};
        input.prop('onChange')(event);

        const expected = [...scale_colors];
        expected[3] = '#fedcba';

        expect(mockChange.mock.calls.length).toBe(1);
        expect(mockChange.mock.calls[0][0]).toBe("note_colors");
        expect(mockChange.mock.calls[0][1]).toStrictEqual(expected);
      });
    });

    describe("Using spectrum colors", () => {
      it("should disable all the color inputs and show the generated values.", () => {
        const settings = {
          scale: scale_values,
          key_labels: "no_labels",
          spectrum_colors: true,
          fundamental_color: "#abcdef",
        };
        const c = shallow(<ScaleTable settings={settings} onChange={()=>{}}/>);
        const colors = c.find('input[type="color"]');
        expect(colors.at(0).prop("disabled")).toBe(true);
        expect(colors.at(0).prop("value")).toBe("#abcdef");
        expect(colors.at(1).prop("value")).toBe("#abcdef");
        expect(colors.at(2).prop("value")).toBe("#abcdef");
        expect(colors.at(3).prop("value")).toBe("#abcdef");
        expect(colors.at(4).prop("value")).toBe("#abcdef");
        expect(colors.at(5).prop("value")).toBe("#abcdef");
        expect(colors.at(6).prop("value")).toBe("#abcdef");
        expect(colors.at(7).prop("value")).toBe("#abcdef");
        expect(colors.at(8).prop("value")).toBe("#abcdef");
        expect(colors.at(9).prop("value")).toBe("#abcdef");
        expect(colors.at(10).prop("value")).toBe("#abcdef");
        expect(colors.at(11).prop("value")).toBe("#abcdef");
      });
    });
  });

  describe("The scale steps.", () => {
    const settings = {
      scale: scale_values,
      key_labels: "note_names",
      note_names: scale_labels,
      spectrum_colors: false,
      note_colors: scale_colors,
    };
    const c = shallow(<ScaleTable settings={settings} onChange={()=>{}}/>);
    it("should render each of the steps in an input", () => {
      expect(c.find('tbody').children()).toHaveLength(scale_values.length + 1);
      const third = c.find('tr').at(2).find('input');
      expect(third).toHaveLength(3);
      expect(third.at(0).prop("name")).toBe("scale1");
      expect(third.at(0).prop("value")).toBe(scale_values[1]);
      expect(third.at(1).prop("name")).toBe("name2");
      expect(third.at(1).prop("value")).toBe(scale_labels[2]);
      expect(third.at(2).prop("name")).toBe("color2");
      expect(third.at(2).prop("value")).toBe(scale_colors[2]);
    });
    it("should render the root without a scale input.", () => {
      const first = c.find('tr').first().find('input');
      expect(first).toHaveLength(2);
      expect(first.at(0).prop("name")).toBe("name0");
      expect(first.at(0).prop("value")).toBe(scale_labels[0]);
      expect(first.at(1).prop("name")).toBe("color0");
      expect(first.at(1).prop("value")).toBe(scale_colors[0]);
    });
    it("should render the last item with only the scale input and a disabled color", () => {
      const last = c.find('tr').last().find('input');
      expect(last).toHaveLength(2);
      expect(last.at(0).prop("name")).toBe("scale11");
      expect(last.at(0).prop("value")).toBe(scale_values[11]);
      expect(last.at(1).prop("value")).toBe(scale_colors[0]);
      expect(last.at(1).prop("disabled")).toBe(true);
    });
    it("should update a value", () => {
      const mockChange = jest.fn();
      const c = shallow(<ScaleTable settings={settings} onChange={mockChange}/>);
      const input = c.find('input[name="scale11"]');
      const event = { target: { value: '1100.7', name: 'scale11'}};
      input.prop('onChange')(event);

      const expected = [...scale_values];
      expected[11] = '1100.7';

      expect(mockChange.mock.calls.length).toBe(1);
      expect(mockChange.mock.calls[0][0]).toBe("scale");
      expect(mockChange.mock.calls[0][1]).toStrictEqual(expected);
    });
  });
});
