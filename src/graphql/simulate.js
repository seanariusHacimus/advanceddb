import { gql } from '../utils';

export const GET_RESULT = gql`
  query simulate($input: SimulateInput!) {
    simulate(input: $input) {
      dealing_with_construction_permits {
        ease_of_dealing_with_construction_permits_score
        ease_of_construction_rank
      }
      ease_of_doing_business {
        overall_ease_of_doing_business_score_as_of_current_data
        rank_as_of_current_data
      }
      enforcing_contracts {
        ease_of_enforcing_contracts_score
        ease_of_contracts_rank
      }
      getting_credit {
        ease_of_getting_credit_score
        ease_of_credit_rank
      }
      getting_electricity {
        ease_of_getting_electricity_score
        ease_of_getting_electricity_rank
      }
      paying_taxes {
        ease_of_paying_taxes_score
        postfiling_index
        ease_of_taxes_rank
      }
      protecting_minority_investors {
        strength_of_minority_investors_protection_index
        strength_of_minority_investors_protection_index_score
        ease_of_protecting_minority_investors_rank
      }
      registering_property {
        ease_of_registering_property_score
        ease_of_property_rank
      }
      resolving_insolvency {
        ease_of_resolving_insolvency_score
        ease_of_resolving_insolvency_rank
      }
      starting_a_business {
        starting_a_business_score
        ease_of_starting_rank
      }
      trading_across_borders {
        ease_of_trading_across_borders_score
        ease_of_trading_rank
      }
    }
  }
`;

export const INDICATOR_FIELDS_TO_RENDER = {
  dealing_with_construction_permits: {
    ease_of_dealing_with_construction_permits_score: 1,
    search_score: 1,
    building_quality_control_index: 0,
    cost: 0,
    procedures: 0,
    time: 0,
  },
  ease_of_doing_business: {
    overall_ease_of_doing_business_score_as_of_current_data: 1,
    search_score: 1,
  },
  enforcing_contracts: {
    ease_of_enforcing_contracts_score: 1,
    search_score: 1,
    cost: 0,
    quality_of_judicial_processes_index: 0,
    time: 0,
  },
  getting_credit: {
    ease_of_getting_credit_score: 1,
    search_score: 1,
    sum_getting_credit: 1,
    credit_information_index: 0,
    legal_rights_index: 0,
  },
  getting_electricity: {
    ease_of_getting_electricity_score: 1,
    search_score: 1,
    cost: 0,
    procedures: 0,
    reliability_of_supply_and_transparency_of_tariff_index: 0,
    time: 0,
  },
  paying_taxes: {
    ease_of_paying_taxes_score: 1,
    postfiling_index: 1,
    search_score: 1,
    payments: 0,
    time: 0,
    time_to_complete_a_corporate_income_tax_audit: 0,
    time_to_comply_with_corporate_income_tax_audit: 0,
    time_to_comply_with_vat_refund: 0,
    time_to_obtain_vat_refund: 0,
    total_tax_and_contribution_rate: 0,
  },
  protecting_minority_investors: {
    search_score: 1,
    strength_of_minority_investors_protection_index: 1,
    strength_of_minority_investors_protection_index_score: 1,
    corporate_transparency_index: 0,
    director_liability_index: 0,
    disclosure_index: 0,
    ownership_and_control_index: 0,
    shareholder_rights_index: 0,
    shareholder_suits_index: 0,
  },
  registering_property: {
    ease_of_registering_property_score: 1,
    search_score: 1,
    cost: 0,
    procedures: 0,
    quality_of_land_administration_index: 0,
    time: 0,
  },
  resolving_insolvency: {
    ease_of_resolving_insolvency_score: 1,
    search_score: 1,
    recovery_rate: 0,
    strength_of_insolvency_framework_index: 0,
  },
  search_score: 1,
  starting_a_business: {
    cost_men: 0,
    cost_women: 0,
    paid_in_min_capital: 0,
    procedures_men: 0,
    procedures_women: 0,
    time_men: 0,
    time_women: 0,
  },
  trading_across_borders: {
    ease_of_trading_across_borders_score: 1,
    search_score: 1,
    cost_to_export_border_compliance: 0,
    cost_to_export_documentary_compliance: 0,
    cost_to_import_border_compliance: 0,
    cost_to_import_documentary_compliance: 0,
    time_to_export_border_compliance: 0,
    time_to_export_documentary_compliance: 0,
    time_to_import_border_compliance: 0,
    time_to_import_documentary_compliance: 0,
  },
};

