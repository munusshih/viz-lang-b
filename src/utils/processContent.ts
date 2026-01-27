/**
 * Wraps content between h2 tags into section divs for column layouts
 * @param html - Raw HTML string from markdown
 * @returns Processed HTML with sections wrapped
 */
export function wrapH2Sections(html: string): string {
    // Split by h2 tags while preserving them
    const h2Regex = /(<h2[^>]*>.*?<\/h2>)/gi;
    const parts = html.split(h2Regex);

    let result = "";
    let currentSection = "";
    let hasHeading = false;

    for (let i = 0; i < parts.length; i++) {
        const part = parts[i].trim();
        if (!part) continue;

        if (h2Regex.test(part)) {
            // This is an h2 heading
            if (currentSection) {
                // Close previous section
                result += `<div class="content-section">${currentSection}</div>\n`;
            }

            // Start new section with this heading
            currentSection = part;
            hasHeading = true;
            h2Regex.lastIndex = 0; // Reset regex state
        } else {
            // This is content, add to current section
            currentSection += part;
        }
    }

    // Don't forget the last section
    if (currentSection) {
        result += `<div class="content-section">${currentSection}</div>\n`;
    }

    // Wrap everything in a container
    return `<div class="sections-container">${result}</div>`;
}
