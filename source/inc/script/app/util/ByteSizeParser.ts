class ByteSizeParser
{
	private static _sizeMap = {
		'k': Math.pow(1024, 1),
		'm': Math.pow(1024, 2),
		'g': Math.pow(1024, 3),
		't': Math.pow(1024, 4)
	};

	private static _formatMap = {
		'empty': 'bytes',
		'k': 'KB',
		'm': 'MB',
		'g': 'GB',
		't': 'TB'
	}

	public static parse(size:string):number
	{
		return parseInt(size.toLowerCase()['replace'](/([\d.]+)(k|m|g|t)?/gmi, (match:string, size, multiplier):string =>
		{
			return (parseFloat(size) * ByteSizeParser._sizeMap[multiplier]).toString();
		}), 10);
	}

	public static format(size:string):string
	{
		return size.toLowerCase()['replace'](/([\d.]+)(k|m|g|t)?/gmi, (match:string, size, multiplier):string =>
		{
			return (size + ' ' + ByteSizeParser._formatMap[multiplier || 'empty']).toString();
		});
	}
}

export = ByteSizeParser;