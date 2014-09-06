Desoot
======

### A Looptopian desert, surrounded by impassable mountains.




Workflow
--------

This project uses the [oe-flow](https://github.com/loopdotcoop/oe-flow) development workflow, which 
is built on [git-flow](https://github.com/nvie/gitflow/wiki) and 
[Semantic Versioning 2.0.0](http://semver.org/).




Meteor Packages
---------------

1. `standard-app-packages` should already be installed, and makes up the core Meteor stack:
  - __meteor__          Meteor.isServer! The CSS extension handler! And so much more!
  - __webapp__          A standard Meteor app is a web app (which defines the 'main' function).
  - __logging__         It's Log! It's better than bad, it's good!
  - __deps__            Deps.autorun and friends. What's Meteor without reactivity?
  - __session__         The easiest way to get a little reactivity into your app.
  - __livedata__        DDP: Meteor's client/server protocol.
  - __mongo-livedata__  You want to keep your data somewhere? How about MongoDB?
  - __ui__              Meteor UI!
  - __spacebars__       A great template language!
  - __templating__      Turn templates into views!
  - __check__           Easy type assertions? check.
  - __underscore__      _.isUseful(true)
  - __jquery__          $(".usefulToo")
  - __random__          Life isn't always predictable.
  - __ejson__           People like being able to clone objects.
  - __reload__          We can reload the client without messing up methods in flight.
  - __autoupdate__      And update automatically when new client code is available!

2. `less` is the dynamic stylesheet language. All files with the ‘.less’ extension are converted to 
CSS, minified, bundled, and sent ot the client:  
`$ mrt add less`




Atmosphere Packages
-------------------

### `$ mrt add iron-router`  

__iron-router:__ Routing specifically designed for Meteor.  
Run `$ mrt add iron-router` to use this directly, even though it’s been installed by `accounts-templates-core`.  
`iron-layout`

__iron-layout:__ Dynamic layouts which enable rendering dynamic templates into regions on a page.  
`blaze-layout`
`iron-dynamic-template`
`iron-core`

__blaze-layout:__ A Blaze powered layout component for dynamic rendering.  
_No dependencies._

__iron-dynamic-template:__ Dynamic templates and data contexts.  
`iron-core`

__iron-core:__ Iron namespace and utilities.  
_No dependencies._


### `$ mrt add handlebar-helpers`  

__handlebar-helpers:__ [Handlebar helpers](https://github.com/raix/Meteor-handlebar-helpers).  
_No dependencies._





Changelog
---------

See ‘about/about.config.js’.