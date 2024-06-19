export type BranchInformation = {
  name: string;
  commit: {
    sha: string;
    url: string;
  };
  protected: boolean;
  protection: {
    required_status_checks: {
      enforcement_level: string;
      contexts: string[];
    };
  };
  protection_url: string;
};
