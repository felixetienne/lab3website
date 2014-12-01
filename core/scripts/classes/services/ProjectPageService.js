(function(BasePageService, StatesMachine){

    module.exports = function (context, repositoriesFactory){

        var _base = new BasePageService(context);
        var _pagesRepository = repositoriesFactory.createPagesRepository();
        var _projectsRepository = repositoriesFactory.createProjectsRepository();
        var _websitesRepository = repositoriesFactory.createWebsitesRepository();

        this.getData = function(successAction, errorAction){
            var result = {};

            var onError = function (){
                if(statesMachine.hasError()) return;
                statesMachine.errorOccur();
                errorAction();
            }

            var onCompleted = function(x){

                if(statesMachine.hasError()) {
                    onError();
                    return;
                }

                var data = _base.getPageData(x);

                data.project = {
                    title: x.project.title,
                    shortTite: x.project.title_short,
                    description: x.project.description_short,
                    name: x.project.name,
                    image: {
                        title: x.project.image_title,
                        url: x.project.image_path
                    }
                };

                successAction(data);
            };

            var statesMachine = new StatesMachine(
                // tested object
                result,
                // object condition
                function(x){ return x.website && x.page && x.project && x.allPages; },
                // callback action
                function(x){ onCompleted(x); });

            _websitesRepository.getWebsiteProperties(context.getCurrentWebsiteName(), function(properties){
                statesMachine.tryCallback(function(x){ x.website = properties; })
            }, onError);

            _pagesRepository.getPageByName(_base.currentView, function(page){
                statesMachine.tryCallback(function(x){ x.page = page; });
            }, onError);

            _pagesRepository.getBasicPages(function(pages){
                statesMachine.tryCallback(function(x){ x.allPages = pages; });
            }, onError);

            _projectsRepository.getProjectByName(_base.currentRequest.params.name, _base.config.getImageFolder(), function(project){
                statesMachine.tryCallback(function(x){ x.project = project; });
            }, onError);
        }
    }

})(require('./BasePageService'),
   require('../StatesMachine'));