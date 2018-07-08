export default function addDuplicate(duplicate_data){
    return {
        type: 'UPDATE_DUPLICATE',
        duplicate_data: duplicate_data
};
}