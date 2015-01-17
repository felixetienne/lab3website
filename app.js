/**
 * LabX Framework
 * Felix-Etienne Tetrault
 * Copyright 2014-2015
 */

(function(express, ejs, expressLayouts, dateFormat,
  imageWritingProcessor, routeHelpers, viewHelpers, config) {
  var app = express();
  var port = config.getCurrentPort();
  var root = __dirname;

  console.log('"LabX Framework" app is initialized at ' +
    dateFormat(Date.now()) + '.');

  app.use(expressLayouts);
  app.use(express.static(root + '/public'));
  app.set('views', root + '/views');
  app.set('view engine', 'ejs');
  app.set('layout', 'layout');

  var pages = viewHelpers.getStandardPages();
  for (var i = 0; i < pages.length; i++) {
    var p = pages[i];
    app.get('/' + p, routeHelpers.getRouteCallback(p));
  }

  var page = viewHelpers.getProjectsPage();
  app.get('/' + page + '/:name', routeHelpers.getRouteCallback(page, {
    isProjectCategoryPage: true
  }));

  var page = viewHelpers.getProjectPage();
  app.get('/' + page + '/:name', routeHelpers.getRouteCallback(page, {
    isProjectPage: true
  }));

  var page = viewHelpers.getEventPage();
  app.get('/' + page + '/:name', routeHelpers.getRouteCallback(page, {
    isEventPage: true
  }));

  app.listen(port, function() {
    console.info('NodeJs application is accessible at port ' + port + '.');
  });

  app.locals.root = root;

  imageWritingProcessor.process();

})(
  require('express'),
  require('ejs'),
  require('express-ejs-layouts'),
  require('dateformat'),
  require('./tasks/processors/imageWritingProcessor'),
  require('./core/scripts/modules/routeHelpers'),
  require('./core/scripts/modules/viewHelpers'),
  require('./core/scripts/modules/appConfig'),
  require('./core/scripts/modules/appCache'));
