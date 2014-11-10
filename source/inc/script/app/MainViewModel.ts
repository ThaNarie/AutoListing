///<reference path="../lib/definitions/definitions.d.ts" />

import ko = require('knockout');
import ByteSizeParser = require('app/util/ByteSizeParser');

class MainViewModel
{
	public controller:any;

	public commandQueue:Array<string> = [];
	public commandIndex:number = 0;

	public previousFilteredItemsLength:number = 0;
	public parentLink:string;
	public pathItems:KnockoutObservableArray<any>;
	public previousPathItems:KnockoutObservableArray<any>;
	public favs:Array<any>;
	public items:KnockoutObservableArray<any>;
	public search:KnockoutObservable<string>;
	public selectedIndex:KnockoutObservable<number>;
	public selectedItem:KnockoutObservable<any>;
	public activeFilter:KnockoutObservable<string>;
	public activeFilterDirection:KnockoutObservable<boolean>;
	public searchMode:KnockoutObservable<string>;

	public selectedSearchText:KnockoutComputed<string>;
	public filteredItems:KnockoutComputed<Array<any>>;
	public sortedItems:KnockoutComputed<Array<any>>;

	constructor(controller)
	{
		this.controller = controller;

		this.parentLink = '';
		this.favs = [
			{
				isDir: 	true,
				type: '[DIR]',
				name: 'MediaMonks projects',
				link: '/projects/mediamonks/',
				date: '',
				size: 0
			},
			{
				isDir: 	true,
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
		this.search = ko.observable<string>('');
		this.selectedIndex = ko.observable<number>(-1);
		this.selectedItem = ko.observable<number>(null);
		this.activeFilter = ko.observable<string>('type');
		this.activeFilterDirection = ko.observable<boolean>(true);
		this.searchMode = ko.observable<string>('search');

		this.selectedSearchText = ko.computed<string>(() =>
		{
			if (this.searchMode() != 'filter')
			{
				return this.search().length || this.selectedIndex() > 0 ? 'press "tab" or "enter" to select' : 'type to search - "Ctrl+Shift+F" to filter';
			}

			if (this.search() == '')
			{
				$('#search').css('padding-left', '');
				return 'type to filter';
			}

			if (this.filteredItems().length == 0)
			{
				$('#search').css('padding-left', '');
				return this.search() + ' - no results';
			}

			var text = this.filteredItems()[Math.max(0, Math.min(this.filteredItems().length - 1, this.selectedIndex()))].name;

			text = text.replace(new RegExp(this.search(), 'i'), '<span class="hidden">' + this.search() + '</span>') + ' - press "enter" to select';

			setTimeout(() =>
			{
				if (this.filteredItems().length == 0)
				{
					$('#search').css('padding-left', '');
					return;
				}

				$('#search').css('padding-left', $('.search-selected span').position().left + 'px');
				this.selectedIndex(Math.max(0, Math.min(this.filteredItems().length - 1, this.selectedIndex())));
			}, 1);

			return text;
		});

		this.sortedItems = ko.computed<Array<any>>(() =>
		{
			var filter = this.activeFilter();
			var dir = this.activeFilterDirection();

			var items = this.items();
			items.sort((a, b) =>
			{
				if (filter ==  'name')
				{
					if (a.name.toLowerCase() == b.name.toLowerCase()) return 0;
					return (a.name.toLowerCase() < b.name.toLowerCase() ? -1 : 1) * (dir ? 1 : -1);
				}
				else if (filter ==  'size')
				{
					if (a.sizeValue == b.sizeValue) return 0;
					return (a.sizeValue > b.sizeValue ? -1 : 1) * (dir ? 1 : -1);
				}
				else if (filter ==  'type')
				{
					if (a.name == '..' || b.name == '..')
					{
						return (a.name == '..' ? -1 : 1) * (dir ? 1 : -1);
					}
					else if (a.isDir && b.isDir)
					{
						if (a.name.toLowerCase() == b.name.toLowerCase()) return 0;
						return (a.name.toLowerCase() < b.name.toLowerCase() ? -1 : 1) * (dir ? 1 : -1);
					}
					else if (a.isDir || b.isDir)
					{
						return (a.isDir ? -1 : 1) * (dir ? 1 : -1);
					}
					else
					{
						if (a.ext == b.ext) return 0;
						return (a.ext < b.ext ? -1 : 1) * (dir ? 1 : -1);
					}
				}
				else if (filter == 'date')
				{
					if (a.dateValue == b.dateValue) return 0;
					return (a.dateValue < b.dateValue ? -1 : 1) * (dir ? 1 : -1);
				}

				return 1;
			});

			return items;
		});

		this.filteredItems = ko.computed<Array<any>>(() =>
		{
			if (this.search() == '' || this.searchMode() == 'search')
			{
				return this.sortedItems();
			}
			else
			{
				var dir = this.activeFilterDirection();

				var lSearch = this.search().toLowerCase();
				var filtered = this.sortedItems().filter((item) => {
					return item.name.toLowerCase().indexOf(lSearch) != -1;
				});

				filtered.sort((a, b) =>
				{
					var ia = a.name.toLowerCase().indexOf(lSearch);
					var ib = b.name.toLowerCase().indexOf(lSearch);

					if(ia == ib)
					{
						if (a.name.toLowerCase() == b.name.toLowerCase()) return 0;
						return (a.name.toLowerCase() < b.name.toLowerCase() ? -1 : 1) * (dir ? 1 : -1);
					}
					else
					{
						return ia < ib ? -1 : 1;
					}
				});

				return filtered;
			}
		});
	}


	public getSizeNumber(size)
	{
		return Math.min(50, Math.pow(size, 1 / 5));
	}

	public getDateNumber(date)
	{
		if (date == '')
		{
			return 0;
		}

		var secAway = moment().diff(moment(date)) / 1000;

		return Math.max(0, (100 - Math.pow(secAway, 1 / 2.5)) * 1.3);
	}

	public getSize(size)
	{
		return ByteSizeParser.format(size);
	}

	public getDate(date)
	{
		if (date == '')
		{
			return '';
		}

		return moment(date).fromNow();
	}

	public getIcon(data)
	{
		if (data.link == '..')
		{
			return 'parent';
		}
		else if (data.isDir)
		{
			return 'dir';
		}
		else
		{
			return 'file';
		}
	}
}

export = MainViewModel;