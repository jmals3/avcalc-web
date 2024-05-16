import React, {useEffect, useState} from 'react';
import { FaTimes, FaRedo } from 'react-icons/fa';
import './ServiceCostSharingPopup.css';

const ServiceCostSharingPopup = ({field, planNum, tierNum, copay, perDiem, coinsurance, updateCostShare, removeCostShare, closePopup}) => {
    const [copayChecked, setCopayChecked] = useState(Math.abs(copay) > 0);
    const [copayAmount, setCopayAmount] = useState(Math.abs(copay));
    const [copayAfterDed, setCopayAfterDed] = useState(copay > 0);
    const [copayPerDiem, setCopayPerDiem] = useState(perDiem);
    const [coinsChecked, setCoinsChecked] = useState(coinsurance > -1);
    const [mbrCoinsPercent, setMbrCoinsPercent] = useState(1 - Math.abs(coinsurance));
    const [coinsAfterDed, setCoinsAfterDed] = useState(coinsurance > 0);

    const showPerDiem= ['IP', 'SNF'].includes(field.mapTo);

    useEffect(() => {
        setCopayChecked(Math.abs(copay) > 0);
        setCopayAmount(Math.abs(copay));
        setCopayAfterDed(copay > 0);
        setCopayPerDiem(perDiem);
        setCoinsChecked(coinsurance > -1);
        setMbrCoinsPercent(1 - Math.abs(coinsurance));
        setCoinsAfterDed(coinsurance > 0);
    }, [copay, perDiem, coinsurance]);

    useEffect(() => {
        const handleKeyDown = (event) => {
            if (event.key === 'Escape' || event.key === 'Enter') {
                closePopup();
            }
        };

        window.addEventListener('keydown', handleKeyDown);

        return () => {
            window.removeEventListener('keydown', handleKeyDown);
        };
    }, []);

    function getFormattedCopayValue(value) {
        let copayAmt = Math.abs(value);
        return copayAmt.toLocaleString('en-US', {
            style: 'currency',
            currency: 'USD',
            minimumFractionDigits: 0,
            maximumFractionDigits: 0
        });
    }
    function getFormattedCoinsuranceValue(value) {
        let coinsuranceAmt = Math.abs(value);
        return coinsuranceAmt.toLocaleString('en-US', {
            style: 'percent',
            minimumFractionDigits: 0,
            maximumFractionDigits: 0
        });
    }

    function sanitizeCopayInput(value) {
        let result = parseInt(value.toString().replace(/[^0-9]/g, ''));
        if (isNaN(result)) {
            return 0;
        }
        return result;
    }

    function sanitizeCoinsuranceInput(value) {
        let result = parseInt(value.toString().replace(/[^0-9]/g, '')) / 100;
        if (isNaN(result)) {
            return 0;
        }
        if (result > 1) {
            return 1;
        }
        if (result <= 0) {
            return 0;
        }
        return result;

    }

    return (
        <div tabIndex="0" className="service-popup-box">
            {/*<button*/}
            {/*    className={'popup-btn reset-btn'}*/}
            {/*    onClick={closePopup}*/}
            {/*>*/}
            {/*    <FaRedo style={{color: '#fff'}}/>*/}
            {/*</button>*/}
            <button
                className={'popup-btn close-btn'}
                onClick={closePopup}
            >
                <FaTimes style={{color: '#fff'}}/>
            </button>
            <table>
                <thead>
                <tr>
                    <th colSpan="3">{field.name} Cost Sharing</th>
                </tr>
                </thead>
                <tbody>
                <tr>
                    <td colSpan="3">
                        <label>
                            <input
                                type="checkbox"
                                checked={copayChecked}
                                onChange={(e) => {
                                    setCopayPerDiem(false);
                                    setCopayAmount(0);
                                    setCopayAfterDed(false);
                                    let planCoinsPct = (1 - mbrCoinsPercent) * (coinsAfterDed ? 1 : -1);
                                    updateCostShare(field, planNum, tierNum, 0, false, planCoinsPct);
                                    setCopayChecked(e.target.checked);
                                }}
                            />{' '}
                            Copay
                        </label>
                    </td>
                </tr>
                {copayChecked && (
                    <>
                        <tr>
                            <td>
                                {/* Copay Amount */}
                                <input type="text"
                                       placeholder="Amount"
                                       value={getFormattedCopayValue(copayAmount)}
                                       onChange={(e) => {
                                           let _copayAmt = sanitizeCopayInput(e.target.value);
                                           setCopayAmount(_copayAmt)
                                           let dedCopayAmt = _copayAmt * (copayAfterDed ? 1 : -1);
                                           let planCoinsPct = (1 - mbrCoinsPercent) * (coinsAfterDed ? 1 : -1);
                                           updateCostShare(field, planNum, tierNum, dedCopayAmt, copayPerDiem, planCoinsPct);
                                       }}
                                />
                            </td>
                            <td>
                                {/* Copay After Deductible */}
                                <input type="checkbox"
                                       checked={copayAfterDed}
                                       onChange={(e) => {
                                           let _copayAfterDed = e.target.checked;
                                           setCopayAfterDed(_copayAfterDed);
                                           let dedCopayAmt = copayAmount * (_copayAfterDed ? 1 : -1);
                                           let planCoinsPct = (1 - mbrCoinsPercent) * (coinsAfterDed ? 1 : -1);
                                           updateCostShare(field, planNum, tierNum, dedCopayAmt, copayPerDiem, planCoinsPct);
                                       }}
                                />
                            </td>
                            <td>
                                {/* Copay Per Diem */}
                                {showPerDiem && (
                                    <input type="checkbox"
                                           checked={copayPerDiem}
                                           onChange={(e) => {
                                               let updatedPerDiem = e.target.checked;
                                               setCopayPerDiem(updatedPerDiem);
                                               let dedCopayAmt = copayAmount * (copayAfterDed ? 1 : -1);
                                               let planCoinsPct = (1 - mbrCoinsPercent) * (coinsAfterDed ? 1 : -1);
                                               updateCostShare(field, planNum, tierNum, dedCopayAmt, updatedPerDiem, planCoinsPct);
                                           }}
                                    />
                                )}
                            </td>
                        </tr>
                        <tr className="small-font">
                            <td>Amount</td>
                            <td>After<br/>Deductible</td>
                            {showPerDiem ? (<td>Per<br/>Day</td>) : (<td></td>)}
                        </tr>
                    </>
                )}
                <tr>
                    <td colSpan="3">
                        <label>
                            <input
                                type="checkbox"
                                checked={coinsChecked}
                                onChange={(e) => {
                                    setMbrCoinsPercent(0);
                                    setCoinsAfterDed(false);
                                    setCoinsChecked(e.target.checked);
                                    let dedCopayAmt = copayAmount * (copayAfterDed ? 1 : -1);
                                    updateCostShare(field, planNum, tierNum, dedCopayAmt, copayPerDiem, -1);
                                }}
                            />{' '}
                            Coinsurance
                        </label>
                    </td>
                </tr>
                {coinsChecked && (
                    <>
                        <tr>
                            <td>
                                {/* Coinsurance Amount */}
                                <input type="text"
                                       placeholder="Percent"
                                       value={getFormattedCoinsuranceValue(mbrCoinsPercent)}
                                       onChange={(e) => {
                                           let _coinsPct = sanitizeCoinsuranceInput(e.target.value);
                                           setMbrCoinsPercent(_coinsPct);
                                           let planCoinsPct = (1 - _coinsPct) * (coinsAfterDed ? 1 : -1);
                                           let dedCopayAmt = copayAmount * (copayAfterDed ? 1 : -1);
                                           updateCostShare(field, planNum, tierNum, dedCopayAmt, copayPerDiem, planCoinsPct);
                                       }}
                                       onKeyDown={(e) => {
                                           if (e.key === 'Delete' || e.key === 'Backspace') {
                                               let input = e.target.value.toString().replace(/[^0-9]/g, '');
                                               let newVal = input.length > 1 ? input.slice(0, input.length - 1) : 0;
                                               let _coinsPct = sanitizeCoinsuranceInput(newVal);
                                               setMbrCoinsPercent(_coinsPct);
                                               let planCoinsPct = (1 - _coinsPct) * (coinsAfterDed ? 1 : -1);
                                               let dedCopayAmt = copayAmount * (copayAfterDed ? 1 : -1);
                                               updateCostShare(field, planNum, tierNum, dedCopayAmt, copayPerDiem, planCoinsPct);
                                           }
                                       }}
                                />
                            </td>
                            <td>
                                {/* Coinsurance After Deductible */}
                                <input type="checkbox"
                                       checked={coinsAfterDed}
                                       onChange={(e) => {
                                           let _coinsAfterDed = e.target.checked;
                                           setCoinsAfterDed(_coinsAfterDed);
                                           let planCoinsPct = (1 - mbrCoinsPercent) * (_coinsAfterDed ? 1 : -1);
                                           let dedCopayAmt = copayAmount * (copayAfterDed ? 1 : -1);
                                           updateCostShare(field, planNum, tierNum, dedCopayAmt, copayPerDiem, planCoinsPct);
                                       }}
                                />
                            </td>
                            <td></td>
                        </tr>
                        <tr className="small-font">
                            <td>Percent<br/><strong>(Member)</strong></td>
                            <td>After<br/>Deductible</td>
                            <td></td>
                        </tr>
                    </>
                )}
                <tr>
                    <td colSpan="3">
                        <button
                            style={{backgroundColor: '#555', marginTop: '8px', width: '100%'}}
                            onClick={() => {
                                closePopup();
                            }
                            }
                        >
                           OK
                        </button>
                    </td>
                </tr>
                <tr>
                    <td colSpan="3">
                        <button
                            style={{marginTop: '2px', width: '100%'}}
                            onClick={() => {
                                removeCostShare(field, planNum, tierNum);
                                closePopup();
                            }
                            }
                        >
                            Reset
                        </button>
                    </td>
                </tr>
                </tbody>
            </table>
        </div>
    );
};

export default ServiceCostSharingPopup;