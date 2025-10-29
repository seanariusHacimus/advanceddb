export const topics = {
  "Business Entry": {
    name: "Business Entry",
    score: 93.57,
    description: `The Business Entry topic measures the process of
registration and start of operations of new limited liability
companies (LLCs) across three different dimensions, here
referred to as pillars.
`,
    summary: `Each pillar is divided into categories—defined by common
features that inform the grouping into a particular
category—and each category is further divided into
subcategories. Each subcategory has several indicators,
each of which may, in turn, have several components.
Relevant points are assigned to each indicator and
subsequently aggregated to obtain the number of points
for each subcategory, category, and pillar.`,
    pillars: [
      {
        name: "Pillar I - Regulatory Framework",
        description: `The first pillar assesses the quality of
regulations for business entry, covering de jure features
of a regulatory framework that are necessary for the
adoption of good practices for business start—ups.`,
        score: 93.75,
        id: "pillar_i",
      },
      {
        name: "Pillar II - Public Services",
        description: `The second pillar measures the availability of digital public
services and transparency of information for business
entry.`,
        score: 84.0,
        id: "pillar_ii",
      },
      {
        name: "Pillar III - Operational Efficiency",
        description: `The third pillar measures the time and cost
required to register new domestic and foreign firms.`,
        score: 98.5,
        id: "pillar_iii",
      },
    ],
  },
  "Business Location": {
    name: "Business Location",
    score: 72.0,
    pillars: [
      {
        name: "Pillar I - Regulatory Framework",
        score: 77.71,
        id: "pillar_i",
      },
      { name: "Pillar II - Public Services", score: 51.14, id: "pillar_ii" },
      {
        name: "Pillar III - Operational Efficiency",
        score: 85.67,
        id: "pillar_iii",
      },
    ],
  },
  "Utility Services": {
    name: "Utility Services",
    score: 81.0,
    pillars: [
      {
        name: "Pillar I - Regulatory Framework",
        score: 88.4,
        id: "pillar_i",
      },
      { name: "Pillar II - Public Services", score: 76.14, id: "pillar_ii" },
      {
        name: "Pillar III - Operational Efficiency",
        score: 78.75,
        id: "pillar_iii",
      },
    ],
  },
  Labor: {
    name: "Labor",
    score: 69.0,
    pillars: [
      {
        name: "Pillar I - Regulatory Framework",
        score: 80.66,
        id: "pillar_i",
      },
      { name: "Pillar II - Public Services", score: 75.0, id: "pillar_ii" },
      {
        name: "Pillar III - Operational Efficiency",
        score: 50.5,
        id: "pillar_iii",
      },
    ],
  },
  "Financial Services": {
    name: "Financial Services",
    score: 69.0,
    pillars: [
      {
        name: "Pillar I - Regulatory Framework",
        score: 77.24,
        id: "pillar_i",
      },
      { name: "Pillar II - Public Services", score: 41.11, id: "pillar_ii" },
      {
        name: "Pillar III - Operational Efficiency",
        score: 87.33,
        id: "pillar_iii",
      },
    ],
  },
  "International Trade": {
    name: "International Trade",
    score: 76.0,
    pillars: [
      {
        name: "Pillar I - Regulatory Framework",
        score: 86.37,
        id: "pillar_i",
      },
      { name: "Pillar II - Public Services", score: 52.0, id: "pillar_ii" },
      {
        name: "Pillar III - Operational Efficiency",
        score: 89.1,
        id: "pillar_iii",
      },
    ],
  },
  Taxation: {
    name: "Taxation",
    score: 60.0,
    pillars: [
      {
        name: "Pillar I - Regulatory Framework",
        score: 46.5,
        id: "pillar_i",
      },
      { name: "Pillar II - Public Services", score: 61.77, id: "pillar_ii" },
      {
        name: "Pillar III - Operational Efficiency",
        score: 71.6,
        id: "pillar_iii",
      },
    ],
  },
  "Dispute Resolution": {
    name: "Dispute Resolution",
    score: 69.0,
    pillars: [
      {
        name: "Pillar I - Regulatory Framework",
        score: 76.15,
        id: "pillar_i",
      },
      { name: "Pillar II - Public Services", score: 65.22, id: "pillar_ii" },
      {
        name: "Pillar III - Operational Efficiency",
        score: 64.95,
        id: "pillar_iii",
      },
    ],
  },
  "Market Competition": {
    name: "Market Competition",
    score: 64.0,
    pillars: [
      {
        name: "Pillar I - Regulatory Framework",
        score: 69.2,
        id: "pillar_i",
      },
      { name: "Pillar II - Public Services", score: 67.27, id: "pillar_ii" },
      {
        name: "Pillar III - Operational Efficiency",
        score: 56.56,
        id: "pillar_iii",
      },
    ],
  },
  "Business Insolvency": {
    name: "Business Insolvency",
    score: 66.0,
    pillars: [
      {
        name: "Pillar I - Regulatory Framework",
        score: 67.28,
        id: "pillar_i",
      },
      { name: "Pillar II - Public Services", score: 66.67, id: "pillar_ii" },
      {
        name: "Pillar III - Operational Efficiency",
        score: 65.25,
        id: "pillar_iii",
      },
    ],
  },
};
