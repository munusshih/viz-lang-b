// =============================================================================
// SITE CONFIGURATION
// =============================================================================
// All configuration for the Tech-A 2025 class website in one place

// -----------------------------------------------------------------------------
// Site Information
// -----------------------------------------------------------------------------
export const SITE_TITLE = "Graduate Studio: Technology A [Class Notebook]";
export const SITE_DESCRIPTION = "This site is our class notebook, a place to document and share what we learn.";

// -----------------------------------------------------------------------------
// School & Course Information
// -----------------------------------------------------------------------------
export const SCHOOL_NAME = "Pratt Institute";
export const DEPARTMENT_NAME = "Graduate Communications Design";
export const SECTION_ID = "DES-720A-02";
export const SEMESTER = "Fall 2025";
export const MEETING_TIMES = "5:00pm - 7:50pm, Every Tuesday";
export const LOCATION = "Steuben Hall, Room 401";

// -----------------------------------------------------------------------------
// Teacher Information
// -----------------------------------------------------------------------------
export const SITE_AUTHOR = "Munus Shih";
export const EMAIL = "munus.shih@pratt.edu";

// -----------------------------------------------------------------------------
// Marquee Text
// -----------------------------------------------------------------------------
export const MARQUEE_TEXT = "Reminder to upload all your assignments and process! • Enjoy your break • Don't forget to check out the tutorials and resources • ";

// -----------------------------------------------------------------------------
// Special Project Weeks
// -----------------------------------------------------------------------------
// Configure weeks that showcase special projects instead of regular responses
export const SPECIAL_PROJECT_WEEKS: Record<number, {
    projectName: string;
    description: string;
    url: string;
}> = {
    5: {
        projectName: "View Project Archive",
        description: "The students are presenting their Project 1: Flexible Manifesto this week. View all student work on the main class site:",
        url: "https://tech-a.designfuture.space/work"
    },
    11: {
        projectName: "View Project Archive",
        description: "The students are presenting their Project 2: Data Sculpture this week. View all student work on the main class site:",
        url: "https://tech-a.designfuture.space/work"
    }
};

// -----------------------------------------------------------------------------
// Google Sheets Configuration
// -----------------------------------------------------------------------------
// Student assignment submissions
export const GOOGLE_SHEET_ID = "1Fcmcr1V_bsJZlHB8Z6TNhHzUvFxrArY_3jz0vamWpvA";
export const SHEET_NAME = "1";
export const OPENSHEET_API_URL = `https://opensheet.elk.sh/${GOOGLE_SHEET_ID}/${SHEET_NAME}`;

// Student bio submissions
export const BIO_SHEET_ID = "1PnVpKtVDYWaauG9suOhi1ZvLcEnN9lBEE78GbXdC3WI";
export const BIO_SHEET_NAME = "Form Responses 1";
export const BIO_OPENSHEET_API_URL = `https://opensheet.elk.sh/${BIO_SHEET_ID}/${BIO_SHEET_NAME}`;

// -----------------------------------------------------------------------------
// Data Paths
// -----------------------------------------------------------------------------
export const DATA_PATHS = {
    STUDENT_DATA: '/src/data/student-data.json',
} as const;

// -----------------------------------------------------------------------------
// Student Data
// -----------------------------------------------------------------------------
export interface Student {
    firstName: string;
    lastName: string;
    email: string;
    website?: string | null;
    // studentId is auto-generated from firstName-lastName
}

// Helper function to generate URL-friendly studentId from name
function generateStudentId(firstName: string, lastName: string): string {
    return `${firstName.toLowerCase()}-${lastName.toLowerCase()}`
        .replace(/[^a-z0-9-]/g, '') // Remove any non-alphanumeric characters except hyphens
        .replace(/--+/g, '-') // Replace multiple hyphens with single hyphen
        .replace(/^-|-$/g, ''); // Remove leading/trailing hyphens
}

export const students: Student[] = [
    {
        firstName: "Bella",
        lastName: "Tsai",
        email: "ytsai13@pratt.edu",
        website: null,
    },
    {
        firstName: "Binjia",
        lastName: "Li",
        email: "blix21@pratt.edu",
        website: null,
    },
    {
        firstName: "Flora",
        lastName: "Fang",
        email: "zfang32@pratt.edu",
        website: null,
    },
    {
        firstName: "Kate",
        lastName: "Chon",
        email: "kchon351@pratt.edu",
        website: null,
    },
    {
        firstName: "Lina",
        lastName: "Lee",
        email: "jlee413@pratt.edu",
        website: null,
    },
    {
        firstName: "Lin",
        lastName: "Kim",
        email: "ckim109@pratt.edu",
        website: null,
    },
    {
        firstName: "Nancy",
        lastName: "Scanlon",
        email: "nscanl13@pratt.edu",
        website: null,
    },
    {
        firstName: "Richard",
        lastName: "Fu",
        email: "jfux34@pratt.edu",
        website: null,
    },
    {
        firstName: "Sarena",
        lastName: "Yadav",
        email: "syadav4@pratt.edu",
        website: null,
    },
    {
        firstName: "Sreya",
        lastName: "Mahsin",
        email: "smahsin@pratt.edu",
        website: null,
    },
    {
        firstName: "Yiling",
        lastName: "Yang",
        email: "yyang82@pratt.edu",
        website: null,
    },
    {
        firstName: "Zoe",
        lastName: "Liu",
        email: "yliu124@pratt.edu",
        website: null,
    },
];

// -----------------------------------------------------------------------------
// Student Data Utilities
// -----------------------------------------------------------------------------
// Add studentId to each student object using the generator function
export const studentsWithId = students.map(student => ({
    ...student,
    studentId: generateStudentId(student.firstName, student.lastName)
}));

// Create a mapping from email to student data for quick lookups
export const studentsByEmail = studentsWithId.reduce((acc, student) => {
    acc[student.email] = student;
    return acc;
}, {} as Record<string, Student & { studentId: string }>);

// Sort students alphabetically by first name for display
export const studentsSorted = [...studentsWithId].sort((a, b) =>
    a.firstName.localeCompare(b.firstName)
);