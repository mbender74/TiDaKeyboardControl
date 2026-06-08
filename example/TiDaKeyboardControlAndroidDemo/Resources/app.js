
var TiBottomSheetControllerModule = require("ti.bottomsheetcontroller");



// /**
//  * Require emitterView Module
//  */
//  var emitterViewModule = require('de.marcbender.emitterview');

// /**
//  * Require IconicFont and FontAwesome
//  */
//  var fontawesome = require('/lib/IconicFont').IconicFont({font: '/lib/FontAwesome',ligature: false});



// /**
//  * Create a new `Ti.UI.TabGroup`.
//  */
// var tabGroup = Ti.UI.createTabGroup();

// /**
//  * Add the two created tabs to the tabGroup object.
//  */
// tabGroup.addTab(createTab("Tab 1", "I am Window 1", "assets/images/tab1.png"));
// tabGroup.addTab(createTab("Tab 2", "I am Window 2", "assets/images/tab2.png"));

// /**
//  * Open the tabGroup
//  */
// tabGroup.open();

// var emitterImages = [];

// var buttonViewIsAnimating = false;
// var buttonView2IsAnimating = false;

// function generateThumbColorImage(color,icon,height){

//     return Ti.UI.createLabel({
//         width:Ti.UI.SIZE,
//         height:Ti.UI.SIZE,
//         color: color,
//         textAlign:Titanium.UI.TEXT_ALIGNMENT_CENTER,
//         font: {
//             fontSize:(!height) ? 38 : (Ti.Platform.osname === 'android') ? (height/Ti.Platform.displayCaps.logicalDensityFactor) : height-2,
//             fontFamily:fontawesome.fontfamily()
//         },
//         text: (!icon) ? fontawesome.icon('icon-thumbs-up') : fontawesome.icon(icon) 
//      }).toImage(null,false);

// }





// /**
//  * Creates a new Tab and configures it.
//  *
//  * @param  {String} title The title used in the `Ti.UI.Tab` and it's included `Ti.UI.Window`
//  * @param  {String} message The title displayed in the `Ti.UI.Label`
//  * @return {String} icon The icon used in the `Ti.UI.Tab`
//  */

// function createTab(title, message, icon) {
//     var win = Ti.UI.createWindow({
//         title: title,
//         backgroundColor: '#fff',
//         top:0,
//         bottom:0,
//         left:0,
//         right:0,
//         height:Ti.UI.FILL,
//         width:Ti.UI.FILL,
//     });

//     var label = Ti.UI.createLabel({
//         text: message,
//         color: "#333",
//         font: {
//             fontSize: 20
//         }
//     });
//     label.addEventListener("click",function(e){
//         alert("asdfasdf");
//     });

//     win.add(label);


//     /**
//      * Add images to an array that is needed for the emitterView
//      */
//     var emitterImages = [];
//     emitterImages.push("/images/heart2.png");
//     emitterImages.push(generateThumbColorImage('red','fa-heart',40));
//     emitterImages.push(generateThumbColorImage('red',null,40));
//     emitterImages.push(generateThumbColorImage('yellow',null,40));
//     emitterImages.push(generateThumbColorImage('orange',null,40));
//     emitterImages.push(generateThumbColorImage('blue',null,40));
//     emitterImages.push(generateThumbColorImage('purple',null,40));
//     emitterImages.push(generateThumbColorImage('green',null,40));
//     emitterImages.push(generateThumbColorImage('magenta',null,40));
//     emitterImages.push(generateThumbColorImage('#16c7cd',null,40));

//     /**
//      * create an emitterView
//      */
//     var emitterView = emitterViewModule.createView({
//         top:0,
//         left:0,
//         right:0,
//         bottom:0,
//         backgroundColor:'#55b55e5e',
//         height:Ti.UI.FILL,
//         width:Ti.UI.FILL,      
// 		amplitude:8, // Integer
//         maxAmplitude:28, // Integer
//         duration:(Ti.Platform.osname === 'android') ? 2.5 : 3.0, // Float - in seconds
//         maxDuration:(Ti.Platform.osname === 'android') ? 3.0 : 3.5, // Float - in seconds
//         particleImages:emitterImages, // array of images or imageBlobs
// 		lifetime:2.0,
// 	  	velocity:350
//     });

//     win.add(emitterView);

//      /**
//      * create a buttonView where the images to emit will be emitted from
//      */
//     var buttonView = Ti.UI.createView({
//         width: Ti.UI.SIZE,
//         height: Ti.UI.SIZE,
//         bottom:70,
//         left:20
//      });

//     var buttonLabel = Ti.UI.createLabel({
//         width: Ti.UI.SIZE,
//         height: Ti.UI.SIZE,
//         color: 'blue',
//         textAlign:Titanium.UI.TEXT_ALIGNMENT_CENTER,
//         font: {
//             fontSize: 36,
//             fontFamily: fontawesome.fontfamily()
//         },
//         text:fontawesome.icon('icon-thumbs-up')
//     });
//     buttonView.add(buttonLabel);

//     var buttonView2 = Ti.UI.createView({
//         width: Ti.UI.SIZE,
//         height: Ti.UI.SIZE,
//         bottom:100,
//         right:20
//      });

//     var buttonLabel2 = Ti.UI.createLabel({
//         width: Ti.UI.SIZE,
//         height: Ti.UI.SIZE,
//         color: 'red',
//         textAlign:Titanium.UI.TEXT_ALIGNMENT_CENTER,
//         font: {
//             fontSize: 36,
//             fontFamily: fontawesome.fontfamily()
//         },
//         text:fontawesome.icon('fa-heart')
//     });
//     buttonView2.add(buttonLabel2);


//  /**
//  * Define Buttons touch animations
//  */
//     var touchStartAnim = Titanium.UI.createAnimation({
//         duration: 90,
//         opacity: 0.3,
//         autoreverse:true
//     });
//     touchStartAnim.addEventListener('complete', function() {
//         buttonViewIsAnimating = false;
//     });

//     var touchStartAnim2 = Titanium.UI.createAnimation({
//         duration: 90,
//         opacity: 0.3,
//         autoreverse:true
//     });
//     touchStartAnim2.addEventListener('complete', function() {
//         buttonView2IsAnimating = false;
//     });


//     /**
//      * create an eventLister for the buttonView which will call the 'emitterView.emitImage({PARAMS})' method
//      * for iOS 'singletap' is the prefered listener, for Android 'touchstart' is prefered
//      * 'click' listener is to slow to emit the images fast... but you decide what you do... just a proposal....
//      */
//      buttonView.addEventListener("touchstart",function(e){
//         if (buttonViewIsAnimating == false){
//             buttonViewIsAnimating = true;
//             buttonView.animate(touchStartAnim);
//         }
//             // the emitImage method can also be called without the button 'singletap' listener, it´s important that the parameter 'sourceView' is set to a view where the images will be emitted from
//             emitterView.emitImage({
//                 sourceView:buttonView, // obligatory!!!
//                 startId:3, // optional
// 				emitValue:8,
// 				emitSpread:28,
// 				emitScaleRange:0.1,
// 				direction: emitterViewModule.DIRECTION_UP,
//                 endId:emitterImages.length, // optional
//                 // id:1 // optional - select a specific image from the 'particleImages' array to be emitted
//             });

