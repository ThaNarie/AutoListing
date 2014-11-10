///<reference path="definitions/definitions.d.ts" />
define([
    'mootools',
    'jquery',
    'knockout',
    'lib/knockout/knockout.punches',
    'moment',
    'cookie'
], function (mootools, $, ko) {
    ko.punches.interpolationMarkup.enable();
    ko.punches.attributeInterpolationMarkup.enable();
    ko.punches.textFilter.enableForBinding('text');
    ko.punches.textFilter.enableForBinding('foreach');
    // Custom filter can be used like "| append: 'xyz'"
    ko.filters['filter'] = function (value, search) {
        return ko.unwrap(value).filter(function (element) {
            return ko.unwrap(element).indexOf(ko.unwrap(search)) != -1;
        });
    };
    ko.bindingHandlers['live'] = {
        preprocess: function (value, name, addBindingsCallback) {
            addBindingsCallback('value', value);
            addBindingsCallback('valueUpdate', "['afterkeydown', 'keyup', 'input']");
        }
    };
    ko.punches.utils.setNodePreprocessor(function (node) {
        if (node.nodeType !== 1) {
            return;
        }
        var name = node.tagName.toLowerCase();
        if (name.substr(0, 2) == 'x-') {
            var templateName = name.substr(2);
            var data = $(node).attr('data');
            var template = $('#' + templateName)[0];
            if (template) {
                var $newNode = $('<div/>');
                $newNode.attr('data-bind', "template: {name: '" + templateName + "'" + (data ? ', data: ' + data : '') + '}');
                $(node).replaceWith($newNode);
            }
        }
    });
});
