var pluginName = 'postcss-pxtorem-multi'

function getFinalOptions(from, opts) {
    var rules = opts.rules || [];
    validateRules(rules);
    var baseOpts = getBaseOpts(opts);
    var options = null;
    for (var i = 0; i < rules.length; i++) {
        var include = rules[i].include;
        var exclude = rules[i].exclude;
        var params = getOpts(rules[i]);

        if (validateRule(include, from, i, 'include') && !validateRule(exclude, from, i, 'exclude')) {
            options = params;
            break;
        }
    }

    if (!options && validateRule(baseOpts.include, from, -1, 'include') && !validateRule(baseOpts.exclude, from, -1, 'exclude')) {
        options = baseOpts;
    }
    return options;
}

function getOpts(opts) {
    var options = {};
    Object.keys(opts).forEach(function(key) {
        if (key !== 'rules' && key !== 'include' && key !== 'exclude') {
            options[key] = opts[key];
        }
    });
    return options;
}

function getBaseOpts(opts) {
    var options = {};
    Object.keys(opts).forEach(function(key) {
        if (key !== 'rules') {
            options[key] = opts[key];
        }
    });
    return options;
}

function validateRules(rules) {
    if (rules instanceof Array) {
        return true;
    }
    throw new Error('TypeError:Array is expected for attribute "rules" in ' + pluginName);
}

function validateString(include, from) {
    return from.indexOf(include) > -1;
}

function validateRegExp(rule, from) {
    return rule.test(from);
}

function validateArray(list, from, index, type) {
    var result = false;
    for (var i = 0; i < list.length; i++) {
        var rule = list[i];
        if (typeof rule === 'string') {
            result = validateString(rule, from);
        } else if (rule instanceof RegExp) {
            result = validateRegExp(rule, from);
        } else {
            var target = '';
            if (index === -1) {
                target = type;
            } else {
                target = 'rules[' + index + '].' + type + '[' + i + ']';
            }
            throw new Error('TypeError:String or RegExp is expected for attribute "' + target + '" in ' + pluginName);
        }
        if (result) {
            break;
        }
    }
    return result;
}

function validateRule(rule, from, index, type) {
    if (rule === undefined || rule === null) {
        return type === 'include';
    }
    if (typeof rule === 'string') {
        return validateString(rule, from);
    }
    if (rule instanceof RegExp) {
        return validateRegExp(rule, from);
    }
    if (rule instanceof Array) {
        return validateArray(rule, from, index, type);
    }
    var target = '';
    if (index === -1) {
        target = type;
    } else {
        target = 'rules[' + index + '].' + type;
    }
    throw new Error('TypeError:String , RegExp or Array is expected for attribute "' + target + '" in ' + pluginName);
}

module.exports = getFinalOptions;
