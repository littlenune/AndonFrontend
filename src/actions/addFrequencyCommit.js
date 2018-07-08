export default function updateFrequencyCommit(frequency_data){
    return{
        type: "UPDATE_FREQUENCY",
        frequency_data: frequency_data
    };
};