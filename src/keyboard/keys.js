import { calculateRotationMatrix, applyMatrixToPoint } from './matrix';
import Point from './point';
import Euclid from './euclidean';
import { rgb, HSVtoRGB, HSVtoRGB2, nameToHex, hex2rgb, rgb2hsv, getContrastYIQ, getContrastYIQ_2, rgbToHex } from './color_utils';
import { WebMidi } from 'webmidi';
import { midi_in } from '../settings/midi/midiin';
import { keymap, notes_played } from '../midi_synth';
import { mtsToMidiFloat, centsToMTS } from '../midi_synth';
import { scalaToCents } from '../settings/scale/parse-scale';

class Keys {
  constructor(canvas, settings, synth, typing,) {
    this.settings = {
      hexHeight: settings.hexSize * 2,
      hexVert: settings.hexSize * 3 / 2,
      hexWidth: Math.sqrt(3) * settings.hexSize,
      gcd: Euclid(settings.rSteps, settings.urSteps), // calculates a array with 3 values: the GCD of the layout tiling (smallest step available); Bézout Coefficients to be applied to rSteps and urSteps to obtain GCD
      offset: getOffset(settings.reference_degree, settings.scale),
      ...settings,
    };
    this.synth = synth; // use built-in sounds or send MIDI out to an external synth
    this.typing = typing;
    this.bend = 0;
    this.state = {
      canvas,
      context: canvas.getContext('2d'),
      sustain: false,
      sustainedNotes: [],
      pressedKeys: new Set(),
      activeHexObjects: [],
      isTouchDown: false,
      isMouseDown: false
    };
    this.mts_tuning_map = mtsTuningMap(this.settings.sysex_type, this.settings.device_id, this.settings.tuning_map_number, this.settings.tuning_map_degree0, this.settings.scale, this.settings.name, this.settings.equivInterval, this.settings.fundamental, this.settings.offset); // generate the tuning map sysex data
    
    // Set up resize handler
    window.addEventListener('resize', this.resizeHandler, false);
    window.addEventListener('orientationchange', this.resizeHandler, false);

    //... and give it an initial call, which does the initial draw
    this.resizeHandler();

    // Set up keyboard, touch and mouse event handlers
    if (this.typing) {
      window.addEventListener("keydown", this.onKeyDown, false);
      window.addEventListener("keyup", this.onKeyUp, false);
    };
    this.state.canvas.addEventListener("touchstart", this.handleTouch, false);
    this.state.canvas.addEventListener("touchend", this.handleTouch, false);
    this.state.canvas.addEventListener("touchmove", this.handleTouch, false);
    this.state.canvas.addEventListener("mousedown", this.mouseDown, false);
    this.state.canvas.addEventListener("mouseup", this.mouseUp, false);
   
   /* 
    console.log("midiin_device:", this.settings.midiin_device);
    console.log("midiin_channel:", this.settings.midiin_channel);
    console.log("midi_device:", this.settings.midi_device);
    console.log("midi_channel:", this.settings.midi_channel);
    console.log("midi_mapping:", this.settings.midi_mapping); */

    
    if (sessionStorage.getItem("sysex_auto") == "true") {
      this.settings.sysex_auto = false;
      this.settings.sysex_auto = true;
    } else {
      this.settings.sysex_auto = false;
    };

    if ((this.settings.sysex_auto) && (this.settings.midi_device !== "OFF") && (this.settings.midi_channel >= 0)) {
      this.midiout_data = WebMidi.getOutputById(this.settings.midi_device);
      this.mtsSendMap();
    };

    if ((this.settings.midiin_device !== "OFF") && (this.settings.midiin_channel >= 0)) { // get the MIDI noteons and noteoffs to play the internal sounds
    
      this.midiin_data = WebMidi.getInputById(this.settings.midiin_device);
      
      this.midiin_data.addListener("noteon", e => {
        console.log("(input) note_on", e.message.channel, e.note.number, e.note.rawAttack);
        this.midinoteOn(e);        
      });

      this.midiin_data.addListener("noteoff", e => {
        console.log("(input) note_off", e.message.channel, e.note.number, e.note.rawAttack);
        this.midinoteOff(e);        
      });

      if ((this.settings.midi_device !== "OFF") && (this.settings.midi_channel >= 0)) { // forward other MIDI data through to output
        this.midiout_data = WebMidi.getOutputById(this.settings.midi_device);
        
        if (this.settings.midi_mapping == "multichannel") { // in multichannel output replicate controlchange and channel pressure on all channels

          this.midiin_data.addListener("controlchange", e => {
            console.log("Control Change (thru on all channels)", e.message.dataBytes[0], e.message.dataBytes[1]);
            this.midiout_data.sendControlChange(e.message.dataBytes[0], e.message.dataBytes[1], {  });
          });

          this.midiin_data.addListener("channelaftertouch", e => {
            console.log("Channel Pressure (thru on all channels) ", e.message.dataBytes[0]);
            this.midiout_data.sendChannelAtertouch(e.message.dataBytes[0] / 128.0, {});
          });

          this.midiin_data.addListener("pitchbend", e => { // TODO decide what multichannel pitchbend should do
            console.log("Pitch Bend (thru)", e.message.dataBytes[0], e.message.dataBytes[1]);
            this.midiout_data.sendPitchBend((2.0 * ((e.message.dataBytes[0] / 16384.0) + (e.message.dataBytes[1] / 128.0))) - 1.0, {  });
          });

          this.midiin_data.addListener("keyaftertouch", e => {
            let channel_offset = e.message.channel - 1 - this.settings.midiin_channel; // calculates the difference between selected central MIDI Input channel and the actual channel being sent and uses this to offset by up to +/- 4 equaves
            channel_offset = ((channel_offset + 20) % 8) - 4;
            let channel = ((e.message.channel + channel_offset + 15) % 16) + 1; // apply offset to output channel for key pressure
            this.midiout_data.sendKeyAftertouch(e.message.dataBytes[0], e.message.dataBytes[1] / 128.0, { channels: (channel) });
            console.log("Key Pressure MultiCh", channel, e.message.dataBytes[0], e.message.dataBytes[1]);
          });
            
        } else { // in single-channel output send controlchange and channel pressure only on selected channel

          this.midiin_data.addListener("controlchange", e => {
            console.log("(thru) Control Change", this.settings.midi_channel + 1, e.message.dataBytes[0], e.message.dataBytes[1]);
            this.midiout_data.sendControlChange(e.message.dataBytes[0], e.message.dataBytes[1], { channels: (this.settings.midi_channel + 1) });
          });

          this.midiin_data.addListener("channelaftertouch", e => {
            console.log("Channel Aftertouch (thru)", this.settings.midi_channel + 1, e.message.dataBytes[0]);
            this.midiout_data.sendChannelAftertouch(e.message.dataBytes[0] / 128.0, { channels: (this.settings.midi_channel + 1) });
          });

          if (this.settings.midi_mapping == "sequential") { // handling of sequential and mts output of key pressure

            this.midiin_data.addListener("pitchbend", e => { // TODO decide what multichannel pitchbend should do
              console.log("Pitch Bend (thru)", e.message.dataBytes[0], e.message.dataBytes[1]);
              this.midiout_data.sendPitchBend((2.0 * ((e.message.dataBytes[0] / 16384.0) + (e.message.dataBytes[1] / 128.0))) - 1.0, { channels: (this.settings.midi_channel + 1) });
            });
            
            this.midiin_data.addListener("keyaftertouch", e => {              
              let channel_offset = e.message.channel - 1 - this.settings.midiin_channel; // calculates the difference between selected central MIDI Input channel and the actual channel being sent and uses this to offset by up to +/- 4 equaves
              channel_offset = ((channel_offset + 20) % 8) - 4;
              let note_offset = channel_offset * this.settings.equivSteps;
              let note = (e.message.dataBytes[0] + note_offset) % 128; // matches note cycling in midi_synth/index,js
              this.midiout_data.sendKeyAftertouch(note, e.message.dataBytes[1] / 128.0, { channels: (this.settings.midi_channel + 1) });
              console.log("Key Pressure Seq", this.settings.midi_channel + 1, note, e.message.dataBytes[1]);
            }); 

          } else if ((this.settings.midi_mapping == "MTS1") || (this.settings.midi_mapping == "MTS2")) {

            this.midiin_data.addListener("keyaftertouch", e => {                
              let note = e.message.dataBytes[0] + (128 * (e.message.channel - 1)); // finds index of stored MTS data
              //console.log("note", note);
              //console.log("keymap", keymap[note][0]);
              this.midiout_data.sendKeyAftertouch(keymap[note][0], e.message.dataBytes[1] / 128.0, { channels: (this.settings.midi_channel + 1) });
              console.log("Key Pressure MTS", this.settings.midi_channel + 1, keymap[note][0], e.message.dataBytes[1]);
            });
            
            this.midiin_data.addListener("pitchbend", e => { // pitchbend is processed as MTS real-time data allowing every note a different bend radius
              this.mtsBend(e);       
            });            
          };
        };
      };
    };
  }; // end of constructor

