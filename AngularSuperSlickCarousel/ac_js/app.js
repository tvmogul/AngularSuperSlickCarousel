
var storeApp = angular.module('AngularStore', ['ngRoute', 'storeApp.config', 'slick', 'favicon', 'igTruncate']);

storeApp.config(function ($sceDelegateProvider) {
    $sceDelegateProvider.resourceUrlWhitelist(['self', '**']);
});


storeApp.config(['$routeProvider', function ($routeProvider) {
    $routeProvider.
        when('/store', {
            templateUrl: 'ac_partials/store.htm',
            controller: 'storeController'
        }).
        otherwise({
            redirectTo: '/store'
        });
}
]);

storeApp.constant('URL', 'ac_templates/');

storeApp.factory('DataService', function ($http, CONFIG) {

    if (localStorage["products_file"]) {
        CONFIG.CF_PRODUCTS_FILE = localStorage["products_file"];
    } else {
        CONFIG.CF_PRODUCTS_FILE = "products.txt";
        localStorage["products_file"] = CONFIG.CF_PRODUCTS_FILE;
    }

    var getData = function () {
        return $http.get(CONFIG.CF_PRODUCTS_FOLDER + '/' + CONFIG.CF_PRODUCTS_FILE);
    };

    return {
        getData: getData
    };
});

storeApp.factory('TemplateService', function ($http, URL) {
    var getTemplates = function () {
        return $http.get(URL + 'templates.txt');
    };

    return {
        getTemplates: getTemplates
    };
});

