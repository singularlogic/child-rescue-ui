import moment from 'moment';

export const updateCasesMutation = (state, data) => {
    state.cases = data;
};

export const updateActiveCasesMutation = (state, data) => {
    state.activeCases = data;
};

export const updateFacilityCasesMutation = (state, data) => {
    state.facilityCases = data;
    state.facilityActiveCases = [];
    for (let index = 0; index < data.length; index++) {
        if (data[index].status === 'active') {
            state.facilityActiveCases.push(data[index]);
        }
    }
};

export const updateCaseMutation = (state, data) => {
    if (data.demographic_data.date_of_birth) {
        data.demographic_data.date_of_birth = moment(String(data.demographic_data.date_of_birth)).format('YYYY-MM-DD');
    }
    if (data.demographic_data.arrival_at_facility_date) {
        data.demographic_data.arrival_at_facility_date = moment(String(data.demographic_data.arrival_at_facility_date)).format('YYYY-MM-DD');
    }
    state.case = data;
};
