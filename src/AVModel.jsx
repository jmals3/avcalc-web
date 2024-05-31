import React, {useState, useEffect, useRef, useMemo} from 'react';
import {designRows, colors, api} from "./constants.js";
import _plandata from "./plandata.js";
import _defaultPlan from "./defaultPlan.js";
import {hyphenStrs} from "./functions.js";
import ServiceCostSharingPopup from "./ServiceCostSharingPopUp.jsx";
import {FaCaretLeft, FaCaretRight, FaTimesCircle, FaTimes, FaPlusCircle} from "react-icons/fa";
import './AVModel.css';

function useDynamicRefs(rows, cols) {
    // Initialize state for storing refs
    const [refs, setRefs] = useState(() =>
        Array.from({length: rows}).map(() =>
            Array.from({length: cols}).map(() => React.createRef())
        )
    );

    useEffect(() => {
        // Create a new refs array based on the current rows and cols
        setRefs(
            Array.from({length: rows}).map(() =>
                Array.from({length: cols}).map(() => React.createRef())
            )
        );
    }, [rows, cols]); // Re-run this effect when rows or cols change

    return refs;
}

const AVModel = ({planData, updatePlanData}) => {
// const AVModel = () => {
    const [isLoading, setIsLoading] = useState(false);
    // const [planData, updatePlanData] = useState(_plandata);

    const rows = designRows.reduce((acc, group) => acc + group.sections.reduce((acc, section) => acc + section.fields.filter(field => field.editable).length, 0), 0);
    const cols = useMemo(() => planData.plans.reduce((acc, plan) => acc + plan.tiers.length, 0), [planData]);
    const inputRefs = useDynamicRefs(rows, cols);

    const [selectedCellData, setSelectedCellData] = useState(null);
    const [showPopup, setShowPopup] = useState(false);
    const selectedCellRef = useRef(null);

    const handleFocus = (e, field, planNum, tierNum) => {
        if (field.format === 'service') {
            selectedCellRef.current = e.target.getBoundingClientRect();
            const costShare = planData.plans[planNum].tiers[tierNum].service_cost_sharing?.[getFieldMap(field)];
            const cellData = {
                field: field,
                planNum: planNum,
                tierNum: tierNum,
                copay: costShare?.Copay ?? 0,
                coinsurance: costShare?.Coins ?? planData.plans[planNum].tiers[tierNum].coinsurance,
                perDiem: costShare?.PerDiem ?? false,
            }
            setSelectedCellData(cellData);
            setShowPopup(true);
        }
    };

    const handleBlur = (e) => {
        // Check if the related target is within the popup
        if (e.relatedTarget && e.relatedTarget.closest('.service-popup-box')) {
            // If it is, prevent the popup from closing
            e.preventDefault();
        } else {
            // If it's not, close the popup
            setShowPopup(false);
        }
    };

    const handleKeyDown = (e, fieldNum, planNum, tierNum) => {
        if (e.key === 'Enter' || e.key === 'ArrowDown') {
            e.preventDefault();
            const rows = designRows.flatMap(group => group.sections).flatMap(section => section.fields).filter(field => field.editable).length;
            var nextRow = (fieldNum + 1);
            const colIndex = planData.plans.slice(0, planNum).reduce((acc, plan) => acc + plan.tiers.length, 0) + tierNum;
            while (nextRow < rows) {
                if (inputRefs[nextRow][colIndex].current) {
                    inputRefs[nextRow][colIndex].current.focus();
                    // inputRefs[nextRow][colIndex].current.select();
                    break;
                }
                nextRow++;
            }
        } else if (e.key === 'ArrowUp') {
            e.preventDefault();
            var priorRow = (fieldNum - 1);
            const colIndex = planData.plans.slice(0, planNum).reduce((acc, plan) => acc + plan.tiers.length, 0) + tierNum;
            while (priorRow >= 0) {
                if (inputRefs[priorRow][colIndex].current) {
                    inputRefs[priorRow][colIndex].current.focus();
                    // inputRefs[priorRow][colIndex].current.select();
                    break;
                }
                priorRow--;
            }
        } else if (e.key === 'Escape') {
            e.preventDefault();
            const colIndex = planData.plans.slice(0, planNum).reduce((acc, plan) => acc + plan.tiers.length, 0) + tierNum;
            inputRefs[fieldNum][colIndex].current.blur();
        }
        //TODO: add ArrowLeft and ArrowRight?
    };

    const closePopup = () => {
        setShowPopup(false);
    }

    function getFieldWithMapTo(mapTo) {
        for (let group of designRows) {
            for (let section of group.sections) {
                for (let field of section.fields) {
                    if (Array.isArray(field.mapTo)) {
                        if (field.mapTo.includes(mapTo)) {
                            return field;
                        }
                    } else {
                        if (field.mapTo === mapTo) {
                            return field;
                        }
                    }
                }
            }
        }
        return null;
    }

    function getFieldMap(field) {
        if (Array.isArray(field.mapTo)) {
            return field.mapTo.length > 0 ? field.mapTo[0] : null;
        } else {
            return field.mapTo;
        }
    }

    function parseServiceInput(value) {
        // not used because input is handled through service box
        return value;
    }

    function sanitizeInput(field, value) {
        let strVal = value.toString();
        if (field.format === 'option') {
            return field.options.includes(strVal) ? strVal : field.options[0];
        }

        if (field.format === 'percent') {
            let result = parseFloat(strVal.replace(/[^0-9]/g, '')) / 100;
            if (isNaN(result)) {
                // return field.nullable ? -1 : 0;
                return 0;
            }
            if (result > 1) {
                return 1;
            }
            if (result < 0) {
                return 0;
            }
            return result;
        }

        if (field.format === 'dollar') {
            let result = parseInt(strVal.replace(/[^0-9.]/g, ''));
            if (isNaN(result)) {
                // if (!field.nullable) {
                //     return 0;
                // }
                // if (['rx_ind_ded', 'rx_fam_ded', 'rx_ind_oopm', 'rx_fam_oopm'].includes(getFieldMap(field))) {
                //     return 0;
                // }
                // return -1;
                return 0;
            }
            return result;
        }

        if (field.format === 'service') {
            return parseServiceInput(strVal);
        }

        return null;
    }

    const updateCostShare = (field, planNum, tierNum, copay, perDiem, coinsurance) => {
        let newPlanData = {...planData};
        if (!newPlanData.plans[planNum].tiers[tierNum].service_cost_sharing) {
            newPlanData.plans[planNum].tiers[tierNum].service_cost_sharing = {};
        }
        if (Array.isArray(field.mapTo)) {
            for (let mapTo of field.mapTo) {
                newPlanData.plans[planNum].tiers[tierNum].service_cost_sharing[mapTo] = {
                    Copay: copay,
                    Coins: coinsurance,
                    PerDiem: perDiem,
                };
            }
        } else {
            newPlanData.plans[planNum].tiers[tierNum].service_cost_sharing[getFieldMap(field)] = {
                Copay: copay,
                Coins: coinsurance,
                PerDiem: perDiem,
            };
        }
        delete newPlanData.plans[planNum].av_paid_amt;
        delete newPlanData.plans[planNum].av_allowed_amt;
        delete newPlanData.plans[planNum].av;
        updatePlanData(newPlanData);
    }

    const removeCostShare = (field, planNum, tierNum) => {
        let newPlanData = {...planData};
        delete newPlanData.plans[planNum].tiers[tierNum].service_cost_sharing[getFieldMap(field)];
        delete newPlanData.plans[planNum].av_paid_amt;
        delete newPlanData.plans[planNum].av_allowed_amt;
        delete newPlanData.plans[planNum].av;
        updatePlanData(newPlanData);
    }

    const updateFieldData = (field, value, planNum, tierNum = 0) => {
        let newPlanData = {...planData};
        if (!field.tierSpecific) {
            if (Array.isArray(field.mapTo)) {
                for (let mapTo of field.mapTo) {
                    newPlanData.plans[planNum][mapTo] = value;
                }
            } else {
                newPlanData.plans[planNum][getFieldMap(field)] = value;
            }
        } else {
            if (Array.isArray(field.mapTo)) {
                for (let mapTo of field.mapTo) {
                    newPlanData.plans[planNum].tiers[tierNum][mapTo] = value;
                }
            } else {
                newPlanData.plans[planNum].tiers[tierNum][getFieldMap(field)] = value;
            }
        }
        delete newPlanData.plans[planNum].av_paid_amt;
        delete newPlanData.plans[planNum].av_allowed_amt;
        delete newPlanData.plans[planNum].av;
        updatePlanData(newPlanData);
    }

    function changePlanColor(e, planNum) {
        let newPlanData = {...planData};
        newPlanData.plans[planNum].color = e.target.value;
        updatePlanData(newPlanData);
    }

    const addPlan = (planNum) => {
        let newPlanData = {...planData};
        let newPlan = _defaultPlan;
        newPlan.color = colors[Math.floor(Math.random() * colors.length)];
        newPlanData.plans.splice(planNum + 1, 0, newPlan);
        updatePlanData(newPlanData);
    }

    const removePlan = (planNum) => {
        let newPlanData = {...planData};
        newPlanData.plans.splice(planNum, 1);
        updatePlanData(newPlanData);
    }

    const removeTier = (planNum, tierNum) => {
        let newPlanData = {...planData};
        newPlanData.plans[planNum].tiers.splice(tierNum, 1);
        updatePlanData(newPlanData);
    }

    const addTier = (planNum, tierNum) => {
        let newPlanData = {...planData};
        let newTier = {...newPlanData.plans[planNum].tiers[tierNum]};
        newPlanData.plans[planNum].tiers.splice(tierNum + 1, 0, newTier);
        updatePlanData(newPlanData);
    }

    function movePlanLeft(planNum) {
        let newPlanData = {...planData};
        if (planNum > 0) {
            let temp = newPlanData.plans[planNum];
            newPlanData.plans[planNum] = newPlanData.plans[planNum - 1];
            newPlanData.plans[planNum - 1] = temp;
            updatePlanData(newPlanData);
        }
    }

    function movePlanRight(planNum) {
        let newPlanData = {...planData};
        if (planNum < newPlanData.plans.length - 1) {
            let temp = newPlanData.plans[planNum];
            newPlanData.plans[planNum] = newPlanData.plans[planNum + 1];
            newPlanData.plans[planNum + 1] = temp;
            updatePlanData(newPlanData);
        }
    }

    function checkPlanDataBeforeCalc() {
        for (let planNum in planData.plans) {
            // if there's no cost sharing for in-net Prev, then set as fully covered
            if (!planData.plans[planNum].tiers[0].service_cost_sharing || !planData.plans[planNum].tiers[0].service_cost_sharing?.Prev) {
                updateCostShare(getFieldWithMapTo('Prev'), planNum, 0, 0, false, -1);
            }
            // ensure cost sharing is set for both OP Fac/Prof and X-Ray/LabFac
            for (let tierNum in planData.plans[planNum].tiers) {
                let costSharing = planData.plans[planNum].tiers[tierNum].service_cost_sharing;
                if (costSharing) {
                    if (costSharing?.OPFac !== costSharing?.OPProf) {
                        if (costSharing?.OPFac) {
                            updateCostShare(getFieldWithMapTo('OPProf'), planNum, tierNum, costSharing.OPFac.Copay, false, costSharing.OPFac.Coins);
                        } else {
                            updateCostShare(getFieldWithMapTo('OPFac'), planNum, tierNum, costSharing.OPProf.Copay, false, costSharing.OPProf.Coins);
                        }
                    }
                    if (costSharing?.XRay !== costSharing?.LabFac) {
                        if (costSharing?.XRay) {
                            updateCostShare(getFieldWithMapTo('LabFac'), planNum, tierNum, costSharing.XRay.Copay, false, costSharing.XRay.Coins);
                        } else {
                            updateCostShare(getFieldWithMapTo('XRay'), planNum, tierNum, costSharing.LabFac.Copay, false, costSharing.LabFac.Coins);
                        }
                    }
                }
            }
        }
    }

    const handleClickCalcAV = async () => {
        setIsLoading(true);
        checkPlanDataBeforeCalc();
        try {
            const response = await fetch(api + '/av/calc', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(
                    {client_id: planData.client_id, plans: planData.plans.filter(p => !p.av)}
                ),
                credentials: 'include',
            });
            const calcData = await response.json();
            let updatedPlans = [];
            for (let plan of planData.plans) {
                if (plan.av) {
                    updatedPlans.push(plan);
                } else {
                    updatedPlans.push(calcData.plans.shift());
                }
            }
            let updatedPlanData = {
                client_id: calcData.client_id,
                plans: updatedPlans,
            }
            updatePlanData(updatedPlanData);
        } catch (error) {
            console.error('Error:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleSelectChange = (e, field, planNum, tierNum) => {
        let val = e.target.value;
        switch (field.name) {
            case 'Separate Rx Deductible?':
                if (val === 'Yes') {
                    updateFieldData(getFieldWithMapTo('rx_ind_ded'), 0, planNum, tierNum);
                    updateFieldData(getFieldWithMapTo('rx_fam_ded'), 0, planNum, tierNum);
                    // if (getTierDataValue(planData.plans[planNum].tiers[tierNum], getFieldWithMapTo('fam_embd_ind_ded')) >= 0) {
                    //     updatePlanData(getFieldWithMapTo('rx_embd_ind_ded'), 0, planNum, tierNum);
                    // }
                } else {
                    updateFieldData(getFieldWithMapTo('rx_ind_ded'), -1, planNum, tierNum);
                    updateFieldData(getFieldWithMapTo('rx_fam_ded'), -1, planNum, tierNum);
                    // updatePlanData(getFieldWithMapTo('rx_embd_ind_ded'), -1, planNum, tierNum);
                }
                break;
            case 'Separate Rx Out-of-Pocket Max?':
                if (val === 'Yes') {
                    updateFieldData(getFieldWithMapTo('rx_ind_oopm'), 0, planNum, tierNum);
                    updateFieldData(getFieldWithMapTo('rx_fam_oopm'), 0, planNum, tierNum);
                    // if (getTierDataValue(planData.plans[planNum].tiers[tierNum], getFieldWithMapTo('fam_embd_ind_oopm')) >= 0) {
                    //     updatePlanData(getFieldWithMapTo('rx_embd_ind_oopm'), 0, planNum, tierNum);
                    // }
                } else {
                    updateFieldData(getFieldWithMapTo('rx_ind_oopm'), -1, planNum, tierNum);
                    updateFieldData(getFieldWithMapTo('rx_fam_oopm'), -1, planNum, tierNum);
                    // updatePlanData(getFieldWithMapTo('rx_embd_ind_oopm'), -1, planNum, tierNum);
                }
                break;
            case 'Deductible Type':
                if (val === 'Family Embedded') {
                    updateFieldData(getFieldWithMapTo('ded_type_family'), true, planNum, tierNum);
                    updateFieldData(getFieldWithMapTo('fam_embd_ind_ded'), planData.plans[planNum].tiers[tierNum].ind_ded, planNum, tierNum);
                    // updatePlanData(getFieldWithMapTo('rx_embd_ind_ded'), planData.plans[planNum].tiers[tierNum].rx_ind_ded, planNum, tierNum);
                } else if (val === 'Family') {
                    updateFieldData(getFieldWithMapTo('ded_type_family'), true, planNum, tierNum);
                    updateFieldData(getFieldWithMapTo('fam_embd_ind_ded'), -1, planNum, tierNum);
                    // updatePlanData(getFieldWithMapTo('rx_embd_ind_ded'), -1, planNum, tierNum);
                } else {
                    updateFieldData(getFieldWithMapTo('ded_type_family'), false, planNum, tierNum);
                    updateFieldData(getFieldWithMapTo('fam_embd_ind_ded'), -1, planNum, tierNum);
                    // updatePlanData(getFieldWithMapTo('rx_embd_ind_ded'), -1, planNum, tierNum);
                }
                break;
            case 'Out-of-Pocket Max Type':
                if (val === 'Family Embedded') {
                    updateFieldData(getFieldWithMapTo('oopm_type_family'), true, planNum, tierNum);
                    updateFieldData(getFieldWithMapTo('fam_embd_ind_oopm'), planData.plans[planNum].tiers[tierNum].ind_oopm, planNum, tierNum);
                    // updatePlanData(getFieldWithMapTo('rx_embd_ind_oopm'), planData.plans[planNum].tiers[tierNum].rx_ind_oopm, planNum, tierNum);
                } else if (val === 'Family') {
                    updateFieldData(getFieldWithMapTo('oopm_type_family'), true, planNum, tierNum);
                    updateFieldData(getFieldWithMapTo('fam_embd_ind_oopm'), -1, planNum, tierNum);
                    // updatePlanData(getFieldWithMapTo('rx_embd_ind_oopm'), -1, planNum, tierNum);
                } else {
                    updateFieldData(getFieldWithMapTo('oopm_type_family'), false, planNum, tierNum);
                    updateFieldData(getFieldWithMapTo('fam_embd_ind_oopm'), -1, planNum, tierNum);
                    // updatePlanData(getFieldWithMapTo('rx_embd_ind_oopm'), -1, planNum, tierNum);
                }
                break;
            default:
                break;
        }
    }

    function getCalculateButton(plan, planNum) {
        return <td colSpan={plan.tiers.length}
                   rowSpan={3}
                   className={'plan-data last-tier group-top-row sticky-4'}
                   key={'av-results-calc-' + planNum}>
            {isLoading
                ? <span>Loading...</span>
                : <button className={'calcbtn'} onClick={handleClickCalcAV} disabled={isLoading}>Calculate</button>
            }
        </td>;
    }

    function getCalculatedPlanValue(plan, field) {
        switch (field.name) {
            default:
                return '';
        }
    }

    function getCalculatedTierValue(tier, field) {
        switch (field.name) {
            case 'Separate Rx Deductible?':
                return tier.rx_ind_ded >= 0 ? 'Yes' : 'No';
            case 'Separate Rx Out-of-Pocket Max?':
                return tier.rx_ind_oopm >= 0 ? 'Yes' : 'No';
            case 'Deductible Type':
                if (tier.fam_embd_ind_ded >= 0) {
                    return 'Family Embedded';
                } else if (tier.ded_type_family) {
                    return 'Family';
                } else {
                    return 'Embedded';
                }
            case 'Out-of-Pocket Max Type':
                if (tier.fam_embd_ind_oopm >= 0) {
                    return 'Family Embedded';
                } else if (tier.oopm_type_family) {
                    return 'Family';
                } else {
                    return 'Embedded';
                }
            case 'Member Coinsurance':
                return 1 - tier.coinsurance;
            default:
                return '';
        }
    }

    function getPlanDataValue(plan, field) {
        if (field.calculated) {
            return getCalculatedPlanValue(plan, field);
        }
        return plan[getFieldMap(field)];
    }

    function getTierDataValue(tier, field) {
        if (field.format === 'service') {
            let value = tier?.service_cost_sharing?.[getFieldMap(field)];
            if (value) {
                return value;
            } else {
                let isPrev = getFieldMap(field) === 'Prev' &&
                    !tier.name.toUpperCase().includes('OON') &&
                    !tier.name.toUpperCase().includes('OUT OF ') &&
                    !tier.name.toUpperCase().includes('OUT-OF-');
                return {
                    Copay: 0,
                    Coins: isPrev ? -1 : tier.coinsurance,
                    PerDiem: false,
                }
            }
        }
        if (field.calculated) {
            return getCalculatedTierValue(tier, field);
        }
        return tier[getFieldMap(field)];
    }

    function getCopayStr(copay, perDiem) {
        let copayAmt = Math.abs(copay);
        let copayStr = copayAmt.toLocaleString('en-US', {
            style: 'currency',
            currency: 'USD',
            minimumFractionDigits: 0,
            maximumFractionDigits: 0
        });
        return copayStr + (perDiem ? ' per day' : ' copay');
    }

    function getCoinsuranceStr(coinsurance) {
        let coinsAmt = 1 - Math.abs(coinsurance);
        return coinsAmt.toLocaleString('en-US', {
            style: 'percent',
            minimumFractionDigits: 0,
            maximumFractionDigits: 0
        });
    }

    function getServiceValueStr(value) {
        let copay = value.Copay;
        let coinsurance = value.Coins;
        let perDiem = value.PerDiem;

        if (coinsurance === -1) {
            if (copay === 0) {
                return 'Fully covered';
            } else {
                let copayStr = getCopayStr(copay, perDiem);
                if (copay < 0) {
                    return copayStr;
                } else {
                    return copayStr + ' *';
                }
            }
        } else if (copay === 0) {
            if (coinsurance === 0) {
                return 'Not covered';
            } else {
                let coinsStr = getCoinsuranceStr(coinsurance);
                if (coinsurance < 0) {
                    return coinsStr;
                } else {
                    return coinsStr + ' *';
                }
            }
        } else {
            let copayStr = getCopayStr(copay, perDiem);
            let coinsStr = getCoinsuranceStr(coinsurance);
            if (copay < 0) {
                if (coinsurance < 0) {
                    return copayStr + ' + ' + coinsStr;
                } else {
                    return copayStr + ' + ' + coinsStr + ' *';
                }
            } else {
                if (coinsurance < 0) {
                    return coinsStr + ' + ' + copayStr + ' *';
                } else {
                    return '(' + copayStr.replace(' copay', '') + ' + ' + coinsStr + ') *';
                }
            }
        }
    }

    function getFormattedValue(value, format) {
        switch (format) {
            case 'percent':
                if (value < 0) {
                    return '';
                }
                return value.toLocaleString('en-US', {
                    style: 'percent',
                    minimumFractionDigits: 0,
                    maximumFractionDigits: 1
                });
            case 'dollar':
                if (value < 0) {
                    return '';
                }
                return value.toLocaleString('en-US', {
                    style: 'currency',
                    currency: 'USD',
                    minimumFractionDigits: 0,
                    maximumFractionDigits: 0
                });
            case 'service':
                return getServiceValueStr(value);
            default:
                return value;
        }
    }

    function getDataCellInput(val, field, planNum, tierNum = 0) {
        let formattedVal = getFormattedValue(val, field.format);
        let fieldNum = designRows.flatMap(group => group.sections.flatMap(section => section.fields)).filter(field => field.editable).findIndex(f => f.name === field.name);
        let colIndex = planData.plans.slice(0, planNum).reduce((acc, plan) => acc + plan.tiers.length, 0) + tierNum;
        let isDedCoins = getCoinsuranceStr(planData.plans[planNum].tiers[tierNum].coinsurance) + ' *' === formattedVal;
        if (!field.editable) {
            return formattedVal;
        }
        if ('options' in field) {
            return (
                <select value={formattedVal}
                        onChange={(e) => handleSelectChange(e, field, planNum, tierNum)}
                        onKeyDown={(e) => handleKeyDown(e, fieldNum, planNum, tierNum)}
                        ref={el => {
                            if (inputRefs[fieldNum][colIndex]) {
                                inputRefs[fieldNum][colIndex].current = el;
                            }
                        }}
                >
                    {field.options.map((option, o) => {
                        return <option key={field + '-opt-' + o} value={option}>{option}</option>;
                    })}
                </select>
            );
        }
        return (
            <input type="text"
                   value={formattedVal}
                   className={(field.format === 'service' ? 'service-input' : '') + (isDedCoins ? ' ded-coins' : '')}
                   readOnly={field.format === 'service'}
                   onClick={(e) => field.format === 'service' ? null : e.target.select()}
                   onChange={(e) => updateFieldData(field, sanitizeInput(field, e.target.value), planNum, tierNum)}
                   onKeyDown={(e) => {
                       if (e.key === 'Delete' || e.key === 'Backspace') {
                           let input = e.target.value.toString().replace(/[^0-9]/g, '');
                           let newVal = input.length > 1 ? input.slice(0, input.length - 1) : 0;
                           updateFieldData(field, sanitizeInput(field, newVal), planNum, tierNum);
                       } else {
                           handleKeyDown(e, fieldNum, planNum, tierNum);
                       }
                   }}
                   onFocus={(e) => handleFocus(e, field, planNum, tierNum)}
                   onBlur={handleBlur}
                   ref={el => {
                       if (inputRefs[fieldNum][colIndex]) {
                           inputRefs[fieldNum][colIndex].current = el;
                       }
                   }}
            />
        );
    }

    function getPlanDataCell(plan, group, field, planNum) {
        let val = getPlanDataValue(plan, field)
        let inactive = val < 0 && field.nullable && field.format !== 'service';
        let isInfoGroup = group.name === 'Info';
        let isInfoGroupPlan = isInfoGroup && field.name === 'Plan Name';
        return (
            <td colSpan={plan.tiers.length}
                className={`plan-data last-tier ${field.cssClass ?? ''} ${inactive ? 'inactive' : ''} ${field.editable ? 'editable' : ''}`}
                style={isInfoGroup ? {backgroundColor: plan.color ?? colors[planNum % colors.length]} : {}}
                key={'av-' + field.name + '-' + planNum}>
                {inactive ? '' :
                    isInfoGroupPlan ? (
                        <div className="plan-name-container">
                            <div style={{display: 'flex', alignItems: 'center'}}>
                                {planNum > 0 ?
                                    <FaCaretLeft className={'icon-size'} title="Move plan left" onClick={() => movePlanLeft(planNum)}/>
                                    : <div style={{width: '21px'}}></div>}
                                <div className="color-pick" title={"Change plan color"}>
                                    <input type="color"
                                           onChange={(e) => changePlanColor(e, planNum)}
                                           value={plan.color}/>
                                </div>
                            </div>
                            {getDataCellInput(val, field, planNum)}
                            <div style={{display: 'flex', alignItems: 'center'}}>
                                {/*<input type="color" onChange={(e) => changePlanColor(e, planNum)}/>*/}
                                <FaTimesCircle className={'icon-size'} title="Remove plan" onClick={() => removePlan(planNum)} />
                                {/*<FaPlus className={'icon-size'} onClick={() => addPlan(planNum)}/>*/}
                                {planNum < planData.plans.length - 1 ?
                                    <FaCaretRight className={'icon-size'} title="Move plan right" onClick={() => movePlanRight(planNum)}/>
                                    : <div style={{width: '21px'}}></div>}
                            </div>
                        </div>
                    ) : getDataCellInput(val, field, planNum)
                }
            </td>
        );
    }

    function getTierDataCell(tier, group, field, planNum, tierNum) {
        let val = getTierDataValue(tier, field)
        let inactive = val < 0 && field.nullable && field.format !== 'service';
        let isInfoGroup = group.name === 'Info';
        let isInfoGroupTier = isInfoGroup && field.name === 'Network Tier';
        let isLastTier = tierNum === planData.plans[planNum].tiers.length - 1;
        return (
            <td className={`plan-data ${field.cssClass ?? ''} ${inactive ? 'inactive' : ''} ${field.editable ? 'editable' : ''} ${isLastTier ? 'last-tier' : ''}`}
                style={isInfoGroup ? {backgroundColor: planData.plans[planNum].color ?? colors[planNum % colors.length]} : {}}
                key={'av-' + field.name + '-' + planNum + '-' + tierNum}>
                {inactive
                    ? '' :
                    isInfoGroupTier
                        ? (
                            <div className="tier-name-container">
                                <div style={{width: '21px'}}></div>
                                {getDataCellInput(val, field, planNum)}
                                <div style={{width: '21px', display: 'flex'}}>
                                    {tierNum > 0
                                        ? <FaTimesCircle className={'remove-tier'} onClick={() => removeTier(planNum, tierNum)}/>
                                        : <FaPlusCircle className={'remove-tier'} onClick={() => addTier(planNum, tierNum)}/>
                                    }
                                </div>
                            </div>
                        )
                        : getDataCellInput(val, field, planNum, tierNum)}
            </td>
        );
    }

    function getPlanData(group, field) {
        if (!field.tierSpecific) {
            return planData.plans.map((plan, planNum) => {
                if (group.name === 'Results' && !plan.av) {
                    if (field === group.sections[0].fields[0]) {
                        return getCalculateButton(plan, planNum);
                    }
                } else {
                    return getPlanDataCell(plan, group, field, planNum);
                }
            });
        } else {
            return planData.plans.map((plan, planNum) => {
                return plan.tiers.map((tier, tierNum) => {
                    return getTierDataCell(tier, group, field, planNum, tierNum);
                });
            });
        }
    }

    function fieldNullForAllPlans(field) {
        if (!field.tierSpecific) {
            for (let plan of planData.plans) {
                if (plan[getFieldMap(field)] >= 0) {
                    return false;
                }
            }
        } else {
            for (let plan of planData.plans) {
                for (let tier of plan.tiers) {
                    if (tier[getFieldMap(field)] >= 0) {
                        return false;
                    }
                }
            }
        }
        return true;
    }

    function getSectionHeight(section) {
        var height = 0;
        for (let field of section.fields) {
            if (field.nullable && fieldNullForAllPlans(field)) {
                continue;
            }
            height++;
        }
        return height;
    }

    function getGroupHeight(group) {
        var height = 0;
        for (let section of group.sections) {
            height += getSectionHeight(section);
        }
        return height;
    }

    return (
        <>
            <table
                cellSpacing={0}
                cellPadding={0}
                className={'av-table'}>
                <tbody>

                {designRows.map(group => {
                    return group.sections.map((section, sectionNum) => {
                        return section.fields.map((field, fieldNum) => {
                            return sectionNum === 0 && fieldNum === 0 ? (
                                    <tr key={hyphenStrs('av', group.name, section.name)}>
                                        <td key={hyphenStrs('av', group.name, 'label')}
                                            style={{backgroundColor: group.color}}
                                            className={`group-label ${group.cssClass ?? ''}`}
                                            rowSpan={getGroupHeight(group)}><span>{group.name}</span></td>
                                        <td key={hyphenStrs('av', group.name, section.name, 'label')}
                                            style={{backgroundColor: section.color}}
                                            className={`section-label group-top-row ${section.cssClass ?? ''}`}
                                            rowSpan={getSectionHeight(section)}>{section.name}</td>
                                        <td key={hyphenStrs('av', group.name, section.name, field.name, 'label')}
                                            style={{backgroundColor: field.color}}
                                            className={`field-label group-top-row ${field.cssClass ?? ''}`}>{field.name}</td>
                                        {getPlanData(group, field)}
                                    </tr>
                                )
                                : fieldNum === 0 ? (
                                        <tr key={hyphenStrs('av', group.name, section.name)}>
                                            <td key={hyphenStrs('av', group.name, section.name, 'label')}
                                                style={{backgroundColor: section.color}}
                                                className={`section-label ${section.cssClass ?? ''}`}
                                                rowSpan={getSectionHeight(section)}>{section.name}</td>
                                            <td key={hyphenStrs('av', group.name, section.name, field.name, 'label')}
                                                style={{backgroundColor: field.color}}
                                                className={`field-label section-top-row ${field.cssClass ?? ''}`}>{field.name}</td>
                                            {getPlanData(group, field)}
                                        </tr>
                                    )
                                    : (
                                        field.nullable && fieldNullForAllPlans(field) ? null
                                            : <tr key={'av-' + section.name + '-' + fieldNum}>
                                                <td key={'av-' + field.name}
                                                    style={{backgroundColor: field.color}}
                                                    className={`field-label ${field.cssClass ?? ''}`}>{field.name}</td>
                                                {getPlanData(group, field)}
                                            </tr>
                                    )
                        });
                    });
                })}

                </tbody>
            </table>
            {showPopup && selectedCellRef.current && (
                <div style={{
                    position: 'absolute',
                    top: selectedCellRef.current.top + window.scrollY,
                    left: selectedCellRef.current.left + selectedCellRef.current.width + window.scrollX,
                }}>
                    <ServiceCostSharingPopup
                        field={selectedCellData.field}
                        planNum={selectedCellData.planNum}
                        tierNum={selectedCellData.tierNum}
                        copay={selectedCellData.copay}
                        perDiem={selectedCellData.perDiem}
                        coinsurance={selectedCellData.coinsurance}
                        updateCostShare={updateCostShare}
                        removeCostShare={removeCostShare}
                        closePopup={closePopup}
                    />
                </div>
            )}
            {/*<p style={{fontSize: 'small'}}>* Deductible applies</p>*/}
        </>
    )
}

export default AVModel;