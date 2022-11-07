import scale_12_ed2 from 'scales/12-ed2.scl';
import scale_31_mt_vicentino_alt from 'scales/31-MT-Vicentino_alt.scl';
import scale_12_ji_7l from 'scales/12-JI-7L.scl';
import scale_7_ji_rast_maqam from 'scales/7-JI Rast Maqam (Arabic) —  Eight Echos (Fourth Plagal, Byzantine).scl';
import scale_17_ji_5l from 'scales/17-JI-5L-Arabic-theoretical.scl';
import scale_17_ji_11l_wilson from 'scales/17-JI-11L-Wilson.scl';
import scale_22_ji_5l from 'scales/22-JI-5L-Indian.scl';
import scale_31_ji_7l_fokker from 'scales/31-JI-7L-Fokker.scl';
import scale_43_ji_11l_partch from 'scales/43-JI-11L-Partch.scl';
import scale_43_ji_11l_partchG from 'scales/43-JI-11L-Partch_on_G.scl';
import scale_53_ri_3l from 'scales/53-RI-3L.scl';
import scale_53_ri_3l_mirrored from 'scales/53-RI-3L-mirrored.scl';
import scale_19_ed2 from 'scales/19-ed2.scl';
import scale_31_ed2 from 'scales/31-ed2.scl';
import scale_41_ed2 from 'scales/41-ed2.scl';
import scale_43_ed2 from 'scales/43-ed2.scl';
import scale_53_ed2 from 'scales/53-ed2.scl';
import scale_55_ed2 from 'scales/55-ed2.scl';
import scale_53_ji_13l_ct from 'scales/53-JI-13L-CT.scl';

import { parseScale } from './scale/parse-scale';

