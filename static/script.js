'use strict'

// CONSTANTS
var BROWSER_FIREFOX = 0;
var BROWSER_IE = 1;
var BROWSER_WEBKIT = 2;
var BROWSER_TYPE = /webkit/i.test( navigator.userAgent ) ? BROWSER_WEBKIT : ( /trident/i.test( navigator.userAgent ) ? BROWSER_IE : BROWSER_FIREFOX );

// VARIABLES
var calendarView = 'month';
var febNumberOfDays = '';
var numOfDays = '';
var monthNames = ['January','February','March','April','May','June','July','August','September','October','November', 'December'];
var monthShortNames = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov', 'Dec'];
var dayNames = ['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday', 'Saturday'];
var dayPerMonth = ['31','','31','30','31','30','31','31','30','31','30','31'];
//date showing
var showingDate = new Date();

//Event
var Event = function(){ 
    this.title = '';
    this.description = '';
    this.allDay = '';
    this.stringDate = '';
    this.startDate = '';
    this.endDate = '';
    this.repeat = '';
    this.calendar = '';
    this.alert = '';
    this.cell = '';
}

// DOM variables
var win                     = $(this);
var monthCalendar           = $('.month-calendar');
var weekCalendar            = $('.week-calendar');
var dayCalendar             = $('.day-calendar');
var currentMonthDOM         = $('.current-month span');
var prevDOM                 = $('.current-month .prev');
var nextDOM                 = $('.current-month .next');
var createCalendarModal     = $('.create-calendar-modal');
var createEventModal        = $('.create-event-modal');
var createEvent             = $('.create-event');
var createCalendar          = $('.add-new-calendar');
var addEventButton          = $('.create-event-button');
var cancelEventButton       = $('.cancel-create-event-button');
var addCalendarButton       = $('.create-calendar-button');
var cancelCalendarButton    = $('.cancel-create-calendar-button');
var eventName               = $('.event-name input');
var eventStartTimeHour      = $('.event-start input:eq(0)');
var eventStartTimeMinutes   = $('.event-start input:eq(1)');
var eventDuration           = $('.event-duration input');
var calendarName            = $('.calendar-name input');
var calendarList            = $('.my-calendars-list');
var dayNumberDisplay        = $('.day article span:first-child');
var dayNameDisplay          = $('.day article span:last-child');
var miniCalendarTittle      = $('.mini-calendar-head > span');

var colorToolbar            = $('.color-toolbar');
var colorPickerContainer    = $('.color-picker-container');
var arrow                   = $('.color-picker-container .arrow');
var colorPickerHover        = $('.color-picker-hover');
var colorPicker             = $('.color-picker');
var colorPickerColor        = $('.color-toolbar .color');

var monthEventPrototype     = $('.month-calendar .event.wz-prototype');
var weekEventPrototype      = $('.week-calendar .event.wz-prototype');
var calendarPrototype       = $('.calendar.wz-prototype');
var dayMomentBarPrototype   = $('.day-moment.wz-prototype');
var dayMomentBulletPrototype= $('.day-moment-bullet.wz-prototype');
var dayMomentTimePrototype  = $('.day-moment-time.wz-prototype');

//Add getWeek function to Date object
Date.prototype.getWeek = function() {
  var onejan = new Date(this.getFullYear(),0,1);
  var today = new Date(this.getFullYear(),this.getMonth(),this.getDate());
  var dayOfYear = ((today - onejan + 86400000)/86400000);
  return Math.ceil(dayOfYear/7)
};

//Adds each top bar buttons functionalty to change between calendar types.
$('.calendar-type').on( 'click', function() {
    selectCalendarType($( this ));
    $( this ).addClass('active-type');
});

//Adds buttons functionality to open the menus
$('.my-calendars').on('click', function() {
    showMenu('.my-calendars-modal', false);
});

createEvent.on('click', function() {
    showMenu('.create-event-modal', true);
    var eventDate = dayNames[getDaySelected().getDay()]+', '+getDaySelected().getDate()+'th of '+monthNames[showingDate.getMonth()]+', '+showingDate.getFullYear();
    $('.event-when input').val(eventDate);
});

