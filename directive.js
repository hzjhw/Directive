/**
 @description 时间选择器
 @author wyj <zjut_wyj@163.com>
 @modified  wyj <2014-03-11>
 @date 2014-02-25
 @example <input datetimepicker="" class="form-control" ng-model="enterprise.reg_time" type="text">
 **/
app.directive('datetimepicker', function() {
    return {
        restrict: 'A',
        require : 'ngModel',
        link : function (scope, element, attrs, ngModelCtrl) {
            element.datepicker({
                language : 'zh-CN',
                dateFormat:'dd-MM-yy',
                autoclose: true,
                todayHighlight: true,
                todayBtn: true,
                onSelect:function (date) {
                    scope.$apply(function () {
                        ngModelCtrl.$setViewValue(date);
                    });
                }
            });
        }
    }
});

/**
 @description 图片等比例居中显示
 @author wyj <zjut_wyj@163.com>
 @modified  wyj <2014-03-11>
 @date 2014-02-25
 @example <img imgcrop data-width = '80' data-height="80"   ng-src="">
 **/
app.directive('imgcrop', function () {
    return {
        link: function(scope, element, attrs) {
            var w = attrs.width;
                h = attrs.height;
            element.bind("load" , function(e){

                var _w = element[0].naturalWidth;
                    _h = element[0].naturalHeight;
                if(_w != 0 && _h != 0){
                    var z_w = w / _w;
                    var z_h = h / _h;
                    if(z_w < z_h){
                        element.css('height' , h);
                        element.css('width', _w * z_h);
                        element.css('margin-top', 0);
                        element.css('margin-left', -(_w * z_h-w) / 2);
                    }
                    else if(z_w > z_h){
                        element.css('height', _h * z_h);
                        element.css('width', w);
                        element.css('margin-top', -(_h * z_h-h) /2);
                        element.css('margin-left', 0);
                    }
                    else if(z_w == z_h){
                        element.css('width',w);
                        element.css('height',h);
                        element.css('margin-top', 0);
                        element.css('margin-left', 0);
                    }
                    else{
                        element.css('width', w);
                        element.css('height', h);
                        element.css('margin-top', -(_h -h) /2);
                        element.css('margin-left',-(_w -w) /2);
                    }

                }
            });

        }
    }
});


/**
 @description 点击编辑
 @author wyj <zjut_wyj@163.com>
 @modified  wyj <2014-03-12>
 @date 2014-03-12
 @example <div click-to-edit="location.state"></div>
 **/
app.directive("clickToEdit", function() {
    var editorTemplate = '<div class="click-to-edit">' +
        '<div ng-hide="view.editorEnabled">' +
        '{{value}} ' +
        '<a ng-click="enableEditor()">编辑</a>' +
        '</div>' +
        '<div ng-show="view.editorEnabled">' +
        '<input ng-model="view.editableValue">' +
        '<a ng-click="save()">保存</a>' +
        ' or ' +
        '<a ng-click="disableEditor()">取消</a>.' +
        '</div>' +
        '</div>';

    return {
        restrict: "A",
        replace: true,
        template: editorTemplate,
        scope: {
            value: "=clickToEdit"
        },
        controller: function($scope) {
            $scope.view = {
                editableValue: $scope.value,
                editorEnabled: false
            };

            $scope.enableEditor = function() {
                $scope.view.editorEnabled = true;
                $scope.view.editableValue = $scope.value;
            };

            $scope.disableEditor = function() {
                $scope.view.editorEnabled = false;
            };

            $scope.save = function() {
                $scope.value = $scope.view.editableValue;
                $scope.disableEditor();
            };
        }
    };
});
/**
 * @description augular flash
 * @method embedSrc
 * @param {String} embedSrc 地址
 * @author wyj on 14;5/21
 * @example
 * <embed width="105" height="105" allowscriptaccess="always" wmode="transparent" embed-src="{{API_END_POINT}}{{pic.server_path}}" />
 */
app.directive('embedSrc', function () {
    return {
        restrict: 'A',
        link: function (scope, element, attrs) {
            var current = element;
            scope.$watch(function() { return attrs.embedSrc; }, function () {
                var clone = element
                    .clone()
                    .attr('src', attrs.embedSrc);
                current.replaceWith(clone);
                current = clone;
            });
        }
    };
});

/**
 * @description 回车事件
 * @method ngEnter
 * @param {Function} ngEnter 回调函数
 * @author wyj on 14;5/21
 * @example
 * <input  class="ui-pg-input" type="text" size="2" maxlength="7" ng-init="gotopage=1" tooltip="按回车跳转"  ng-model="gotopage" ng-enter="params.page(gotopage)" role="textbox">
 */
app.directive('ngEnter', function() {
    return function(scope, element, attrs) {
        element.bind("keydown keypress", function(event) {
            if(event.which === 13) {
                scope.$apply(function(){
                    scope.$eval(attrs.ngEnter, {'event': event});
                });

                event.preventDefault();
            }
        });
    };
});
app.directive('data-gallery', function(){
    return {
        require: '?ngModel',
        link: function (scope, elem, attrs, ctrl) {

        }
    };
})
/**
 * @description 格式化
 * @method format
 * @param {String} number 格式化数字 1200 => 1,200
 * @param {String} price 格式化价格 1200 => 1,200
 * @param {String} phone 格式化固定电话 057512345678 => 0575-12345678
 * @author wyj on 14;5/21
 * @example
 * <input  class="ui-pg-input" type="text" size="2" maxlength="7" ng-init="gotopage=1" tooltip="按回车跳转"  ng-model="gotopage" ng-enter="params.page(gotopage)" role="textbox">
 */
app.directive('format', ['$filter', function ($filter) {
    return {
        require: '?ngModel',
        link: function (scope, elem, attrs, ctrl) {
            if (!ctrl) return;
            ctrl.$formatters.unshift(function (a) {
                return $filter('number')(ctrl.$modelValue)
            });
            ctrl.$parsers.unshift(function (viewValue) {
                switch(attrs.format){
                    case 'number' :
                        var number = viewValue.replace(/\D/g,'');
                        elem.val($filter('number')(number));
                        return number;
                        break;
                    case 'phone' :
                        var phone = viewValue.replace(/^(\d{3,4})-?(\d{7,9})$/g, '$1-$2');
                        elem.val(phone);
                        return phone;
                        break;
                    case 'price' :
                        var price = viewValue.replace(/[^\d|\-+|\.+]/g, '');
                        elem.val($filter('number')(price));
                        return price;
                        break;
                }

            });
        }
    };
}]);

/**
 * @description 字符串截取
 * @method characters
 * @author wyj on 14;5/21
 * @example
 * <a ng-if="!product.$edit"  href="javascript:;" ng-click="product_view(product)" style="color:#333;">{{product.name | characters:25}}</a>
 */
app.filter('characters', function () {
        return function (input, chars, breakOnWord) {
            if (isNaN(chars)) return input;
            if (chars <= 0) return '';
            if (input && input.length > chars) {
                input = input.substring(0, chars);
                if (!breakOnWord) {
                    var lastspace = input.lastIndexOf(' ');
                    //get last space
                    if (lastspace !== -1) {
                        input = input.substr(0, lastspace);
                    }
                }else{
                    while(input.charAt(input.length-1) === ' '){
                        input = input.substr(0, input.length -1);
                    }
                }
                return input + '...';
            }
            return input;
        };
    });