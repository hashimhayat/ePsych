
document.addEventListener("DOMContentLoaded", main);

function main() {

	var ref = firebase.database().ref("/Authorized");

    ref.on("value", function(snapshot) {

        document.getElementById('power-users').innerHTML = "";
        var usr_count = 1;
        snapshot.forEach(function(childSnapshot) {

            let childKey = childSnapshot.key;
            let childData = childSnapshot.val().date;
            del = `<img class="remove-user" id="${childKey}" onclick="removeUser(this)" src="../images/error.png">`
            document.getElementById('power-users').innerHTML += usr_count + ".  " + childKey + del + "<br>";
            usr_count++;
        });

    });

	// Adding a new Power User
	var netID = document.getElementById('netid');
	document.getElementById('add_netid').addEventListener('click', function (event) {
		
		event.preventDefault();

		if (netid.value != ""){
			console.log(netid.value);
			firebase.database().ref('Authorized/' + netid.value).set({
				date: Date.now()
			});
		}
    });

    // Session management
    var sessions = firebase.database().ref("/Settings/config/sessions");

    sessions.on("value", function(snapshot) {
        snapshot.forEach(function(childSnapshot) {
            let childKey = childSnapshot.key;
            let childData = childSnapshot.val();
            document.getElementById(childKey + "_session").innerHTML = childData;
        });
    });

    // Token management
    var token = firebase.database().ref("/Settings/config/token");

    token.on("value", function(snapshot) {
        document.getElementById("token_value").innerHTML = snapshot.val();
    });

}

// Remove a Power User
function removeUser(event){
	firebase.database().ref('Authorized/' + event.id).remove();
}

function session_update(module){
    var value = document.getElementById(module + "_sinput").value;

    if ( value != "" && !isNaN(value) ) {
    	firebase.database().ref("/Settings/config/sessions/" + module).set(value);
    }
}

function token_update(){

    var value = document.getElementById("token_input").value;

    if ( value != "" ) {
        firebase.database().ref("/Settings/config/token/").set(value);
    }
}












