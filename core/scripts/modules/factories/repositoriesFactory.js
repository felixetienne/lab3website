(function(PagesRepository, ProjectsRepository){

    module.exports = (function(mod, pg, bricks, config){

        mod.createPagesRepository = function(){
            return new PagesRepository(pg, bricks, config);
        }

        mod.createProjectsRepository = function(){
            return new ProjectsRepository(pg, bricks, config);
        }

        return mod;

    })({},
       require('pg'),
       require('sql-bricks-postgres'),
       require('../appConfig'));

})(require('../../classes/repositories/PagesRepository'),
   require('../../classes/repositories/ProjectsRepository'));
