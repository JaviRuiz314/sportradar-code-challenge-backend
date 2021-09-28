# Sportradar code challenge

## Description
This middleware has been designed to retrieve the latest five matches from a certain list of tournaments and returning them in descending order by their
play date and with its information parsed so it is readable by a series of widgets or a human person.

## API
To use this app, you need to call to the following API route

  1. **"/getlatestmatchesbytournament"**
     - **Method type**: GET
     
	 This, will return the last five matches grouped by tournament. To sort them, it uses the merge algorithm, in which an array its subdivided recursevely unitl it is on its minimum expression of two elements, sorts them, and when it is done, merge all the subarrays. To sort them by play date, it uses the "uts" field. It also normalizes the the data, so you should expect a response similar to this:
	    ```
      { 
        'tournament_1': 
		[
			{
				time: {
					time: 'Time the game was played',
					date: 'Date the game was played'
				},
				teams: {
					away: 'Name of the away team',
					home: 'Name of the home team'
				},
				score: {
					away: 'Score of the away team by the end of the match',
					home: 'Score of the home team by the end of the match'
				},
				events: 'Events of the match
		}, {
			....
		},
		...
		],
        'tournament_2': [...],
		.
		.
		.
	 }    
      ```

## Downloads and hosting

### Docker compose version

The app is fully Dockerize along with a simple widget, so you should be able to clone the repository of both of them as well as the docker-compose file
and run the following commands to test it:

  1. docker compose build 
  2. docker compose up

It would then be listening on the url: 'http://localhost:4200' the port is an environment variable, so you can customize it, but be aware that you would need
to modify the widget configuration as well.

### Stand-alone version

The middleware however, also works on an stand-alone version, to do so, you just need to clone the repository and run the following commands:
  
  1. npm install
  2. npm run start

Take into account that, running it on your local machine in this fashion, would require you to create ".dotenv" file on the root directory of the project
so you can set the environment variable "PORT". Then the middleware will be listening on that port so you can use your favourite API client to send requests,
or your browser.