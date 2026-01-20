#!/usr/bin/env node

import { promises as fs } from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load configuration from config.ts
async function loadConfig() {
  try {
    const configPath = path.resolve(__dirname, '../src/config.ts');
    const configContent = await fs.readFile(configPath, 'utf-8');
    
    // Extract bio sheet configuration from config.ts
    const bioSheetIdMatch = configContent.match(/export const BIO_SHEET_ID = "([^"]+)"/);
    const bioSheetNameMatch = configContent.match(/export const BIO_SHEET_NAME = "([^"]+)"/);
    
    if (!bioSheetIdMatch || !bioSheetNameMatch) {
      throw new Error('Could not find BIO_SHEET_ID or BIO_SHEET_NAME in config.ts');
    }
    
    const BIO_SHEET_ID = bioSheetIdMatch[1];
    const BIO_SHEET_NAME = bioSheetNameMatch[1];
    
    return {
      BIO_API_URL: `https://opensheet.elk.sh/${BIO_SHEET_ID}/${BIO_SHEET_NAME}`
    };
  } catch (error) {
    console.error('Error loading config:', error);
    throw error;
  }
}

// Dynamic import for fetch in Node.js
async function getFetch() {
  const { default: fetch } = await import("node-fetch");
  return fetch;
}

// Generate studentId matching the format in config.ts
function generateStudentId(firstName, lastName) {
  return `${firstName.toLowerCase()}-${lastName.toLowerCase()}`
    .replace(/[^a-z0-9-]/g, '') // Remove any non-alphanumeric characters except hyphens
    .replace(/--+/g, '-') // Replace multiple hyphens with single hyphen
    .replace(/^-|-$/g, ''); // Remove leading/trailing hyphens
}

async function fetchStudentBios() {
  try {
    const config = await loadConfig();
    const fetch = await getFetch();

    // Load student mapping from config.ts
    const configPath = path.resolve(__dirname, '../src/config.ts');
    const configContent = await fs.readFile(configPath, 'utf-8');
    
    // Extract student array from config - simple regex approach
    const studentsMatch = configContent.match(/const students: Student\[\] = \[([\s\S]*?)\];/);
    const studentEmailMap = new Map();
    
    if (studentsMatch) {
      // Parse students to create email -> student mapping
      // This is a simple approach - we'll extract email and name info
      const studentEntries = configContent.match(/\{\s*firstName:\s*"([^"]+)",\s*lastName:\s*"([^"]+)",\s*email:\s*"([^"]+)"/g);
      
      if (studentEntries) {
        studentEntries.forEach(entry => {
          const match = entry.match(/firstName:\s*"([^"]+)",\s*lastName:\s*"([^"]+)",\s*email:\s*"([^"]+)"/);
          if (match) {
            const [, firstName, lastName, email] = match;
            const studentId = generateStudentId(firstName, lastName);
            studentEmailMap.set(email, { firstName, lastName, studentId });
          }
        });
      }
    }

    console.log("Fetching student bio data from Google Sheet...");
    console.log(`API URL: ${config.BIO_API_URL}`);
    console.log(`Found ${studentEmailMap.size} students in config mapping`);

    const response = await fetch(config.BIO_API_URL);

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const rawData = await response.json();
    console.log(`Fetched ${rawData.length} bio entries from Google Sheet`);

    if (rawData.length === 0) {
      console.warn("No bio data found in the sheet");
      return;
    }

    // Log the first entry to see the structure
    console.log("First bio entry structure:");
    console.log(JSON.stringify(rawData[0], null, 2));

    // Process the bio data
    const processedBios = rawData
      .map((row) => {
        // Extract only the essential fields from the sheet
        const entry = {
          timestamp: row["Timestamp"],
          studentEmail: row["Email Address"],
          bio: row["Your Bio (max 800 characters)"],
          links: [],
        };

        // Generate studentId using config mapping
        if (entry.studentEmail && studentEmailMap.has(entry.studentEmail)) {
          const student = studentEmailMap.get(entry.studentEmail);
          entry.studentId = student.studentId;
          console.log(`Mapped ${entry.studentEmail} to studentId: ${entry.studentId}`);
        } else if (entry.studentEmail) {
          // Fallback to email-based ID if not found in config
          const emailUsername = entry.studentEmail.split("@")[0];
          entry.studentId = emailUsername
            .toLowerCase()
            .replace(/[^a-z0-9]/g, "-")
            .replace(/-+/g, "-")
            .replace(/^-|-$/g, "");
          console.warn(`Student ${entry.studentEmail} not found in config, using fallback ID: ${entry.studentId}`);
        }

        // Add links if they exist
        const link1Name = row["Link 1 Name"];
        const link1URL = row["Link 1 URL"];
        if (link1Name && link1URL) {
          entry.links.push({ name: link1Name, url: link1URL });
        }

        const link2Name = row["Link 2 Name"];
        const link2URL = row["Link 2 URL"];
        if (link2Name && link2URL) {
          entry.links.push({ name: link2Name, url: link2URL });
        }

        const link3Name = row["Link 3 Name"];
        const link3URL = row["Link 3 URL"];
        if (link3Name && link3URL) {
          entry.links.push({ name: link3Name, url: link3URL });
        }

        return entry;
      })
      .filter((entry) => entry.studentEmail && entry.bio); // Only keep entries with email and bio

    console.log(`Processed ${processedBios.length} valid bio entries`);

    // Save to JSON file
    const outputPath = path.resolve(__dirname, "../src/data/student-bios.json");
    const outputDir = path.dirname(outputPath);

    // Ensure the directory exists
    await fs.mkdir(outputDir, { recursive: true });

    // Write the processed data
    await fs.writeFile(outputPath, JSON.stringify(processedBios, null, 2));

    console.log(`✅ Student bio data saved to: ${outputPath}`);
    console.log(`📊 Summary: ${processedBios.length} student bios processed`);

    // Log some sample processed data
    if (processedBios.length > 0) {
      console.log("\nSample processed bio entry:");
      console.log(JSON.stringify(processedBios[0], null, 2));
    }
  } catch (error) {
    console.error("❌ Error fetching student bio data:", error);
    process.exit(1);
  }
}

// Run the function
fetchStudentBios();
