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
    slug: "state-of-democracy-conflict-zone",
    kind: "interview",
    title: "State of Democracy in a Conflict Zone",
    context: "Opinions / YouTube Short",
    description: "A short-form video about democratic life in conflict-affected regions, linked for viewers to examine the original account.",
    youtubeId: "u1iESYYp3VI",
    reviewed: false,
  },
  {
    slug: "bastar-odisha-former-ied-expert",
    kind: "interview",
    title: "Conversation with a Former Maoist IED Specialist",
    context: "Opinions / Bastar–Odisha border",
    description: "An interview described by the contributor as a discussion with a former Maoist IED specialist active near the Bastar–Odisha border.",
    youtubeId: "nJTdvrmsYHA",
    reviewed: false,
  },
  {
    slug: "human-cost-of-conflict-video",
    kind: "victim",
    title: "The Human Cost of Conflict",
    context: "Victims’ Corner / Video report",
    description: "A video supplied as part of the archive’s record of people affected by Maoist violence. Consult the original recording for specific accounts and circumstances.",
    youtubeId: "uwZY64u-SP0",
    reviewed: false,
  },
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
    title: "Security-force personnel: A video report",
    context: 'Video report / Victims\u2019 Corner',
    description: "A source video documenting the impact of violence on security personnel. The original recording provides the account and further incident details.",
    youtubeId: 'A16768P8ZZc',
    reviewed: false,
  },
  {
    slug: 'security-force-story-02',
    kind: 'victim',
    title: "Security personnel and conflict: Field account",
    context: 'Video report / Victims\u2019 Corner',
    description: "A YouTube news report included in the security-force victims collection. View the original report for its named witnesses and location details.",
    youtubeId: 'RbozFkKVOIA',
    reviewed: false,
  },
  {
    slug: 'security-force-story-03',
    kind: 'victim',
    title: "Surviving Violence: A Personal Account",
    context: 'Video report / Victims\u2019 Corner',
    description: "A video account concerning a person affected by violence in the conflict. The original footage and source reporting provide the detailed testimony.",
    youtubeId: 'BaaLxMXPcZw',
    reviewed: false,
  },
  {
    slug: 'security-force-story-04',
    kind: 'victim',
    title: "Security-force casualties: Report from the field",
    context: 'Video report / Victims\u2019 Corner',
    description: "A video report concerning an attack affecting security personnel. See the original upload for the reported casualties and location.",
    youtubeId: '7DJhVw-Wb_c',
    reviewed: false,
  },
  {
    slug: 'security-force-story-05',
    kind: 'victim',
    title: "Lives lost in a Maoist attack: News report",
    context: 'Video report / Victims\u2019 Corner',
    description: "Coverage of the human consequences of a reported Maoist attack. The linked video should be consulted for the incident-specific details.",
    youtubeId: 'fkA5DGzc4N0',
    reviewed: false,
  },
  {
    slug: "santosh-poyam-ied-survivor",
    kind: "victim",
    title: "Santosh Poyam: Rebuilding Life After an IED Blast",
    context: "IED blast survivor / Personal story",
    description: "According to the supplied description, Santosh Poyam lost both legs in a Naxal IED blast and is working to rebuild his life. The full account and circumstances require review of the original video.",
    youtubeId: "u7oUVf7sYVE",
    reviewed: false,
  },
  {
    slug: "additional-sp-akash-rao-ied-blast",
    kind: "victim",
    title: "Additional SP Akash Rao: IED Blast Report",
    context: "Security-force casualties / Video news report",
    description: "The supplied Hindi headline reports that Additional SP Akash Rao died in an IED blast and two other officers were seriously injured. The date, location and circumstances remain to be checked against the recording.",
    youtubeId: "Vh2MLbve1XA",
    reviewed: false,
  },
  {
    slug: "pedda-korma-conflict-impact",
    kind: "victim",
    title: "Pedda Korma: Conflict, Security and Development",
    context: "Conflict-affected community / Ground report",
    description: "The supplied report headline describes the effect of Naxal violence on Pedda Korma and difficulties in accessing security and development services. Additional details await video review.",
    youtubeId: "aYUNSXZgQ2I",
    reviewed: false,
  },
  {
    slug: "madanwada-2009-attack",
    kind: "victim",
    title: "Madanwada Attack (2009): Remembering SP Vinod Kumar Choubey and the Personnel Killed",
    context: "2009 attack / Security-force victims",
    description: "The supplied video headline revisits the 2009 Madanwada attack and states that SP Vinod Kumar Choubey and 30 personnel lost their lives. Exact casualty figures and the events covered require source verification.",
    youtubeId: "G8SnQcGXgqA",
    reviewed: false,
  },
  {
    slug: "sukalu-ex-maoist-interview",
    kind: "interview",
    title: "Sukalu: Why He Joined the Movement and How He Escaped",
    context: "Former Maoist / Interview",
    description: "The supplied interview title asks why Sukalu joined the Maoist organisation and how he escaped its control. Key quotations and chronology will be added after checking the video.",
    youtubeId: "BuUl1Rl1OSA",
    reviewed: false,
  },
  {
    slug: "venugopal-armed-struggle-interview",
    kind: "interview",
    title: "Venugopal: Reflections on the Failure of Armed Struggle",
    context: "Former Maoist Politburo member / Statement",
    description: "According to the supplied Hindi headline, former Politburo member Venugopal attributed the movement's failure to armed struggle. The precise remarks and context require review of the recording.",
    youtubeId: "24N8nU5bDFE",
    reviewed: false,
  },
  {
    slug: "rupesh-mass-surrenders-explanation",
    kind: "interview",
    title: "Rupesh: An Explanation of Mass Surrenders",
    context: "Former Maoist / Interview",
    description: "An interview described by the contributor as an explanation by former Maoist Rupesh of mass surrenders. Specific arguments and remarks will be summarised after editorial review.",
    youtubeId: "T6eLCj8KXaI",
    reviewed: false,
  },
  {
    slug: "jhiram-ghati-former-maoists-account",
    kind: "interview",
    title: "Jhiram Ghati Attack: Former Maoists Speak",
    context: "Jhiram Ghati / Former-cadre testimony",
    description: "The supplied headline says former Maoists discussed aspects of the Jhiram Ghati attack and expressed regret. Specific claims and statements should be verified against the original recording.",
    youtubeId: "8IQhM6xOatE",
    reviewed: false,
  },
  {
    slug: "sabyasachi-panda-hostage-interview",
    kind: "interview",
    title: "Sabyasachi Panda: Journalists Recount a Hostage-Release Interview",
    context: "Maoist leader / Media interview account",
    description: "The supplied description recounts journalists, including those from NDTV, interviewing Maoist leader Sabyasachi Panda. It says he announced plans to release a hostage to the media group. Details await review of the original account.",
    youtubeId: "sqklOQ7TXjk",
    reviewed: false,
  },
];

export function youtubeWatchUrl(video: ArchiveVideo): string {
  return `https://www.youtube.com/watch?v=${video.youtubeId}`;
}

export function youtubeThumbnail(video: ArchiveVideo): string {
  return `https://i.ytimg.com/vi/${video.youtubeId}/hqdefault.jpg`;
}