const scale_12_ed2_names = ["C", "C♯/D♭", "D", "D♯/E♭", "E", "F", "F♯/G♭", "G", "G♯/A♭", "A", "A♯/B♭", "B"];
const scale_12_ed2_parsed = parseScale(scale_12_ed2).scale;
export const presets = [
  {
    "name": "Isomorphic Layouts for 12-ET",
    settings: [
      {
        "name": "Jankó / 6-6/Balanced/Symmetric/Bilinear/Uniform",
        "description": "12-ed2 Jankó / 6-6/Balanced/Symmetric/Bilinear/Uniform Keyboard / ~Halberstadt. 12-tone equal tempered scale consisting of 12 sonically equal divisions per frequency halving/doubling, mapped on a (hexagonal) tilted Jankó layout which can be regarded as a stacked 6-6/Balanced/Symmetric/Bilinear/Uniform Keyboard, and which approximates the 7-white/5-black Halberstadt organ layout (the classic piano keyboard).",
        "scale": scale_12_ed2_parsed,
        "names": scale_12_ed2_names,
        "note_colors": ["#ffffff", "#7b7b7b", "#ffffff", "#7b7b7b", "#ffffff", "#ffffff", "#7b7b7b", "#ffffff", "#7b7b7b", "#ffffff", "#7b7b7b", "#ffffff"],
        "equivSteps": 12,
        "key_labels": "names",
        "spectrum_colors": false,
        "rSteps": 2,
        "urSteps": 1,
        "hexSize": 40,
        "rotation": -6,
        "output": "sample",
        "fundamental": 261.6255653,
        "instrument": "piano",
        "short_description": "12-ed2 Jankó / 6-6/Balanced/Symmetric/Bilinear/Uniform Keyboard / ~Halberstadt"
      },
      {
        "name": "B-System Chromatic Button",
        "description": "12-ed2 B-System Chromatic Button: 12-tone equal tempered scale consisting of 12 sonically equal divisions per frequency halving/doubling, mapped on a (hexagonal) tilted Chromatic Button System Type-B used on some button accordions.",
        "scale": scale_12_ed2_parsed,
        "names": scale_12_ed2_names,
        "note_colors": ["#ffffff", "#7b7b7b", "#ffffff", "#7b7b7b", "#ffffff", "#ffffff", "#7b7b7b", "#ffffff", "#7b7b7b", "#ffffff", "#7b7b7b", "#ffffff"],
        "equivSteps": 12,
        "key_labels": "names",
        "spectrum_colors": false,
        "rSteps": 3,
        "urSteps": 2,
        "hexSize": 40,
        "rotation": 343.897886248,
        "output": "sample",
        "fundamental": 261.6255653,
        "instrument": "rhodes",
        "short_description": "12-ed2 B-System Chromatic Button"
      },
      {
        "name": "C-System Chromatic Button",
        "description": "12-ed2 C-System Chromatic Button: 12-tone equal tempered scale consisting of 12 sonically equal divisions per frequency halving/doubling, mapped on a (hexagonal) tilted Chromatic Button System Type-C used on some button accordions.",
        "scale": scale_12_ed2_parsed,
        "names": scale_12_ed2_names,
        "note_colors": ["#ffffff", "#7b7b7b", "#ffffff", "#7b7b7b", "#ffffff", "#ffffff", "#7b7b7b", "#ffffff", "#7b7b7b", "#ffffff", "#7b7b7b", "#ffffff"],        
        "equivSteps": 12,
        "key_labels": "names",
        "spectrum_colors": false,
        "rSteps": 3,
        "urSteps": 1,
        "hexSize": 40,
        "rotation": 343.897886248,
        "output": "sample",
        "fundamental": 261.6255653,
        "instrument": "rhodes",
        "short_description": "12-ed2 C-System Chromatic Button"       
      },
    ]
  },
  {
    "name": "Meantone",
    settings: [
      {
        "name": "31-Extended-Meantone Vicentino alternate with Bosanquet / Wilson / Terpstra layout",
        "description": "31-Extended-Meantone Vicentino alternate tuning to 31-edo with Bosanquet / Wilson / Terpstra layout (Gbb - A##)",
        "scale": parseScale(scale_31_mt_vicentino_alt).scale,
        "names": ["C", "D♭♭", "C♯", "D♭", "C×", "D", "E♭♭", "D♯", "E♭", "D×", "E", "F♭", "E♯", "F", "G♭♭", "F♯", "G♭", "F×", "G", "A♭♭", "G♯", "A♭", "G×", "A", "B♭♭", "A♯", "B♭", "A×", "B", "C♭", "B♯"],
        "note_colors": ["#ffffff", "#ff9f41", "#cfcfcf", "#bbaa93", "#7b7b7b", "#ffffff", "#ff9f41", "#cfcfcf", "#bbaa93", "#7b7b7b", "#ffffff", "#bbaa93", "#cfcfcf", "#ffffff", "#ff9f41", "#cfcfcf", "#bbaa93", "#7b7b7b", "#ffffff", "#ff9f41", "#cfcfcf", "#bbaa93", "#7b7b7b", "#ffffff", "#ff9f41", "#cfcfcf", "#bbaa93", "#7b7b7b", "#ffffff", "#bbaa93", "#cfcfcf", "#ffffff"],
        "equivSteps": 31,
        "key_labels": "names",
        "spectrum_colors": false,
        "rSteps": 5,
        "urSteps": 3,
        "hexSize": 40,
        "rotation": 343.897886248,
        "output": "sample",
        "fundamental": 263.1813855,        
        "instrument": "harpsichord",
        "short_description": "31-Extended-Meantone Vicentino alternate with Bosanquet / Wilson / Terpstra layout (Gbb - A##)"
      }
    ]
  },
  {
    "name": "Just Intonation",
    settings: [
      {
        "name": "7-JI Rast Maqam / Eight Echos — Bosanquet / Wilson / Terpstra",
        "description": "7-JI Rast Maqam / Eight Echos — Bosanquet / Wilson / Terpstra: 7-tone Arabic Rast Maqam made from two disjunct Rast tetrachords according to Mansour Zalzal’s famous lute tuning as described by al-Farabi, where the ratios including prime number 11 are alterations of 3-Limit versions, coinciding with the Eight Echos or Fourth Plagal of Byzantine Psaltic Chant described misleadingly in text books as 12-10-8-12-12-10-8 using the 72 moria system of approximation, mapped on a Bosanquet / Wilson / Terpstra layout.",
        "scale": parseScale(scale_7_ji_rast_maqam).scale,
        "names": ["1/1", "9/8", "27/22", "4/3", "3/2", "27/16", "81/44"],
        "note_colors": ["#ffffff", "#ffc37d", "#ff9fb7", "#f7ffaf", "#f7ffaf", "#ffc37d", "#ff9fb7"],
        "equivSteps": 7,
        "key_labels": "names",        
        "spectrum_colors": false,
        "rSteps": 1,
        "urSteps": 1,
        "hexSize": 40,
        "rotation": 343.897886248,
        "output": "sample",
        "fundamental": 260.740740,       
        "instrument": "qanun"
      },
      {
        "name": "12-JI-7L Jankó / 6-6/Balanced/Symmetric/Bilinear/Uniform",
        "description": "12-JI-7L Jankó / 6-6/Balanced/Symmetric/Bilinear/Uniform Keyboard / ~Halberstadt: 12-tone Just Intonation classic 7-Limit scale, consisting of 12 rational divisions per frequency halving/doubling with sonic distances derived from the harmonic series up to a prime limit of 7, mapped on a (hexagonal) tilted Jankó layout which can be regarded as a stacked 6-6/Balanced/Symmetric/Bilinear/Uniform Keyboard, and which approximates the 7-white/5-black Halberstadt organ layout (the classic piano keyboard).",
        "scale": parseScale(scale_12_ji_7l).scale,
        "names": ["1/1", "16/15", "9/8", "6/5", "5/4", "4/3", "7/5", "3/2", "8/5", "5/3", "7/4", "15/8"],
        "note_colors": ["#55d455", "#55f4aa", "#55ffff", "#55b4ff", "#5555ea", "#aa55ff", "#ff55ff", "#ff55aa", "#f45555", "#ffaa55", "#ffff55", "#aaf455"],
        "equivSteps": 12,
        "key_labels": "names",       
        "spectrum_colors": false,
        "rSteps": 2,
        "urSteps": 1,
        "hexSize": 40,
        "rotation": 343.897886248,        
        "output": "sample",
        "fundamental": 264,        
        "instrument": "piano",
        "short_description": "12 - JI - 7L Jankó / 6 - 6 / Balanced / Symmetric / Bilinear / Uniform Keyboard / ~Halberstadt"
      },
      {
        "name": "17-JI-5L-Arabic-theoretical Bosanquet / Wilson / Terpstra",
        "description": "17-JI-5L-Arabic-theoretical Bosanquet / Wilson / Terpstra: 17-tone Arabic theoretical scale: 5-Limit Just Intonation which is schismatic equivalent to a 17-tone 3-Limit scale generated from 12 steps descending and 4 ascending plus the fundamental, consisting of 17 rational divisions per frequency halving/doubling with sonic distances derived from the harmonic series up to a prime limit of 5, presumably used until the 8th century, mapped on a Bosanquet / Wilson / Terpstra layout.",
        "scale": parseScale(scale_17_ji_5l).scale,
        "names": ["1/1", "256/243", "10/9", "9/8", "32/27", "5/4", "81/64", "4/3", "45/32", "40/27", "3/2", "128/81", "5/3", "27/16", "16/9", "15/8", "160/81"],
        "note_colors": ["#f7ffaf", "#8fc7ef", "#ff9fb7", "#f7ffaf", "#8fc7ef", "#f7ffaf", "#ff9fb7", "#f7ffaf", "#8fc7ef", "#ff9fb7", "#f7ffaf", "#8fc7ef", "#f7ffaf", "#ff9fb7", "#8fc7ef", "#f7ffaf", "#ff9fb7"],
        "equivSteps": 17,
        "key_labels": "names",
        "spectrum_colors": false,
        "rSteps": 3,
        "urSteps": 1,
        "hexSize": 40,
        "rotation": 343.897886248,
        "output": "sample",
        "fundamental": 260.740740,       
        "instrument": "qanun",
        "short_description": "17-JI-5L-Arabic-theoretical Bosanquet / Wilson / Terpstra"       
      },
      {
        "name": "17-JI-11L-Wilson Bosanquet / Wilson / Terpstra",
        "description": "17-JI-11L-Wilson Bosanquet / Wilson / Terpstra: 17-tone Just Intonation 11-Limit scale by Erv Wilson, consisting of 17 rational divisions per frequency halving/doubling with sonic distances derived from the harmonic series up to a prime limit of 11, mapped on a Bosanquet / Wilson / Terpstra layout.",
        "scale": parseScale(scale_17_ji_11l_wilson).scale,
        "names": ["R", "22/21", "11/10", "9/8", "7/6", "11/9", "5/4", "4/3", "11/8", "22/15", "3/2", "11/7", "44/27", "5/3", "7/4", "11/6", "15/8"],
        "note_colors": ["#8fc7ef", "#f7ffaf", "#ffc37d", "#8fc7ef", "#f7ffaf", "#ffc37d", "#8fc7ef", "#8fc7ef", "#ffc37d", "#ffc37d", "#8fc7ef", "#f7ffaf", "#ffc37d", "#8fc7ef", "#f7ffaf", "#ffc37d", "#8fc7ef"],
        "equivSteps": 17,
        "key_labels": "names",
        "spectrum_colors": false,
        "rSteps": 3,
        "urSteps": 1,
        "hexSize": 40,
        "rotation": 343.897886248,
        "output": "sample",
        "fundamental": 264,
        "instrument": "harp",
        "short_description": "17-JI-11L-Wilson Bosanquet / Wilson / Terpstra"
      },
      {
        "name": "22-JI-5L-Indian Bosanquet / Wilson / Terpstra",
        "description": "22-JI-5L-Indian Bosanquet / Wilson / Terpstra: 22-tone Indian scale: 5-Limit Just Intonation which is schismatic equivalent to a 22-tone 3-Limit scale generated from 11 steps ascending and 10 descending plus the fundamental, consisting of 22 rational divisions per frequency halving/doubling with sonic distances derived from the harmonic series up to a prime limit of 5, notated after Alain Daniélou, having as reference frequency the Earth's year transposed 33 octaves higher, mapped on a Bosanquet / Wilson / Terpstra layout.",        
        "scale": parseScale(scale_22_ji_5l).scale,
        "names": ["Sa", "ReL-", "ReL+", "Re-", "Re", "GaL", "Gab", "Ga", "Ga+", "Ma", "Ma+", "MaL-", "MaL+", "Pa", "DhaL", "Dhab", "Dha", "Dha+", "NiL+", "Nib", "Ni", "Ni+"],
        "note_colors": ["#80df80", "#80cfff", "#ffbfff", "#ffcf80", "#80df80", "#80cfff", "#ffbfff", "#80df80", "#ffcf80", "#80df80", "#ffcf80", "#80cfff", "#ffbfff", "#80df80", "#80cfff", "#ffbfff", "#ffcf80", "#80df80", "#80cfff", "#ffbfff", "#80df80", "#ffcf80"],
        "equivSteps": 22,
        "key_labels": "names",
        "spectrum_colors": false,
        "rSteps": 4,
        "urSteps": 3,
        "hexSize": 40,
        "rotation": 340.897886248,
        "output": "sample",
        "fundamental": 260.740740,
        "instrument": "lute",
        "short_description": "22-JI-5L-Indian Bosanquet / Wilson / Terpstra"
      },
      {
        "name": "31-JI-7L-Fokker Bosanquet / Wilson / Terpstra",
        "description": "31-JI-7L-Fokker Bosanquet / Wilson / Terpstra: 31-tone Just Intonation 7-Limit scale by Adriaan Fokker, consisting of 31 rational divisions per frequency halving/doubling with sonic distances derived from the harmonic series up to a prime limit of 7, mapped on a Bosanquet / Wilson / Terpstra layout.",
        "scale": parseScale(scale_31_ji_7l_fokker).scale,
        "names": ["1/1", "64/63", "135/128", "15/14", "35/32", "9/8", "8/7", "7/6", "135/112", "315/256", "5/4", "9/7", "21/16", "4/3", "175/128", "45/32", "10/7", "35/24", "3/2", "32/21", "14/9", "45/28", "105/64", "5/3", "12/7", "7/4", "16/9", "945/512", "15/8", "40/21", "63/32"],
        "note_colors": ["#ffffff", "#ff9f41", "#cfcfcf", "#bbaa93", "#7b7b7b", "#ffffff", "#ff9f41", "#cfcfcf", "#bbaa93", "#7b7b7b", "#ffffff", "#bbaa93", "#cfcfcf", "#ffffff", "#ff9f41", "#cfcfcf", "#bbaa93", "#7b7b7b", "#ffffff", "#ff9f41", "#cfcfcf", "#bbaa93", "#7b7b7b", "#ffffff", "#ff9f41", "#cfcfcf", "#bbaa93", "#7b7b7b", "#ffffff", "#bbaa93", "#cfcfcf", "#ffffff"],
        "equivSteps": 31,
        "key_labels": "names",
        "spectrum_colors": false,
        "rSteps": 5,
        "urSteps": 3,
        "hexSize": 40,
        "rotation": 343.897886248,
        "output": "sample",
        "fundamental": 264,        
        "instrument": "harpsichord",
        "short_description": "31-JI-7L-Fokker Bosanquet / Wilson / Terpstra"
      },
      {
        "name": "43-JI-11L-Partch Transposed (C = 1/1) Bosanquet / Wilson / Terpstra",
        "description": "43-JI-11L-Partch Bosanquet / Wilson / Terpstra: 43-tone Just Intonation 11-Limit scale by Harry Partch, consisting of 43 rational divisions per frequency halving/doubling with sonic distances derived symmetrically from both ascending and descending harmonic series (otonalities and utonalities) up to a prime limit of 11, mapped on a Bosanquet / Wilson / Terpstra layout. Note that Partch's original tuning was based in 1/1 = G, while this version sets 1/1 = C, using the same frequency ratios.",
        "scale": parseScale(scale_43_ji_11l_partch).scale,
        "names": ["1/1", "81/80", "33/32", "21/20", "16/15", "12/11", "11/10", "10/9", "9/8", "8/7", "7/6", "32/27", "6/5", "11/9", "5/4", "14/11", "9/7", "21/16", "4/3", "27/20", "11/8", "7/5", "10/7", "16/11", "40/27", "3/2", "32/21", "14/9", "11/7", "8/5", "18/11", "5/3", "27/16", "12/7", "7/4", "16/9", "9/5", "20/11", "11/6", "15/8", "40/21", "64/33", "160/81"],
        "note_colors": ["#ffffff", "#c3b7ab", "#878787", "#ff9f40", "#878787", "#ff9f40", "#abb7c3", "#ffffff", "#c3b7ab", "#878787", "#ff9f40", "#878787", "#ff9f40", "#abb7c3", "#ffffff", "#c3b7ab", "#878787", "#abb7c3", "#ffffff", "#c3b7ab", "#878787", "#ff9f40", "#878787", "#ff9f40", "#abb7c3", "#ffffff", "#c3b7ab", "#878787", "#ff9f40", "#878787", "#ff9f40", "#abb7c3", "#ffffff", "#c3b7ab", "#878787", "#ff9f40", "#878787", "#ff9f40", "#abb7c3", "#ffffff", "#c3b7ab", "#878787", "#abb7c3"],
        "equivSteps": 43,
        "key_labels": "names",
        "spectrum_colors": false,
        "rSteps": 7,
        "urSteps": 4,
        "hexSize": 40,
        "rotation": 343.897886248,
        "output": "sample",
        "fundamental": 260.74074074,        
        "instrument": "gayageum",
        "short_description": "43-JI-11L-Partch Bosanquet / Wilson / Terpstra"        
      },
      {
        "name": "43-JI-11L-Partch Original (G = 1/1) Bosanquet / Wilson / Terpstra",
        "description": "43-JI-11L-Partch Bosanquet / Wilson / Terpstra: 43-tone Just Intonation 11-Limit scale by Harry Partch, consisting of 43 rational divisions per frequency halving/doubling with sonic distances derived symmetrically from both ascending and descending harmonic series (otonalities and utonalities) up to a prime limit of 11, mapped on a Bosanquet / Wilson / Terpstra layout. Note that Partch's original tuning was based on 1/1 = G (392 Hz), and this scala file uses the standard reference C. Partch's ratios have therefore each been multiplied by 3/2 and normalised, so that the original pitch-heights are retained.",
        "scale": parseScale(scale_43_ji_11l_partchG).scale,
        "names": ["4/3", "27/20", "11/8", "7/5", "10/7", "16/11", "40/27", "3/2", "32/21", "14/9", "11/7", "8/5", "18/11", "5/3", "27/16", "12/7", "7/4", "16/9", "9/5", "20/11", "11/6", "15/8", "40/21", "64/33", "160/81", "1/1", "81/80", "33/32", "21/20", "16/15", "12/11", "11/10", "10/9", "9/8", "8/7", "7/6", "32/27", "6/5", "11/9", "5/4", "14/11", "9/7", "21/16"],
        "note_colors": ["#ffffff", "#c3b7ab", "#878787", "#ff9f40", "#878787", "#ff9f40", "#abb7c3", "#ffffff", "#c3b7ab", "#878787", "#ff9f40", "#878787", "#ff9f40", "#abb7c3", "#ffffff", "#c3b7ab", "#878787", "#abb7c3", "#ffffff", "#c3b7ab", "#878787", "#ff9f40", "#878787", "#ff9f40", "#abb7c3", "#ffffff", "#c3b7ab", "#878787", "#ff9f40", "#878787", "#ff9f40", "#abb7c3", "#ffffff", "#c3b7ab", "#878787", "#ff9f40", "#878787", "#ff9f40", "#abb7c3", "#ffffff", "#c3b7ab", "#878787", "#abb7c3"],
        "equivSteps": 43,
        "key_labels": "names",
        "spectrum_colors": false,
        "rSteps": 7,
        "urSteps": 4,
        "hexSize": 40,
        "rotation": 343.897886248,
        "output": "sample",
        "fundamental": 261.333333,        
        "instrument": "gayageum",
        "short_description": "43-JI-11L-Partch Bosanquet / Wilson / Terpstra"        
      },
      {
        "name": "53-RI-3L Bosanquet / Wilson / Terpstra",
        "description": "53-RI-3L Bosanquet / Wilson / Terpstra: 53-tone Rational Intonation 3-Limit scale, consisting of 53 rational divisions per frequency halving/doubling with sonic distances derived solely from the harmonics 2 and 3 of both ascending and descending harmonic series, mapped on a Bosanquet / Wilson / Terpstra Male (Western) layout.",
        "scale": parseScale(scale_53_ri_3l).scale,
        "names": ["2⁰|3⁰", "2¹⁹|3¹²", "2³⁸|3²⁴", "3¹⁷|2²⁷", "3⁵|2⁸", "2¹¹|3⁷", "2³⁰|3¹⁹", "3²²|2³⁵", "3¹⁰|2¹⁶", "2³|3²", "2²²|3¹⁴", "2⁴¹|3²⁶", "3¹⁵|2²⁴", "3³|2⁵", "2¹⁴|3⁹", "2³³|3²¹", "3²⁰|2³²", "3⁸|2¹³", "2⁶|3⁴", "2²⁵|3¹⁶", "3²⁵|2⁴⁰", "3¹³|2²¹", "3¹|2²", "2¹⁷|3¹¹", "2³⁶|3²³", "3¹⁸|2²⁹", "3⁶|2¹⁰", "2⁹|3⁶", "2²⁸|3¹⁸", "3²³|2³⁷", "3¹¹|2¹⁸", "2¹|3¹", "2²⁰|3¹³", "2³⁹|3²⁵", "3¹⁶|2²⁶", "3⁴|2⁷", "2¹²|3⁸", "2³¹|3²⁰", "3²¹|2³⁴", "3⁹|2¹⁵", "2⁴|3³", "2²³|3¹⁵", "3²⁶|2⁴²", "3¹⁴|2²³", "3²|2⁴", "2¹⁵|3¹⁰", "2³⁴|3²²", "3¹⁹|2³¹", "3⁷|2¹²", "2⁷|3⁵", "2²⁶|3¹⁷", "3²⁴|2³⁹", "3¹²|2²⁰", "3⁰|2¹"],
        "note_colors": ["#ffffff", "#c3b7ab", "#e7e7e7", "#878787", "#ff9f40", "#878787", "#ff9f40", "#e7e7e7", "#abb7c3", "#ffffff", "#c3b7ab", "#e7e7e7", "#878787", "#ff9f40", "#878787", "#ff9f40", "#e7e7e7", "#abb7c3", "#ffffff", "#c3b7ab", "#e7e7e7", "#abb7c3", "#ffffff", "#c3b7ab", "#e7e7e7", "#878787", "#ff9f40", "#878787", "#ff9f40", "#e7e7e7", "#abb7c3", "#ffffff", "#c3b7ab", "#e7e7e7", "#878787", "#ff9f40", "#878787", "#ff9f40", "#e7e7e7", "#abb7c3", "#ffffff", "#c3b7ab", "#e7e7e7", "#878787", "#ff9f40", "#878787", "#ff9f40", "#e7e7e7", "#abb7c3", "#ffffff", "#c3b7ab", "#e7e7e7", "#abb7c3"],
        "equivSteps": 53,
        "key_labels": "enumerate",
        "spectrum_colors": false,
        "rSteps": 9,
        "urSteps": 4,
        "hexSize": 40,
        "rotation": 343.897886248,
        "output": "sample",
        "fundamental": 260.74074074,
        "instrument": "rhodes",
        "short_description": "53-RI-3L Bosanquet / Wilson / Terpstra"
      },      
      {
        "name": "53-RI-3L Mirrored Bosanquet / Wilson / Terpstra",
        "description": "53-RI-3L Bosanquet / Wilson / Terpstra: 53-tone Rational Intonation 3-Limit scale, consisting of 53 rational divisions per frequency halving/doubling with sonic distances derived solely from the harmonics 2 and 3 of both ascending and descending harmonic series, mapped on a Bosanquet / Wilson / Terpstra Female (Eastern) layout.",
        "scale": parseScale(scale_53_ri_3l_mirrored).scale,
        "names": ["2⁰|3⁰", "2¹⁹|3¹²", "2³⁸|3²⁴", "3¹⁷|2²⁷", "3⁵|2⁸", "2¹¹|3⁷", "2³⁰|3¹⁹", "3²²|2³⁵", "3¹⁰|2¹⁶", "2³|3²", "2²²|3¹⁴", "2⁴¹|3²⁶", "3¹⁵|2²⁴", "3³|2⁵", "2¹⁴|3⁹", "2³³|3²¹", "3²⁰|2³²", "3⁸|2¹³", "2⁶|3⁴", "2²⁵|3¹⁶", "3²⁵|2⁴⁰", "3¹³|2²¹", "3¹|2²", "2¹⁷|3¹¹", "2³⁶|3²³", "3¹⁸|2²⁹", "3⁶|2¹⁰", "2⁹|3⁶", "2²⁸|3¹⁸", "3²³|2³⁷", "3¹¹|2¹⁸", "2¹|3¹", "2²⁰|3¹³", "2³⁹|3²⁵", "3¹⁶|2²⁶", "3⁴|2⁷", "2¹²|3⁸", "2³¹|3²⁰", "3²¹|2³⁴", "3⁹|2¹⁵", "2⁴|3³", "2²³|3¹⁵", "3²⁶|2⁴²", "3¹⁴|2²³", "3²|2⁴", "2¹⁵|3¹⁰", "2³⁴|3²²", "3¹⁹|2³¹", "3⁷|2¹²", "2⁷|3⁵", "2²⁶|3¹⁷", "3²⁴|2³⁹", "3¹²|2²⁰", "3⁰|2¹"],
        "note_colors": ["#ffffff", "#c3b7ab", "#e7e7e7", "#878787", "#ff9f40", "#878787", "#ff9f40", "#e7e7e7", "#abb7c3", "#ffffff", "#c3b7ab", "#e7e7e7", "#878787", "#ff9f40", "#878787", "#ff9f40", "#e7e7e7", "#abb7c3", "#ffffff", "#c3b7ab", "#e7e7e7", "#abb7c3", "#ffffff", "#c3b7ab", "#e7e7e7", "#878787", "#ff9f40", "#878787", "#ff9f40", "#e7e7e7", "#abb7c3", "#ffffff", "#c3b7ab", "#e7e7e7", "#878787", "#ff9f40", "#878787", "#ff9f40", "#e7e7e7", "#abb7c3", "#ffffff", "#c3b7ab", "#e7e7e7", "#878787", "#ff9f40", "#878787", "#ff9f40", "#e7e7e7", "#abb7c3", "#ffffff", "#c3b7ab", "#e7e7e7", "#abb7c3"],       
        "equivSteps": 53,
        "key_labels": "enumerate",        
        "spectrum_colors": false,
        "rSteps": 9,
        "urSteps": 5,
        "hexSize": 40,
        "rotation": 16.102113751,
        "output": "sample",
        "fundamental": 260.74074074,
        "instrument": "rhodes",
        "short_description": "53-RI-3L Bosanquet / Wilson / Terpstra"        
      },
      {
        "name": "53-JI-13L-CT Bosanquet / Wilson / Terpstra",
        "description": "53-JI-13L Bosanquet / Wilson / Terpstra: Cam Taylor's 53-tone Just Intonation 13-Limit scale, consisting of 53 rational divisions per frequency halving/doubling, mapped on a Bosanquet / Wilson / Terpstra layout.",
        "scale": parseScale(scale_53_ji_13l_ct).scale,
        "names": ["1/1", "81/80", "33/32", "28/27", "256/243", "16/15", "13/12", "12/11", "10/9", "9/8", "8/7", "15/13", "7/6", "32/27", "6/5", "39/32", "16/13", "5/4", "81/64", "9/7", "13/10", "21/16", "4/3", "27/20", "11/8", "18/13", "45/32", "64/45", "13/9", "16/11", "40/27", "3/2", "32/21", "20/13", "14/9", "128/81", "8/5", "13/8", "64/39", "5/3", "27/16", "12/7", "26/15", "7/4", "16/9", "9/5", "11/6", "24/13", "15/8", "243/128", "27/14", "64/33", "160/81", "2/1"],
        "note_colors": ["#ffffff", "#c3b7ab", "#e7e7e7", "#878787", "#ff9f40", "#878787", "#ff9f40", "#e7e7e7", "#abb7c3", "#ffffff", "#c3b7ab", "#e7e7e7", "#878787", "#ff9f40", "#878787", "#ff9f40", "#e7e7e7", "#abb7c3", "#ffffff", "#c3b7ab", "#e7e7e7", "#abb7c3", "#ffffff", "#c3b7ab", "#e7e7e7", "#878787", "#ff9f40", "#878787", "#ff9f40", "#e7e7e7", "#abb7c3", "#ffffff", "#c3b7ab", "#e7e7e7", "#878787", "#ff9f40", "#878787", "#ff9f40", "#e7e7e7", "#abb7c3", "#ffffff", "#c3b7ab", "#e7e7e7", "#878787", "#ff9f40", "#878787", "#ff9f40", "#e7e7e7", "#abb7c3", "#ffffff", "#c3b7ab", "#e7e7e7", "#abb7c3"],
        "equivSteps": 53,
        "key_labels": "names",
        "spectrum_colors": false,
        "rSteps": 9,
        "urSteps": 4,
        "hexSize": 40,
        "rotation": 343.897886248,
        "output": "sample",
        "fundamental": 260.74074074,
        "instrument": "rhodes",
        "short_description": "53-RI-3L Bosanquet / Wilson / Terpstra Male (Western)"
      },  
    ]
  },
  {
    "name": "Equal Temperaments",
    settings: [
      {
        "name": "19-ed2 Bosanquet / Wilson / Terpstra",
        "description": "19-ed2 Bosanquet / Wilson / Terpstra: 19-tone equal tempered scale consisting of 12 sonically equal divisions per frequency halving/doubling, mapped on a Bosanquet / Wilson / Terpstra layout.",
        "scale": parseScale(scale_19_ed2).scale,
        "names": ["C", "C♯", "D♭", "D", "D♯", "E♭", "E", "E♯/F♭", "F", "F♯", "G♭", "G", "G♯", "A♭", "A", "A♯", "B♭", "B", "B♯/C♭"],
        "note_colors": ["#ffffff", "#7fbfd4", "#ff9f40", "#ffffff", "#7fbfd4", "#ff9f40", "#ffffff", "#bfaf8a", "#ffffff", "#7fbfd4", "#ff9f40", "#ffffff", "#7fbfd4", "#ff9f40", "#ffffff", "#7fbfd4", "#ff9f40", "#ffffff", "#bfaf8a"],
        "equivSteps": 19,
        "key_labels": "names",
        "spectrum_colors": false,
        "rSteps": 3,
        "urSteps": 2,
        "hexSize": 40,
        "rotation": 343.897886248,
        "output": "sample",
        "fundamental": 264.022598,
        "instrument": "harp",
        "short_description": "19-ed2 Bosanquet / Wilson / Terpstra"       
      },
      {
        "name": "31-ed2 Bosanquet / Wilson / Terpstra",
        "description": "31-ed2 Bosanquet / Wilson / Terpstra: 31-tone equal tempered scale consisting of 31 sonically equal divisions per frequency halving/doubling in standard meantone notation, mapped on a Bosanquet / Wilson / Terpstra layout. Similar to 1/4-comma meantone.",
        "scale": parseScale(scale_31_ed2).scale,
        "names": ["C", "D♭♭", "C♯", "D♭", "C×", "D", "E♭♭", "D♯", "E♭", "D×", "E", "F♭", "E♯", "F", "G♭♭", "F♯", "G♭", "F×", "G", "A♭♭", "G♯", "A♭", "G×", "A", "B♭♭", "A♯", "B♭", "A×", "B", "C♭", "B♯"],
        "note_colors": ["#ffffff", "#ff9f41", "#cfcfcf", "#bbaa93", "#7b7b7b", "#ffffff", "#ff9f41", "#cfcfcf", "#bbaa93", "#7b7b7b", "#ffffff", "#bbaa93", "#cfcfcf", "#ffffff", "#ff9f41", "#cfcfcf", "#bbaa93", "#7b7b7b", "#ffffff", "#ff9f41", "#cfcfcf", "#bbaa93", "#7b7b7b", "#ffffff", "#ff9f41", "#cfcfcf", "#bbaa93", "#7b7b7b", "#ffffff", "#bbaa93", "#cfcfcf", "#ffffff"],
        "equivSteps": 31,       
        "key_labels": "names",
        "spectrum_colors": false,
        "rSteps": 5,
        "urSteps": 3,
        "hexSize": 40,
        "rotation": 343.897886248,
        "output": "sample",
        "fundamental": 263.0921203,
        "instrument": "harpsichord",
        "short_description": "31-ed2 Bosanquet / Wilson / Terpstra"
      },
      {
        "name": "41-ed2 Bosanquet / Wilson / Terpstra",
        "description": "41-ed2 Bosanquet / Wilson / Terpstra: 41-tone equal tempered scale consisting of 41 sonically equal divisions per frequency halving/doubling, mapped on a Bosanquet / Wilson / Terpstra layout.",
        "scale": parseScale(scale_41_ed2).scale,
        "names": ["0/41", "1", "2", "3", "4", "5", "6", "7", "8", "9", "10", "11", "12", "13", "14", "15", "16", "17", "18", "19", "20", "21", "22", "23", "24", "25", "26", "27", "28", "29", "30", "31", "32", "33", "34", "35", "36", "37", "38", "39", "40"],
        "note_colors": ["#ffffff", "#c3b7ab", "#878787", "#ff9f40", "#878787", "#ff9f40", "#abb7c3", "#ffffff", "#c3b7ab", "#878787", "#ff9f40", "#878787", "#ff9f40", "#abb7c3", "#ffffff", "#c3b7ab", "#abb7c3", "#ffffff", "#c3b7ab", "#878787", "#ff9f40", "#878787", "#ff9f40", "#abb7c3", "#ffffff", "#c3b7ab", "#878787", "#ff9f40", "#878787", "#ff9f40", "#abb7c3", "#ffffff", "#c3b7ab", "#878787", "#ff9f40", "#878787", "#ff9f40", "#abb7c3", "#ffffff", "#c3b7ab", "#abb7c3"],
        "equivSteps": 41,
        "key_labels": "names",
        "spectrum_colors": false,
        "rSteps": 7,
        "urSteps": 3,
        "hexSize": 40,
        "rotation": 343.897886248,
        "output": "sample",
        "fundamental": 260.5221364,
        "instrument": "lute",
        "short_description": "41-ed2 Bosanquet / Wilson / Terpstra"  
      },
      {
        "name": "43-ed2 Bosanquet / Wilson / Terpstra",
        "description": "43-ed2 Bosanquet / Wilson / Terpstra: 41-tone equal tempered scale consisting of 43 sonically equal divisions per frequency halving/doubling, mapped on a Bosanquet / Wilson / Terpstra layout. Similar to 1/5-comma Meantone.",
        "scale": parseScale(scale_43_ed2).scale,
        "names": ["0/43", "1", "2", "3", "4", "5", "6", "7", "8", "9", "10", "11", "12", "13", "14", "15", "16", "17", "18", "19", "20", "21", "22", "23", "24", "25", "26", "27", "28", "29", "30", "31", "32", "33", "34", "35", "36", "37", "38", "39", "40", "41", "42"],
        "note_colors": ["#ffffff", "#c3b7ab", "#ff9f40", "#878787", "#ff9f40", "#878787", "#abb7c3", "#ffffff", "#c3b7ab", "#ff9f40", "#878787", "#ff9f40", "#878787", "#abb7c3", "#ffffff", "#c3b7ab", "#ff9f40", "#abb7c3", "#ffffff", "#c3b7ab", "#ff9f40", "#878787", "#ff9f40", "#878787", "#abb7c3", "#ffffff", "#c3b7ab", "#ff9f40", "#878787", "#ff9f40", "#878787", "#abb7c3", "#ffffff", "#c3b7ab", "#ff9f40", "#878787", "#ff9f40", "#878787", "#abb7c3", "#ffffff", "#c3b7ab", "#878787", "#abb7c3"],
        "equivSteps": 43,
        "key_labels": "names",
        "spectrum_colors": false,
        "rSteps": 7,
        "urSteps": 4,
        "hexSize": 40,
        "rotation": 343.897886248,
        "output": "sample",
        "fundamental": 262.682024,
        "instrument": "lute",
        "short_description": "43-ed2 Bosanquet / Wilson / Terpstra"  
      },
      {
        "name": "53-ed2 Bosanquet / Wilson / Terpstra",
        "description": "53-ed2 Bosanquet / Wilson / Terpstra: 53-tone equal tempered scale consisting of 53 sonically equal divisions per frequency halving/doubling, mapped on a Bosanquet / Wilson / Terpstra layout.",
        "scale": parseScale(scale_53_ed2).scale,
        "names": ["0/53", "1", "2", "3", "4", "5", "6", "7", "8", "9", "10", "11", "12", "13", "14", "15", "16", "17", "18", "19", "20", "21", "22", "23", "24", "25", "26", "27", "28", "29", "30", "31", "32", "33", "34", "35", "36", "37", "38", "39", "40", "41", "42", "43", "44", "45", "46", "47", "48", "49", "50", "51", "52"],
        "note_colors": ["#ffffff", "#c3b7ab", "#e7e7e7", "#878787", "#ff9f40", "#878787", "#ff9f40", "#f2d2de", "#abb7c3", "#ffffff", "#c3b7ab", "#e7e7e7", "#878787", "#ff9f40", "#878787", "#ff9f40", "#f2d2de", "#abb7c3", "#ffffff", "#c3b7ab", "#e7e7e7", "#abb7c3", "#ffffff", "#c3b7ab", "#e7e7e7", "#878787", "#ff9f40", "#878787", "#ff9f40", "#f2d2de", "#abb7c3", "#ffffff", "#c3b7ab", "#e7e7e7", "#878787", "#ff9f40", "#878787", "#ff9f40", "#f2d2de", "#abb7c3", "#ffffff", "#c3b7ab", "#e7e7e7", "#878787", "#ff9f40", "#878787", "#ff9f40", "#f2d2de", "#abb7c3", "#ffffff", "#c3b7ab", "#e7e7e7", "#abb7c3"],       
        "equivSteps": 53,
        "key_labels": "names",
        "spectrum_colors": false,
        "rSteps": 9,
        "urSteps": 4,
        "hexSize": 40,
        "rotation": 343.897886248,
        "output": "sample",
        "fundamental": 260.771561,
        "instrument": "rhodes",
        "short_description": "53-ed2 Bosanquet / Wilson / Terpstra"  
      },
      {
        "name": "55-ed2 Bosanquet / Wilson / Terpstra",
        "description": "55-ed2 Bosanquet / Wilson / Terpstra: 53-tone equal tempered scale consisting of 53 sonically equal divisions per frequency halving/doubling, mapped on a Bosanquet / Wilson / Terpstra layout. Similar to 1/6-comma meantone (Telemann / Mozart).",
        "scale": parseScale(scale_55_ed2).scale,
        "names": ["0/55", "1", "2", "3", "4", "5", "6", "7", "8", "9", "10", "11", "12", "13", "14", "15", "16", "17", "18", "19", "20", "21", "22", "23", "24", "25", "26", "27", "28", "29", "30", "31", "32", "33", "34", "35", "36", "37", "38", "39", "40", "41", "42", "43", "44", "45", "46", "47", "48", "49", "50", "51", "52", "53", "54"],
        "note_colors": ["#ffffff", "#c3b7ab", "#e7e7e7", "#ff9f40", "#878787", "#ff9f40", "#878787", "#f2d2de", "#abb7c3", "#ffffff", "#c3b7ab", "#e7e7e7", "#ff9f40", "#878787", "#ff9f40", "#878787", "#f2d2de", "#abb7c3", "#ffffff", "#c3b7ab", "#e7e7e7", "#f2d2de", "#abb7c3", "#ffffff", "#c3b7ab", "#e7e7e7", "#ff9f40", "#878787", "#ff9f40", "#878787", "#f2d2de", "#abb7c3", "#ffffff", "#c3b7ab", "#e7e7e7", "#ff9f40", "#878787", "#ff9f40", "#878787", "#f2d2de", "#abb7c3", "#ffffff", "#c3b7ab", "#e7e7e7", "#ff9f40", "#878787", "#ff9f40", "#878787", "#f2d2de", "#abb7c3", "#ffffff", "#c3b7ab", "#e7e7e7", "#f2d2de","#abb7c3"],       
        "equivSteps": 5,
        "key_labels": "names",
        "spectrum_colors": false,
        "rSteps": 9,
        "urSteps": 5,
        "hexSize": 40,
        "rotation": 343.897886248,
        "output": "sample",
        "fundamental": 262.451161,
        "instrument": "rhodes",
        "short_description": "55-ed2 Bosanquet / Wilson / Terpstra"  
      }
    ]},
];

export default presets;

export const default_settings = presets[0].settings[0];