//     });


//     buttonView2.addEventListener("touchstart",function(e){
//         if (buttonView2IsAnimating == false){
//             buttonView2IsAnimating = true;
//             buttonView2.animate(touchStartAnim2);
//         } 
//             // the emitImage method can also be called without the button 'singletap' listener, it´s important that the parameter 'sourceView' is set to a view where the images will be emitted from
//             emitterView.emitImage({
//                 sourceView:buttonView2, // obligatory!!!
// 				direction: emitterViewModule.DIRECTION_UP,
// 				emitValue:2,
// 				emitSpread:60,
// 				emitScaleRange:0.9,
//                // startId:1, // optional - start by 1
//                // endId:2, // optional - ends by particleImages.length
//                 id:1 // optional - select a specific image from the 'particleImages' array to be emitted
//             });

//     });
//     win.add(buttonView);
//     win.add(buttonView2);

//     var tab = Ti.UI.createTab({
//         title: title,
//         icon: icon,
//         window: win
//     });

//     return tab;
// }




// ── Module reference ───────────────────────────────────────────────────────

// var popoverModule = require('ti.popover');

// var win = Ti.UI.createWindow({backgroundColor: 'green'});

// var label = Ti.UI.createLabel({
// 	text: 'Bottom Sheet Content',
// 	top: 60,
// 	backgroundColor: 'green',
// 	color: '#900',
//     font: { fontSize:48 },
//     shadowColor: '#aaa',
//     shadowOffset: {x:5, y:5},
//     shadowRadius: 3,
//     calcRealSize:true,
//     textAlign: Ti.UI.TEXT_ALIGNMENT_CENTER,
// });
// win.add(label);

// var button = Ti.UI.createButton({
// 	left: 20,
// 	top:180,
// 	title: 'Open Popover!'
// });

// button.addEventListener('click', function(e){
//     popover.show({ 
// 	  view: button,
//       cornerRadius: 12,
//       showsDimBackground: false,
//       blurBackground: false,
//       showsArrow: true,
// 	  animated:true,
// 	  transitionDuration: 0.1,
//       transitionStyle: popoverModule.TRANSITION_STYLE_SCALE 
// 	});
// })

// win.add(button);


// var contentViewForPopover = Ti.UI.createView({
// 		backgroundColor: 'yellow',
// 		top:10,
// 		bottom:10,
// 		left:10,
// 		right:10,
// 		width: 180,
//         height: 80,
// 		layout: 'vertical'
// });

// var popover = popoverModule.createPopover({
// 	shadowColor: '#000000',
//     shadowOpacity: 0.9,
//     shadowRadius: 15,
//     shadowOffset: { x: 0, y: 4 },
//     contentView: contentViewForPopover,
//     arrowDirection: popoverModule.POPOVER_ARROW_DIRECTION_UP_LEFT,
//     popoverBlurStyle: popoverModule.BLUR_EFFECT_STYLE_SYSTEM_MATERIAL
// });

// win.open();



// // Example app for ti.bottomsheetcontroller module
// var win = Ti.UI.createWindow({
// 	backgroundColor: 'white'
// });

// var TiBottomSheetControllerModule = require("ti.bottomsheetcontroller");

// // Create content view for the bottom sheet
// var contentView = Ti.UI.createView({
// 	backgroundColor: '#ffffff',
// 	layout: 'vertical'
// });

// var label = Ti.UI.createLabel({
// 	text: 'Bottom Sheet Content',
// 	font: { fontSize: 20, fontWeight: 'bold' },
// 	color: '#000',
// 	top: 60,
// 	left: 20,
// 	right: 20,
// 	textAlign: 'center'
// });

// var button = Ti.UI.createButton({
// 	title: 'Close Bottom Sheet',
// 	top: 100,
// 	left: 20,
// 	right: 20,
// 	height: 44
// });

// contentView.add(label);
// contentView.add(button);

// // Create close button
// var closeButton = Ti.UI.createButton({
// 	title: '✕',
// 	width: 30,
// 	height: 30,
// 	font: { fontSize: 16 }
// });

// // Create the bottom sheet
// var bottomSheetController = TiBottomSheetControllerModule.createBottomSheet({
// 	width:400,
// 	detents:{
// 		large:false,
// 		medium:false,
// 		small:false
// 	}, // "small" has effect only when "nonSystemSheet:true"
// 	customDetents:{
// 		customA:100,
// 		customB:200,
// 		customC:300 // more possible!
// 	},
// 	startDetent:'customA', // medium or large -  when "nonSystemSheet:true" also "small" is possible -- when startDetent is "small" and detents:{small:false} is defaults to "medium" and so on... when customDetents are set enter here the "key" as string
// 	preferredCornerRadius:20,
// 	prefersEdgeAttachedInCompactHeight:true, // has effect only when "nonSystemSheet:false" - A Boolean value that determines whether the sheet attaches to the bottom edge of the screen in a compact-height size class.
// 	prefersScrollingExpandsWhenScrolledToEdge:false, // has effect only when "nonSystemSheet:false"
// 	widthFollowsPreferredContentSizeWhenEdgeAttached:true, // has effect only when "nonSystemSheet:false"
// 	nonModal:false, // has effect ONLY when "nonSystemSheet:false" on iOS >= 15
// 	largestUndimmedDetentIdentifier:'small', // medium or large (also "small" available when "nonSystemSheet:true") - if not set, it is full dimmed depending on activated detents when "nonSystemSheet:true" the property also allow to interact with the view in the background of the bottomSheet - when not dimmed, when dimmed interaction is not possible with the view in the background ---  when customDetents are set enter here the "key" as string
// 	contentView: contentView,
// 	closeButton: closeButton,
// 	backgroundColor:'#eeeeee', 
// 	prefersGrabberVisible:true, // bottomSheet grabberHandle visible true / false
// 	systemSheetDisablePanGestureDismiss:false,

// 	nonSystemSheet:true, // defaults to "true" if not set - non iOS 15 SheetController (backwards compatible to non iOS15) when "true" - iOS15+ SheetController when "false" - if non iOS15 and set to "false" it also defaults to "true"
// 	nonSystemSheetAutomaticStartPositionFromContentViewHeight:false, // when this property is "true" the nonSystemSheet opens in the height of the contentView, all detents are disabled, only this state is active, "startDetent" property is ignored, also the "detents" property is ignored -- if you want an undimmed background, then you need to set property "largestUndimmedDetentIdentifier" to "large"
// 	nonSystemSheetSmallHeight:200, 
// 	nonSystemSheetMediumHeight:400, 
// 	nonSystemSheetLargeHeight:700,
// 	//nonSystemSheetHandleColor:'red',
// 	nonSystemSheetDisablePanGestureDismiss:true, // disables the pan gesture (drag down to close), closing is only possible via closeButton then OR via "close" method
// 	nonSystemSheetDisableDimmedBackgroundTouchDismiss:false, // disables the touch event on the dimmed backgroundView that will close the sheetController

