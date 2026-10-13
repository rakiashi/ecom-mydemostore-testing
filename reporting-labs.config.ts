import "reporting-labs/auto";
import type { ReportingLabsOptions } from "reporting-labs";

const reportingLabs: ReportingLabsOptions = {
  title: "Ecom MyStore Demo Test Report",
  project: {
    name: "MyStore Demo",
    team: "QA",
    url: "https://www.mystoredemo.io/#/",
    description: "UI and checkout API automation",
  },
  metadata: {
    environment: process.env.ENV ?? "develop",
  },
  outputFolder: "reporting-labs",
  outputFile: "index.html",
  open: "never",
  pdf: false,
  maskKeys: ["sessionData", "paymentData", "redirectResult"],
  dimensions: ["priority", "severity", "feature", "owner", "layer"],
  history: {
    enabled: true,
    file: "reporting-labs/history.json",
    keep: 30,
  },
};

export default reportingLabs;
