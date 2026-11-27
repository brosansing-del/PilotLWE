/**
 * The Naxal Archive | History > Document Repository
 * Initial collection: the FIVE historical files supplied by the editor.
 *
 * To add more documents later, append records to historyDocuments.
 * Five historical primary-source PDFs are bundled for the editor's archive.
 * Their inclusion is for research and documentation, not endorsement.
 * Check publication rights and applicable laws before public deployment.
 */

export const documentCategories = [
  'Historical Documents',
  'Ideological Texts',
  'Organisational Records',
  'Official Records',
  'Policy & Rehabilitation',
  'Research Publications',
] as const;

export type DocumentCategory = (typeof documentCategories)[number];
export type DocumentAccess = 'public-pdf' | 'source-only' | 'summary-only';

export type HistoryDocument = {
  id: string;
  title: string;
  year: number | null;
  category: DocumentCategory;
  sourceName: string;
  description: string;
  access: DocumentAccess;
  /** Display order, independent of publication year. */
  displayOrder?: number;
  sourceUrl?: string;
  pdfUrl?: string;
  /** Relative to public/, e.g. docs/report.pdf. */
  localPdfPath?: string;
};

export const historyDocuments: HistoryDocument[] = [
  {
    id: 'cpi-maoist-mlm-2004',
    title: 'Hold High the Bright Red Banner of Marxism–Leninism–Maoism',
    year: 2004,
    category: 'Ideological Texts',
    sourceName: 'Central Committee (Provisional), CPI (Maoist)',
    description:
      'A founding-era statement explaining the organisation’s interpretation of Marxism, Leninism and Maoism. Preserved as a historical record of its ideological position.',
    access: 'public-pdf',
    displayOrder: 1,
    localPdfPath: 'docs/marxism-leninism-maoism-2004.pdf',
  },
  {
    id: 'cpi-maoist-programme-2004',
    title: 'Party Programme',
    year: 2004,
    category: 'Ideological Texts',
    sourceName: 'Central Committee (Provisional), CPI (Maoist)',
    description:
      'A founding-era statement of political objectives and the organisation’s interpretation of Indian history, social relations and political institutions.',
    access: 'public-pdf',
    displayOrder: 2,
    localPdfPath: 'docs/party-programme-2004.pdf',
  },
  {
    id: 'cpi-maoist-political-resolution-2004',
    title: 'Political Resolution',
    year: 2004,
    category: 'Historical Documents',
    sourceName: 'Central Committee (Provisional), CPI (Maoist)',
    description:
      'A resolution presenting the organisation’s views on international affairs, globalisation and India’s political and economic situation at the time of its formation.',
    access: 'public-pdf',
    displayOrder: 3,
    localPdfPath: 'docs/political-resolution-2004.pdf',
  },
  {
    id: 'cpi-maoist-party-constitution',
    title: 'Party Constitution',
    year: null,
    category: 'Organisational Records',
    sourceName: 'CPI (Maoist); date not stated in supplied copy',
    description:
      'A primary-source copy of the organisation’s constitution, retained for historical research and documentary context.',
    access: 'public-pdf',
    displayOrder: 4,
    localPdfPath: 'docs/party-constitution.pdf',
  },
  {
    id: 'cpi-maoist-strategy-tactics-2004',
    title: 'Strategy & Tactics of the Indian Revolution',
    year: 2004,
    category: 'Historical Documents',
    sourceName: 'Central Committee (Provisional), CPI (Maoist)',
    description:
      'A founding-era primary-source document outlining the organisation’s stated strategic outlook. Included for historical documentation, not as guidance.',
    access: 'public-pdf',
    displayOrder: 5,
    localPdfPath: 'docs/strategy-tactics-indian-revolution-2004.pdf',
  },
];