storeApp.controller('storeController', function ($scope, $filter, $routeParams, $location, DataService, $sce, $timeout, CONFIG) {

    $scope.dataLoaded = false;

    /*#####################
    CONFIG
    ######################*/
    /* our global variabls */
    $scope.STORE_ID = CONFIG.CF_STORE_ID;
    $scope.STORE_PAGE = CONFIG.CF_STORE_PAGE;
    $scope.STORE_BG_IMAGE = CONFIG.CF_STORE_BG_IMAGE;
    $scope.DISTRIBUTOR_ID = CONFIG.CF_DISTRIBUTOR_ID;
    $scope.PAYMENT_PAYPAL_BUYNOW = CONFIG.CF_PAYMENT_PAYPAL_BUYNOW;
    $scope.PAYMENT_GOOGLE_WALLET_ID = CONFIG.CF_PAYMENT_GOOGLE_WALLET_ID;
    $scope.PAYMENT_STRIPE = CONFIG.CF_PAYMENT_STRIPE;
    $scope.PRODUCTS_FOLDER = CONFIG.CF_PRODUCTS_FOLDER;
    $scope.PRODUCTS_FILE = CONFIG.CF_PRODUCTS_FILE;
    $scope.NAVBAR_THEME = CONFIG.CF_NAVBAR_THEME;
    $scope.NAVBAR_LOGO_TEXT = CONFIG.CF_NAVBAR_LOGO_TEXT;
    $scope.NAVBAR_LOGO_LINK = CONFIG.CF_NAVBAR_LOGO_LINK;
    $scope.INSIDE_HEADER_SHOW = CONFIG.CF_INSIDE_HEADER_SHOW;
    $scope.INSIDE_HEADER_LINK = CONFIG.CF_INSIDE_HEADER_LINK;
    $scope.INSIDE_HEADER_IMAGE = CONFIG.CF_INSIDE_HEADER_IMAGE;
    $scope.INSIDE_HEADER_TITLE = CONFIG.CF_INSIDE_HEADER_TITLE;
    $scope.CAROUSEL_SHOW = CONFIG.CF_CAROUSEL_SHOW;
    $scope.CAROUSEL_AUTO_PLAY = CONFIG.CF_CAROUSEL_AUTO_PLAY;
    $scope.AN_CAROUSEL_IMG_VIDEO = CONFIG.CF_AN_CAROUSEL_IMG_VIDEO;
    $scope.AN_CAROUSEL_PILL = CONFIG.CF_AN_CAROUSEL_PILL;
    $scope.AN_STORE_IMG_VIDEO = CONFIG.CF_AN_STORE_IMG_VIDEO;
    $scope.AN_STORE_PILL = CONFIG.CF_AN_STORE_PILL;
    $scope.CAROUSEL_IMAGE_BORDER = CONFIG.CF_CAROUSEL_IMAGE_BORDER;
    $scope.STORE_IMAGE_BORDER = CONFIG.CF_STORE_IMAGE_BORDER;
    $scope.SYSTEM_NAME = CONFIG.CF_SYSTEM_NAME;
    $scope.SYSTEM_LANGUAGE = CONFIG.CF_SYSTEM_LANGUAGE;
    $scope.BASE_URL = CONFIG.CF_BASE_URL;
    $scope.API_URL = CONFIG.CF_API_URL;
    $scope.GOOGLE_ANALYTICS_ID = CONFIG.CF_GOOGLE_ANALYTICS_ID;
    /* for future versions */
    //$scope.DB = CONFIG.CF_DB;
    //$scope.DATABASENAME = CONFIG.CF_DATABASENAME;
    //$scope.TABLE1 = CONFIG.CF_TABLE1;
    //$scope.TABLE2 = CONFIG.CF_TABLE2;
    //$scope.KEYPATH1 = CONFIG.CF_KEYPATH1;
    //$scope.KEYPATH2 = CONFIG.CF_KEYPATH2;
    //$scope.INDEX1 = CONFIG.CF_INDEX1;
    //$scope.INDEX2 = CONFIG.CF_INDEX2;
    //$scope.INDEX3 = CONFIG.CF_INDEX3;
    //$scope.DB_VERSION = CONFIG.CF_DB_VERSION;
    //$scope.GLOBALCOUNTER = CONFIG.CF_GLOBALCOUNTER;
    //$scope.LOADED = CONFIG.CF_LOADED;
    //$scope.SERVICEORDERS = CONFIG.CF_SERVICEORDERS;

    //storeApp.controller('storeController', function (DataService) {
    //var ctrl = this;
    //ctrl.slides = [];
    //ctrl.fetchContent = function () {
    //    DataService.getData().then(function (result) {
    //        ctrl.slides = result.data;
    //    });
    //};
    //ctrl.fetchContent();

    $scope.products = [];
    $scope.slides = [];

    $scope.fetchContent = function () {
        DataService.getData().then(function (result) {
            $scope.products = result.data;
            for (var i = 0, len = $scope.products.length; i < len; i++) {
                var prod = $scope.products[i];
                if (prod.imagename.length < 1) {
                    prod.imagename = "nopic.png";
                }
                if (prod.carousel) {
                    $scope.slides.push(prod);
                }
            }

            // We use: ng-if="dataLoaded" init-onload="false" data="dataLoaded" 
            // in the timeout function in order to get the old elements completly removed.
            // otherwise the old elements stay in the directive and the carousel breaks
            $timeout(function () {
                $scope.dataLoaded = true;
            });

        });
    };
    $scope.fetchContent();




});


