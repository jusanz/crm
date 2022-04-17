const get = async function (url, success_func = (response) => { }, error_func = (error) => { }) {
    await axios.get(url)
        .then((response) => {
            success_func.apply(null, [response, ]);
        })
        .catch((error) => {
            error_func.apply(null, [error, ]);
        });
}