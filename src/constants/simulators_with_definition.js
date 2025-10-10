export default {
  business_entry: {
    cost_men: {
      order: 5,
      title: "Cost - Men (% of income per capita)",
      value: 11.1,
      description:
        "The cost for men is the total cost required for five male married entrepreneurs to complete the procedures to incorporate and operate a business. It is calculated as a percentage of income per capita. All the fees and costs associated with completing the procedures to start a business are recorded, including all official fees and fees for legal and professional services, if such services are required by law or commonly used in practice. Only incorporation costs are counted, which excludes value added taxes and bribes.",
    },
    cost_women: {
      order: 8,
      title: "Cost - Women (% of income per capita)",
      value: 11.1,
      description:
        "The cost for women is the total cost required for five female married entrepreneurs to complete the procedures to incorporate and operate a business. It is calculated as a percentage of income per capita. All the fees and costs associated with completing the procedures to start a business are recorded, including all official fees and fees for legal and professional services, if such services are required by law or commonly used in practice. Only incorporation costs are counted, which excludes value added taxes and bribes.",
    },
    paid_in_min_capital: {
      order: 9,
      title: "Paid-in Min. Capital (% of income per capita)",
      value: 0,
      description:
        "The paid-in minimum capital requirement reﬂects the amount that the entrepreneur needs to deposit in a bank or with a third-party before registration or up to three months after incorporation. It is calculated as percentage of income per capita. Any legal limitation of the company’s operations or decisions related to the payment of the minimum capital requirement is recorded. In case the legal minimum capital is provided per share, it is assumed 5 shareholders own the company and the legal minimum capital is multiplied by 5 shares. If an economy requires a minimum capital but allows businesses to pay only a part of it before registration, only this part is recorded.",
    },
    procedures_men: {
      order: 3,
      title: "Procedures - Men (number)",
      value: 8,
      description:
        "The number of procedures for men records all the procedures required in practice for five male married entrepreneurs to start and operate a local limited liability company. A procedure is deﬁned as any interaction of the company founders with external parties.  Both pre- and post-incorporation procedures that are officially required or commonly done in practice are recorded.",
    },
    procedures_women: {
      order: 6,
      title: "Procedures - Women (number)",
      value: 8,
      description:
        "The number of procedures for women records all the procedures required in practice for five female married entrepreneurs to start and operate a local limited liability company. A procedure is deﬁned as any interaction of the company founders with external parties or spouses (if legally required). Both pre- and post-incorporation procedures that are officially required or commonly done in practice are recorded. ",
    },
    starting_a_business_score: {
      order: 2,
      static: true,
      title: "Starting a business score",
      value: 79.4,
      description:
        "The ease of doing business score is the simple average of the scores for each of the Doing Business topics: starting a business, dealing with construction permits, getting electricity, registering property, getting credit, protecting minority investors, paying taxes, trading across borders, enforcing contracts and resolving insolvency. The score is computed based on the methodology in the DB17-20 studies for topics that underwent methodology updates.",
    },
    ease_of_starting_rank: {
      order: 1,
      static: true,
      title: "Ease of Starting a business(rank)",
      value: 146,
      description:
        "The score for starting a business is the simple average of the scores for each of the component indicators: the procedures, time and cost for an entrepreneur to start and formally operate a business, as well as the paid-in minimum capital requirement. ",
    },
    time_men: {
      order: 4,
      title: "Time - Men (days)",
      value: 36,
      description:
        "The time for men captures the median duration that business incorporation experts indicate is necessary for five male married entrepreneurs to complete all procedures required to start and operate a business with minimum follow- up and no extra payments.It is calulared in calendar days.The time estimates of all procedures are added to calculate the total time required to start and operate a business, taking into account simultaneity of processes.It is assumed that the minimum time required for each procedure is one day, except for procedures that can be fully completed online, for which the time required is recorded as half a day.",
    },
    time_women: {
      order: 7,
      title: "Time - Women (days)",
      value: 36,
      description:
        "The time for women captures the median duration that business incorporation experts indicate is necessary for five female married entrepreneurs to complete all procedures required to start and operate a business with minimum follow-up and no extra payments. It is calulared in calendar days. The time estimates of all procedures are added to calculate the total time required to start and operate a business, taking into account simultaneity of processes. It is assumed that the minimum time required for each procedure is one day, except for procedures that can be fully completed online, for which the time required is recorded as half a day.",
    },
  },
  business_location: {
    building_quality_control_index: {
      order: 6,
      title: "Building quality control index (0-15)",
      value: 6,
      description:
        "The building quality control index is the sum of the following six indices: quality of building regulations, quality control before construction, quality control during construction, quality control after construction, liability and insurance regimes and professional certifications. The component indicator is computed based on the methodology in the DB16-20 studies.",
    },
    cost: {
      order: 5,
      title: "Cost (% of warehouse value)",
      value: 1.0,
      description:
        "The cost records all official costs associated with completing the procedures to legally build a warehouse, including the costs associated with obtaining land use approvals and preconstruction design clearances; receiving inspections before, during and after construction; obtaining utility connections; and registering the warehouse at the property registry. It is calculated as a percentage of the warehouse value. Nonrecurring taxes required for the completion of the warehouse project are also recorded. Sales taxes (such as value added tax) or capital gains taxes are not recorded. Nor are deposits that must be paid up front and are later refunded. ",
    },
    ease_of_construction_rank: {
      order: 1,
      static: true,
      title: "Ease of dealing with construction permits(rank)",
      value: 120,
      description:
        "The ranking of economies on the ease of dealing with construction permits is determined by sorting their scores for dealing with construction permits. ",
    },
    procedures: {
      order: 3,
      title: "Procedures (number)",
      value: 12,
      description:
        "The number of procedures records all interactions of the building company’s employees or any party acting on its behalf with external parties, including government agencies, notaries, the land registry, the cadastre, utility companies and public inspectors. Procedures that the company undergoes to connect the warehouse to water and sewerage are included. All procedures that are legally required and that are done in practice by a majority of companies  are counted, even if they may be avoided in exceptional cases.",
    },
    ease_of_dealing_with_construction_permits_score: {
      order: 2,
      static: true,
      title: "Ease of dealing with construction permits score",
      value: 65.3,
      description:
        "The score for dealing with construction permits is the simple average of the scores for each of the component indicators: the procedures, time, cost to deal with construction permits, as well as the building quality control index that evaluate the quality of building regulations, the strength of quality control and safety mechanisms, liability and insurance regimes and professional certification requirements. The score is computed based on the methodology in the DB16-20 studies.",
    },
    time: {
      order: 4,
      title: "Time (days)",
      value: 184,
      description:
        "The time captures the median duration that local experts indicate is necessary to complete a procedure in practice. It is calculated in calendar days. The time estimates of all procedures are added to calculate the total time required to complete each procedure, taking into account simultaneity of processes. It is assumed that the minimum time required for each procedure is one day, except for procedures that can be fully completed online, for which the time required is recorded as half a day. ",
    },
  },
  utility_services: {
    cost: {
      order: 5,
      title: "Cost (% of income per capita)",
      value: 623,
      description:
        "The cost is the total median cost associated with completing the procedures to connect a warehouse to electricity. It is calculated as a percentage of income per capita. All the fees and costs associated with completing the procedures to connect a warehouse to electricity are recorded, including those related to obtaining clearances from government agencies, applying for the connection, receiving inspections of both the site and the internal wiring, purchasing material, getting the actual connection works and paying a security deposit. Bribes are not included.",
    },
    ease_of_getting_electricity_rank: {
      order: 1,
      static: true,
      title: "Ease of getting electricity(rank)",
      value: 156,
      description:
        "The ranking of economies on the ease of getting electricity is determined by sorting their scores for getting electricity.",
    },
    procedures: {
      order: 3,
      title: "Procedures (number)",
      value: 7,
      description:
        "The number of procedures records all the procedures required in practice for businesses to obtain a new electrical connection. A procedure is defined as any interaction of the company’s employees or its main electrician or electrical engineer with external parties, such as the electricity distribution utility, electricity supply utilities, government agencies, electrical contractors and firms. Interactions between company employees and steps related to the internal electrical wiring, such as the design and execution of the internal electrical installation plans, are not counted as procedures. However, internal wiring inspections and certifications that are prerequisites to obtain a new connection are counted as procedures. ",
    },
    reliability_of_supply_and_transparency_of_tariff_index: {
      order: 6,
      title: "Reliability of supply and transparency of tariff index (0–8)",
      value: 2,
      description:
        "The reliability of supply and transparency of tariff index is calculated on the basis of the following six components: (i) duration and frequency of power outages, (ii) tools to monitor power outages, (iii) tools to restore power supply, (iv) regulatory monitoring of utilities’ performance, (v) financial deterrents aimed at limiting outages, and (vi) transparency and accessibility of tariffs. An economy is eligible to obtain a score on the reliability of supply and transparency of tariffs index only if (i) the utility collects data on all types of outages (average total duration of outages per customer and the average number of outages per customer), including planned and unplanned outages, as well as load shedding, with the minimum outage time of not more than 5 minutes; and (ii) the SAIDI value is below a threshold of 100 hours and the SAIFI value is under 100 outages. The component indicator is computed based on the methodology in the DB16-20 studies.",
    },
    ease_of_getting_electricity_score: {
      order: 2,
      static: true,
      title: "Ease of getting electricity score",
      value: 54.1,
      description:
        "The score for the reliability of supply and transparency of tariff index benchmarks economies with respect to the regulatory best practice on the indicator. The score ranges from 0 to 100, where 0 represents the worst regulatory performance and 100 the best regulatory performance, and is computed based on the methodology in the DB16-20 studies.",
    },
    time: {
      order: 4,
      title: "Time (days)",
      value: 97,
      description:
        "The time captures the median duration that the electricity utility and private sector electricity experts indicate is necessary in practice to complete all procedures required to obtain a new electricity connection with minimum follow-up and no extra payments. It is calculated in calendar days. The time estimates of all procedures are added to calculate the total time required to obtain a new electrical connection, taking into account simultaneity of processes. It is assumed that the minimum time required for each procedure is one day, except for procedures that can be fully completed online, for which the time required is recorded as half a day.",
    },
  },
  business_location_property: {
    cost: {
      order: 5,
      title: "Cost (% of property value)",
      value: 3,
      description:
        "The cost is the total of official costs associated with completing the procedures to transfer the property, expressed as a percentage of the property value, assumed to be equiva­lent to 50 times income per capita. It is calculted as a percentage of the property value. Only official costs required by law are recorded, including fees, transfer taxes, stamp duties and any other payment to the property registry, notaries, public agencies or lawyers. Other taxes, such as capital gains tax or value added tax, are excluded from the cost measure. Both costs borne by the buyer and the seller are included. If cost estimates differ among sources, the median reported value is used.",
    },
    ease_of_property_rank: {
      order: 1,
      static: true,
      title: "Ease of registering Property(rank)",
      value: 167,
      description:
        "The ranking of economies on the ease of registering property is determined by sorting their scores for registering property. ",
    },
    procedures: {
      order: 3,
      title: "Procedures (number)",
      value: 6,
      description:
        "The number of procedures records all the procedures necessary for a business (the buyer) to purchase a property from another business (the seller) and to transfer the property title to the buyer’s name so that the buyer can use the property for expanding its business, use the property as collateral in taking new loans or, if necessary, sell the property to another business. A procedure is defined as any interaction that is legally or in practice required between the buyer, the seller or their agents (if required) and external parties, including government agencies, inspectors, notaries and lawyers.",
    },
    quality_of_land_administration_index: {
      order: 6,
      title: "Quality of land administration index (0-30)",
      value: 7,
      description:
        "The quality of land administration index is the sum of the reliability of infrastructure, transparency of information, geographic coverage, land dispute resolution and equal access to property rights. The score is computed based on the methodology in the DB17-20 studies.",
    },
    ease_of_registering_property_score: {
      order: 2,
      static: true,
      title: "Ease of registering property score",
      value: 43.3,
      description:
        "The number of procedures records all the procedures necessary for a business (the buyer) to purchase a property from another business (the seller) and to transfer the property title to the buyer’s name so that the buyer can use the property for expanding its business, use the property as collateral in taking new loans or, if necessary, sell the property to another business. A procedure is defined as any interaction that is legally or in practice required between the buyer, the seller or their agents (if required) and external parties, including government agencies, inspectors, notaries and lawyers.",
    },
    time: {
      order: 4,
      title: "Time (days)",
      value: 190,
      description:
        "The time captures the median duration that property lawyers, notaries or registry officials indicate is necessary to complete a procedure. It is calculated in calendar days. The time estimates of all procedures are added to calculate the total time required to obtain transfer the property title, taking into account simultaneity of processes. It is assumed that the minimum time required for each procedure is one day, except for proce­dures that can be fully completed online, for which the time required is recorded as half a day.",
    },
  },
  financial_services: {
    credit_information_index: {
      order: 4,
      title: "Depth of credit information index (0-8)",
      value: 0,
      description: "",
    },
    ease_of_credit_rank: {
      order: 1,
      static: true,
      title: "Ease of Getting Credit(rank)",
      value: 185,
      description:
        "The ranking of economies on the ease of getting credit is determined by sorting their scores for getting credit.",
    },
    legal_rights_index: {
      order: 5,
      title: "Strength of legal rights index",
      value: 1,
      description:
        "The strength of legal rights index measures whether certain features that facilitate lending exist within the appli­cable collateral and bankruptcy laws. The index ranges from 0 to 10 based on the methodology in the DB05-14 studies.",
    },
    ease_of_getting_credit_score: {
      order: 2,
      static: true,
      title: "Ease of getting credit score",
      value: 5,
      description:
        "The score for getting credit benchmarks economies with respect to the regulatory best practice on the indicator set. The score is indicated on a scale from 0 to 100, where 0 represents the worst regulatory performance and 100 the best regulatory performance, and is computed based on the methodology in the DB15-20 studies.",
    },
  },
  labor: {
    labor_regulations_index: {
      order: 1,
      title: "Labor Regulations Index (0-100)",
      value: 65.5,
      description:
        "The labor regulations index measures the flexibility of employment regulations and the quality of labor relations. It includes components such as hiring and firing practices, working conditions, and social protection measures.",
    },
    employment_protection_index: {
      order: 2,
      title: "Employment Protection Index (0-100)",
      value: 58.2,
      description:
        "The employment protection index evaluates the level of protection provided to workers through employment contracts, including notice periods, severance pay, and restrictions on dismissals.",
    },
    working_conditions_index: {
      order: 3,
      title: "Working Conditions Index (0-100)",
      value: 72.1,
      description:
        "The working conditions index assesses the quality of working conditions including working hours, safety standards, and social benefits provided to workers.",
    },
    labor_dispute_resolution_index: {
      order: 4,
      title: "Labor Dispute Resolution Index (0-100)",
      value: 61.8,
      description:
        "The labor dispute resolution index measures the effectiveness of mechanisms for resolving disputes between employers and employees, including mediation, arbitration, and court processes.",
    },
  },
  market_competition: {
    corporate_transparency_index: {
      order: 9,
      title: "Corporate transparency index (0-7)",
      value: 0,
      description:
        "The extent of corporate transparency index measures the level of information that companies must share regarding their board members, senior executives, annual meetings and audits. This index has seven components: (i) whether Buyer must disclose direct and indirect beneficial ownership stakes representing 5%; (ii) whether Buyer must disclose information about board members’ primary employment and director­ships in other companies; (iii) whether Buyer must disclose the compensation of individual managers; (iv) whether a detailed notice of general meeting must be sent 21 calendar days before the meeting; (v) whether shareholders representing 5% of Buyer’s share capital can put items on the general meeting agenda; (vi) whether Buyer’s annual financial statements must be audited by an external auditor; (vii) whether Buyer must disclose its audit reports to the public. The index is computed based on the methodology in the DB15-20 studies.",
    },
    director_liability_index: {
      order: 5,
      title: "Director liability index (0-10)",
      value: 6,
      description:
        "The strength of minority investor protection index is the sum of the extent of disclosure index, extent of director liability index, ease of shareholder suits index, extent of shareholder rights index, extent of ownership and control index and extent of corporate transparency index. The index is computed based on the methodology in the DB15-20 studies.",
    },
    disclosure_index: {
      order: 4,
      title: "Disclosure index (0-10)",
      value: 4,
      description:
        "The strength of minority investor protection index is the sum of the extent of disclosure index, extent of director liability index, ease of shareholder suits index, extent of shareholder rights index, extent of ownership and control index and extent of corporate transparency index. The index is computed based on the methodology in the DB15-20 studies.",
    },
    ownership_and_control_index: {
      order: 8,
      title: "Ownership and control index (0-7)",
      value: 0,
      description:
        "The strength of minority investor protection index is the sum of the extent of disclosure index, extent of director liability index, ease of shareholder suits index, extent of shareholder rights index, extent of ownership and control index and extent of corporate transparency index. The index is computed based on the methodology in the DB15-20 studies.",
    },
    strength_of_minority_investors_protection_index_score: {
      order: 2,
      static: true,
      title: "Strength of minority investors protection index score",
      value: 32,
      description:
        "The strength of minority investor protection index is the sum of the extent of disclosure index, extent of director liability index, ease of shareholder suits index, extent of shareholder rights index, extent of ownership and control index and extent of corporate transparency index. The index is computed based on the methodology in the DB15-20 studies.",
    },
    shareholder_rights_index: {
      order: 7,
      title: "Shareholder rights index (0-6)",
      value: 0,
      description:
        "The strength of minority investor protection index is the sum of the extent of disclosure index, extent of director liability index, ease of shareholder suits index, extent of shareholder rights index, extent of ownership and control index and extent of corporate transparency index. The index is computed based on the methodology in the DB15-20 studies.",
    },
    shareholder_suits_index: {
      order: 6,
      title: "Shareholder suits index (0-10)",
      value: 6,
      description:
        "The strength of minority investor protection index is the sum of the extent of disclosure index, extent of director liability index, ease of shareholder suits index, extent of shareholder rights index, extent of ownership and control index and extent of corporate transparency index. The index is computed based on the methodology in the DB15-20 studies.",
    },
    strength_of_minority_investors_protection_index: {
      order: 3,
      static: true,
      title: "Strength of minority investors protection index (0 -50)",
      value: 16,
      description:
        "The strength of minority investor protection index is the sum of the extent of disclosure index, extent of director liability index, ease of shareholder suits index, extent of shareholder rights index, extent of ownership and control index and extent of corporate transparency index. The index is computed based on the methodology in the DB15-20 studies.",
    },
    ease_of_protecting_minority_investors_rank: {
      order: 1,
      static: true,
      title: "Ease of Protecting Minority Investors(rank)",
      value: 147,
      description:
        "The ranking of economies on the strength of minority shareholder protections is determined by sorting their scores for protecting minority investors. ",
    },
  },
  taxation: {
    ease_of_taxes_rank: {
      order: 1,
      static: true,
      title: "Ease of paying taxes(rank)",
      value: 106,
      description:
        "The ranking of economies on the ease of paying taxes is determined by sorting their scores for paying taxes. ",
    },
    payments: {
      order: 4,
      title: "Payments (number)",
      value: 31,
      description:
        "The tax payments capture the total number of taxes and contributions paid, the method of payment, the frequency of payment, and the frequency of ﬁling. It includes taxes withheld by the company, such as sales tax, VAT and employee-borne labor taxes.",
    },
    postfiling_index: {
      order: 3,
      static: true,
      title: "Postfiling index (0-100)",
      value: 95.0,
      description:
        "The score for postfiling index benchmarks economies with respect to the regulatory best practice on the indicator. The score is indicated on a scale from 0 to 100, where 0 represents the worst regulatory performance and 100 the best regulatory performance, and is computed based on the methodology in the DB17-20 studies.",
    },
    ease_of_paying_taxes_score: {
      order: 2,
      static: true,
      title: "Ease of paying taxes score",
      value: 69.5,
      description:
        "The score for paying taxes is the simple average of the scores for each of the component indicators, the payments, time and total tax and contribution rate for a company to comply with tax laws in an economy, as well as the postfiling procedures to request and process a VAT refund claim and to comply with and complete a corporate income tax correction. The score is computed based on the methodology in the DB17-20 studies.",
    },
    time: {
      order: 5,
      title: "Time (hours)",
      value: 287,
      description:
        "The time to comply with tax laws measures the time taken to prepare, ﬁle and pay three major types of taxes and contributions: the corporate income tax, value added or sales tax and labor taxes, including payroll taxes and social contributions.",
    },
    time_to_complete_a_corporate_income_tax_audit: {
      order: 10,
      title: "Time to complete a corporate income tax audit (weeks)",
      value: 0,
      description:
        "Time to complete a corporate income tax correction (weeks) (DB17-20 methodology) measures the time to complete a review by the tax authority including a formal tax audit if in 25% or more of cases, a company that voluntarily reports an error in its corporate income tax return and an underpayment of the tax due would be selected for additional review. The component indicator is computed based on the methodology in the DB17-20 studies.",
    },
    time_to_comply_with_corporate_income_tax_audit: {
      order: 9,
      title: "Time to comply with corporate income tax audit (hours)",
      value: 7,
      description:
        "The time to comply with a corporate income tax correction measures the time spent preparing and submitting the correction, and the time spent preparing information for the tax officers, if, in 25% or more of cases, a company that voluntarily reports an error in its CIT return and an underpayment of the tax due would be selected for additional review. The component indicator is computed based on the methodology in the DB17-20 studies.",
    },
    time_to_comply_with_vat_refund: {
      notNumber: true,
      order: 7,
      title: "Time to comply with VAT refund (hours)",
      value: "NO VAT",
      description:
        "The time to comply with VAT refund measures the time spent preparing and submitting the refund claim and the time spent preparing information for the tax officers, if, in 50% or more of cases, a company that requests a VAT cash refund arising from a capital purchase would be selected for an additional review. The component indicator is computed based on the methodology in the DB17-20 studies.",
    },
    time_to_obtain_vat_refund: {
      notNumber: true,
      order: 8,
      title: "Time to obtain VAT refund (weeks)",
      value: "NO VAT",
      description:
        "The time to obtain VAT refund measures the time from purchase of the machine to the date of submission of the refund claim (this is equal to half the filing period), the length of any mandatory period that the excess output VAT must be carried forward before a claim can be made, and the time from the submission of the VAT refund claim to the date the refund is received. If a company that requests a VAT cash refund arising from a capital purchase would be selected for additional review in 50% or more of cases, the duration of the review is included in the time to obtain a VAT refund. The component indicator is computed based on the methodology in the DB17-20 studies.",
    },
    total_tax_and_contribution_rate: {
      order: 6,
      title: "Total tax and contribution rate (% of profit)",
      value: 49,
      description:
        "The total tax and contribution rate measures the amount of taxes and mandatory contributions borne by the business in the second year of operation, expressed as a share of commercial proﬁt. The total amount of taxes and contributions borne is the sum of all the different taxes and contributions payable after accounting for allowable deductions and exemptions. The taxes withheld (such as personal income tax) or collected by the company and remitted to the tax authorities (such as VAT, sales tax or goods and service tax) but not borne by the company are excluded.",
    },
  },
  international_trade: {
    cost_to_export_border_compliance: {
      order: 5,
      title: "Cost to export: Border compliance (US$)",
      value: 825,
      description:
        "The cost for border compliance to export records the cost associated with compliance with the economy’s customs regulations and with regulations relating to other inspections that are mandatory in order for the export shipment to cross the economy’s border, as well as the time and cost for handling that takes place at its port or border. It is calculated in US dollars. The cost for this segment include the cost for customs clearance and inspection procedures conducted by other agencies. For example, the cost for conducting a phytosanitary inspection would be included here. Informal payments for which no receipt is issued are excluded from the costs recorded. The component indicator is computed based on the methodology in the DB16-20 studies.",
    },
    cost_to_export_documentary_compliance: {
      order: 6,
      title: "Cost to export: Documentary compliance (US$)",
      value: 240,
      description:
        "The cost for documentary compliance to export records the cost associated with compliance with the export documentary requirements of all government agencies of the origin economy, the destination economy and any transit economies. It is calculated in UD dollars. The cost for documentary compliance includes the cost for obtaining, preparing, processing, presenting and submitting documents. Insurance cost and informal payments for which no receipt is issued are excluded from the costs recorded. The component indicator is computed based on the methodology in the DB16-20 studies.",
    },
    cost_to_import_border_compliance: {
      order: 9,
      title: "Cost to import: Border compliance (US$)",
      value: 1030,
      description:
        "The cost for border compliance to import records the cost associated with compliance with the economy’s customs regulations and with regulations relating to other inspections that are mandatory in order for the import shipment to cross the economy’s border, as well as the time and cost for handling that takes place at its port or border. It is calculated in US dollars. The cost for this segment include the cost for customs clearance and inspection procedures conducted by other agencies. For example, the cost for conducting a technical standard inspection would be included here. Informal payments for which no receipt is issued are excluded from the costs recorded. The component indicator is computed based on the methodology in the DB16-20 studies.",
    },
    cost_to_import_documentary_compliance: {
      order: 10,
      title: "Cost to import: Documentary compliance (US$)",
      value: 460,
      description:
        "The cost for documentary compliance to import records the cost associated with compliance with the import documentary requirements of all government agencies of the origin economy, the destination economy and any transit economies. It is calculated in US dollars. The cost for documentary compliance includes the cost for obtaining, preparing, processing, presenting and submitting documents. Insurance cost and informal payments for which no receipt is issued are excluded from the costs recorded. The component indicator is computed based on the methodology in the DB16-20 studies.",
    },
    ease_of_trading_rank: {
      order: 1,
      static: true,
      title: "Ease of trading across borders(rank)",
      value: 174,
      description:
        "The ranking of economies on the ease of trading across borders is determined by sorting their scores for trading across borders. ",
    },
    ease_of_trading_across_borders_score: {
      order: 2,
      static: true,
      title: "Ease of trading across borders score",
      value: 36.2,
      description:
        "Doing Business measures the time and cost associated with three sets of procedures of exporting and importing goods —documentary compliance, border compliance and domestic transport—within the overall process of exporting or importing a shipment of goods. The score for trading across borders is the simple average of the scores for the time and cost for documentary compliance and border compliance to export and import. It is computed based on the methodology in the DB16-20 studies.",
    },
    time_to_export_border_compliance: {
      order: 3,
      title: "Time to export: Border compliance (hours)",
      value: 164,
      description:
        "The score for the time for border compliance to export benchmarks economies with respect to the regulatory best practice on the indicator. The score ranges from 0 to 100, where 0 represents the worst regulatory performance and 100 the best regulatory performance, and is computed based on the methodology in the DB16-20 studies.",
    },
    time_to_export_documentary_compliance: {
      order: 4,
      title: "Time to export: Documentary compliance (hours)",
      value: 96,
      description:
        "The time for documentary compliance to export records the time associated with compliance with the export documentary requirements of all government agencies of the origin economy, the destination economy and any transit economies. It is calculated in hours.  It includes the time for obtaining documents; preparing documents; processing documents; presenting documents; and submitting documents. All electronic or paper submissions of information requested by any government agency in connection with the shipment are considered to be documents obtained, prepared and submitted during the export process. All documents prepared by the freight forwarder or customs broker for the product and partner pair assumed in the case study are included regardless of whether they are required by law or in practice. The component indicator is computed based on the methodology in the DB16-20 studies.",
    },
    time_to_import_border_compliance: {
      order: 7,
      title: "Time to import: Border compliance (hours)",
      value: 72,
      description:
        "The score for the time for border compliance to import benchmarks economies with respect to the regulatory best practice on the indicator. The score ranges from 0 to 100, where 0 represents the worst regulatory performance and 100 the best regulatory performance, and is computed based on the methodology in the DB16-20 studies.",
    },
    time_to_import_documentary_compliance: {
      order: 8,
      title: "Time to import: Documentary compliance (hours)",
      value: 96,
      description:
        "The score for the time for documentary compliance to import benchmarks economies with respect to the regulatory best practice on the indicator. The score ranges from 0 to 100, where 0 represents the worst regulatory performance and 100 the best regulatory performance, and is computed based on the methodology in the DB16-20 studies.",
    },
  },
  dispute_resolution: {
    cost: {
      order: 4,
      title: "Cost (% of claim)",
      value: 44.4,
      description:
        "The cost to enforce contracts is recorded as a percentage of the claim value, assumed to be equivalent to 200% of income per capita or $5,000, whichever is greater. Three types of costs are recorded: average attorney fees, court costs and enforcement costs. Bribes are not taken into account.",
    },
    ease_of_contracts_rank: {
      order: 1,
      static: true,
      title: "Ease of enforcing contracts(rank)",
      value: 186,
      description:
        "The ranking of economies on the ease of enforcing contracts is determined by sorting their scores for enforcing contracts. ",
    },
    quality_of_judicial_processes_index: {
      order: 5,
      title: "Quality of judicial processes index (0-18)",
      value: 5.5,
      description:
        "The score for quality of judicial processes index benchmarks economies with respect to the regulatory best practice on the indicator. The score is indicated on a scale from 0 to 100, where 0 represents the worst regulatory performance and 100 the best regulatory performance, and is computed based on the methodology in the DB17-20 studies.",
    },
    ease_of_enforcing_contracts_score: {
      order: 2,
      static: true,
      title: "Ease of enforcing contracts score",
      value: 28.1,
      description:
        "The score for enforcing contracts is the simple average of the scores for each of the component indicators: the time and cost for resolving a commercial dispute through a local first-instance court, as well as the quality of judicial processes that promotes quality and efficiency in the court system. The score is computed based on the methodology in the DB17-20 studies.",
    },
    time: {
      order: 3,
      title: "Time (days)",
      value: 1296,
      description:
        "The time to enforce contracts is recorded in calendar days, counted from the moment plaintiff decides to file the lawsuit in court until payment. The average duration of the following three different stages of dispute resolution is recorded: (i) filing and service, (ii) trial and judgment, and (iii) enforcement.",
    },
  },
  business_insolvency: {
    ease_of_resolving_insolvency_rank: {
      order: 1,
      static: true,
      title: "Ease of resolving insolvency(rank)",
      value: 168,
      description:
        "The ranking of economies on the ease of resolving insolvency is determined by sorting their scores for resolving insolvency. ",
    },
    recovery_rate: {
      order: 3,
      title: "Recovery rate (cents on the dollar)",
      value: 0,
      description:
        "The recovery rate is recorded as cents on the dollar recovered by secured creditors through judicial reorganization, liquidation or debt enforcement (foreclosure or receivership) proceedings. The calculation takes into account the outcome: whether the business emerges from the proceedings as a going concern or the assets are sold piecemeal.",
    },
    ease_of_resolving_insolvency_score: {
      order: 2,
      static: true,
      title: "Ease of resolving insolvency score",
      value: 0,
      description:
        "The score for resolving insolvency is the simple average of the scores for each of the component indicators: the recovery rate of insolvency proceedings involving domestic entities, as well as the strength of the legal framework applicable to judicial liquidation and reorganization proceedings.",
    },
    strength_of_insolvency_framework_index: {
      order: 4,
      title: "Strength of insolvency framework index (0-16)",
      value: 0,
      description:
        "The score for strength of insolvency framework index benchmarks economies with respect to the regulatory best practice on the indicator. The score is indicated on a scale from 0 to 100, where 0 represents the worst regulatory performance and 100 the best regulatory performance.",
    },
  },
  ease_of_doing_business: {
    rank_as_of_current_data: {
      order: 1,
      static: true,
      title: "Rank as of Current Data",
      value: 177,
      description: "",
    },
    overall_ease_of_doing_business_score_as_of_current_data: {
      order: 2,
      static: true,
      title: "Overall ease of doing business score as of current data (0-100)",
      value: 41.3,
      description: "",
    },
  },
};