  deconstruct = () => {
    for (let hex of this.state.activeHexObjects) {
      hex.noteOff();
    };
    for (let hex of this.state.sustainedNotes) {
      hex.noteOff();
    };

    window.removeEventListener('resize', this.resizeHandler, false);
    window.removeEventListener('orientationchange', this.resizeHandler, false);

    // Keyboard, touch and mouse event handlers
    if (this.typing) {
      window.removeEventListener("keydown", this.onKeyDown, false);
      window.removeEventListener("keyup", this.onKeyUp, false);
    };
    this.state.canvas.removeEventListener("touchstart", this.handleTouch, false);
    this.state.canvas.removeEventListener("touchend", this.handleTouch, false);
    this.state.canvas.removeEventListener("touchmove", this.handleTouch, false);
    this.state.canvas.removeEventListener("mousedown", this.mouseDown, false);
    this.state.canvas.removeEventListener("mouseup", this.mouseUp, false);
    this.state.canvas.removeEventListener("mousemove", this.mouseActive, false);

    if (this.midiin_data) {
      this.midiin_data.removeListener("noteon");
      this.midiin_data.removeListener("noteoff");
      this.midiin_data.removeListener("keyaftertouch");
      this.midiin_data.removeListener("controlchange");
      this.midiin_data.removeListener("channelaftertouch");
      this.midiin_data.removeListener("pitchbend");
      this.midiin_data = null;
    };
    
    if (this.midiout_data) {
      this.midiout_data = null;
      };
  };