createCalendar.on('click', function() {
    showMenu('.create-calendar-modal', true);
});

addEventButton.on('click', function() {
    addEvent();
    showMenu('.create-event-modal', true);
});

addCalendarButton.on('click', function() {
    addCalendar();
    showMenu('.create-calendar-modal', true);
});

cancelCalendarButton.on('click', function() {
    colorPickerContainer.hide();
    showMenu('.create-calendar-modal', true);
});
cancelEventButton.on('click', function() {
    colorPickerContainer.hide();
    showMenu('.create-event-modal', true);
});

//Adds buttons functionality to change month/week
nextDOM.on('click', function() {
    if(calendarView == 'month'){
        showingDate.setMonth(showingDate.getMonth()+1);
    }else if(calendarView =='week'){
        showingDate.setDate(showingDate.getDate()+7);
    }else if(calendarView =='day'){
        showingDate.setMonth(showingDate.getMonth()+1);
    }
    cleanCells();
    initCalendar();
});

prevDOM.on('click', function() {
    if(calendarView == 'month'){
        showingDate.setMonth(showingDate.getMonth()-1);
    }else if(calendarView =='week'){
        showingDate.setDate(showingDate.getDate()-7);
    }else if(calendarView == 'day'){
        showingDate.setMonth(showingDate.getMonth()-1);
    }
    cleanCells();
    initCalendar();
});

