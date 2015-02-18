### Overview:

The purpose of attend_sandbox is to make Angular code quick to learn, quick to
write, quick to debug, and easy to maintain.

It builds on ideas from Nicholas Zakas' Scalable Javascript Application
Architecture, Angular 2.0, and AngularAMD.

# Assumptions
  - Convention over configuration == good for productivity. (with overridable defaults)
  - Less code == less maintenance.
  - Decreased interfaces == increased stability. The more things that can break, will.
  - Infinite flexibity == decreased productivity
  - 20% of Angular is necessary to get 80% of work done. Hide unnecessary complexity.
  - Constraints == increased creativity + productivity. Infinite options paralyze
  - DRY construction becomes increasingly important as applications scale
  - Pit of success: Making bad practices easy for inexperienced developers is a
    bad practice for experienced developers. Doing the right thing should be easy.

# Problems it solves?
  - Boilerplate: Angular requires a lot of boilerplate to create all its
  factories, services, modules, states, etc.
  - Confusing application phases: Config and run phases, and their separate
  providers/services are going away in Angular 2.0 for good reason.
  - Useless stack traces: Angular's $http stack traces are useless.
  - Silent Rejections: Unhandled promise rejections fail silently, leaving users
    wondering what happened, and developers wasting time.
  - Too many choices: Do we really need factories, services, values, constants,
  and providers to get our work done?
  - Even more choices: Angular's infinitely flexible directive definition objects
  are intimidating for newer devs.
  - Models: ... models?!  models?!! We don't need no freaking models!!
  - Lazy-loading: We don't need no freaking lazy loading of our app components!
  - More silence: Angular UI router often fails silently, wasting dev' time.
  - Unnecessary access: Injecting 20 arguments into 20 controllers requires they
    all have full access to each injected API with no way to limit access to
    only the parts needed, or even better, get only the necessary data.
  - State/route definition: States/routes only in the config phase often results
    in one massive file with all routes defined. Not modular. Overcoming it with
    separate angular modules requires keeping track of many dependencies.
  - Best practices == extra work: Techniques such as "controllerAs" to keep the scope
    clean and simplify inheritance are not baked into angular.  They require
    additional boilerplate and many examples without it on the web result in
    many devs not using it.
  - Code junkyards: Directory structures like angular-seed and the current
    generator-angular encourage unused code junkyards by requiring devs to
    remember many places to clean up a single component.
  - Naming chaos: Defining names for each module in the module, plus plus the
    names of modules and services where injected, plus all the directive and
    controllerAs instances, results in thousands of little details to track.
  - $rootScope == window: Global variables have been bad practice in javascript
    for years, and they live on angular's $rootScope.  See pit of success.


# How does it solve them?
  - Boilerplate: Sandboxes handle all the boilerplate and module dependencies
    behind the scenes.
  - Confusing application phases: Only one now.  Just write code and go.
  - Useless stack traces: By incorporating bluebird, we get full stack traces
    and a faster promise implementation.
  - Silent Rejections: Bluebird catches unhandled rejections too.
  - Too many choices: There's just one entity. Sandboxes.
  - Even more choices: Following Angular 2.0's lead, attend_sandbox provides
    three types so that devs can get up to speed quicker.
  - Models: attend_sandbox provides some lightweight models and collections that
    are framework independent and can be swapped out.
  - Lazy-loading: Everything is in a sandbox, every sandbox can load async.
  - More silence: Angular UI router debugging built in.
  - Unnecessary access: Each sandbox requests what it needs.  The mediator
    takes care of providing only what's necessary, with the ability to whitelist
    responses for different sandboxes.
  - State/route definition: Default states and routes are auto-created based on
    the the directory structure.  There's no need to create them.
  - Best practices == extra work: Not. Given a consistent directory structure,
    each section automatically generates a consistent naming structure for its
    own states, routes, controller names, directive names, etc.
  - Code junkyards: Everything needed for one module. Templates. LESS. States.
    Directives. Everything. All in the same directory. `rm ./foo` Done.
  - Naming chaos: Configurable auto-naming based on the directory structure
    handles naming conventions for the whole team.  Once set, there's nothing
    to maintain.  You never have to think about or even write them.  Just go.
  - $rootScope == window: With sandboxes and built-in controllerAs for all
    directives, it's easier to create variables bound intuitively to different
    scopes than it is to create global ones.

