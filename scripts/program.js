function Program(proc)
{
	if(this.constructor === Program) throw new Error("Can't instantiate abstract Program class!");
	this.proc = proc;
}
//called by a process when the program is to be loaded
//be sure to override this in your child class
Program.prototype.init = function(argc, argv) { throw new Error("Abstract Method!"); };

//called by a process each 'tick' of the scheduler
//be sure to override this in your child class
Program.prototype.run = function() { throw new Error("Abstract Method!"); };

//called by a process when the process is ended
//be sure to override this in your child class
Program.prototype.del = function() { throw new Error("Abstract Method!"); };