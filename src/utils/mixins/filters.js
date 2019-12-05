export default {
    filters: {
        truncate(text, length, sign) {
            if (text != null) {
                sign = sign || '...';
                const a = text.length > length ? text.slice(0, length) + sign : text;
                return a;
            }
            return null;
        },
        formatNumber(value) {
            return numeral(value).format('0,0');
        },
        formatLargeNumber(value) {
            if (value >= 10000) {
                return numeral(value).format('0.00a');
            }

            return numeral(value).format('0,0');
        },
        formatPercent(value) {
            return numeral(value).format('+0.0%');
        },
        formatPercentage(value) {
            // eslint-disable-next-line
            if (isNaN(value) || !isFinite(value)) return '-';

            return numeral(value).format('0.0%');
        },
        formatDifference(current, previous) {
            if (previous === 0) {
                return '';
            }

            return numeral(Math.abs(current - previous) / previous).format('0%');
        },
    },
};
