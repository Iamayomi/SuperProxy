class APIProperties {
    constructor(query, queryStr) {
        this.query = query,
            this.queryString = queryStr
    }

    filter() {
        const objQuery = { ...this.queryStr };
        const listFields = ['sort', 'limit', 'page', 'fields'];
        listFields.forEach(el => delete objQuery[el]);

        let strQuery = JSON.stringify(objQuery);
        strQuery = strQuery.replace(/\b(gte|gt|lte|lt)\b/g, match => `$${match}`);

        this.query.find(JSON.parse(strQuery));

        return this;

    };

    sorting() {
        if (this.queryString.sort) {
            const sortingBy = this.queryString.sort.split(',').join(' ');
            this.query = this.query.sort(sortingBy);
        } else {
            this.query = this.query.sort('-createdTime');
        };
        return this;

    };

    fields() {
        if (this.queryString.fields) {
            const fields = this.queryString.sort.split(',').join(' ');
            this.query = this.query.select(fields);
        } else {
            this.query = this.query.select('-__v');
        };
        return this;

    };

    pagination() {
        const page = +(this.queryString.page) || 1;
        const limit = +(this.queryString.limit) || 7;
        const skip = (page - 1) * limit;

        this.query = this.query.skip(skip).limit(limit);
        return this;

    };

};


module.exports = APIProperties;












