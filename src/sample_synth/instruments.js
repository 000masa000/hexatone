export const instruments = [
  {
    name: "Additive Synthesis Timbres",
    instruments: [
      {
        fileName: "WMRI3LST",
        name: "3-Limit (4 Harmonics)",
        gain: 0.72,
        attack: 0.116,
        release: 0.027,
        loop: true
      }, {
        fileName: "WMRI5LST",
        name: "5-Limit (6 Harmonics)",
        gain: 0.68,
        attack: 0.112,
        release: 0.024,
        loop: true
      }, {
        fileName: "WMRI7LST",
        name: "7-Limit (10 Harmonics)",
        gain: 0.65,
        attack: 0.108,
        release: 0.021,
        loop: true
      }, {
        fileName: "WMRI11LST",
        name: "11-Limit (12 Harmonics)",
        gain: 0.6,
        attack: 0.104,
        release: 0.018,
        loop: true
      }, {
        fileName: "WMRI13LST",
        name: "13-Limit (16 Harmonics)",
        gain: 0.565,
        attack: 0.1,
        release: 0.015,
        loop: true
      }, {
        fileName: "WMRIByzantineST",
        name: "Reed (9 Harmonics)",
        gain: 0.58,
        attack: 0.096,
        release: 0.012,
        loop: true
      }, {
        fileName: "hammond",
        name: "Hammond (9 Harmonics)",
        gain: 0.66,
        attack: 0.001,
        release: 0.001,
        loop: true
      }
    ],
  },
  {
    name: "Sampled Instruments",
    instruments: [
      {
        fileName: "wurli",
        name: "Wurlitzer Electric Piano",
        gain: 0.29,
        attack: 0,
        release: 0.002,
        loop: false
      }, {
        fileName: "rhodes",
        name: "Fender Rhodes",
        gain: 0.42,
        attack: 0,
        release: 0.002,
        loop: false
      }, {
        fileName: "HvP8_retuned",
        name: "Baroque Organ",
        gain: 0.5,
        attack: 0,
        release: 0.045,
        loop: true,
        loopPoints: [4.0, 5.2913, 2.287103, 4.1999, 2.287, 4.21495, 0.9711, 3.574]
      }, {
        fileName: "harpsichord",
        name: "Harpsichord",
        gain: 0.26,
        attack: 0,
        release: 0.075,
        loop: false
      }, {
        fileName: "lute",
        name: "Lute-Stop",
        gain: 0.22,
        attack: 0,
        release: 0.2,
        loop: false
      }, {
        fileName: "harp",
        name: "Harp",
        gain: 0.34,
        attack: 0,
        release: 1.5,
        loop: false
      }, {
        fileName: "qanun",
        name: "Qanun",
        gain: 0.27,
        attack: 0,
        release: 1.5,
        loop: false
      }, {
        fileName: "gayageum",
        name: "Gayageum",
        gain: 0.2,
        attack: 0,
        release: 1.0,
        loop: false
      }, {
        fileName: "vibes",
        name: "Vibraphone",
        gain: 0.39,
        attack: 0,
        release: 0.2,
        loop: false
      }, {
        fileName: "sruti",
        name: "Srutibox Harmonium",
        gain: 0.285,
        attack: 0,
        release: 0.038,
        loop: true
      }
    ]
  }
]