// 	nonSystemSheetDisableDimmedBackground:false, // disables the dimmed backgroundView of the sheetcontroller
// 	nonSystemSheetTopShadow:true, // has effect only on "nonSystemSheet:true"
// 	nonSystemSheetShouldScroll:false, // when your contentView is not a scrollable view, then this activates scrolling if the contentView is larger then the bottomSheet 
	


// });

// // Handle close button click
// button.addEventListener('click', function() {
// 	bottomSheetController.close({ animated: true });
// });

// closeButton.addEventListener('click', function() {
// 	bottomSheetController.close({ animated: true });
// });

// // Event listeners
// bottomSheetController.addEventListener('open', function(e) {
// 	Ti.API.info('Bottom Sheet opened');
// });

// bottomSheetController.addEventListener('close', function(e) {
// 	Ti.API.info('Bottom Sheet closed');
// });

// bottomSheetController.addEventListener('dismissing', function(e) {
// 	Ti.API.info('Bottom Sheet dismissing');
// });

// bottomSheetController.addEventListener('detentChange', function(e) {
// 	Ti.API.info('Detent changed to: ' + e.selectedDetentIdentifier);
// });

// // Create open button
// var openButton = Ti.UI.createButton({
// 	title: 'Open Bottom Sheet',
// 	top: 50,
// 	left: 20,
// 	right: 20,
// 	height: 44
// });

// openButton.addEventListener('click', function() {
// 	bottomSheetController.open({ animated: true });
// });

// win.add(openButton);
// win.open();








// var nappDrawerModule = require('dk.napp.drawer');


// // ++++++++++++++++++++++++++++++++++++++++++++++++++++
// // Code for standalone window below
// // ++++++++++++++++++++++++++++++++++++++++++++++++++++

// var titleControl = Ti.UI.createView({
//     height:Ti.UI.SIZE,
//     width:Ti.UI.FILL,
//     backgroundColor : 'red'
// });
// titleControl.add(Ti.UI.createLabel({
//         left:96,
//         bottom:5,
//         backgroundColor : 'red',
//         text: 'Test',
//         font:{fontSize:22},
//         color: '#fff',
//         width: Ti.UI.SIZE,
//         height:36,
//         right:20
// }));

// var win = Ti.UI.createWindow({
//     title: 'Test',
//     backgroundColor: '#fff',
//     sustainedPerformanceMode:true,
//     extendSafeArea:false,
//     height:Ti.UI.FILL,
//     top:0,
//     bottom:0
//  });
 
//  var sectionFruit = Ti.UI.createTableViewSection({ headerTitle: 'Fruit' });
//  sectionFruit.add(Ti.UI.createTableViewRow({ title: 'Apples' , className :'fruits', isReusable:true }));
//  sectionFruit.add(Ti.UI.createTableViewRow({ title: 'Bananas' , className :'fruits', isReusable:true }));
//  sectionFruit.add(Ti.UI.createTableViewRow({ title: 'Apples' , className :'fruits', isReusable:true }));
//  sectionFruit.add(Ti.UI.createTableViewRow({ title: 'Bananas' , className :'fruits', isReusable:true }));
//  sectionFruit.add(Ti.UI.createTableViewRow({ title: 'Apples' , className :'fruits', isReusable:true }));
//  sectionFruit.add(Ti.UI.createTableViewRow({ title: 'Bananas' , className :'fruits', isReusable:true }));
//  sectionFruit.add(Ti.UI.createTableViewRow({ title: 'Apples' , className :'fruits', isReusable:true }));
//  sectionFruit.add(Ti.UI.createTableViewRow({ title: 'Bananas', className :'fruits', isReusable:true  }));
//  sectionFruit.add(Ti.UI.createTableViewRow({ title: 'Apples' , className :'fruits', isReusable:true }));
//  sectionFruit.add(Ti.UI.createTableViewRow({ title: 'Bananas' , className :'fruits', isReusable:true }));
 
//  var sectionVeg = Ti.UI.createTableViewSection({ headerTitle: 'Vegetables' });
//  sectionVeg.add(Ti.UI.createTableViewRow({ title: 'Carrots' , className :'Vegetables', isReusable:true }));
//  sectionVeg.add(Ti.UI.createTableViewRow({ title: 'Potatoes' , className :'Vegetables', isReusable:true}));
//  sectionVeg.add(Ti.UI.createTableViewRow({ title: 'Carrots' , className :'Vegetables', isReusable:true}));
//  sectionVeg.add(Ti.UI.createTableViewRow({ title: 'Potatoes' , className :'Vegetables', isReusable:true}));
//  sectionVeg.add(Ti.UI.createTableViewRow({ title: 'Carrots' , className :'Vegetables', isReusable:true}));
//  sectionVeg.add(Ti.UI.createTableViewRow({ title: 'Potatoes' , className :'Vegetables', isReusable:true}));
//  sectionVeg.add(Ti.UI.createTableViewRow({ title: 'Carrots' , className :'Vegetables', isReusable:true}));
//  sectionVeg.add(Ti.UI.createTableViewRow({ title: 'Potatoes' , className :'Vegetables', isReusable:true}));
//  sectionVeg.add(Ti.UI.createTableViewRow({ title: 'Carrots' , className :'Vegetables', isReusable:true}));
//  sectionVeg.add(Ti.UI.createTableViewRow({ title: 'Potatoes' , className :'Vegetables', isReusable:true}));
//  sectionVeg.add(Ti.UI.createTableViewRow({ title: 'Carrots' , className :'Vegetables', isReusable:true}));
//  sectionVeg.add(Ti.UI.createTableViewRow({ title: 'Last entry', className :'last', isReusable:true }));
 
//  var tableView = Ti.UI.createTableView({
//    backgroundColor: '#ccc',
//    data: [sectionFruit, sectionVeg],
//    top:0,
//    bottom:0,
//    minRowHeight:69,
//    rowHeight:69,
//    width:Ti.UI.FILL,
//    height:Ti.UI.FILL,
//    bubbleParent:true,
//    maxClassname:50
//  });
//     tableView.addEventListener('scrollend', function(e) {
//         //Ti.API.warn('Scrolling stopped!  contentOffset.y: ' + e.contentOffset.y);
//     });
//     tableView.addEventListener('scroll', function(e) {
//         //Ti.API.warn('Scrolling! contentOffset.y: ' + e.contentOffset.y);
//     });

//  var toolbarContainer = Ti.UI.createView({
//      backgroundColor: '#aa2f53c3',
//      width:Ti.UI.FILL,
//      height:Ti.UI.SIZE,
//      bottom:0
//    });

//  var toolbarView = Ti.UI.createView({
//     backgroundColor: '#aa2f53c3',
//     layout:'horizontal',
//     width:Ti.UI.FILL,
//     height:Ti.UI.SIZE,
//     bottom:5,
//     top:5
//   });

//   toolbarContainer.add(toolbarView);


