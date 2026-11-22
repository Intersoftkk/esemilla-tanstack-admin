import packageJson from "../../package.json";

export const APP_CONFIG = {
    name: "Esemilla",
    shortName: "Esemilla",
    version: packageJson.version,
    copyright: "© Esemilla. All rights reserved.",

    meta: {
        title: "Esemilla — School Management SaaS",
        description:
            "All-in-one school management platform for admissions, academics, attendance, fees, communication, and reporting — built for modern schools.",
        keywords:
            "esemilla, school management system, school SaaS, student information system, attendance, fees, admissions, academic management, parent portal, teacher portal",
        author: "Esemilla Team",
    },

    tagline: "Grow every school. Simply.",
    headline: "Run Your Entire School from One Platform",
    subheadline:
        "Esemilla connects admissions, academics, attendance, fees, staff, and parents in one place — so your school runs smoother every day.",

    features: [
        "Student & Parent Management",
        "Admissions & Onboarding",
        "Attendance & Timetable",
        "Fees & Invoicing",
        "Grades, Exams & Report Cards",
        "Staff & Role Management",
        "Announcements & Communication",
        "Insights & School Analytics",
    ],

    cta: {
        primary: "Start Free Trial",
        secondary: "Book a Demo",
        login: "Sign In to Esemilla",
    },

    links: {
        docs: "https://docs.esemilla.com",
        changelog: "https://esemilla.com/changelog",
        support: "mailto:support@esemilla.com",
        github: "https://github.com/esemilla/esemilla",
        website: "https://esemilla.com",
    },
};