storeApp.directive('pillContent', function ($compile, TemplateService, CONFIG) {

    var getTemplate = function (templates, displayType) {
        var template = '';

        switch (displayType) {
            case 'image':
                template = templates.imageTemplate;
                break;
            case 'video':
                template = templates.videoTemplate;
                break;
            case 'note':
                template = templates.noteTemplate;
                break;
        }

        return template;
    };

    var linker = function (scope, element, attrs) {

        /*#####################
        CONFIG
        ######################*/
        /* our global variabls */
        scope.STORE_ID = CONFIG.CF_STORE_ID;
        scope.STORE_PAGE = CONFIG.CF_STORE_PAGE;
        scope.STORE_BG_IMAGE = CONFIG.CF_STORE_BG_IMAGE;
        scope.DISTRIBUTOR_ID = CONFIG.CF_DISTRIBUTOR_ID;
        scope.PAYMENT_PAYPAL_BUYNOW = CONFIG.CF_PAYMENT_PAYPAL_BUYNOW;
        scope.PAYMENT_GOOGLE_WALLET_ID = CONFIG.CF_PAYMENT_GOOGLE_WALLET_ID;
        scope.PAYMENT_STRIPE = CONFIG.CF_PAYMENT_STRIPE;
        scope.PRODUCTS_FOLDER = CONFIG.CF_PRODUCTS_FOLDER;
        scope.PRODUCTS_FILE = CONFIG.CF_PRODUCTS_FILE;
        scope.NAVBAR_THEME = CONFIG.CF_NAVBAR_THEME;
        scope.NAVBAR_LOGO_TEXT = CONFIG.CF_NAVBAR_LOGO_TEXT;
        scope.NAVBAR_LOGO_LINK = CONFIG.CF_NAVBAR_LOGO_LINK;
        scope.INSIDE_HEADER_SHOW = CONFIG.CF_INSIDE_HEADER_SHOW;
        scope.INSIDE_HEADER_LINK = CONFIG.CF_INSIDE_HEADER_LINK;
        scope.INSIDE_HEADER_IMAGE = CONFIG.CF_INSIDE_HEADER_IMAGE;
        scope.INSIDE_HEADER_TITLE = CONFIG.CF_INSIDE_HEADER_TITLE;
        scope.CAROUSEL_SHOW = CONFIG.CF_CAROUSEL_SHOW;
        scope.CAROUSEL_AUTO_PLAY = CONFIG.CF_CAROUSEL_AUTO_PLAY;
        scope.AN_CAROUSEL_IMG_VIDEO = CONFIG.CF_AN_CAROUSEL_IMG_VIDEO;
        scope.AN_CAROUSEL_PILL = CONFIG.CF_AN_CAROUSEL_PILL;
        scope.AN_STORE_IMG_VIDEO = CONFIG.CF_AN_STORE_IMG_VIDEO;
        scope.AN_STORE_PILL = CONFIG.CF_AN_STORE_PILL;
        scope.CAROUSEL_IMAGE_BORDER = CONFIG.CF_CAROUSEL_IMAGE_BORDER;
        scope.STORE_IMAGE_BORDER = CONFIG.CF_STORE_IMAGE_BORDER;
        scope.SYSTEM_NAME = CONFIG.CF_SYSTEM_NAME;
        scope.SYSTEM_LANGUAGE = CONFIG.CF_SYSTEM_LANGUAGE;
        scope.BASE_URL = CONFIG.CF_BASE_URL;
        scope.API_URL = CONFIG.CF_API_URL;
        scope.GOOGLE_ANALYTICS_ID = CONFIG.CF_GOOGLE_ANALYTICS_ID;
        /* for future versions */
        //scope.DB = CONFIG.CF_DB;
        //scope.DATABASENAME = CONFIG.CF_DATABASENAME;
        //scope.TABLE1 = CONFIG.CF_TABLE1;
        //scope.TABLE2 = CONFIG.CF_TABLE2;
        //scope.KEYPATH1 = CONFIG.CF_KEYPATH1;
        //scope.KEYPATH2 = CONFIG.CF_KEYPATH2;
        //scope.INDEX1 = CONFIG.CF_INDEX1;
        //scope.INDEX2 = CONFIG.CF_INDEX2;
        //scope.INDEX3 = CONFIG.CF_INDEX3;
        //scope.DB_VERSION = CONFIG.CF_DB_VERSION;
        //scope.GLOBALCOUNTER = CONFIG.CF_GLOBALCOUNTER;
        //scope.LOADED = CONFIG.CF_LOADED;
        //scope.SERVICEORDERS = CONFIG.CF_SERVICEORDERS;

        scope.rootDirectory = scope.PRODUCTS_FOLDER + '/'; // 'ac_products/';

        TemplateService.getTemplates().then(function (response) {
            var templates = response.data;

            element.html(getTemplate(templates, scope.content.display_type));

            $compile(element.contents())(scope);
        });
    };

    return {
        restrict: 'E',
        link: linker,
        scope: {
            content: '='
        }
    };
});



storeApp.filter('unsafe', function ($sce) {
    return function (val) {
        return $sce.trustAsHtml(val);
    };
});

