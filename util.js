// Helper function to iterate over objects.

function filter(obj, callback) {
    var filtered = {};

    for (const key in obj) {
        let val = obj[key];

        callback(val, key) && (filtered[key] = val);
    }

    return filtered;
}

function find(obj, callback) {
    for (const key in obj) {
        let val = obj[key];

        if (callback(val, key)) {
            return val;
        }
    }
}

function each(obj, callback) {
    for (const key in obj) {
        callback(obj[key], key);
    }

    return obj;
}

module.exports = {
    filter,
    find,
    each
};