export const INDICATOR_FIELDS_TO_OUTPUT = {
  dealing_with_construction_permits: {
    ease_of_dealing_with_construction_permits_score: 120,
    search_score: 65.3,
  },
  ease_of_doing_business: {
    overall_ease_of_doing_business_score_as_of_current_data: 177,
    search_score: 41.3,
  },
  enforcing_contracts: {
    ease_of_enforcing_contracts_score: 186,
    search_score: 28.1,
  },
  getting_credit: {
    ease_of_getting_credit_score: 185,
    search_score: 5.0,
    sum_getting_credit: 1,
  },
  getting_electricity: {
    ease_of_getting_electricity_score: 156,
    search_score: 54.1,
  },
  paying_taxes: {
    ease_of_paying_taxes_score: 106,
    postfiling_index: 95.0,
    search_score: 69.5,
  },
  protecting_minority_investors: {
    search_score: 32.0,
    strength_of_minority_investors_protection_index: 16,
    strength_of_minority_investors_protection_index_score: 147,
  },
  registering_property: {
    ease_of_registering_property_score: 167,
    search_score: 43.3,
  },
  resolving_insolvency: {
    ease_of_resolving_insolvency_score: 168,
    search_score: 0,
  },
  search_score: 1,
  starting_a_business: {
    search_score: 79.4,
    starting_a_business_score: 146,
  },
  trading_across_borders: {
    ease_of_trading_across_borders_score: 174,
    search_score: 36.2,
  },
};


export const INDICATOR_FIELDS_INPUT = {
  dealing_with_construction_permits: {
    building_quality_control_index: 6,
    cost: 1.0,
    procedures: 12,
    time: 184,
  },
  ease_of_doing_business: {
  },
  enforcing_contracts: {
    cost: 44.4,
    quality_of_judicial_processes_index: 5.5,
    time: 1296.0,
  },
  getting_credit: {
    credit_information_index: 0,
    legal_rights_index: 1,
  },
  getting_electricity: {
    cost: 623,
    procedures: 7,
    reliability_of_supply_and_transparency_of_tariff_index: 2,
    time: 97,
  },
  paying_taxes: {
    payments: 31,
    time: 287,
    time_to_complete_a_corporate_income_tax_audit: 0,
    time_to_comply_with_corporate_income_tax_audit: 7,
    time_to_comply_with_vat_refund: 'NO VAT',
    time_to_obtain_vat_refund: 'NO VAT',
    total_tax_and_contribution_rate: 49,
  },
  protecting_minority_investors: {
    corporate_transparency_index: 0,
    director_liability_index: 6,
    disclosure_index: 4,
    ownership_and_control_index: 0,
    shareholder_rights_index: 0,
    shareholder_suits_index: 6,
  },
  registering_property: {
    cost: 3,
    procedures: 6,
    quality_of_land_administration_index: 7,
    time: 190,
  },
  resolving_insolvency: {
    recovery_rate: 0,
    strength_of_insolvency_framework_index: 0,
  },
  starting_a_business: {
    cost_men: 11.1,
    cost_women: 11.1,
    paid_in_min_capital: 0.0,
    procedures_men: 8,
    procedures_women: 8,
    time_men: 36,
    time_women: 36,
  },
  trading_across_borders: {
    cost_to_export_border_compliance: 825,
    cost_to_export_documentary_compliance: 240,
    cost_to_import_border_compliance: 1030,
    cost_to_import_documentary_compliance: 460,
    time_to_export_border_compliance: 164,
    time_to_export_documentary_compliance: 96,
    time_to_import_border_compliance: 72,
    time_to_import_documentary_compliance: 96,
  },
}


