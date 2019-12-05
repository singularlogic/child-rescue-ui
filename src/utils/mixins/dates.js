import moment from 'moment';

export default {
    filters: {
        formatDateTime(value) {
            if (value !== null) {
                return moment(String(value))
                    .format('YYYY-MM-DD HH:mm:ss');
            }
            return 'unknown';
        },
        formatDateTimeMinutes(value) {
            if (value !== null && value !== '') {
                return moment(String(value))
                    .format('YYYY-MM-DD HH:MM');
            }
            return '-';
        },
        formatDate(value) {
            return moment(String(value)).format('YYYY-MM-DD');
        },
        formatTime(value) {
            return moment(String(value)).format('hh:mm:ss');
        },
    },
};
