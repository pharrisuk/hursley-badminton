app.service('loadingService', function () {
    var loading = false;

    return {
        isLoading: function () {
            return loading;
        },
        setLoading: function (isLoading) {
            loading = isLoading;
        }
    };
})