import * as R from 'ramda';

export const getCases = state => state.cases;
export const getActiveCases = state => state.activeCases;
export const getFacilityCases = state => state.facilityCases;
export const getFacilityActiveCases = state => state.facilityActiveCases;
export const getCase = state => state.case;
export const getCaseStructure = state => state.caseStructure;


export const getFormattedCreatedCase = state => (caseObject) => {
    const caseObjectClone = R.clone(caseObject);
    delete caseObjectClone.profile_photo;
    return caseObjectClone;
};


export const getFormattedUpdatedCase = state => (caseObject) => {
    const caseObjectClone = R.clone(caseObject);
    delete caseObjectClone.profile_photo;
    return caseObjectClone;
};
