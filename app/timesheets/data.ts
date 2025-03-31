import dayjs from "dayjs";
import { Project, TimeCodesData, TimesheetEntry } from "./types";
import { getWeekDates } from "./utils";

// Example data for demonstration
export const projectsData: Project[] = [
  {
    id: 1,
    code: "A1000",
    name: "School Refurbishment",
    client: "Oakridge School District",
  },
  {
    id: 2,
    code: "A1001",
    name: "Church Extension",
    client: "St. Mary's Parish",
  },
  {
    id: 3,
    code: "A1002",
    name: "Community Center Renovation",
    client: "Westside Community Trust",
  },
  {
    id: 4,
    code: "A1003",
    name: "Hospital Renovation",
    client: "Mercy Medical Center",
  },
  {
    id: 5,
    code: "A1004",
    name: "Office Building Renovation",
    client: "Pinnacle Investments",
  },
  {
    id: 6,
    code: "A1005",
    name: "Warehouse Renovation",
    client: "Global Distribution Ltd",
  },
];

// Time codes data with grouping
export const timeCodesData: TimeCodesData = {
  chargeable: [
    {
      group: "Design & Preparation",
      codes: [
        { id: "1", name: "Design", description: "Design" },
        { id: "2", name: "Preparation", description: "Preparation" },
        { id: "3", name: "Coordination", description: "Coordination" },
      ],
    },
    {
      group: "Technical & Manufacturing",
      codes: [
        { id: "4", name: "Technical Design", description: "Technical Design" },
        { id: "5", name: "Manufacturing", description: "Manufacturing" },
      ],
    },
    {
      group: "Construction & Handover",
      codes: [
        { id: "6", name: "Construction", description: "Construction" },
        { id: "7", name: "Use", description: "Use" },
      ],
    },
  ],
  nonChargeable: [
    {
      group: "Office Admin",
      codes: [
        {
          id: "ADM",
          name: "Administration",
          description: "General administrative tasks",
        },
        {
          id: "MTG",
          name: "Internal Meetings",
          description: "Non-project specific meetings",
        },
      ],
    },
    {
      group: "Professional",
      codes: [
        {
          id: "BUS",
          name: "Business Development",
          description: "Marketing and client outreach",
        },
        {
          id: "TRN",
          name: "Training",
          description: "Professional development activities",
        },
      ],
    },
    {
      group: "Time Off",
      codes: [
        { id: "LVE", name: "Leave", description: "Holiday, sick leave, etc." },
      ],
    },
  ],
};

// Get all time codes flattened for easier lookup
export const allTimeCodes = [
  ...timeCodesData.chargeable.flatMap((group) => group.codes),
  ...timeCodesData.nonChargeable.flatMap((group) => group.codes),
];

// Generate initial timesheet data
export const getInitialTimesheetData = (): TimesheetEntry[] => {
  const defaultTimeCode = timeCodesData.chargeable[0].codes[0];

  return projectsData.slice(0, 3).map((project) => {
    const entry: TimesheetEntry = {
      id: project.id,
      projectId: project.id,
      projectCode: project.code,
      projectName: project.name,
      client: project.client,
      timeCode: defaultTimeCode.id,
      timeCodeName: defaultTimeCode.name,
      hours: {},
    };

    // Add random hours for demonstration
    getWeekDates().forEach((date) => {
      const dayKey = dayjs(date).format("YYYY-MM-DD");
      // Random hours between 0 and 8, some days might have 0 hours
      entry.hours[dayKey] =
        Math.random() > 0.3 ? Math.floor(Math.random() * 8) + 1 : 0;
    });

    return entry;
  });
};