  mtsSendMap = () => { // send the tuning map
    let sysex = this.mts_tuning_map;
    console.log("mtsMap: ", sysex);
    if (this.midiout_data) {
      if (this.settings.sysex_type == "127") {
        for (let i = 0; i < 128; i++) {
          this.midiout_data.sendSysex([sysex[i].shift()], sysex[i]);
        };
      } else if (this.settings.sysex_type == "126") {
        this.midiout_data.sendSysex([sysex.shift()], sysex);
      };
    };
  };

  mtsBend = (e) => { // generates scale specific one scale degree last note played pitch bend
    let bend = 0;
    console.log("Pitchbend: ", e.message.dataBytes[0], e.message.dataBytes[1]);
    bend = ((e.message.dataBytes[0] + (128 * e.message.dataBytes[1])) - 8192);
    let last_noteon = notes_played[notes_played.length - 1];
    if (bend < 0) {
      bend = bend / 8192; // set bend down between 0 and -1
    } else {
      bend = bend / 8191; // set bend up between 0 and 1
    };

    this.bend = bend;
    //console.log("MTSbend: ", bend);

    if (last_noteon) {
      //console.log("last_noteon", last_noteon);
      let bend_up = keymap[last_noteon][5]; // get data from most recently played note
      let bend_down = keymap[last_noteon][4];
      let mts_current = [keymap[last_noteon][0], keymap[last_noteon][1], keymap[last_noteon][2], keymap[last_noteon][3]];
      //console.log("keymap[current]", keymap[last_noteon]);

      if (bend < 0) {
        bend = bend_down * bend; // set bend down between 0 and -1
      } else {
        bend = bend_up * bend; // set bend up between 0 and 1
      };

      if ((this.settings.midi_mapping == "MTS1") || (this.settings.midi_mapping == "MTS2")) {
        //console.log("Keys_MTSBend", bend);
        let mts_bend = centsToMTS(mtsToMidiFloat([mts_current[1], mts_current[2], mts_current[3]]), bend);
        //console.log("mtsBend-message", mts_current[0], mts_bend[0], mts_bend[1], mts_bend[2]);
     
        if ((this.settings.midi_device !== "OFF") && (this.settings.midi_channel >= 0)) { // forward other MIDI data through to output
          this.midiout_data = WebMidi.getOutputById(this.settings.midi_device);
          this.midiout_data.sendSysex([127], [127, 8, 2, 0, 1, mts_current[0], mts_bend[0], mts_bend[1], mts_bend[2]]); // generates single note pitchbend
        };
      };
    };
  };

  midinoteOn = (e) => { // TODO make the display calculation relative to angle of hex, and write a separate function
    let bend = 0;
    if (this.bend) {
      bend = this.bend;
    };
    //console.log("note_on-bend", bend);
    let steps = e.note.number - 60;
    let channel_offset = e.message.channel - 1 - this.settings.midiin_channel;
    channel_offset = ((channel_offset + 20) % 8) - 4;
    //console.log("transposition (in equaves)", channel_offset);
    let steps_offset = channel_offset * this.settings.equivSteps;
    steps = steps + steps_offset;
    let note_played = e.note.number + (128 * (e.message.channel - 1)); // allows note and channel to be encoded and recovered for MTS key pressure
    let velocity_played = e.note.rawAttack;

    let rSteps_count = Math.round(steps / this.settings.rSteps); // how many steps to the right to get near the played note
    let rSteps_to_steps = this.settings.rSteps * rSteps_count;
    let urSteps_count = Math.round((steps - rSteps_to_steps) / this.settings.urSteps);
    let urSteps_to_steps = this.settings.urSteps * urSteps_count;
    let gcdSteps_count = Math.floor((steps - rSteps_to_steps - urSteps_to_steps) / this.settings.gcd[0]);    
    let gcdSteps_to_steps = gcdSteps_count * this.settings.gcd[0];
    let remainder = steps - rSteps_to_steps - urSteps_to_steps - gcdSteps_to_steps;
    if (remainder == 0) {
      let coords = new Point(rSteps_count + (gcdSteps_count * this.settings.gcd[1]), urSteps_count + (gcdSteps_count * this.settings.gcd[2]));
      let hex = this.hexOn(coords, note_played, velocity_played, bend);
      this.state.activeHexObjects.push(hex);
    };
  };

