/**
 * Major Incidents (LWE), 6 March 2000–17 November 2026.
 * Transcribed from the user-supplied "Major Incidents" screenshot.
 * Values are not independently verified. This is NOT the same series as
 * the site's 1980–2026 annual fatalities data.
 * C = civilians; SF = security forces; M = militants; NS = not specified.
 */
export type MajorIncidentYear = {
  year: number;
  incidents: number;
  killedCivilian: number;
  killedSecurity: number;
  killedMilitant: number;
  killedNS: number;
  killedTotal: number;
  injuredCivilian: number;
  injuredSecurity: number;
  injuredMilitant: number;
  injuredNS: number;
  injuredTotal: number;
  initiatedCivilian: number;
  initiatedSecurity: number;
  initiatedMilitant: number;
  initiatedNS: number;
};

// Columns: Year, incidents, killed C/SF/M/NS/total,
// injured C/SF/M/NS/total, initiated by C/SF/M/NS.
const rows = [
  [2000,31,43,23,87,9,162,0,5,0,0,5,0,2,18,11],
  [2001,47,50,85,104,14,253,7,72,4,0,83,0,5,25,17],
  [2002,42,50,101,89,12,252,22,49,0,0,71,0,3,26,13],
  [2003,60,100,90,118,6,314,68,26,3,0,97,1,3,32,22],
  [2004,30,29,67,52,3,151,6,14,15,11,46,0,3,18,9],
  [2005,73,89,119,170,19,397,136,48,10,7,201,0,15,42,15],
  [2006,89,159,91,245,12,507,122,39,6,0,167,0,19,44,25],
  [2007,59,90,203,104,7,404,36,62,0,0,98,0,6,46,7],
  [2008,66,78,176,146,3,403,8,21,0,0,29,0,10,45,11],
  [2009,86,122,216,234,8,580,19,62,0,0,81,0,9,63,14],
  [2010,66,279,198,167,11,655,198,52,1,11,262,0,6,52,8],
  [2011,45,55,86,139,0,280,4,70,0,0,74,0,4,32,7],
  [2012,27,26,56,57,0,139,3,56,12,0,71,0,2,21,4],
  [2013,38,76,69,94,0,239,43,24,2,0,69,0,2,23,12],
  [2014,28,24,55,68,4,151,13,31,6,8,58,0,1,17,8],
  [2015,15,3,22,45,0,70,0,10,0,0,10,0,4,8,3],
  [2016,35,27,24,123,0,174,12,20,0,0,32,0,10,17,8],
  [2017,20,6,52,64,0,122,4,22,1,0,27,0,4,11,4],
  [2018,28,8,36,113,0,157,0,22,0,0,22,0,15,13,0],
  [2019,26,9,39,74,0,122,1,5,3,0,9,0,5,10,11],
  [2020,16,9,23,67,0,99,5,27,1,0,33,0,0,12,4],
  [2021,15,7,30,77,0,114,0,50,0,0,50,0,0,8,7],
  [2022,7,1,3,18,0,22,0,1,0,0,1,0,1,4,1],
  [2023,8,4,13,17,0,34,0,1,0,0,1,0,3,3,0],
  [2024,31,3,4,235,0,242,4,31,0,0,35,0,5,4,0],
  [2025,40,8,19,280,0,307,0,7,0,0,7,0,0,6,0],
  [2026,7,0,1,47,0,48,0,1,0,0,1,0,0,2,0],
] as const;

export const majorIncidents: MajorIncidentYear[] = rows.map((r) => ({
  year: r[0], incidents: r[1],
  killedCivilian: r[2], killedSecurity: r[3], killedMilitant: r[4], killedNS: r[5], killedTotal: r[6],
  injuredCivilian: r[7], injuredSecurity: r[8], injuredMilitant: r[9], injuredNS: r[10], injuredTotal: r[11],
  initiatedCivilian: r[12], initiatedSecurity: r[13], initiatedMilitant: r[14], initiatedNS: r[15],
}));

export const majorIncidentFields = [
  'year', 'incidents', 'killedCivilian', 'killedSecurity', 'killedMilitant', 'killedNS', 'killedTotal',
  'injuredCivilian', 'injuredSecurity', 'injuredMilitant', 'injuredNS', 'injuredTotal',
  'initiatedCivilian', 'initiatedSecurity', 'initiatedMilitant', 'initiatedNS',
] as const;

export const majorIncidentLabels = [
  'Year', 'Incidents', 'Killed: civilians', 'Killed: security forces', 'Killed: militants',
  'Killed: not specified', 'Killed: total', 'Injured: civilians', 'Injured: security forces',
  'Injured: militants', 'Injured: not specified', 'Injured: total',
  'Initiated by: civilians', 'Initiated by: security forces',
  'Initiated by: militants', 'Initiated by: not specified',
] as const;