//Color toolbar positioning
colorToolbar.on('click', function() {
    colorPickerContainer.toggle();
    colorPickerContainer
    .css({
        top     : ($(this).offset().top - win.offset().top) + ($(this).outerHeight() +  arrow.height()),
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
        colorPickerHover.attr('data-border-color' ,$(this).attr('data-boder-color'));
        colorPickerHover.attr('data-text-color' ,$(this).attr('data-text-color'));
        colorPickerHover.css({
            'background-color' : $(this).css('background-color'),
            top : pos.top,
            left : pos.left
    })
});

//Set the color picker to the color picked
colorPickerHover.on( 'click', function(){
    colorPickerColor
        .css( 'background-color', colorPickerHover.css('background-color') )
        .click();
    colorPickerContainer.css( 'display', 'none' );
});


//Displays de calendarType.
var selectCalendarType = function(calendarType){
    $('.wz-fit-ignore').removeClass('wz-fit-ignore');
	$('.calendar-active').removeClass('calendar-active');
	$('.active-type').removeClass('active-type');
	if(calendarType.hasClass('day-type')){
		dayCalendar.addClass('calendar-active');
        calendarView = 'day';
        monthCalendar.addClass('wz-fit-ignore');
        weekCalendar.addClass('wz-fit-ignore');
	}else if(calendarType.hasClass('week-type')){
		weekCalendar.addClass('calendar-active');
        calendarView = 'week';
        monthCalendar.addClass('wz-fit-ignore');
        dayCalendar.addClass('wz-fit-ignore');
	}else if(calendarType.hasClass('month-type')){
		monthCalendar.addClass('calendar-active');
        calendarView = 'month';
        dayCalendar.addClass('wz-fit-ignore');
        weekCalendar.addClass('wz-fit-ignore');
	}else{
		alert('CalendarTypeError');
	}
    initCalendar();
}

//Display and hides this menu.
var showMenu = function(menu, shadow){
    if(shadow){
        $('.shadow').toggle();
    }
    $(menu).toggle();
}

//Adds a green area to the cell recieved.
var selectDay = function(cell){
    $('.day-selected').removeClass('day-selected');
    cell.addClass('day-selected');
    if(calendarView == 'month'){
        showingDate.setDate(cell.find('span').text());
    }else if(calendarView == 'week'){
        showingDate.setDate(+$( '.week-day-names th:eq('+(cell.index()-1)+')' ).find('span').text().substring(0, 2));
    }else if(calendarView == 'day'){
        showingDate.setDate(cell.text());
        var dateText = showingDate.getDate()+' '+monthNames[showingDate.getMonth()]+', '+showingDate.getFullYear();
        currentMonthDOM.text(dateText);
        dayNumberDisplay.text(showingDate.getDate());
        dayNameDisplay.text(dayNames[showingDate.getDay()]);
        miniCalendarTittle.text(monthNames[showingDate.getMonth()]+' '+showingDate.getFullYear());
    }
    
    
}

var setCurrentDay = function(cell){
    $('.day-moment-time').remove();
    $('.day-moment').remove();
    $('.day-moment-bullet').remove();
    $('.current-day').removeClass('current-day');
    var currentDay = new Date();
    if((showingDate.getMonth() == currentDay.getMonth() && (calendarView == 'month' || calendarView == 'day')) || (showingDate.getWeek() == currentDay.getWeek() && calendarView == 'week') ){
        cell.addClass('current-day');

        $('.white-background').removeClass('white-background');
        $('.title-cell:eq('+cell.index()+')').addClass('white-background');
        $('.week-day-names th').removeClass('white-background');
        $('.week-day-names th:eq('+(cell.index()-1)+')').addClass('white-background');

        var dayToSelect = '';
        if(cell.hasClass('mon')){
            dayToSelect = $('.monday');
        }else if(cell.hasClass('tue')){
            dayToSelect = $('.tuesday');
        }else if(cell.hasClass('wed')){
            dayToSelect = $('.wednesday');
        }else if(cell.hasClass('thu')){
            dayToSelect = $('.thursday');
        }else if(cell.hasClass('fri')){
            dayToSelect = $('.friday');
        }else if(cell.hasClass('sat')){
            dayToSelect = $('.saturday');
        }else{
            dayToSelect = $('.sunday');
        }
        dayToSelect.addClass('current-day');
        
        if(calendarView == 'week' || calendarView == 'day'){
            setHour();
        }
    }
}

// -- APP FUNCTIONALITY --

//Set all de calendar
var initCalendar = function(){
    if (showingDate.getMonth() == 1){
        setFebDays();
    }
    numOfDays = dayPerMonth[showingDate.getMonth()];
    setShowingDate();
    var dayToSelect = '';
    if(calendarView == 'month'){
        dayToSelect = setMonthCells();
    }else if(calendarView == 'week'){
        dayToSelect = setWeekCells();
    }else if(calendarView == 'day'){
        dayToSelect = setDayCells();
    }
    setCurrentDay(dayToSelect);
    selectDay(dayToSelect);
}

//Determinate if February 28/29
var setFebDays = function(){
    var showingYear = showingDate.getFullYear();
    if ( (showingYear%100!=0) && (showingYear%4==0) || (showingYear%400==0)){
        dayPerMonth[1] = '29';
    }else{
        dayPerMonth[1] = '28';
    }
}

//Set the showing date on the calendar header
var setShowingDate = function(){
    var dateText = '';
    if(calendarView == 'month'){
        dateText = monthNames[showingDate.getMonth()]+', '+showingDate.getFullYear();
    }else if(calendarView == 'week'){
        var firstDayOfWeek = new Date();
        firstDayOfWeek.setDate(showingDate.getDate() - showingDate.getDay());        
        var lastDayOfWeek = new Date();
        lastDayOfWeek.setDate(showingDate.getDate() + (6 - showingDate.getDay()));
        dateText = firstDayOfWeek.getDate()+'-'+lastDayOfWeek.getDate()+' '+monthShortNames[showingDate.getMonth()]+', '+showingDate.getFullYear();
    }else if(calendarView == 'day'){
        dateText = showingDate.getDate()+' '+monthNames[showingDate.getMonth()]+', '+showingDate.getFullYear();
    }
    currentMonthDOM.text(dateText);
}

//Set the primary state of the cells of the month view of the calendar
var setMonthCells = function(){
    var nCells = 42;
    var nBlankCells = nCells - numOfDays;
    
    var prevNumOfDays = '';
    if(showingDate.getMonth() == 0){
        prevNumOfDays = dayPerMonth[11];
    }else{
        prevNumOfDays = dayPerMonth[showingDate.getMonth()-1];
    }
    
    var firstWeekDayOfMonth = new Date(monthNames[showingDate.getMonth()]+' 1 ,'+showingDate.getFullYear()).getDay();
    prevNumOfDays -= firstWeekDayOfMonth-1;
    for (var i = 0; i < firstWeekDayOfMonth; i++) {
        $( '.day-table td:eq('+i+')' ).addClass('other-month-cell');
        $( '.day-table td:eq('+i+') span' ).text(prevNumOfDays++);
        nBlankCells--;
    }

    var dayCounter = 1;
    for (var i = firstWeekDayOfMonth; i < nCells - nBlankCells; i++) {
        $( '.day-table td:eq('+i+') span' ).text(dayCounter++);
        $( '.day-table td:eq('+i+')' ).addClass('day-cell');
    }
    
    dayCounter = 1;
    for (var i = nCells - nBlankCells; i < nCells; i++) {
        $( '.day-table td:eq('+i+')' ).addClass('other-month-cell');
        $( '.day-table td:eq('+i+') span' ).text(dayCounter++);
    }
    
    addByClick();
    
    var currentDate = new Date();
    var dayToSelect = $( '.day-table td:eq('+(firstWeekDayOfMonth+(currentDate.getDate()-1))+')' );
    
    return dayToSelect;
}

var setWeekCells = function(){
    $( '.week-day-name .week-day:eq('+showingDate.getDay()+')' ).text(showingDate.getDate()+' '+dayNames[showingDate.getDay()]);
    var showingDateAux = new Date(showingDate.getTime());
    for (var i = showingDate.getDay()-1; i >= 0; i--) {
        showingDateAux.setDate(showingDateAux.getDate()-1);
        $( '.week-day-name .week-day:eq('+i+')' ).text(showingDateAux.getDate()+' '+dayNames[showingDateAux.getDay()]);
    }
    showingDateAux = new Date(showingDate.getTime());
    for (var i = showingDate.getDay()+1; i < 7; i++) {
        showingDateAux.setDate(showingDateAux.getDate()+1);
        $( '.week-day-name .week-day:eq('+i+')' ).text(showingDateAux.getDate()+' '+dayNames[showingDateAux.getDay()]);
    }
    
    addByClick();
    
    var currentDate = new Date();
    var dayToSelect = $( '.time-events td.time-col:eq('+(currentDate.getDay())+')' );
    
    return dayToSelect;
}

var setDayCells = function(){
    var nCells = 42;
    var nBlankCells = nCells - numOfDays;
    var firstWeekDayOfMonth = new Date(monthNames[showingDate.getMonth()]+' 1 ,'+showingDate.getFullYear()).getDay();
    nBlankCells = nBlankCells - firstWeekDayOfMonth;

    var dayCounter = 1;
    for (var i = firstWeekDayOfMonth; i < nCells - nBlankCells; i++) {
        $( '.mini-calendar-body table td:eq('+i+')' ).text(dayCounter++);
        $( '.mini-calendar-body table td:eq('+i+')' ).addClass('day-cell');
    }
    
    dayNumberDisplay.text(showingDate.getDate());
    dayNameDisplay.text(dayNames[showingDate.getDay()]);
    miniCalendarTittle.text(monthNames[showingDate.getMonth()]+' '+showingDate.getFullYear());
    
    addByClick();
    
    var currenDate = new Date();
    var dayToSelect = $( '.mini-calendar-body table td:eq('+(firstWeekDayOfMonth+(currenDate.getDate()-1))+')' );
    
    return dayToSelect;
}

//Clean all the cells of the month view of the calendar
var cleanCells = function(){
    if(calendarView == 'month'){
        for (var i = 0; i < 42; i++) {
            $( '.day-table td:eq('+i+') span' ).text('');
            $( '.day-table td:eq('+i+') article' ).remove();
            $( '.day-table td:eq('+i+')' ).removeClass();
        }
    }else if(calendarView == 'week'){
        $( '.week-calendar .event').remove();
    }else if(calendarView == 'day'){
        for (var i = 0; i < 42; i++) {
            $( '.mini-calendar-body table th:eq('+i+')').text('');
            $( '.mini-calendar-body table th:eq('+i+')' ).removeClass();
        }
    }
}

var getDaySelected = function(){
    return new Date(monthNames[showingDate.getMonth()]+' '+$('.day-selected span').text()+' ,'+showingDate.getFullYear());
}

var setHour = function(){
    $('.time-col .day-moment-bullet').remove();
    $('tbody .day-moment-time').remove();
    $('tbody .day-moment').remove();
    var currentDate = new Date();
    var hour = currentDate.getHours();
    var minutes = ('0'+currentDate.getMinutes()).slice(-2);
    var offset = (41 * hour) + (0.66666666 * minutes);
    var dayMomentBar = dayMomentBarPrototype.clone();
    var dayMomentBullet = dayMomentBulletPrototype.clone();
    var dayMomentTime = dayMomentTimePrototype.clone();
    dayMomentBar.removeClass('wz-prototype');
    dayMomentBullet.removeClass('wz-prototype');
    dayMomentTime.removeClass('wz-prototype');

    dayMomentTime.text(hour+':'+minutes);
    if(10 > +(minutes) > 50){
        dayMomentTime.css('background-color', '#f6f8f8');
    }
    
    dayMomentBar.css('top', offset+'px');
    dayMomentTime.css('top', (offset-16)+'px');
    dayMomentBullet.css('top', (offset-6)+'px');
    
    if(minutes != 0){
        $('.time-events tbody').append(dayMomentTime);
        $('.time-cells tbody').append(dayMomentTime.clone());
    }

    $('.time-events tbody').append(dayMomentBar);
    $('.day-selected').append(dayMomentBullet); 
    $('.time-cells tbody').append(dayMomentBar.clone());
}

var addEvent = function(){
    var event = createEventModal.data('event');
    console.log(event);
    console.log(event.cell);
    var eventTime = {
        hour    : +eventStartTimeHour.val(),
        minutes : +eventStartTimeMinutes.val()
    };
    
    fixEventTime(eventTime);
    
    if(calendarView == 'month'){
        var eventDom =  monthEventPrototype.clone();
        eventDom.removeClass('wz-prototype');
        //toDo
        eventDom.html('<figure></figure>'+eventName.val());
        eventDom.find('figure').css('background-color', colorPickerColor.css('background-color'));
        if(event.cell.find('article').length < 1){
            event.cell.append(eventDom);
        }else{
            var moreEvents = event.cell.find('.moreEvents');
            if(moreEvents.length == 0){
                var moreEvents = monthEventPrototype.clone();
                moreEvents.removeClass('ellipsis');
                moreEvents.removeClass('wz-prototype');
                moreEvents.addClass('moreEvents');
                moreEvents.text('1 more...');
                moreEvents.data('numEventsMore', 1)
                eventDom.hide();
                event.cell.append(eventDom);
                event.cell.append(moreEvents);
            }else{
                var numEventsMore = moreEvents.data('numEventsMore');
                numEventsMore++;
                moreEvents.data('numEventsMore', numEventsMore);
                moreEvents.text(numEventsMore+' more...');
                eventDom.hide();
                event.cell.append(eventDom);
                event.cell.append(moreEvents);
            }
        }
    }else if(calendarView == 'week'){
        var weekDaySelected = event.cell.index() -1;
        var daySelected = $('.hour-markers .marker-cell:eq('+eventTime.hour+')');
        var eventDom = weekEventPrototype.clone();
        eventDom.removeClass('wz-prototype');
        //toDo
        eventDom.find('span:eq(0)').text(eventName.val());
        
        eventDom.css('border-left', '2px solid '+colorPickerHover.attr('data-border-color'));
        eventDom.css('background-color', colorPickerColor.css('background-color'));
        eventDom.css('color', colorPickerHover.attr('data-text-color'));
        
        if(eventDuration.val() == 'all day'){
            daySelected = $('.day-all-day:eq('+(event.cell.index()-1)+')');
            eventDom.css('display', 'inline-block');
            eventDom.css('margin-left', '-1.6px');
            eventDom.css('width', '101px');
            if(daySelected.children().length > 0){
                var nEvents = daySelected.data('nEvents') + 1;
                var nextTop = daySelected.data('nextTop');
                daySelected.data('nEvents', nEvents);
                $('.day-all-day').css('height', 20*nEvents);
                $('.scroll-time-events').css('height', (481 - parseInt($('.week-top-container').css('height'))));
                eventDom.css('margin-top', nextTop+'px');
                daySelected.data('nextTop', nextTop+18);
            }else{
                daySelected.data('nEvents', 1);
                daySelected.data('nextTop', 18);
            }
        }else{
            var eventTimeString = eventTime.hour+':'+eventTime.minutes+' - '+(eventTime.hour+(+(eventDuration.val().substring(0, 2))))+':'+eventTime.minutes;
            eventDom.find('span:eq(1)').text(eventTimeString);
            eventDom.css('left', 14.28 * weekDaySelected +'%');
            eventDom.css('height', 37 * (+(eventDuration.val().substring(0, 2)))+'px');
            eventDom.css('margin-top', 0.666666 * eventTime.minutes +'px');
        }
        daySelected.append(eventDom);
    }
}

var addCalendar = function(){
    var calendar =  calendarPrototype.clone();
    calendar.removeClass('wz-prototype');
    //toDo
    calendar.find('.calendar-name').text(calendarName.val());
    calendar.find('figure').css('background-color', colorPickerColor.css('background-color'));
    calendar.find('.deleteCalendar').on( 'click', function(){
        calendar.remove();
    });
    calendarList.append(calendar);
}

//Add events by clicking
var addByClick = function(){
    
    $('td').off('click');
    var event = new Event();
    
    if(calendarView == 'month'){
        
        $('.day-cell').on('dblclick', function(){
            var object = $(this);
            showMenu('.create-event-modal', true);
            event.stringDate = dayNames[object.index()]+', '+object.find('span').text()+'th of '+monthNames[showingDate.getMonth()]+', '+showingDate.getFullYear();
            $('.event-when input').val(event.stringDate);
            eventDuration.val('1 hour');
            event.cell = object;
        });
        
    }else if(calendarView == 'week'){
        
        $('.time-col').on('dblclick', function(){
            var object = $(this);
            showMenu('.create-event-modal', true);
            event.stringDate = dayNames[object.index()-1]+', '+$('.week-day-names th:eq('+(object.index()-1)+')').find('span').text().substring(0, 2)+'th of '+monthNames[showingDate.getMonth()]+', '+showingDate.getFullYear();
            $('.event-when input').val(event.stringDate);
            eventDuration.val('1 hour');
            event.allDay = false;
            event.cell = object;
        });
        
        $('.day-all-day').on('dblclick', function(){
            var object = $(this);
            showMenu('.create-event-modal', true);
            event.stringDate = dayNames[object.index()-1]+', '+$('.week-day-names th:eq('+(object.index()-1)+')').find('span').text().substring(0, 2)+'th of '+monthNames[showingDate.getMonth()]+', '+showingDate.getFullYear();
            $('.event-when input').val(event.stringDate);
            eventDuration.val('all day');
            event.allDay = true;
            event.cell = object;
        });
        
    }else if(calendarView == 'day'){
        
        $('.day-cell').on('dblclick', function(){
            var object = $(this);
            selectDay(object);
            showMenu('.create-event-modal', true);
            event.stringDate = dayNames[object.index()]+', '+object.text()+'th of '+monthNames[showingDate.getMonth()]+', '+showingDate.getFullYear();
            $('.event-when input').val(event.stringDate);
            event.cell = object;
        });
    }
    createEventModal.data('event', event);
}

var fixEventTime = function(eventTime){
    if(eventTime.hour.toString().length < 2){
        eventTime.hour = '0'+eventTime.hour;
    }
    if(eventTime.minutes.toString().length < 2){
        eventTime.minutes = '0'+eventTime.minutes;
    }
}

//Run code
initCalendar();
setInterval(function(){setHour()}, 60000);
