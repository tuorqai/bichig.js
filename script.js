
"use strict";

//------------------------------------------------------------------------------

function sortRules(arrayOfUnsortedRules) {
    // Merge all rules into single dictionary
    let unsortedRules = {};
    for (let i = 0; i < arrayOfUnsortedRules.length; i++) {
        for (let key in arrayOfUnsortedRules[i]) {
            unsortedRules[key] = arrayOfUnsortedRules[i][key];
        }
    }

    // Sort keys by length (descending order)
    const keys = Object.keys(unsortedRules)
        .sort((a, b) => b.length - a.length);

    // Fill in new table sorted by length of keys
    let sortedRules = {};
    for (let i = 0; i < keys.length; i++) {
        if (unsortedRules[keys[i]] === null) {
            continue;
        }
        sortedRules[keys[i]] = unsortedRules[keys[i]];
    }

    return sortedRules;
}

function performTransliteration(src, rules) {
    let result = "";
    let skip = 0;

    for (let i = 0; i < src.length; i += skip) {
        skip = 1;

        // Backslash is an escape character
        if (src[i] == '\\' && (i != src.length - 1)) {
            result += src[i + 1];
            skip += 1; // skip next character
            continue;
        }

        let substituted = false;

        for (const key in rules) {
            const substr = src.substring(i, i + key.length)
                .toLocaleLowerCase();
            
            if (substr == key) {
                result += rules[key];
                skip += key.length - 1;
                substituted = true;
                break;
            }
        }

        if (substituted) {
            continue;
        }

        // Prevent accidentally typing unassigned Latin letters

        if (src[i] >= 'A' && src[i] <= 'Z') {
            continue;
        }

        if (src[i] >= 'a' && src[i] <= 'z') {
            continue;
        }

        result += src[i];
    }

    return result;
}

//------------------------------------------------------------------------------

/**
 * Common transliteration rules.
 */
const basicRules = {
    "_":    "",

    "#1":   "\u180b",   // FVS1
    "#2":   "\u180c",   // FVS2
    "#3":   "\u180d",   // FVS3
    "~":    "\u180e",   // MVS
    "#4":   "\u180f",   // FVS4
    "[":    "\u200c",   // ZWNJ
    "]":    "\u200d",   // ZWJ

    "*":    "\u1800",
    "...":  "\u1801",
    ",":    "\u1802",
    ".":    "\u1803",
    ":":    "\u1804",
    ";":    "\u1805",
    "-":    "\u1806",

    "0":    "\u1810",
    "1":    "\u1811",
    "2":    "\u1812",
    "3":    "\u1813",
    "4":    "\u1814",
    "5":    "\u1815",
    "6":    "\u1816",
    "7":    "\u1817",
    "8":    "\u1818",
    "9":    "\u1819",
};

/**
 * Transliteration rules for Mongolian.
 * Includes only native letters.
 */
const mongolianRules = {
    "a":    "\u1820",   // Mongolian A
    "e":    "\u1821",   // Mongolian E
    "i":    "\u1822",   // Mongolian I
    "o":    "\u1823",   // Mongolian O
    "u":    "\u1824",   // Mongolian U
    "oe":   "\u1825",   // Mongolian Ö
    "ue":   "\u1826",   // Mongolian Ü
    "n":    "\u1828",   // Mongolian Na
    "ng":   "\u1829",   // Mongolian Ang
    "b":    "\u182a",   // Mongolian Ba
    "p":    "\u182b",   // Mongolian Pa
    "x":    "\u182c",   // Mongolian Qa
    "g":    "\u182d",   // Mongolian Ga
    "m":    "\u182e",   // Mongolian Ma
    "l":    "\u182f",   // Mongolian La
    "s":    "\u1830",   // Mongolian Sa
    "sh":   "\u1831",   // Mongolian Ša
    "t":    "\u1832",   // Mongolian Ta
    "d":    "\u1833",   // Mongolian Da
    "ch":   "\u1834",   // Mongolian Ča
    "j":    "\u1835",   // Mongolian Ja
    "y":    "\u1836",   // Mongolian Ya
    "r":    "\u1837",   // Mongolian Ra
};

/**
 * Extra letters for Mongolian.
 */