// var send = Ti.UI.createButton({
//     title: 'Send',
//     style:Titanium.UI.BUTTON_STYLE_FILLED,
//     backgroundColor:'blue',
//     backgroundSelectedColor:'blue',
//     tintColor:'#fff',
//     textAlign:Titanium.UI.TEXT_ALIGNMENT_CENTER,
//     verticalAlign:Titanium.UI.TEXT_VERTICAL_ALIGNMENT_CENTER,
//     borderRadius:12,
//     width:Ti.UI.FILL,
//     right:10,
//     bottom:(ANDROID) ? 5 : 10
// });

// var textArea = Ti.UI.createTextArea({
//     top:8,
//     bottom:8,
//     left:15,
//     right:8,
//     autocorrect: false,
//     editable:true,
//     lines:1,
//     maxLines:5,
//     borderWidth: 1,
//     borderColor: '#aaa',
//     borderRadius: 16,
//     color: '#000',
//     backgroundColor: '#fff',
//     font: {fontSize:16, fontWeight:'normal'},
//     textAlign: 'left',
//     value: '',
//     width: '70%',
//     padding:{left:4,right:4,top:8,bottom:8},
//     height : Ti.UI.SIZE,
//     suppressReturn:false
//   });
    
//   toolbarView.add(textArea);
//   toolbarView.add(send);
     
//  if (ANDROID) {
//      var interactiveKeyboardView = keyboardControlModule.createView({
//          showKeyboardOnScrollUp:true, // show keyboard (when hidden) on scrolling up
//          autoAdjustBottomPadding:true, // scrollingView will stay at the size you set, but the scrollInsetBottom will automaticly adjust to the toolbar height (ex: blurViewToolbar, you can see the scrollingView content through the blurred toolbar)
//          autoScrollToBottom:true, // scrolling to bottom on toolbar size change
//          autoSizeAndKeepScrollingViewAboveToolbar:false, // scrollingView will be always on top of the toolbarView - the scrollingView resizes automaticly respecting the scrollingView bottom value (if set) when "true" -> "autoAdjustBottomPadding=true" has no effect
//          scrollingView:tableView, // whatever listView, tableView, scrollView -> will be automaticly added to the interactiveKeyboardView
//          toolbarView:toolbarContainer, // has to be a Ti.UI.View!!!  -> will be automaticly added to the interactiveKeyboardView
//          backgroundColor:'#fefefe',
//          top:0,
//          bottom:0
//      }); 
//      win.add(interactiveKeyboardView);
//  }
//  else {

//     var interactiveKeyboardView = keyboardControlModule.createView({
//         parentWindow:win,
//         autoAdjustBottomPadding:true,
//         autoScrollToBottom:true, // scrolling to bottom on toolbar size change
//         autoSizeAndKeepScrollingViewAboveToolbar:false, // scrollingView will be always on top of the toolbarView - the scrollingView resizes automaticly respecting the scrollingView bottom value (if set) when "true" -> "autoAdjustBottomPadding=true" has no effect in that case
//         ignoreExtendSafeArea:false, // only used whene the parentWindow has "extendSafeArea:true" AND parentWindow is a standalone window (not contained in NavigationWindow and/or TagGroup) -> the module does autodetect that!
//         scrollingView:tableView, // whatever listView, tableView, scrollView  -> will be automaticly added to the interactiveKeyboardView
//         toolbarView:toolbarContainer, // has to be a Ti.UI.View!!! -> will be automaticly added to the interactiveKeyboardView
//         textfield:textArea, // required -> put here your Ti.UI.TextArea or Titanium.UI.TextField
//         keyboardPanning:true,
//         backgroundColor:'#fefefe',
//         top:0,
//         bottom:0
//     });
//     win.add(interactiveKeyboardView);
//  }

//  win.open();



// // // ++++++++++++++++++++++++++++++++++++++++++++++++++++
// // // Code for TabGroup below
// // // ++++++++++++++++++++++++++++++++++++++++++++++++++++

// ++++++++++++++++++++++++++++++++++++++++++++++++++++
// Code for TabGroup in NavigationWindow
// ++++++++++++++++++++++++++++++++++++++++++++++++++++


/**
 * Open the tabGroup in a navigationWindow
 */
// var navigationWindow = Titanium.UI.createNavigationWindow({
//     window: tabGroup
// });
// navigationWindow.open();




var ANDROID = (Ti.Platform.osname === 'android');
var keyboardControlModule = require('de.marcbender.keyboardcontrol');

/**
 * Create a new `Ti.UI.TabGroup`.
 */
var tabGroup = Ti.UI.createTabGroup();

//  /**
//   * Add the two created tabs to the tabGroup object.
//  */
  tabGroup.addTab(createTab("AutoAdjustBottomPadding", "", "assets/images/tab1.png"));
  tabGroup.addTab(createTab("KeepScrollingViewAbove", "", "assets/images/tab2.png"));


// // ++++++++++++++++++++++++++++++++++++++++++++++++++++
// // Code for TabGroup only
// // ++++++++++++++++++++++++++++++++++++++++++++++++++++

// /**
//  * Open the tabGroup
//  */
tabGroup.open();