//BILL SERGIO - I am not using code below except tp test the EMBED code for these video sites
storeApp.directive('embedVideo', function ($sce) {
    return {
        restrict: 'EA',
        scope: { tube: '=', code: '=' },
        replace: true,
        template: '<div class="video"><iframe src="{{url}}" frameborder="0" webkitAllowFullScreen mozallowfullscreen allowFullScreen></iframe></div>',
        link: function (scope) {
            //console.log('here');
            //document.cookie="VISITOR_INFO1_LIVE=oKckVSqvaGw; path=/; domain=.youtube.com";window.location.reload();
            scope.url = "about:blank";
            scope.$watch('code', function (videoidVal) {
                if (videoidVal) {
                    if (scope.tube === 'youtube') {
                        scope.url = $sce.trustAsResourceUrl("http://www.youtube.com/embed/" + videoidVal);
                    }
                    else if (scope.tube === 'youku') {
                        scope.url = $sce.trustAsResourceUrl("http://player.youku.com/embed/" + videoidVal);
                    }
                    else if (scope.tube === 'vimeo') {
                        scope.url = $sce.trustAsResourceUrl("http://player.vimeo.com/video/" + videoidVal);
                    }
                    else if (scope.tube === 'dailymotion') {
                        scope.url = $sce.trustAsResourceUrl("http://www.dailymotion.com/embed/video/" + videoidVal);
                    }
                    else if (scope.tube === '5min') {
                        scope.url = $sce.trustAsResourceUrl("http://embed.5min.com/" + videoidVal);
                    }
                    else if (scope.tube === 'cc') {
                        scope.url = $sce.trustAsResourceUrl("http://media.mtvnservices.com/embed/" + videoidVal);
                    }
                    else if (scope.tube === 'metacafe') {
                        scope.url = $sce.trustAsResourceUrl("http://www.metacafe.com/embed/" + videoidVal);
                    }
                    else if (scope.tube === 'liveleak') {
                        scope.url = $sce.trustAsResourceUrl("http://www.liveleak.com/ll_embed?f=" + videoidVal);
                    }
                    else if (scope.tube === 'ebaumsworld') {
                        scope.url = $sce.trustAsResourceUrl("http://www.ebaumsworld.com/media/embed/" + videoidVal);
                    }
                    else if (scope.tube === 'bliptv') {
                        scope.url = $sce.trustAsResourceUrl("http://blip.tv/play/" + videoidVal);
                    }
                    else if (scope.tube === 'funnyordie') {
                        scope.url = $sce.trustAsResourceUrl("http://www.funnyordie.com/embed/" + videoidVal);
                    }
                    else if (scope.tube === 'stupidvideos') {
                        scope.url = $sce.trustAsResourceUrl("http://www.stupidvideos.com/embed/?video=" + videoidVal);
                    }
                    scope.$apply();
                }
            });
        }
    };
});







var favApp = angular.module("favicon", []);
favApp.filter("favicon", function () {
    var provider = "https://www.google.com/s2/favicons?domain=%s";

    return function (url) {
        return provider.replace(/%s/g, url);
    }
})
.directive("favicon", ["faviconFilter", function (faviconFilter) {
    return {
        restrict: "EA",
        replace: true,
        template: '<img ng-src="{{faviconUrl}}" alt="{{description}}">',
        scope: {
            url: "=",
            description: "="
        },
        link: function ($scope, element, attrs) {
            $scope.$watch("url", function (value) {
                $scope.faviconUrl = faviconFilter(value);
            });
        }
    }
}]);




