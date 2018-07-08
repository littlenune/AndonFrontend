export default function currentBugspotReducer( state = { bugspot_data: [] },action){
    if(action.type === 'UPDATE_BUGSPOT'){
        return {
            bugspot_data: action.bugspot_data
        }
    }
    return state;
}