  midinoteOff = (e) => {
    let steps = e.note.number - 60;
    let channel_offset = e.message.channel - 1 - this.settings.midiin_channel;
    channel_offset = ((channel_offset + 20) % 8) - 4;
    let steps_offset = channel_offset * this.settings.equivSteps;
    steps = steps + steps_offset;

    let rSteps_count = Math.round(steps / this.settings.rSteps); // how many steps to the right to get near the played note, as before
    let rSteps_to_steps = this.settings.rSteps * rSteps_count;
    let urSteps_count = Math.round((steps - rSteps_to_steps) / this.settings.urSteps);
    let urSteps_to_steps = this.settings.urSteps * urSteps_count;
    let gcdSteps_count = Math.floor((steps - rSteps_to_steps - urSteps_to_steps) / this.settings.gcd[0]);
    let gcdSteps_to_steps = gcdSteps_count * this.settings.gcd[0];
    let remainder = steps - rSteps_to_steps - urSteps_to_steps - gcdSteps_to_steps;
    if (remainder == 0) {
      let coords = new Point(rSteps_count + (gcdSteps_count * this.settings.gcd[1]), urSteps_count + (gcdSteps_count * this.settings.gcd[2]));
      this.hexOff(coords);
      let hexIndex = this.state.activeHexObjects.findIndex(function (hex) {
        return coords.equals(hex.coords);
      });
      if (hexIndex != -1) {
        this.noteOff(this.state.activeHexObjects[hexIndex], e.note.rawAttack);
        this.state.activeHexObjects.splice(hexIndex, 1);
      };
    };
  };
  
  hexOn(coords, note_played, velocity_played, bend) {
    if (!bend) {
      bend = 0;
    };
    const [cents, pressed_interval, steps, equaves, equivSteps, cents_prev, cents_next] = this.hexCoordsToCents(coords);
    const [color, text_color] = this.centsToColor(cents, true, pressed_interval);
    this.drawHex(coords, color, text_color);
    let offset = this.settings.offset[1];
    const hex = this.synth.makeHex(coords, cents, steps, equaves, equivSteps, cents_prev, cents_next, note_played, velocity_played, bend, offset);
    hex.noteOn();
    return hex;
  };

  hexOff(coords) {
    const [cents, pressed_interval] = this.hexCoordsToCents(coords);
    const [color, text_color] = this.centsToColor(cents, false, pressed_interval);
    this.drawHex(coords, color, text_color);
  };

  noteOff(hex, release_velocity) {
    if (this.state.sustain) {
      this.state.sustainedNotes.push([hex, release_velocity]);
    } else {
      hex.noteOff(release_velocity);
    }
  };

  sustainOff() {
    this.state.sustain = false;
    for (let note = 0; note < this.state.sustainedNotes.length; note++) {
      this.noteOff(this.state.sustainedNotes[note][0], this.state.sustainedNotes[note][1]);
    }
    this.state.sustainedNotes = [];
    // tempAlert('Sustain Off', 900);
  };

  sustainOn() {
    this.state.sustain = true;
    // tempAlert('Sustain On', 900);
  }

  /**************** Event Handlers ****************/

  motionScan = () => {
    const { x1, x2, y1, y2, z1, z2, lastShakeCount, lastShakeCheck } = this.state.shake;
    let change = Math.abs(x1 - x2 + y1 - y2 + z1 - z2);

    if (change > this.state.sensitivity) {
      if (lastShakeCheck - lastShakeCount >= 3) {
        this.state.shake.lastShakeCount = this.state.shake.lastShakeCheck;
        if (this.state.sustain == true) {
          this.sustainOff();
        } else {
          this.sustainOn();
        }
      }
    };

    // Update new position
    this.state.shake.x2 = x1;
    this.state.shake.y2 = y1;
    this.state.shake.z2 = z1;
  };

  resizeHandler = () => {
    // Resize Inner and outer coordinates of canvas to preserve aspect ratio

    let newWidth = window.innerWidth;
    let newHeight = window.innerHeight;

    this.state.canvas.style.height = newHeight + 'px';
    this.state.canvas.style.width = newWidth + 'px';

    this.state.canvas.style.marginTop = (-newHeight / 2) + 'px';
    this.state.canvas.style.marginLeft = (-newWidth / 2) + 'px';

    this.state.canvas.width = newWidth;
    this.state.canvas.height = newHeight;

    // Find new centerpoint

    let centerX = newWidth / 2;
    let centerY = newHeight / 2;
    this.state.centerpoint = new Point(centerX, centerY);

    // Rotate about it

    if (this.state.rotationMatrix) {
      this.state.context.restore();
    }
    this.state.context.save();

    this.state.rotationMatrix = calculateRotationMatrix(-this.settings.rotation, this.state.centerpoint);

    // I don't know why these need to be the opposite sign of each other.
    let m = calculateRotationMatrix(this.settings.rotation, this.state.centerpoint);
    this.state.context.setTransform(m[0], m[1], m[2], m[3], m[4], m[5]);

    // Redraw Grid

    this.drawGrid();
  };