/*#####################
MyMenu
######################*/
storeApp.controller('MyMenu', function ($scope, $filter, $location, CONFIG) {

    $scope.name = 'MyMenu';
    $scope.isCollapsed = false;
    $scope.dataLoaded = false;

    /*#####################
    CONFIG
    ######################*/
    /* our global variabls */
    $scope.STORE_ID = CONFIG.CF_STORE_ID;
    $scope.STORE_PAGE = CONFIG.CF_STORE_PAGE;
    $scope.STORE_BG_IMAGE = CONFIG.CF_STORE_BG_IMAGE;
    $scope.DISTRIBUTOR_ID = CONFIG.CF_DISTRIBUTOR_ID;
    $scope.PAYMENT_PAYPAL_BUYNOW = CONFIG.CF_PAYMENT_PAYPAL_BUYNOW;
    $scope.PAYMENT_GOOGLE_WALLET_ID = CONFIG.CF_PAYMENT_GOOGLE_WALLET_ID;
    $scope.PAYMENT_STRIPE = CONFIG.CF_PAYMENT_STRIPE;
    $scope.PRODUCTS_FILE = CONFIG.CF_PRODUCTS_FILE;
    $scope.PRODUCTS_FOLDER = CONFIG.CF_PRODUCTS_FOLDER;
    $scope.NAVBAR_THEME = CONFIG.CF_NAVBAR_THEME;
    $scope.NAVBAR_LOGO_TEXT = CONFIG.CF_NAVBAR_LOGO_TEXT;
    $scope.NAVBAR_LOGO_LINK = CONFIG.CF_NAVBAR_LOGO_LINK;
    $scope.INSIDE_HEADER_SHOW = CONFIG.CF_INSIDE_HEADER_SHOW;
    $scope.INSIDE_HEADER_LINK = CONFIG.CF_INSIDE_HEADER_LINK;
    $scope.INSIDE_HEADER_IMAGE = CONFIG.CF_INSIDE_HEADER_IMAGE;
    $scope.INSIDE_HEADER_TITLE = CONFIG.CF_INSIDE_HEADER_TITLE;
    $scope.CAROUSEL_SHOW = CONFIG.CF_CAROUSEL_SHOW;
    $scope.CAROUSEL_AUTO_PLAY = CONFIG.CF_CAROUSEL_AUTO_PLAY;
    $scope.AN_CAROUSEL_IMG_VIDEO = CONFIG.CF_AN_CAROUSEL_IMG_VIDEO;
    $scope.AN_CAROUSEL_PILL = CONFIG.CF_AN_CAROUSEL_PILL;
    $scope.AN_STORE_IMG_VIDEO = CONFIG.CF_AN_STORE_IMG_VIDEO;
    $scope.AN_STORE_PILL = CONFIG.CF_AN_STORE_PILL;
    $scope.SYSTEM_NAME = CONFIG.CF_SYSTEM_NAME;
    $scope.SYSTEM_LANGUAGE = CONFIG.CF_SYSTEM_LANGUAGE;
    $scope.BASE_URL = CONFIG.CF_BASE_URL;
    $scope.API_URL = CONFIG.CF_API_URL;
    $scope.GOOGLE_ANALYTICS_ID = CONFIG.CF_GOOGLE_ANALYTICS_ID;

    if ($scope.CAROUSEL_SHOW) {
        $('#storeslider_wrapper').css('display', 'block');
    }
    else {
        $('#storeslider_wrapper').css('display', 'none');
    }

    if ($scope.INSIDE_HEADER_SHOW) {
        $('.inside_header').css('display', 'block');
    }
    else {
        $('.inside_header').css('display', 'none');
    }

    if ($scope.STORE_BG_IMAGE.length > 0) {
        $("body").css('background-image', '');
        $("body").css("background", "#ffffff url(" + $scope.STORE_BG_IMAGE + ") no-repeat center center fixed");
        localStorage['bg_cart'] = $scope.STORE_BG_IMAGE;
    }

    _navbar_theme = "navbar_gray_gradient";
    if (localStorage["navbar_theme"]) {
        _navbar_theme = localStorage["navbar_theme"];
    } else {
        _navbar_theme = "navbar_gray_gradient";
        localStorage["navbar_theme"] = "navbar_gray_gradient";
    }
    var _path = "ac_css/" + _navbar_theme + ".css";
    $("#link_index").attr("href", _path);
    $scope.NAVBAR_THEME = _navbar_theme;


    $scope.showHideCarousel = function (event) {
        //event.stopPropagation();
        event.preventDefault();

        if ($('#storeslider_wrapper').css('display') === 'block') {
            $('.carousel_trim').css('display', 'none');
            $('#storeslider_wrapper').css('display', 'none');
        }
        else {
            $('.carousel_trim').css('display', 'block');
            $('#storeslider_wrapper').css('display', 'block');
            $("#storeslider").slick('slickPrev');
            $("#storeslider").slick('slickNext');
        }
    }

    $scope.changeBackgroundImage = function (event) {
        //event.stopPropagation();
        event.preventDefault();
        var x = 0
        for (x = 0; x < arBGs.length; x++) {
            if (_bgImage === arBGs[x]) { break; }
        }
        if (x + 1 < arBGs.length) {
            _bgImage = arBGs[x + 1];
        }
        else {
            x = 0;
            _bgImage = arBGs[x];
        }
        $("body").css('background-image', '');

        if (_bgImage === 'ac_img/bg0.jpg') {
            $("body").css("background-color", "#ffffff");
        }
        else {
            $("body").css("background", "#ffffff url(" + _bgImage + ") no-repeat center center fixed");
        }
        localStorage['bg_cart'] = _bgImage;
    }

    $scope.changeNavBar = function (css_name) {
        //event.stopPropagation();
        event.preventDefault();
        var _path = "ac_css/" + css_name + ".css";
        _navbar_theme = css_name;
        localStorage["navbar_theme"] = _navbar_theme;
        $("#link_index").attr("href", _path);
        return false;
    };

    $scope.changeProducts = function (products_file) {
        //event.stopPropagation();
        event.preventDefault();
        $scope.PRODUCTS_FILE = products_file;
        CONFIG.CF_PRODUCTS_FILE = products_file;
        localStorage["products_file"] = products_file;
        window.location.reload();
        return false;
    };


    $scope.changeCarouselImageBorder = function (cibClassName) {
        var e = '.carousel_imgborder';
        $(e).removeClass(function (index, css) {
            return (css.match(/(^|\s)cib-\S+/g) || []).join(' ');
        });
        if (cibClassName.length > 0) {
            $(e).addClass(cibClassName);
        }
    };

    $scope.changeAnimation = function (effect_name) {
        var e = '';
        if ($scope.myModel === 'carousel_img_video') {
            e = '.note_header';
            $(e).removeClass(function (index, css) {
                return (css.match(/(^|\s)hvr-\S+/g) || []).join(' ');
            });
            $(e).addClass(effect_name);
            e = '.carousel_img_video';
        }
        else if ($scope.myModel === 'carousel_pill') {
            e = '.carousel_pill_note';
            $(e).removeClass(function (index, css) {
                return (css.match(/(^|\s)hvr-\S+/g) || []).join(' ');
            });
            $(e).addClass(effect_name);
            e = '.carousel_pill';
        }
        else if ($scope.myModel === 'store_img_video') {
            e = '.store_img_video';
        }
        else if ($scope.myModel === 'store_pill') {
            //e = '.nav-pills li';
            e = '.store_pill';
        }
        if (e.length > 0) {
            $(e).removeClass(function (index, css) {
                return (css.match(/(^|\s)hvr-\S+/g) || []).join(' ');
            });
            $(e).addClass(effect_name);
        }
    };

    // Author: Bill SerGio - An elegant way to set the active tab is to use ng-controller 
    // to run a single controller outside of the ng-view as shown below.
    $scope.isActive = function (viewLocation) {
        return viewLocation === $location.path();
    };






    //initiate an array to hold all active tabs
    $scope.activeTabs = [];

    //check if the tab is active
    $scope.isOpenTab = function (tab) {
        //event.stopPropagation();
        event.preventDefault();

        //check if this tab is already in the activeTabs array
        if ($scope.activeTabs.indexOf(tab) > -1) {
            //if so, return true
            return true;
        } else {
            //if not, return false
            return false;
        }
    }

    //function to 'open' a tab
    $scope.openTab = function (tab) {
        //event.stopPropagation();
        event.preventDefault();

        //check if tab is already open
        if ($scope.isOpenTab(tab)) {
            //if it is, remove it from the activeTabs array
            $scope.activeTabs.splice($scope.activeTabs.indexOf(tab), 1);
        } else {
            $scope.activeTabs = [];
            //if it's not, add it!
            $scope.activeTabs.push(tab);
        }
        return false;
    }

    // create a radioButtonGroup for our apply effects options
    $scope.optActions = [
        { id: 'apply', name: 'apply effect', disabled: false, showinfo: '' },
        { id: 'remove', name: 'remove effect', disabled: false, showinfo: '' }
    ];
    $scope.modelAction = 'apply';
    $scope.idProperty = "id";
    $scope.nameProperty = "name";
    $scope.bootstrapSuffix = "x-success";
    $scope.disabledProperty = false;
    $scope.showinfoProperty = "";


    // create a radioButtonGroup for our apply effects options
    //{ id: 'carousel_img_video', name: 'carousel img', disabled: false, showinfo: 'You need to download and install the AngularJS Slick Carousel to apply effects to the Carousel!' },
    //{ id: 'carousel_pill', name: 'carousel pill', disabled: false, showinfo: 'You need to download and install the AngularJS Slick Carousel to apply effects to the Carousel!' }
    $scope.myOptions = [
        { id: 'store_img_video', name: 'store img', disabled: false, showinfo: 'You need to download and install the AngularJS Shopping Cart to apply effects to the shopping cart!' },
        { id: 'store_pill', name: 'store pill', disabled: false, showinfo: 'You need to download and install the AngularJS Shopping Cart to apply effects to the shopping cart!' },
        { id: 'carousel_img_video', name: 'carousel img', disabled: false, showinfo: '' },
        { id: 'carousel_pill', name: 'carousel pill', disabled: false, showinfo: '' }
    ];
    $scope.myModel = 'carousel_img_video';
    $scope.idProperty = "id";
    $scope.nameProperty = "name";
    $scope.bootstrapSuffix = "xs-success";
    $scope.disabledProperty = false;
    $scope.showinfoProperty = "";

});


