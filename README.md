<!-- MarkdownTOC depth=0 autolink=true bracket=round -->

- [Overview](#overview)
- [Assumptions](#assumptions)
- [Problems it solves?](#problems-it-solves)
- [How does it solve them?](#how-does-it-solve-them)
- [Concepts](#concepts)
- [Directory Structure](#directory-structure)
- [Usage](#usage)
  - [Running the project](#running-the-project)
  - [Creating a sandbox.  Any sandbox.](#creating-a-sandbox--any-sandbox)
  - [Creating a Section](#creating-a-section)
  - [Creating a Component](#creating-a-component)
  - [Components + Sections](#components--sections)
    - [Include a Component in a Section](#include-a-component-in-a-section)
  - [Additional Scenarios with the at_collection Component](#additional-scenarios-with-the-at_collection-component)
    - [Create a collection](#create-a-collection)
    - [Include the Collection in a Section, then Add a Model](#include-the-collection-in-a-section-then-add-a-model)
    - [Include the Collection in a Nested Section](#include-the-collection-in-a-nested-section)

<!-- /MarkdownTOC -->


## [Overview](#overview)

The purpose of attend_sandbox is to make Angular code quick to learn, quick to
write, quick to debug, and quick to maintain.

## [Assumptions](#assumptions)
  
  - Adopting some of the Angular 2 patterns now will simplify migration to Angular2 and Web Components when user browsers support them.
  - Convention over configuration == good for productivity. (assuming overridable defaults)
  - Less code == less maintenance.
  - Decreased interfaces == increased stability. The more things that can break, will.
  - 20% of Angular is necessary to get 80% of work done. Hide unnecessary complexity.
  - Constraints == increased creativity + productivity. Infinite options paralyze
  - DRY construction becomes increasingly important as applications scale
  - Pit of success: Making bad practices easy for less experienced developers is a bad practice for experienced developers. Doing the right thing should be easy.
  - Consistent interfaces == increased stability. Passing anything anywhere produces bugs.
  
## [Problems it solves?](#problems)
  
  - Boilerplate: Angular requires a lot of boilerplate to create all its
  factories, services, modules, states, etc.
  - Confusing application phases: Config and run phases, and their separate
  providers/services are going away in Angular 2.0 for good reason.
  - Useless stack traces: Angular's $http stack traces are useless.
  - Silent Rejections: Unhandled promise rejections fail silently, leaving users wondering what happened, and developers wasting time.
  - Too many choices: Do we really need factories, services, values, constants,
  and providers to get our work done?
  - Even more choices: Angular's infinitely flexible directive definition objects are intimidating for newer devs.
  - Models: ... models?!  models?!! We don't need no freaking models!! Angular lacks extendable collections and models.
  - Lazy-loading: We don't need no freaking lazy loading of our app components!
  - More silence: Angular UI router often fails silently, wasting dev' time.
  - Unnecessary access: Injecting 20 arguments into 20 controllers requires they all have full access to each injected API with no way to limit access to only the parts needed, or even better, get only the necessary data.
  - State/route definition: States/routes only in the config phase often results in one massive file with all routes defined. Not modular. Overcoming it with separate angular modules requires keeping track of many dependencies.
  - Best practices == extra work: Techniques such as "controllerAs" to keep the scope clean and simplify inheritance are not baked into angular.  They require additional boilerplate and many examples without it on the web result in many devs not using it.
  - Code junkyards: Directory structures like angular-seed and the current generator-angular encourage unused code junkyards by requiring devs to remember many places to clean up a single component.
  - Naming chaos: Defining names for each module in the module, plus plus the names of modules and services where injected, plus all the directive and controllerAs instances, results in thousands of little details to track.
  - $rootScope == window: Global variables have been bad practice in javascript for years, and they live on angular's $rootScope.  See pit of success.


## [How does it solve them?](#solutions)
  - Boilerplate: Sandboxes handle all the boilerplate and module dependencies behind the scenes.
  - Confusing application phases: Only one now.  Just write code and go.
  - Useless stack traces: By incorporating bluebird, we get full stack traces and a faster promise implementation.
  - Silent Rejections: Bluebird catches unhandled rejections too.
  - Too many choices: There's just one entity. Sandboxes.
  - Even more choices: Following Angular 2.0's lead, attend_sandbox provides three types so that devs can get up to speed quicker.
  - Models: attend_sandbox provides some lightweight models and collections that are framework independent and can be swapped out.
  - Lazy-loading: Everything is in a sandbox, every sandbox can load async.
  - More silence: Angular UI router debugging built in.
  - Unnecessary access: Each sandbox requests what it needs. The mediator takes care of providing only what's necessary, with the ability to whitelist responses for different sandboxes.
  - State/route definition: Default states and routes are auto-created based on the the directory structure.  There's no need to create them.
  - Best practices == extra work: Not. Given a consistent directory structure, each section automatically generates a consistent naming structure for its own states, routes, controller names, directive names, etc.
  - Code junkyards: Everything needed for one module. Templates. LESS. States. Directives. Everything. All in one directory. Cleanup == `rm ./foo`. Done.
  - Naming chaos: Configurable auto-naming based on the directory structure handles naming conventions for the whole team.  Once set, there's nothing to maintain.  You never have to think about or even write them.  Just go.
  - $rootScope == window: With sandboxes and built-in controllerAs for all directives, it's easier to create variables bound intuitively to different scopes than it is to create global ones.

## [Concepts](#concepts)

  - State: An angular ui-router state
  - Section: A place within the application. Corresponds to ui-router state
  - Component: Reusable modules that provide utilities for sections and other modules. They enable everything that constants, values, providers, factories, and services do in vanilla Angular 1.3.
  - Directive: An Angular directive.  There are three types based on Angular 2: componentDirective, decoratorDirective, and templateDirective. For more on directive types, see the [Angular 2 design doc](https://docs.google.com/document/d/1f5VWROeTI2kJwVKbNsrHuEz5IqtZe14OpoxM9fEYJNU/edit#heading=h.m4vrrf92763l). Note: componentDirective are working.  I have not finished creating the factories for template and decorator directives yet.
  - Mediator: A design pattern that provides greater decoupling than publish/subscribe alone. app.js mediates all interactions between sandboxes.  For more details on a mediator in this context, see Nicholas Zakas talk on [Scalable Javascript Application Architecture](https://www.youtube.com/watch?v=b5pFv9NB9fs)
  - Sandbox: a wrapper around requirejs' `define()` function that provides a messaging interface for the code inside it to interact with other parts of the application. For more details, see sandbox.js.

## [Directory Structure](#directories)
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
  |-bower/              bower components
  |-components/         reusable components across sections of the site
    |-at_cat_model/     
      |- at_cat_model.js
                        A collection of cats models for the demo.
    |-simple/     
      |- simple.js      A simple component for the demo
    |-at_kitten_model/ 
      |- at_kitten_model.js
                        A collection of kittens models for the demo.
    |-at_collection/    (Swappable) collection/model factory that provides
                        methods to read, write, and extend collections/models. 
    |-at_http/          (Swappable) http module for our collections to use
      |- at_http/at_http.js
  |-sections/           auto-created ui-router states based on directory structure
    |- cats.js          auto-created state accessible at /cats/.  Requests data
                        from at_cat_model.js, or whatever it needs.
    |- cats.tpl.html    template for the cats state
    |- cats.spec.js     unit tests for the cats state code
    |- cats.less        cats state styling
  |-/vendor             other 3rd party code not in bower components
```

Note that all components are swappable for other code.

An example of why this is important: We can use $http, $resource, restangular,
or whatever to interact with the server. Instead we wrap them in an at_http sandbox to provide an api for only the http functionality we want, and we can swap it out for other libraries at any time.

Also, at_http and at_collections are separate because there is no good reason to tightly couple collections and endpoints. Database structures are unrelated to users' experience of the data they contain. To create great user experiences, front-end models need the flexibility to model experiences in addition to providing endpoint data containers.



## [Usage](#usage)

### [Running the project](#running)
[Install Node.js](http://nodejs.org/) (or `brew install node`), then:

```sh
(Note: on Windows, you can ignore the "sudo" part)
$ git clone git@github.com:AttendDotCom/sandbox.git    # copy repo to your computer
$ cd sandbox    # change to happathon directory
$ sudo npm -g install grunt-cli karma bower    # installs grunt-cli,karma,bower
$ npm install    # installs node dependencies in a /node_modules/ directory
$ bower install    # installs js/css dependencies in your /bower_components/ directory
$ grunt   # starts the dev environment
```
After typing ```grunt``` in your terminal, you should see grunt compile the app.
Click [http://127.0.0.1:9000](http://127.0.0.1:9000) to open the application in your default browser.

### [Creating a sandbox.  Any sandbox.](#creating-a-sandbox)

```js
sandbox(function(s){
  // ... do stuff here.
})
```

### [Creating a Section](#creating-a-section)

`app/sections/cat/cat.js`
```js
sandbox(function (s) {
  s.msg('componentDirective',{
    controller:function () {
      this.cat = {sound:'meow'};
    }
  });
});
```

`app/sections/cat/cat.tpl.html`
```html
<div>Cat says:</div>
<h3>{{appCat.cat.sound}}!!</h3>
```

### [Creating a Component](#creating-a-component)

`app/components/simple/simple.js`
```js
sandbox(function (s) {
  s.on('hi', function () {// listen for requests to components.simple.foo
    return 'Hi!';
  });
});
```

### [Components + Sections](#components-plus-sections)

#### [Include a Component in a Section](#include-component-in-section)

`app/sections/simple/simple.js`:
```js
sandbox(function (s) {
  s.msg('componentDirective',{
    resolve:function () {
      return s.msg('request components.simple.hi') // request the component
    },
    controller:function(simpleMessage){
      this.statement = simpleMessage;
    }
  });
});
```

`app/sections/simple/simple.tpl.html`
```html
Simple statement: {{appSimple.statement}}
```

note: `s.msg()` returns a promise, so returning it in a componentDirective's `resolve` function makes the section wait to render until the promise resolves.

### [Additional Scenarios with the at_collection Component](#at-collection)

#### [Create a collection](#create-a-collection)

`app/components/at_cat_model/at_cat_model.js`
```js
sandbox(function (s) {
  return s.msg('request components.at_collection.init',{
    name:'cat',
    modelDefaults:{
      sound:'meow',
      color:''
    }
  })
  .then(function (catsCollection) {
    s.on('cat_collection',function () {// listen for requests to cat_collection
      return catsCollection;
    });
  });
});
```

#### [Include the Collection in a Section, then Add a Model](#include-at-collection-in-section)
`app/sections/cat/cat.js`
```js
sandbox(function (s) {
  s.msg('componentDirective',{
    resolve:function () {
      return s.msg('request components.at_cat_model.cat_collection')
    },
    controller:function (catCollection) {
      catCollection.push({
        name:'fluffy',
        color:'calico',
        sound:'meow'
      });
      this.cat = catCollection[0];
    }
  });
});
```

`app/sections/cat/cat.tpl.html`
```html
<h3>Cat!</h3>
<ul>
  <li>name:{{appCat.cat.name}}</li>
  <li>sound:{{appCat.cat.sound}}</li>
  <li>color:{{appCat.cat.color}}</li>
</ul>
```

#### [Include the Collection in a Nested Section](#include-at-collection-in-section)

Haven't written this yet.  Check the demo to see it working.  Use a ui-view directive from UI router to specify where the nested template should go.

