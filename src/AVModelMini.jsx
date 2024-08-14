import React from 'react';
import { designRowsMini } from './constants.js';
import './AVModel.css';

const AVModelMini = ({ planData }) => {

    const getPlanData = (field) => {
        // This function retrieves the relevant data from planData based on the field mapping
        const value = planData[field.mapTo];
        return <td style={{ backgroundColor: field.color }} className="field-value">{value || field.defaultValue}</td>;
    };

    const hyphenStrs = (...args) => args.join('-');

    return (
        <table cellSpacing={0} cellPadding={0} className="av-table-mini">
            <tbody>
            {designRowsMini.map((group, groupNum) => {
                return group.fields.map((field, fieldNum) => {
                    return fieldNum === 0 ? (
                        <tr key={hyphenStrs('av-mini', group.name, field.name)}>
                            <td key={hyphenStrs('av-mini', group.name, 'label')}
                                style={{ backgroundColor: group.color }}
                                className="group-label"
                                rowSpan={group.fields.length}><span>{group.name}</span></td>
                            <td key={hyphenStrs('av-mini', group.name, field.name, 'label')}
                                style={{ backgroundColor: field.color }}
                                className="field-label group-top-row">{field.name}</td>
                            {getPlanData(field)}
                        </tr>
                    ) : (
                        <tr key={hyphenStrs('av-mini', group.name, field.name)}>
                            <td key={hyphenStrs('av-mini', group.name, field.name, 'label')}
                                style={{ backgroundColor: field.color }}
                                className="field-label">{field.name}</td>
                            {getPlanData(field)}
                        </tr>
                    );
                });
            })}
            </tbody>
        </table>
    );
}

export default AVModelMini;
