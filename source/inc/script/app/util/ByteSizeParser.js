define(["require", "exports"], function (require, exports) {
    var ByteSizeParser = (function () {
        function ByteSizeParser() {
        }
        ByteSizeParser.parse = function (size) {
            return parseInt(size.toLowerCase()['replace'](/([\d.]+)(k|m|g|t)?/gmi, function (match, size, multiplier) {
                return (parseFloat(size) * ByteSizeParser._sizeMap[multiplier]).toString();
            }), 10);
        };
        ByteSizeParser.format = function (size) {
            return size.toLowerCase()['replace'](/([\d.]+)(k|m|g|t)?/gmi, function (match, size, multiplier) {
                return (size + ' ' + ByteSizeParser._formatMap[multiplier || 'empty']).toString();
            });
        };
        ByteSizeParser._sizeMap = {
            'k': Math.pow(1024, 1),
            'm': Math.pow(1024, 2),
            'g': Math.pow(1024, 3),
            't': Math.pow(1024, 4)
        };
        ByteSizeParser._formatMap = {
            'empty': 'bytes',
            'k': 'KB',
            'm': 'MB',
            'g': 'GB',
            't': 'TB'
        };
        return ByteSizeParser;
    })();
    return ByteSizeParser;
});
