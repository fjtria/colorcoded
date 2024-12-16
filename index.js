// Detect input type
const dropdown = document.getElementById("input-type");
const inputField = document.getElementById("input");
const convertButton = document.getElementById("convert-button");

// Event listener for dropdown change
dropdown.addEventListener("change", changeColorMode);

// Initialize the default color mode
changeColorMode();

function changeColorMode() {
    const selection = dropdown.value;

    // Update the placeholder dynamically based on the selected input type
    if (selection === 'hex') {
        inputField.placeholder = "Enter HEX code (e.g., #03F)";
    } else if (selection === 'rgb') {
        inputField.placeholder = "Enter RGB code (e.g., rgb(255, 255, 255))";
    } else if (selection === 'cmyk') {
        inputField.placeholder = "Enter CMYK code (e.g., cmyk(0%, 100%, 100%, 0%))";
    } else if (selection === 'hsl') {
        inputField.placeholder = "Enter HSL code (e.g., hsl(0, 100%, 50%))";
    }

    // Remove previous listeners to avoid duplicate calls
    convertButton.removeEventListener('click', convertHEX);
    convertButton.removeEventListener('click', convertRGB);
    convertButton.removeEventListener('click', convertCMYK);
    convertButton.removeEventListener('click', convertHSL);

    // Add the correct listener based on the selection
    if (selection === 'hex') {
        convertButton.addEventListener('click', convertHEX);
    } else if (selection === 'rgb') {
        convertButton.addEventListener('click', convertRGB);
    } else if (selection === 'cmyk') {
        convertButton.addEventListener('click', convertCMYK);
    } else if (selection === 'hsl') {
        convertButton.addEventListener('click', convertHSL);
    }
}

