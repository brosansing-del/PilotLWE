/**
 * The Naxal Archive / Life After Surrender.
 * Descriptions are based only on contributor-supplied headlines, not independent video reviews.
 * Add a new entry to either list to expand the page.
 */
export type SurrenderVideo = {
  id: string;
  title: string;
  summary: string;
  context: string;
  reviewed: boolean;
};

export const rehabilitationVideos: SurrenderVideo[] = [
  {
    id: 's8zKJ2IODYk',
    title: 'From Rifles to Sewing Machines: A New Life in Konagud',
    summary: 'A video report about former Maoist cadres working at a factory in Konagud and building new livelihoods through tailoring.',
    context: 'Livelihoods · Konagud',
    reviewed: false,
  },
  {
    id: 'fyR4jplJGRY',
    title: 'A Chance at Parenthood: Vasectomy Reversal in Bastar',
    summary: 'A report on sterilisation-reversal procedures for surrendered Maoist cadres seeking to start or expand their families.',
    context: 'Family & rehabilitation · Bastar',
    reviewed: false,
  },
  {
    id: '1kMIIOAQSLE',
    title: 'Fagni’s Journey: From the Underground to Pandum Café',
    summary: 'The supplied video headline follows Fagni, described as a former Maoist medical worker who is now associated with Pandum Café.',
    context: 'New livelihoods · Personal account',
    reviewed: false,
  },
];

export const communityVideos: SurrenderVideo[] = [
  {
    id: 'ZPs3vZy_n_0',
    title: 'From Vehicle Burnings to Administrative Camps',
    summary: 'A field report describing the arrival of administrative outreach camps in an area previously affected by Maoist violence.',
    context: 'Governance · Service delivery',
    reviewed: false,
  },
  {
    id: '_aeRRpVZB8I',
    title: 'A Village After Two Decades of Conflict',
    summary: 'The report describes a district collector walking approximately four kilometres to hear residents’ concerns in a conflict-affected village.',
    context: 'Local administration · Community access',
    reviewed: false,
  },
  {
    id: 'xIIu44nAJAQ',
    title: 'Panchayat Elections in Abujhmad, 2025',
    summary: 'A report on changes in local electoral participation and the panchayat election process in Abujhmad.',
    context: 'Local democracy · Abujhmad',
    reviewed: false,
  },
  {
    id: 'vatiFZ1jc_E',
    title: 'Polling Teams Reach Highly Sensitive Areas',
    summary: 'A report on plans to conduct voting in highly sensitive areas and the use of helicopters to deploy polling personnel.',
    context: 'Election access · Remote regions',
    reviewed: false,
  },
];

export const youtubeLink = (video: SurrenderVideo): string =>
  `https://www.youtube.com/watch?v=${video.id}`;
export const youtubeThumbnail = (video: SurrenderVideo): string =>
  `https://i.ytimg.com/vi/${video.id}/hqdefault.jpg`;
