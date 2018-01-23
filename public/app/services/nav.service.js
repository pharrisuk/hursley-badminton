app.service('navService', function () {
    var nav = {}
    var title

    return {
        getNav: function () {
            return nav;
        },
        setNav: function (navObj) {
            nav = navObj;
        },

        setTitle: function (title) {
            nav.title = title;
        },
        getTitle: function () {
            return nav.title || "";
        },
        getIcon: function () {
            return nav.icon || "";
        }
    };
})