// /**
//  * Creates a new Tab and configures it.
//  *
//  * @param  {String} title The title used in the `Ti.UI.Tab` and it's included `Ti.UI.Window`
//  * @param  {String} message The title displayed in the `Ti.UI.Label`
//  * @return {String} icon The icon used in the `Ti.UI.Tab`
//  */
function createTab(title, message, icon) {

    var win = Ti.UI.createWindow({
       title: 'Test',
       barColor : '#365b85',
       backgroundColor: '#fff',
       extendSafeArea:false,
	   tabBarHidden:(title == "KeepScrollingViewAbove") ? true : false,
       sustainedPerformanceMode:true
    });
    

	var view = Titanium.UI.createView({
		backgroundColor:'yellow',
		width: Ti.UI.FILL,
		layout:'horizontal',
		height: 69
	});

	var label = Ti.UI.createLabel({
		text: 'LiteRTLM Chat',
		color: '#e94560',
		backgroundColor:'yellow',
		font: { fontSize: 18, fontWeight: 'bold' },
		left: 10,
		width: 200
	});

	var image = Ti.UI.createImageView({
		image:'/assets/images/tab2.png',
		animated:true,
		tintColor:'green',
		height:46,
		calcMinMax: true,
    	maxWidth: 120,
	    maxHeight: 69,
		calcMinMaxDone:false,
		averageColorDone:false,
	    noTransparency: false,
		blurredImage: false,
		blurRadius: 20
	});

	image.addEventListener('averageColor', function(e) {
		console.log('##### averageColor: ', JSON.stringify(e));
	});

	image.addEventListener('imageMinMax', function(e) {
		console.log('##### imageMinMax: ', JSON.stringify(e));
	});	

	view.add(image);
	view.add(label);

	var row = Titanium.UI.createTableViewRow({
		isReusable:true,
		height:Ti.UI.SIZE,
		opaqueRow:true,
		className:'yellow'
	});
	row.add(view);

    var sectionFruit = Ti.UI.createTableViewSection({ headerTitle: 'Fruit', backgroundColor:'blue' });
    sectionFruit.add(row);
    sectionFruit.add(Ti.UI.createTableViewRow({ title: 'Bananas', leftImage: '/assets/images/tab2.png', color:'black', hasChild:true, isReusable:true, className:'fruitsblue', height:69, opaqueRow:true, backgroundColor:'blue', backgroundSelectedColor:'red' }));
    sectionFruit.add(Ti.UI.createTableViewRow({ title: 'Apples', isReusable:true, className:'fruitsblue', height:69, opaqueRow:true, backgroundColor:'blue'}));
    sectionFruit.add(Ti.UI.createTableViewRow({ title: 'Bananas', isReusable:true, className:'fruits', height:69, opaqueRow:true, backgroundColor:'green' }));
    sectionFruit.add(Ti.UI.createTableViewRow({ title: 'Apples', isReusable:true, className:'fruits', height:69, opaqueRow:true, backgroundColor:'green' }));
    sectionFruit.add(Ti.UI.createTableViewRow({ title: 'Bananas 90', isReusable:true, className:'fruits', height:90, opaqueRow:true, backgroundColor:'green' }));
    sectionFruit.add(Ti.UI.createTableViewRow({ title: 'Apples', isReusable:true, className:'fruits', height:69, opaqueRow:true, backgroundColor:'green' }));
    sectionFruit.add(Ti.UI.createTableViewRow({ title: 'Bananas', isReusable:true, className:'fruits', height:69, opaqueRow:true, backgroundColor:'green' }));
    sectionFruit.add(Ti.UI.createTableViewRow({ title: 'Apples', isReusable:true, className:'fruits', height:69, opaqueRow:true, backgroundColor:'green' }));
    
    var sectionVeg = Ti.UI.createTableViewSection({ headerTitle: 'Vegetables' });
    sectionVeg.add(Ti.UI.createTableViewRow({ title: 'Carrots', isReusable:true, className:'veg', height:69, opaqueRow:true, backgroundColor:'green' }));
    sectionVeg.add(Ti.UI.createTableViewRow({ title: 'Potatoes', isReusable:true, className:'veg', height:69, opaqueRow:true, backgroundColor:'green' }));
    sectionVeg.add(Ti.UI.createTableViewRow({ title: 'Carrots', isReusable:true, className:'veg', height:69, opaqueRow:true, backgroundColor:'green' }));
    sectionVeg.add(Ti.UI.createTableViewRow({ title: 'Potatoes', isReusable:true, className:'veg', height:69, opaqueRow:true, backgroundColor:'green' }));
    sectionVeg.add(Ti.UI.createTableViewRow({ title: 'Carrots', isReusable:true, className:'veg', height:69, opaqueRow:true, backgroundColor:'green' }));
    sectionVeg.add(Ti.UI.createTableViewRow({ title: 'Potatoes', isReusable:true, className:'veg', height:69, opaqueRow:true, backgroundColor:'green' }));
    sectionVeg.add(Ti.UI.createTableViewRow({ title: 'Carrots', isReusable:true, className:'veg', height:69, opaqueRow:true, backgroundColor:'green' }));
    sectionVeg.add(Ti.UI.createTableViewRow({ title: 'Potatoes', isReusable:true, className:'veg', height:69, opaqueRow:true, backgroundColor:'green' }));
    sectionVeg.add(Ti.UI.createTableViewRow({ title: 'Carrots', isReusable:true, className:'veg', height:69, opaqueRow:true, backgroundColor:'green' }));
    sectionVeg.add(Ti.UI.createTableViewRow({ title: 'Potatoes', isReusable:true, className:'veg', height:69, opaqueRow:true, backgroundColor:'green' }));
    sectionVeg.add(Ti.UI.createTableViewRow({ title: 'Carrots', isReusable:true, className:'veg', height:69, opaqueRow:true, backgroundColor:'green' }));
	sectionVeg.add(Ti.UI.createTableViewRow({ title: 'Carrots', isReusable:true, className:'veg', height:69, opaqueRow:true, backgroundColor:'green' }));
    sectionVeg.add(Ti.UI.createTableViewRow({ title: 'Potatoes', isReusable:true, className:'veg', height:69, opaqueRow:true, backgroundColor:'green' }));
    sectionVeg.add(Ti.UI.createTableViewRow({ title: 'Carrots', isReusable:true, className:'veg', height:69, opaqueRow:true, backgroundColor:'green' }));
    sectionVeg.add(Ti.UI.createTableViewRow({ title: 'Potatoes', isReusable:true, className:'veg', height:69, opaqueRow:true, backgroundColor:'green' }));
    sectionVeg.add(Ti.UI.createTableViewRow({ title: 'Carrots', isReusable:true, className:'veg', height:69, opaqueRow:true, backgroundColor:'green' }));
    sectionVeg.add(Ti.UI.createTableViewRow({ title: 'Potatoes', isReusable:true, className:'veg', height:69, opaqueRow:true, backgroundColor:'green' }));
    sectionVeg.add(Ti.UI.createTableViewRow({ title: 'Carrots', isReusable:true, className:'veg', height:69, opaqueRow:true, backgroundColor:'green' }));
    sectionVeg.add(Ti.UI.createTableViewRow({ title: 'Potatoes', isReusable:true, className:'veg', height:69, opaqueRow:true, backgroundColor:'green' }));
    sectionVeg.add(Ti.UI.createTableViewRow({ title: 'Carrots', isReusable:true, className:'veg', height:69, opaqueRow:true, backgroundColor:'green' }));
    sectionVeg.add(Ti.UI.createTableViewRow({ title: 'Last entry', isReusable:true, className:'veg', height:69, opaqueRow:true, backgroundColor:'green' }));

	


    var tableView = Ti.UI.createTableView({
      backgroundColor: 'green',
      data: [sectionFruit, sectionVeg],
      top:0,
      bottom:0,
      minRowHeight:69,
      rowHeight:69,
      width:Ti.UI.FILL,
      height:Ti.UI.FILL,
	  pagingEnabled:false,
	  snappingEnabled:true,
	  bubbleParent:true,
	  sectionHeaderFooterCaching:true,
	  smoothScrolling:true,
      imagePreloadEnabled: true, 	  
	  enableHeightCaching: true,   // Row-Height Caching
      estimatedRowHeight: 69,       // Für lazy layout
      prefetchEnabled: true         // Hintergrund-Vorbereitung
    });

	tableView.addEventListener('rowvisible', function(e) {
		console.log(`Row ${e.index} visible at offset: ${e.topOffset}`);
	});

	tableView.addEventListener('rownotvisible', function(e) {
		console.log(`Row ${e.index} not visible at offset: ${e.topOffset}`);
	});

    tableView.addEventListener('scrollend', function(e) {
		//tableView.logPerformance();
        //Ti.API.warn('Scrolling stopped! Final X: ' + e.contentOffset.x + ', Y: ' + e.contentOffset.y);
    });



	
// 	var lastLogTime = 0;
//     tableView.addEventListener('scroll', function(e) {
//        var now = Date.now();
//        if (now - lastLogTime > 500) { // Log nur alle 1 Sekunde
//            tableView.logPerformance();
//            lastLogTime = now;
//        }
//        //Ti.API.warn('Scrolling! X: ' + e.contentOffset.x + ', Y: ' + e.contentOffset.y);
//    });

    var toolbarContainer = Ti.UI.createView({
        backgroundColor: '#aa2f53c3',
        width:Ti.UI.FILL,
        height:Ti.UI.SIZE,
        bottom:0
      });
   
    var toolbarView = Ti.UI.createView({
       backgroundColor:(title == "KeepScrollingViewAbove") ? 'blue' : 'red',
       layout:'horizontal',
       width:Ti.UI.FILL,
       height:Ti.UI.SIZE,
       bottom:5,
       top:5
     });
   
     toolbarContainer.add(toolbarView);

    var send = Ti.UI.createButton({
        title: 'Send',
        style:Titanium.UI.BUTTON_STYLE_FILLED,
        backgroundColor:'blue',
        backgroundSelectedColor:'blue',
        tintColor:'#fff',
        textAlign:Titanium.UI.TEXT_ALIGNMENT_CENTER,
        verticalAlign:Titanium.UI.TEXT_VERTICAL_ALIGNMENT_CENTER,
        borderRadius:12,
        width:Ti.UI.FILL,
        right:10,
        bottom:(ANDROID) ? 5 : 10
    });
    
    var textArea = Ti.UI.createTextArea({
        top:8,
        bottom:8,
        left:15,
        right:8,
        autocorrect: false,
        editable:true,
        borderWidth: 2,
        borderColor: '#aaa',
        borderRadius: 16,
        scrollable:true,
        // maxLines:5,
        color: '#000',
        backgroundColor: '#fff',
        font: {fontSize:16, fontWeight:'normal'},
        textAlign: Titanium.UI.TEXT_ALIGNMENT_LEFT,
        verticalAlign: Titanium.UI.TEXT_VERTICAL_ALIGNMENT_CENTER,
        value: '',
        width: '70%',
        padding:{left:4,right:4,top:10,bottom:10},
        height : Ti.UI.SIZE,
        suppressReturn:false
      });
       
      toolbarView.add(textArea);
      toolbarView.add(send);
        
    if (ANDROID) {
        var interactiveKeyboardView = keyboardControlModule.createView({
            showKeyboardOnScrollUp:true, // show keyboard (when hidden) on scrolling up
            autoAdjustBottomPadding:true, // scrollingView will stay at the size you set, but the scrollInsetBottom will automaticly adjust to the toolbar height (ex: blurViewToolbar, you can see the scrollingView content through the blurred toolbar)
            autoScrollToBottom:true, // scrolling to bottom on toolbar size change
            autoSizeAndKeepScrollingViewAboveToolbar:(title == "KeepScrollingViewAbove") ? true : false, // scrollingView will be always on top of the toolbarView - the scrollingView resizes automaticly respecting the scrollingView bottom value (if set) when "true" -> "autoAdjustBottomPadding=true" has no effect
            scrollingView:tableView, // whatever listView, tableView, scrollView
            toolbarView:toolbarContainer, // has to be a Ti.UI.View!!!
            backgroundColor:'#fefefe',
            top:0,
            bottom:0
        }); 
        win.add(interactiveKeyboardView);
    }
    else {

        var interactiveKeyboardView = keyboardControlModule.createView({
            parentWindow:win, // required -> the window the interactiveKeyboardView is part of
            autoAdjustBottomPadding:(title == "KeepScrollingViewAbove") ? false : true,
            ignoreExtendSafeArea:false, // only used whene the parentWindow has "extendSafeArea:true" AND parentWindow is a standalone window (not contained in NavigationWindow and/or TagGroup) -> the module does autodetect that!
            autoScrollToBottom:(title == "KeepScrollingViewAbove") ? false : true, // scrolling to bottom on toolbar size change / or when focus of "textfield"
            autoSizeAndKeepScrollingViewAboveToolbar:(title == "KeepScrollingViewAbove") ? true : false, // scrollingView will be always on top of the toolbarView - the scrollingView resizes automaticly respecting the scrollingView bottom value (if set) when "true" -> "autoAdjustBottomPadding=true" has no effect in that case
            showKeyboardOnScrollUp:true, // show keyboard when overscrolling at bottom (iOS + Android)
            scrollingView:tableView, // whatever listView, tableView, scrollView
            toolbarView:toolbarContainer, // has to be a Ti.UI.View!!!
            textfield:textArea, // required -> put here your Ti.UI.TextArea or Titanium.UI.TextField
            keyboardPanning:true, // when true the interactive mode is on
            backgroundColor:'#fefefe',
            top:0,
            bottom:0
        });
        win.add(interactiveKeyboardView);
    }




    var tab = Ti.UI.createTab({
        title: title,
        icon: icon,
        window: win
    });

    return tab;
}






