/*
  Parsing scale information encoded in the Scala .scl format.
  http://www.huygens-fokker.org/scala/scl_format.html

  This parser also allows encoding of key labels and key colors (hex format, i.e. #ffffff)
  TODO allow frequencies to be passed directly and converted automatically to cents
*/

import { string } from "prop-types";

export const parseScale = (scala) => {
  const out = {
    scale: [],
    colors: [],
    labels: [],
    errors: [],
  };
  var lines = scala.split('\n');
  for (let i = 0; i < lines.length; i++) {
    let line = lines[i];
    let match; // storage for match call inside clause
    if (line.match(/^\s+$/)) {
      // ignore blank lines
      continue;
    } else if (line.match(/^\s*!/)) {
      // ignore comments, indicated by a "!" symbol, but capture the first; which by convention is a filename.
      if (!out.filename) {
        out.filename = line.split("!", 2)[1].trim();
        //console.log("scale name:", out.filename);
      }
      continue;
    } else if (!out.description) {
      // the first non-comment line is a description
      out.description = line.trim();
      //console.log("scale description:", out.description);
    } else if (!out.equivSteps && line.match(/^\s*[0-9]+\s*$/)) {
      // The first number is the number of lines in the file to come, containing scale data.
      out.equivSteps = parseInt(line.trim());
      //console.log("scale length:", out.equivSteps);
    } else if (match = line.match(/^\s*(-?[0-9]+\.[0-9]*|[0-9]+\/[0-9]*|[0-9]+\\[0-9]*|[0-9]+)\s*$/)) {
      // only a pitch value (positive or negative float; positive ratio; edo step in backslash format)
      out.scale.push(match[1]);
      out.labels.push(null);
      out.colors.push(null);
    } else if (match = line.match(/^\s*(-?[0-9]+\.[0-9]*|[0-9]+\/[0-9]*|[0-9]+\\[0-9]*|[0-9]+)\s+(#[a-fA-F0-9]{6})$/)) {
      // pitch value with only a color in hex format (#ffffff)
      out.scale.push(match[1]);
      out.labels.push(null);
      out.colors.push(match[2].toLowerCase());
    } else if (match = line.match(/^\s*(-?[0-9]+\.[0-9]*|[0-9]+\/[0-9]*|[0-9]+\\[0-9]*|[0-9]+)\s+(.*)\s+(#[a-fA-F0-9]{6})$/)) {
      // pitch value with a label (any text string) and a color
      out.scale.push(match[1]);
      out.labels.push(match[2].trim());
      out.colors.push(match[3].toLowerCase());
    } else if (match = line.match(/^\s*(-?[0-9]+\.[0-9]*|[0-9]+\/[0-9]*|[0-9]+\\[0-9]*|[0-9]+\\[0-9]*|[0-9]+)\s+(.*)\s*$/)) {
      // pitch value with only a label;
      const label = typeof match[2] === 'undefined' ? match[2] : null;
      const color = typeof match[3] === 'undefined' ? match[3] : null;
      out.scale.push(match[1]);
      out.labels.push(match[2].trim());
      out.colors.push(null);
    } else {
      out.errors.push({line: i, value: line, error: "Unexpected token."});
    }
  }
  if (out.equivSteps !== out.scale.length) {
    out.errors.push({line: lines.length, error: `${out.equivSteps} pitches specified, but ${out.scale.length} provided`});
  }
  return out;
};

// convert scale data from string to cents
export const scalaToCents = (line) => {
  if (line.match(/\//) !== null) {
    // ratio
    var nd = line.split("/");
    return 1200 * Math.log(parseInt(nd[0]) / parseInt(nd[1])) / Math.log(2);
  } else if (line.match(/\./) !== null) {
    // decimal cents
    return parseFloat(line);
  } else if (line.match(/\\/) !== null) {
    // edo step
    var edo = line.split("\\");
    return parseFloat(edo[0]) * 1200 / parseFloat(edo[1]);
  } else if ((typeof(line) == "number") && (line > 0)) {
    // integer implicit ratio
    return 1200 * Math.log(parseInt(line)) / Math.log(2);
  } else {
    return 0;
  }
};

// convert scale data from string to label
export const scalaToLabels = (line) => {
  if (line.match(/\//) !== null) {
    // if ratio is too long, convert to cents and round
    if (line.length > 7) {
      var nd = line.split("/");
      var cents = 1200 * Math.log(parseInt(nd[0]) / parseInt(nd[1])) / Math.log(2);
      cents = " "+Math.round(cents).toString()+".";
      return cents;
    } else { // return ratio
      return line;
    }
  } else if (line.match(/\\/) !== null) {
    var edo = line.split("\\");
    var cents = parseFloat(edo[0]) * 1200 / parseFloat(edo[1]);
    cents = " "+Math.round(cents).toString()+".";
    return cents;
  } else if (line.match(/\./) !== null) {
    // decimal cents : round and return string
    var cents = parseFloat(line);
    cents = " "+Math.round(cents).toString()+".";
    return cents;
  } else {
    // integer implicit ratio
    return line + "/1";
  }
};

// convert parsed scale data to labels
export const parsedScaleToLabels = (scale) => {
  scale.map(i => scalaToLabels(i));
}