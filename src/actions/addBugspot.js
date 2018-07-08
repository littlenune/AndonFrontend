export default function updateBugspot(bugspot_data) {
    return {
        type: 'UPDATE_BUGSPOT',
        bugspot_data: bugspot_data
    };
};