// // var NappDrawerModule = require('dk.napp.drawer');

// // function createAPIExampleWindow() {
// //   var win = Ti.UI.createWindow();

// //   var data = [{
// //       title: 'Toggle shadow'
// //     },
// //     {
// //       title: 'Toggle stretch drawer'
// //     },
// //     {
// //       title: 'Close Drawer'
// //     },
// //     {
// //       title: 'New Window'
// //     },
// //     {
// //       title: 'Default Window'
// //     },
// //     {
// //       title: 'Remove right Drawer'
// //     }
// //   ];

// //   var tableView = Ti.UI.createTableView({
// //     data: data
// //   });

// //   tableView.addEventListener('click', function(e) {
// //     Ti.API.info('isLeftWindowOpen: ' + drawer.isLeftWindowOpen());
// //     switch (e.index) {
// //       case 0:
// //         drawer.showShadow = !drawer.showShadow;
// //         break;
// //       case 1:
// //         drawer.shouldStretchDrawer = !drawer.shouldStretchDrawer;
// //         break;
// //       case 2:
// //         drawer.toggleLeftWindow();
// //         break;
// //       case 3:
// //         var newWin = openNewNavWindow();
// //         drawer.centerWindow = newWin;
// //         drawer.toggleLeftWindow();
// //         break;
// //       case 4:
// //         drawer.centerWindow = createCenterNavWindow();
// //         drawer.toggleLeftWindow();
// //         break;
// //       case 5:
// //         drawer.rightWindow = false;
// //         drawer.toggleLeftWindow();
// //         break;
// //     }
// //   });

// //   win.add(tableView);
// //   return win;
// // }


// // function openNewNavWindow() {
// //   var leftBtn = Ti.UI.createButton({
// //     title: 'Left'
// //   });
// //   leftBtn.addEventListener('click', function() {
// //     drawer.toggleLeftWindow();
// //   });
// //   var win = Ti.UI.createWindow({
// //     backgroundColor: '#222',
// //     translucent: true,
// //     extendEdges: [Ti.UI.EXTEND_EDGE_TOP],
// //     title: 'New Nav Window',
// //     barColor: '#FFA',
// //     tintColor: 'yellow',
// //     leftNavButton: leftBtn
// //   });

// //   var scrollView = Ti.UI.createScrollView({
// //     layout: 'vertical',
// //     left: 0,
// //     right: 0,
// //     contentHeight: 'auto',
// //     contentWidth: '100%',
// //     showVerticalScrollIndicator: true,
// //     showHorizontalScrollIndicator: false
// //   });

