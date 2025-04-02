// Hacked Text Effect: https://codepen.io/Hyperplexed/full/rNrJgrd
const letters = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz";
let interval = null;
document.querySelector("#hacked").onmouseover = event => {  
    let iteration = 0;  
    clearInterval(interval);
    interval = setInterval(() => {
        event.target.innerText = event.target.innerText
        .split("")
        .map((letter, index) => {
            if(index < iteration) {
                return event.target.dataset.value[index];
            }
            return letters[Math.floor(Math.random() * 52)]
        })
        .join("");
        if(iteration >= event.target.dataset.value.length){ 
            clearInterval(interval);
        }
        iteration += 1 / 3;
    }, 45);
}

// DOM Elements
const dropdown = document.getElementById("input-type");
const inputField = document.getElementById("input");
const convertButton = document.getElementById("convert-button");
const output = document.getElementById("output");

function clearInputField() {
    inputField.value = "";
  }

// Listen for dropdown selection change
dropdown.addEventListener("change", changeColorMode);
changeColorMode(); // Initialize default color mode

// Change mode
function changeColorMode() {
    const selection = dropdown.value;

    // Text field placeholder
    const placeholders = {
        hex: "#005A9C",
        rgb: "rgb(0, 90, 156)",
        cmyk: "cmyk(100%, 42%, 0%, 39%)",
        hsl: "hsl(205, 100%, 31%)",
    };
    inputField.placeholder = placeholders[selection];
    clearInputField();
}

// Listen for enter key press
inputField.addEventListener("keydown", (event) => {
    if (event.key === "Enter") {
      convertButton.click();
      clearInputField();
    }
  });

// Pass to correct conversion mode
convertButton.addEventListener("click", () => {
    const mode = dropdown.value;
    const input = inputField.value.trim();

    let hex, rgb, cmyk, hsl;

    if (mode === "hex") {
        hex = sanitizeHex(input);
        if (hex) {
            rgb = hexToRGB(hex);
            cmyk = rgbToCMYK(rgb);
            hsl = rgbToHSL(rgb);
        }
    } else if (mode === "rgb") {
        rgb = sanitizeRGB(input);
        if (rgb) {
            hex = rgbToHex(rgb);
            cmyk = rgbToCMYK(rgb);
            hsl = rgbToHSL(rgb);
        }
    } else if (mode === "cmyk") {
        cmyk = sanitizeCMYK(input);
        if (cmyk) {
            rgb = cmykToRGB(cmyk);
            hex = rgbToHex(rgb);
            hsl = rgbToHSL(rgb);
        }
    } else if (mode === "hsl") {
        hsl = sanitizeHSL(input);
        if (hsl) {
            rgb = hslToRGB(hsl);
            hex = rgbToHex(rgb);
            cmyk = rgbToCMYK(rgb);
        }
    }

    // Display result or error
    if (hex || rgb || cmyk || hsl) {
        displayOutput(hex, rgb, cmyk, hsl);
    } else {
        displayError("Invalid input!");
    }

    clearInputField();
});