function convertHEX() {
    let hex = inputField.value;

    // Input sanitation
    hex = hex.replace(/^#/, "");
    if (!/^([A-Fa-f0-9]{3}|[A-Fa-f0-9]{6})$/.test(hex)) {
        document.getElementById("output").innerText = "Invalid HEX code!";
        return;
    }
    if (hex.length === 3) {
        hex = hex.split("").map((char) => char + char).join("");
    }
  
    // HEX to RGB
    const red = parseInt(hex.slice(0, 2), 16);
    const green = parseInt(hex.slice(2, 4), 16);
    const blue = parseInt(hex.slice(4, 6), 16);
  
    // Normalized RGB
    const redNorm = red / 255;
    const greenNorm = green / 255;
    const blueNorm = blue / 255;

    // RGB to CMYK
    let key = 1 - Math.max(redNorm, greenNorm, blueNorm);
    let cyan = 0, magenta = 0, yellow = 0;
    if (key !== 1) {
        cyan = Math.round((1 - redNorm - key) / (1 - key) * 100);
        magenta = Math.round((1 - greenNorm - key) / (1 - key) * 100);
        yellow = Math.round((1 - blueNorm - key) / (1 - key) * 100);
        key = Math.round(key * 100);
    }
  
    // RGB to HSL
    const cmax = Math.max(redNorm, greenNorm, blueNorm);
    const cmin = Math.min(redNorm, greenNorm, blueNorm);
    const delta = cmax - cmin;
    let hue = 0;
    let saturation = 0;
    let luminance = (cmax + cmin) / 2;
    if (delta !== 0) {
        saturation = luminance > 0.5 ? delta / (2 - cmax - cmin) : delta / (cmax + cmin);

        if (cmax === redNorm) {
            hue = (greenNorm - blueNorm) / delta + (greenNorm < blueNorm ? 6 : 0);
        } else if (cmax === greenNorm) {
            hue = (blueNorm - redNorm) / delta + 2;
        } else {
            hue = (redNorm - greenNorm) / delta + 4;
        }
        hue /= 6;
    }
    hue = Math.round(hue * 360);
    saturation = Math.round(saturation * 100);
    luminance = Math.round(luminance * 100);

    // Output
    document.getElementById("output").innerHTML = `
        <p>#${hex}</p>
        <p>rgb(${red}, ${green}, ${blue})</p>
        <p>cmyk(${cyan}%, ${magenta}%, ${yellow}%, ${key}%)</p>
        <p>hsl(${hue}, ${saturation}%, ${luminance}%)</p>
    `;
}

function convertRGB() {
    let rgb = inputField.value;
    
    // Input sanitation
    rgb = rgb.replace(/rgb\(|\)/g, "").replace(/\s+/g, " ").trim();
    const rgbValues = rgb.split(/[, ]+/).map(Number);
    if (
        rgbValues.length !== 3 || 
        rgbValues.some(value => isNaN(value) || value < 0 || value > 255)
    ) {
        document.getElementById("output").innerText = "Invalid RGB code!";
        return;
    }

    const [red, green, blue] = rgbValues;

    // RGB to HEX
    const hex = `#${[red, green, blue].map(value => value.toString(16).padStart(2, '0')).join('')}`;

    // Normalize RGB
    const redNorm = red / 255;
    const greenNorm = green / 255;
    const blueNorm = blue / 255;

    // RGB to CMYK
    let key = 1 - Math.max(redNorm, greenNorm, blueNorm);
    let cyan = 0, magenta = 0, yellow = 0;
    if (key !== 1) {
        cyan = Math.round((1 - redNorm - key) / (1 - key) * 100);
        magenta = Math.round((1 - greenNorm - key) / (1 - key) * 100);
        yellow = Math.round((1 - blueNorm - key) / (1 - key) * 100);
        key = Math.round(key * 100);
    }

    // RGB to HSL
    const cmax = Math.max(redNorm, greenNorm, blueNorm);
    const cmin = Math.min(redNorm, greenNorm, blueNorm);
    const delta = cmax - cmin;
    let hue = 0;
    let saturation = 0;
    let luminance = (cmax + cmin) / 2;
    if (delta !== 0) {
        saturation = luminance > 0.5 ? delta / (2 - cmax - cmin) : delta / (cmax + cmin);

        if (cmax === redNorm) {
            hue = (greenNorm - blueNorm) / delta + (greenNorm < blueNorm ? 6 : 0);
        } else if (cmax === greenNorm) {
            hue = (blueNorm - redNorm) / delta + 2;
        } else {
            hue = (redNorm - greenNorm) / delta + 4;
        }
        hue /= 6;
    }
    hue = Math.round(hue * 360);
    saturation = Math.round(saturation * 100);
    luminance = Math.round(luminance * 100);

    // Output
    document.getElementById("output").innerHTML = `
        <p>${hex}</p>
        <p>rgb(${red}, ${green}, ${blue})</p>
        <p>cmyk(${cyan}%, ${magenta}%, ${yellow}%, ${key}%)</p>
        <p>hsl(${hue}, ${saturation}%, ${luminance}%)</p>
    `;
}

function convertCMYK() {
    let cmyk = inputField.value.trim();

    // Remove cmyk() and replace multiple spaces
    cmyk = cmyk.replace(/cmyk\(|\)/gi, "").replace(/\s+/g, " ");

    // Split values using  either spaces or commas
    const cmykValues = cmyk.split(/[, ]+/);

    // Ensure 4 percent values
    if (
        cmykValues.length !== 4 ||
        cmykValues.some(value => !/^\d+%$/.test(value) || parseInt(value, 10) < 0 || parseInt(value, 10) > 100)
    ) {
        document.getElementById("output").innerHTML = "Invalid CMYK code! Please use a format like '100%, 100%, 100%, 100%' or '100% 100% 100% 100%'.";
        return;
    }

    // Convert percents to decimals
    let cyan = parseInt(cmykValues[0], 10) / 100;
    let magenta = parseInt(cmykValues[1], 10) / 100;
    let yellow = parseInt(cmykValues[2], 10) / 100;
    let key = parseInt(cmykValues[3], 10) / 100;

    // CMYK to RGB
    let red = Math.round(255 * (1 - cyan) * (1 - key));
    let green = Math.round(255 * (1 - magenta) * (1 - key));
    let blue = Math.round(255 * (1 - yellow) * (1 - key));

    // RGB to HEX
    let hex = [red, green, blue].map(value => value.toString(16).padStart(2, "0")).join("");

    // RGB to HSL
    let redNorm = red / 255;
    let greenNorm = green / 255;
    let blueNorm = blue / 255;

    let cmax = Math.max(redNorm, greenNorm, blueNorm);
    let cmin = Math.min(redNorm, greenNorm, blueNorm);
    let delta = cmax - cmin;

    let hue = 0;
    let saturation = 0;
    let luminance = (cmax + cmin) / 2;

    if (delta !== 0) {
        saturation = luminance > 0.5 ? delta / (2 - cmax - cmin) : delta / (cmax + cmin);

        if (cmax === redNorm) {
            hue = (greenNorm - blueNorm) / delta + (greenNorm < blueNorm ? 6 : 0);
        } else if (cmax === greenNorm) {
            hue = (blueNorm - redNorm) / delta + 2;
        } else {
            hue = (redNorm - greenNorm) / delta + 4;
        }
        hue /= 6;
    }

    hue = Math.round(hue * 360);
    saturation = Math.round(saturation * 100);
    luminance = Math.round(luminance * 100);

    // Output
    document.getElementById("output").innerHTML = `
        <p>#${hex}</p>
        <p>rgb(${red}, ${green}, ${blue})</p>
        <p>cmyk(${Math.round(cyan * 100)}%, ${Math.round(magenta * 100)}%, ${Math.round(yellow * 100)}%, ${Math.round(key * 100)}%)</p>
        <p>hsl(${hue}, ${saturation}%, ${luminance}%)</p>
    `;
}
  


function convertHSL() {
    document.getElementById("output").innerHTML = "<p>HSL conversion is not implemented yet.</p>";
}
