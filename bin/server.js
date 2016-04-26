/**
 *
 * Created by xuzhongwei on 4/26/16.
 */

var app = require('../app');
var debug = require('debug')('home');
var server = app.listen(app.get('port'), function() {
    debug('Express server listening on port ' + server.address().port);
});


exports.server = server
