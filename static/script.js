$( document ).ready(function() {
    //Adds each day-cell a clickable area to select the current day.
	$(".day-cell").on( "click", function() {
        selectDay($( this ));
    });
    $(".time-col").on( "click", function() {
        selectDay($( this ));
    });
	//Adds each top bar buttons functionalty to change between calendar types.
	$(".calendarType").on( "click", function() {
        selectCalendarType($( this ));
    });
    //Adds a shadow when opens these menus
    $('#add-new-calendar').on('click', function() {
        $('#shadow').show();
    })
    $('#create-event').on('click', function() {
        $('#shadow').show();
    })
    //Adds buttons functionality to open the menus
    $('.my-calendars').on('click', function() {
        showMenu('#my-calendars-modal');
    })
    $('.create-event').on('click', function() {
        showMenu('#create-event-modal');
    })
    $('.add-new-calendar').on('click', function() {
        showMenu('#create-calendar-modal');
    })
    $('.create-event-modal-close').on('click', function() {
        showMenu('#create-event-modal');
    })
    $('.cancel-create-calendar-button').on('click', function() {
        showMenu('#create-calendar-modal');
    })
    $('.cancel-create-event-button').on('click', function() {
        showMenu('#create-event-modal');
    })
    $('.event-color').on('click', function() {
        $('.color-picker-container').toggle();
        $('.color-picker-container').offset({ top: 239, left: 619 });
    })
    $('.calendar-color').on('click', function() {
        $('.color-picker-container').toggle();
        $('.color-picker-container').offset({ top: 301, left: 755 });
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
    var displayed = $(menu).css("display");
    if(displayed != "block"){
        $(menu).show(); 
    }else{
        $(menu).hide();
        $('#shadow').hide();
    }
}

//Adds a green area to the cell recieved.
function selectDay(cell){
    $(".day-selected").removeClass("day-selected");
    cell.addClass("day-selected");
    if(cell.hasClass("mon")){
        $(".monday").addClass("day-selected");
    }else if(cell.hasClass("tue")){
        $(".tuesday").addClass("day-selected");
    }else if(cell.hasClass("wed")){
        $(".wednesday").addClass("day-selected");
    }else if(cell.hasClass("thu")){
        $(".thursday").addClass("day-selected");
    }else if(cell.hasClass("fri")){
        $(".friday").addClass("day-selected");
    }else if(cell.hasClass("sat")){
        $(".saturday").addClass("day-selected");
    }else{
        $(".sunday").addClass("day-selected");
    }
}