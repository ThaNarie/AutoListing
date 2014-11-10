///<reference path="../lib/definitions/definitions.d.ts" />
define(["require", "exports", 'knockout', 'app/util/Parser', 'app/MainViewModel'], function (require, exports, ko, Parser, MainViewModel) {
    var Main = (function () {
        function Main() {
            this.basePath = $('.autolisting-path').text();
            if (this.basePath.split('').pop() != '/') {
                this.basePath += '/';
            }
            window['ko'] = ko;
            this.viewModel = new MainViewModel(this);
            this.viewModel.items(Parser.parseTable($('.autolisting-table')));
            ko.applyBindings(this.viewModel, $('.wrapper')[0]);
            this.init();
            this.viewModel.pathItems(Parser.parsePath($('.autolisting-path')));
            this.viewModel.selectedIndex(0);
        }
        Main.prototype.init = function () {
            var _this = this;
            this.viewModel.selectedIndex.subscribe(function (newValue) {
                var $selectedItem = $('.items li:nth-child(' + (_this.viewModel.selectedIndex() + 1) + ')');
                if ($selectedItem.length > 0) {
                    $(window).scrollTop($selectedItem.offset().top - $(window).height() + ($(window).height() / 3));
                }
                // keep item selected instead of the index
                _this.viewModel.selectedItem(_this.viewModel.filteredItems()[_this.viewModel.selectedIndex()]);
            });
            this.viewModel.filteredItems.subscribe(function (newValue) {
                // if we filter down, always select top result
                if (newValue.length < _this.viewModel.previousFilteredItemsLength) {
                    _this.viewModel.selectedIndex(0);
                }
                else if (_this.viewModel.selectedItem()) {
                    _this.viewModel.selectedIndex(_this.viewModel.filteredItems().indexOf(_this.viewModel.selectedItem()));
                }
                _this.viewModel.previousFilteredItemsLength = newValue.length;
            });
            this.viewModel.pathItems.subscribe(function (newValue) {
                if (_this.viewModel.pathItems().length < _this.viewModel.previousPathItems().length) {
                    var recentFolder = _this.viewModel.previousPathItems.pop();
                    var recentItem = _this.viewModel.filteredItems().filter(function (item) {
                        return item.name == (recentFolder.name + '/');
                    })[0];
                    _this.viewModel.selectedIndex(_this.viewModel.filteredItems().indexOf(recentItem));
                }
                else {
                    _this.viewModel.selectedIndex(0);
                }
                _this.viewModel.previousPathItems(_this.viewModel.pathItems());
            });
            this.viewModel.search.subscribe(function (newValue) {
                if (newValue.length == 0 || _this.viewModel.searchMode() != 'search') {
                    return;
                }
                clearInterval(_this.searchTimeout);
                _this.searchTimeout = setTimeout(function () {
                    _this.viewModel.search('');
                    _this.viewModel.commandIndex = 0;
                }, 2000);
                var searchValue = newValue.split('');
                //console.log(newValue);
                // check if we repeatedly pressed the first letter to cycle trough the results
                var reduced = searchValue.reduce(function (prev, current) {
                    return prev == current ? prev : prev + current;
                });
                var options;
                // if cycle
                if (reduced.length == 1) {
                    options = _this.viewModel.sortedItems().filter(function (item) {
                        return item.name.toLowerCase().indexOf(reduced) == 0;
                    });
                    if (options[_this.viewModel.commandIndex] == _this.viewModel.selectedItem()) {
                        _this.viewModel.commandIndex = (_this.viewModel.commandIndex + 1) % options.length;
                    }
                    _this.viewModel.selectedIndex(_this.viewModel.filteredItems().indexOf(options[_this.viewModel.commandIndex]));
                    _this.viewModel.commandIndex = (_this.viewModel.commandIndex + 1) % options.length;
                }
                else {
                    _this.viewModel.commandIndex = 0;
                    options = _this.viewModel.sortedItems().filter(function (item) {
                        return item.name.toLowerCase().indexOf(searchValue.join('')) == 0;
                    });
                    // if we have options, select the first occurrence, otherwise do nothing
                    if (options.length > 0) {
                        _this.viewModel.selectedIndex(_this.viewModel.filteredItems().indexOf(options[_this.viewModel.commandIndex]));
                    }
                }
            });
            $('body').on('keydown', function (event) {
                var data = _this.viewModel.filteredItems()[_this.viewModel.selectedIndex()];
                //console.log(event);
                //  ctrl + backspace || shift + tab
                if (event.keyCode == 8 && event.ctrlKey || (event.keyCode == 9 && event.shiftKey)) {
                    _this.gotoPath({ isDir: true, link: '../' });
                }
                else if (event.keyCode == 13 && event.shiftKey) {
                    _this.openPath(_this.basePath + data.link);
                }
                else if (event.keyCode == 13 && event.altKey) {
                    _this.openNewPath(_this.basePath + data.link);
                }
                else if (event.keyCode == 9 || event.keyCode == 13) {
                    if (event.keyCode == 9) {
                        event.preventDefault();
                    }
                    if (_this.viewModel.filteredItems().length == 0) {
                        return;
                    }
                    _this.gotoPath(data);
                    event.preventDefault();
                }
                else if (event.keyCode == 27) {
                    _this.viewModel.search('');
                    _this.viewModel.commandQueue = [];
                    _this.viewModel.commandIndex = 0;
                    _this.closeHelp();
                    event.preventDefault();
                }
                else if (event.keyCode == 38) {
                    _this.viewModel.selectedIndex(Math.max(0, _this.viewModel.selectedIndex() - 1));
                    event.preventDefault();
                }
                else if (event.keyCode == 40) {
                    _this.viewModel.selectedIndex(Math.min(_this.viewModel.filteredItems().length - 1, _this.viewModel.selectedIndex() + 1));
                    event.preventDefault();
                }
                else if (event.keyCode == 36) {
                    _this.viewModel.selectedIndex(0);
                    event.preventDefault();
                }
                else if (event.keyCode == 35) {
                    _this.viewModel.selectedIndex(_this.viewModel.filteredItems().length - 1);
                    event.preventDefault();
                }
                else if (event.keyCode == 70 && event.ctrlKey && event.shiftKey) {
                    clearInterval(_this.searchTimeout);
                    _this.viewModel.search('');
                    _this.viewModel.commandIndex = 0;
                    _this.viewModel.searchMode(_this.viewModel.searchMode() == 'search' ? 'filter' : 'search');
                    event.preventDefault();
                }
                else if (event.keyCode == 191 && event.shiftKey) {
                    if ($('.help-open').length > 0) {
                        _this.closeHelp();
                    }
                    else {
                        _this.openHelp();
                    }
                    event.preventDefault();
                }
                else if (_this.viewModel.searchMode() == 'search') {
                }
            });
            $('.listing').on('click', 'li a', function (event) {
                if (event.ctrlKey) {
                    return;
                }
                event.preventDefault();
                var data = ko.dataFor(event.currentTarget);
                _this.gotoPath(data);
            });
            if (!isMobile) {
                $('#search').on('blur', function (event) {
                    setTimeout(function () {
                        $('#search').focus();
                    }, 10);
                });
                $('#search').focus();
            }
            $('.sort').on('click', 'a', function (event) {
                event.preventDefault();
                _this.viewModel.activeFilterDirection(_this.viewModel.activeFilter() != $(event.currentTarget).attr('data-filter') ? true : !_this.viewModel.activeFilterDirection());
                _this.viewModel.activeFilter($(event.currentTarget).attr('data-filter'));
            });
            $(window).on('scroll', function (event) {
                if (isMobile) {
                    return;
                }
                if ($('.favs').length == 0) {
                    return;
                }
                if ($(window).scrollTop() > ($('.favs').offset().top + $('.favs').height() - $('.info').height())) {
                    $('.search-wrapper').addClass('fixed');
                    $('.content').addClass('fixed');
                }
                else {
                    $('.search-wrapper').removeClass('fixed');
                    $('.content').removeClass('fixed');
                }
            });
            $(window).on('mousemove', function (event) {
                if (event.clientX > $(window).width() - 120) {
                    $('.items').addClass('stats');
                }
                else {
                    $('.items').removeClass('stats');
                }
            });
            $('.listing').removeClass('disabled');
        };
        Main.prototype.onPathItemClick = function (vm, event) {
            this.gotoPath(vm);
        };
        Main.prototype.expandPathOnMobile = function () {
            $('.info').addClass('expanded');
        };
        Main.prototype.collapsePathOnMobile = function () {
            $('.info').removeClass('expanded');
        };
        Main.prototype.openHelp = function () {
            $('body').addClass('help-open');
        };
        Main.prototype.closeHelp = function () {
            $('body').removeClass('help-open');
        };
        Main.prototype.gotoPath = function (data) {
            var _this = this;
            this.collapsePathOnMobile();
            var link = (data.link.charAt(0) == '/') ? data.link : (this.basePath + data.link);
            if (data.isDir) {
                var $div = $('<div>');
                $div.load(link + '?xhr=true .autolisting-container', function () {
                    if ($div.find('.autolisting-table').length == 0) {
                        _this.openPath(link);
                    }
                    else {
                        _this.viewModel.search('');
                        _this.viewModel.selectedIndex(0);
                        _this.viewModel.selectedItem(null);
                        _this.viewModel.items(Parser.parseTable($('.autolisting-table', $div)));
                        _this.viewModel.pathItems(Parser.parsePath($('.autolisting-path', $div)));
                        _this.viewModel.selectedItem(_this.viewModel.filteredItems()[_this.viewModel.selectedIndex()]);
                        _this.basePath = $('.autolisting-path', $div).text();
                        if (_this.basePath.split('').pop() != '/') {
                            _this.basePath += '/';
                        }
                        history.pushState(null, document.title, _this.basePath);
                    }
                });
            }
            else {
                this.openPath(link);
            }
        };
        Main.prototype.openPath = function (path) {
            $('.listing').addClass('disabled');
            setTimeout(function () {
                document.location.href = path;
            }, 100);
        };
        Main.prototype.openNewPath = function (path) {
            window.open(path);
        };
        return Main;
    })();
    return Main;
});