storeApp.directive('radioButtonGroup', function () {
    return {
        restrict: 'E',
        scope: { model: '=', options: '=', id: '=', name: '=', suffix: '=', disabled: '=', showinfo: '=' },
        controller: function ($scope) {
            $scope.activate = function (option, $event) {
                if (option.showinfo.length > 0) {
                    alert(option.showinfo);
                    return false;
                }
                $scope.model = option[$scope.id];
                // stop click event to avoid Bootstrap toggling "active" class
                if ($event.stopPropagation) {
                    $event.stopPropagation();
                }
                if ($event.preventDefault) {
                    $event.preventDefault();
                }
                $event.cancelBubble = true;
                $event.returnValue = false;
            };

            $scope.isActive = function (option) {
                return option[$scope.id] == $scope.model;
            };

            $scope.isDisabled = function (option) {
                return option[$scope.disabled] == $scope.model;
            };

            $scope.getName = function (option) {
                return option[$scope.name];
            }
        },
        template: "<button type='button' class='btn btn-{{suffix}}' " +
            "ng-class='{active: isActive(option)}'" +
            "ng-repeat='option in options' " +
            //The ng-disabled expression is evaluated in the present scope. Hence, 
            //you should NOT USE the extra interpolation with {{..}} which will not work:
            "ng-disabled=option.disabled ng-click='activate(option, $event)'><span ng-bind-html='getName(option) | unsafe'></span>" +
            "</button>"
    };
});



angular.module('igTruncate', []).filter('truncate', function () {
    return function (text, length, end) {
        if (text !== undefined) {
            if (isNaN(length)) {
                length = 10;
            }

            if (end === undefined) {
                end = "...";
            }

            if (text.length <= length || text.length - end.length <= length) {
                return text;
            } else {
                return String(text).substring(0, length - end.length) + end;
            }
        }
    };
});

storeApp.directive('aDisabled', function ($compile) {
    return {
        restrict: 'A',
        priority: -99999,
        link: function (scope, element, attrs) {
            scope.$watch(attrs.aDisabled, function (val, oldval) {
                if (!!val) {
                    element.unbind('click');
                } else if (oldval) {
                    element.bind('click', function () {
                        scope.$apply(attrs.ngClick);
                    });
                }
            });
        }
    };
});





















































