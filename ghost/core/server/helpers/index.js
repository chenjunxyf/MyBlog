var hbs             = require('express-hbs'),
    _               = require('lodash'),
    Promise         = require('bluebird'),

    config          = require('../config'),
    errors          = require('../errors'),

    utils           = require('./utils'),

    coreHelpers     = {},
    registerHelpers;

// Pre-load settings data:
// - activeTheme
// - permalinks

if (!utils.isProduction) {
    hbs.handlebars.logger.level = 0;
}

coreHelpers.asset  = require('./asset');
coreHelpers.author  = require('./author');
coreHelpers.body_class  = require('./body_class');
coreHelpers.content  = require('./content');
coreHelpers.date  = require('./date');
coreHelpers.encode  = require('./encode');
coreHelpers.excerpt  = require('./excerpt');
coreHelpers.foreach = require('./foreach');
coreHelpers.ghost_foot = require('./ghost_foot');
coreHelpers.ghost_head = require('./ghost_head');
coreHelpers.is = require('./is');
coreHelpers.has = require('./has');
coreHelpers.meta_description = require('./meta_description');
coreHelpers.meta_title = require('./meta_title');
coreHelpers.page_url = require('./page_url');
coreHelpers.pageUrl = require('./page_url').deprecated;
coreHelpers.pagination = require('./pagination');
coreHelpers.plural = require('./plural');
coreHelpers.post_class = require('./post_class');
coreHelpers.tags = require('./tags');
coreHelpers.title = require('./title');
coreHelpers.url = require('./url');
coreHelpers.image = require('./image');
coreHelpers.tag_cloud = require('./tag_cloud');

coreHelpers.ghost_script_tags = require('./ghost_script_tags');

// ### Filestorage helper
//
// *Usage example:*
// `{{file_storage}}`
//
// Returns the config value for fileStorage.
coreHelpers.file_storage = function (context, options) {
    /*jshint unused:false*/
    if (config.hasOwnProperty('fileStorage')) {
        return _.isObject(config.fileStorage) ? 'true' : config.fileStorage.toString();
    }
    return 'true';
};

// ### Apps helper
//
// *Usage example:*
// `{{apps}}`
//
// Returns the config value for apps.
coreHelpers.apps = function (context, options) {
    /*jshint unused:false*/
    if (config.hasOwnProperty('apps')) {
        return config.apps.toString();
    }
    return 'false';
};

// ### TagsUI helper
//
// *Usage example:*
// `{{tags_ui}}`
//
// Returns the config value for tagsUI or false if no value present
coreHelpers.tags_ui = function (context, options) {
    /*jshint unused:false*/
    if (config.hasOwnProperty('tagsUI')) {
        return config.tagsUI.toString();
    }
    return 'false';
};

// ### Blog Url helper
//
// *Usage example:*
// `{{blog_url}}`
//
// Returns the config value for url.
coreHelpers.blog_url = function (context, options) {
    /*jshint unused:false*/
    return config.theme.url.toString();
};

coreHelpers.helperMissing = function (arg) {
    if (arguments.length === 2) {
        return undefined;
    }
    errors.logError('Missing helper: "' + arg + '"');
};

// Register an async handlebars helper for a given handlebars instance
function registerAsyncHelper(hbs, name, fn) {
    hbs.registerAsyncHelper(name, function (options, cb) {
        // Wrap the function passed in with a when.resolve so it can
        // return either a promise or a value
        Promise.resolve(fn.call(this, options)).then(function (result) {
            cb(result);
        }).catch(function (err) {
            errors.logAndThrowError(err, 'registerAsyncThemeHelper: ' + name);
        });
    });
}

// Register a handlebars helper for themes
function registerThemeHelper(name, fn) {
    hbs.registerHelper(name, fn);
}

// Register an async handlebars helper for themes
function registerAsyncThemeHelper(name, fn) {
    registerAsyncHelper(hbs, name, fn);
}

// Register a handlebars helper for admin
function registerAdminHelper(name, fn) {
    coreHelpers.adminHbs.registerHelper(name, fn);
}

registerHelpers = function (adminHbs) {
    // Expose hbs instance for admin
    coreHelpers.adminHbs = adminHbs;

    // Register theme helpers
    registerThemeHelper('asset', coreHelpers.asset);
    registerThemeHelper('author', coreHelpers.author);
    registerThemeHelper('content', coreHelpers.content);
    registerThemeHelper('title', coreHelpers.title);
    registerThemeHelper('date', coreHelpers.date);
    registerThemeHelper('encode', coreHelpers.encode);
    registerThemeHelper('excerpt', coreHelpers.excerpt);
    registerThemeHelper('foreach', coreHelpers.foreach);
    registerThemeHelper('is', coreHelpers.is);
    registerThemeHelper('has', coreHelpers.has);
    registerThemeHelper('page_url', coreHelpers.page_url);
    registerThemeHelper('pageUrl', coreHelpers.pageUrl);
    registerThemeHelper('pagination', coreHelpers.pagination);
    registerThemeHelper('tags', coreHelpers.tags);
    registerThemeHelper('plural', coreHelpers.plural);

    // Async theme helpers
    registerAsyncThemeHelper('body_class', coreHelpers.body_class);
    registerAsyncThemeHelper('ghost_foot', coreHelpers.ghost_foot);
    registerAsyncThemeHelper('ghost_head', coreHelpers.ghost_head);
    registerAsyncThemeHelper('meta_description', coreHelpers.meta_description);
    registerAsyncThemeHelper('meta_title', coreHelpers.meta_title);
    registerAsyncThemeHelper('post_class', coreHelpers.post_class);
    registerAsyncThemeHelper('url', coreHelpers.url);
    registerAsyncThemeHelper('image', coreHelpers.image);
    registerAsyncThemeHelper('tag_cloud', coreHelpers.tag_cloud);

    // Register admin helpers
    registerAdminHelper('ghost_script_tags', coreHelpers.ghost_script_tags);
    registerAdminHelper('asset', coreHelpers.asset);
    registerAdminHelper('apps', coreHelpers.apps);
    registerAdminHelper('file_storage', coreHelpers.file_storage);
    registerAdminHelper('tags_ui', coreHelpers.tags_ui);

    registerAdminHelper('blog_url', coreHelpers.blog_url);
};

module.exports = coreHelpers;
module.exports.loadCoreHelpers = registerHelpers;
module.exports.registerThemeHelper = registerThemeHelper;
module.exports.registerAsyncThemeHelper = registerAsyncThemeHelper;
module.exports.scriptFiles = utils.scriptFiles;
