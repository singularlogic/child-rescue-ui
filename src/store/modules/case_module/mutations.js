import moment from 'moment';

export const updateCasesMutation = (state, data) => {
    state.cases = data;
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