const galikRules = {
    "ee":   "\u1827",   // Mongolian Ē
    "w":    "\u1838",   // Mongolian Wa
    "f":    "\u1839",   // Mongolian Fa
    "k":    "\u183a",   // Mongolian Ka
    "kh":   "\u183b",   // Mongolian Kha
    "c":    "\u183c",   // Mongolian Ca
    "z":    "\u183d",   // Mongolian Za
    "h":    "\u183e",   // Mongolian Ha
    "rh":   "\u183f",   // Mongolian Ža
    "lh":   "\u1840",   // Mongolian Lha
    "ch\'": "\u1841",   // Mongolian Dža
    "zh\'": "\u1842",   // Mongolian Tša
};

/**
 * Transliteration rules for Manchu.
 * (extended from Mongolian)
 * (table may contain mistakes)
 */
const manchuRules = {
    "oe":   null,       // suppress 'oe'
    "ue":   null,       // suppress 'ue'

    "e":    "\u185d",   // Xibe E
    "i":    "\u1873",   // Manchu I
    "u":    "\u1860",   // Xibe Ü
    "uu":   "\u1861",   // Xibe Ū
    "ii":   "\u185f",   // Xibe Ï

    "x":    "\u1874",   // Manchu Ka
    "h":    "\u1865",   // Xibe Ha
    "p":    "\u1866",   // Xibe Pa
    "g":    "\u1864",   // Xibe Ga
    "sh":   "\u1867",   // Xibe Ša
    "t":    "\u1868",   // Xibe Ta
    "d":    "\u1869",   // Xibe Da
    "r":    "\u1875",   // Manchu Ra
    "f":    "\u1876",   // Manchu Fa
    "w":    "\u1838",   // Mongolian Wa

    "g\'":  "\u186c",   // Xibe Gaa
    "h\'":  "\u186d",   // Xibe Haa
    "c":    "\u186e",   // Xibe Ca
    "z":    "\u186f",   // Xibe Za
    "ch\'": "\u1871",   // Xibe Cha
    "zh\'": "\u1877",   // Manchu Zha
    "rh":   "\u1870",   // Xibe Raa
};

/**
 * Transliteration rules for Xibe.
 * (extended from Manchu)
 */
const xibeRules = {
    "i":    "\u185e",   // Xibe I
    "ng":   "\u1862",   // Xibe Ang
    "x":    "\u1863",   // Xibe Ka
    "j":    "\u186a",   // Xibe Ja
    "r":    "\u1837",   // Mongolian Ra
    "f":    "\u186b",   // Xibe Fa
    "zh\'": "\u1872",   // Xibe Ja
};

/**
 * Transliteration rules for Clear Script.
 */
const todoRules = {
    "~":    "\u1843",   // Todo Long Vowel Sign

    "a":    "\u1820",   // Mongolian A
    "e":    "\u1844",   // Todo E
    "i":    "\u1845",   // Todo I
    "o":    "\u1846",   // Todo O
    "u":    "\u1847",   // Todo U
    "oe":   "\u1848",   // Todo Ö
    "ue":   "\u1849",   // Todo Ü

    "b":    "\u184b",   // Todo Ba
    "m":    "\u184f",   // Todo Ma
    "l":    "\u182f",   // Mongolian La
    "s":    "\u1830",   // Mongolian Sa
    "sh":   "\u1831",   // Mongolian Ša
    "n":    "\u1828",   // Mongolian Na
    "x":    "\u184d",   // Todo Qa
    "g":    "\u184e",   // Todo Ga
    "t":    "\u1850",   // Todo Ta
    "d":    "\u1851",   // Todo Da
    "c":    "\u1854",   // Todo Ca
    "ch":   "\u1852",   // Todo Ča
    "z":    "\u1834",   // Mongolian Ča
    "j":    "\u1853",   // Todo Ja
    "y":    "\u1855",   // Todo Ya
    "r":    "\u1837",   // Mongolian Ra
    "ng":   "\u184a",   // Todo Ang

    "p":    "\u184c",   // Todo Pa
    "h":    "\u1859",   // Todo Haa
    "g\'":  "\u1858",   // Todo Gaa
    "k":    "\u1857",   // Todo Ka
    "j\'":  "\u185a",   // Todo Jia
    "n\'":  "\u185b",   // Todo Nia
    "z\'":  "\u185c",   // Todo Dza
    "w":    "\u1856",   // Todo Wa
};

const rules = {
    "mongolian": sortRules([basicRules, mongolianRules, galikRules]),
    "manchu": sortRules([basicRules, mongolianRules, manchuRules]),
    "xibe": sortRules([basicRules, mongolianRules, manchuRules, xibeRules]),
    "todo": sortRules([basicRules, todoRules]),
};

//------------------------------------------------------------------------------

