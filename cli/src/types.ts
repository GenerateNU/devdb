export type CLIAnswers = {
  backendLanguage: string;
  deployDatabase: boolean;
  token?: string;
  dbProvider: "sqlite" | "postgresql" | "mysql"; // mongodb will be added later
  correctRepo?: boolean;
};
