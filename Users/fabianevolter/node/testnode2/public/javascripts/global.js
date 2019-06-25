// Userlist data array for filling in info box
var userListData = [];

// DOM Ready =============================================================
$(document).ready(function() {

  // Populate the user table on initial page load
  setInterval(populateTable, 5)
  populateTable
  
  // Username link click
$('#userList table tbody').on('click', 'td a.linkshowuser', showUserInfo);

  // Add User button click
$('#btnAddUser').on('click', addUser);

  // Delete User link click
$('#userList table tbody').on('click', 'td a.linkdeleteuser', deleteUser);
});

// Functions =============================================================

// Fill table with data
function populateTable() {

  // Empty content string
  var tableContent = '';

  // jQuery AJAX call for JSON
  $.getJSON( '/users/userlist', function( data ) {
  // Stick our user data array into a userlist variable in the global object
  userListData = data.reverse();
  var count = "Number of contracts: " + userListData.length;

    // For each item in our JSON, add a table row and cells to the content string
    $.each(data,  function(){
      tableContent += '<tr>';
      tableContent += '<td><a href="#" class="linkshowuser" rel="' + this.idnumber + '">' + this.idnumber + '</a></td>';
      tableContent += '<td>' + this.date + '</td>';
      tableContent += '<td>' + this.product + '</td>';
      tableContent += '<td>' + this.quantity + '</td>';
      tableContent += '<td>' + this.price + '</td>';
      tableContent += '<td>' + this.ffdate + '</td>';
      tableContent += '<td>' + this.user + '</td>';
      tableContent += '</tr>';
    });

    // Inject the whole content string into our existing HTML table
    $('#userList table tbody').html(tableContent);

    //Inject count into html
    $('#count').html(count);
  });
};

function entrySuccess(){ 
  var success = "Order requested"
}

// Show User Info
function showUserInfo(event) {

  // Prevent Link from Firing
  event.preventDefault();

  // Retrieve username from link rel attribute
  var thisUserName = $(this).attr('rel');

  // Get Index of object based on id value
  var arrayPosition = userListData.map(function(arrayItem) { return arrayItem.idnumber; }).indexOf(thisUserName);

  // Get our User Object
  var thisUserObject = userListData[arrayPosition];

  //Populate Info Box
  $('#userIdNumber').text(thisUserObject.idnumber);
  $('#userInfoName').text(thisUserObject.date);
  $('#userInfoAge').text(thisUserObject.product);
  $('#userInfoGender').text(thisUserObject.quantity);
  $('#userInfoLocation').text(thisUserObject.price);
  $('#userInfoQuantity').text(thisUserObject.ffdate);
  $('#userInfoEmail').text(thisUserObject.location);
  $('#userInfoUsername').text(thisUserObject.user);


};

//Add User
function addUser(event) {
  event.preventDefault();

  //Super basic validation - increase errorCount variable if any fields are blank
  var errorCount = 0; 
  $('#addUser input').each(function(index,val) {
    if($(this).val() === '') {errorCount++; }
  });

  //Check and make sure errorCount's still at zero
  if (errorCount === 0) {



   //If it is, compile all user info into one object
    var newUser = {
      'idnumber': $('#addUser fieldset input#inputID').val(),
      'date': $('#addUser fieldset input#inputUserName').val(),
      'product':$('#addUser fieldset input#inputUserEmail').val(),
      'quantity':$('#addUser fieldset input#inputUserFullname').val(),
      'price': $('#addUser fieldset input#inputUserAge').val(),
      'user': $('#addUser fieldset input#inputName').val(),
      'ffdate':$('#addUser fieldset input#inputUserLocation').val(),
      'location':$('#addUser fieldset input#inputUserGender').val()
    }   


    // Use AJAX to post the object to out adduser service
    $.ajax({
      type: 'POST',
      data: newUser,
      url: '/users/adduser',
      dataType: 'JSON'
    }).done(function( response ) {

      // Check for sucessful (blank) response
      if (response.msg === '') {

        alert(
          'Order requested successfully.'
        ); 

        // Clear the form inputs
        $('#addUser fieldset input').val(''); 

        //Update the table
        populateTable();
      }
      else {

        // If something goes wrong, alert the error message that the service returned
        alert('Error: ' + response.msg)
      }
    });
    alert(
          'Order requested successfully.'
        );

  }
  else {
    // If errorCount is more than 0, error out
    alert('Please fill in all fields');
    return false;
  }
}; 


//Delete User
function deleteUser(event){

  event.preventDefault();

  //Pop up a confirmation dialog
  var confirmation = confirm('Are you sure you want to delete this user?');

  //Check and make sure the suer confirmed
  if (conformation === true) {

    // If they did, do our delete
    $.ajax({
      type: 'DELETE',
      url: '/users/deleteuser/' + $(this).attr('rel')
    }).done(function(response){

      //Check for a successful (blank) response
      if (response.msg === '') {
      }
      else {
        alert('Error: ' + response.msg);
      }

      //Update the table
      populateTable();
    })
  }
  else {

    //If they said no to the confirm, do nothing
    return false;
  }
};