function drawRuleTable(ruleTable) {
    const specialOut = {
        "\u180b": "FVS1",
        "\u180c": "FVS2",
        "\u180d": "FVS3",
        "\u180e": "MVS",
        "\u180f": "FVS4",
        "\u200c": "ZWNJ",
        "\u200d": "ZWJ",
        "": "(break)",
    };

    /** @type HTMLDivElement */
    let tableContainer = document.getElementById("table-container");

    while (tableContainer.firstChild) {
        tableContainer.removeChild(tableContainer.firstChild);
    }

    let table = document.createElement("table");
    tableContainer.appendChild(table);

    let header = document.createElement("tr");
    table.appendChild(header);

    let headerInputChar = document.createElement("th");
    let headerOutputCode = document.createElement("th");
    let headerOutputChar = document.createElement("th");

    headerInputChar.innerText = "Input";
    headerOutputCode.innerText = "Unicode (Code)";
    headerOutputChar.innerText = "Unicode (Visual)";

    header.appendChild(headerInputChar);
    header.appendChild(headerOutputCode);
    header.appendChild(headerOutputChar);
    
    const sortedKeys = Object.keys(ruleTable).sort();

    sortedKeys.forEach((key) => {
        const out = ruleTable[key];
        const ucode = out.charCodeAt(0).toString(16);

        const row = document.createElement("tr");
        const rowInputChar = document.createElement("td");
        const rowOutputCode = document.createElement("td");
        const rowOutputChar = document.createElement("td");

        rowInputChar.innerHTML = `<code>${key}</code>`;

        if (ucode != "NaN") {
            rowOutputCode.innerHTML = `<code>U+${ucode}</code>`;
        } else {
            rowOutputCode.innerHTML = `<code>(none)</code>`;
        }

        if (out in specialOut) {
            rowOutputChar.innerHTML = `<p>${specialOut[out]}</p>`;
        } else {
            rowOutputChar.classList = "mongol";
            rowOutputChar.innerHTML = `<p>${out}</p>`;
        }

        rowOutputChar.style.textAlign = "center";

        row.appendChild(rowInputChar);
        row.appendChild(rowOutputCode);
        row.appendChild(rowOutputChar);

        table.appendChild(row);
    });
}

//------------------------------------------------------------------------------

const mongolianFonts = {
    "noto": "Noto Sans Mongolian",
    "mnglwhite": "Mongolian White",
    "mnglart": "Mongolian Art",
    "mnglwriting": "Mongolian Writing",
    "mngltitle": "Mongolian Title",
};

function applyFont(font) {
    let elements = document.getElementsByClassName("mongol");

    for (let i = 0; i < elements.length; i++) {
        elements[i].style.fontFamily = mongolianFonts[font];
    }
}

//------------------------------------------------------------------------------

/** @type HTMLSelectElement */
let fontSelect = document.getElementById("mng-font-select");

for (let id in mongolianFonts) {
    let option = document.createElement("option");

    option.value = id;
    option.innerText = mongolianFonts[id];

    fontSelect.appendChild(option);
}

if (localStorage['fontString']) {
    fontSelect.value = localStorage['fontString'];
}

fontSelect.addEventListener('change', () => {
    localStorage['fontString'] = fontSelect.value;
    applyFont(fontSelect.value);
});

//----------------------------------------------------------

/** @type HTMLSelectElement */
let modeSelect = document.getElementById("mode-select");

for (let id in rules) {
    let option = document.createElement("option");

    option.value = id;
    option.innerText = id;

    modeSelect.appendChild(option);
}

if (localStorage['modeString']) {
    modeSelect.value = localStorage['modeString'];
}

modeSelect.addEventListener('change', () => {
    localStorage['modeString'] = modeSelect.value;
    ioOutput.value = performTransliteration(ioInput.value, rules[modeSelect.value]);
    drawRuleTable(rules[modeSelect.value]);
    applyFont(fontSelect.value);
});

//----------------------------------------------------------

/** @type HTMLTextAreaElement */
let ioInput = document.getElementById("io-input");

/** @type HTMLTextAreaElement */
let ioOutput = document.getElementById("io-output");

ioInput.value = localStorage['ioInputString'] || "tabatai morilagtun";
ioOutput.value = performTransliteration(ioInput.value, rules[modeSelect.value]);
ioOutput.disabled = true;

ioInput.addEventListener('input', () => {
    localStorage['ioInputString'] = ioInput.value;
    ioOutput.value = performTransliteration(ioInput.value, rules[modeSelect.value]);
});

//----------------------------------------------------------

drawRuleTable(rules[modeSelect.value]);
applyFont(fontSelect.value);