// HEX
function sanitizeHex(input) {
    let hex = input.replace(/^#/, "");
    // Accept #FFF, #FFFFFF, FFF, FFFFFF
    if (/^([A-Fa-f0-9]{3}|[A-Fa-f0-9]{6})$/.test(hex)) {
        hex = hex.length === 3
            ? hex.split("").map(c => c + c).join("")
            : hex;
        return `#${hex}`; // Always prepend '#'
    }
    return null;
}

function hexToRGB(hex) {
    return {
        red: parseInt(hex.slice(1, 3), 16),
        green: parseInt(hex.slice(3, 5), 16),
        blue: parseInt(hex.slice(5, 7), 16),
    };
}

// RGB
function sanitizeRGB(input) {
    // Accept rgb(255, 255, 255) or 255 255 255
    const match = input.match(/^rgb\((\d{1,3}),\s*(\d{1,3}),\s*(\d{1,3})\)$/) ||
                  input.match(/^(\d{1,3})\s+(\d{1,3})\s+(\d{1,3})$/);
    if (match) {
        const [red, green, blue] = match.slice(1, 4).map(Number);
        if ([red, green, blue].every(v => v >= 0 && v <= 255)) {
            return { red, green, blue };
        }
    }
    return null;
}

function rgbToHex({ red, green, blue }) {
    return `#${[red, green, blue].map(v => v.toString(16).padStart(2, "0")).join("")}`;
}

// CMYK
function sanitizeCMYK(input) {
    // Accept cmyk(100%, 100%, 100%, 100%)
    const match = input.match(/^\s*cmyk\((\d+)%?,\s*(\d+)%?,\s*(\d+)%?,\s*(\d+)%?\s*\)$/);
    if (match) {
        const cmyk = match.slice(1, 5).map(Number);
        if (cmyk.every(val => val >= 0 && val <= 100)) {
            return cmyk;
        }
    }
    return null;
}

function cmykToRGB([c, m, y, k]) {
    const factor = 255 * (1 - k / 100);
    return {
        red: Math.round(factor * (1 - c / 100)),
        green: Math.round(factor * (1 - m / 100)),
        blue: Math.round(factor * (1 - y / 100)),
    };
}

// HSL
function sanitizeHSL(input) {
    // Accept hsl(360, 100%, 100%)
    const match = input.match(/^\s*hsl\((\d+),\s*(\d+)%?,\s*(\d+)%?\s*\)$/);
    if (match) {
        const [hue, saturation, lightness] = match.slice(1, 4).map(Number);
        return {
            hue: hue % 360, 
            saturation: saturation / 100, 
            lightness: lightness / 100
        };
    }
    return null;
}

function hslToRGB({ hue, saturation, lightness }) {
    const chroma = (1 - Math.abs(2 * lightness - 1)) * saturation;
    const x = chroma * (1 - Math.abs((hue / 60) % 2 - 1));
    const m = lightness - chroma / 2;

    let [r, g, b] = hue < 60 ? [chroma, x, 0]
        : hue < 120 ? [x, chroma, 0]
        : hue < 180 ? [0, chroma, x]
        : hue < 240 ? [0, x, chroma]
        : hue < 300 ? [x, 0, chroma]
        : [chroma, 0, x];

    return {
        red: Math.round((r + m) * 255),
        green: Math.round((g + m) * 255),
        blue: Math.round((b + m) * 255)
    };
}

// RGB to CMYK
function rgbToCMYK({ red, green, blue }) {
    const r = red / 255, g = green / 255, b = blue / 255;
    const k = 1 - Math.max(r, g, b);
    return k === 1 ? [0, 0, 0, 100] : [
        Math.round((1 - r - k) / (1 - k) * 100),
        Math.round((1 - g - k) / (1 - k) * 100),
        Math.round((1 - b - k) / (1 - k) * 100),
        Math.round(k * 100)
    ];
}

// RGB to HSL
function rgbToHSL({ red, green, blue }) {
    const r = red / 255, g = green / 255, b = blue / 255;
    const max = Math.max(r, g, b), min = Math.min(r, g, b);
    const delta = max - min;

    let h = 0, s = 0, l = (max + min) / 2;
    if (delta) {
        s = delta / (1 - Math.abs(2 * l - 1));
        h = max === r ? (g - b) / delta + (g < b ? 6 : 0)
            : max === g ? (b - r) / delta + 2
            : (r - g) / delta + 4;
        h = Math.round(h * 60);
    }
    return { hue: h, saturation: Math.round(s * 100), lightness: Math.round(l * 100) };
}

// Output
function displayOutput(hex, rgb, cmyk, hsl) {
    // Format output
    output.innerHTML = `
        <div>
            ${hex ? `<p><button class="copy-button" data-value="${hex}">Copy</button> HEX: ${hex}</p>` : ""}
            ${rgb ? `<p><button class="copy-button" data-value="rgb(${rgb.red}, ${rgb.green}, ${rgb.blue})">Copy</button> RGB: rgb(${rgb.red}, ${rgb.green}, ${rgb.blue})</p>` : ""}
            ${cmyk ? `<p><button class="copy-button" data-value="cmyk(${cmyk[0]}%, ${cmyk[1]}%, ${cmyk[2]}%, ${cmyk[3]}%)">Copy</button> CMYK: cmyk(${cmyk[0]}%, ${cmyk[1]}%, ${cmyk[2]}%, ${cmyk[3]}%)</p>` : ""}
            ${hsl ? `<p><button class="copy-button" data-value="hsl(${hsl.hue}, ${hsl.saturation}%, ${hsl.lightness}%)">Copy</button> HSL: hsl(${hsl.hue}, ${hsl.saturation}%, ${hsl.lightness}%)</p>` : ""}
        </div>
        <div>
            <div id="color-preview"></div>
        </div>
    `;
  
    // Add event listeners to copy buttons
    const copyButtons = output.querySelectorAll('.copy-button');
    copyButtons.forEach((button) => {
      button.addEventListener('click', () => {
        const valueToCopy = button.getAttribute('data-value');
        navigator.clipboard.writeText(valueToCopy).then(() => {
          console.log(`Copied ${valueToCopy} to clipboard`);
        }).catch((err) => {
          console.error('Error copying to clipboard:', err);
        });
      });
    });
  
    // Update color preview
    const colorPreview = document.getElementById("color-preview");
    if (hex) {
      colorPreview.style.backgroundColor = hex;
    }
  }
// Format error message
function displayError(message) {
    output.innerHTML = `<p class="error">${message}</p>`;
}