  onKeyDown = (e) => {
    e.preventDefault();
    //console.log("key", e.code, this.settings.keyCodeToCoords[e.code]);
    if (e.repeat) {
      return;
    } else if (e.code == "Space") {
      this.sustainOn();
    } else if (!this.state.isMouseDown && !this.state.isTouchDown
      && (e.code in this.settings.keyCodeToCoords)
      && !this.state.pressedKeys.has(e.code)) {
      this.state.pressedKeys.add(e.code);
      let coords = this.settings.keyCodeToCoords[e.code];
      let hex = this.hexOn(coords);
      this.state.activeHexObjects.push(hex);
    }
  };

  onKeyUp = (e) => {
    if (e.code == "Space") {
      this.sustainOff();
    } else if (!this.state.isMouseDown && !this.state.isTouchDown
      && (e.code in this.settings.keyCodeToCoords)) {
      if (this.state.pressedKeys.has(e.code)) {
        this.state.pressedKeys.delete(e.code);
        let coords = this.settings.keyCodeToCoords[e.code];
        this.hexOff(coords);
        let hexIndex = this.state.activeHexObjects.findIndex(function (hex) {
          return coords.equals(hex.coords);
        });
        if (hexIndex != -1) {
          this.noteOff(this.state.activeHexObjects[hexIndex]);
          this.state.activeHexObjects.splice(hexIndex, 1);
        }
      }
    }
  };

  mouseUp = (e) => {
    this.state.isMouseDown = false;

    if (this.state.pressedKeys.size != 0 || this.state.isTouchDown) {
      return;
    }
    this.state.canvas.removeEventListener("mousemove", this.mouseActive);
    if (this.state.activeHexObjects.length > 0) {
      this.hexOff(this.state.activeHexObjects[0].coords);
      this.noteOff(this.state.activeHexObjects[0]);
      this.state.activeHexObjects.pop();
    }
  };

  mouseDown = (e) => {
    if (this.state.pressedKeys.size != 0 || this.state.isTouchDown) {
      return;
    }
    this.state.isMouseDown = true;
    this.state.canvas.addEventListener("mousemove", this.mouseActive, false);
    this.mouseActive(e);
  };

  mouseActive = (e) => {
    let coords = this.getPointerPosition(e);
    coords = this.getHexCoordsAt(coords);

    if (this.state.activeHexObjects.length == 0) {
      this.state.activeHexObjects[0] = this.hexOn(coords);
    } else {
      let first = this.state.activeHexObjects[0];
      if (!(coords.equals(first.coords))) {
        this.hexOff(first.coords);
        this.noteOff(first);
        this.state.activeHexObjects[0] = this.hexOn(coords);
      }
    }
  };

  getPointerPosition(e) {
    let parentPosition = this.getPosition(e.currentTarget);
    let xPosition = e.clientX - parentPosition.x;
    let yPosition = e.clientY - parentPosition.y;
    return new Point(xPosition, yPosition);
  };

  getPosition(element) {
    let xPosition = 0;
    let yPosition = 0;

    while (element) {
      xPosition += (element.offsetLeft - element.scrollLeft + element.clientLeft);
      yPosition += (element.offsetTop - element.scrollTop + element.clientTop);
      element = element.offsetParent;
    }
    return {
      x: xPosition,
      y: yPosition
    };
  };

  handleTouch = (e) => {
    e.preventDefault();
    if (this.state.pressedKeys.size != 0 || this.state.isMouseDown) {
      this.state.isTouchDown = false;
      return;
    }
    this.state.isTouchDown = e.targetTouches.length != 0;

    for (let i = 0; i < this.state.activeHexObjects.length; i++) {
      this.state.activeHexObjects[i].release = true;
    };

    for (let i = 0; i < e.targetTouches.length; i++) {
      let coords = this.getHexCoordsAt(new Point(e.targetTouches[i].pageX - this.state.canvas.offsetLeft,
        e.targetTouches[i].pageY - this.state.canvas.offsetTop));
      let found = false;

      for (let j = 0; j < this.state.activeHexObjects.length; j++) {
        if (coords.equals(this.state.activeHexObjects[j].coords)) {
          this.state.activeHexObjects[j].release = false;
          found = true;
        }
      }
      if (!(found)) {
        let newHex = this.hexOn(coords);
        this.state.activeHexObjects.push(newHex);
      }
    };

    for (let i = this.state.activeHexObjects.length - 1; i >= 0; i--) {
      if (this.state.activeHexObjects[i].release) {
        this.hexOff(this.state.activeHexObjects[i].coords);
        this.noteOff(this.state.activeHexObjects[i]);
        // TODO yeahhhhh, don't mutate array while looping through it.
        this.state.activeHexObjects.splice(i, 1);
      }
    }
  };

  /**************** Rendering ****************/

