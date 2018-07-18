/*
 * Created by Hashim on 7/24/17.
*/

/*
    Functionality
    - The datacenter is basically the main view of the control panel for the application.
    It displays all the images present on the cloud database and shows some details about
    each image, for instance as small as which module was that image shown.

    - It also manages the side bar for creating a new app module image. The left side bar or
    the create bar is just used to create a new entry.
*/

var menuState = false;
var clickedEditMode = false;
var selected = {};
var snapshots = [];

// Detail Bar Items

var publishBtn = document.getElementById('publish');
var editBtn = document.getElementById('edit');
var basicInfo = document.getElementById('basic-info');
var modifyInfo = document.getElementById('modified');
var landmarkInfo = document.getElementById('landmarks');
var publishStatus = document.getElementById('state');
var typeSection = document.getElementById('type');
var analytics = document.getElementById('analytics');

document.addEventListener("DOMContentLoaded", main);

function main() {

    var menuBtn = document.getElementById("menu-btn");

    var container;
    var swipe_container = document.getElementById('swipe-container');
    
    menuBtn.addEventListener('mouseover', function () {
        if (!menuState) {
            showForm();
            menuBtn.style.transform = "rotate(90deg)";
            menuState = true;
        } else {
            hideForm();
            menuBtn.style.transform = "rotate(0deg)";
            menuState = false;
        }
        menuBtn.style.height = "60px";
        menuBtn.style.width = "60px";
    });

    menuBtn.addEventListener('mouseout', function () {
        menuBtn.style.height = "50px";
        menuBtn.style.width = "50px";
    });

    menuBtn.addEventListener('click', function () {

        if (!menuState) {
            showForm();
            menuState = true;
        } else {
            hideForm();
            menuState = false;
        }

    });

    publishBtn = document.getElementById('publish');
    editBtn = document.getElementById('edit');
    basicInfo = document.getElementById('basic-info');
    modifyInfo = document.getElementById('modified');
    landmarkInfo = document.getElementById('landmarks');
    publishStatus = document.getElementById('state');
    type = document.getElementById('type');
}

function backClicked(e) {
    window.history.back();
}

function openEditMode(){

    let request = $.ajax({
          type: 'POST',
          url: "landmarks/edit",
          data: selected,
          dataType: "json",
          success: function(res) {
            console.log(res.status);
            if (res.status == 200){
                window.location.replace("landmarks/edit");
            }
          },
          error: function(err){
            console.log(err);
          }
    });
}

function showForm() {

    document.getElementById("create-panel").style.height = "100%";
    document.getElementById("create-panel").style.width = "300px";
    document.getElementById("main").style.marginLeft = "300px";
    document.getElementById("menu-btn").style.marginLeft = "300px";
    document.getElementById('swipe-container').style.marginLeft = "300px";
    document.getElementById("search").style.marginLeft = "355px";
    document.getElementById("search").style.transition = "0.5s";
}

function hideForm() {

    document.getElementById("create-panel").style.width = "0px";
    document.getElementById("create-panel").style.height = "100%";
    document.getElementById("main").style.marginLeft= "25px";
    document.getElementById("menu-btn").style.marginLeft = "0px";
    document.getElementById('swipe-container').style.marginLeft = "25px";
    document.getElementById("search").style.marginLeft = "82px";

}

function deleteImage(){

    if (confirm("Are you sure that you want to permanently delete this image?") == true) {

        firebase.database().ref('Images/' + selected.id).remove().then(function (url) {
            firebase.database().ref(selected.module + '/' + selected.id).remove().then(function (url) {

                if (selected.module === "FMS"){
                    
                    firebase.storage().child('FMS/' + selected.id).delete().then(function() {
                        firebase.storage().ref('FMS_Thumbnail/' + selected.id).delete().then(function() {
                            Notify("File has been Deleted!")
                        });
                    });
               
                } else {
                    firebase.storage().ref('CentralStorage/' + selected.id).delete().then(function() {
                        Notify("File has been Deleted!")
                    });
                }
            });
        });

    } 
}

function updateStatus(){
    firebase.database().ref(selected.module + '/' + selected.id).update({publish: (selected.state === true ? false : true)});
}

function toogleCategory(_module, _id, _curr){

    clickedEditMode = true;
    var ncat = 'Practice';
    if (_curr === 'Practice') {
        ncat = 'Evaluation';
    }

    firebase.database().ref(_module + '/' + _id).update({category: ncat}).then(function (url) {
        
        // Update Element
        let node = document.getElementsByName(_module + '-' + _id)[0];
        node.id = ncat;
        node.innerHTML = `<p>${ncat}</p>`

        clickedEditMode = false;
    });
}

