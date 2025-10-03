import { ReportGenerator } from "./reportGenerator";

export interface StepTime {
  step: string;
  duration: number;
}
export type StepTimes = StepTime[];

export type TestStatus =
  | "passed"
  | "failed"
  | "skipped"
  | "timedOut"
  | "interrupted"
  | undefined;
export interface TestResult {
  testName: string;
  status: TestStatus;
  duration: number;
  startTime: number;
  steps: StepTimes;
  browser?: string;
  testFile: string;
  error?: string | null;
}

export interface TestCredentials {
  email: string;
  password: string;
  baseUrl: string;
}

export interface ReportGeneratorFixture {
  reportGenerator: ReportGenerator;
  testResult: TestResult;
}
