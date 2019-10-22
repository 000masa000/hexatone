/*
  Parsing scale information encoded in the Scala .scl format.
  http://www.huygens-fokker.org/scala/scl_format.html
*/

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
      // ignore comments, but capture the first; which by convention is a filename.
      if (!out.filename) {
        out.filename = line.split("!", 2)[1].trim();
      }
      continue;
    } else if (!out.description) {
      // The first non-comment line is a description
      out.description = line.trim();
    } else if (!out.equivSteps && line.match(/^\s*[0-9]+\s*$/)) {
      // The first number is number of lines in the file.
      out.equivSteps = parseInt(line.trim());
    } else if (match = line.match(/^\s*(-?[0-9]+\.[0-9]*|[0-9]+\/[0-9]*|[0-9]+)\s*$/)) {
      // only a pitch value
      out.scale.push(match[1]);
      out.labels.push(null);
      out.colors.push(null);
    } else if (match = line.match(/^\s*(-?[0-9]+\.[0-9]*|[0-9]+\/[0-9]*|[0-9]+)\s+(#[a-fA-F0-9]{6})$/)) {
      // pitch value with only a color
      out.scale.push(match[1]);
      out.labels.push(null);
      out.colors.push(match[2].toLowerCase());
    } else if (match = line.match(/^\s*(-?[0-9]+\.[0-9]*|[0-9]+\/[0-9]*|[0-9]+)\s+(.*)\s+(#[a-fA-F0-9]{6})$/)) {
      // pitch value with a label and a color
      out.scale.push(match[1]);
      out.labels.push(match[2].trim());
      out.colors.push(match[3].toLowerCase());
    } else if (match = line.match(/^\s*(-?[0-9]+\.[0-9]*|[0-9]+\/[0-9]*|[0-9]+)\s+(.*)\s*$/)) {
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

export const scalaToCents = (line) => {
  if (line.match(/\//)) {
    // ratio
    var nd = line.split('/');
    return 1200 * Math.log(parseInt(nd[0]) / parseInt(nd[1])) / Math.log(2);
  } else if (line.match(/\./)) {
    // decimal cents
    return parseFloat(line);
  } else {
    // integer implicit ratio
    return 1200 * Math.log(parseInt(line)) / Math.log(2);
  }
};