function showDetailsForm(id) {

    if (!clickedEditMode){

        selected.id = id;

        document.getElementById("form-section").style.height = "100%";
        document.getElementById("form-section").style.width = "25%";
        document.getElementById("main").style.marginLeft = "25%";

        var imageRef = firebase.database().ref("/Images/" + id + '/modules');
        var module = "";

        // Find Modules
        imageRef.on("value", function(snapshot) {
            
            module = snapshot.val()[0];
            selected.module = module;
            document.getElementById(selected.module.toLowerCase() + '-container').style.marginLeft = "25%";

            var state = "";

            // Go to each module and write information.
            var imageDetail = firebase.database().ref(module + '/' + id);

            imageDetail.on("value", function(snapshot) {
                
                let childData = snapshot.val();
                let token = "", title = "", createdBy = "", modifiedby = "", modifieddate = "", publish = false, type = "", state = "Not Published";

                switch(module) {
                    case 'Swipe':
                        token = snapshot.key;
                        title = childData.name;
                        type = childData.type_correct;
                        publish = childData.publish;
                        typeSection.innerHTML = `<b> Type <b>`;
                        landmarkInfo.innerHTML = type;
                        break;
                    case 'Landmarks':
                        token = snapshot.key;
                        title = childData.image;
                        publish = childData.publish;
                        createdBy = childData.contributor;
                        modifiedby = childData.modifiedby;
                        modifieddate = childData.modifieddate;
                        type = childData.tags;
                        typeSection.innerHTML = `<b> Landmarks <b>`;
                        landmarkInfo.innerHTML = `Contains: ${type}`;
                        selected.downloadURL = childData.downloadURL;
                        break;
                    case 'FMS':
                        token = snapshot.key;
                        title = "FMS Set";
                        publish = childData.publish;
                        createdBy = childData.contributor;
                        modifiedby = childData.modifiedby;
                        modifieddate = childData.modifieddate;
                        typeSection.innerHTML = `<b> Additional Information <b>`
                        break;
                }

                    basicInfo.innerHTML = `Title: ${title} <br> Created by: ${new Date(token * 1).toDateString()} <br> Token: ${token}`;
                    modifyInfo.innerHTML = `Last Modified by: ${modifiedby}<br>On: ${new Date(token * 1).toDateString()}`;

                    let i_analytics = get_iAnalytics(module, title);

                    selected.state = publish;

                    if (publish === true){
                        state = "Published";
                        publishBtn.innerHTML = "Withold";
                    } else {
                        state = "Not Published";
                        publishBtn.innerHTML = "Publish";
                    }

                    publishStatus.innerHTML = `${state}`; 
            });
        });
    }
}

function get_iAnalytics(module, image_name){
    var i_ref = firebase.database().ref("/iAnalytics/" + module + "/" + image_name);

    var seen = 0;
    var correct = 0; var c_percent = 0;
    var incorrect = 0; var ic_percent = 0;
    var mean_engagement = 0; var last_seen = "";

    i_ref.on("value", function(snapshot) {
        snapshot.forEach( function(childSnapshot) {

            let childKey = childSnapshot.key;
            let childData = childSnapshot.val();
            
            if (childData.correctness === true){ correct++; } else { incorrect++; }

            mean_engagement += childData.time;
            last_seen = childData.timestamp;
            seen++;
        });

        if (seen > 0) {
            mean_engagement = mean_engagement / seen;
            c_percent = (correct / seen) * 100;
            ic_percent = (incorrect / seen) * 100;      
        }

        analytics.innerHTML = `Seen: ${seen} times <br> Correct: ${correct} - ${c_percent.toFixed(0)}% <br> Incorrect: ${incorrect} - ${ic_percent.toFixed(0)}% <br> Mean Engagement: ${mean_engagement.toFixed(2)}s <br> Last Seen: ${last_seen}`;
    });
}

function Notify(notification) {
    var x = document.getElementById("snackbar")
    x.className = "show";
    x.innerHTML = notification;
    setTimeout(function(){ x.className = x.className.replace("show", ""); }, 3000);
}

function hideDetailsForm() {
    document.getElementById("form-section").style.width = "0";
    document.getElementById("main").style.marginLeft= "0";
    document.getElementById("form-section").style.height = "0";
    document.getElementById(selected.module.toLowerCase() + '-container').style.marginLeft = "0";

}