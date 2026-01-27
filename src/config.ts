// =============================================================================
// SITE CONFIGURATION
// =============================================================================
// All configuration for the viz-lang-b 2026 class website in one place

// -----------------------------------------------------------------------------
// Site Information
// -----------------------------------------------------------------------------
export const SITE_TITLE = "Graduate Studio: Visual Language B [Class Notebook]";
export const SITE_DESCRIPTION = "This site is our class notebook, a place to document and share what we learn.";

// -----------------------------------------------------------------------------
// School & Course Information
// -----------------------------------------------------------------------------
export const SCHOOL_NAME = "Pratt Institute";
export const DEPARTMENT_NAME = "Graduate Communications Design";
export const SECTION_ID = "DES-710B-02";
export const SEMESTER = "Spring 2026";
export const MEETING_TIMES = "5:00pm - 7:50pm, Every Tuesday";
export const LOCATION = "Pfizer Building, Room 720-01";

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
        firstName: "Joy",
        lastName: "Ko",
        email: "jkox16@pratt.edu",
        website: null,
    },
    {
        firstName: "Han",
        lastName: "Zhang",
        email: "hzhang66@pratt.edu",
        website: null,
    },
    {
        firstName: "Shuyu",
        lastName: "Yi",
        email: "syix12@pratt.edu",
        website: null,
    },
    {
        firstName: "Yichi",
        lastName: "Zhang",
        email: "yzhan160@pratt.edu",
        website: null,
    },
    {
        firstName: "Yanxuan",
        lastName: "Lin",
        email: "ylin62@pratt.edu",
        website: null,
    },
    {
        firstName: "Jiayin",
        lastName: "Chiang",
        email: "jchia247@pratt.edu",
        website: null,
    },
    {
        firstName: "Yiran",
        lastName: "Hu",
        email: "yhux107@pratt.edu",
        website: null,
    },
    {
        firstName: "Lejun",
        lastName: "Xi",
        email: "lxix@pratt.edu",
        website: null,
    },
    {
        firstName: "Xuan",
        lastName: "Lu",
        email: "xlux20@pratt.edu",
        website: null,
    },
    {
        firstName: "Yijun",
        lastName: "Yu",
        email: "yyux26@pratt.edu",
        website: null,
    },
    {
        firstName: "Vicky",
        lastName: "Han",
        email: "than114@pratt.edu",
        website: null,
    },
    {
        firstName: "Sha",
        lastName: "Liu",
        email: "sliu55@pratt.edu",
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