# Context
### Directory Structure
```
app
  |- sandbox.js         provides messaging to all sandboxes, and provides app.js with
                        the ability to supervise sandboxes' interaction.
  |- app.js             here lies the application core that decides how to meet the
                        requests of other parts, and provides sensible defaults for
                        many application responsibilities like routing.
  |- app.spec.js        unit tests for app.js
  |- app.tpl.html       the main app template
  |- app.less           main app styling
  |- index_preprocess.html
                        index.html before it gets any scripts or css added.
  |- index.html         index.html after grunt adds scripts and css.
  |- require-base_compiled.js
                        Loads all scripts. Gets created when grunt reads base.js
                        in /config/requirejs/ and adds additional modules based on
                        the application directory structure.
  |- templates_compiled.js
                        Angular templates compiled via html2js
  |-/bower              bower components
  |-/components         reusable components across sections of the site
    |-at_cat_model/     A collection of cats models.
    |-at_collection/    (Swappable) collection/model factory that provides methods
                        to read, write, and extend collections and models.
    |-at_http/          (Swappable) http module for our collections to use
  |-/sections           auto-created ui-router states based on directory structure
    |- cats.js          auto-created state accessible at /cats/.  Requests data
                        from at_cat_model.js, or whatever it needs.
    |- cats.tpl.html    template for the cats state
    |- cats.spec.js     unit tests for the cats state code
    |- cats.less        cats state styling
  |-/vendor             other 3rd party code not in bower components
```

Note that all components are swappable for other code.
An example of why this is important: We can use $http, $resource, restangular,
or whatever to interact with the server. at_http is separate from at_collections
because there is no good reason to tightly couple collections and endpoints.
Database structures have nothing to do with users' experience of the data they
contain. To create great user experiences, front-end models need the flexibility
to model experiences in addition to providing endpoint data storage.

#Usage

##Creating a sandbox.  Any sandbox.
```js
sandbox(function(s){
  ... do stuff here.
})
```
## Creating a section (gets automatically mapped to a UI router state):
### Plain section with a controller in app/sections/cat

app/sections/cat/cat.js
```js
sandbox(function (s) {
  s.msg('componentDirective',{
    controller:function () {
      this.cat = {sound:'meow'};
    }
  });
});
```
app/sections/cat/cat.tpl.html
```html
<div>Cat says:</div>
<h3>{{appCat.cat.sound}}!!</h3>
```

### Section that requests a collection and waits to render until it loads

app/sections/cat/cat.js
```js
sandbox(function (s) {
  s.msg('componentDirective',{
    resolve:function () {
      return s.msg('request components.at_cat_model.cat_collection')
    },
    controller:function (catCollection) {
      catCollection.add({
        name:'fluffy',
        color:'calico',
        sound:'meow'
      });
      this.cat = catCollection.modelsArray[0];
    }
  });
});
```
note: I'd like to redo the message parsing so we can just request cat_collection
      and let the mediator take care of knowing where it's coming from. Though
      the mediator can technically intercept all communications now, requesting
      only the resource name fits the pattern better and requires less typing.
      The challenge is that we don't know what responses the module offers until
      we request it. No way around that.  We have to request some aspect of the
      module.  We can for sure get rid of the "components." prefix though.

app/sections/cat/cat.tpl.html
```html
<h3>Cat!</h3>
<ul>
  <li>name:{{appCat.cat.name}}</li>
  <li>sound:{{appCat.cat.sound}}</li>
  <li>color:{{appCat.cat.color}}</li>
</ul>
```

####Creating a collection:

  The collection code is a swappable module that provides the ability to
  add custom methods and properties to models.

  More to come tomorrow.  It's relatively unimportant though.  As long as we
  provide a stable API through the mediator, we can swap any collection library.


References:
  Directory structure: https://github.com/yeoman/generator-angular/issues/109
  More coming...
