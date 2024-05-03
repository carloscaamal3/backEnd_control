export const transformDocument = document => {
    const { __v, _id, ...object } = document.toObject();
    object.id = _id;
    return object;
}