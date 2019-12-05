import moment from 'moment';

export const clearFeedbacksMutation = (state) => {
    state.feedbacks = null;
};
export const clearFeedbackMutation = (state) => {
    state.feedback = null;
};
export const updateFeedbacksMutation = (state, data) => {
    for (let index = 0; index < data.length; index++) {
        const tempDate = data[index].date;
        const date = moment(String(tempDate)).format('YYYY-MM-DD');
        const time = moment.utc(String(tempDate)).format('hh:mm');
        data[index].date = date;
        data[index].time = time;
    }
    state.feedbacks = data;
};
export const addToFeedbacksMutation = (state, data) => {
    state.feedbacks.push(data);
};
export const replaceToFeedbacksMutation = (state, data) => {
    for (let index = 0; index < state.feedbacks.length; index++) {
        if (state.feedbacks[index].id === data.id) {
            state.feedbacks[index] = data;
            break;
        }
    }
};
export const updateFeedbackMutation = (state, data) => {
    const tempDate = data.date;
    let time = '';
    const date = moment(String(tempDate)).format('YYYY-MM-DD');
    if (tempDate.length > 10) {
        time = moment.utc(String(tempDate)).format('hh:mm');
    } else {
        time = data.time;
    }
    data.date = date;
    data.time = time;
    state.feedback = data;
};
export const fetchFeedbackAddressMutation = (state, data) => {
    if (state.feedback === null) {
        state.feedback = state.feedbackStructure;
        // state.feedback.feedback_status = 'pending';
    }
    state.feedback.address = data.formatted_address;
    state.feedback.latitude = data.geometry.location.lat();
    state.feedback.longitude = data.geometry.location.lng();
};
export const fetchFeedbackAddressCoordinatesMutation = (state, data) => {
    state.feedback.latitude = data.lat;
    state.feedback.longitude = data.lng;
};
