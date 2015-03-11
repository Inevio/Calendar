// Constants
var BROWSER_FIREFOX = 0;
var BROWSER_IE = 1;
var BROWSER_WEBKIT = 2;
var BROWSER_TYPE = /webkit/i.test( navigator.userAgent ) ? BROWSER_WEBKIT : ( /trident/i.test( navigator.userAgent ) ? BROWSER_IE : BROWSER_FIREFOX );

// DOM variables
var win                     = $(this);
var createCalendarModal     = $('#create-calendar-modal');
var createEventModal        = $('#create-event-modal');
var colorToolbar            = $('.color-toolbar');
var colorPickerContainer    = $('.color-picker-container');
var arrow                   = $('.color-picker-container .arrow');
var colorPickerHover        = $('.color-picker-hover');
var colorPicker             = $('.color-picker');
var colorPickerColor        = $('.color-toolbar .color');

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
});
$('#create-event').on('click', function() {
    $('#shadow').show();
});
//Adds buttons functionality to open the menus
$('.my-calendars').on('click', function() {
    showMenu('#my-calendars-modal');
});
$('.create-event').on('click', function() {
    showMenu('#create-event-modal');
});
$('.add-new-calendar').on('click', function() {
    showMenu('#create-calendar-modal');
});
$('.create-event-modal-close').on('click', function() {
    showMenu('#create-event-modal');
});
$('.cancel-create-calendar-button').on('click', function() {
    showMenu('#create-calendar-modal');
});
$('.cancel-create-event-button').on('click', function() {
    showMenu('#create-event-modal');
});

//Color toolbar positioning
colorToolbar.on('click', function() {
    colorPickerContainer.toggle();
    colorPickerContainer
    .css({
        top     : $(this).offset().top + arrow.height(),
        left    : $(this).offset().left - win.offset().left,
    });
});

//Color toolbar hover color
colorPicker
    .on( 'mousedown', function( e ){
        e.stopPropagation();
    })
    .on( 'mouseenter', 'td', function(){
        var pos = $(this).position();
        if( BROWSER_TYPE === BROWSER_FIREFOX ){
            pos.top = pos.top - parseInt( colorPickerHover.css('border-top-width'), 10 );
            pos.left = pos.left - parseInt( colorPickerHover.css('border-left-width'), 10 );
        }
        colorPickerHover.css({
            'background-color' : $(this).css('background-color'),
            top : pos.top,
            left : pos.left
        });
})

colorPickerHover.on( 'click', function(){
    colorPickerColor
        .css( 'background-color', colorPickerHover.css('background-color') )
        .click();
    colorPickerContainer.css( 'display', 'none' );
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