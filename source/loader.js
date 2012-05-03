var _           = require("underscore"),
    //_           = require("dd://modules/underscore/1.3.3/underscore"),
    jsResource  = require("./js-resource.json"),
    cssResource = require("./css-resource.json"),
    jsRule      = '' +
        '<script type="text/javascript"' +
            ' src="http://o.libdd.com/js/<%= name %>/<%= version %>/<%= file %>"' +
            '<% if (options.async) { %> async="async"<% } %>' +
            '<% if (options.defer) { %> defer="defer"<% } %>' +
        '><\/script>',
    cssRule     = '' +
        '<%= file.prefix %><link rel="stylesheet" type="text/css"' +
            ' href="http://o.libdd.com/css/<%= name %>/<%= version %>/<%= file.src %>"' +
            '<% if (file.media) { %> media="<%= file.media %>"<% } %>' +
        ' \/><%= file.suffix %>',
    jsTpl       = _.template(jsRule),
    cssTpl      = _.template(cssRule);

/**
 * 获取实际版本
 * 
 * @param  {Object} lib     库信息
 * @param  {string} version 输入版本
 * @return {string}         真实版本
 */
function getLibVersion(lib, version) {
    if (lib.aliases[version]) {
        version = lib.aliases[version];
    }
    return version;
}

/**
 * 获取Html
 * 
 * @param  {string} type    类型，css或js
 * @param  {string} name    库名称
 * @param  {string} version 版本
 * @param  {Object} opts    选项（可选）
 * @return {string}         生成的Html
 */
function getHtml(type, name, version, opts) {
    var options = _.isObject(opts) ? opts : {},
        fileType = options.compress === false ? "uncompressed" : "compressed",
        libObj, libItem, files, html = [],
        resource = type === 'css' ? cssResource : jsResource,
        tplFunc = type === 'css' ? cssTpl : jsTpl;

    if (name && version && resource[name]) {
        libObj = resource[name];
        version = getLibVersion(libObj, version);

        libItem = libObj.versions[version];
    }
    
    if (libItem) {
        files = libItem[fileType];

        if (_.isString(files)) {
            files = [ files ];
        }

        _.each(files, function(file) {
            html.push(tplFunc({
                name: name,
                version: version,
                file: file,
                options: options
            }));
        });
    }

    return html.join('');
}

exports.js = function(name, version, opts) {
    return getHtml('js', name, version, opts);
};

exports.css = function(name, version, opts) {
    return getHtml('css', name, version, opts);
}