  drawGrid() {
    let max = (this.state.centerpoint.x > this.state.centerpoint.y) ?
        this.state.centerpoint.x / this.settings.hexSize :
        this.state.centerpoint.y / this.settings.hexSize;
    max = Math.floor(max);
    for (let r = -max; r < max; r++) {
      for (let ur = -max; ur < max; ur++) {
        let coords = new Point(r, ur);
        this.hexOff(coords);
      }
    }
  };

  hexCoordsToScreen(hex) { /* Point */
    let screenX = this.state.centerpoint.x + hex.x * this.settings.hexWidth + hex.y * this.settings.hexWidth / 2;
    let screenY = this.state.centerpoint.y + hex.y * this.settings.hexVert;
    return (new Point(screenX, screenY));
  };

  drawHex(p, c, current_text_color) { /* Point, color */
    let context = this.state.context;
    let hexCenter = this.hexCoordsToScreen(p);

    // Calculate hex vertices

    let x = [];
    let y = [];
    for (let i = 0; i < 6; i++) {
      let angle = 2 * Math.PI / 6 * (i + 0.5);
      x[i] = hexCenter.x + this.settings.hexSize * Math.cos(angle);
      y[i] = hexCenter.y + this.settings.hexSize * Math.sin(angle);
    };

    // Draw filled hex

    context.beginPath();
    context.moveTo(x[0], y[0]);
    for (let i = 1; i < 6; i++) {
      context.lineTo(x[i], y[i]);
    }
    context.closePath();
    context.fillStyle = c;
    context.fill();

    // Save context and create a hex shaped clip

    context.save();
    context.beginPath();
    context.moveTo(x[0], y[0]);
    for (let i = 1; i < 6; i++) {
      context.lineTo(x[i], y[i]);
    }
    context.closePath();
    context.clip();

    // Calculate hex vertices outside clipped path

    let x2 = [];
    let y2 = [];
    for (let i = 0; i < 6; i++) {
      let angle = 2 * Math.PI / 6 * (i + 0.5);
      // TODO hexSize should already be a number
      x2[i] = hexCenter.x + (parseFloat(this.settings.hexSize) + 3) * Math.cos(angle);
      y2[i] = hexCenter.y + (parseFloat(this.settings.hexSize) + 3) * Math.sin(angle);
    };

    // Draw shadowed stroke outside clip to create pseudo-3d effect

    context.beginPath();
    context.moveTo(x2[0], y2[0]);
    for (let i = 1; i < 6; i++) {
      context.lineTo(x2[i], y2[i]);
    }
    context.closePath();
    context.strokeStyle = 'darkgray';
    context.lineWidth = 5;
    context.shadowBlur = 15;
    context.shadowColor = 'black';
    context.shadowOffsetX = 0;
    context.shadowOffsetY = 0;
    context.stroke();
    context.restore();

    // Add a clean stroke around hex

    context.beginPath();
    context.moveTo(x[0], y[0]);
    for (let i = 1; i < 6; i++) {
      context.lineTo(x[i], y[i]);
    }
    context.closePath();
    context.lineWidth = 1;
    context.lineJoin = 'round';
    context.strokeStyle = 'slategray';
    context.stroke();

    // Add note name and equivalence interval multiple

    context.save();
    context.translate(hexCenter.x, hexCenter.y);
    context.rotate(-this.settings.rotation);
    // hexcoords = p and screenCoords = hexCenter

    context.fillStyle = getContrastYIQ(current_text_color);
    context.font = "29pt Roboto HEJI2";
    context.textAlign = "center";
    context.textBaseline = "middle";

    let note = p.x * this.settings.rSteps + p.y * this.settings.urSteps;
    // TODO this should be parsed already
    let equivSteps = this.settings.scale.length;
    let equivMultiple = Math.floor(note / equivSteps);
    let reducedNote = note % equivSteps;
    if (reducedNote < 0) {
      reducedNote = equivSteps + reducedNote;
    };

    if (!this.settings.no_labels) {
      let name;
      if (this.settings.degree) {
        name = "" + reducedNote
      } else if (this.settings.note) {
        name = this.settings.note_names[reducedNote];
      } else if (this.settings.scala) {
        name = this.settings.scala_names[reducedNote];
      };

      if (name) {
        context.save();
        let scaleFactor = name.length > 3 ? 3.58 / name.length : 1;
        scaleFactor *= this.settings.hexSize / 46;
        context.scale(scaleFactor, scaleFactor);
        context.fillText(name, 0, 0);
        context.restore();
      }

      let scaleFactor = this.settings.hexSize / 50;
      context.scale(scaleFactor, scaleFactor);
      context.translate(12, -30);
      context.fillStyle = getContrastYIQ_2(current_text_color);
      context.font = "14pt Roboto HEJI2";
      context.textAlign = "center";
      context.textBaseline = "middle";
      context.fillText(equivMultiple, 0, 0);
    };

    context.restore();
  }