// //   for (var i = 0; i < 20; i++) {
// //     var label = Ti.UI.createLabel({
// //       top: 30,
// //       text: 'iOS7 is the new black',
// //       color: '#FFF',
// //       font: {
// //         fontSize: 20
// //       }
// //     });
// //     scrollView.add(label);
// //   }
// //   win.add(scrollView);
// //   var navController = Ti.UI.createNavigationWindow({
// //     window: win
// //   });
// //   return navController;
// // }


// // function createCenterNavWindow() {
// //   var leftBtn = Ti.UI.createButton({
// //     title: 'Left'
// //   });
// //   leftBtn.addEventListener('click', function() {
// //     drawer.toggleLeftWindow();
// //   });
// //   var rightBtn = Ti.UI.createButton({
// //     title: 'Right'
// //   });
// //   rightBtn.addEventListener('click', function() {
// //     drawer.toggleRightWindow();
// //   });

// //   var win = Ti.UI.createWindow({
// //     backgroundColor: '#eee',
// //     translucent: false,
// //     title: 'NappDrawer',
// //     barColor: '#ca2127',
// //     tintColor: '#ca2127',
// //     navTintColor: '#fff',
// //     titleAttributes: {
// //       color: '#fff'
// //     },
// //     leftNavButton: leftBtn,
// //     rightNavButton: rightBtn
// //   });

// //   var closeGestureMode = 1;
// //   var closeGestureModeBtn = Ti.UI.createButton({
// //     title: 'closeGestureMode: ALL',
// //     width: 300,
// //     top: 80
// //   });

// //   closeGestureModeBtn.addEventListener('click', function(e) {
// //     if (closeGestureMode == 2) {
// //       closeGestureMode = 0;
// //     } else {
// //       closeGestureMode++;
// //     }
// //     switch (closeGestureMode) {
// //       case 0:
// //         drawer.closeDrawerGestureMode = NappDrawerModule.CLOSE_MODE_TAP_CENTERWINDOW;
// //         closeGestureModeBtn.title = 'closeGesture: Tap Center';
// //         break;
// //       case 1:
// //         drawer.closeDrawerGestureMode = NappDrawerModule.CLOSE_MODE_ALL;
// //         closeGestureModeBtn.title = 'closeGesture: ALL';
// //         break;
// //       case 2:
// //         drawer.closeDrawerGestureMode = NappDrawerModule.CLOSE_MODE_PANNING_NAVBAR;
// //         closeGestureModeBtn.title = 'closeGesture: NAVBAR';
// //         break;
// //     }
// //   });
// //   win.add(closeGestureModeBtn);


// //   var animationMode = 0;
// //   var animationModeBtn = Ti.UI.createButton({
// //     title: 'animation: NONE',
// //     width: 300,
// //     top: 140
// //   });
// //   animationModeBtn.addEventListener('click', function(e) {
// //     if (animationMode == 5) {
// //       animationMode = 0;
// //     } else {
// //       animationMode++;
// //     }
// //     switch (animationMode) {
// //       case 0:
// //         drawer.animationMode = NappDrawerModule.ANIMATION_NONE;
// //         animationModeBtn.title = 'animation: None';
// //         break;
// //       case 1:
// //         drawer.animationMode = NappDrawerModule.ANIMATION_PARALLAX_FACTOR_3;
// //         animationModeBtn.title = 'animation: Parallax factor 3';
// //         break;
// //       case 2:
// //         drawer.animationMode = NappDrawerModule.ANIMATION_PARALLAX_FACTOR_7;
// //         animationModeBtn.title = 'animation: Parallax factor 7';
// //         break;
// //       case 3:
// //         drawer.animationMode = NappDrawerModule.ANIMATION_FADE;
// //         animationModeBtn.title = 'animation: Fade';
// //         break;
// //       case 4:
// //         drawer.animationMode = NappDrawerModule.ANIMATION_SLIDE;
// //         animationModeBtn.title = 'animation: Slide';
// //         break;
// //       case 5:
// //         drawer.animationMode = NappDrawerModule.ANIMATION_SLIDE_SCALE;
// //         animationModeBtn.title = 'animation: Slide & Scale';
// //         break;
// //     }
// //   });
// //   win.add(animationModeBtn);


// //   var slider = Ti.UI.createSlider({
// //     top: 280,
// //     min: 50,
// //     max: 280,
// //     width: 280,
// //     value: 200
// //   });
// //   var label = Ti.UI.createLabel({
// //     text: 'Left Drawer Width: ' + slider.value,
// //     top: 250
// //   });
// //   slider.addEventListener('touchend', function(e) {
// //     var value = Math.round(e.value);
// //     label.text = 'Left Drawer Width: ' + value;
// //     drawer.leftDrawerWidth = value;
// //   });
// //   win.add(label);
// //   win.add(slider);

// //   var navController = Ti.UI.createNavigationWindow({
// //     window: win
// //   });
// //   return navController;
// // }

// // var mainWindow = createCenterNavWindow();

// // var drawer = NappDrawerModule.createDrawer({
// //   leftWindow: createAPIExampleWindow(),
// //   centerWindow: mainWindow,
// //   rightWindow: Ti.UI.createWindow({
// //     backgroundColor: '#FFF'
// //   }),
// //   closeDrawerGestureMode: NappDrawerModule.CLOSE_MODE_ALL,
// //   openDrawerGestureMode: NappDrawerModule.OPEN_MODE_ALL,
// //   showShadow: false, //no shadow in iOS7
// //   leftDrawerWidth: 200,
// //   rightDrawerWidth: 120,
// //   statusBarStyle: NappDrawerModule.STATUSBAR_WHITE, // remember to set UIViewControllerBasedStatusBarAppearance to false in tiapp.xml
// //   orientationModes: [Ti.UI.PORTRAIT, Ti.UI.UPSIDE_PORTRAIT]
// // });

// // drawer.addEventListener('centerWindowDidFocus', function() {
// //   Ti.API.info('Center did focus!');
// // });

// // drawer.addEventListener('centerWindowDidBlur', function() {
// //   Ti.API.info('Center did blur!');
// // });

// // drawer.addEventListener('windowDidOpen', function(e) {
// //   Ti.API.info('windowDidOpen');
// // });

// // drawer.addEventListener('windowDidClose', function(e) {
// //   Ti.API.info('windowDidClose');
// // });

// // drawer.open();

// // Ti.API.info('isAnyWindowOpen: ' + drawer.isAnyWindowOpen());






// /*
// TiSDK: 13.1.0.GA
// Required Module:
// Link: https://github.com/mbender74/NappDrawer
// Include: <module platform="iphone" version="2.2.7">dk.napp.drawer</module>
// */

// // const NappDrawerModule = require('dk.napp.drawer');