export const DEFAULT_SCHEMA = {
  starting_a_business: {
    cost_men: { value: 11.1, title: "Cost - Men (% of income per capita)" },
    cost_women: { value: 11.1, title: "Cost - Women (% of income per capita)" },
    paid_in_min_capital: { value: 0, title: "Paid-in Min. Capital (% of income per capita)" },
    procedures_men: { value: 8, title: "Procedures - Men (number)" },
    procedures_women: { value: 8, title: "Procedures - Women (number)" },
    time_men: { value: 36, title: "Time - Men (days)" },
    time_women: { value: 36, title: "Time - Women (days)" },
    search_score: { value: 79.4, title: "Starting a business score", static: true },
    starting_a_business_score: { value: 146, title: "Ease of Starting RANK", static: true },
  },
  dealing_with_construction_permits: {
    building_quality_control_index: { value: 6, title: "Building quality control index (0-15)" },
    cost: { value: 1.0, title: "Cost (% of warehouse value)" },
    procedures: { value: 12, title: "Procedures (number)" },
    time: { value: 184, title: "Time (days)" },
    ease_of_dealing_with_construction_permits_score: { value: 120, title: "Ease of Construction RANK", static: true, },
    search_score: { value: 65.3, title: "Ease of dealing with construction permits score", static: true, },
  },
  getting_electricity: {
    cost: { value: 623, title: "Cost (% of income per capita)" },
    procedures: { value: 7, title: "Procedures (number)" },
    reliability_of_supply_and_transparency_of_tariff_index: { value: 2, title: "Reliability of supply and transparency of tariff index (0–8)" },
    time: { value: 97, title: "Time (days)" },
    ease_of_getting_electricity_score: { value: 156, title: "Ease of getting electricity RANK", static: true, },
    search_score: { value: 54.1, title: "Ease of getting electricity score", static: true, },
  },
  registering_property: {
    cost: { value: 3, title: "Cost (% of property value)" },
    procedures: { value: 6, title: "Procedures (number)" },
    quality_of_land_administration_index: { value: 7, title: "Quality of land administration index (0-30)" },
    time: { value: 190, title: "Time (days)" },
    ease_of_registering_property_score: { value: 167, title: "Ease of Property RANK", static: true, },
    search_score: { value: 43.3, title: "Ease of registering property score", static: true, },
  },
  getting_credit: {
    credit_information_index: { value: 0, title: "Cost (% of property value)" },
    legal_rights_index: { value: 1, title: "Cost (% of property value)" },
    ease_of_getting_credit_score: { value: 185, title: "Ease of Credit RANK", static: true, },
    search_score: { value: 5, title: "Ease of getting credit score", static: true, },
    sum_getting_credit: { value: 1, title: "Sum getting credit", static: true, },
  },
  protecting_minority_investors: {
    corporate_transparency_index: { value: 0, title: "Corporate transparency index (0-7)" },
    director_liability_index: { value: 6, title: "Director liability index (0-10)" },
    disclosure_index: { value: 4, title: "Disclosure index (0-10)" },
    ownership_and_control_index: { value: 0, title: "Ownership and control index (0-7)" },
    shareholder_rights_index: { value: 0, title: "Shareholder rights index (0-6)" },
    shareholder_suits_index: { value: 6, title: "Shareholder suits index (0-10)" },
    search_score: { value: 32, title: "Strength of minority investors protection index score", static: true, },
    strength_of_minority_investors_protection_index: { value: 16, title: "Strength of minority investors protection index (0 -50)", static: true, },
    strength_of_minority_investors_protection_index_score: { value: 147, title: "Ease of Protecting Minority Investors RANK", static: true, },
  },
  paying_taxes: {
    payments: { value: 31, title: "Payments (number)" },
    time: { value: 287, title: "Time (hours)" },
    time_to_complete_a_corporate_income_tax_audit: { value: 0, title: "Time to complete a corporate income tax audit (weeks)" },
    time_to_comply_with_corporate_income_tax_audit: { value: 7, title: "Time to comply with corporate income tax audit (hours)" },
    time_to_comply_with_vat_refund: { value: 'NO VAT', title: "Time to comply with VAT refund (hours)", notNumber: true },
    time_to_obtain_vat_refund: { value: 'NO VAT', title: "Time to obtain VAT refund (weeks)", notNumber: true },
    total_tax_and_contribution_rate: { value: 49, title: "Total tax and contribution rate (% of profit)" },
    ease_of_paying_taxes_score: { value: 106, title: "Ease of Taxes RANK", static: true, },
    postfiling_index: { value: 95.0, title: "Postfiling index (0-100)", static: true, },
    search_score: { value: 69.5, title: "Ease of paying taxes score", static: true, },
  },
  trading_across_borders: {
    cost_to_export_border_compliance: { value: 825, title: "Cost to export: Border compliance (US$)" },
    cost_to_export_documentary_compliance: { value: 240, title: "Cost to export: Documentary compliance (US$)" },
    cost_to_import_border_compliance: { value: 1030, title: "Cost to import: Border compliance (US$)" },
    cost_to_import_documentary_compliance: { value: 460, title: "Cost to import: Documentary compliance (US$)" },
    time_to_export_border_compliance: { value: 164, title: "Time to export: Border compliance (hours)" },
    time_to_export_documentary_compliance: { value: 96, title: "Time to export: Documentary compliance (hours)" },
    time_to_import_border_compliance: { value: 72, title: "Time to import: Border compliance (hours)" },
    time_to_import_documentary_compliance: { value: 96, title: "Time to import: Documentary compliance (hours)" },
    ease_of_trading_across_borders_score: { value: 174, title: "Ease of Trading RANK", static: true, },
    search_score: { value: 36.2, title: "Ease of trading across borders score", static: true, },
  },
  enforcing_contracts: {
    cost: { value: 44.4, title: "Cost (% of claim)" },
    quality_of_judicial_processes_index: { value: 5.5, title: "Quality of judicial processes index (0-18)" },
    time: { value: 1296, title: "Time (days)" },
    ease_of_enforcing_contracts_score: { value: 186, title: "Ease of Contracts RANK", static: true, },
    search_score: { value: 28.1, title: "Ease of enforcing contracts score", static: true, },
  },
  resolving_insolvency: {
    recovery_rate: { value: 0, title: "Recovery rate (cents on the dollar)" },
    strength_of_insolvency_framework_index: { value: 0, title: "Strength of insolvency framework index (0-16)" },
    ease_of_resolving_insolvency_score: { value: 168, title: "Ease of Resolving Insolvency RANK", static: true, },
    search_score: { value: 0, title: "Ease of resolving insolvency score", static: true, },
  },
  ease_of_doing_business: {
    overall_ease_of_doing_business_score_as_of_current_data: { value: 177, title: "Rank as of Current Data", static: true, },
    search_score: { value: 41.3, title: "Overall ease of doing business score as of current data (0-100)", static: true, },
  },
}
