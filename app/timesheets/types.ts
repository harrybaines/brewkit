// Define types for the timesheet components
export type TimeCodeGroup = {
  group: string;
  codes: TimeCode[];
};

export type TimeCode = {
  id: string;
  name: string;
  description: string;
};

export type Project = {
  id: number;
  code: string;
  name: string;
  client: string;
};

export type TimesheetEntry = {
  id: number;
  projectId: number;
  projectCode: string;
  projectName: string;
  client: string;
  timeCode: string;
  timeCodeName?: string;
  comment?: string;
  hours: {
    [key: string]: number | undefined;
  };
};

export type EditingCellType = {
  rowId: number;
  date: string;
} | null;

// Define time code data structure
export type TimeCodesData = {
  chargeable: TimeCodeGroup[];
  nonChargeable: TimeCodeGroup[];
};
