export default {
    methods: {
        isMainFact(fact) {
            if (fact.feedback_status === "pending") {
                return "#ffd4d4";
            }
            // if (fact.feedback_status === "relevant") {
            //     return "#d4ffdd";
            // }
            // if (fact.feedback_status === "irrelevant") {
            //     return "#bfbfbf";
            // }
            // if (fact.feedback_status === "credible") {
            //     return "#d6fffe";
            // }
            // if (fact.feedback_status === "spam") {
            //     return "#dbdbdb";
            // }
            return "";
        },
        getRoleColor(role) {
            switch (role) {
                case "organization_manager":
                    return "#10733e";
                case "coordinator":
                    return "#974b0b";
                case "case_manager":
                    return "#9c0033";
                case "network_manager":
                    return "#1a9ddd";
                case "facility_manager":
                    return "#9c6ea9";
                case null:
                    return "#808080";
                default:
                    return "#808080";
            }
        },
        getFactStatusColor(status) {
            switch (status) {
                case "pending":
                    return "#6c008c";
                case "credible":
                    return "#18c442";
                case "relevant":
                    return "#4087cf";
                case "irrelevant":
                    return "#db511f";
                case null:
                    return "#7f7d80";
                default:
                    return "#7f7d80";
            }
        }
    },
    filters: {
        title(value) {
            return value
                .toLowerCase()
                .split(" ")
                .map(s => s.charAt(0).toUpperCase() + s.substring(1))
                .join(" ");
        },
        customTitle(value, character) {
            return value
                .toLowerCase()
                .split(character)
                .map(s => s.charAt(0).toUpperCase() + s.substring(1))
                .join(" ");
        },
        phoneFormat(value) {
            let a = `(${value.slice(0, 3)}) ${value.slice(3)}`;
            a = `${a.slice(0, 9)} - ${a.slice(9)}`;
            return a;
        },
        header(value) {
            return value.charAt(0).toUpperCase() + value.slice(1);
        }
    }
};
