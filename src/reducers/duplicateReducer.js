export function duplicateReducer( state = { duplicate_data: [] },action ){
    if(action.type==='UPDATE_DUPLICATE'){
        return {
            duplicate_data: action.duplicate_data
        }
    }
    return state;
}