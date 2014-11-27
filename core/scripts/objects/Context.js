module.exports = function Context(){

    var _currentRequest = null;
    var _currentView = null;
    var _errorView = null;

    this.getConfig = function(){ return _appConfig; }
    this.getMap = function(){ return _viewsMap; }

    this.getCurrentRequest = function(){ return _currentRequest; }
    this.setCurrentRequest = function(value){
        _currentRequest = value;
        return this;
    }

    this.getErrorView = function(){ return _errorView; }
    this.setErrorView = function(value){
        _errorView = value;
        return this;
    }

    this.getCurrentView = function(){ return _currentView; }
    this.setCurrentView = function(value){
        _currentView = value;
        return this;
    }
}