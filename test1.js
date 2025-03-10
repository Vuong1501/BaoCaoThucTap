const parseSort = sort => {
    let isPass = true;
    const defaultValue = [['id', 'asc']];
    const regexSort = /(asc|desc|ASC|DESC)/g;

    try {
        // sort = (typeof sort === 'string') ? JSON.parse(sort).map((e, i) => i % 2 === 0 ? sequelize.literal(`\`${e}\``) : e) : defaultValue;
        sort =
            typeof sort === 'string'
                ? JSON.parse(sort).map((e, i) => (i % 2 === 0 ? sequelize.literal(`\`${e}\``) : e))
                : defaultValue;
        console.log('sort===2', sort);
        if (sort.length % 2 === 0) {
            sort = _.chunk(sort, 2) || defaultValue;
            sort.map(element => {
                if (!element[1].match(regexSort)) {
                    isPass = false;
                }
            });
        } else {
            isPass = false;
        }
        if (isPass) {
            return sort;
        } else {
            return defaultValue;
        }
    } catch (e) {
        return defaultValue;
    }
};