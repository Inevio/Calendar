// CONSTANTS
var BROWSER_FIREFOX = 0;
var BROWSER_IE = 1;
var BROWSER_WEBKIT = 2;
var BROWSER_TYPE = /webkit/i.test( navigator.userAgent ) ? BROWSER_WEBKIT : ( /trident/i.test( navigator.userAgent ) ? BROWSER_IE : BROWSER_FIREFOX );

// VARIABLES
var febNumberOfDays = "";
var numOfDays = "";
var monthNames = ["January","February","March","April","May","June","July","August","September","October","November", "December"];
var dayNames = ["Sunday","Monday","Tuesday","Wednesday","Thrusday","Friday", "Saturday"];
var dayPerMonth = ["31","","31","30","31","30","31","31","30","31","30","31"];
//current date
var currentDate = new Date();
var currentYear = currentDate.getFullYear();
var currentMonth = currentDate.getMonth();
var currentDay = currentDate.getDay();
//date showing
var showingDate = new Date(monthNames[currentMonth]+' 1 ,'+currentYear);
var showingYear = showingDate.getFullYear();
var showingMonth = showingDate.getMonth();
var showingDay = showingDate.getDay();



console.log(numOfDays);

// DOM variables
var win                     = $(this);
var currentMonthDOM         = $('.current-month span');
var prevMonthDOM            = $('.current-month .prev');
var nextMonthDOM            = $('.current-month .next');
var createCalendarModal     = $('#create-calendar-modal');
var createEventModal        = $('#create-event-modal');
var createEvent             = $('.create-event');
var createCalendar          = $('.add-new-calendar');
var addEventButton          = $('.create-event-button');
var eventName               = $('.event-name input');

var colorToolbar            = $('.color-toolbar');
var colorPickerContainer    = $('.color-picker-container');
var arrow                   = $('.color-picker-container .arrow');
var colorPickerHover        = $('.color-picker-hover');
var colorPicker             = $('.color-picker');
var colorPickerColor        = $('.color-toolbar .color');
var eventPrototype          = $('.event.wz-prototype');


//Run code
initCalendar();

//Adds each day-cell a clickable area to select the current day.
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

createEvent.on('click', function() {
    showMenu('#create-event-modal');
    var eventDate = dayNames[getDaySelected().getDay()]+", "+getDaySelected().getDate()+"th of "+monthNames[showingMonth]+", "+showingYear;
    $('.event-when input').val(eventDate);
});

createCalendar.on('click', function() {
    showMenu('#create-calendar-modal');
});

addEventButton.on('click', function() {
    addEvent();
    showMenu('#create-event-modal');
});

$('.cancel-create-calendar-button').on('click', function() {
    showMenu('#create-calendar-modal');
});
$('.cancel-create-event-button').on('click', function() {
    showMenu('#create-event-modal');
});

//Adds buttons functionality to change month
nextMonthDOM.on('click', function() {
    if(showingMonth == 11){
        showingMonth = 0;
        showingYear++;
    }else{
        showingMonth++;
    }
    cleanCells();
    initCalendar();
});

prevMonthDOM.on('click', function() {
    if(showingMonth == 0){
        showingMonth = 11;
        showingYear--;
    }else{
        showingMonth--;
    }
    cleanCells();
    initCalendar();;
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

//Set the color picker to the color picked
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

// -- APP FUNCTIONALITY --

//Set all de calendar
function initCalendar(){
    if (showingMonth == 1){
        setFebDays();
    }
    numOfDays = dayPerMonth[showingMonth];
    setShowingDate();
    setCells();
    $( ".day-table td:eq("+(currentDate.getDate()-1)+")" ).addClass("day-selected");
}

//Determinate if February 28/29
function setFebDays(){
    if ( (showingYear%100!=0) && (showingYear%4==0) || (showingYear%400==0)){
        dayPerMonth[1] = "29";
    }else{
        dayPerMonth[1] = "28";
    }
}

//Set the showing date on the calendar header
function setShowingDate(){
    var dateText = monthNames[showingMonth]+" "+showingYear;
    currentMonthDOM.text(dateText);
}

//Set the primary state of the cells of the month view of the calendar
function setCells(){
    var nCells = 42;
    var nBlankCells = nCells - numOfDays;
    showingDate = new Date(monthNames[showingMonth]+' 1 ,'+showingYear);
    
    var prevNumOfDays = "";
    if(showingMonth == 0){
        prevNumOfDays = dayPerMonth[11];
    }else{
        prevNumOfDays = dayPerMonth[showingMonth-1];
    }
    
    var firstWeekDayOfMonth = showingDate.getDay();
    prevNumOfDays -= firstWeekDayOfMonth-1;
    for (i = 0; i < firstWeekDayOfMonth; i++) {
        $( ".day-table td:eq("+i+")" ).addClass("other-month-cell");
        $( ".day-table td:eq("+i+") span" ).text(prevNumOfDays++);
        nBlankCells--;
    }

    var dayCounter = 1;
    for (i = firstWeekDayOfMonth; i < nCells - nBlankCells; i++) {
        $( ".day-table td:eq("+i+") span" ).text(dayCounter++);
        $( ".day-table td:eq("+i+")" ).addClass("day-cell");
    }
    
    dayCounter = 1;
    for (i = nCells - nBlankCells; i < nCells; i++) {
        $( ".day-table td:eq("+i+")" ).addClass("other-month-cell");
        $( ".day-table td:eq("+i+") span" ).text(dayCounter++);
    }
    
    $(".day-cell").on( "click", function() {selectDay($( this ));});
}

//Clean all the cells of the month view of the calendar
function cleanCells(){
    for (i = 0; i < 42; i++) {
            $( ".day-table td:eq("+i+") span" ).text("");
            $( ".day-table td:eq("+i+") article" ).remove();
            $( ".day-table td:eq("+i+")" ).removeClass();
    }
    
}

function getDaySelected(){
    return new Date(monthNames[showingMonth]+' '+$('.day-selected span').text()+' ,'+showingYear);
}

function addEvent(){
    var daySelected = $('#month-calendar .day-selected');
    var event =  eventPrototype.clone();
    event.removeClass('wz-prototype');
    //toDo
    event.text(eventName.val())
    event.css('background-color', colorPickerColor.css('background-color'));
    if($(".day-selected article").length < 1){
        daySelected.append(event);
    }else{
        var moreEvents = $(".day-selected .moreEvents");
        if(moreEvents.length == 0){
            var moreEvents = eventPrototype.clone();
            moreEvents.removeClass('wz-prototype');
            moreEvents.addClass("moreEvents");
            moreEvents.text("1 more...");
            moreEvents.data('numEventsMore', 1)
            event.hide();
            daySelected.append(event);
            daySelected.append(moreEvents);
        }else{
            var numEventsMore = moreEvents.data('numEventsMore');
            numEventsMore++;
            moreEvents.data('numEventsMore', numEventsMore);
            moreEvents.text(numEventsMore+" more...");
            event.hide();
            daySelected.append(event);
            daySelected.append(moreEvents);
        }
    }
}