phnq_log
========
The phnq_log module is a simple logging utility. It's generic JavaScript, so
it works equally well on the server (node.js) and the client (browser).

Basic Usage
-----------

Import the phnq_log module:

	var phnq_log = require("phnq_log");

Or on the client just include the file.

Set the global logging level to one of none, error, warn, info, debug:

	phnq_log.setLevel("debug");

Create the logger:

	var logger = new phnq_log.Logger("MyCategory");

Do some logging:

	logger.debug("Hello!");

output:

	2012-04-21 10:07:30.920 [DEBUG] MyCategory - Hello!

Passing objects as arguments:

	var obj = { foo: "bar", num: 42 };
	logger.debug("Object is: ", obj);

output:

	2012-04-21 10:07:30.920 [DEBUG] MyCategory - Object is:  { foo: 'bar', num: 42 }


Scoping Convenience
-------------------

You probably want to create one logger per JavaScript file or block of
functionality. You probably also want to wrap your JavaScript file's
code in a self-executing function to limit the scope of locally
declared  variables.  For example:

	(function(){
		var x = 5;
		// x is only visible within this block.
	})();

With phnq_log you can do both in one convenient statement:

	phnq_log.exec("MyCategory", function(logger)
	{
		logger.debug("Hello!");
	});

Wrap each of your JavaScript files like this to get an individual logger for
each file.
