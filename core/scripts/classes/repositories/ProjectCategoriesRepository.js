(function(bricks, BaseRepository, Error) {

	module.exports = function() {
		var _base = new BaseRepository();
		var _imageFolder = _base.getConfig().getImageFolder();

		this.getErrors = function() {
			return _base.getErrors();
		}

		this.getProjectCategoryByName = function(client, options, action,
			emptyAction) {

			var query = bricks
				.select(
					'\
            project_categories.id, \
            project_categories.title, \
            project_categories.description_html, \
            project_categories.description_short, \
            project_categories.doc_description, \
            project_categories.doc_keywords, \
            project_categories.doc_title, \
            project_categories.keywords, \
            projects.id as project_id, \
            projects.title as project_title, \
            projects.title_short as project_title_short, \
            projects.description_short as project_description_short, \
            projects.name as project_name, \
            projects.date as project_date, \
            projects.sorting as project_sorting, \
            get_project_image_list(projects.id, \'thumbnail\') as project_image_list'
				)
				.from('project_categories')
				.leftJoin('projects', {
					'project_categories.id': 'projects.category_id'
				});

			if (options.publishedOnly) {
				query = query
					.where('project_categories.published', true)
					.where('projects.published', true);
			}

			query = query
				.where('project_categories.active', true)
				.where('project_categories.name', options.projectCategoryName)
				.toString();

			query +=
				' AND (projects.active IS NULL OR projects.active = TRUE) \
        ORDER BY \
        project_categories.sorting ASC, \
        project_sorting ASC';

			_base.executeQuery(client, query, emptyAction, function(res) {
				var data = [];

				res.rows.forEach(function(row) {

					row.project_images = _base.extractMedias(
						row.project_image_list, true);

					data.push(row);
				});

				action(data);
			});
		}

		this.getAllProjectCategories = function(client, options, action,
			emptyAction) {

			var query = bricks
				.select(
					'\
            project_categories.id, \
            project_categories.name, \
            project_categories.title, \
            project_categories.title_short, \
            project_categories.description_short, \
            projects.id as project_id, \
            projects.title as project_title, \
            projects.title_short as project_title_short, \
            projects.description_short as project_description_short, \
            projects.name as project_name, \
            projects.date as project_date, \
            projects.sorting as project_sorting, \
            get_project_image_list(projects.id, \'thumbnail\') as project_image_list'
				)
				.from('project_categories')
				.leftJoin('projects', {
					'project_categories.id': 'projects.category_id'
				});

			if (options.publishedOnly) {
				query = query
					.where('project_categories.published', true)
					.where('projects.published', true);
			}

			query = query
				.where('project_categories.active', true)
				.where('projects.active', true)
				.orderBy(
					'project_categories.sorting ASC',
					'project_sorting ASC'
				)
				.toString();

			_base.executeQuery(client, query, emptyAction, function(res) {
				var data = [];

				res.rows.forEach(function(row) {

					row.project_images = _base.extractMedias(
						row.project_image_list, true);

					data.push(row);
				});

				action(data);
			});
		}

		this.getMenuProjectCategories = function(client, options, action,
			emptyAction) {

			var query = bricks
				.select(
					'\
            project_categories.id, \
            project_categories.name, \
            project_categories.title, \
            project_categories.title_short, \
            project_categories.sorting'
				)
				.from('project_categories');

			if (options.publishedOnly) {
				query = query
					.where('project_categories.published', true);
			}

			query = query
				.where('project_categories.active', true)
				.orderBy('project_categories.sorting ASC')
				.toString();

			_base.executeQuery(client, query, emptyAction, function(res) {
				var data = [];

				res.rows.forEach(function(row) {
					data.push(row);
				});

				action(data);
			});
		}
	}

})(
	require('sql-bricks-postgres'),
	require('./BaseRepository'),
	require('../Error'));
