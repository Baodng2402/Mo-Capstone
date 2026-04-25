export type SkinIndicatorStatus = 'improving' | 'stable' | 'worsening';

export type SkinIndicator = {
  label: string;
  score: number;
  status: SkinIndicatorStatus;
};

export type ScanResultSummary = {
  createdAt: string;
  indicators: SkinIndicator[];
  scanId: string;
};
