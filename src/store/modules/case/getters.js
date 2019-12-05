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
    delete caseObjectClone.demographic_data.id;
    delete caseObjectClone.demographic_data.case;

    delete caseObjectClone.medical_data.id;
    delete caseObjectClone.medical_data.case;

    delete caseObjectClone.psychological_data.id;
    delete caseObjectClone.psychological_data.case;

    delete caseObjectClone.physical_data.id;
    delete caseObjectClone.physical_data.case;

    delete caseObjectClone.personal_data.id;
    delete caseObjectClone.personal_data.case;

    delete caseObjectClone.social_media_data.id;
    delete caseObjectClone.social_media_data.case;

    delete caseObjectClone.profile_photo;
    return caseObjectClone;
};
