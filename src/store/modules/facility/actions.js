// import { facilitiesApi } from '../../../api/facilities';
// import { UPDATE_FACILITY } from './types';

// export const getFacilityAction = ({ commit, state, dispatch }) => {
//     return facilitiesApi.getFacility(localStorage.getItem('access_token'), localStorage.getItem('facility_id'))
//         .then((response) => {
//             if (response.status === 200) {
//                 commit(UPDATE_FACILITY, response.data);
//             }
//             return response;
//         })
//         .catch(error => Promise.reject(error));
// };
