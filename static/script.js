$( document ).ready(function() {
    //Adds each day-cell a clickable area to select the current day.
	$(".day-cell").bind( "click", function() {
        selectDay($( this ));
    });
	//Adds each top bar buttons functionalty to change between calendar types.
	$(".calendarType").bind( "click", function() {
        selectCalendarType($( this ));
    });
    //Adds a shadow when opens these menus
    $('#add-new-calendar').on('click', function() {
            $('#shadow').show();
    })
    $('#create-event').on('click', function() {
            $('#shadow').show();
    })
});

//Displays de calendarType.
function selectCalendarType(calendarType){
	$(".calendar-active").removeClass("calendar-active");
	$(".active-type").removeClass("active-type");
	type = calendarType.attr("id");
	id = "#" + type;
	$(id).addClass("active-type");
	if(type == "dayType"){
		$("#day-calendar").addClass("calendar-active");
	}else if(type == "weekType"){
		$("#week-calendar").addClass("calendar-active");
	}else if(type == "monthType"){
		$("#month-calendar").addClass("calendar-active");
	}else{
		alert("CalendarTypeError");
	}	
}

//Display and hides this menu.
function showMenu(menu){
    var display = $(menu).css("display");
    if(display != "block"){
        $(menu).css("display","block"); 
    }else{
        $(menu).css("display","none");
        $('#shadow').hide();
    }
}

//Adds a green area to the cell recieved.
function selectDay(cell){
    $(".day-selected").removeClass("day-selected");
    cell.addClass("day-selected");
}