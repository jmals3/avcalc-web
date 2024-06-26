import {colors} from "./constants.js";

const plandata =
    {
        "client_id": null,
        "plans": [
            {
                "name": "PPO",
                "carrier": "Aetna",
                "scenario": "Status Quo",
                "plan_type": "PPO",
                "color": colors[0],
                "tiers": [
                    {
                        "name": "In-Network",
                        "discount_percent": 0.8,
                        "utilization_percent": 0.8,
                        "ind_ded": 1000,
                        "fam_ded": 2000,
                        "ind_oopm": 4000,
                        "fam_oopm": 8000,
                        "ded_type_family": false,
                        "oopm_type_family": false,
                        "fam_embd_ind_ded": -1,
                        "fam_embd_ind_oopm": -1,
                        "rx_ind_ded": -1,
                        "rx_fam_ded": -1,
                        "rx_ind_oopm": -1,
                        "rx_fam_oopm": -1,
                        "rx_embd_ind_ded": -1,
                        "rx_embd_ind_oopm": -1,
                        "coinsurance": 0.8,
                        "service_cost_sharing": {
                            "PCP": {"Copay": -10, "Coins": -1, "PerDiem": false},
                            "SCP": {"Copay": -35, "Coins": -1, "PerDiem": false},
                            "Prev": {"Copay": 0, "Coins": -1, "PerDiem": false},
                            "ER": {"Copay": -200, "Coins": -1, "PerDiem": false},
                            "OPFac": {"Copay": -20, "Coins": -1, "PerDiem": false},
                            "RxGeneric": {"Copay": -10, "Coins": -1, "PerDiem": false},
                            "RxPrefBrand": {
                                "Copay": -35, "Coins": -1, "PerDiem": false},
                            "RxNonPrefBrand": {"Copay": -70, "Coins": -1, "PerDiem": false},
                            "RxSpecialty": {"Copay": -35, "Coins": -1, "PerDiem": false},
                        }
                    },
                    {

                        "name": "Out-of-Network",
                        "discount_percent": 0.0,
                        "utilization_percent": 0.05,
                        "ind_ded": 4000,
                        "fam_ded": 8000,
                        "ind_oopm": 8000,
                        "fam_oopm": 16000,
                        "family_ded_oopm": false,
                        "fam_embd_ind_ded": -1,
                        "fam_embd_ind_oopm": -1,
                        "rx_ind_ded": -1,
                        "rx_fam_ded": -1,
                        "rx_ind_oopm": -1,
                        "rx_fam_oopm": -1,
                        "rx_embd_ind_ded": -1,
                        "rx_embd_ind_oopm": -1,
                        "coinsurance": 0.5,
                    }
                ],
                "hsa_seed_ind": 0,
                "hsa_seed_fam": 0,
                "hra_fund_ind": 0,
                "hra_fund_fam": 0,
                "hra_first_dollar": false,
                "hra_forfeiture_pct": 0,
                "av_paid_amt": 0,
                "av_allowed_amt": 0,
                "av": 0,
                "av_hash": "",
                "av_version": "0",
            },
            {
                "name": "HDHP",
                "carrier": "Aetna",
                "scenario": "Status Quo",
                "plan_type": "PPO",
                "color": colors[1],
                "tiers": [
                    {
                        "name": "In-Network",
                        "discount_percent": 0.8,
                        "utilization_percent": 0.8,
                        "ind_ded": 3200,
                        "fam_ded": 6400,
                        "ind_oopm": 6000,
                        "fam_oopm": 12000,
                        "ded_type_family": false,
                        "oopm_type_family": false,
                        "fam_embd_ind_ded": -1,
                        "fam_embd_ind_oopm": -1,
                        "rx_ind_ded": -1,
                        "rx_fam_ded": -1,
                        "rx_ind_oopm": -1,
                        "rx_fam_oopm": -1,
                        "rx_embd_ind_ded": -1,
                        "rx_embd_ind_oopm": -1,
                        "coinsurance": 0.8
                    },
                    {

                        "name": "Out-of-Network",
                        "discount_percent": 0.0,
                        "utilization_percent": 0.05,
                        "ind_ded": 6400,
                        "fam_ded": 12800,
                        "ind_oopm": 12800,
                        "fam_oopm": 25600,
                        "family_ded_oopm": false,
                        "fam_embd_ind_ded": -1,
                        "fam_embd_ind_oopm": -1,
                        "rx_ind_ded": -1,
                        "rx_fam_ded": -1,
                        "rx_ind_oopm": -1,
                        "rx_fam_oopm": -1,
                        "rx_embd_ind_ded": -1,
                        "rx_embd_ind_oopm": -1,
                        "coinsurance": 0.5,
                    }
                ],
                "hsa_seed_ind": 0,
                "hsa_seed_fam": 0,
                "hra_fund_ind": 0,
                "hra_fund_fam": 0,
                "hra_first_dollar": false,
                "hra_forfeiture_pct": 0,
                "av_paid_amt": 0,
                "av_allowed_amt": 0,
                "av": 0,
                "av_hash": "",
                "av_version": "0",
            },
            {
                "name": "PPO",
                "carrier": "Aetna",
                "scenario": "Status Quo",
                "plan_type": "PPO",
                "color": colors[2],
                "tiers": [
                    {
                        "name": "In-Network",
                        "discount_percent": 0.8,
                        "utilization_percent": 0.8,
                        "ind_ded": 1000,
                        "fam_ded": 2000,
                        "ind_oopm": 4000,
                        "fam_oopm": 8000,
                        "ded_type_family": false,
                        "oopm_type_family": false,
                        "fam_embd_ind_ded": -1,
                        "fam_embd_ind_oopm": -1,
                        "rx_ind_ded": -1,
                        "rx_fam_ded": -1,
                        "rx_ind_oopm": -1,
                        "rx_fam_oopm": -1,
                        "rx_embd_ind_ded": -1,
                        "rx_embd_ind_oopm": -1,
                        "coinsurance": 0.8
                    },
                    {

                        "name": "Out-of-Network",
                        "discount_percent": 0.0,
                        "utilization_percent": 0.05,
                        "ind_ded": 4000,
                        "fam_ded": 8000,
                        "ind_oopm": 8000,
                        "fam_oopm": 16000,
                        "family_ded_oopm": false,
                        "fam_embd_ind_ded": -1,
                        "fam_embd_ind_oopm": -1,
                        "rx_ind_ded": -1,
                        "rx_fam_ded": -1,
                        "rx_ind_oopm": -1,
                        "rx_fam_oopm": -1,
                        "rx_embd_ind_ded": -1,
                        "rx_embd_ind_oopm": -1,
                        "coinsurance": 0.5,
                    }
                ],
                "hsa_seed_ind": 0,
                "hsa_seed_fam": 0,
                "hra_fund_ind": 0,
                "hra_fund_fam": 0,
                "hra_first_dollar": false,
                "hra_forfeiture_pct": 0,
                "av_paid_amt": 0,
                "av_allowed_amt": 0,
                "av": 0,
                "av_hash": "",
                "av_version": "0",
            },
            {
                "name": "HDHP",
                "carrier": "Aetna",
                "scenario": "Status Quo",
                "plan_type": "PPO",
                "color": colors[3],
                "tiers": [
                    {
                        "name": "In-Network",
                        "discount_percent": 0.8,
                        "utilization_percent": 0.8,
                        "ind_ded": 3200,
                        "fam_ded": 6400,
                        "ind_oopm": 6000,
                        "fam_oopm": 12000,
                        "ded_type_family": false,
                        "oopm_type_family": false,
                        "fam_embd_ind_ded": -1,
                        "fam_embd_ind_oopm": -1,
                        "rx_ind_ded": -1,
                        "rx_fam_ded": -1,
                        "rx_ind_oopm": -1,
                        "rx_fam_oopm": -1,
                        "rx_embd_ind_ded": -1,
                        "rx_embd_ind_oopm": -1,
                        "coinsurance": 0.8
                    },
                    {

                        "name": "Out-of-Network",
                        "discount_percent": 0.0,
                        "utilization_percent": 0.05,
                        "ind_ded": 6400,
                        "fam_ded": 12800,
                        "ind_oopm": 12800,
                        "fam_oopm": 25600,
                        "family_ded_oopm": false,
                        "fam_embd_ind_ded": -1,
                        "fam_embd_ind_oopm": -1,
                        "rx_ind_ded": -1,
                        "rx_fam_ded": -1,
                        "rx_ind_oopm": -1,
                        "rx_fam_oopm": -1,
                        "rx_embd_ind_ded": -1,
                        "rx_embd_ind_oopm": -1,
                        "coinsurance": 0.5,
                    }
                ],
                "hsa_seed_ind": 0,
                "hsa_seed_fam": 0,
                "hra_fund_ind": 0,
                "hra_fund_fam": 0,
                "hra_first_dollar": false,
                "hra_forfeiture_pct": 0,
                "av_paid_amt": 0,
                "av_allowed_amt": 0,
                "av": 0,
                "av_hash": "",
                "av_version": "0",
            }
        ]
    }

export default plandata;