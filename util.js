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

function pick(obj, keys) {
    return keys.reduce(function (picked, key) {
        picked[key] = obj[key];

        return picked;
    }, {});
}

module.exports = {
    filter,
    find,
    pick,
    each
};
