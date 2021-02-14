## Notaby - Your Note House
1. Using template with JS
2. Fast build websites with JQuery cards
3. Sort dictionary / object


## Path2.0 - A Code Chanllenge
1. Get the shortest Path -entry and exit are known, get the shortest path, return steps count.
	- Store current point
	- try on every direction and test if movable, mark as wall(unmovable), deadend(unmovable), passed, open
	- store all movable directions and sort
	- Not going back - if there is only one path, mark current as deadend and move to the next
	- Take shortest path - if there is more than one path, take the shortest path
	- Take the untaken path if closer - If there are more then one shortesst path, take the untaken path if both paths are closer than current point.
	- Take the old path if father - If there are more than one shortest path, take the path taken if both paths are farther than current point.
2. Entrance and Exit unknown, walk through
	- Loop through all directions find the open path (f);
	- mark current step as walked and move to the next step;
	- exit when eixt row reached.
