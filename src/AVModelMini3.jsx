import React, {useState, useEffect, useRef, useMemo} from 'react';
import {designRowsMini, avColors, colors, api} from "./constants.js";
import {FaCaretLeft, FaCaretRight, FaTimesCircle, FaTimes, FaPlusCircle} from "react-icons/fa";
import {deletePlanApi} from "./api/plan.js";
import './AVModel.css';

const AVModelMini3 = ({planData, updatePlanData}) => {
    function changePlanColor(e, planNum) {
        let newPlanData = {...planData};
        newPlanData.plans[planNum].color = e.target.value;
        updatePlanData(newPlanData);
    }

    const removePlan = async (planNum) => {
        const result = await deletePlanApi(planData.plans[planNum].guid);
        if (result.success) {
            let newPlanData = {...planData};
            newPlanData.plans.splice(planNum, 1);
            updatePlanData(newPlanData);
        }
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

    function getServiceValueStr(plan, field) {
        let value = plan.tiers[0].service_cost_sharing[field] ?? {
            Copay: 0,
            Coins: plan.tiers[0].coinsurance,
            PerDiem: false
        };
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

    return (
        <table
            cellSpacing={0}
            cellPadding={0}
            className={'av-table'}>
            <tbody>

            <tr key={'av-plan'}>
                <td key={'av-plan-label'}
                    style={{backgroundColor: avColors.info.plan}}
                    className={`section-label group-top-row`}
                    rowSpan={2}>Plan
                </td>
                <td key={'av-plan-name-label'}
                    style={{backgroundColor: avColors.info.plan}}
                    className={`field-label group-top-row`}>Name
                </td>
                {planData.plans.map((plan, planNum) => {
                    return (
                        <td
                            className={`plan-data`}
                            style={{backgroundColor: plan.color ?? colors[planNum % colors.length]}}
                            key={'av-plan-name-' + planNum}>
                            <div className="plan-name-container">
                                <div style={{display: 'flex', alignItems: 'center'}}>
                                    {planNum > 0 ?
                                        <FaCaretLeft className={'icon-size'} title="Move plan left"
                                                     onClick={() => movePlanLeft(planNum)}/>
                                        : <div style={{width: '21px'}}></div>}
                                    <div className="color-pick" title={"Change plan color"}>
                                        <input type="color"
                                               onChange={(e) => changePlanColor(e, planNum)}
                                               value={plan.color}/>
                                    </div>
                                </div>
                                {plan.name}
                                <div style={{display: 'flex', alignItems: 'center'}}>
                                    <FaTimesCircle className={'icon-size'} title="Remove plan"
                                                   onClick={() => removePlan(planNum)}/>
                                    {planNum < planData.plans.length - 1 ?
                                        <FaCaretRight className={'icon-size'} title="Move plan right"
                                                      onClick={() => movePlanRight(planNum)}/>
                                        : <div style={{width: '21px'}}></div>}
                                </div>
                            </div>
                        </td>
                    );
                })}
            </tr>

            <tr key={'av-scenario'}>
                <td key={'av-plan-scenario-label'}
                    style={{backgroundColor: avColors.info.plan}}
                    className={`field-label`}>Scenario
                </td>
                {planData.plans.map((plan, planNum) => {
                    return (
                        <td
                            className={`plan-data`}
                            style={{backgroundColor: plan.color ?? colors[planNum % colors.length]}}
                            key={'av-plan-scenario-' + planNum}>
                            {/*TODO: Make this editable*/}
                            {plan.scenario}
                        </td>
                    );
                })}
            </tr>

            <tr key={'av-result'}>
                <td key={'av-result-label'}
                    style={{backgroundColor: avColors.info.result}}
                    className={`section-label group-top-row`}>
                    Result
                </td>
                <td key={'av-result-av-label'}
                    style={{backgroundColor: avColors.info.result}}
                    className={`field-label group-top-row`}>Actuarial Value
                </td>
                {planData.plans.map((plan, planNum) => {
                    return (
                        <td
                            className={`plan-data`}
                            key={'av-result-av-' + planNum}>
                            {plan.av.toLocaleString('en-US', {
                                style: 'percent',
                                minimumFractionDigits: 0,
                                maximumFractionDigits: 1
                            })}
                        </td>
                    );
                })}
            </tr>

            <tr key={'av-ded'}>
                <td key={'av-global-label'}
                    className={`section-label group-top-row`}
                    rowSpan={3}>Global
                </td>
                <td key={'av-global-ded-label'}
                    className={`field-label group-top-row`}>Deductible (Individual / Family)
                </td>
                {planData.plans.map((plan, planNum) => {
                    return (
                        <td
                            className={`plan-data`}
                            key={'av-global-ded-' + planNum}>
                            {plan.tiers[0].ind_ded} / {plan.tiers[0].fam_ded}
                        </td>
                    );
                })}
            </tr>

            <tr key={'av-oopm'}>
                <td key={'av-global-oopm-label'}
                    className={`field-label`}>OOP Max (Individual / Family)
                </td>
                {planData.plans.map((plan, planNum) => {
                    return (
                        <td
                            className={`plan-data`}
                            key={'av-global-oopm-' + planNum}>
                            {plan.tiers[0].ind_oopm} / {plan.tiers[0].fam_oopm}
                        </td>
                    );
                })}
            </tr>

            <tr key={'av-coins'}>
                <td key={'av-global-coins-label'}
                    className={`field-label`}>Member Coinsurance %
                </td>
                {planData.plans.map((plan, planNum) => {
                    return (
                        <td
                            className={`plan-data`}
                            key={'av-global-coins-' + planNum}>
                            {1 - plan.tiers[0].coinsurance}
                        </td>
                    );
                })}
            </tr>

            <tr key={'av-prev'}>
                <td key={'av-ov-label'}
                    className={`section-label group-top-row`}
                    rowSpan={3}>Office Visits
                </td>
                <td key={'av-ov-prev-label'}
                    className={`field-label group-top-row`}>Preventative / Well-Check
                </td>
                {planData.plans.map((plan, planNum) => {
                    return (
                        <td
                            className={`plan-data`}
                            key={'av-ov-prev-' + planNum}>
                            {getServiceValueStr(plan, 'Prev')}
                        </td>
                    );
                })}
            </tr>

            <tr key={'av-pcp'}>
                <td key={'av-ov-pcp-label'}
                    className={`field-label`}>Primary Care Physician
                </td>
                {planData.plans.map((plan, planNum) => {
                    return (
                        <td
                            className={`plan-data`}
                            key={'av-ov-pcp-' + planNum}>
                            {getServiceValueStr(plan, 'PCP')}
                        </td>
                    );
                })}
            </tr>

            <tr key={'av-scp'}>
                <td key={'av-ov-scp-label'}
                    className={`field-label`}>Specialist Care Physician
                </td>
                {planData.plans.map((plan, planNum) => {
                    return (
                        <td
                            className={`plan-data`}
                            key={'av-ov-scp-' + planNum}>
                            {getServiceValueStr(plan, 'SCP')}
                        </td>
                    );
                })}
            </tr>

            <tr key={'av-er'}>
                <td key={'av-fac-label'}
                    className={`section-label group-top-row`}
                    rowSpan={3}>Facility
                </td>
                <td key={'av-fac-er-label'}
                    className={`field-label group-top-row`}>Emergency Room
                </td>
                {planData.plans.map((plan, planNum) => {
                    return (
                        <td
                            className={`plan-data`}
                            key={'av-fac-er-' + planNum}>
                            {getServiceValueStr(plan, 'ER')}
                        </td>
                    );
                })}
            </tr>

            <tr key={'av-ip'}>
                <td key={'av-fac-ip-label'}
                    className={`field-label`}>Inpatient Facility
                </td>
                {planData.plans.map((plan, planNum) => {
                    return (
                        <td
                            className={`plan-data`}
                            key={'av-fac-ip-' + planNum}>
                            {getServiceValueStr(plan, 'IPFac')}
                        </td>
                    );
                })}
            </tr>

            <tr key={'av-OP'}>
                <td key={'av-fac-op-label'}
                    className={`field-label group-top-row`}>Outpatient Facility
                </td>
                {planData.plans.map((plan, planNum) => {
                    return (
                        <td
                            className={`plan-data`}
                            key={'av-fac-op-' + planNum}>
                            {getServiceValueStr(plan, 'OPFac')}
                        </td>
                    );
                })}
            </tr>

            <tr key={'av-generic'}>
                <td key={'av-rx-label'}
                    className={`section-label group-top-row`}
                    rowSpan={4}>Rx
                </td>
                <td key={'av-rx-generic-label'}
                    className={`field-label group-top-row`}>Generic Drugs
                </td>
                {planData.plans.map((plan, planNum) => {
                    return (
                        <td
                            className={`plan-data`}
                            key={'av-rx-generics-' + planNum}>
                            {getServiceValueStr(plan, 'RxGeneric')}
                        </td>
                    );
                })}
            </tr>

            <tr key={'av-prefbrand'}>
                <td key={'av-rx-prefbrand-label'}
                    className={`field-label`}>Preferred Brand Drugs
                </td>
                {planData.plans.map((plan, planNum) => {
                    return (
                        <td
                            className={`plan-data`}
                            key={'av-rx-prefbrand-' + planNum}>
                            {getServiceValueStr(plan, 'RxPrefBrand')}
                        </td>
                    );
                })}
            </tr>

            <tr key={'av-nonprefbrand'}>
                <td key={'av-rx-nonprefbrand-label'}
                    className={`field-label`}>Non-Preferred Brand Drugs
                </td>
                {planData.plans.map((plan, planNum) => {
                    return (
                        <td
                            className={`plan-data`}
                            key={'av-rx-nonprefbrand-' + planNum}>
                            {getServiceValueStr(plan, 'RxNonPrefBrand')}
                        </td>
                    );
                })}
            </tr>

            <tr key={'av-specialty'}>
                <td key={'av-rx-specialty-label'}
                    className={`field-label`}>Specialty Drugs
                </td>
                {planData.plans.map((plan, planNum) => {
                    return (
                        <td
                            className={`plan-data`}
                            key={'av-rx-specialty-' + planNum}>
                            {getServiceValueStr(plan, 'RxSpecialty')}
                        </td>
                    );
                })}
            </tr>

            </tbody>
        </table>
    )
}

export default AVModelMini3;