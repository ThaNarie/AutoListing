///<reference path="../lib/definitions/definitions.d.ts" />
define(["require", "exports", 'knockout', 'app/util/ByteSizeParser'], function (require, exports, ko, ByteSizeParser) {
    var MainViewModel = (function () {
        function MainViewModel(controller) {
            var _this = this;
            this.commandQueue = [];
            this.commandIndex = 0;
            this.previousFilteredItemsLength = 0;
            this.controller = controller;
            this.parentLink = '';
            this.favs = [
                {
                    isDir: true,
                    type: '[DIR]',
                    name: 'MediaMonks projects',
                    link: '/projects/mediamonks/',
                    date: '',
                    size: 0
                },
                {
                    isDir: true,
                    type: '[DIR]',
                    name: 'ThaNarie projects',
                    link: '/projects/thanarie/',
                    date: '',
                    size: 0
                }
            ];
            this.items = ko.observableArray([]);
            this.pathItems = ko.observableArray([]);
            this.previousPathItems = ko.observableArray([]);
            this.search = ko.observable('');
            this.selectedIndex = ko.observable(-1);
            this.selectedItem = ko.observable(null);
            this.activeFilter = ko.observable('type');
            this.activeFilterDirection = ko.observable(true);
            this.searchMode = ko.observable('search');
            this.selectedSearchText = ko.computed(function () {
                if (_this.searchMode() != 'filter') {
                    return _this.search().length || _this.selectedIndex() > 0 ? 'press "tab" or "enter" to select' : 'type to search - "Ctrl+Shift+F" to filter';
                }
                if (_this.search() == '') {
                    $('#search').css('padding-left', '');
                    return 'type to filter';
                }
                if (_this.filteredItems().length == 0) {
                    $('#search').css('padding-left', '');
                    return _this.search() + ' - no results';
                }
                var text = _this.filteredItems()[Math.max(0, Math.min(_this.filteredItems().length - 1, _this.selectedIndex()))].name;
                text = text.replace(new RegExp(_this.search(), 'i'), '<span class="hidden">' + _this.search() + '</span>') + ' - press "enter" to select';
                setTimeout(function () {
                    if (_this.filteredItems().length == 0) {
                        $('#search').css('padding-left', '');
                        return;
                    }
                    $('#search').css('padding-left', $('.search-selected span').position().left + 'px');
                    _this.selectedIndex(Math.max(0, Math.min(_this.filteredItems().length - 1, _this.selectedIndex())));
                }, 1);
                return text;
            });
            this.sortedItems = ko.computed(function () {
                var filter = _this.activeFilter();
                var dir = _this.activeFilterDirection();
                var items = _this.items();
                items.sort(function (a, b) {
                    if (filter == 'name') {
                        if (a.name.toLowerCase() == b.name.toLowerCase())
                            return 0;
                        return (a.name.toLowerCase() < b.name.toLowerCase() ? -1 : 1) * (dir ? 1 : -1);
                    }
                    else if (filter == 'size') {
                        if (a.sizeValue == b.sizeValue)
                            return 0;
                        return (a.sizeValue > b.sizeValue ? -1 : 1) * (dir ? 1 : -1);
                    }
                    else if (filter == 'type') {
                        if (a.name == '..' || b.name == '..') {
                            return (a.name == '..' ? -1 : 1) * (dir ? 1 : -1);
                        }
                        else if (a.isDir && b.isDir) {
                            if (a.name.toLowerCase() == b.name.toLowerCase())
                                return 0;
                            return (a.name.toLowerCase() < b.name.toLowerCase() ? -1 : 1) * (dir ? 1 : -1);
                        }
                        else if (a.isDir || b.isDir) {
                            return (a.isDir ? -1 : 1) * (dir ? 1 : -1);
                        }
                        else {
                            if (a.ext == b.ext)
                                return 0;
                            return (a.ext < b.ext ? -1 : 1) * (dir ? 1 : -1);
                        }
                    }
                    else if (filter == 'date') {
                        if (a.dateValue == b.dateValue)
                            return 0;
                        return (a.dateValue < b.dateValue ? -1 : 1) * (dir ? 1 : -1);
                    }
                    return 1;
                });
                return items;
            });
            this.filteredItems = ko.computed(function () {
                if (_this.search() == '' || _this.searchMode() == 'search') {
                    return _this.sortedItems();
                }
                else {
                    var dir = _this.activeFilterDirection();
                    var lSearch = _this.search().toLowerCase();
                    var filtered = _this.sortedItems().filter(function (item) {
                        return item.name.toLowerCase().indexOf(lSearch) != -1;
                    });
                    filtered.sort(function (a, b) {
                        var ia = a.name.toLowerCase().indexOf(lSearch);
                        var ib = b.name.toLowerCase().indexOf(lSearch);
                        if (ia == ib) {
                            if (a.name.toLowerCase() == b.name.toLowerCase())
                                return 0;
                            return (a.name.toLowerCase() < b.name.toLowerCase() ? -1 : 1) * (dir ? 1 : -1);
                        }
                        else {
                            return ia < ib ? -1 : 1;
                        }
                    });
                    return filtered;
                }
            });
        }
        MainViewModel.prototype.getSizeNumber = function (size) {
            return Math.min(50, Math.pow(size, 1 / 5));
        };
        MainViewModel.prototype.getDateNumber = function (date) {
            if (date == '') {
                return 0;
            }
            var secAway = moment().diff(moment(date)) / 1000;
            return Math.max(0, (100 - Math.pow(secAway, 1 / 2.5)) * 1.3);
        };
        MainViewModel.prototype.getSize = function (size) {
            return ByteSizeParser.format(size);
        };
        MainViewModel.prototype.getDate = function (date) {
            if (date == '') {
                return '';
            }
            return moment(date).fromNow();
        };
        MainViewModel.prototype.getIcon = function (data) {
            if (data.link == '..') {
                return 'parent';
            }
            else if (data.isDir) {
                return 'dir';
            }
            else {
                return 'file';
            }
        };
        return MainViewModel;
    })();
    return MainViewModel;
});
