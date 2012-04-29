(function()
{
	var loggingEnabled = false;
	try
	{
		loggingEnabled = !!console.log.apply;
	}
	catch(ex)
	{
	}

	var Levels =
	{
		NONE: 0,
		ERROR: 1,
		WARN: 2,
		INFO: 3,
		DEBUG: 4
	};

	var pad2 = function(arg)
	{
		var s = new String(arg);
		if(s.length < 2)
			s = "0"+s;
		
		return s;
	};

	var Logger = function(category)
	{
		this.category = category
		this.startTime = null;
	};

	Logger.prototype.append = function(/* levelName, level, arg1, arg2, ... */)
	{
		var levelName = arguments[0];
		
		var d = new Date();
		var buf = [];
		buf.push(d.getFullYear());
		buf.push("-");
		buf.push(pad2(d.getMonth()+1));
		buf.push("-");
		buf.push(pad2(d.getDate()));
		buf.push(" ");
		buf.push(pad2(d.getHours()));
		buf.push(":");
		buf.push(pad2(d.getMinutes()));
		buf.push(":");
		buf.push(pad2(d.getSeconds()));
		buf.push(".");
		buf.push(d.getMilliseconds());
		buf.push(" ["+levelName+"] ");
		buf.push(this.category);
		if(this.startTime)
		{
			var t = new Date().getTime()-this.startTime;
			buf.push((" ("+t+"ms)"));
			this.startTime = null;
		}
		buf.push(" -");
		
		var args = [buf.join("")];
		var argsLen = arguments.length;
		for(var i=2; i<argsLen; i++)
		{
			args.push(arguments[i]);
		}
		
		if(loggingEnabled)
			console.log.apply(console, args);
	};

	Logger.prototype.startTimer = function()
	{
		this.startTime = new Date().getTime();
	};

	var createLogMethod = function(key, val)
	{
		Logger.prototype[key.toLowerCase()] = function()
		{
			if(!loggingEnabled || val > phnq_log.level)
				return undefined;
			
			var args = [key, val];
			var argsLen = arguments.length;
			for(var i=0; i<argsLen; i++)
			{
				args.push(arguments[i]);
			}
			return this.append.apply(this, args);
		};
	};

	for(var key in Levels)
	{
		createLogMethod(key, Levels[key]);
	}

	var phnq_log =
	{
		level: Levels.NONE,

		Logger: Logger,

		setLevel: function(level)
		{
			this.level = Levels[level.toUpperCase()] || Levels.NONE;
		},

		exec: function(category, fn)
		{
	        var log = new Logger(category);
	        log.info("init logger");
	        fn(log);
		},

		getRelPath: function(src)
		{
			return require("path").relative(src, __filename);
		}
	};

	if(typeof(window) == "undefined")
		module.exports = phnq_log;
	else
		window.phnq_log = phnq_log;
})();
