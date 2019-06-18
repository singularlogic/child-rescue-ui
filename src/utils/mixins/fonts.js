
export default {
    filters: {
        title(value) {
            return value.toLowerCase().split(' ').map((s) => s.charAt(0).toUpperCase() + s.substring(1)).join(' ');
        },
        header(value) {
            return value.charAt(0).toUpperCase() + value.slice(1);
        },
    },
};
