(function(BaseRepository) {

  module.exports = function(pg, bricks, config) {
    var _base = new BaseRepository(pg, config);

    this.getPageByName = function(pageName, action, emptyAction) {

      if (_base.isInvalidAction(action)) return;

      _base.open(function(client) {

        var query =
          bricks
          .select(
            '\
						pages.title, \
            pages.description, \
            pages.doc_title, \
            pages.doc_description, \
            pages.doc_keywords, \
						pages.sorting, \
            pages.name'
          )
          .from('pages')
          .where('pages.name', pageName)
          .where('pages.active', true)
          .orderBy('pages.sorting ASC')
          .limit(1)
          .toString();

        client
          .query(query, function(err, res) {

            if (err) {
              _base.close(client);
              throw err;
            }

            if (_base.hasResults(res)) {
              var data = res.rows[0];
              action(data);
            } else if (typeof emptyAction === 'function') {
              emptyAction();
            }

            _base.close(client);
          });
      });
    }

    this.getMenuPages = function(action, emptyAction) {

      if (_base.isInvalidAction(action)) return;

      _base.open(function(client) {

        var query = bricks
          .select(
            '\
						pages.title_short, \
            pages.description_short, \
            pages.name, \
						pages.sorting'
          )
          .from('pages')
          .where('pages.active', true)
          .where('pages.menu', true)
          .orderBy('pages.sorting ASC')
          .toString();

        client
          .query(query, function(err, res) {

            if (err) {
              _base.close(client);
              throw err;
            }

            if (_base.hasResults(res)) {
              var data = new Array();

              res.rows.forEach(function(row) {
                data.push(row);
              });

              action(data);
            } else if (typeof emptyAction === 'function') {
              emptyAction();
            }

            _base.close(client);
          });
      });
    }
  }

})(require('./BaseRepository'));
