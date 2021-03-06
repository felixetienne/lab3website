(function(bricks, BaseRepository, Error) {

  module.exports = function() {
    var _base = new BaseRepository();

    this.getErrors = function() {
      return _base.getErrors();
    }

    this.getBanners = function(client, options, action, emptyAction) {

      var query = bricks
        .select(
          '\
          banner_images.sorting, \
          images.name, \
          images.sorting as image_sorting, \
          projects.id as project_id, \
          projects.title as project_title, \
          projects.title_short as project_title_short, \
          projects.description_short as project_description_short, \
          projects.name as project_name, \
          projects.sorting as project_sorting, \
          project_categories.id as project_category_id, \
          project_categories.name as project_category_name, \
          project_categories.title as project_category_title, \
          project_categories.title_short as project_category_title_short, \
          events.id as event_id, \
          events.name as event_name, \
          events.title as event_title, \
          events.title_short as event_title_short, \
          events.description_short as event_description_short, \
          events.date as event_date, \
          events.sorting as event_sorting'
        )
        .from('banner_images')
        .innerJoin('images', {
          'images.id': 'banner_images.image_id'
        })
        .leftJoin('project_images', {
          'project_images.image_id': 'images.id'
        })
        .leftJoin('projects', {
          'projects.id': 'project_images.project_id'
        })
        .leftJoin('project_categories', {
          'project_categories.id': 'projects.category_id'
        })
        .leftJoin('event_images', {
          'event_images.image_id': 'images.id'
        })
        .leftJoin('events', {
          'events.id': 'event_images.event_id'
        });

      if (options.publishedOnly) {
        query = query
          .where('banner_images.published', true)
          .where('images.published', true);
      }

      query = query
        .where('banner_images.active', true)
        .where('images.active', true)
        .toString();

      query +=
        '\
        AND (\
          (projects.active = TRUE AND project_categories.active = TRUE)\
           OR \
          (projects.active IS NULL AND project_categories.active IS NULL)\
           OR \
          events.active = TRUE\
           OR \
          events.active IS NULL\
        )\
        ORDER BY \
        banner_images.sorting ASC, \
        image_sorting ASC, \
        project_sorting ASC, \
        project_categories.sorting ASC, \
        event_date DESC, \
        event_sorting ASC';

      _base.executeQuery(client, query, emptyAction, function(res) {
        var data = [];

        res.rows.forEach(function(row) {
          row.path = _base.buildImagePath(row);
          data.push(row);
        });

        action(data);
      });
    }

    this.getAll = function(client, options, action, emptyAction) {

      var query = bricks
        .select(
          '\
          images.title, \
          images.name, \
          images.id, \
          images.force_deploy, \
          images.sorting'
        )
        .from('images');

      if (options.publishedOnly) {
        query = query
          .where('images.published', true);
      }

      query = query
        .where('images.active', true)
        .where(bricks.isNotNull('images.content'))
        .orderBy('images.sorting ASC')
        .toString();

      _base.executeQuery(client, query, emptyAction, function(res) {
        var data = convertToData(res);

        action(data);
      });
    }

    this.getByIds = function(client, options, action, emptyAction) {

      var query = bricks
        .select(
          '\
          images.name, \
          images.sorting');

      if (options.includeRawData) {
        query = query.select('images.content');
      }

      query = query
        .from('images');

      if (options.publishedOnly) {
        query = query
          .where('images.published', true);
      }

      query = query
        .where('images.active', true)
        .where(bricks.isNotNull('images.content'))
        .toString();

      if (options.idsList) {
        var last = options.idsList.count() - 1;

        options.idsList.do(function(x, i) {
          query += (
            i === 0 ? ' AND (' : ' OR '
          ) + 'images.id = ' + x;
          if (i === last) query += ')';
        });
      }

      query += 'ORDER BY images.sorting ASC'

      _base.executeQuery(client, query, emptyAction, function(res) {
        var data = convertToData(res);

        action(data);
      });
    }

    function convertToData(res) {
      var data = [];

      for (var i = 0; i < res.rowCount; i++) {
        var image = res.rows[i];

        image.path = _base.buildImagePath(image);

        data.push(image);
      }

      return data;
    }
  }

})(
  require('sql-bricks-postgres'),
  require('./BaseRepository'),
  require('../Error'));
