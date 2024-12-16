// Detect input type
const dropdown = document.getElementById("input-type");
const inputButton = document.getElementById("input");
dropdown.addEventListener("change", changeColorMode);
changeColorMode();

function changeColorMode(event) {
    const selection = dropdown.value;
    
    // Clear previous listener
    inputButton.removeEventListener('click', convertHEX);
    inputButton.removeEventListener('click', convertRGB);
    inputButton.removeEventListener('click', convertCMYK);
    inputButton.removeEventListener('click', convertHSL);

    // Check selected mode
    if (selection == 'hex') {
        inputButton.addEventListener('click', convertHEX());
    }
    else if (selection == 'rgb') {
        inputButton.addEventListener('click', convertRGB());
    }
    else if (selection == 'cmyk') {
        inputButton.addEventListener('click', convertCMYK());
    }
    else if (selection == 'hsl') {
        inputButton.addEventListener('click', convertHSL());
    }

    return 0;
}

function convertHEX() {
    let hex = document.getElementById('input').value;

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
        yellow = Math.round((1 - blueNorm - key) / (1 - key) *  100);
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
        <p>rgb(${red}, ${green}, ${blue})</p>
        <p>cmyk(${cyan}%, ${magenta}%, ${yellow}%, ${key}%)</p>
        <p>hsl(${hue}, ${saturation}%, ${luminance}%)</p>
    `;

    return 0;
}

function convertRGB() {
    let rgb = document.getElementById('input').value;
    document.getElementById("output").innerHTML = `
    <p>RGB</p>
    `;
    return 0;
}

function convertCMYK() {
    let cmyk = document.getElementById('input').value;
    document.getElementById("output").innerHTML = `
    <p>CMYK</p>
    `;
    return 0;
}

function convertHSL() {
    let hsl = document.getElementById('input').value;
    document.getElementById("output").innerHTML = `
    <p>HSL</p>
    `;
    return 0;
}