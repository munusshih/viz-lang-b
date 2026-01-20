#!/usr/bin/env node

import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/**
 * Generates email-to-studentId mapping by parsing config.ts
 * This ensures we have a single source of truth for student data.
 * The studentId is auto-generated from firstName-lastName.
 *
 * @returns {Object} emailToId mapping object
 */
function generateStudentMapping() {
  const configFilePath = path.join(__dirname, "../src/config.ts");
  const configContent = fs.readFileSync(configFilePath, "utf8");

  // Helper function to generate studentId (same logic as in config.ts)
  function generateStudentId(firstName, lastName) {
    return `${firstName.toLowerCase()}-${lastName.toLowerCase()}`
      .replace(/[^a-z0-9-]/g, "") // Remove any non-alphanumeric characters except hyphens
      .replace(/--+/g, "-") // Replace multiple hyphens with single hyphen
      .replace(/^-|-$/g, ""); // Remove leading/trailing hyphens
  }

  // Parse the students array to extract email, firstName, and lastName
  const studentMapping = {};

  // Updated regex to match the new structure without studentId field
  const studentEntryRegex =
    /{\s*firstName:\s*"([^"]+)",\s*lastName:\s*"([^"]+)",\s*email:\s*"([^"]+)",\s*website:\s*[^,}]+,?\s*}/g;

  let match;
  while ((match = studentEntryRegex.exec(configContent)) !== null) {
    const firstName = match[1];
    const lastName = match[2];
    const email = match[3];
    const studentId = generateStudentId(firstName, lastName);
    studentMapping[email] = studentId;
  }

  return studentMapping;
}

export { generateStudentMapping };
