var readline = require('readline-sync');
var registered_users = {};


//Figure out a way to use a chart to display the data 
//Also keep track of how good the workout was 

//Use regex to filter through muscle_group input so that program can 
//suggest to the user if they have already inputted it in 
//Once suggested it will ask if they would like to put in the same workout template
//Once asked it won't ask again unless it's changed 
//WORKOUT TEMPLATE { workout_template: {}, used: 0 or 1}
//Used changes if the user uses the template at least once. If the user, after using the template
//decides to go with a different structure, then used will be set to 1 again and the user 
//will be asked if they want to use the same template once again. 


/*
WELCOME
	ENTER ID 
		IF ID GO TO MAIN MENU 
		IF NO ID GO TO USER CREATE 
	
	USER CREATE 
		ENTER NAME 
		SET UP WORKOUT PLAN 
		GO TO MAIN MENU 
	
	MAIN MENU 
		ADD NEW DAY OF WORKOUT PLAN 
		SHOW CURRENT PROGRESS 
			Yesterday 
			Last time muscle group was worked 
			the entire current week on a table 
		CHANGE WORKOUT PLAN 
		EXIT 
*/
/****************************************************************************************
*
*									PROGRAM INTERFACE
*
****************************************************************************************/
function start() {
	var name_input = readline.question("What's your name? "); 
	var key = make_user_name_key(name_input); 
	var user_is_found = look_up_user_name(key); 
	
	if(user_is_found) {
		var password_check = check_for_password(registered_users[key]); 
		if(password_check) 
			return main_menu(registered_users[key]); 
		else 
			console.log("Good-bye! Stay Healthy!");
			
	}
	else {
		var create_account = readline.question("Do you want to create an account? (Y/N): ");
		if(create_account[0].toUpperCase() == 'Y') 
			create_user(key, name_input); 
		else 
			console.log("Good-bye! Stay Healthy!");
		//return main_menu(); 
	}
}

function main_menu(user) {
	//console.log(user);
	
	console.log("\n1. Add workout day"); 
	console.log("2. Show progress"); 
	console.log("3. Exit Program\n"); 
	var choice = readline.question("What would you like to do? "); 

	if(choice == 1) {
		console.log("");
		user.add_new_workout(); 
		return main_menu(user); 
	}
	
	if(choice == 2) {
		if(user.progress.length == 0) 
			console.log("You have yet to input any workout days!"); 
		else
			console.log(user.progress); 
		
		return main_menu(user); 

	}
	
	if(choice == 3) {
		console.log("Good-bye! Stay Healthy!"); 
		return; 
	}
	
}


function check_for_password(user) {
	var tries = 0; 
	var the_same = false;
	var password = user.password; 

	while(tries < 3){
		var confirm_password = readline.question("Password: "); 
		for(i = 0; i < password.length; i++) {
			if(password[i] == confirm_password[i]) 
				the_same = true; 
			else {
				console.log("Error: Passwords did not match"); 
				break; 
			}
		}
		
		if(the_same == true) 
			break; 
			
		tries++; 
	}
	
	return the_same; 
}



/****************************************************************************************
*
*									CHECK FOR USER NAME 
*
****************************************************************************************/
function look_up_user_name(key) {	
	if (key in registered_users) 
		return true; 
		
	return false;
}

function make_user_name_key(name_input) {
	var key = 0; 
	for(var i = 0; i < name_input.length; i++) {
		key = key + name_input.charCodeAt(name_input.length - i - 1)* Math.pow(2, i); 
	}
	return key; 
}

function create_user(key) {
	var first_name = readline.question("First Name: "); 
	var last_name = readline.question("Last Name: "); 
	var full_name = first_name + " " + last_name;
	
	var password = create_password(); 
	
	registered_users[key] = new User(full_name, password);
	console.log("Welcome " + full_name + "! You successfully registered!"); 
		
	return main_menu(registered_users[key]); 	
}

function create_password() {
	var the_same = false;

	while(!the_same){
		var password = readline.question("Enter password: "); 
		var confirm_password = readline.question("Re-enter password: "); 
		the_same = confirm_password_creation(password, confirm_password); 
	}
	
	return password; 
}

function confirm_password_creation(password, confirm_password ) {
	var the_same = false; 
	
	for(i = 0; i < password.length; i++) {
		if(password[i] == confirm_password[i]) 
			the_same = true; 
		else {
			console.log("Error: Passwords did not match"); 
			break; 
		}
	}
	
	return the_same; 
}
/****************************************************************************************
*
*									USER CREATION 
*
****************************************************************************************/

var User = function(name, password) {
	this.password = password; 
	this.name = name; 
	this.progress = {};
}

/****************************************************************************************
*
*									ADD WORKOUT  
*
****************************************************************************************/

User.prototype.add_new_workout = function() {
	var date = this.get_date(); 

	var muscle_group = readline.question("Muscle group: "); 


	var number_of_exercises = readline.question("How many exercises? "); 
	
	
	var exercises = this.track_sets_reps_and_lbs(number_of_exercises); 

	var object = {"muscle_group": muscle_group, "exercises": exercises}

	this.progress[date] = object; 
	
	return; 
}

User.prototype.get_date = function() {
	var date = this.get_date_for_workout(); 
	console.log("Date: " + date ); 
	this.progress[date] = {};

	return date; 
}
User.prototype.user_change_date = function() {
	var monthNames = [
  		"January", "February", "March",
  		"April", "May", "June", "July",
  		"August", "September", "October",
  		"November", "December"
	];
	
	
	return changed_date; 
}

User.prototype.get_date_for_workout = function() {
	var monthNames = [
  		"January", "February", "March",
  		"April", "May", "June", "July",
  		"August", "September", "October",
  		"November", "December"
	];

	var date = new Date();
	var day = date.getDate();
	var monthIndex = date.getMonth();
	var year = date.getFullYear();
	
	var date_string = day + ' ' + monthNames[monthIndex] + ' ' + year; 
	return date_string; 
}

User.prototype.track_sets_reps_and_lbs = function (number_of_exercises) {
	var exercises_array = {}; 
	var number_of_sets = readline.question("How many sets did you do for each exercise? "); 
	var number_of_reps = readline.question("How many reps did you do for each exercise? "); 

		for( i = 0; i < number_of_exercises; i++) {
			var exercise_name = readline.question("Exercise " + (i+1) + ": "); 
			console.log(exercise_name + " (" + number_of_sets + "x" + number_of_reps + ")"); 
			var array = []; 
			for(j = 0; j < number_of_sets; j++) {
				console.log("Set " + (j+1));
				
				var lbs = readline.question("	lbs: ");
				array.push(lbs); 
				var rep = readline.question("	reps: ");
				array.push(rep);  
				
			}
			
			exercises_array[exercise_name] = array; 
		}
	
	return exercises_array; 
		
}

User.prototype.show_progress = function() {
	console.log(this.progress); 
	return main_menu(this); 
	
}
/****************************************************************************************
*
*									MAIN
*
****************************************************************************************/

var key = make_user_name_key("Rainier Go"); 
var hello = new User("Rainier Go", "GOOGLE123"); 
registered_users[key] = hello; 
start(); 
