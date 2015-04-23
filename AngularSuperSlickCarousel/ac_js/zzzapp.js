
var storeApp = angular.module('AngularStore', ['ngRoute', 'storeApp.config']);

storeApp.config(function ($sceDelegateProvider) {
    $sceDelegateProvider.resourceUrlWhitelist(['self', '**']);
});

storeApp.constant('URL', 'ac_products/');

storeApp.factory('DataService', function ($http, URL) {
    var getData = function () {
        return $http.get(URL + 'products.txt');
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


storeApp.controller('ContentCtrl', function ($scope, $filter, $routeParams, $location, DataService, $sce, $timeout, CONFIG) {
//storeApp.controller('ContentCtrl', function (DataService) {
    //var ctrl = this;
    //ctrl.slides = [];
    //ctrl.fetchContent = function () {
    //    DataService.getData().then(function (result) {
    //        ctrl.slides = result.data;
    //    });
    //};
    //ctrl.fetchContent();

    $scope.slides = [];

    $scope.fetchContent = function () {
        DataService.getData().then(function (result) {
            $scope.slides = result.data;
        });
    };

    $scope.fetchContent();

});

storeApp.directive('contentItem', function ($compile, TemplateService, CONFIG) {

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
        scope.PRODUCTS_FILE = CONFIG.CF_PRODUCTS_FILE;
        scope.PRODUCTS_FOLDER = CONFIG.CF_PRODUCTS_FOLDER;
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