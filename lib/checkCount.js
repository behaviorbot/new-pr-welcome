module.exports = class checkCount {
    constructor(response) {
        this.response = response;
    }
    get PRCount() {
        let countPR = 0;
        // Check for issues that are pull requests
        for (let i = 0; i < this.response.data.length; i++) {
            if ((this.response.data[i]).pull_request) countPR += 1;
            // Return false if more than one PR
            if (countPR > 1) return false;
        }
        return true;
    }
}
