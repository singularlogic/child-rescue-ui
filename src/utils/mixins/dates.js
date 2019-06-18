import moment from 'moment';

export default {
    filters: {
        formatDateTime(value) {
            if (value !== null) {
                return moment(String(value))
                    .format('YYYY-MM-DD hh:mm:ss');
            } else {
                return 'unknown'
            }
        },
        formatDateTimeMinutes(value) {
            if (value !== null) {
                return moment(String(value))
                    .format('YYYY-MM-DD hh:mm');
            } else {
                return 'unknown'
            }
        },
        formatDate(value) {
            return moment(String(value)).format('YYYY-MM-DD');
        },
        formatTime(value) {
            return moment(String(value)).format('hh:mm:ss');
        },
    },
};