  centsToColor(cents, pressed, pressed_interval) {
    let returnColor;

    if (!this.settings.spectrum_colors) {
      if (typeof(this.settings.note_colors[pressed_interval]) === 'undefined') {
        returnColor = "#EDEDE4";
      } else {
        returnColor = this.settings.note_colors[pressed_interval];
      }

      let oldColor = returnColor;

      //convert color name to hex
      returnColor = nameToHex(returnColor);
      const current_text_color = returnColor;

      //convert the hex to rgb
      returnColor = hex2rgb(returnColor);

      //darken for pressed key
      if (pressed) {
        returnColor[0] -= 40;
        returnColor[1] -= 40;
        returnColor[2] -= 40;
      }

      return [rgb(returnColor[0], returnColor[1], returnColor[2]), current_text_color];
    };

    let fcolor = hex2rgb("#" + this.settings.fundamental_color);
    fcolor = rgb2hsv(fcolor[0], fcolor[1], fcolor[2]);

    let h = fcolor.h / 360;
    let s = fcolor.s / 100;
    let v = fcolor.v / 100;
    //let h = 145/360; // green
    let reduced = (cents / 1200) % 1;
    if (reduced < 0) reduced += 1;
    h = (reduced + h) % 1;

    v = (pressed) ? v - (v / 2) : v;

    returnColor = HSVtoRGB(h, s, v);

    //setup text color
    let tcolor = HSVtoRGB2(h, s, v);
    const current_text_color = rgbToHex(tcolor.red, tcolor.green, tcolor.blue);
    return [returnColor, current_text_color];
  };

  roundTowardZero(val) {
    if (val < 0) {
    return Math.ceil(val);
    }
    return Math.floor(val);
  };

  hexCoordsToCents(coords) {
    let distance = (coords.x * this.settings.rSteps) + (coords.y * this.settings.urSteps);
    let octs = this.roundTowardZero(distance / this.settings.scale.length);
    let octs_prev = this.roundTowardZero((distance - 1) / this.settings.scale.length);
    let octs_next = this.roundTowardZero((distance + 1) / this.settings.scale.length);
    let reducedSteps = distance % this.settings.scale.length;
    let reducedSteps_prev = (distance - 1) % this.settings.scale.length;
    let reducedSteps_next = (distance + 1) % this.settings.scale.length;
    let equivSteps = this.settings.equivSteps;
    if (reducedSteps < 0) {
      reducedSteps += this.settings.scale.length;
      octs -= 1;
    };
    if (reducedSteps_prev < 0) {
      reducedSteps_prev += this.settings.scale.length;
      octs_prev -= 1;
    };
    if (reducedSteps_next < 0) {
      reducedSteps_next += this.settings.scale.length;
      octs_next -= 1;
    };
    let cents = octs * this.settings.equivInterval + this.settings.scale[reducedSteps];
    let cents_prev = octs_prev * this.settings.equivInterval + this.settings.scale[reducedSteps_prev];
    let cents_next = octs_next * this.settings.equivInterval + this.settings.scale[reducedSteps_next];
    return [cents, reducedSteps, distance, octs, equivSteps, cents_prev, cents_next];
  };

  getHexCoordsAt(coords) {
    coords = applyMatrixToPoint(this.state.rotationMatrix, coords);
    let x = coords.x - this.state.centerpoint.x;
    let y = coords.y - this.state.centerpoint.y;

    let q = (x * Math.sqrt(3) / 3 - y / 3) / this.settings.hexSize;
    let r = y * 2 / 3 / this.settings.hexSize;

    q = Math.round(q);
    r = Math.round(r);

    let guess = this.hexCoordsToScreen(new Point(q, r));

    // This gets an approximation; now check neighbours for minimum distance

    let minimum = 100000;
    let closestHex = new Point(q, r);
    for (let qOffset = -1; qOffset < 2; qOffset++) {
      for (let rOffset = -1; rOffset < 2; rOffset++) {
        let neighbour = new Point(q + qOffset, r + rOffset);
        let diff = this.hexCoordsToScreen(neighbour).minus(coords);
        let distance = diff.x * diff.x + diff.y * diff.y;
        if (distance < minimum) {
          minimum = distance;
          closestHex = neighbour;
        }
      }
    };

    return (closestHex);
  }
};

export default Keys;

function getOffset(reference_degree, scale) {
  let offset = [0, 1];
  if (reference_degree > 0) {
    offset[0] = scale[reference_degree];
    offset[1] = 2 ** (offset[0] / 1200); // offset ratio
  };
  //console.log("reference_degree:", reference_degree);
  //console.log("offset_value (cents, ratio):", offset);
  
  return offset;
};

