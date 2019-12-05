// import { feedbacksApi as feedbackApi } from '../../../api/feedbacks';
// import { UPDATE_FEEDBACK, UPDATE_FEEDBACKS } from './types';


// export const getAllFeedbacksAction = ({ commit, state, dispatch }) => {
//     const params = {};
//     return feedbackApi.getFeedbacks(localStorage.getItem('access_token'), params)
//         .then((response) => {
//             if (response.status === 200) {
//                 commit(UPDATE_FEEDBACKS, response.data);
//             }
//             return response;
//         })
//         .catch(error => Promise.reject(error));
// };

// export const getFeedbacksAction = ({ commit, state, dispatch }, { caseId }) => {
//     const params = { caseId: caseId };
//     return feedbackApi.getFeedbacks(localStorage.getItem('access_token'), params)
//         .then((response) => {
//             if (response.status === 200) {
//                 commit(UPDATE_FEEDBACKS, response.data);
//             }
//             return response;
//         })
//         .catch(error => Promise.reject(error));
// };

// export const createFeedbackAction = ({ commit, state, dispatch }, { feedbackObject }) => {
//     feedbackObject.date = feedbackObject.date + ' ' + feedbackObject.time;
//     delete feedbackObject.time;
//     return feedbackApi.createFeedback(localStorage.getItem('access_token'), feedbackObject)
//         .then((response) => {
//             if (response.status === 200) {
//                 commit(UPDATE_FEEDBACK, response.data);
//             }
//             return response;
//         })
//         .catch(error => Promise.reject(error));
// };

// export const updateFeedbackAction = ({ commit, state, dispatch }, { feedbackObject }) => {
//     feedbackObject.date = feedbackObject.date + ' ' + feedbackObject.time;
//     delete feedbackObject.time;
//     return feedbackApi.editFeedback(localStorage.getItem('access_token'), feedbackObject.id, feedbackObject)
//         .then((response) => {
//             if (response.status === 200) {
//                 commit(UPDATE_FEEDBACK, response.data);
//             }
//             return response;
//         })
//         .catch(error => Promise.reject(error));
// };
