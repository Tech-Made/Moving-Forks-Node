(function() {
    var user_code = localStorage.getItem('user_code');
    var database = firebase.database();
    
    database.ref('AccessCode').once('value', snapshot => {
        if (snapshot) {        
            let accessCode = snapshot.val();
            // console.log("uc:",user_code);
            // console.log("ac",accessCode);
            if (user_code != accessCode) {
                window.location.replace('/login');
            }
            else {
                console.log("success");
            }
        }
        });
    init();
    
    function init(){     
      loadEventsList();      
    }
   

    function loadEventsList() {      
      database.ref('events').once('value', snapshot => {
	  
        if (snapshot) {
          var eventsArray = [];
          snapshot.forEach(function(childSnapshot) {
              var item = childSnapshot.val();
              item.eid = childSnapshot.key;
              eventsArray.push(item);
        });
        var html = "";
        eventsArray.forEach(function(item) {
            // console.log(item);
			var sold = item.ticketsSold;
			var total = item.total;
			var buttonHtml = "";
			if(total == sold){
				buttonHtml += '<button data-id="'+item.eid+'" class="card-date show-event-button">Sold out</button>';
			}else{
				buttonHtml += '<button data-id="'+item.eid+'" class="card-date show-event-button">RSVP</button>';
			}
			// console.log(buttonHtml);
            html += '<div class="full-card">'+
                    '<div class="card row" style="background:URL(\'../images/events/event1.jpeg\')"></div>'+
                    '<div class="card-info">'+
                        '<h1 class="card-title"><div class="date">'+item.date+'</div>'+
                            '<br>'+item.title+'</h1>'+
                        '<div class="cityndate">'+
                            '<div class="city"><div class="in">@&nbsp;</div>'+item.start+'</div>'+                        
                            buttonHtml +
                        '</div>'+
                    '</div>'+            
                '</div>';
               });
         
         $('#cardContainers').html(html);
            }
        });
    }

    $(document).on('click', '#cardContainers .show-event-button', function(){
        var eventid = $(this).attr('data-id');
        localStorage.setItem("showeventid",eventid);
        location.href='/event?id='+eventid;
    });
  

})();
