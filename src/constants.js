export const colors = ['#4CAF50', '#FFC107', '#2196F3', '#FF5722', '#009688', '#9C27B0'];
// export const planColors = ['#a6e2a8', '#ffd453', '#6fbfff', '#ff916e', '#3cc9bc', '#d376e3'];

const avColors = {
    info:
        {
            info: '#222',
            plan: '#222',
            fields: '#282828',
        },
    results:
        {
            results: '#333',
            calculation: '#333',
            fields: '#333',
        },
    global:
        {
            global: '#536878',
            deductible: '#536878',
            oopm: '#536878',
            coinsurance: '#536878',
            fields: '#434d55',
        },
    medicalServices:
        {
            medicalServices: '#658D6D',
            officeVisits: '#658D6D',
            inpatient: '#658D6D',
            outpatient: '#658D6D',
            otherProfessional: '#658D6D',
            fields: '#4C6050',
        },
    rx:
        {
            rx: '#395B63',
            retail: '#395B63',
            mailOrder: '#395B63',
            fields: '#36474B',
        }
}

export const designRows =
    [
        {
            name: 'Info',
            color: avColors.info.plan,
            cssClass: 'sticky-1',
            sections:
                [
                    {
                        name: 'Plan',
                        color: avColors.info.plan,
                        collapsable: false,
                        cssClass: 'sticky-1',
                        fields: [
                            {
                                name: 'Plan Name',
                                editable: true,
                                defaultValue: 'Plan Name',
                                tierSpecific: false,
                                mapTo: 'name',
                                color: avColors.info.fields,
                                format: 'text',
                                cssClass: 'group-top-row font-size-md sticky-1',
                            },
                            {
                                name: 'Scenario',
                                editable: true,
                                defaultValue: 'Current',
                                tierSpecific: false,
                                mapTo: 'scenario',
                                color: avColors.info.fields,
                                format: 'text',
                                cssClass: 'font-size-md sticky-2',
                            },
                            // {
                            //     name: 'Plan Type',
                            //     editable: true,
                            //     defaultValue: 'PPO',
                            //     options: ['Combined', 'Separate'],
                            //     suggestions: ['PPO', 'HMO', 'POS', 'EPO', 'Indemnity'],
                            //     tierSpecific: false,
                            //     mapTo: 'plan_type',
                            //     format: 'text',
                            // },
                            {
                                name: 'Network Tier',
                                editable: true,
                                defaultValue: 'In-Network',
                                suggestions: ['In-Network', 'Out-of-Network', 'Preferred In-Network', 'Non-Preferred In-Network'],
                                tierSpecific: true,
                                mapTo: 'name',
                                color: avColors.info.fields,
                                format: 'text',
                                cssClass: 'sticky-3',
                            },
                        ]
                    },
                ],
        },
        {
            name: 'Results',
            color: avColors.results.results,
            cssClass: 'sticky-4',
            sections:
                [
                    {
                        name: 'Calculation',
                        color: avColors.results.calculation,
                        collapsable: false,
                        cssClass: 'sticky-4',
                        fields: [
                            {
                                name: 'Paid Amount',
                                editable: false,
                                defaultValue: '',
                                tierSpecific: false,
                                mapTo: 'av_paid_amt',
                                color: avColors.results.fields,
                                format: 'dollar',
                                cssClass: 'group-top-row sticky-4',
                            },
                            {
                                name: 'Allowed Amount',
                                editable: false,
                                defaultValue: '',
                                tierSpecific: false,
                                mapTo: 'av_allowed_amt',
                                color: avColors.results.fields,
                                format: 'dollar',
                                cssClass: 'sticky-5',
                            },
                            {
                                name: 'Actuarial Value',
                                editable: false,
                                defaultValue: '',
                                tierSpecific: false,
                                mapTo: 'av',
                                color: avColors.results.fields,
                                format: 'percent',
                                cssClass: 'sticky-6',
                            },
                        ],
                    },
                ],
        },
        {
            name: 'Global',
            color: avColors.global.global,
            sections:
                [
                    {
                        name: 'Deductible',
                        color: avColors.global.deductible,
                        collapsable: false,
                        fields: [
                            {
                                name: 'Deductible Type',
                                editable: true,
                                defaultValue: 'Embedded',
                                options: ['Embedded', 'Family', 'Family Embedded'],
                                tierSpecific: true,
                                calculated: true,
                                mapTo: 'ded_type_family',
                                color: avColors.global.fields,
                                format: 'text',
                                cssClass: 'group-top-row',
                                tooltip: 'Embedded: The deductible is met when a member\'s out of pocket costs surpass the ' +
                                    'individual deductible or the family\'s out of pocket costs have exceeded the family deductible. ' +
                                    'Family: The deductible is met when the family\'s out of pocket costs have exceeded the family deductible. ' +
                                    'Family Embedded: The deductible is met when a member\'s out of pocket costs surpass the family ' +
                                    'embedded deductible or the family\'s out of pocket costs have exceeded the family deductible.' +
                                    'Note: For employee-only coverage, the individual deductible is all that applies.'
                            },
                            {
                                name: 'Separate Rx Deductible?',
                                editable: true,
                                defaultValue: 'No',
                                options: ['Yes', 'No'],
                                tierSpecific: true,
                                calculated: true,
                                color: avColors.global.fields,
                                format: 'text',
                            },
                            {
                                name: 'Individual Deductible',
                                editable: true,
                                defaultValue: '1000',
                                tierSpecific: true,
                                mapTo: 'ind_ded',
                                color: avColors.global.fields,
                                format: 'dollar',
                            },
                            {
                                name: 'Family Deductible',
                                editable: true,
                                defaultValue: '2000',
                                tierSpecific: true,
                                mapTo: 'fam_ded',
                                color: avColors.global.fields,
                                format: 'dollar',
                            },
                            {
                                name: 'Family Embedded Deductible',
                                editable: true,
                                defaultValue: '',
                                tierSpecific: true,
                                mapTo: 'fam_embd_ind_ded',
                                color: avColors.global.fields,
                                format: 'dollar',
                                nullable: true,
                            },
                            {
                                name: 'Rx Individual Deductible',
                                editable: true,
                                defaultValue: '',
                                tierSpecific: true,
                                mapTo: 'rx_ind_ded',
                                color: avColors.global.fields,
                                format: 'dollar',
                                nullable: true,
                            },
                            {
                                name: 'Rx Family Deductible',
                                editable: true,
                                defaultValue: '',
                                tierSpecific: true,
                                mapTo: 'rx_fam_ded',
                                color: avColors.global.fields,
                                format: 'dollar',
                                nullable: true,
                            },
                            // {
                            //     name: 'Rx Family Embedded Deductible',
                            //     editable: true,
                            //     defaultValue: '',
                            //     tierSpecific: true,
                            //     mapTo: 'rx_embd_ind_ded',
                            //     format: 'dollar',
                            //     nullable: true,
                            // },
                        ]
                    },
                    {
                        name: 'Out-of-Pocket Max',
                        color: avColors.global.oopm,
                        collapsable: false,
                        fields: [
                            {
                                name: 'Out-of-Pocket Max Type',
                                editable: true,
                                defaultValue: 'Embedded',
                                options: ['Embedded', 'Family', 'Family Embedded'],
                                tierSpecific: true,
                                calculated: true,
                                mapTo: 'oopm_type_family',
                                color: avColors.global.fields,
                                format: 'text',
                                cssClass: 'section-top-row',
                                tooltip: 'Embedded: The out-of-pocket max is met when a member\'s out of pocket costs surpass the ' +
                                    'individual out-of-pocket max or the family\'s out of pocket costs have exceeded the family out-of-pocket max. ' +
                                    'Family: The out-of-pocket max is met when the family\'s out of pocket costs have exceeded the family out-of-pocket max. ' +
                                    'Family Embedded: The out-of-pocket max is met when a member\'s out of pocket costs surpass the family ' +
                                    'embedded out-of-pocket max or the family\'s out of pocket costs have exceeded the family out-of-pocket max. ' +
                                    'Note: For employee-only coverage, the individual out-of-pocket max is all that applies.'
                            },
                            {
                                name: 'Separate Rx Out-of-Pocket Max?',
                                editable: true,
                                defaultValue: 'No',
                                options: ['Yes', 'No'],
                                tierSpecific: true,
                                calculated: true,
                                color: avColors.global.fields,
                                format: 'text',
                            },
                            {
                                name: 'Individual Out-of-Pocket Max',
                                editable: true,
                                defaultValue: '1000',
                                tierSpecific: true,
                                mapTo: 'ind_oopm',
                                color: avColors.global.fields,
                                format: 'dollar',
                            },
                            {
                                name: 'Family Out-of-Pocket Max',
                                editable: true,
                                defaultValue: '2000',
                                tierSpecific: true,
                                mapTo: 'fam_oopm',
                                color: avColors.global.fields,
                                format: 'dollar',
                            },
                            {
                                name: 'Family Embedded Out-of-Pocket Max',
                                editable: true,
                                defaultValue: '',
                                tierSpecific: true,
                                mapTo: 'fam_embd_ind_oopm',
                                color: avColors.global.fields,
                                format: 'dollar',
                                nullable: true,
                            },
                            {
                                name: 'Rx Individual Out-of-Pocket Max',
                                editable: true,
                                defaultValue: '',
                                tierSpecific: true,
                                mapTo: 'rx_ind_oopm',
                                color: avColors.global.fields,
                                format: 'dollar',
                                nullable: true,
                            },
                            {
                                name: 'Rx Family Out-of-Pocket Max',
                                editable: true,
                                defaultValue: '',
                                tierSpecific: true,
                                mapTo: 'rx_fam_oopm',
                                color: avColors.global.fields,
                                format: 'dollar',
                                nullable: true,
                            },
                            // {
                            //     name: 'Rx Family Embedded Out-of-Pocket Max',
                            //     editable: true,
                            //     defaultValue: '',
                            //     tierSpecific: true,
                            //     mapTo: 'rx_embd_ind_oopm',
                            //     format: 'dollar',
                            //     nullable: true,
                            // },
                        ]
                    },
                    {
                        name: 'Coinsurance',
                        color: avColors.global.coinsurance,
                        collapsable: false,
                        fields: [
                            {
                                name: 'Plan Coinsurance',
                                editable: true,
                                defaultValue: '80%',
                                tierSpecific: true,
                                mapTo: 'coinsurance',
                                color: avColors.global.fields,
                                format: 'percent',
                                cssClass: 'section-top-row',
                            },
                            {
                                name: 'Member Coinsurance',
                                editable: false,
                                defaultValue: '20%',
                                tierSpecific: true,
                                calculated: true,
                                color: avColors.global.fields,
                                format: 'percent',
                            },
                        ],
                    },
                ],
        },
        {
            name: 'Medical Services',
            color: avColors.medicalServices.medicalServices,
            sections:
                [
                    {
                        name: 'Office Visits',
                        color: avColors.medicalServices.officeVisits,
                        collapsable: false,
                        fields: [
                            {
                                name: 'Primary Care Visit',
                                editable: true,
                                tierSpecific: true,
                                mapTo: 'PCP',
                                color: avColors.medicalServices.fields,
                                format: 'service',
                                cssClass: 'group-top-row',
                            },
                            {
                                name: 'Specialist Visit',
                                editable: true,
                                tierSpecific: true,
                                mapTo: 'SCP',
                                color: avColors.medicalServices.fields,
                                format: 'service',
                            },
                            {
                                name: 'Preventive Care',
                                editable: true,
                                tierSpecific: true,
                                mapTo: 'Prev',
                                color: avColors.medicalServices.fields,
                                format: 'service',
                            },
                        ],
                    },
                    {
                        name: 'Inpatient',
                        color: avColors.medicalServices.inpatient,
                        collapsable: false,
                        fields: [
                            {
                                name: 'Inpatient Hospital',
                                editable: true,
                                tierSpecific: true,
                                mapTo: 'IP',
                                perDiemOption: true,
                                color: avColors.medicalServices.fields,
                                format: 'service',
                                cssClass: 'section-top-row',
                            },
                            {
                                name: 'Skilled Nursing Facility',
                                editable: true,
                                tierSpecific: true,
                                mapTo: 'SNF',
                                perDiemOption: true,
                                color: avColors.medicalServices.fields,
                                format: 'service',
                            },
                        ],
                    },
                    {
                        name: 'Outpatient',
                        color: avColors.medicalServices.outpatient,
                        collapsable: false,
                        fields: [
                            {
                                name: 'Emergency Room',
                                editable: true,
                                tierSpecific: true,
                                mapTo: 'ER',
                                color: avColors.medicalServices.fields,
                                format: 'service',
                                cssClass: 'section-top-row',
                            },
                            {
                                name: 'Outpatient Surgery',
                                editable: true,
                                tierSpecific: true,
                                mapTo: ['OPFac', 'OPProf'],
                                color: avColors.medicalServices.fields,
                                format: 'service',
                            },
                            {
                                name: 'Diagnostic Test (X-Ray, Labs)',
                                editable: true,
                                tierSpecific: true,
                                mapTo: ['XRay', 'LabFac'],
                                color: avColors.medicalServices.fields,
                                format: 'service',
                            },
                            {
                                name: 'Imaging (CT/PET Scans, MRIs)',
                                editable: true,
                                tierSpecific: true,
                                mapTo: 'ImgFac',
                                color: avColors.medicalServices.fields,
                                format: 'service',
                            },
                        ],
                    },
                    {
                        name: 'Other Professional',
                        color: avColors.medicalServices.otherProfessional,
                        collapsable: false,
                        fields: [
                            {
                                name: 'Psychiatrist',
                                editable: true,
                                tierSpecific: true,
                                mapTo: 'MHProf',
                                color: avColors.medicalServices.fields,
                                format: 'service',
                                cssClass: 'section-top-row',
                            },
                            {
                                name: 'Radiologist',
                                editable: true,
                                tierSpecific: true,
                                mapTo: 'ImgProf',
                                color: avColors.medicalServices.fields,
                                format: 'service',
                            },
                            {
                                name: 'Pathologist',
                                editable: true,
                                tierSpecific: true,
                                mapTo: 'LabProf',
                                color: avColors.medicalServices.fields,
                                format: 'service',
                            },
                            {
                                name: 'Speech Therapist',
                                editable: true,
                                tierSpecific: true,
                                mapTo: 'STProf',
                                color: avColors.medicalServices.fields,
                                format: 'service',
                            },
                            {
                                name: 'Occupational/Physical Therapist',
                                editable: true,
                                tierSpecific: true,
                                mapTo: 'OTProf',
                                color: avColors.medicalServices.fields,
                                format: 'service',
                            },
                        ],
                    },
                ],
        },
        {
            name: 'Rx',
            color: avColors.rx.rx,
            sections:
                [
                    {
                        name: 'Retail',
                        color: avColors.rx.retail,
                        collapsable: false,
                        fields: [
                            {
                                name: 'Generic Drugs',
                                editable: true,
                                tierSpecific: true,
                                mapTo: 'RxGeneric',
                                color: avColors.rx.fields,
                                format: 'service',
                                cssClass: 'group-top-row',
                            },
                            {
                                name: 'Preferred Brand Drugs',
                                editable: true,
                                tierSpecific: true,
                                mapTo: 'RxPrefBrand',
                                color: avColors.rx.fields,
                                format: 'service',
                            },
                            {
                                name: 'Non-Preferred Brand Drugs',
                                editable: true,
                                tierSpecific: true,
                                mapTo: 'RxNonPrefBrand',
                                color: avColors.rx.fields,
                                format: 'service',
                            },
                            {
                                name: 'Specialty Drugs',
                                editable: true,
                                tierSpecific: true,
                                mapTo: 'RxSpecialty',
                                color: avColors.rx.fields,
                                format: 'service',
                            },
                        ],
                    },
                    {
                        name: 'Mail Order',
                        color: avColors.rx.mailOrder,
                        collapsable: false,
                        fields: [
                            {
                                name: 'Mail Order Multiple',
                                editable: true,
                                defaultValue: '',
                                options: ['Not Offered', 'Same as Retail', '2x Retail', '2.5x Retail', '3x Retail'],
                                tierSpecific: true,
                                mapTo: 'MailOrderMultiple',
                                color: avColors.rx.fields,
                                format: 'text',
                                cssClass: 'section-top-row',
                            },
                        ],
                    },
                ],
        }
    ];