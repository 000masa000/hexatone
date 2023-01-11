import { calculateRotationMatrix, applyMatrixToPoint } from './matrix';
import Point from './point';
import Euclid from './euclidean';
import { rgb, HSVtoRGB, HSVtoRGB2, nameToHex, hex2rgb, rgb2hsv, getContrastYIQ, getContrastYIQ_2, rgbToHex } from './color_utils';
import { WebMidi } from 'webmidi';
import { midi_in } from '../settings/midi/midiin';

class Keys {
  constructor(canvas, settings, synth, typing,) {
    this.settings = {
      hexHeight: settings.hexSize * 2,
      hexVert: settings.hexSize * 3 / 2,
      hexWidth: Math.sqrt(3) * settings.hexSize,
      gcd: Euclid(settings.rSteps, settings.urSteps), // calculates a array with 3 values: the GCD of the layout tiling (smallest step available); Bézout Coefficients to be applied to rSteps and urSteps to obtain GCD
      ...settings,
    };
    this.synth = synth;
    this.typing = typing;

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
   
   /* console.log("midiin_device:", this.settings.midiin_device);
    console.log("midiin_channel:", this.settings.midiin_channel);
    console.log("midi_device:", this.settings.midi_device);
    console.log("midi_channel:", this.settings.midi_channel);
    console.log("midi_mapping:", this.settings.midi_mapping);*/

    if (this.settings.midiin_device !== "OFF") {

      this.midiin_data = WebMidi.getInputById(this.settings.midiin_device);
    
      this.midiin_data.addListener("noteon", e => {
        this.midinoteOn(e);
      });

      this.midiin_data.addListener("noteoff", e => {
        this.midinoteOff(e);
      });

      this.midiin_data.addForwarder(WebMidi.getOutputById(this.settings.midi_device), {types:
        ["keyaftertouch", "controlchange", "programchange", "channelaftertouch", "pitchbend", "sysex", "sysexend"]}
      );
    };
  };

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
    this.midiin_data.removeForwarder;
    this.midin_data = null;
    };
  };

  midinoteOn = (e) => {; // TODO make the display calculation relative to angle of hex, and write a separate function
    var steps = e.note.number - 60;
    var channel_offset = e.message.channel - 1 - this.settings.midiin_channel;
    var steps_offset = channel_offset * this.settings.equivSteps;
    steps = steps + steps_offset;
    var velocity_played = e.note.rawAttack;
    var rSteps_count = Math.round(steps / this.settings.rSteps);
    var rSteps_to_steps = this.settings.rSteps * rSteps_count;
    var urSteps_count = Math.round((steps - rSteps_to_steps) / this.settings.urSteps);
    var urSteps_to_steps = this.settings.urSteps * urSteps_count;
    var gcdSteps_count = Math.floor((steps - rSteps_to_steps - urSteps_to_steps) / this.settings.gcd[0]);
    var gcdSteps_to_steps = gcdSteps_count * this.settings.gcd[0];
    var remainder = steps - rSteps_to_steps - urSteps_to_steps - gcdSteps_to_steps;
    if (remainder == 0) {
      var coords = new Point(rSteps_count + (gcdSteps_count * this.settings.gcd[1]), urSteps_count + (gcdSteps_count * this.settings.gcd[2]));
      var hex = this.hexOn(coords, velocity_played);
      this.state.activeHexObjects.push(hex);
    };
  };

  midinoteOff = (e) => {
    var steps = e.note.number - 60;
    var channel_offset = e.message.channel - 1 - this.settings.midiin_channel;
    var steps_offset = channel_offset * this.settings.equivSteps;
    steps = steps + steps_offset;
    var rSteps_count = Math.round(steps / this.settings.rSteps);
    var rSteps_to_steps = this.settings.rSteps * rSteps_count;
    var urSteps_count = Math.round((steps - rSteps_to_steps) / this.settings.urSteps);
    var urSteps_to_steps = this.settings.urSteps * urSteps_count;
    var gcdSteps_count = Math.floor((steps - rSteps_to_steps - urSteps_to_steps) / this.settings.gcd[0]);
    var gcdSteps_to_steps = gcdSteps_count * this.settings.gcd[0];
    var remainder = steps - rSteps_to_steps - urSteps_to_steps - gcdSteps_to_steps;
    if (remainder == 0) {
      var coords = new Point(rSteps_count + (gcdSteps_count * this.settings.gcd[1]), urSteps_count + (gcdSteps_count * this.settings.gcd[2]));
      this.hexOff(coords);
      var hexIndex = this.state.activeHexObjects.findIndex(function (hex) {
        return coords.equals(hex.coords);
      });
      if (hexIndex != -1) {
        this.noteOff(this.state.activeHexObjects[hexIndex]);
        this.state.activeHexObjects.splice(hexIndex, 1);
      };
    };
  };
  
  hexOn(coords, velocity_played) {
    const [cents, pressed_interval, steps, equaves, equivSteps] = this.hexCoordsToCents(coords);
    const [color, text_color] = this.centsToColor(cents, true, pressed_interval);
    this.drawHex(coords, color, text_color);
    const hex = this.synth.makeHex(coords, cents, pressed_interval, steps, equaves, equivSteps, velocity_played);
    hex.noteOn();
    return hex;
  };

  hexOff(coords) {
    const [cents, pressed_interval] = this.hexCoordsToCents(coords);
    const [color, text_color] = this.centsToColor(cents, false, pressed_interval);
    this.drawHex(coords, color, text_color);
  };

  noteOff(hex) {
    if (this.state.sustain) {
      this.state.sustainedNotes.push(hex);
    } else {
      hex.noteOff();
    }
  };

  sustainOff() {
    this.state.sustain = false;
    for (var note = 0; note < this.state.sustainedNotes.length; note++) {
      this.noteOff(this.state.sustainedNotes[note]);
    }
    this.state.sustainedNotes = [];
    // tempAlert('Sustain Off', 900);
  };

  sustainOn() {
    this.state.sustain = true;
    // tempAlert('Sustain On', 900);
  }

  /**************** Event Handlers ****************/
 /* deviceMotion = (e) => {
    this.state.shake.x1 = e.accelerationIncludingGravity.x;
    this.state.shake.y1 = e.accelerationIncludingGravity.y;
    this.state.shake.z1 = e.accelerationIncludingGravity.z;
  };*/

  motionScan = () => {
    const { x1, x2, y1, y2, z1, z2, lastShakeCount, lastShakeCheck } = this.state.shake;
    var change = Math.abs(x1 - x2 + y1 - y2 + z1 - z2);

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

    var newWidth = window.innerWidth;
    var newHeight = window.innerHeight;

    this.state.canvas.style.height = newHeight + 'px';
    this.state.canvas.style.width = newWidth + 'px';

    this.state.canvas.style.marginTop = (-newHeight / 2) + 'px';
    this.state.canvas.style.marginLeft = (-newWidth / 2) + 'px';

    this.state.canvas.width = newWidth;
    this.state.canvas.height = newHeight;

    // Find new centerpoint

    var centerX = newWidth / 2;
    var centerY = newHeight / 2;
    this.state.centerpoint = new Point(centerX, centerY);

    // Rotate about it

    if (this.state.rotationMatrix) {
      this.state.context.restore();
    }
    this.state.context.save();

    this.state.rotationMatrix = calculateRotationMatrix(-this.settings.rotation, this.state.centerpoint);

    // I don't know why these need to be the opposite sign of each other.
    var m = calculateRotationMatrix(this.settings.rotation, this.state.centerpoint);
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
      var coords = this.settings.keyCodeToCoords[e.code];
      var hex = this.hexOn(coords, 0);
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
        var coords = this.settings.keyCodeToCoords[e.code];
        this.hexOff(coords);
        var hexIndex = this.state.activeHexObjects.findIndex(function (hex) {
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
    var coords = this.getPointerPosition(e);

    coords = this.getHexCoordsAt(coords);

    if (this.state.activeHexObjects.length == 0) {
      this.state.activeHexObjects[0] = this.hexOn(coords, 0);
    } else {
      var first = this.state.activeHexObjects[0];
      if (!(coords.equals(first.coords))) {
        this.hexOff(first.coords);
        this.noteOff(first);
        this.state.activeHexObjects[0] = this.hexOn(coords, 0);
      }
    }
  };

  getPointerPosition(e) {
    var parentPosition = this.getPosition(e.currentTarget);
    var xPosition = e.clientX - parentPosition.x;
    var yPosition = e.clientY - parentPosition.y;
    return new Point(xPosition, yPosition);
  };

  getPosition(element) {
    var xPosition = 0;
    var yPosition = 0;

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

    for (var i = 0; i < this.state.activeHexObjects.length; i++) {
      this.state.activeHexObjects[i].release = true;
    };

    for (var i = 0; i < e.targetTouches.length; i++) {
      var coords = this.getHexCoordsAt(new Point(e.targetTouches[i].pageX - this.state.canvas.offsetLeft,
        e.targetTouches[i].pageY - this.state.canvas.offsetTop));
      var found = false;

      for (var j = 0; j < this.state.activeHexObjects.length; j++) {
        if (coords.equals(this.state.activeHexObjects[j].coords)) {
          this.state.activeHexObjects[j].release = false;
          found = true;
        }
      }
      if (!(found)) {
        var newHex = this.hexOn(coords, 0);
        this.state.activeHexObjects.push(newHex);
      }
    };

    for (var i = this.state.activeHexObjects.length - 1; i >= 0; i--) {
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
    var max = (this.state.centerpoint.x > this.state.centerpoint.y) ?
        this.state.centerpoint.x / this.settings.hexSize :
        this.state.centerpoint.y / this.settings.hexSize;
    max = Math.floor(max);
    for (var r = -max; r < max; r++) {
      for (var ur = -max; ur < max; ur++) {
        var coords = new Point(r, ur);
        this.hexOff(coords);
      }
    }
  };

  hexCoordsToScreen(hex) { /* Point */
    var screenX = this.state.centerpoint.x + hex.x * this.settings.hexWidth + hex.y * this.settings.hexWidth / 2;
    var screenY = this.state.centerpoint.y + hex.y * this.settings.hexVert;
    return (new Point(screenX, screenY));
  };

  drawHex(p, c, current_text_color) { /* Point, color */
    var context = this.state.context;
    var hexCenter = this.hexCoordsToScreen(p);

    // Calculate hex vertices

    var x = [];
    var y = [];
    for (var i = 0; i < 6; i++) {
      var angle = 2 * Math.PI / 6 * (i + 0.5);
      x[i] = hexCenter.x + this.settings.hexSize * Math.cos(angle);
      y[i] = hexCenter.y + this.settings.hexSize * Math.sin(angle);
    };

    // Draw filled hex

    context.beginPath();
    context.moveTo(x[0], y[0]);
    for (var i = 1; i < 6; i++) {
      context.lineTo(x[i], y[i]);
    }
    context.closePath();
    context.fillStyle = c;
    context.fill();

    // Save context and create a hex shaped clip

    context.save();
    context.beginPath();
    context.moveTo(x[0], y[0]);
    for (var i = 1; i < 6; i++) {
      context.lineTo(x[i], y[i]);
    }
    context.closePath();
    context.clip();

    // Calculate hex vertices outside clipped path

    var x2 = [];
    var y2 = [];
    for (var i = 0; i < 6; i++) {
      var angle = 2 * Math.PI / 6 * (i + 0.5);
      // TODO hexSize should already be a number
      x2[i] = hexCenter.x + (parseFloat(this.settings.hexSize) + 3) * Math.cos(angle);
      y2[i] = hexCenter.y + (parseFloat(this.settings.hexSize) + 3) * Math.sin(angle);
    };

    // Draw shadowed stroke outside clip to create pseudo-3d effect

    context.beginPath();
    context.moveTo(x2[0], y2[0]);
    for (var i = 1; i < 6; i++) {
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
    for (var i = 1; i < 6; i++) {
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
    context.font = "28pt Roboto HEJI2";
    context.textAlign = "center";
    context.textBaseline = "middle";

    var note = p.x * this.settings.rSteps + p.y * this.settings.urSteps;
    // TODO this should be parsed already
    var equivSteps = this.settings.scale.length;
    var equivMultiple = Math.floor(note / equivSteps);
    var reducedNote = note % equivSteps;
    if (reducedNote < 0) {
      reducedNote = equivSteps + reducedNote;
    };

    if (!this.settings.no_labels) {
      var name;
      if (this.settings.degree) {
        name = "" + reducedNote
      } else if (this.settings.note) {
        name = this.settings.note_names[reducedNote];
      } else if (this.settings.scala) {
        name = this.settings.scala_names[reducedNote];
      };
      if (name) {
        context.save();
        var scaleFactor = name.length > 3 ? 4 / name.length : 1;
        scaleFactor *= this.settings.hexSize / 46;
        context.scale(scaleFactor, scaleFactor);
        context.fillText(name, 0, 0);
        context.restore();
      }

      var scaleFactor = this.settings.hexSize / 50;
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
    var returnColor;
    if (!this.settings.spectrum_colors) {
      if (typeof(this.settings.note_colors[pressed_interval]) === 'undefined') {
        returnColor = "#EDEDE4";
      } else {
        returnColor = this.settings.note_colors[pressed_interval];
      }

      var oldColor = returnColor;

      //convert color name to hex
      returnColor = nameToHex(returnColor);
      const current_text_color = returnColor;

      //convert the hex to rgb
      returnColor = hex2rgb(returnColor);

      //darken for pressed key
      if (pressed) {
        returnColor[0] -= 90;
        returnColor[1] -= 90;
      }

      return [rgb(returnColor[0], returnColor[1], returnColor[2]), current_text_color];
    };

    var fcolor = hex2rgb("#" + this.settings.fundamental_color);
    fcolor = rgb2hsv(fcolor[0], fcolor[1], fcolor[2]);

    var h = fcolor.h / 360;
    var s = fcolor.s / 100;
    var v = fcolor.v / 100;
    //var h = 145/360; // green
    var reduced = (cents / 1200) % 1;
    if (reduced < 0) reduced += 1;
    h = (reduced + h) % 1;

    v = (pressed) ? v - (v / 2) : v;

    returnColor = HSVtoRGB(h, s, v);

    //setup text color
    var tcolor = HSVtoRGB2(h, s, v);
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
    var distance = coords.x * this.settings.rSteps + coords.y * this.settings.urSteps;
    var octs = this.roundTowardZero(distance / this.settings.scale.length);
    var reducedSteps = distance % this.settings.scale.length;
    var equivSteps = this.settings.equivSteps;
    if (reducedSteps < 0) {
      reducedSteps += this.settings.scale.length;
      octs -= 1;
    }
    var cents = octs * this.settings.equivInterval + this.settings.scale[reducedSteps];
    return [cents, reducedSteps, distance, octs, equivSteps];
  };

  getHexCoordsAt(coords) {
    coords = applyMatrixToPoint(this.state.rotationMatrix, coords);
    var x = coords.x - this.state.centerpoint.x;
    var y = coords.y - this.state.centerpoint.y;

    var q = (x * Math.sqrt(3) / 3 - y / 3) / this.settings.hexSize;
    var r = y * 2 / 3 / this.settings.hexSize;

    q = Math.round(q);
    r = Math.round(r);

    var guess = this.hexCoordsToScreen(new Point(q, r));

    // This gets an approximation; now check neighbours for minimum distance

    var minimum = 100000;
    var closestHex = new Point(q, r);
    for (var qOffset = -1; qOffset < 2; qOffset++) {
      for (var rOffset = -1; rOffset < 2; rOffset++) {
        var neighbour = new Point(q + qOffset, r + rOffset);
        var diff = this.hexCoordsToScreen(neighbour).minus(coords);
        var distance = diff.x * diff.x + diff.y * diff.y;
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