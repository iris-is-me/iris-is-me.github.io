console.log("script.js loaded!");
function getDominantColor(image, bucketSize = 32) {
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");

    // Downscale for better performance
    canvas.width = 100;
    canvas.height = 100;

    ctx.drawImage(image, 0, 0, 100, 100);

    const { data } = ctx.getImageData(0, 0, 100, 100);
    const colors = new Map();

    for (let i = 0; i < data.length; i += 4) {
        const r = data[i];
        const g = data[i + 1];
        const b = data[i + 2];
        const a = data[i + 3];

        // Ignore transparent pixels
        if (a < 128) continue;

        // Group similar colors into buckets
        const key = [
            Math.floor(r / bucketSize),
            Math.floor(g / bucketSize),
            Math.floor(b / bucketSize)
        ].join(",");

        if (!colors.has(key)) {
            colors.set(key, {
                count: 0,
                r: 0,
                g: 0,
                b: 0
            });
        }

        const bucket = colors.get(key);

        bucket.count++;
        bucket.r += r;
        bucket.g += g;
        bucket.b += b;
    }

    // Find the most populated bucket
    let dominant = null;

    for (const bucket of colors.values()) {
        if (!dominant || bucket.count > dominant.count) {
            dominant = bucket;
        }
    }

    if (!dominant) return null;

    // Average the colors within the winning bucket
    const r = Math.round(dominant.r / dominant.count);
    const g = Math.round(dominant.g / dominant.count);
    const b = Math.round(dominant.b / dominant.count);

    return `rgb(${r}, ${g}, ${b})`;
}


document.querySelectorAll(".connected-profiles img").forEach(image => {
    function updateBackground() {
        try {
            const color = getDominantColor(image);

            if (color) {
                image.style.backgroundColor = color;
            }
        } catch (error) {
            console.warn(
                "Could not calculate dominant color:",
                image.src,
                error
            );
        }
    }

    if (image.complete) {
        if (image.naturalWidth > 0) {
            updateBackground();
        }
    } else {
        image.addEventListener("load", updateBackground, { once: true });
    }
});