/**
 * The Naxal Archive: video catalogue.
 *
 * Add a new entry to publish another video. The page layouts pick it up
 * automatically. Titles and summaries must reflect what editors have verified.
 * Thumbnails are served by YouTube from each video ID.
 */
export type ArchiveVideo = {
  slug: string;
  kind: 'interview' | 'victim';
  title: string;
  context: string;
  description: string;
  youtubeId: string;
  reviewed: boolean;
};

export const archiveVideos: ArchiveVideo[] = [
  {
    slug: 'sonu-post-surrender',
    kind: 'interview',
    title: 'Sonu (Bhupathi): After Surrender',
    context: 'Former Politburo member / Post-surrender interview',
    description: 'A post-surrender interview with Sonu, identified in the supplied list as a former Politburo member. A detailed synopsis and key quotations will be added after reviewing the original recording.',
    youtubeId: '3xPH45Wf6fQ',
    reviewed: false,
  },
  {
    slug: 'girdhar-post-surrender',
    kind: 'interview',
    title: 'Girdhar: Post-surrender Interview',
    context: 'Former Gadchiroli DVC secretary / Interview',
    description: 'A conversation with Girdhar following his surrender, included in the archive as a first-person perspective. Detailed remarks and contextual notes are awaiting editorial review.',
    youtubeId: 'HDkOddSX81Q',
    reviewed: false,
  },
  {
    slug: 'paparao-post-surrender',
    kind: 'interview',
    title: 'Paparao: A Conversation After Surrender',
    context: 'Former special zonal committee member / Interview',
    description: 'An interview with Paparao following his surrender. The video is linked here for viewing; a verified description of the main points will be added after review.',
    youtubeId: '3NNE_VpF-9A',
    reviewed: false,
  },
  {
    slug: 'ramdher-guerrilla-life',
    kind: 'interview',
    title: 'Ramdher: Reflections on Guerrilla Life',
    context: 'Former cadre / Personal account',
    description: 'An interview listed by the contributor as a discussion about the difficulties of guerrilla life. Additional biographical details and quotations require confirmation from the video.',
    youtubeId: 'q8WtjhbML8s',
    reviewed: false,
  },
  {
    slug: 'security-force-story-01',
    kind: 'victim',
    title: 'Security-force Story 01',
    context: 'Video report / Victims\u2019 Corner',
    description: 'The first video supplied for the collection of security-force victims\u2019 experiences. The incident, location and individuals featured will be identified after editorial review.',
    youtubeId: 'A16768P8ZZc',
    reviewed: false,
  },
  {
    slug: 'security-force-story-02',
    kind: 'victim',
    title: 'Security-force Story 02',
    context: 'Video report / Victims\u2019 Corner',
    description: 'A video selected for the archive of conflict-related experiences and consequences. A verified account of the people and events shown will be added after review.',
    youtubeId: 'RbozFkKVOIA',
    reviewed: false,
  },
  {
    slug: 'security-force-story-03',
    kind: 'victim',
    title: 'Security-force Story 03',
    context: 'Video report / Victims\u2019 Corner',
    description: 'A video report included in the security-force victims collection. Names, dates and claims in the original recording have not yet been independently reviewed.',
    youtubeId: 'BaaLxMXPcZw',
    reviewed: false,
  },
  {
    slug: 'security-force-story-04',
    kind: 'victim',
    title: 'Security-force Story 04',
    context: 'Video report / Victims\u2019 Corner',
    description: 'One of the contributed reports about the human consequences of Left-Wing Extremism. The editorial summary will be expanded after checking the source video.',
    youtubeId: '7DJhVw-Wb_c',
    reviewed: false,
  },
  {
    slug: 'security-force-story-05',
    kind: 'victim',
    title: 'Security-force Story 05',
    context: 'Video report / Victims\u2019 Corner',
    description: 'A contributed video on experiences associated with the conflict. Details of the incident and any testimonies will be presented once checked against the original recording.',
    youtubeId: 'fkA5DGzc4N0',
    reviewed: false,
  },
];

export function youtubeWatchUrl(video: ArchiveVideo): string {
  return `https://www.youtube.com/watch?v=${video.youtubeId}`;
}

export function youtubeThumbnail(video: ArchiveVideo): string {
  return `https://i.ytimg.com/vi/${video.youtubeId}/hqdefault.jpg`;
}
