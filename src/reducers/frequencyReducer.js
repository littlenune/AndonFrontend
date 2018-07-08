export function frequencyReducer( state = { frequency_data: []}, action){
    if(action.type === 'UPDATE_FREQUENCY'){
        return {
            frequency_data: action.frequency_data
        }
    }
    return state;
}