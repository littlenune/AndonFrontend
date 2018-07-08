export function complexityReducer( state = { complexity_data: []},action){
    if(action.type === 'UPDATE_COMPLEXITY'){
        return {
            complexity_data: action.complexity_data
        }
    }
    return state;
}