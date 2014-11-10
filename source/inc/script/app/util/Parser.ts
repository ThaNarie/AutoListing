///<reference path="../../lib/definitions/definitions.d.ts" />

import ByteSizeParser = require('app/util/ByteSizeParser');

class Parser
{
	constructor()
	{
	}

	public static parseTable($el):Array<any>
	{
		var items = [];
		var rows = $('tr', $el).toArray();

		// skip headers
		rows = rows.slice(1);

		// parent dir
		var first = rows.shift();

		// rows
		rows.forEach( row =>
		{
			var fields = $('td', row).toArray();

			var itm = {
				isDir: 	$('img', fields[0]).attr('alt') == '[DIR]',
				type: $('img', fields[0]).attr('alt'),
				name: $('a', fields[1]).text().trim(),
				label: $('a', fields[1]).text().trim(),
				link: $('a', fields[1]).attr('href').trim(),
				date: $(fields[2]).text().trim(),
				size: $(fields[3]).text().trim(),
				sizeValue: 0,
				dateValue: 0,
				ext: ''
			};
			console.log(itm.name);

			itm.ext = itm.name.split('.').pop().toLowerCase();

			itm.sizeValue = ByteSizeParser.parse(itm.size);

			if (itm.date != '')
			{
				itm.dateValue = moment().diff(moment(itm.date));
			}

			items.push(itm);
		});

		return items;
	}

	public static parsePath($el):Array<any>
	{
		var path = $el.text();
		if (path.split('').pop() == '/')
		{
			path = path.substr(0, path.length - 1);
		}
		var pathItems:Array<string> = path.split('/');

		pathItems[0] = 'root';
		var link = '/';

		return pathItems.map( (item, index) =>
		{
			if (index == 0)
			{
				return {
					name: item,
					label: 'root',
					link: link,
					isDir: true
				}
			}
			else
			{
				link += item + '/';
				return {
					name: item,
					label: item,
					link: link,
					isDir: true
				}
			}
		});
	}
}

export = Parser;