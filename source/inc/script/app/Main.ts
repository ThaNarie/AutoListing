///<reference path="../lib/definitions/definitions.d.ts" />

import ko = require('knockout');
import Parser = require('app/util/Parser');
import MainViewModel = require('app/MainViewModel');

class Main
{
	basePath:string;
	viewModel:MainViewModel;

	searchTimeout:number;

	constructor()
	{
		this.basePath = $('.autolisting-path').text();
		if (this.basePath.split('').pop() != '/')
		{
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

	private init()
	{
		this.viewModel.selectedIndex.subscribe((newValue) =>
		{
			var $selectedItem = $('.items li:nth-child(' + (this.viewModel.selectedIndex() + 1) + ')');
			if ($selectedItem.length > 0)
			{
				$(window).scrollTop($selectedItem.offset().top - $(window).height() + ($(window).height() / 3));
			}

			// keep item selected instead of the index
			this.viewModel.selectedItem(this.viewModel.filteredItems()[this.viewModel.selectedIndex()]);
		});

		this.viewModel.filteredItems.subscribe((newValue) =>
		{
			// if we filter down, always select top result
			if (newValue.length < this.viewModel.previousFilteredItemsLength)
			{
				this.viewModel.selectedIndex(0);
			}
			// if filtering down, update selectedIndex based on the current select item
			else if (this.viewModel.selectedItem())
			{
				this.viewModel.selectedIndex(this.viewModel.filteredItems().indexOf(this.viewModel.selectedItem()));
			}

			this.viewModel.previousFilteredItemsLength = newValue.length;
		});

		this.viewModel.pathItems.subscribe((newValue) =>
		{
			if (this.viewModel.pathItems().length < this.viewModel.previousPathItems().length)
			{
				var recentFolder = this.viewModel.previousPathItems.pop();
				var recentItem = this.viewModel.filteredItems().filter( item =>
				{
					return item.name == (recentFolder.name + '/');
				})[0];

				this.viewModel.selectedIndex(this.viewModel.filteredItems().indexOf(recentItem));
			}
			else
			{
				this.viewModel.selectedIndex(0);
			}

			this.viewModel.previousPathItems(this.viewModel.pathItems());
		});

		this.viewModel.search.subscribe((newValue) =>
		{
			if (newValue.length == 0 || this.viewModel.searchMode() != 'search')
			{
				return;
			}

			clearInterval(this.searchTimeout);
			this.searchTimeout = setTimeout(() =>
			{
				this.viewModel.search('');
				this.viewModel.commandIndex = 0;
			}, 2000);

			var searchValue = newValue.split('');
			//console.log(newValue);

			// check if we repeatedly pressed the first letter to cycle trough the results
			var reduced = searchValue.reduce((prev, current) =>
			{
				return prev == current ? prev : prev + current;
			});


			var options;

			// if cycle
			if (reduced.length == 1)
			{
				options = this.viewModel.sortedItems().filter((item) => {
					return item.name.toLowerCase().indexOf(reduced) == 0;
				});

				if (options[this.viewModel.commandIndex] == this.viewModel.selectedItem())
				{
					this.viewModel.commandIndex = (this.viewModel.commandIndex + 1) % options.length;
				}

				this.viewModel.selectedIndex(this.viewModel.filteredItems().indexOf(options[this.viewModel.commandIndex]));

				this.viewModel.commandIndex = (this.viewModel.commandIndex + 1) % options.length;
			}
			// if search, only select first hit
			else
			{
				this.viewModel.commandIndex = 0;

				options = this.viewModel.sortedItems().filter((item) => {
					return item.name.toLowerCase().indexOf(searchValue.join('')) == 0;
				});

				// if we have options, select the first occurrence, otherwise do nothing
				if (options.length > 0)
				{
					this.viewModel.selectedIndex(this.viewModel.filteredItems().indexOf(options[this.viewModel.commandIndex]));
				}
			}
		});

		$('body').on('keydown', (event) =>
		{
			var data = this.viewModel.filteredItems()[this.viewModel.selectedIndex()];

			//console.log(event);

			//  ctrl + backspace || shift + tab
			if (event.keyCode == 8 && event.ctrlKey || (event.keyCode == 9 && event.shiftKey))
			{
				this.gotoPath({isDir: true, link: '../'});
			}
			// shift + enter
			else if (event.keyCode == 13 && event.shiftKey)
			{
				this.openPath(this.basePath + data.link);
			}
			// alt + enter
			else if (event.keyCode == 13 && event.altKey)
			{
				this.openNewPath(this.basePath + data.link);
			}
			// tab || enter
			else if (event.keyCode == 9 || event.keyCode == 13)
			{
				if (event.keyCode == 9)
				{
					event.preventDefault();
				}

				if (this.viewModel.filteredItems().length == 0)
				{
					return;
				}

				this.gotoPath(data);

				event.preventDefault();
			}
			// escape
			else if (event.keyCode == 27)
			{
				this.viewModel.search('');
				this.viewModel.commandQueue = [];
				this.viewModel.commandIndex = 0;

				this.closeHelp();

				event.preventDefault();
			}
			// up
			else if (event.keyCode == 38)
			{
				this.viewModel.selectedIndex(Math.max(0, this.viewModel.selectedIndex() - 1));
				event.preventDefault();
			}
			// down
			else if (event.keyCode == 40)
			{
				this.viewModel.selectedIndex(Math.min(this.viewModel.filteredItems().length - 1, this.viewModel.selectedIndex() + 1));
				event.preventDefault();
			}
			// home
			else if (event.keyCode == 36)
			{
				this.viewModel.selectedIndex(0);
				event.preventDefault();
			}
			// end
			else if (event.keyCode == 35)
			{
				this.viewModel.selectedIndex(this.viewModel.filteredItems().length - 1);
				event.preventDefault();
			}
			// Ctrl + Shift + F
			else if (event.keyCode == 70 && event.ctrlKey && event.shiftKey)
			{
				clearInterval(this.searchTimeout);
				this.viewModel.search('');
				this.viewModel.commandIndex = 0;

				this.viewModel.searchMode(this.viewModel.searchMode() == 'search' ? 'filter' : 'search');

				event.preventDefault();
			}
			// Shift + /, ?
			else if (event.keyCode == 191 && event.shiftKey)
			{
				if ($('.help-open').length > 0)
				{
					this.closeHelp();
				}
				else
				{
					this.openHelp();
				}

				event.preventDefault();
			}
			else if (this.viewModel.searchMode() == 'search')// && String.fromCharCode(event.which).length == 1)
			{
				//this.viewModel.commandQueue.push(String.fromCharCode(event.which).toLowerCase());
				//console.log(this.viewModel.commandQueue.join(''));
			}
		});

		$('.listing').on('click', 'li a', (event) =>
		{
			if (event.ctrlKey)
			{
				return;
			}
			event.preventDefault();

			var data = ko.dataFor(<HTMLElement>event.currentTarget);

			this.gotoPath(data);
		});

		if (!isMobile)// && this.viewModel.searchMode() == 'filter')
		{
			$('#search').on('blur', (event) =>
			{
				setTimeout(() =>
				{
					$('#search').focus();
				}, 10);
			});
			$('#search').focus();
		}

		$('.sort').on('click', 'a', (event) =>
		{
			event.preventDefault();

			this.viewModel.activeFilterDirection(this.viewModel.activeFilter() != $(event.currentTarget).attr('data-filter') ? true : !this.viewModel.activeFilterDirection());

			this.viewModel.activeFilter($(event.currentTarget).attr('data-filter'));
		});

		$(window).on('scroll', (event) =>
		{
			if (isMobile)
			{
				return;
			}

			if ($('.favs').length == 0)
			{
				return;
			}

			if ($(window).scrollTop() > ($('.favs').offset().top + $('.favs').height() - $('.info').height()))
			{
				$('.search-wrapper').addClass('fixed');
				$('.content').addClass('fixed');
			}
			else
			{
				$('.search-wrapper').removeClass('fixed');
				$('.content').removeClass('fixed');
			}
		});

		$(window).on('mousemove', (event) =>
		{
			if (event.clientX > $(window).width() - 120)
			{
				$('.items').addClass('stats');
			}
			else
			{
				$('.items').removeClass('stats');
			}
		});

		$('.listing').removeClass('disabled');
	}

	onPathItemClick(vm, event)
	{
		this.gotoPath(vm);
	}

	expandPathOnMobile():void
	{
		$('.info').addClass('expanded');
	}

	collapsePathOnMobile():void
	{
		$('.info').removeClass('expanded');
	}

	openHelp():void
	{
		$('body').addClass('help-open');
	}

	closeHelp():void
	{
		$('body').removeClass('help-open');
	}

	gotoPath(data:any):void
	{
		this.collapsePathOnMobile();

		var link = (data.link.charAt(0) == '/') ? data.link : (this.basePath + data.link);

		if (data.isDir)
		{
			var $div = $('<div>');
			$div.load(link + '?xhr=true .autolisting-container', () =>
			{
				if ($div.find('.autolisting-table').length == 0)
				{
					this.openPath(link);
				}
				else
				{
					this.viewModel.search('');
					this.viewModel.selectedIndex(0);
					this.viewModel.selectedItem(null);
					this.viewModel.items(Parser.parseTable($('.autolisting-table', $div)));
					this.viewModel.pathItems(Parser.parsePath($('.autolisting-path', $div)));
					this.viewModel.selectedItem(this.viewModel.filteredItems()[this.viewModel.selectedIndex()]);

					this.basePath = $('.autolisting-path', $div).text();
					if (this.basePath.split('').pop() != '/')
					{
						this.basePath += '/';
					}

					history.pushState(null, document.title, this.basePath);

				}
			});
		}
		else
		{
			this.openPath(link);
		}
	}

	openPath(path:string):void
	{
		$('.listing').addClass('disabled');

		setTimeout(() =>
		{
			document.location.href = path;
		}, 100);
	}

	openNewPath(path:string):void
	{
		window.open(path);
	}
}

export = Main;