class APIProperties {
    constructor(query, queryStr) {
        this.query = query,
        this.queryStr = queryStr;
    };

    filter() {
        const objQuery = { ...this.queryStr };
		console.log(objQuery);
        const listFields = ['sort', 'limit', 'page', 'fields'];
        listFields.forEach(el => delete objQuery[el]);
		

        let strQuery = JSON.stringify(objQuery);
		console.log(strQuery);
        strQuery = strQuery.replace(/\b(gte|gt|lte|lt)\b/g, match => `$${match}`);

        this.query.find(JSON.parse(strQuery));

        return this;

    };

    sorting() {
        if (this.queryStr.sort) {
            const sortingBy = this.queryStr.sort.split(',').join(' ');
            this.query = this.query.sort(sortingBy);
        } else {
            this.query = this.query.sort('-createdTime');
        };
        return this;

    };

    reducesfields() {
        if (this.queryStr.fields) {
            const fields = this.queryStr.fields.split(',').join(' ');
            this.query = this.query.select(fields);
        } else {
            this.query = this.query.select('-__v');
        };
        return this;

    };

    pagination() {
        const page = +(this.queryStr.page) || 1;
        const limit = +(this.queryStr.limit) || 7;
        const skip = (page - 1) * limit;

        this.query = this.query.skip(skip).limit(limit);
        return this;

    };

};


module.exports = APIProperties;












