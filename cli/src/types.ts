export type CLIAnswers = {
  backendLanguage: string;
  deployDatabase: boolean;
  token?: string;
  dbProvider: "sqlite" | "postgresql" | "mysql"; // mongodb will be added later
  correctRepo?: boolean;
};

export type EndpointResponse = {
  result: {
    data: {
      json: {
        connection: string;
      };
    };
  };
};

export type Project = {
  owner: string;
  ownerName: string;
  repository: string;
  repositoryName: string;
  createdAt: Date;
  updatedAt: Date;
  createdById: string;
  rdsInstanceId: string;
  createdBy: { name: string };
  //branches: [[Object]];
  status: string;
};
