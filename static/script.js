'use strict'

// CONSTANTS
var BROWSER_FIREFOX = 0;
var BROWSER_IE = 1;
var BROWSER_WEBKIT = 2;
var BROWSER_TYPE = /webkit/i.test(navigator.userAgent) ? BROWSER_WEBKIT : (/trident/i.test(navigator.userAgent) ? BROWSER_IE : BROWSER_FIREFOX);

// VARIABLES
var account = '';
var calendarView = 'month';
var febNumberOfDays = '';
var numOfDays = '';
var monthNames = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
var monthShortNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
var dayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
var dayPerMonth = ['31', '', '31', '30', '31', '30', '31', '31', '30', '31', '30', '31'];
var showingDate = new Date();

// CALENDAR OBJECT
var Calendar = function() {

  this.name = '';
  this.color = '';
  this.description = '';
  this.path = '';

}

// EVENT OBJECT
var Event = function() {

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

// COLOR PALETTE
var colorPalette = [
	{name: 'blue' , light: 'rgba(157, 211, 255, 0.5)', text:'rgba(42, 119, 173, 0.9)' , border:'#5ab4fe'},
	{name: 'green' , light: 'rgba(126, 190, 48, 0.5)', text:'rgba(48, 110, 13, 0.9)' , border:'#4e9c21'},
	{name: 'purple' , light: 'rgba(209, 196, 233, 0.5)', text:'rgba(103, 66, 170, 0.9)' , border:'#aa7ff8'},
	{name: 'orange' , light: 'rgba(247, 154, 3, 0.5)', text:'rgba(180, 93, 31, 0.9)' , border:'#f68738'},
	{name: 'brown' , light: 'rgba(109, 83, 65, 0.5)', text:'rgba(90, 70, 56, 0.9)' , border:'#6e5646'},
	{name: 'green2' , light: 'rgba(34, 168, 108, 0.5)', text:'rgba(10, 90, 54, 0.9)' , border:'#22a86c'},
	{name: 'red' , light: 'rgba(225, 61, 53, 0.5)', text:'rgba(145, 37, 33, 0.9)' , border:'#e13d35'},
	{name: 'pink' , light: 'rgba(225, 143, 234, 0.5)', text:'rgba(156, 75, 165, 0.9)' , border:'#b36dbb'},
	{name: 'grey' , light: 'rgba(56, 74, 89, 0.5)', text:'rgba(53, 59, 67, 0.9)' , border:'#384a59'},
	{name: 'yellow' , light: 'rgba(255, 204, 0, 0.5)', text:'rgba(132, 116, 11, 0.9)' , border:'#c6a937'},
];

// DOM variables
var win = $(this);
var monthCalendar = $('.month-calendar');
var weekCalendar = $('.week-calendar');
var dayCalendar = $('.day-calendar');
var currentMonthDOM = $('.current-month span');
var prevDOM = $('.current-month .prev');
var nextDOM = $('.current-month .next');
var createCalendarModal = $('.create-calendar-modal');
var createEventModal = $('.create-event-modal');
var createEvent = $('.create-event');
var createCalendar = $('.add-new-calendar');
var addEventButton = $('.create-event-button');
var deleteEventButton = $('.delete-event-button');
var closeModalButton = $('.close-modal-button');
var addCalendarButton = $('.create-calendar-button');
var cancelCalendarButton = $('.cancel-create-calendar-button');
var eventName = $('.event-name input');
var eventWhen = $('.event-when');
var eventTime = $('.event-time');
var eventColor = $('.event-color');
var eventRepeat = $('.event-repeat');
var eventAlert	= $('.event-alert');
var eventDuration = $('.event-duration input');
var eventDescription = $('.event-description');
var calendarName = $('.calendar-name input');
var calendarList = $('.my-calendars-list');
var dayNumberDisplay = $('.day article span:first-child');
var dayNameDisplay = $('.day article span:last-child');
var miniCalendarTittle = $('.mini-calendar-head > span');
var eventList = $('.event-list');
var dateDropDown = $('.date-dropdown');
var hourDropDown = $('.hour-dropdown');
var hoursSelectables = $('.hour-dropdown .hours article');
var calendarDropDown = $('.calendar-dropdown');
var repeatDropDown = $('.repeat-dropdown');
var alertDropDown = $('.alert-dropdown');
var eventAllDay = $('.event-all-day');
var todayDropdown = $('.date-dropdown .chose-today-button');

var colorToolbar = $('.color-toolbar');
var colorPickerContainer = $('.color-picker-container');
var arrow = $('.color-picker-container .arrow');
var colorPickerHover = $('.color-picker-hover');
var colorPicker = $('.color-picker');
var colorPickerColor = $('.color-toolbar .color');

var monthEventPrototype = $('.month-calendar .event.wz-prototype');
var monthAllDayEventPrototype = $('.month-calendar .all-day-event.wz-prototype');
var weekEventPrototype = $('.week-calendar .event.wz-prototype');
var dayEventProtoype = $('.day-events.wz-prototype');
var calendarPrototype = $('.my-calendars-list .calendar.wz-prototype');
var calendarSelectorProtoype = $('.calendar-dropdown .calendar.wz-prototype');
var dayMomentBarPrototype = $('.day-moment.wz-prototype');
var dayMomentBulletPrototype = $('.day-moment-bullet.wz-prototype');
var dayMomentTimePrototype = $('.day-moment-time.wz-prototype');

// GLOBAL FUNCTIONS
// Add getWeek function to Date object
Date.prototype.getWeek = function() {

  var onejan = new Date(this.getFullYear(), 0, 1);
  var today = new Date(this.getFullYear(), this.getMonth(), this.getDate());
  var dayOfYear = ((today - onejan + 86400000) / 86400000);
  return Math.ceil(dayOfYear / 7);

};

// DOM EFFECTS
// Change between calendar types.
$('.calendar-type').on('click', function() {

  selectCalendarType($(this));
  $(this).addClass('active-type');

});

// Open the menus
$('.my-calendars').on('click', function() {
  showMenu('.my-calendars-modal', false);
});

// Open 'new calendar' modal
createCalendar.on('click', function() {
  showMenu('.create-calendar-modal', true);
});

// Open 'new event' modal
createEvent.on('click', function() {
	// Clean inputs
	cleanNewEventModal();

	// Show menu
  showMenu('.create-event-modal', true);

	// Set string date to show
	setStringDate((showingDate.getDate()).toString(), (showingDate.getMonth()+1).toString(), showingDate.getFullYear());

	// Set default hour in the new event modal
	setDefaultHour();

	// Prepare the calendar which is active
	setActiveCalendar();

	// Set the cells and the current day on dropdown calendar
	setDropCalendarCells();
	setCurrentDayDropCalendar();
});

// Add calendar button
addCalendarButton.on('click', function() {

  var calendarApi = {name: calendarName.val(), color: normalizeColor(colorPalette[colorPickerHover.attr('data-color')].border)};
  addCalendar(calendarApi);
  showMenu('.create-calendar-modal', true);

});

// Add event button
addEventButton.on('click', function() {

  if( addEventButton.text() === 'EDIT' ){

    //Editar el evento

  }else{

    //Creamos el objeto a insertar en el api
    var event = new Event();

    var startDate = eventWhen.eq(0).find('input').val();
    var endDate = eventWhen.eq(1).find('input').val();

    event.startDate = new Date(parseInt(startDate.substr(6,4)), parseInt(startDate.substr(0,2))-1, parseInt(startDate.substr(3,2)));
    event.endDate = new Date(parseInt(endDate.substr(6,4)), parseInt(endDate.substr(0,2))-1, parseInt(endDate.substr(3,2)));
    event.title = eventName.val();
    event.startDate.setHours(eventTime.eq(0).find('input').val().substr(0,2));
    event.startDate.setMinutes(eventTime.eq(0).find('input').val().substr(3,2));
    event.endDate.setHours(eventTime.eq(1).find('input').val().substr(0,2));
    event.endDate.setMinutes(eventTime.eq(1).find('input').val().substr(3,2));
    event.allDay = eventAllDay.find('input').hasClass('checked');
    event.repeat = repeatDropDown.find('.active').index();
    event.description = eventDescription.find('textarea').val();

    // Prepare event object for insert in the API
    var eventApi = {
      name: event.title,
      start: event.startDate.getTime(),
      end: event.endDate.getTime(),
      description: event.description,
      allDay: event.allDay
    };

    var calendarToSearch = eventColor.find('span').text();
    account.getCalendars(function(err, list) {
      for(var i = 0; i< list.length; i++){
        if(calendarToSearch == list[i].displayname){
          event.calendar = list[i];
          break;
        }
      }
      addEvent(event.calendar, eventApi);
    });

  }


  //addEventToDom(true, false);
  showMenu('.create-event-modal', true);

});

// Delete event button
deleteEventButton.on('click', function(){
  win.data(eventName.val()).delete(function(err){throw('pepe')});
})

// Close 'new calendar' modal
cancelCalendarButton.on('click', function() {

  colorPickerContainer.hide();
  showMenu('.create-calendar-modal', true);

});

// Close 'new event' modal
closeModalButton.on('click', function() {

  cleanNewEventModal();
  createEventModal.data('mode', 'add');
  showMenu('.create-event-modal', true);

});


// Change to next month/week
nextDOM.on('click', function() {

  if (calendarView == 'month') {
    showingDate.setMonth(showingDate.getMonth() + 1);
  } else if (calendarView == 'week') {
    showingDate.setDate(showingDate.getDate() + 7);
  } else if (calendarView == 'day') {
    showingDate.setMonth(showingDate.getMonth() + 1);
  }
  cleanCells();
  initCalendar();

	// Set the cells and the current day on dropdown calendar
	setDropCalendarCells();
	setCurrentDayDropCalendar();

});

// Change to prev month/week
prevDOM.on('click', function() {

  if (calendarView == 'month') {
    showingDate.setMonth(showingDate.getMonth() - 1);
  } else if (calendarView == 'week') {
    showingDate.setDate(showingDate.getDate() - 7);
  } else if (calendarView == 'day') {
    showingDate.setMonth(showingDate.getMonth() - 1);
  }
  cleanCells();
  initCalendar();

	// Set the cells and the current day on dropdown calendar
	setDropCalendarCells();
	setCurrentDayDropCalendar();

});

// Set the input active (green border)
/*eventName.on('input', function(){
	$(this).toggleClass('active');
})*/

// Display date dropdown menu
eventWhen.on('click', function(){
	displayDateDropdown($(this));
});

var displayDateDropdown = function(object){

	dateDropDown.toggle();
	if(object.hasClass('start')){

		dateDropDown.removeClass('end');
		dateDropDown.addClass('start');
		dateDropDown.css('top','130px');
		eventWhen.eq(0).find('input').toggleClass('active');

	}else if(object.hasClass('end')){

		dateDropDown.removeClass('start');
		dateDropDown.addClass('end');
		dateDropDown.css('top','191px');
		eventWhen.eq(1).find('input').toggleClass('active');

	}

}

// Set current month by pressing today button on date dropdown calendar
todayDropdown.on('click', function(){

	var now = new Date();
	showingDate.setDate(now.getDate());
	showingDate.setMonth(now.getMonth());
	showingDate.setFullYear(now.getFullYear());

	cleanCells();
  initCalendar();

	// Set the cells and the current day on dropdown calendar
	setDropCalendarCells();
	setCurrentDayDropCalendar();

});

// Display hour dropdown menu
eventTime.on('click', function(){
	displayHourDropdown($(this));
});
var displayHourDropdown = function(object){

	hourDropDown.toggle();
	if(object.hasClass('start')){

		hourDropDown.removeClass('end');
		hourDropDown.addClass('start');
		hourDropDown.css('top','130px');
		eventTime.eq(0).find('input').toggleClass('active');

	}else if(object.hasClass('end')){

		hourDropDown.removeClass('start');
		hourDropDown.addClass('end');
		hourDropDown.css('top','191px');
		eventTime.eq(1).find('input').toggleClass('active');

	}

}

// Set hour from hour dropdown menu
hoursSelectables.on('click', function(){

	var object = $(this);

	if(!object.hasClass('inactive')){

		if(hourDropDown.hasClass('start')){

			eventTime.eq(0).find('input').val(object.text());
			eventTime.eq(0).find('input').toggleClass('active');
			for(var i = 0; i<object.index()+1; i++){
				hourDropDown.find('article').eq(i).addClass('inactive');
			}

		}else if(hourDropDown.hasClass('end')){

			eventTime.eq(1).find('input').val(object.text());
			eventTime.eq(1).find('input').toggleClass('active');
			for(var i = object.index(); i<49; i++){
				hourDropDown.find('article').eq(i).addClass('inactive');
			}

		}
		hourDropDown.toggle();
	}

});

// Display calendar dropdown menu
eventColor.on('click', function(){
	calendarDropDown.toggle();
});

// Display repeat dropdown menu
eventRepeat.on('click', function(){
	repeatDropDown.toggle();
});

// Make clickeable the repeat options
repeatDropDown.find('article').on('click', function(){

	var object = $(this);
	repeatDropDown.find('.active').removeClass('active');
	eventRepeat.find('input').val(object.text());
	object.addClass('active');
	repeatDropDown.hide();

});

// Display alert dropdown menu
eventAlert.on('click', function(){
	alertDropDown.toggle();
});

// Color toolbar positioning
colorToolbar.on('click', function() {

  colorPickerContainer.toggle();
  colorPickerContainer
    .css({
      top: ($(this).offset().top - win.offset().top) + ($(this).outerHeight() + arrow.height()),
      left: $(this).offset().left - win.offset().left,
    });

});

// Color toolbar hover color
colorPicker
  .on('mousedown', function(e) {
    e.stopPropagation();
  })
  .on('mouseenter', 'td', function() {

    var pos = $(this).position();
    if (BROWSER_TYPE === BROWSER_FIREFOX) {
      pos.top = pos.top - parseInt(colorPickerHover.css('border-top-width'), 10);
      pos.left = pos.left - parseInt(colorPickerHover.css('border-left-width'), 10);
    }
    colorPickerHover.attr('data-color', $(this).index());
    colorPickerHover.css({
      'background-color': $(this).css('background-color'),
      top: pos.top,
      left: pos.left
    });

  });

// Set the color picker to the color picked
colorPickerHover.on('click', function() {

  colorPickerColor
    .css('background-color', colorPickerHover.css('background-color'))
    .click();
  colorPickerContainer.css('display', 'none');

});

// Select all day in new event modal
eventAllDay.find('label').on('click', function(){

	if(eventTime.find('input').prop('disabled')){

		eventWhen.eq(1).find('input').prop('disabled', false);
		eventWhen.eq(1).on('click', function(){displayDateDropdown($(this))});
		eventWhen.eq(1).find('input').removeClass('disabled');
		eventTime.find('input').prop('disabled', false);
		eventTime.on('click', function(){displayHourDropdown($(this))});
		eventTime.find('input').removeClass('disabled');

	}else{

		eventWhen.eq(1).find('input').prop('disabled', true);
		eventWhen.eq(1).off('click');
		eventWhen.eq(1).find('input').addClass('disabled');
		eventTime.find('input').prop('disabled', true);
		eventTime.off('click');
		eventTime.find('input').addClass('disabled');

	}

});

// AUXILIAR FUNCTIONS
// Color converter
var normalizeColor = function( color ){

 if( !color ){
 	return '#000000';
 }
 if( color.indexOf('#') > -1 ){
 	return color;
 }

 color = color.match(/(\d+)/g) || [ 0, 0, 0 ];
 color = color.slice( 0, 3 ); // Prevents alpha if color was a rgba

 for( var i in color ){
 	color[ i ] = parseInt( color[ i ], 10 ).toString( 16 );
 	color[ i ] = color[ i ].length === 1 ? '0' + color[ i ] : color[ i ];
 }

 return '#' + color.join('');

};

// Displays calendar types
var selectCalendarType = function(calendarType) {

  $('.calendar-active').removeClass('calendar-active');
  $('.active-type').removeClass('active-type');

  if (calendarType.hasClass('day-type')) {

    dayCalendar.addClass('calendar-active');
    calendarView = 'day';
    dayCalendar.addClass('wz-fit');
    dayCalendar.removeClass('wz-fit-ignore');

  } else if (calendarType.hasClass('week-type')) {

    weekCalendar.addClass('calendar-active');
    calendarView = 'week';
    dayCalendar.removeClass('wz-fit');
    dayCalendar.addClass('wz-fit-ignore');

  } else if (calendarType.hasClass('month-type')) {

    monthCalendar.addClass('calendar-active');
    calendarView = 'month';
    dayCalendar.removeClass('wz-fit');
    dayCalendar.addClass('wz-fit-ignore');

  } else {
    alert('CalendarTypeError');
  }

  initCalendar();

}

// Display and hides this menu.
var showMenu = function(menu, shadow) {

  if (shadow) {
    $('.shadow').toggle();
  }
  $(menu).toggle();

}

// Set the current day to the cell
var setCurrentDay = function(cell) {

  // Clean all highlighted areas
  $('.day-moment-time').remove();
  $('.day-moment').remove();
  $('.day-moment-bullet').remove();
  $('.current-day').removeClass('current-day');

  if(cell != ''){
    // Add a green area to the cell
    cell.addClass('current-day');

    // Add a white area to the day name on week view
    $('.white-background').removeClass('white-background');
    $('.title-cell:eq(' + cell.index() + ')').addClass('white-background');
    $('.week-day-names th').removeClass('white-background');
    $('.week-day-names th:eq(' + (cell.index() - 1) + ')').addClass('white-background');

    // Add a green area to all-day cell on week view
    var dayToSelect = '';
    if (cell.hasClass('mon')) {
      dayToSelect = $('.monday');
    } else if (cell.hasClass('tue')) {
      dayToSelect = $('.tuesday');
    } else if (cell.hasClass('wed')) {
      dayToSelect = $('.wednesday');
    } else if (cell.hasClass('thu')) {
      dayToSelect = $('.thursday');
    } else if (cell.hasClass('fri')) {
      dayToSelect = $('.friday');
    } else if (cell.hasClass('sat')) {
      dayToSelect = $('.saturday');
    } else {
      dayToSelect = $('.sunday');
    }
    dayToSelect.addClass('current-day');
  }

}

// Set the date string on the new event modal
var setStringDate = function(day, month, year){

	month = addZeroToHour(month);
	day = addZeroToHour(day);
	$('.event-when input').val(month+'/'+day+'/'+year);

}

// Set the active calendar on the new event modal
var setActiveCalendar = function(){

	var calendars = calendarDropDown.find('.calendar');
	var calendar = '';
	for(var i = 0; i<calendars.length; i++){
		if(calendars.eq(i).css('display') != 'none'){
			calendar = calendars.eq(i);
			break;
		}
	}
	$('.calendar-dropdown .calendarDom.active').removeClass('active');
	calendar.addClass('active');
	eventColor.find('.color').css('background-color', calendar.find('.color').css('background-color'));
	eventColor.find('.ellipsis').text(calendar.find('.ellipsis').text());

}

// Clean the inpts and inactive cells of new event modal
var cleanNewEventModal = function(){

  addEventButton.text('CREATE');
  deleteEventButton.css('display', 'none');

  eventDescription.find('textarea').val('');
	hoursSelectables.removeClass('inactive');
	eventName.val('');
	eventTime.find('input').val('');
	dateDropDown.find('.inactive').removeClass('inactive');
	repeatDropDown.find('article').eq(0).click();

  if(eventAllDay.find('input').hasClass('checked')){

    eventAllDay.find('label').click();
    eventAllDay.find('input').removeClass('checked');
    eventAllDay.find('input').removeAttr('checked');

  }

	calendarDropDown.hide();
	dateDropDown.hide();
	hourDropDown.hide();
	repeatDropDown.hide();

}

// Set the current day on the date dropdown calendar
var setCurrentDayDropCalendar = function(){

	var now = new Date();
	if(showingDate.getMonth() == now.getMonth()){
		dateDropDown.find('.current-day').removeClass('current-day');
		dateDropDown.find('.day-cell').eq(showingDate.getDate()-1).addClass('current-day');
	}

}

// Set the default hour on the new event modal
var setDefaultHour = function(){

	var now = new Date();
	var startHour = addZeroToHour(now.getHours());
	var startMinutes = addZeroToHour(now.getMinutes());
	var endHour = addZeroToHour(now.getHours() + 1);
	eventTime.eq(0).find('input').val(startHour+':'+startMinutes);
	eventTime.eq(1).find('input').val(endHour+':'+startMinutes);

}

// Adds a '0' if the string lenght is = 1 and cast to string
var addZeroToHour = function(hour){

  var aux = hour.toString();
  if(aux.length < 2){
    aux = '0' + aux;
  }
  return aux;

}

var todayInWeek = function(weekStart){

  var now = new Date();
  var inWeek = false;

  if(weekStart.getMonth() == now.getMonth()){
    var startDay = weekStart.getDate();
    for (var i = 0; i < 7; i++) {
      if (startDay == now.getDate()) {
        inWeek = true;
      }
      startDay++;
    }
  }

  return inWeek;

}

// APP FUNCTIONALITY
// Set all de calendar
var initCalendar = function() {

  if (showingDate.getMonth() == 1) {
    setFebDays();
  }

  numOfDays = dayPerMonth[showingDate.getMonth()];
  setShowingDate();
  cleanCells();

  var cellToHighlight = '';
  if (calendarView == 'month') {
    cellToHighlight = setMonthCells();
  } else if (calendarView == 'week') {
    cellToHighlight = setWeekCells();
  } else if (calendarView == 'day') {
    cellToHighlight = setDayCells();
  }
  setCurrentDay(cellToHighlight);

  if (calendarView == 'week' || calendarView == 'day') {
    setHour();
  }

}

// Determinate if February 28/29
var setFebDays = function() {

  var showingYear = showingDate.getFullYear();
  if ((showingYear % 100 != 0) && (showingYear % 4 == 0) || (showingYear % 400 == 0)) {
    dayPerMonth[1] = '29';
  } else {
    dayPerMonth[1] = '28';
  }

}

// Set the showing date on the calendar header
var setShowingDate = function() {

  var dateText = '';

  if (calendarView == 'month') {
    dateText = monthNames[showingDate.getMonth()] + ', ' + showingDate.getFullYear();
  } else if (calendarView == 'week') {

    var firstDayOfWeek = new Date();
    firstDayOfWeek.setDate(showingDate.getDate() - showingDate.getDay());
    var lastDayOfWeek = new Date();
    lastDayOfWeek.setDate(showingDate.getDate() + (6 - showingDate.getDay()));
    dateText = firstDayOfWeek.getDate() + '-' + lastDayOfWeek.getDate() + ' ' + monthShortNames[showingDate.getMonth()] + ', ' + showingDate.getFullYear();

  } else if (calendarView == 'day') {
    dateText = showingDate.getDate() + ' ' + monthNames[showingDate.getMonth()] + ', ' + showingDate.getFullYear();
  }

  currentMonthDOM.text(dateText);

}

// Set the primary state of the cells of the month view of the calendar
var setMonthCells = function() {
  // Set number of cells and number of days of other months
  var nCells = 42;
  var nBlankCells = nCells - numOfDays;

  // Get the number of days of the previous month
  var prevNumOfDays = '';
  if (showingDate.getMonth() == 0) {
    prevNumOfDays = dayPerMonth[11];
  } else {
    prevNumOfDays = dayPerMonth[showingDate.getMonth() - 1];
  }

  // Get the first week of the month
  var firstWeekDayOfMonth = new Date(monthNames[showingDate.getMonth()] + ' 1 ,' + showingDate.getFullYear()).getDay();

  // Get how many days we need of the previous month
  prevNumOfDays -= firstWeekDayOfMonth - 1;

  // Set the cells of the previous month
  for (var i = 0; i < firstWeekDayOfMonth; i++) {
    $('.day-table td:eq(' + i + ')').addClass('other-month-cell');
    $('.day-table td:eq(' + i + ') span').text(prevNumOfDays++);
    nBlankCells--;
  }

  // Set the cells of the current month
  var dayCounter = 1;
  for (var i = firstWeekDayOfMonth; i < nCells - nBlankCells; i++) {
			$('.day-table td:eq(' + i + ') span').text(dayCounter++);
			$('.day-table td:eq(' + i + ')').addClass('day-cell');
  }

  // Search for the events of this month and added to the DOM
  var daysOfTheMonth = (nCells - nBlankCells) - firstWeekDayOfMonth;
  var startDate = new Date(showingDate.getFullYear(), showingDate.getMonth(), 1, 0, 0, 0, 0);
  var endDate = new Date(showingDate.getFullYear(), showingDate.getMonth(), daysOfTheMonth, 23, 59, 59, 999);
  wz.calendar.getAccounts(function(err, accounts) {

    accounts[0].getCalendars(function(err, calendars) {

      for (var i = 0; i < calendars.length; i++) {
        (function( i ){

          calendars[i].getEventsByDate(startDate.getTime(), endDate.getTime(), function(err, events) {
            for(var j = 0; j<events.length; j++){
              var event = new Event();
              addEventToDom(events[j],calendars[i], false);
            }
          });

        })( i );
      }

    });

  });

  // Set the cells of the next month
  dayCounter = 1;
  for (var i = nCells - nBlankCells; i < nCells; i++) {
    $('.day-table td:eq(' + i + ')').addClass('other-month-cell');
    $('.day-table td:eq(' + i + ') span').text(dayCounter++);
  }

  // Adds click functionality to each cell
  addByClick();


  // If today is in the month, highlight the day
  var now = new Date();
  var cellToHighlight = '';
  if(showingDate.getMonth() == now.getMonth() && showingDate.getFullYear() == now.getFullYear()){
    cellToHighlight = $('.day-table td:eq(' + (firstWeekDayOfMonth + (now.getDate() - 1)) + ')');
  }

  return cellToHighlight;
}

// Set the primary state of the cells of the week view of the calendar
var setWeekCells = function() {

  // Set current date text
  $('.week-day-name .week-day:eq(' + showingDate.getDay() + ')').text(showingDate.getDate() + ' ' + dayNames[showingDate.getDay()]);

  // Set previous dates texts of the week
  var firstDayOfWeek = '';
  var showingDateAux = new Date(showingDate.getTime());

  for (var i = showingDate.getDay() - 1; i >= 0; i--) {

    showingDateAux.setDate(showingDateAux.getDate() - 1);
    $('.week-day-name .week-day:eq(' + i + ')').text(showingDateAux.getDate() + ' ' + dayNames[showingDateAux.getDay()]);
    if(i == 0){
      firstDayOfWeek = new Date(showingDateAux.getTime());
    }

  }

  // Set next date texts of the week
  var lastDayOfWeek = '';
  showingDateAux = new Date(showingDate.getTime());

  for (var i = showingDate.getDay() + 1; i < 7; i++) {

    showingDateAux.setDate(showingDateAux.getDate() + 1);
    $('.week-day-name .week-day:eq(' + i + ')').text(showingDateAux.getDate() + ' ' + dayNames[showingDateAux.getDay()]);
    if(i == 6){
      lastDayOfWeek = new Date(showingDateAux.getTime());
    }

  }

  // Adds click functionality to each cell
  addByClick();

  // Search for the events of this week and added to the DOM
  var startDate = new Date(firstDayOfWeek.getFullYear(), firstDayOfWeek.getMonth(), firstDayOfWeek.getDate(), 0, 0, 0, 0);
  var endDate = new Date(lastDayOfWeek.getFullYear(), lastDayOfWeek.getMonth(), lastDayOfWeek.getDate(), 23, 59, 59, 999);
  wz.calendar.getAccounts(function(err, accounts) {
    accounts[0].getCalendars(function(err, calendars) {
      for (var i = 0; i < calendars.length; i++) {
        (function( i ){
          calendars[i].getEventsByDate(startDate.getTime(), endDate.getTime(), function(err, events) {
            for(var j = 0; j<events.length; j++){
              var event = new Event();
              addEventToDom(events[j],calendars[i], false, [startDate, endDate]);
            }
          });
        })( i );
      }
    });
  });


  // If today is in the week, highlight the day
  var now = new Date();
  var cellToHighlight = '';
  if(todayInWeek(firstDayOfWeek) && showingDate.getFullYear() == now.getFullYear()){
    cellToHighlight = $('.time-events td.time-col:eq(' + (now.getDay()) + ')');
  }

  return cellToHighlight;
}

// Set the primary state of the cells of the day view of the calendar
var setDayCells = function() {

  var nCells = 42;
  var nBlankCells = nCells - numOfDays;
  var firstWeekDayOfMonth = new Date(monthNames[showingDate.getMonth()] + ' 1 ,' + showingDate.getFullYear()).getDay();
  nBlankCells = nBlankCells - firstWeekDayOfMonth;

  var dayCounter = 1;
  for (var i = firstWeekDayOfMonth; i < nCells - nBlankCells; i++) {
    $('.mini-calendar-body table td:eq(' + i + ')').text(dayCounter++);
    $('.mini-calendar-body table td:eq(' + i + ')').addClass('day-cell');
  }

  dayNumberDisplay.text(showingDate.getDate());
  dayNameDisplay.text(dayNames[showingDate.getDay()]);
  miniCalendarTittle.text(monthNames[showingDate.getMonth()] + ' ' + showingDate.getFullYear());

  addByClick();

  var currenDate = new Date();
  var dayToSelect = $('.mini-calendar-body table td:eq(' + (firstWeekDayOfMonth + (currenDate.getDate() - 1)) + ')');

  return dayToSelect;

}

// Set the primary state of the cells of the date dropdown calendar
var setDropCalendarCells = function(){

	var nCells = 42;
  var nBlankCells = nCells - numOfDays;
  var firstWeekDayOfMonth = new Date(monthNames[showingDate.getMonth()] + ' 1 ,' + showingDate.getFullYear()).getDay();
  nBlankCells = nBlankCells - firstWeekDayOfMonth;

  var dayCounter = 1;
  for (var i = firstWeekDayOfMonth; i < nCells - nBlankCells; i++) {
    $('.date-dropdown .mini-calendar-body table td:eq(' + i + ')').text(dayCounter++);
    $('.date-dropdown .mini-calendar-body table td:eq(' + i + ')').addClass('day-cell');
		$('.date-dropdown .mini-calendar-body table td:eq(' + i + ')').on('click', function(){
			var object = $(this);
			var prevDate = '';
			var newDate = '';
			var newDay = object.text();
			var dayList = dateDropDown.find('.day-cell');
			newDay = addZeroToHour(newDay);

			if(dateDropDown.hasClass('start')){

				prevDate = eventWhen.eq(0).find('input').val();
				newDate = prevDate.substr(0,3)+newDay+prevDate.substr(5,5);
				eventWhen.eq(0).find('input').val(newDate);
				eventWhen.eq(1).find('input').val(newDate);
				for(var i = 0; i<parseInt(object.text())-1 ;i++){
					dayList.eq(i).addClass('inactive');
					dayList.eq(i).off('click');
				}

			}else if(dateDropDown.hasClass('end')){

				prevDate = eventWhen.eq(1).find('input').val();
				newDate = prevDate.substr(0,3)+newDay+prevDate.substr(5,5);
				eventWhen.eq(1).find('input').val(newDate);
				for(var i = parseInt(object.text()); i<dayList.length ;i++){
					dayList.eq(i).addClass('inactive');
					dayList.eq(i).off('click');
				}

			}
      eventWhen.find('input').removeClass('active');
			dateDropDown.hide();
		});
  }

}


// Clean all the cells of the calendar
var cleanCells = function() {

  for (var i = 0; i < 42; i++) {
    $('.day-table td:eq(' + i + ') span').text('');
    $('.day-table td:eq(' + i + ') article').remove();
    $('.day-table td:eq(' + i + ')').removeClass();
  }
  $('.week-calendar .event').remove();
  for (var i = 0; i < 42; i++) {
    $('.mini-calendar-body table td:eq(' + i + ')').text('');
    $('.mini-calendar-body table td:eq(' + i + ')').removeClass();
  }
	cleanDropdownCalendarCells();

}

var cleanDropdownCalendarCells = function(){

	var dayList = dateDropDown.find('td');
	for (var i = 0; i < dayList.length; i++) {
  	dayList.eq(i).text('');
    dayList.eq(i).removeClass();
  }

}

// Return a Date object with the date selected
var getDaySelected = function() {
  return new Date(monthNames[showingDate.getMonth()] + ' ' + $('.day-selected span').text() + ' ,' + showingDate.getFullYear());
}

// Set the colored line in the current time
var setHour = function() {

  $('.visible.day-moment-bullet').remove();
  $('.visible.day-moment-time').remove();
  $('.visible.day-moment').remove();

  var currentDate = new Date();
  var hour = currentDate.getHours();
  var minutes = ('0' + currentDate.getMinutes()).slice(-2);
  var offset = (41 * hour) + (0.66666666 * minutes);
  var dayMomentBar = dayMomentBarPrototype.clone();
  var dayMomentBullet = dayMomentBulletPrototype.clone();
  var dayMomentTime = dayMomentTimePrototype.clone();
  dayMomentBar.removeClass('wz-prototype');
  dayMomentBullet.removeClass('wz-prototype');
  dayMomentTime.removeClass('wz-prototype');
  dayMomentBar.addClass('visible');
  dayMomentBullet.addClass('visible');
  dayMomentTime.addClass('visible');

  dayMomentTime.text(hour + ':' + minutes);
  if (10 > +(minutes) > 50) {
    dayMomentTime.css('background-color', '#f6f8f8');
  }

  dayMomentBar.css('top', offset + 'px');
  dayMomentTime.css('top', (offset - 16) + 'px');
  dayMomentBullet.css('top', (offset - 6) + 'px');

  if (minutes != 0) {
    $('.time-events tbody').append(dayMomentTime);
    $('.time-cells tbody').append(dayMomentTime.clone());
  }

  $('.time-events tbody').append(dayMomentBar);
  $('.week-calendar .day-selected').append(dayMomentBullet);
  $('.time-cells tbody').append(dayMomentBar.clone());

}

// Make editable the event
var makeItEditable = function(eventDom, event){

	eventDom.on('dblclick', function(e){

    // Stop propagation of the event to the parent
    e.stopPropagation();
    // Open the new event modal
		createEvent.click();
    // Set the name of the event
		eventName.val(event.title);
    // Set the calendar in use for the event
		var calendars = calendarDropDown.find('.calendarDom');
		for(var i = 0; i < calendars.length; i++){
			if(calendars.eq(i).find('.ellipsis').text() == event.calendar.displayname){
				calendarDropDown.find('.active').removeClass('active');
				calendars.eq(i).addClass('active');
				eventColor.find('.color').css('background-color', calendars.eq(i).find('.color').css('background-color'));
				eventColor.find('.ellipsis').text(calendars.eq(i).find('.ellipsis').text());
				break;
			}
		}
    // Set the date and time for the event
		eventWhen.eq(0).find('input').val(addZeroToHour(event.startDate.getMonth())+'/'+addZeroToHour(event.startDate.getDate())+'/'+event.startDate.getFullYear());
		eventTime.eq(0).find('input').val(addZeroToHour(event.startDate.getHours())+':'+addZeroToHour(event.startDate.getMinutes()));
    eventWhen.eq(1).find('input').val(addZeroToHour(event.endDate.getMonth())+'/'+addZeroToHour(event.endDate.getDate())+'/'+event.endDate.getFullYear());
		eventTime.eq(1).find('input').val(addZeroToHour(event.endDate.getHours())+':'+addZeroToHour(event.endDate.getMinutes()));
    // Set if the event was all-day
    if(event.allDay){
      eventAllDay.find('input').click();
    }
    // Set the repeat for the event
    repeatDropDown.find('.active').removeClass('active');
    var newRepeat = repeatDropDown.find('article').eq(event.repeat);
    newRepeat.addClass('active');
    eventRepeat.find('input').val(newRepeat.text());
    // Set the description area
    eventDescription.find('textarea').val(event.description);
    // Set the TAG to inform thats it is an edit
    createEventModal.data('mode', 'edit');
    deleteEventButton.css('display', 'block');
    addEventButton.text('EDIT');
    // Delete event
    deleteEventButton.on('click', function() {
      //console.log(event.calendar);
      event.calendar.getEvent(eventDom.data('id'), function(err,CalendarEvent){
        CalendarEvent.delete(function(err){
          console.log(err);
        });
      });
    });
	});

}

// Add event to the DOM
var addEventToDom = function(eventApi, calendar, reinserting, dateInterval) {

  addEventButton.text('CREATE');
  deleteEventButton.css('display', 'none');

	var event = new Event();

  event.title = eventApi.title;
  event.description = eventApi.description;
  event.allDay = eventApi.allDay;
  event.calendar = calendar;
  if(!reinserting){
    event.startDate = new Date(eventApi.start.date);
    event.endDate = new Date(eventApi.end.date);
  }else{
    event.startDate = eventApi.startDate;
    event.endDate = eventApi.endDate;
  }
	// If the event have to be repeted
	if(eventRepeat.find('input').val() == 'Every week'){
	}

	// In case of an event which last for more than one day, repeat the event the necessary number of times
	if((event.startDate.getDate() != event.endDate.getDate()) && !reinserting){

		var plusDuration = (event.endDate.getDate()-event.startDate.getDate());
		var dateRecuperate = event.startDate;
    for(var i = 0; i<plusDuration; i++){
			var startDay = new Date();
      startDay.setDate(event.startDate.getDate() + 1);
      startDay.setHours(event.startDate.getHours());
      startDay.setMinutes(event.startDate.getMinutes());
      event.startDate = startDay;
      addEventToDom(event, calendar, true, dateInterval);
		}
    event.startDate = dateRecuperate;
	}

	// Set the event color
  for ( var i=0; i<colorPalette.length; i++ ){

    if( colorPalette[i].border == calendar['calendar-color'] ){

      event.color = colorPalette[i];
      break;

    }

  }

	// Insert event in the DOM
  if (calendarView == 'month') {

		// Prepare the cell where is going to be inserted
		var cells = $('.month-calendar .day-cell');
		event.cell = cells.eq(event.startDate.getDate()-1);
    win.data(event.title, eventApi);

		var eventDom = '';
		if(event.allDay){

			eventDom = monthAllDayEventPrototype.clone();
			eventDom.css('background-color', event.color.light);
			eventDom.find('.all-day-text').text(event.title);

		}else{

			eventDom = monthEventPrototype.clone();
      eventDom.find('.all-day-text').text(event.title);
			eventDom.find('figure').css('background-color', event.color.border);

		}

    // Prepare the calendar where is going to be inserted
    var calendarToSearch = eventColor.find('span').text();
    account.getCalendars(function(err, list) {
      for(var i = 0; i< list.length; i++){
        if(calendarToSearch == list[i].displayname){
          event.calendar = list[i];
          break;
        }
      }
    });

    eventDom.removeClass('wz-prototype');

    makeItEditable(eventDom, event);


		if (event.cell.find('article').length < 3 || eventDom.hasClass('all-day-event')) {

			if(eventDom.hasClass('event') || event.cell.find('article').length < 1){

				event.cell.append(eventDom);

			}else if(eventDom.hasClass('all-day-event')){

				eventDom.insertBefore(event.cell.find('article').eq(0));
				if(event.cell.find('article').length > 2){

					event.cell.find('article').eq(2).hide();
					var moreEvents = event.cell.find('.moreEvents');
					if (moreEvents.length == 0) {

						var moreEvents = monthEventPrototype.clone();
						moreEvents.removeClass('ellipsis');
						moreEvents.removeClass('wz-prototype');
						moreEvents.addClass('moreEvents');
						moreEvents.text('1 more...');
						moreEvents.data('numEventsMore', 1)
						event.cell.append(moreEvents);

					} else {

						var numEventsMore = moreEvents.data('numEventsMore');
						numEventsMore++;
						moreEvents.data('numEventsMore', numEventsMore);
						moreEvents.text(numEventsMore + ' more...');
						event.cell.append(moreEvents);

					}

				}

			}

		} else {

			var moreEvents = event.cell.find('.moreEvents');
			if (moreEvents.length == 0) {

				var moreEvents = monthEventPrototype.clone();
				moreEvents.removeClass('ellipsis');
				moreEvents.removeClass('wz-prototype');
				moreEvents.addClass('moreEvents');
				moreEvents.text('1 more...');
				moreEvents.data('numEventsMore', 1)
				eventDom.hide();
				event.cell.append(eventDom);
				event.cell.append(moreEvents);

			} else {

				var numEventsMore = moreEvents.data('numEventsMore');
				numEventsMore++;
				moreEvents.data('numEventsMore', numEventsMore);
				moreEvents.text(numEventsMore + ' more...');
				eventDom.hide();
				event.cell.append(eventDom);
				event.cell.append(moreEvents);

			}

		}
  } else if ( calendarView == 'week'  && ((dateInterval[0].getDate()-1) < event.startDate.getDate()) && (event.startDate.getDate() < (dateInterval[1].getDate()+1))) {

    // Prepare the cell where is going to be inserted
    var cell = '';

		// Add functionality to edit the event
    /*
		makeItEditable(eventDom, event);
    */

    // Clone the proyotype and set the properties of it
    var eventDom = weekEventPrototype.clone();
    eventDom.removeClass('wz-prototype');
    eventDom.find('span:eq(0)').text(event.title);
    eventDom.css('border-left', '2px solid ' + event.color.border);
    eventDom.css('background-color', event.color.light);
    eventDom.css('color', event.color.text);

    // If is an all-day event
    if (event.allDay) {

      cell = $('.day-all-day:eq(' + (event.startDate.getDay()) + ')');
      eventDom.css('display', 'inline-block');
      eventDom.css('margin-left', '-1.6px');
      eventDom.css('width', '101px');
      if (cell.children().length > 0) {
        var nEvents = cell.data('nEvents') + 1;
        var nextTop = cell.data('nextTop');
        cell.data('nEvents', nEvents);
        $('.day-all-day').css('height', 20 * nEvents);
        $('.scroll-time-events').css('height', (481 - parseInt($('.week-top-container').css('height'))));
        eventDom.css('margin-top', nextTop + 'px');
        cell.data('nextTop', nextTop + 18);
      } else {
        cell.data('nEvents', 1);
        cell.data('nextTop', 18);
      }

    // If is a normal event
    }else{

      cell = $('.hour-markers .marker-cell:eq(' + (event.startDate.getHours()) + ')');
      var eventTimeString = addZeroToHour(event.startDate.getHours()) + ':'+ addZeroToHour(event.startDate.getMinutes()) +'-'+ addZeroToHour(event.endDate.getHours()) + ':'+ addZeroToHour(event.endDate.getMinutes());
      eventDom.find('span:eq(1)').text(eventTimeString);
      eventDom.css('left', 14.28 * event.startDate.getDay() + '%');
      var hourDuration = event.endDate.getHours() - event.startDate.getHours();
      var minuteDuration = event.endDate.getMinutes() - event.startDate.getMinutes();
      var eventMinuteDuration = hourDuration*60 + minuteDuration;

      if(eventMinuteDuration <= 30 ){
        eventDom.find('span:eq(1)').text('');
        eventDom.css('height', '19px');
      }else{
        eventDom.css('height' , 0.666666 * eventMinuteDuration + 'px');
      }
      var minuteStart = event.startDate.getMinutes();
      eventDom.css('margin-top', 0.666666 * minuteStart + 'px');

    }
    cell.append(eventDom);

  } else if (calendarView == 'day') {

    var found = '-1';
    var events = eventList.find('.event');
    var eventTimeString = eventTime.hour + ':' + eventTime.minutes + ' - ' + (eventTime.hour + (+(eventDuration.val().substring(0, 2)))) + ':' + eventTime.minutes;
    for (var i = 0; i < events.length; i++) {
      if (event.startDate.getDate() == events.eq(i).data('event').getDate()) {
        found = $(events[i]);
      }
    }
    if (found != '-1') {

      var eventDom = eventList.find('.event').clone();
      eventDom.find('.event-info').find('span:first-child').text(event.title);
      eventDom.find('.event-info').find('span:last-child').text(eventTimeString);
      found.after(eventDom);
      eventList.find('.event').data('event', event.startDate);

    } else {

      var eventDom = dayEventProtoype.clone();
      eventDom.removeClass('wz-prototype');
      eventDom.find('.day-head').data('date', event.startDate);
      var today = event.startDate.getDate() == new Date() ? true : false;
      if (today) {
        eventDom.find('.day-head').find('span:first-child').text('Today');
        eventDom.find('.day-head').find('span:last-child').text(event.stringDate);
      } else {
        eventDom.find('.day-head').find('span:first-child').text(dayNames[event.startDate.getDay()]);
        eventDom.find('.day-head').find('span:last-child').text(event.stringDate);
      }
      eventDom.find('.event-info').find('span:first-child').text(event.title);
      eventDom.find('.event-info').find('span:last-child').text(eventTimeString);
      eventList.append(eventDom);
      eventList.find('.event').data('event', event.startDate);

    }
  }
}

// Add event to the API
var addEvent = function(calendar, eventApi){

  console.log('Voy a añadir evento');
  console.log(eventApi);

	calendar.createEvent(eventApi, function(err, event) {
    //LA API CRASHEA -X-
    addEventToDom(event, calendar, false);
  });

}

// Add calendar to the DOM
var addCalendarToDom = function(calendar2) {

  var calendar = new Calendar();
  calendar.name = calendar2.displayname;
  calendar.color = normalizeColor(calendar2['calendar-color']);
  for(var j = 0; j < colorPalette.length; j++){
    if(colorPalette[j].border == calendar.color){
      calendar.color = j;
      break;
    }
  }

	var calendarShowList = addCalendarToShowList(calendar);
  var calendarDom = calendarPrototype.clone();
  calendarDom.removeClass('wz-prototype');
  calendarDom.addClass('calendarDom');
  calendarDom.find('.calendar-name').text(calendar.name);
	calendarDom.data('color', calendar.color);
  calendarDom.find('figure').css('background-color', normalizeColor(colorPalette[calendar.color].border));

  calendarDom.find('.deleteCalendar').on('click', function() {

    calendar2.delete();
		calendarDom.remove();
		calendarShowList.remove();

  });
  calendarList.append(calendarDom);

}

// Add calendar to the API
var addCalendar = function(calendarApi){

	account.createCalendar(calendarApi, function(err, cal) {
			//calendarDom.data('calendarApi', cal);
      addCalendarToDom(cal);
	});

}

// Add calendar to show list
var addCalendarToShowList = function(calendar){

	var calendarDom = calendarSelectorProtoype.clone();
	calendarDom.removeClass('wz-prototype');
	calendarDom.addClass('calendarDom');
	calendarDom.data('color', calendar.color);
	calendarDom.find('.color').css('background-color', colorPalette[calendar.color].border);
	calendarDom.find('span').text(calendar.name);
	calendarDom.on('click', function(){

		var object = $(this);
		$('.calendar-dropdown .calendarDom.active').removeClass('active');
		object.addClass('active');
		eventColor.find('.color').css('background-color', object.find('.color').css('background-color'));
		eventColor.find('.ellipsis').text(object.find('.ellipsis').text());
		calendarDropDown.toggle();

	});
	calendarDropDown.find('.calendars').append(calendarDom);
	return calendarDom;

}

// Add events by clicking
var addByClick = function() {

  $('td').off('dblclick');
  var event = new Event();

  if (calendarView == 'month') {

    $('.day-cell').on('dblclick', function() {
      var object = $(this);

			// Clean inputs
			cleanNewEventModal();

			// Set the cells and the current day on dropdown calendar
			setDropCalendarCells();
			setCurrentDayDropCalendar();

			// Prepare string date to show
			setStringDate(object.find('span').text(), (showingDate.getMonth()+1).toString(), showingDate.getFullYear());

			// Set default hour in the new event modal
			setDefaultHour();

			// Prepare the calendar which is active
			setActiveCalendar();

			// Display create event menu
      showMenu('.create-event-modal', true);
    });

  } else if (calendarView == 'week') {

    $('.time-col').on('dblclick', function() {
      var object = $(this);

      // Clean inputs
			cleanNewEventModal();

      // Set the cells and the current day on dropdown calendar
			setDropCalendarCells();
			setCurrentDayDropCalendar();

      // Prepare string date to show
      var day = $('.week-day-names th:eq(' + (object.index() - 1) + ')').find('span').text().substring(0, 2);
			setStringDate(day, (showingDate.getMonth()+1).toString(), showingDate.getFullYear());

      // Set default hour in the new event modal
			setDefaultHour();

			// Prepare the calendar which is active
			setActiveCalendar();

			// Display create event menu
      showMenu('.create-event-modal', true);
    });

    $('.day-all-day').on('dblclick', function() {
      var object = $(this);

      // Clean inputs
			cleanNewEventModal();

      // Set the cells and the current day on dropdown calendar
			setDropCalendarCells();
			setCurrentDayDropCalendar();

      // Prepare string date to show
      var day = $('.week-day-names th:eq(' + (object.index() - 1) + ')').find('span').text().substring(0, 2);
			setStringDate(day, (showingDate.getMonth()+1).toString(), showingDate.getFullYear());

      // Set all day
      eventAllDay.find('label').click();
      eventAllDay.find('input').addClass('checked');
      eventAllDay.find('input').attr('checked', 'checked');

      // Set default hour in the new event modal
			setDefaultHour();

			// Prepare the calendar which is active
			setActiveCalendar();

      // Display create event menu
      showMenu('.create-event-modal', true);
    });

  } else if (calendarView == 'day') {

    $('.day-cell').on('dblclick', function() {

      var object = $(this);
      showMenu('.create-event-modal', true);
      event.stringDate = dayNames[object.index()] + ', ' + object.text() + 'th of ' + monthNames[showingDate.getMonth()] + ', ' + showingDate.getFullYear();
      $('.event-when input').val(event.stringDate);
      event.startDate = new Date(showingDate.getFullYear(), showingDate.getMonth(), showingDate.getDate());
      eventDuration.val('1 hour');

    });
  }
  createEventModal.data('event', event);
}

var recoverCalendars = function() {


  $('.calendarDom').remove();
  account.getCalendars(function(err, list) {

    for (var i = 0; i < list.length; i++) {

      //addCalendarToDom(calendar, false);
      addCalendarToDom(list[i]);
    }

  });

}

// Run code
wz.calendar.getAccounts(function(err, accounts) {
  account = accounts[0];
  recoverCalendars();
});
initCalendar();
setInterval(function() {
  setHour()
}, 60000);
