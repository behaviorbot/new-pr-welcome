exports.PRCount = function (response) {
    let countPR = 0;
    // Check for issues that are pull requests
    for (let i = 0; i < response.data.length; i++) {
        if ((response.data[i]).pull_request) countPR += 1;
        // Return false if more than one PR
        if (countPR > 1) return false;
    }
    return true;
};
