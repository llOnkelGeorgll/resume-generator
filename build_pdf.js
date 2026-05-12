const fs = require('fs');
const puppeteer = require('puppeteer');

const templatePath = process.argv[2] || 'resume_template.html';
const inputJsonPath = process.argv[3] || 'resume_data.json';
const outputPdfPath = process.argv[4] || 'output.pdf';

if (!fs.existsSync(inputJsonPath)) {
    console.error(`Error: Cannot find input JSON at ${inputJsonPath}`);
    process.exit(1);
}

const template = fs.readFileSync(templatePath, 'utf-8');
const data = JSON.parse(fs.readFileSync(inputJsonPath, 'utf-8'));

let html = template;
for (const [key, value] of Object.entries(data)) {
    const regex = new RegExp(`\\{\\{${key}\\}\\}`, 'g');
    let replacement = value || '';
    if (typeof value === 'object' && value !== null) {
        replacement = value.text || '';
    }
    html = html.replace(regex, replacement);
}

fs.writeFileSync('temp_debug.html', html);

(async () => {
    try {
        const browser = await puppeteer.launch({ headless: 'new' });
        const page = await browser.newPage();
        
        // Emulate the exact CSS Print constraints to measure the DOM accurately visually
        await page.setViewport({ width: 816, height: 1056, deviceScaleFactor: 1 });
        await page.emulateMediaType('print');

        await page.setContent(html, { waitUntil: 'networkidle0' });
        
        // Ensure web fonts are completely loaded before evaluating physical geometry math
        await page.evaluateHandle('document.fonts.ready');
        
        // --- LAYOUT OPTIMIZATION AGENT (OPTION B) ---
        // Iterate up to 20 times to maximize space usage in the DOM before printing.
        const logs = await page.evaluate(() => {
            let iterations = 0;
            const MAX_ITERATIONS = 20;

            // 11in total height (1inch = 96px). 11 * 96 = 1056px exactly.
            // Since we moved the margins exclusively to raw CSS padding inside the HTML template, 
            // the DOM scrollHeight perfectly represents the printed PDF 1:1. No math needed!
            const MAX_HEIGHT = 1056; 
            const executionLogs = [];
            
            while(iterations < MAX_ITERATIONS) {
                // Force a reflow evaluation using scrollHeight which ignores window clamping
                const bodyHeight = document.body.scrollHeight;
                executionLogs.push(`Iteration ${iterations}: Body height is ${bodyHeight}px (Target ${MAX_HEIGHT}px)`);

                if (bodyHeight > MAX_HEIGHT) {
                    // Overflow: shrink it
                    let currentScale = parseFloat(getComputedStyle(document.documentElement).getPropertyValue('--margin-scale')) || 1;
                    document.documentElement.style.setProperty('--margin-scale', Math.max(0.6, currentScale - 0.1).toString());
                    
                    let currentFont = parseFloat(getComputedStyle(document.documentElement).getPropertyValue('--base-font-size')) || 10;
                    document.documentElement.style.setProperty('--base-font-size', Math.max(8.0, currentFont - 0.25) + 'pt');
                    
                } else if (bodyHeight < MAX_HEIGHT - 35) {
                    // Too much whitespace: expand it to maximize space
                    let currentScale = parseFloat(getComputedStyle(document.documentElement).getPropertyValue('--margin-scale')) || 1;
                    document.documentElement.style.setProperty('--margin-scale', Math.min(1.5, currentScale + 0.1).toString());
                    
                    let currentFont = parseFloat(getComputedStyle(document.documentElement).getPropertyValue('--base-font-size')) || 10;
                    if (currentFont < 11.5) { // Prevent it from getting cartoonishly large
                       document.documentElement.style.setProperty('--base-font-size', (currentFont + 0.1) + 'pt');
                    }
                } else {
                    // Fitting perfectly
                    executionLogs.push(`Layout is optimized perfectly at ${bodyHeight}px on iteration ${iterations}.`);
                    break;
                }
                iterations++;
            }

            if (iterations === MAX_ITERATIONS) {
                executionLogs.push(`WARNING: Reached max iterations (${MAX_ITERATIONS}). Document might still be overflowing. Consider editing context manually.`);
            }

            return executionLogs;
        });
        
        console.log("Optimization Agent Logs:");
        logs.forEach(l => console.log(" - " + l));

        // Generate Final PDF
        await page.pdf({
            path: outputPdfPath,
            format: 'Letter',
            printBackground: true
        });

        console.log(`Successfully created optimized ${outputPdfPath}`);
        await browser.close();
    } catch (err) {
        console.error("Error generating PDF:", err);
        process.exit(1);
    }
})();
