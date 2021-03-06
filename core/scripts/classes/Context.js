(function(config) {

  module.exports = function() {
    var _currentWebsite = null;
    var _currentRequest = null;
    var _currentPage = null;
    var _currentView = null;
    var _errorView = null;
    var _includesDraft = false;

    this.includesDraft = function(value) {
      if (value === true || value === false) {

        _includesDraft = value;

        return this;
      };

      return _includesDraft;
    }

    this.getCurrentWebsite = function() {
      return _currentWebsite;
    }
    this.setCurrentWebsite = function(value) {
      _currentWebsite = value;
      return this;
    }

    this.getCurrentRequest = function() {
      return _currentRequest;
    }
    this.setCurrentRequest = function(value) {
      _currentRequest = value;
      return this;
    }

    this.getCurrentPage = function() {
      return _currentPage;
    }
    this.setCurrentPage = function(value) {
      _currentPage = value;
      return this;
    }

    this.getCurrentView = function() {
      return _currentView;
    }
    this.setCurrentView = function(value) {
      _currentView = value;
      return this;
    }

    this.getErrorView = function() {
      return _errorView;
    }
    this.setErrorView = function(value) {
      _errorView = value;
      return this;
    }
  }

})(require('../modules/appConfig'));