function mtsTuningMap(sysex_type, device_id, tuning_map_number, tuning_map_degree0, scale, name, equave, fundamental, offset) {
  if (sysex_type == "127") {
    let header = [127, device_id, 8, 2, tuning_map_number, 1]; // sysex real-time single-note tuning change of tuning map, 128 notes
    let fundamental_cents = 1200 * Math.log2(fundamental / 440);
    let degree_0_cents = fundamental_cents - offset[0];
    let map_offset = degree_0_cents - (100 * (tuning_map_degree0 - 69));
    let mts_data = [];

    for (let i = 0; i < 128; i++) {
      mts_data[i] = centsToMTS(tuning_map_degree0, scale[((i - tuning_map_degree0) + (128 * scale.length)) % scale.length] + map_offset + (equave * (Math.floor(((i - tuning_map_degree0) + (128 * scale.length)) / scale.length) - 128)));
    };

    let low = 0;
    //console.log("low", low, mts_data[low]);
    while ( (mts_data[low][0] < 0) && (low < 127) ) {
      low++;
    };

    for (let i = 0; i < low; i++) {
      if ((low < 128) && (mts_data[low][0] >= 0)) {
        mts_data[i] = mts_data[low]; // repeat the lowest possible note at the bottom end of the map as needed
      } else {
        mts_data[i] = [i, 0, 0]; // if data is invalid, load 12-edo
      };        
    };

    let high = 127;
    while ( (mts_data[high][0] > 127) && (high > 0) ) {
      high--;
    };
    while ( ((mts_data[high][0] == 127) && (mts_data[high][1] == 127) && (mts_data[high][2] == 127)) && (high >= 0) ) { // no F7 F7 F7 messages !
      high--;
    };

    for (let i = 127; i > high; i--) {
      if ( (high >= 0) && (mts_data[high] <= 127) && (mts_data[high] != [127, 127, 127]) ) {
        mts_data[i] = mts_data[high]; // repeat the highest possible note at the top of the map as needed
      } else {
        mts_data[i] = [i, 0, 0]; // if data is invalid, load 12-edo
      };
    };

    let sysex = [];
    for (let j = 0; j < 128; j++) {
      sysex[j] = [];
      for (let i = 0; i < header.length; i++) {
        sysex[j].push(header[i]);
      };
      sysex[j].push(j);
      sysex[j].push(mts_data[j][0]);
      sysex[j].push(mts_data[j][1]);
      sysex[j].push(mts_data[j][2]);
    };
    //console.log("mts-tuning_map", sysex);
    return sysex;

  } else if (sysex_type == "126") {
    let name_array = Array.from(name);
    let ascii_name = [];
    for (let i = 0; i < 16; i++) {
      let char = 32;
      if (i < name_array.length) {
        char = name_array[i].charCodeAt();
      };
      if ((char > 31) && (char < 128)) {
        ascii_name.push(char);
      } else {
        ascii_name.push(32); // pad with spaces if needed
      };
    };
    
    let header = [126, device_id, 8, 1, tuning_map_number]; // sysex real-time single-note tuning change of tuning map, 128 notes
    for (let i = 0; i < 16; i++) {
      header.push(ascii_name[i]);
    };
    let fundamental_cents = 1200 * Math.log2(fundamental / 440);
    let degree_0_cents = fundamental_cents - offset[0];
    let map_offset = degree_0_cents - (100 * (tuning_map_degree0 - 69));
    let mts_data = [];

    for (let i = 0; i < 128; i++) {
      mts_data[i] = centsToMTS(tuning_map_degree0, scale[((i - tuning_map_degree0) + (128 * scale.length)) % scale.length] + map_offset + (equave * (Math.floor(((i - tuning_map_degree0) + (128 * scale.length)) / scale.length) - 128)));
    }; 
    
    let low = 0;
    //console.log("low", low, mts_data[low]);
    while ( (mts_data[low][0] < 0) && (low < 127) ) {
      low++;
    };

    for (let i = 0; i < low; i++) {
      if ((low < 128) && (mts_data[low][0] >= 0)) {
        mts_data[i] = mts_data[low]; // repeat the lowest possible note at the bottom end of the map as needed
      } else {
        mts_data[i] = [i, 0, 0]; // if data is invalid, load 12-edo
      };        
    };

    let high = 127;
    while ( (mts_data[high][0] > 127) && (high > 0) ) {
      high--;
    };
    while ( ((mts_data[high][0] == 127) && (mts_data[high][1] == 127) && (mts_data[high][2] == 127)) && (high >= 0) ) { // no F7 F7 F7 messages !
      high--;
    };

    for (let i = 127; i > high; i--) {
      if ( (high >= 0) && (mts_data[high] <= 127) && (mts_data[high] != [127, 127, 127]) ) {
        mts_data[i] = mts_data[high]; // repeat the highest possible note at the top of the map as needed
      } else {
        mts_data[i] = [i, 0, 0]; // if data is invalid, load 12-edo
      };
    };

    let sysex = [];
    for (let i = 0; i < header.length; i++) {
      sysex.push(header[i]);
    };
    for (let i = 0; i < 128; i++) {
      sysex.push(mts_data[i][0]);
      sysex.push(mts_data[i][1]);
      sysex.push(mts_data[i][2]);
    };

    let checksum = sysex[0] ^ sysex[1];

    for (let i = 2; i < sysex.length; i++) {
      checksum = checksum ^ sysex[i];
    };

    sysex.push(checksum);
    
    return sysex;
  };
};git add 