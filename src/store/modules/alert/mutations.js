import moment from 'moment';

export const clearAlertsMutation = (state) => {
    state.alerts = null;
};
export const clearAlertMutation = (state) => {
    state.alert = null;
};
export const updateAlertsMutation = (state, data) => {
    // let date;
    // let time;
    // for (let index = 0; index < data.length; index++) {
    //     let tempStart = data[index].start;
    //     date = moment(String(tempStart)).format('YYYY-MM-DD');
    //     time = moment.utc(String(tempStart)).format('hh:mm');
    //     data[index].start = date;
    //     data[index].start_time = time;
    //
    //     let tempEnd = data[index].end;
    //     date = moment(String(tempEnd)).format('YYYY-MM-DD');
    //     time = moment.utc(String(tempEnd)).format('hh:mm');
    //     data[index].end = date;
    //     data[index].end_time = time;
    // }
    state.alerts = data;
};
export const addToAlertsMutation = (state, data) => {
    state.alerts.push(data);
};
export const replaceToAlertsMutation = (state, data) => {
    for (let index = 0; index < state.alerts.length; index++) {
        if (state.alerts[index].id === data.id) {
            state.alerts[index] = data;
            break;
        }
    }
};
export const updateAlertMutation = (state, data) => {
    // let date;
    // let time;
    // let tempStart = data.start;
    // date = moment(String(tempStart)).format('YYYY-MM-DD');
    // time = moment.utc(String(tempStart)).format('hh:mm');
    // data.start = date;
    // data.start_time = time;
    //
    // let tempEnd = data.end;
    // date = moment(String(tempEnd)).format('YYYY-MM-DD');
    // time = moment.utc(String(tempEnd)).format('hh:mm');
    // data.end = date;
    // data.end_time = time;

    state.alert = data;
};
export const fetchAlertAddressMutation = (state, data) => {
    if (state.alert === null) {
        state.alert = state.alertStructure;
        // state.feedback.feedback_status = 'pending';
    }
    state.alert.latitude = data.geometry.location.lat();
    state.alert.longitude = data.geometry.location.lng();
    state.alert.address = data.formatted_address;
};
export const fetchAlertAddressCoordinatesMutation = (state, data) => {
    state.alert.latitude = data.lat;
    state.alert.longitude = data.lng;
};