// // const drawer = NappDrawerModule.createDrawer({
// // 	width: Ti.Platform.displayCaps.platformWidth,
// // 	orientationModes: [Ti.UI.PORTRAIT],
// // 	backgroundColor: '#000000',
// // 	animationMode: NappDrawerModule.ANIMATION_SLIDE,
// // 	closeDrawerGestureMode: NappDrawerModule.CLOSE_MODE_ALL,
// // 	openDrawerGestureMode: NappDrawerModule.OPEN_MODE_ALL,
// // 	shouldStretchDrawer: false,
// // 	showShadow: false,
// // 	animationVelocity: 1300,
// // 	leftDrawerWidth: Ti.Platform.displayCaps.platformWidth,
// // 	rightDrawerWidth: Ti.Platform.displayCaps.platformWidth
// // });

// // // Create Drawers
// // const leftDrawerWindow = Ti.UI.createWindow({
// // 	title: 'Left Drawer',
// // 	backgroundColor: '#FFFFFF'
// // });

// // const leftDrawer = Ti.UI.createNavigationWindow({
// // 	window: leftDrawerWindow
// // });

// // const rightDrawerWindow = Ti.UI.createWindow({
// // 	title: 'Right Drawer',
// // 	backgroundColor: '#FFFFFF'
// // });

// // const rightDrawer = Ti.UI.createNavigationWindow({
// // 	window: rightDrawerWindow
// // });

// // const win1 = Ti.UI.createWindow({
// // 	backgroundColor: 'blue',
// // 	title: 'Blue'
// // });
// // win1.add(Ti.UI.createLabel({ text: 'I am a blue window.' }));

// // const win2 = Ti.UI.createWindow({
// // 	backgroundColor: 'red',
// // 	title: 'Red'
// // });
// // win2.add(Ti.UI.createLabel({ text: 'I am a red window.' }));

// // const tab1 = Ti.UI.createTab({
// // 		window: win1,
// // 		title: 'Blue'
// // 	}),
// // 	tab2 = Ti.UI.createTab({
// // 		window: win2,
// // 		title: 'Red'
// // 	}),
// // 	tabGroup = Ti.UI.createTabGroup({
// // 		tabs: [tab1, tab2]
// // 	});

// // // Open our TabGroup (crashes with or without opening)
// // // tabGroup.open();

// // // --- Set drawer Windows ---
// // drawer.leftWindow = leftDrawer;
// // drawer.rightWindow = rightDrawer;
// // drawer.centerWindow = tabGroup;

// // // Open the drawer
// // drawer.open();

// // // Should crash with the error reported at the link below:
// // // https://github.com/tidev/titanium-sdk/pull/14397#issuecomment-3956428982





// /*
// TiSDK: 13.2.0.GA (with PR patch #14450)
// Required Module:
// Link: https://github.com/mbender74/NappDrawer
// Include: <module platform="iphone" version="3.1.1">dk.napp.drawer</module>
// */

// // const NappDrawerModule = require('dk.napp.drawer');
// // var drawer = null;

// // function createDrawer() {
// // 	drawer = NappDrawerModule.createDrawer({
// // 		width: Ti.Platform.displayCaps.platformWidth,
// // 		orientationModes: [Ti.UI.PORTRAIT],
// // 		backgroundColor: 'red',
// // 		animationMode: NappDrawerModule.ANIMATION_SLIDE,
// // 		closeDrawerGestureMode: NappDrawerModule.CLOSE_MODE_ALL,
// // 		openDrawerGestureMode: NappDrawerModule.OPEN_MODE_ALL,
// // 		shouldStretchDrawer: false,
// // 		showShadow: false,
// // 		animationVelocity: 1300,
// // 		leftDrawerWidth: Ti.Platform.displayCaps.platformWidth,
// // 		rightDrawerWidth: Ti.Platform.displayCaps.platformWidth
// // 	});

// // 	// Create Drawers
// // 	const leftDrawerWindow = Ti.UI.createWindow({ title: 'Left Drawer', backgroundColor: 'yellow', extendSafeArea: true, extendEdges: [1, 4] });
// // 	const leftDrawer = Ti.UI.createNavigationWindow({ window: leftDrawerWindow });

// // 	const rightDrawerWindow = Ti.UI.createWindow({ title: 'Right Drawer', backgroundColor: 'green', extendSafeArea: true, extendEdges: [1, 4] });
// // 	const rightDrawer = Ti.UI.createNavigationWindow({ window: rightDrawerWindow });

// // 	const win1 = Ti.UI.createWindow({ backgroundColor: 'blue', title: 'Tab 1', extendSafeArea: true, extendEdges: [1, 4], titleAttributes: { color: 'white', font: { fontSize: 17, fontWeight: 'bold' } } });
// // 	const win1Container = Ti.UI.createView({ layout: 'vertical', height: Ti.UI.SIZE, width: Ti.UI.FILL });
// // 	win1.add(win1Container);

// // 	const win1Label = Ti.UI.createLabel({ text: '⬅️ swipe to open drawers ➡️', color: 'white', font: { fontSize: 20, fontWeight: 'bold' }, top: 0 });
// // 	win1Container.add(win1Label);

// // 	// Create Drawer Close Button
// // 	const closeButton = Ti.UI.createButton({ title: 'Close Drawer', backgroundColor: 'white', tintColor: 'black', font: { fontSize: 20, fontWeight: 'bold' }, width: '50%', height: 44, borderRadius: 10, top: 56 });
// // 	closeButton.addEventListener('click', () => {
// // 		closeDrawer();
// // 	});
// // 	win1Container.add(closeButton);

// // 	const win2 = Ti.UI.createWindow({ backgroundColor: 'yellow', title: 'Tab 2', extendSafeArea: true, extendEdges: [1, 4], titleAttributes: { font: { fontSize: 17, fontWeight: 'bold' } } });
// // 	win2.add(Ti.UI.createLabel({ text: 'I am just a lonely yellow window.', font: { fontSize: 13, fontWeight: 'bold' } }));

// // 	const tab1 = Ti.UI.createTab({ window: win1, title: 'Blue' }),
// // 		tab2 = Ti.UI.createTab({ window: win2, title: 'Yellow' }),
// // 		tabGroup = Ti.UI.createTabGroup({ tabs: [tab1, tab2] });

// // 	// Open our TabGroup (works with or without calling open)
// // 	// tabGroup.open();

// // 	// Set drawer Windows
// // 	drawer.leftWindow = leftDrawer;
// // 	drawer.rightWindow = rightDrawer;
// // 	drawer.centerWindow = tabGroup;

// // 	// Open the drawer
// // 	drawer.open();
// // }

// // function closeDrawer() {
// // 	drawer.close();
// // 	drawer = null;

// // 	// Open Landing Screen
// // 	createLandingScreen();
// // }

// // function createLandingScreen() {
// // 	const win = Ti.UI.createWindow({ backgroundColor: '#FFFFFF', extendSafeArea: true, extendEdges: [1, 4] });

// // 	// Open Drawer Button
// // 	const openDrawerButton = Ti.UI.createButton({ title: 'Open Drawer', font: { fontSize: 20, fontWeight: 'bold' } });
// // 	// Click Event to Open Drawer
// // 	openDrawerButton.addEventListener('click', () => {
// // 		win.close();
// // 		createDrawer();
// // 	});
// // 	win.add(openDrawerButton);

// // 	// Open the Landing Screen Window
// // 	win.open();
// // }

// // // Open Landing Screen
// // createLandingScreen();
