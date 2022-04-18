const get = async function (url, success_func = (response) => { }, error_func = (error) => { }) {
    await axios.get(url)
        .then((response) => {
            success_func.apply(null, [response, ]);
        })
        .catch((error) => {
            error_func.apply(null, [error, ]);
        });
};

const rest = async function (method, url, data = {}) {
    let axios_func;
    if (method == "get") axios_func = axios.get;
    else if (method == "post") axios_func = axios.post;
    else if (method == "patch") axios_func = axios.patch;
    else if (method == "delete") axios_func = axios.delete;
    else throw "Invalid method";
    return await axios_func(url, data);
};