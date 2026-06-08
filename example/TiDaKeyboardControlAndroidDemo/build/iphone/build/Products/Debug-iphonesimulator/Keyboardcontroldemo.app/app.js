
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




var ANDROID = Ti.Platform.osname === 'android';
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
    barColor: '#365b85',
    backgroundColor: '#fff',
    extendSafeArea: false,
    tabBarHidden: title == "KeepScrollingViewAbove" ? true : false,
    sustainedPerformanceMode: true
  });


  var view = Titanium.UI.createView({
    backgroundColor: 'yellow',
    width: Ti.UI.FILL,
    layout: 'horizontal',
    height: 69
  });

  var label = Ti.UI.createLabel({
    text: 'LiteRTLM Chat',
    color: '#e94560',
    backgroundColor: 'yellow',
    font: { fontSize: 18, fontWeight: 'bold' },
    left: 10,
    width: 200
  });

  var image = Ti.UI.createImageView({
    image: '/assets/images/tab2.png',
    animated: true,
    tintColor: 'green',
    height: 46,
    calcMinMax: true,
    maxWidth: 120,
    maxHeight: 69,
    calcMinMaxDone: false,
    averageColorDone: false,
    noTransparency: false,
    blurredImage: false,
    blurRadius: 20
  });

  image.addEventListener('averageColor', function (e) {
    console.log('##### averageColor: ', JSON.stringify(e));
  });

  image.addEventListener('imageMinMax', function (e) {
    console.log('##### imageMinMax: ', JSON.stringify(e));
  });

  view.add(image);
  view.add(label);

  var row = Titanium.UI.createTableViewRow({
    isReusable: true,
    height: Ti.UI.SIZE,
    opaqueRow: true,
    className: 'yellow'
  });
  row.add(view);

  var sectionFruit = Ti.UI.createTableViewSection({ headerTitle: 'Fruit', backgroundColor: 'blue' });
  sectionFruit.add(row);
  sectionFruit.add(Ti.UI.createTableViewRow({ title: 'Bananas', leftImage: '/assets/images/tab2.png', color: 'black', hasChild: true, isReusable: true, className: 'fruitsblue', height: 69, opaqueRow: true, backgroundColor: 'blue', backgroundSelectedColor: 'red' }));
  sectionFruit.add(Ti.UI.createTableViewRow({ title: 'Apples', isReusable: true, className: 'fruitsblue', height: 69, opaqueRow: true, backgroundColor: 'blue' }));
  sectionFruit.add(Ti.UI.createTableViewRow({ title: 'Bananas', isReusable: true, className: 'fruits', height: 69, opaqueRow: true, backgroundColor: 'green' }));
  sectionFruit.add(Ti.UI.createTableViewRow({ title: 'Apples', isReusable: true, className: 'fruits', height: 69, opaqueRow: true, backgroundColor: 'green' }));
  sectionFruit.add(Ti.UI.createTableViewRow({ title: 'Bananas 90', isReusable: true, className: 'fruits', height: 90, opaqueRow: true, backgroundColor: 'green' }));
  sectionFruit.add(Ti.UI.createTableViewRow({ title: 'Apples', isReusable: true, className: 'fruits', height: 69, opaqueRow: true, backgroundColor: 'green' }));
  sectionFruit.add(Ti.UI.createTableViewRow({ title: 'Bananas', isReusable: true, className: 'fruits', height: 69, opaqueRow: true, backgroundColor: 'green' }));
  sectionFruit.add(Ti.UI.createTableViewRow({ title: 'Apples', isReusable: true, className: 'fruits', height: 69, opaqueRow: true, backgroundColor: 'green' }));

  var sectionVeg = Ti.UI.createTableViewSection({ headerTitle: 'Vegetables' });
  sectionVeg.add(Ti.UI.createTableViewRow({ title: 'Carrots', isReusable: true, className: 'veg', height: 69, opaqueRow: true, backgroundColor: 'green' }));
  sectionVeg.add(Ti.UI.createTableViewRow({ title: 'Potatoes', isReusable: true, className: 'veg', height: 69, opaqueRow: true, backgroundColor: 'green' }));
  sectionVeg.add(Ti.UI.createTableViewRow({ title: 'Carrots', isReusable: true, className: 'veg', height: 69, opaqueRow: true, backgroundColor: 'green' }));
  sectionVeg.add(Ti.UI.createTableViewRow({ title: 'Potatoes', isReusable: true, className: 'veg', height: 69, opaqueRow: true, backgroundColor: 'green' }));
  sectionVeg.add(Ti.UI.createTableViewRow({ title: 'Carrots', isReusable: true, className: 'veg', height: 69, opaqueRow: true, backgroundColor: 'green' }));
  sectionVeg.add(Ti.UI.createTableViewRow({ title: 'Potatoes', isReusable: true, className: 'veg', height: 69, opaqueRow: true, backgroundColor: 'green' }));
  sectionVeg.add(Ti.UI.createTableViewRow({ title: 'Carrots', isReusable: true, className: 'veg', height: 69, opaqueRow: true, backgroundColor: 'green' }));
  sectionVeg.add(Ti.UI.createTableViewRow({ title: 'Potatoes', isReusable: true, className: 'veg', height: 69, opaqueRow: true, backgroundColor: 'green' }));
  sectionVeg.add(Ti.UI.createTableViewRow({ title: 'Carrots', isReusable: true, className: 'veg', height: 69, opaqueRow: true, backgroundColor: 'green' }));
  sectionVeg.add(Ti.UI.createTableViewRow({ title: 'Potatoes', isReusable: true, className: 'veg', height: 69, opaqueRow: true, backgroundColor: 'green' }));
  sectionVeg.add(Ti.UI.createTableViewRow({ title: 'Carrots', isReusable: true, className: 'veg', height: 69, opaqueRow: true, backgroundColor: 'green' }));
  sectionVeg.add(Ti.UI.createTableViewRow({ title: 'Carrots', isReusable: true, className: 'veg', height: 69, opaqueRow: true, backgroundColor: 'green' }));
  sectionVeg.add(Ti.UI.createTableViewRow({ title: 'Potatoes', isReusable: true, className: 'veg', height: 69, opaqueRow: true, backgroundColor: 'green' }));
  sectionVeg.add(Ti.UI.createTableViewRow({ title: 'Carrots', isReusable: true, className: 'veg', height: 69, opaqueRow: true, backgroundColor: 'green' }));
  sectionVeg.add(Ti.UI.createTableViewRow({ title: 'Potatoes', isReusable: true, className: 'veg', height: 69, opaqueRow: true, backgroundColor: 'green' }));
  sectionVeg.add(Ti.UI.createTableViewRow({ title: 'Carrots', isReusable: true, className: 'veg', height: 69, opaqueRow: true, backgroundColor: 'green' }));
  sectionVeg.add(Ti.UI.createTableViewRow({ title: 'Potatoes', isReusable: true, className: 'veg', height: 69, opaqueRow: true, backgroundColor: 'green' }));
  sectionVeg.add(Ti.UI.createTableViewRow({ title: 'Carrots', isReusable: true, className: 'veg', height: 69, opaqueRow: true, backgroundColor: 'green' }));
  sectionVeg.add(Ti.UI.createTableViewRow({ title: 'Potatoes', isReusable: true, className: 'veg', height: 69, opaqueRow: true, backgroundColor: 'green' }));
  sectionVeg.add(Ti.UI.createTableViewRow({ title: 'Carrots', isReusable: true, className: 'veg', height: 69, opaqueRow: true, backgroundColor: 'green' }));
  sectionVeg.add(Ti.UI.createTableViewRow({ title: 'Last entry', isReusable: true, className: 'veg', height: 69, opaqueRow: true, backgroundColor: 'green' }));




  var tableView = Ti.UI.createTableView({
    backgroundColor: 'green',
    data: [sectionFruit, sectionVeg],
    top: 0,
    bottom: 0,
    minRowHeight: 69,
    rowHeight: 69,
    width: Ti.UI.FILL,
    height: Ti.UI.FILL,
    pagingEnabled: false,
    snappingEnabled: true,
    bubbleParent: true,
    sectionHeaderFooterCaching: true,
    smoothScrolling: true,
    imagePreloadEnabled: true,
    enableHeightCaching: true, // Row-Height Caching
    estimatedRowHeight: 69, // Für lazy layout
    prefetchEnabled: true // Hintergrund-Vorbereitung
  });

  tableView.addEventListener('rowvisible', function (e) {
    console.log(`Row ${e.index} visible at offset: ${e.topOffset}`);
  });

  tableView.addEventListener('rownotvisible', function (e) {
    console.log(`Row ${e.index} not visible at offset: ${e.topOffset}`);
  });

  tableView.addEventListener('scrollend', function (e) {


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
    width: Ti.UI.FILL,
    height: Ti.UI.SIZE,
    bottom: 0
  });

  var toolbarView = Ti.UI.createView({
    backgroundColor: title == "KeepScrollingViewAbove" ? 'blue' : 'red',
    layout: 'horizontal',
    width: Ti.UI.FILL,
    height: Ti.UI.SIZE,
    bottom: 5,
    top: 5
  });

  toolbarContainer.add(toolbarView);

  var send = Ti.UI.createButton({
    title: 'Send',
    style: Titanium.UI.BUTTON_STYLE_FILLED,
    backgroundColor: 'blue',
    backgroundSelectedColor: 'blue',
    tintColor: '#fff',
    textAlign: Titanium.UI.TEXT_ALIGNMENT_CENTER,
    verticalAlign: Titanium.UI.TEXT_VERTICAL_ALIGNMENT_CENTER,
    borderRadius: 12,
    width: Ti.UI.FILL,
    right: 10,
    bottom: ANDROID ? 5 : 10
  });

  var textArea = Ti.UI.createTextArea({
    top: 8,
    bottom: 8,
    left: 15,
    right: 8,
    autocorrect: false,
    editable: true,
    borderWidth: 2,
    borderColor: '#aaa',
    borderRadius: 16,
    scrollable: true,
    // maxLines:5,
    color: '#000',
    backgroundColor: '#fff',
    font: { fontSize: 16, fontWeight: 'normal' },
    textAlign: Titanium.UI.TEXT_ALIGNMENT_LEFT,
    verticalAlign: Titanium.UI.TEXT_VERTICAL_ALIGNMENT_CENTER,
    value: '',
    width: '70%',
    padding: { left: 4, right: 4, top: 10, bottom: 10 },
    height: Ti.UI.SIZE,
    suppressReturn: false
  });

  toolbarView.add(textArea);
  toolbarView.add(send);

  if (ANDROID) {
    var interactiveKeyboardView = keyboardControlModule.createView({
      showKeyboardOnScrollUp: true, // show keyboard (when hidden) on scrolling up
      autoAdjustBottomPadding: true, // scrollingView will stay at the size you set, but the scrollInsetBottom will automaticly adjust to the toolbar height (ex: blurViewToolbar, you can see the scrollingView content through the blurred toolbar)
      autoScrollToBottom: true, // scrolling to bottom on toolbar size change
      autoSizeAndKeepScrollingViewAboveToolbar: title == "KeepScrollingViewAbove" ? true : false, // scrollingView will be always on top of the toolbarView - the scrollingView resizes automaticly respecting the scrollingView bottom value (if set) when "true" -> "autoAdjustBottomPadding=true" has no effect
      scrollingView: tableView, // whatever listView, tableView, scrollView
      toolbarView: toolbarContainer, // has to be a Ti.UI.View!!!
      backgroundColor: '#fefefe',
      top: 0,
      bottom: 0
    });
    win.add(interactiveKeyboardView);
  } else
  {

    var interactiveKeyboardView = keyboardControlModule.createView({
      parentWindow: win, // required -> the window the interactiveKeyboardView is part of
      autoAdjustBottomPadding: title == "KeepScrollingViewAbove" ? false : true,
      ignoreExtendSafeArea: false, // only used whene the parentWindow has "extendSafeArea:true" AND parentWindow is a standalone window (not contained in NavigationWindow and/or TagGroup) -> the module does autodetect that!
      autoScrollToBottom: title == "KeepScrollingViewAbove" ? false : true, // scrolling to bottom on toolbar size change / or when focus of "textfield"
      autoSizeAndKeepScrollingViewAboveToolbar: title == "KeepScrollingViewAbove" ? true : false, // scrollingView will be always on top of the toolbarView - the scrollingView resizes automaticly respecting the scrollingView bottom value (if set) when "true" -> "autoAdjustBottomPadding=true" has no effect in that case
      showKeyboardOnScrollUp: true, // show keyboard when overscrolling at bottom (iOS + Android)
      scrollingView: tableView, // whatever listView, tableView, scrollView
      toolbarView: toolbarContainer, // has to be a Ti.UI.View!!!
      textfield: textArea, // required -> put here your Ti.UI.TextArea or Titanium.UI.TextField
      keyboardPanning: true, // when true the interactive mode is on
      backgroundColor: '#fefefe',
      top: 0,
      bottom: 0
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJpZ25vcmVMaXN0IjpbXSwibWFwcGluZ3MiOiI7QUFDQSxJQUFJQSw2QkFBNkIsR0FBR0MsT0FBTyxDQUFDLDBCQUEwQixDQUFDOzs7O0FBSXZFO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOzs7O0FBSUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTs7QUFFQTtBQUNBOztBQUVBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7Ozs7OztBQU1BO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7OztBQUdBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7QUFHQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7OztBQUdBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTs7O0FBR0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7Ozs7QUFLQTs7QUFFQTs7QUFFQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTs7O0FBR0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBOzs7O0FBSUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7OztBQUlBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOzs7Ozs7Ozs7QUFTQTs7O0FBR0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTs7O0FBR0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7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TUFBTSxFQUFDO0lBQ1gsQ0FBQyxDQUFDO0lBQ0YxRCxHQUFHLENBQUN3QyxHQUFHLENBQUN1RCx1QkFBdUIsQ0FBQztFQUNwQzs7Ozs7RUFLQSxJQUFJVSxHQUFHLEdBQUd0SCxFQUFFLENBQUNLLEVBQUUsQ0FBQ0csU0FBUyxDQUFDO0lBQ3RCRSxLQUFLLEVBQUVBLEtBQUs7SUFDWkUsSUFBSSxFQUFFQSxJQUFJO0lBQ1YyRyxNQUFNLEVBQUUxRztFQUNaLENBQUMsQ0FBQzs7RUFFRixPQUFPeUcsR0FBRztBQUNkOzs7Ozs7O0FBT0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7O0FBR0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7OztBQUdBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7O0FBR0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7OztBQUdBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBOztBQUVBOzs7Ozs7O0FBT0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTs7Ozs7O0FBTUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0EiLCJuYW1lcyI6WyJUaUJvdHRvbVNoZWV0Q29udHJvbGxlck1vZHVsZSIsInJlcXVpcmUiLCJBTkRST0lEIiwiVGkiLCJQbGF0Zm9ybSIsIm9zbmFtZSIsImtleWJvYXJkQ29udHJvbE1vZHVsZSIsInRhYkdyb3VwIiwiVUkiLCJjcmVhdGVUYWJHcm91cCIsImFkZFRhYiIsImNyZWF0ZVRhYiIsIm9wZW4iLCJ0aXRsZSIsIm1lc3NhZ2UiLCJpY29uIiwid2luIiwiY3JlYXRlV2luZG93IiwiYmFyQ29sb3IiLCJiYWNrZ3JvdW5kQ29sb3IiLCJleHRlbmRTYWZlQXJlYSIsInRhYkJhckhpZGRlbiIsInN1c3RhaW5lZFBlcmZvcm1hbmNlTW9kZSIsInZpZXciLCJUaXRhbml1bSIsImNyZWF0ZVZpZXciLCJ3aWR0aCIsIkZJTEwiLCJsYXlvdXQiLCJoZWlnaHQiLCJsYWJlbCIsImNyZWF0ZUxhYmVsIiwidGV4dCIsImNvbG9yIiwiZm9udCIsImZvbnRTaXplIiwiZm9udFdlaWdodCIsImxlZnQiLCJpbWFnZSIsImNyZWF0ZUltYWdlVmlldyIsImFuaW1hdGVkIiwidGludENvbG9yIiwiY2FsY01pbk1heCIsIm1heFdpZHRoIiwibWF4SGVpZ2h0IiwiY2FsY01pbk1heERvbmUiLCJhdmVyYWdlQ29sb3JEb25lIiwibm9UcmFuc3BhcmVuY3kiLCJibHVycmVkSW1hZ2UiLCJibHVyUmFkaXVzIiwiYWRkRXZlbnRMaXN0ZW5lciIsImUiLCJjb25zb2xlIiwibG9nIiwiSlNPTiIsInN0cmluZ2lmeSIsImFkZCIsInJvdyIsImNyZWF0ZVRhYmxlVmlld1JvdyIsImlzUmV1c2FibGUiLCJTSVpFIiwib3BhcXVlUm93IiwiY2xhc3NOYW1lIiwic2VjdGlvbkZydWl0IiwiY3JlYXRlVGFibGVWaWV3U2VjdGlvbiIsImhlYWRlclRpdGxlIiwibGVmdEltYWdlIiwiaGFzQ2hpbGQiLCJiYWNrZ3JvdW5kU2VsZWN0ZWRDb2xvciIsInNlY3Rpb25WZWciLCJ0YWJsZVZpZXciLCJjcmVhdGVUYWJsZVZpZXciLCJkYXRhIiwidG9wIiwiYm90dG9tIiwibWluUm93SGVpZ2h0Iiwicm93SGVpZ2h0IiwicGFnaW5nRW5hYmxlZCIsInNuYXBwaW5nRW5hYmxlZCIsImJ1YmJsZVBhcmVudCIsInNlY3Rpb25IZWFkZXJGb290ZXJDYWNoaW5nIiwic21vb3RoU2Nyb2xsaW5nIiwiaW1hZ2VQcmVsb2FkRW5hYmxlZCIsImVuYWJsZUhlaWdodENhY2hpbmciLCJlc3RpbWF0ZWRSb3dIZWlnaHQiLCJwcmVmZXRjaEVuYWJsZWQiLCJpbmRleCIsInRvcE9mZnNldCIsInRvb2xiYXJDb250YWluZXIiLCJ0b29sYmFyVmlldyIsInNlbmQiLCJjcmVhdGVCdXR0b24iLCJzdHlsZSIsIkJVVFRPTl9TVFlMRV9GSUxMRUQiLCJ0ZXh0QWxpZ24iLCJURVhUX0FMSUdOTUVOVF9DRU5URVIiLCJ2ZXJ0aWNhbEFsaWduIiwiVEVYVF9WRVJUSUNBTF9BTElHTk1FTlRfQ0VOVEVSIiwiYm9yZGVyUmFkaXVzIiwicmlnaHQiLCJ0ZXh0QXJlYSIsImNyZWF0ZVRleHRBcmVhIiwiYXV0b2NvcnJlY3QiLCJlZGl0YWJsZSIsImJvcmRlcldpZHRoIiwiYm9yZGVyQ29sb3IiLCJzY3JvbGxhYmxlIiwiVEVYVF9BTElHTk1FTlRfTEVGVCIsInZhbHVlIiwicGFkZGluZyIsInN1cHByZXNzUmV0dXJuIiwiaW50ZXJhY3RpdmVLZXlib2FyZFZpZXciLCJzaG93S2V5Ym9hcmRPblNjcm9sbFVwIiwiYXV0b0FkanVzdEJvdHRvbVBhZGRpbmciLCJhdXRvU2Nyb2xsVG9Cb3R0b20iLCJhdXRvU2l6ZUFuZEtlZXBTY3JvbGxpbmdWaWV3QWJvdmVUb29sYmFyIiwic2Nyb2xsaW5nVmlldyIsInBhcmVudFdpbmRvdyIsImlnbm9yZUV4dGVuZFNhZmVBcmVhIiwidGV4dGZpZWxkIiwia2V5Ym9hcmRQYW5uaW5nIiwidGFiIiwid2luZG93Il0sInNvdXJjZVJvb3QiOiIvVXNlcnMvbWFyY2JlbmRlci9UaXRhbml1bS1Nb2R1bGVzL1RpRGFLZXlib2FyZENvbnRyb2wvZXhhbXBsZS9UaURhS2V5Ym9hcmRDb250cm9sQW5kcm9pZERlbW8vUmVzb3VyY2VzIiwic291cmNlcyI6WyJhcHAuanMiXSwic291cmNlc0NvbnRlbnQiOlsiXG52YXIgVGlCb3R0b21TaGVldENvbnRyb2xsZXJNb2R1bGUgPSByZXF1aXJlKFwidGkuYm90dG9tc2hlZXRjb250cm9sbGVyXCIpO1xuXG5cblxuLy8gLyoqXG4vLyAgKiBSZXF1aXJlIGVtaXR0ZXJWaWV3IE1vZHVsZVxuLy8gICovXG4vLyAgdmFyIGVtaXR0ZXJWaWV3TW9kdWxlID0gcmVxdWlyZSgnZGUubWFyY2JlbmRlci5lbWl0dGVydmlldycpO1xuXG4vLyAvKipcbi8vICAqIFJlcXVpcmUgSWNvbmljRm9udCBhbmQgRm9udEF3ZXNvbWVcbi8vICAqL1xuLy8gIHZhciBmb250YXdlc29tZSA9IHJlcXVpcmUoJy9saWIvSWNvbmljRm9udCcpLkljb25pY0ZvbnQoe2ZvbnQ6ICcvbGliL0ZvbnRBd2Vzb21lJyxsaWdhdHVyZTogZmFsc2V9KTtcblxuXG5cbi8vIC8qKlxuLy8gICogQ3JlYXRlIGEgbmV3IGBUaS5VSS5UYWJHcm91cGAuXG4vLyAgKi9cbi8vIHZhciB0YWJHcm91cCA9IFRpLlVJLmNyZWF0ZVRhYkdyb3VwKCk7XG5cbi8vIC8qKlxuLy8gICogQWRkIHRoZSB0d28gY3JlYXRlZCB0YWJzIHRvIHRoZSB0YWJHcm91cCBvYmplY3QuXG4vLyAgKi9cbi8vIHRhYkdyb3VwLmFkZFRhYihjcmVhdGVUYWIoXCJUYWIgMVwiLCBcIkkgYW0gV2luZG93IDFcIiwgXCJhc3NldHMvaW1hZ2VzL3RhYjEucG5nXCIpKTtcbi8vIHRhYkdyb3VwLmFkZFRhYihjcmVhdGVUYWIoXCJUYWIgMlwiLCBcIkkgYW0gV2luZG93IDJcIiwgXCJhc3NldHMvaW1hZ2VzL3RhYjIucG5nXCIpKTtcblxuLy8gLyoqXG4vLyAgKiBPcGVuIHRoZSB0YWJHcm91cFxuLy8gICovXG4vLyB0YWJHcm91cC5vcGVuKCk7XG5cbi8vIHZhciBlbWl0dGVySW1hZ2VzID0gW107XG5cbi8vIHZhciBidXR0b25WaWV3SXNBbmltYXRpbmcgPSBmYWxzZTtcbi8vIHZhciBidXR0b25WaWV3MklzQW5pbWF0aW5nID0gZmFsc2U7XG5cbi8vIGZ1bmN0aW9uIGdlbmVyYXRlVGh1bWJDb2xvckltYWdlKGNvbG9yLGljb24saGVpZ2h0KXtcblxuLy8gICAgIHJldHVybiBUaS5VSS5jcmVhdGVMYWJlbCh7XG4vLyAgICAgICAgIHdpZHRoOlRpLlVJLlNJWkUsXG4vLyAgICAgICAgIGhlaWdodDpUaS5VSS5TSVpFLFxuLy8gICAgICAgICBjb2xvcjogY29sb3IsXG4vLyAgICAgICAgIHRleHRBbGlnbjpUaXRhbml1bS5VSS5URVhUX0FMSUdOTUVOVF9DRU5URVIsXG4vLyAgICAgICAgIGZvbnQ6IHtcbi8vICAgICAgICAgICAgIGZvbnRTaXplOighaGVpZ2h0KSA/IDM4IDogKFRpLlBsYXRmb3JtLm9zbmFtZSA9PT0gJ2FuZHJvaWQnKSA/IChoZWlnaHQvVGkuUGxhdGZvcm0uZGlzcGxheUNhcHMubG9naWNhbERlbnNpdHlGYWN0b3IpIDogaGVpZ2h0LTIsXG4vLyAgICAgICAgICAgICBmb250RmFtaWx5OmZvbnRhd2Vzb21lLmZvbnRmYW1pbHkoKVxuLy8gICAgICAgICB9LFxuLy8gICAgICAgICB0ZXh0OiAoIWljb24pID8gZm9udGF3ZXNvbWUuaWNvbignaWNvbi10aHVtYnMtdXAnKSA6IGZvbnRhd2Vzb21lLmljb24oaWNvbikgXG4vLyAgICAgIH0pLnRvSW1hZ2UobnVsbCxmYWxzZSk7XG5cbi8vIH1cblxuXG5cblxuXG4vLyAvKipcbi8vICAqIENyZWF0ZXMgYSBuZXcgVGFiIGFuZCBjb25maWd1cmVzIGl0LlxuLy8gICpcbi8vICAqIEBwYXJhbSAge1N0cmluZ30gdGl0bGUgVGhlIHRpdGxlIHVzZWQgaW4gdGhlIGBUaS5VSS5UYWJgIGFuZCBpdCdzIGluY2x1ZGVkIGBUaS5VSS5XaW5kb3dgXG4vLyAgKiBAcGFyYW0gIHtTdHJpbmd9IG1lc3NhZ2UgVGhlIHRpdGxlIGRpc3BsYXllZCBpbiB0aGUgYFRpLlVJLkxhYmVsYFxuLy8gICogQHJldHVybiB7U3RyaW5nfSBpY29uIFRoZSBpY29uIHVzZWQgaW4gdGhlIGBUaS5VSS5UYWJgXG4vLyAgKi9cblxuLy8gZnVuY3Rpb24gY3JlYXRlVGFiKHRpdGxlLCBtZXNzYWdlLCBpY29uKSB7XG4vLyAgICAgdmFyIHdpbiA9IFRpLlVJLmNyZWF0ZVdpbmRvdyh7XG4vLyAgICAgICAgIHRpdGxlOiB0aXRsZSxcbi8vICAgICAgICAgYmFja2dyb3VuZENvbG9yOiAnI2ZmZicsXG4vLyAgICAgICAgIHRvcDowLFxuLy8gICAgICAgICBib3R0b206MCxcbi8vICAgICAgICAgbGVmdDowLFxuLy8gICAgICAgICByaWdodDowLFxuLy8gICAgICAgICBoZWlnaHQ6VGkuVUkuRklMTCxcbi8vICAgICAgICAgd2lkdGg6VGkuVUkuRklMTCxcbi8vICAgICB9KTtcblxuLy8gICAgIHZhciBsYWJlbCA9IFRpLlVJLmNyZWF0ZUxhYmVsKHtcbi8vICAgICAgICAgdGV4dDogbWVzc2FnZSxcbi8vICAgICAgICAgY29sb3I6IFwiIzMzM1wiLFxuLy8gICAgICAgICBmb250OiB7XG4vLyAgICAgICAgICAgICBmb250U2l6ZTogMjBcbi8vICAgICAgICAgfVxuLy8gICAgIH0pO1xuLy8gICAgIGxhYmVsLmFkZEV2ZW50TGlzdGVuZXIoXCJjbGlja1wiLGZ1bmN0aW9uKGUpe1xuLy8gICAgICAgICBhbGVydChcImFzZGZhc2RmXCIpO1xuLy8gICAgIH0pO1xuXG4vLyAgICAgd2luLmFkZChsYWJlbCk7XG5cblxuLy8gICAgIC8qKlxuLy8gICAgICAqIEFkZCBpbWFnZXMgdG8gYW4gYXJyYXkgdGhhdCBpcyBuZWVkZWQgZm9yIHRoZSBlbWl0dGVyVmlld1xuLy8gICAgICAqL1xuLy8gICAgIHZhciBlbWl0dGVySW1hZ2VzID0gW107XG4vLyAgICAgZW1pdHRlckltYWdlcy5wdXNoKFwiL2ltYWdlcy9oZWFydDIucG5nXCIpO1xuLy8gICAgIGVtaXR0ZXJJbWFnZXMucHVzaChnZW5lcmF0ZVRodW1iQ29sb3JJbWFnZSgncmVkJywnZmEtaGVhcnQnLDQwKSk7XG4vLyAgICAgZW1pdHRlckltYWdlcy5wdXNoKGdlbmVyYXRlVGh1bWJDb2xvckltYWdlKCdyZWQnLG51bGwsNDApKTtcbi8vICAgICBlbWl0dGVySW1hZ2VzLnB1c2goZ2VuZXJhdGVUaHVtYkNvbG9ySW1hZ2UoJ3llbGxvdycsbnVsbCw0MCkpO1xuLy8gICAgIGVtaXR0ZXJJbWFnZXMucHVzaChnZW5lcmF0ZVRodW1iQ29sb3JJbWFnZSgnb3JhbmdlJyxudWxsLDQwKSk7XG4vLyAgICAgZW1pdHRlckltYWdlcy5wdXNoKGdlbmVyYXRlVGh1bWJDb2xvckltYWdlKCdibHVlJyxudWxsLDQwKSk7XG4vLyAgICAgZW1pdHRlckltYWdlcy5wdXNoKGdlbmVyYXRlVGh1bWJDb2xvckltYWdlKCdwdXJwbGUnLG51bGwsNDApKTtcbi8vICAgICBlbWl0dGVySW1hZ2VzLnB1c2goZ2VuZXJhdGVUaHVtYkNvbG9ySW1hZ2UoJ2dyZWVuJyxudWxsLDQwKSk7XG4vLyAgICAgZW1pdHRlckltYWdlcy5wdXNoKGdlbmVyYXRlVGh1bWJDb2xvckltYWdlKCdtYWdlbnRhJyxudWxsLDQwKSk7XG4vLyAgICAgZW1pdHRlckltYWdlcy5wdXNoKGdlbmVyYXRlVGh1bWJDb2xvckltYWdlKCcjMTZjN2NkJyxudWxsLDQwKSk7XG5cbi8vICAgICAvKipcbi8vICAgICAgKiBjcmVhdGUgYW4gZW1pdHRlclZpZXdcbi8vICAgICAgKi9cbi8vICAgICB2YXIgZW1pdHRlclZpZXcgPSBlbWl0dGVyVmlld01vZHVsZS5jcmVhdGVWaWV3KHtcbi8vICAgICAgICAgdG9wOjAsXG4vLyAgICAgICAgIGxlZnQ6MCxcbi8vICAgICAgICAgcmlnaHQ6MCxcbi8vICAgICAgICAgYm90dG9tOjAsXG4vLyAgICAgICAgIGJhY2tncm91bmRDb2xvcjonIzU1YjU1ZTVlJyxcbi8vICAgICAgICAgaGVpZ2h0OlRpLlVJLkZJTEwsXG4vLyAgICAgICAgIHdpZHRoOlRpLlVJLkZJTEwsICAgICAgXG4vLyBcdFx0YW1wbGl0dWRlOjgsIC8vIEludGVnZXJcbi8vICAgICAgICAgbWF4QW1wbGl0dWRlOjI4LCAvLyBJbnRlZ2VyXG4vLyAgICAgICAgIGR1cmF0aW9uOihUaS5QbGF0Zm9ybS5vc25hbWUgPT09ICdhbmRyb2lkJykgPyAyLjUgOiAzLjAsIC8vIEZsb2F0IC0gaW4gc2Vjb25kc1xuLy8gICAgICAgICBtYXhEdXJhdGlvbjooVGkuUGxhdGZvcm0ub3NuYW1lID09PSAnYW5kcm9pZCcpID8gMy4wIDogMy41LCAvLyBGbG9hdCAtIGluIHNlY29uZHNcbi8vICAgICAgICAgcGFydGljbGVJbWFnZXM6ZW1pdHRlckltYWdlcywgLy8gYXJyYXkgb2YgaW1hZ2VzIG9yIGltYWdlQmxvYnNcbi8vIFx0XHRsaWZldGltZToyLjAsXG4vLyBcdCAgXHR2ZWxvY2l0eTozNTBcbi8vICAgICB9KTtcblxuLy8gICAgIHdpbi5hZGQoZW1pdHRlclZpZXcpO1xuXG4vLyAgICAgIC8qKlxuLy8gICAgICAqIGNyZWF0ZSBhIGJ1dHRvblZpZXcgd2hlcmUgdGhlIGltYWdlcyB0byBlbWl0IHdpbGwgYmUgZW1pdHRlZCBmcm9tXG4vLyAgICAgICovXG4vLyAgICAgdmFyIGJ1dHRvblZpZXcgPSBUaS5VSS5jcmVhdGVWaWV3KHtcbi8vICAgICAgICAgd2lkdGg6IFRpLlVJLlNJWkUsXG4vLyAgICAgICAgIGhlaWdodDogVGkuVUkuU0laRSxcbi8vICAgICAgICAgYm90dG9tOjcwLFxuLy8gICAgICAgICBsZWZ0OjIwXG4vLyAgICAgIH0pO1xuXG4vLyAgICAgdmFyIGJ1dHRvbkxhYmVsID0gVGkuVUkuY3JlYXRlTGFiZWwoe1xuLy8gICAgICAgICB3aWR0aDogVGkuVUkuU0laRSxcbi8vICAgICAgICAgaGVpZ2h0OiBUaS5VSS5TSVpFLFxuLy8gICAgICAgICBjb2xvcjogJ2JsdWUnLFxuLy8gICAgICAgICB0ZXh0QWxpZ246VGl0YW5pdW0uVUkuVEVYVF9BTElHTk1FTlRfQ0VOVEVSLFxuLy8gICAgICAgICBmb250OiB7XG4vLyAgICAgICAgICAgICBmb250U2l6ZTogMzYsXG4vLyAgICAgICAgICAgICBmb250RmFtaWx5OiBmb250YXdlc29tZS5mb250ZmFtaWx5KClcbi8vICAgICAgICAgfSxcbi8vICAgICAgICAgdGV4dDpmb250YXdlc29tZS5pY29uKCdpY29uLXRodW1icy11cCcpXG4vLyAgICAgfSk7XG4vLyAgICAgYnV0dG9uVmlldy5hZGQoYnV0dG9uTGFiZWwpO1xuXG4vLyAgICAgdmFyIGJ1dHRvblZpZXcyID0gVGkuVUkuY3JlYXRlVmlldyh7XG4vLyAgICAgICAgIHdpZHRoOiBUaS5VSS5TSVpFLFxuLy8gICAgICAgICBoZWlnaHQ6IFRpLlVJLlNJWkUsXG4vLyAgICAgICAgIGJvdHRvbToxMDAsXG4vLyAgICAgICAgIHJpZ2h0OjIwXG4vLyAgICAgIH0pO1xuXG4vLyAgICAgdmFyIGJ1dHRvbkxhYmVsMiA9IFRpLlVJLmNyZWF0ZUxhYmVsKHtcbi8vICAgICAgICAgd2lkdGg6IFRpLlVJLlNJWkUsXG4vLyAgICAgICAgIGhlaWdodDogVGkuVUkuU0laRSxcbi8vICAgICAgICAgY29sb3I6ICdyZWQnLFxuLy8gICAgICAgICB0ZXh0QWxpZ246VGl0YW5pdW0uVUkuVEVYVF9BTElHTk1FTlRfQ0VOVEVSLFxuLy8gICAgICAgICBmb250OiB7XG4vLyAgICAgICAgICAgICBmb250U2l6ZTogMzYsXG4vLyAgICAgICAgICAgICBmb250RmFtaWx5OiBmb250YXdlc29tZS5mb250ZmFtaWx5KClcbi8vICAgICAgICAgfSxcbi8vICAgICAgICAgdGV4dDpmb250YXdlc29tZS5pY29uKCdmYS1oZWFydCcpXG4vLyAgICAgfSk7XG4vLyAgICAgYnV0dG9uVmlldzIuYWRkKGJ1dHRvbkxhYmVsMik7XG5cblxuLy8gIC8qKlxuLy8gICogRGVmaW5lIEJ1dHRvbnMgdG91Y2ggYW5pbWF0aW9uc1xuLy8gICovXG4vLyAgICAgdmFyIHRvdWNoU3RhcnRBbmltID0gVGl0YW5pdW0uVUkuY3JlYXRlQW5pbWF0aW9uKHtcbi8vICAgICAgICAgZHVyYXRpb246IDkwLFxuLy8gICAgICAgICBvcGFjaXR5OiAwLjMsXG4vLyAgICAgICAgIGF1dG9yZXZlcnNlOnRydWVcbi8vICAgICB9KTtcbi8vICAgICB0b3VjaFN0YXJ0QW5pbS5hZGRFdmVudExpc3RlbmVyKCdjb21wbGV0ZScsIGZ1bmN0aW9uKCkge1xuLy8gICAgICAgICBidXR0b25WaWV3SXNBbmltYXRpbmcgPSBmYWxzZTtcbi8vICAgICB9KTtcblxuLy8gICAgIHZhciB0b3VjaFN0YXJ0QW5pbTIgPSBUaXRhbml1bS5VSS5jcmVhdGVBbmltYXRpb24oe1xuLy8gICAgICAgICBkdXJhdGlvbjogOTAsXG4vLyAgICAgICAgIG9wYWNpdHk6IDAuMyxcbi8vICAgICAgICAgYXV0b3JldmVyc2U6dHJ1ZVxuLy8gICAgIH0pO1xuLy8gICAgIHRvdWNoU3RhcnRBbmltMi5hZGRFdmVudExpc3RlbmVyKCdjb21wbGV0ZScsIGZ1bmN0aW9uKCkge1xuLy8gICAgICAgICBidXR0b25WaWV3MklzQW5pbWF0aW5nID0gZmFsc2U7XG4vLyAgICAgfSk7XG5cblxuLy8gICAgIC8qKlxuLy8gICAgICAqIGNyZWF0ZSBhbiBldmVudExpc3RlciBmb3IgdGhlIGJ1dHRvblZpZXcgd2hpY2ggd2lsbCBjYWxsIHRoZSAnZW1pdHRlclZpZXcuZW1pdEltYWdlKHtQQVJBTVN9KScgbWV0aG9kXG4vLyAgICAgICogZm9yIGlPUyAnc2luZ2xldGFwJyBpcyB0aGUgcHJlZmVyZWQgbGlzdGVuZXIsIGZvciBBbmRyb2lkICd0b3VjaHN0YXJ0JyBpcyBwcmVmZXJlZFxuLy8gICAgICAqICdjbGljaycgbGlzdGVuZXIgaXMgdG8gc2xvdyB0byBlbWl0IHRoZSBpbWFnZXMgZmFzdC4uLiBidXQgeW91IGRlY2lkZSB3aGF0IHlvdSBkby4uLiBqdXN0IGEgcHJvcG9zYWwuLi4uXG4vLyAgICAgICovXG4vLyAgICAgIGJ1dHRvblZpZXcuYWRkRXZlbnRMaXN0ZW5lcihcInRvdWNoc3RhcnRcIixmdW5jdGlvbihlKXtcbi8vICAgICAgICAgaWYgKGJ1dHRvblZpZXdJc0FuaW1hdGluZyA9PSBmYWxzZSl7XG4vLyAgICAgICAgICAgICBidXR0b25WaWV3SXNBbmltYXRpbmcgPSB0cnVlO1xuLy8gICAgICAgICAgICAgYnV0dG9uVmlldy5hbmltYXRlKHRvdWNoU3RhcnRBbmltKTtcbi8vICAgICAgICAgfVxuLy8gICAgICAgICAgICAgLy8gdGhlIGVtaXRJbWFnZSBtZXRob2QgY2FuIGFsc28gYmUgY2FsbGVkIHdpdGhvdXQgdGhlIGJ1dHRvbiAnc2luZ2xldGFwJyBsaXN0ZW5lciwgaXTCtHMgaW1wb3J0YW50IHRoYXQgdGhlIHBhcmFtZXRlciAnc291cmNlVmlldycgaXMgc2V0IHRvIGEgdmlldyB3aGVyZSB0aGUgaW1hZ2VzIHdpbGwgYmUgZW1pdHRlZCBmcm9tXG4vLyAgICAgICAgICAgICBlbWl0dGVyVmlldy5lbWl0SW1hZ2Uoe1xuLy8gICAgICAgICAgICAgICAgIHNvdXJjZVZpZXc6YnV0dG9uVmlldywgLy8gb2JsaWdhdG9yeSEhIVxuLy8gICAgICAgICAgICAgICAgIHN0YXJ0SWQ6MywgLy8gb3B0aW9uYWxcbi8vIFx0XHRcdFx0ZW1pdFZhbHVlOjgsXG4vLyBcdFx0XHRcdGVtaXRTcHJlYWQ6MjgsXG4vLyBcdFx0XHRcdGVtaXRTY2FsZVJhbmdlOjAuMSxcbi8vIFx0XHRcdFx0ZGlyZWN0aW9uOiBlbWl0dGVyVmlld01vZHVsZS5ESVJFQ1RJT05fVVAsXG4vLyAgICAgICAgICAgICAgICAgZW5kSWQ6ZW1pdHRlckltYWdlcy5sZW5ndGgsIC8vIG9wdGlvbmFsXG4vLyAgICAgICAgICAgICAgICAgLy8gaWQ6MSAvLyBvcHRpb25hbCAtIHNlbGVjdCBhIHNwZWNpZmljIGltYWdlIGZyb20gdGhlICdwYXJ0aWNsZUltYWdlcycgYXJyYXkgdG8gYmUgZW1pdHRlZFxuLy8gICAgICAgICAgICAgfSk7XG5cbi8vICAgICB9KTtcblxuXG4vLyAgICAgYnV0dG9uVmlldzIuYWRkRXZlbnRMaXN0ZW5lcihcInRvdWNoc3RhcnRcIixmdW5jdGlvbihlKXtcbi8vICAgICAgICAgaWYgKGJ1dHRvblZpZXcySXNBbmltYXRpbmcgPT0gZmFsc2Upe1xuLy8gICAgICAgICAgICAgYnV0dG9uVmlldzJJc0FuaW1hdGluZyA9IHRydWU7XG4vLyAgICAgICAgICAgICBidXR0b25WaWV3Mi5hbmltYXRlKHRvdWNoU3RhcnRBbmltMik7XG4vLyAgICAgICAgIH0gXG4vLyAgICAgICAgICAgICAvLyB0aGUgZW1pdEltYWdlIG1ldGhvZCBjYW4gYWxzbyBiZSBjYWxsZWQgd2l0aG91dCB0aGUgYnV0dG9uICdzaW5nbGV0YXAnIGxpc3RlbmVyLCBpdMK0cyBpbXBvcnRhbnQgdGhhdCB0aGUgcGFyYW1ldGVyICdzb3VyY2VWaWV3JyBpcyBzZXQgdG8gYSB2aWV3IHdoZXJlIHRoZSBpbWFnZXMgd2lsbCBiZSBlbWl0dGVkIGZyb21cbi8vICAgICAgICAgICAgIGVtaXR0ZXJWaWV3LmVtaXRJbWFnZSh7XG4vLyAgICAgICAgICAgICAgICAgc291cmNlVmlldzpidXR0b25WaWV3MiwgLy8gb2JsaWdhdG9yeSEhIVxuLy8gXHRcdFx0XHRkaXJlY3Rpb246IGVtaXR0ZXJWaWV3TW9kdWxlLkRJUkVDVElPTl9VUCxcbi8vIFx0XHRcdFx0ZW1pdFZhbHVlOjIsXG4vLyBcdFx0XHRcdGVtaXRTcHJlYWQ6NjAsXG4vLyBcdFx0XHRcdGVtaXRTY2FsZVJhbmdlOjAuOSxcbi8vICAgICAgICAgICAgICAgIC8vIHN0YXJ0SWQ6MSwgLy8gb3B0aW9uYWwgLSBzdGFydCBieSAxXG4vLyAgICAgICAgICAgICAgICAvLyBlbmRJZDoyLCAvLyBvcHRpb25hbCAtIGVuZHMgYnkgcGFydGljbGVJbWFnZXMubGVuZ3RoXG4vLyAgICAgICAgICAgICAgICAgaWQ6MSAvLyBvcHRpb25hbCAtIHNlbGVjdCBhIHNwZWNpZmljIGltYWdlIGZyb20gdGhlICdwYXJ0aWNsZUltYWdlcycgYXJyYXkgdG8gYmUgZW1pdHRlZFxuLy8gICAgICAgICAgICAgfSk7XG5cbi8vICAgICB9KTtcbi8vICAgICB3aW4uYWRkKGJ1dHRvblZpZXcpO1xuLy8gICAgIHdpbi5hZGQoYnV0dG9uVmlldzIpO1xuXG4vLyAgICAgdmFyIHRhYiA9IFRpLlVJLmNyZWF0ZVRhYih7XG4vLyAgICAgICAgIHRpdGxlOiB0aXRsZSxcbi8vICAgICAgICAgaWNvbjogaWNvbixcbi8vICAgICAgICAgd2luZG93OiB3aW5cbi8vICAgICB9KTtcblxuLy8gICAgIHJldHVybiB0YWI7XG4vLyB9XG5cblxuXG5cbi8vIOKUgOKUgCBNb2R1bGUgcmVmZXJlbmNlIOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgFxuXG4vLyB2YXIgcG9wb3Zlck1vZHVsZSA9IHJlcXVpcmUoJ3RpLnBvcG92ZXInKTtcblxuLy8gdmFyIHdpbiA9IFRpLlVJLmNyZWF0ZVdpbmRvdyh7YmFja2dyb3VuZENvbG9yOiAnZ3JlZW4nfSk7XG5cbi8vIHZhciBsYWJlbCA9IFRpLlVJLmNyZWF0ZUxhYmVsKHtcbi8vIFx0dGV4dDogJ0JvdHRvbSBTaGVldCBDb250ZW50Jyxcbi8vIFx0dG9wOiA2MCxcbi8vIFx0YmFja2dyb3VuZENvbG9yOiAnZ3JlZW4nLFxuLy8gXHRjb2xvcjogJyM5MDAnLFxuLy8gICAgIGZvbnQ6IHsgZm9udFNpemU6NDggfSxcbi8vICAgICBzaGFkb3dDb2xvcjogJyNhYWEnLFxuLy8gICAgIHNoYWRvd09mZnNldDoge3g6NSwgeTo1fSxcbi8vICAgICBzaGFkb3dSYWRpdXM6IDMsXG4vLyAgICAgY2FsY1JlYWxTaXplOnRydWUsXG4vLyAgICAgdGV4dEFsaWduOiBUaS5VSS5URVhUX0FMSUdOTUVOVF9DRU5URVIsXG4vLyB9KTtcbi8vIHdpbi5hZGQobGFiZWwpO1xuXG4vLyB2YXIgYnV0dG9uID0gVGkuVUkuY3JlYXRlQnV0dG9uKHtcbi8vIFx0bGVmdDogMjAsXG4vLyBcdHRvcDoxODAsXG4vLyBcdHRpdGxlOiAnT3BlbiBQb3BvdmVyISdcbi8vIH0pO1xuXG4vLyBidXR0b24uYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCBmdW5jdGlvbihlKXtcbi8vICAgICBwb3BvdmVyLnNob3coeyBcbi8vIFx0ICB2aWV3OiBidXR0b24sXG4vLyAgICAgICBjb3JuZXJSYWRpdXM6IDEyLFxuLy8gICAgICAgc2hvd3NEaW1CYWNrZ3JvdW5kOiBmYWxzZSxcbi8vICAgICAgIGJsdXJCYWNrZ3JvdW5kOiBmYWxzZSxcbi8vICAgICAgIHNob3dzQXJyb3c6IHRydWUsXG4vLyBcdCAgYW5pbWF0ZWQ6dHJ1ZSxcbi8vIFx0ICB0cmFuc2l0aW9uRHVyYXRpb246IDAuMSxcbi8vICAgICAgIHRyYW5zaXRpb25TdHlsZTogcG9wb3Zlck1vZHVsZS5UUkFOU0lUSU9OX1NUWUxFX1NDQUxFIFxuLy8gXHR9KTtcbi8vIH0pXG5cbi8vIHdpbi5hZGQoYnV0dG9uKTtcblxuXG4vLyB2YXIgY29udGVudFZpZXdGb3JQb3BvdmVyID0gVGkuVUkuY3JlYXRlVmlldyh7XG4vLyBcdFx0YmFja2dyb3VuZENvbG9yOiAneWVsbG93Jyxcbi8vIFx0XHR0b3A6MTAsXG4vLyBcdFx0Ym90dG9tOjEwLFxuLy8gXHRcdGxlZnQ6MTAsXG4vLyBcdFx0cmlnaHQ6MTAsXG4vLyBcdFx0d2lkdGg6IDE4MCxcbi8vICAgICAgICAgaGVpZ2h0OiA4MCxcbi8vIFx0XHRsYXlvdXQ6ICd2ZXJ0aWNhbCdcbi8vIH0pO1xuXG4vLyB2YXIgcG9wb3ZlciA9IHBvcG92ZXJNb2R1bGUuY3JlYXRlUG9wb3Zlcih7XG4vLyBcdHNoYWRvd0NvbG9yOiAnIzAwMDAwMCcsXG4vLyAgICAgc2hhZG93T3BhY2l0eTogMC45LFxuLy8gICAgIHNoYWRvd1JhZGl1czogMTUsXG4vLyAgICAgc2hhZG93T2Zmc2V0OiB7IHg6IDAsIHk6IDQgfSxcbi8vICAgICBjb250ZW50VmlldzogY29udGVudFZpZXdGb3JQb3BvdmVyLFxuLy8gICAgIGFycm93RGlyZWN0aW9uOiBwb3BvdmVyTW9kdWxlLlBPUE9WRVJfQVJST1dfRElSRUNUSU9OX1VQX0xFRlQsXG4vLyAgICAgcG9wb3ZlckJsdXJTdHlsZTogcG9wb3Zlck1vZHVsZS5CTFVSX0VGRkVDVF9TVFlMRV9TWVNURU1fTUFURVJJQUxcbi8vIH0pO1xuXG4vLyB3aW4ub3BlbigpO1xuXG5cblxuLy8gLy8gRXhhbXBsZSBhcHAgZm9yIHRpLmJvdHRvbXNoZWV0Y29udHJvbGxlciBtb2R1bGVcbi8vIHZhciB3aW4gPSBUaS5VSS5jcmVhdGVXaW5kb3coe1xuLy8gXHRiYWNrZ3JvdW5kQ29sb3I6ICd3aGl0ZSdcbi8vIH0pO1xuXG4vLyB2YXIgVGlCb3R0b21TaGVldENvbnRyb2xsZXJNb2R1bGUgPSByZXF1aXJlKFwidGkuYm90dG9tc2hlZXRjb250cm9sbGVyXCIpO1xuXG4vLyAvLyBDcmVhdGUgY29udGVudCB2aWV3IGZvciB0aGUgYm90dG9tIHNoZWV0XG4vLyB2YXIgY29udGVudFZpZXcgPSBUaS5VSS5jcmVhdGVWaWV3KHtcbi8vIFx0YmFja2dyb3VuZENvbG9yOiAnI2ZmZmZmZicsXG4vLyBcdGxheW91dDogJ3ZlcnRpY2FsJ1xuLy8gfSk7XG5cbi8vIHZhciBsYWJlbCA9IFRpLlVJLmNyZWF0ZUxhYmVsKHtcbi8vIFx0dGV4dDogJ0JvdHRvbSBTaGVldCBDb250ZW50Jyxcbi8vIFx0Zm9udDogeyBmb250U2l6ZTogMjAsIGZvbnRXZWlnaHQ6ICdib2xkJyB9LFxuLy8gXHRjb2xvcjogJyMwMDAnLFxuLy8gXHR0b3A6IDYwLFxuLy8gXHRsZWZ0OiAyMCxcbi8vIFx0cmlnaHQ6IDIwLFxuLy8gXHR0ZXh0QWxpZ246ICdjZW50ZXInXG4vLyB9KTtcblxuLy8gdmFyIGJ1dHRvbiA9IFRpLlVJLmNyZWF0ZUJ1dHRvbih7XG4vLyBcdHRpdGxlOiAnQ2xvc2UgQm90dG9tIFNoZWV0Jyxcbi8vIFx0dG9wOiAxMDAsXG4vLyBcdGxlZnQ6IDIwLFxuLy8gXHRyaWdodDogMjAsXG4vLyBcdGhlaWdodDogNDRcbi8vIH0pO1xuXG4vLyBjb250ZW50Vmlldy5hZGQobGFiZWwpO1xuLy8gY29udGVudFZpZXcuYWRkKGJ1dHRvbik7XG5cbi8vIC8vIENyZWF0ZSBjbG9zZSBidXR0b25cbi8vIHZhciBjbG9zZUJ1dHRvbiA9IFRpLlVJLmNyZWF0ZUJ1dHRvbih7XG4vLyBcdHRpdGxlOiAn4pyVJyxcbi8vIFx0d2lkdGg6IDMwLFxuLy8gXHRoZWlnaHQ6IDMwLFxuLy8gXHRmb250OiB7IGZvbnRTaXplOiAxNiB9XG4vLyB9KTtcblxuLy8gLy8gQ3JlYXRlIHRoZSBib3R0b20gc2hlZXRcbi8vIHZhciBib3R0b21TaGVldENvbnRyb2xsZXIgPSBUaUJvdHRvbVNoZWV0Q29udHJvbGxlck1vZHVsZS5jcmVhdGVCb3R0b21TaGVldCh7XG4vLyBcdHdpZHRoOjQwMCxcbi8vIFx0ZGV0ZW50czp7XG4vLyBcdFx0bGFyZ2U6ZmFsc2UsXG4vLyBcdFx0bWVkaXVtOmZhbHNlLFxuLy8gXHRcdHNtYWxsOmZhbHNlXG4vLyBcdH0sIC8vIFwic21hbGxcIiBoYXMgZWZmZWN0IG9ubHkgd2hlbiBcIm5vblN5c3RlbVNoZWV0OnRydWVcIlxuLy8gXHRjdXN0b21EZXRlbnRzOntcbi8vIFx0XHRjdXN0b21BOjEwMCxcbi8vIFx0XHRjdXN0b21COjIwMCxcbi8vIFx0XHRjdXN0b21DOjMwMCAvLyBtb3JlIHBvc3NpYmxlIVxuLy8gXHR9LFxuLy8gXHRzdGFydERldGVudDonY3VzdG9tQScsIC8vIG1lZGl1bSBvciBsYXJnZSAtICB3aGVuIFwibm9uU3lzdGVtU2hlZXQ6dHJ1ZVwiIGFsc28gXCJzbWFsbFwiIGlzIHBvc3NpYmxlIC0tIHdoZW4gc3RhcnREZXRlbnQgaXMgXCJzbWFsbFwiIGFuZCBkZXRlbnRzOntzbWFsbDpmYWxzZX0gaXMgZGVmYXVsdHMgdG8gXCJtZWRpdW1cIiBhbmQgc28gb24uLi4gd2hlbiBjdXN0b21EZXRlbnRzIGFyZSBzZXQgZW50ZXIgaGVyZSB0aGUgXCJrZXlcIiBhcyBzdHJpbmdcbi8vIFx0cHJlZmVycmVkQ29ybmVyUmFkaXVzOjIwLFxuLy8gXHRwcmVmZXJzRWRnZUF0dGFjaGVkSW5Db21wYWN0SGVpZ2h0OnRydWUsIC8vIGhhcyBlZmZlY3Qgb25seSB3aGVuIFwibm9uU3lzdGVtU2hlZXQ6ZmFsc2VcIiAtIEEgQm9vbGVhbiB2YWx1ZSB0aGF0IGRldGVybWluZXMgd2hldGhlciB0aGUgc2hlZXQgYXR0YWNoZXMgdG8gdGhlIGJvdHRvbSBlZGdlIG9mIHRoZSBzY3JlZW4gaW4gYSBjb21wYWN0LWhlaWdodCBzaXplIGNsYXNzLlxuLy8gXHRwcmVmZXJzU2Nyb2xsaW5nRXhwYW5kc1doZW5TY3JvbGxlZFRvRWRnZTpmYWxzZSwgLy8gaGFzIGVmZmVjdCBvbmx5IHdoZW4gXCJub25TeXN0ZW1TaGVldDpmYWxzZVwiXG4vLyBcdHdpZHRoRm9sbG93c1ByZWZlcnJlZENvbnRlbnRTaXplV2hlbkVkZ2VBdHRhY2hlZDp0cnVlLCAvLyBoYXMgZWZmZWN0IG9ubHkgd2hlbiBcIm5vblN5c3RlbVNoZWV0OmZhbHNlXCJcbi8vIFx0bm9uTW9kYWw6ZmFsc2UsIC8vIGhhcyBlZmZlY3QgT05MWSB3aGVuIFwibm9uU3lzdGVtU2hlZXQ6ZmFsc2VcIiBvbiBpT1MgPj0gMTVcbi8vIFx0bGFyZ2VzdFVuZGltbWVkRGV0ZW50SWRlbnRpZmllcjonc21hbGwnLCAvLyBtZWRpdW0gb3IgbGFyZ2UgKGFsc28gXCJzbWFsbFwiIGF2YWlsYWJsZSB3aGVuIFwibm9uU3lzdGVtU2hlZXQ6dHJ1ZVwiKSAtIGlmIG5vdCBzZXQsIGl0IGlzIGZ1bGwgZGltbWVkIGRlcGVuZGluZyBvbiBhY3RpdmF0ZWQgZGV0ZW50cyB3aGVuIFwibm9uU3lzdGVtU2hlZXQ6dHJ1ZVwiIHRoZSBwcm9wZXJ0eSBhbHNvIGFsbG93IHRvIGludGVyYWN0IHdpdGggdGhlIHZpZXcgaW4gdGhlIGJhY2tncm91bmQgb2YgdGhlIGJvdHRvbVNoZWV0IC0gd2hlbiBub3QgZGltbWVkLCB3aGVuIGRpbW1lZCBpbnRlcmFjdGlvbiBpcyBub3QgcG9zc2libGUgd2l0aCB0aGUgdmlldyBpbiB0aGUgYmFja2dyb3VuZCAtLS0gIHdoZW4gY3VzdG9tRGV0ZW50cyBhcmUgc2V0IGVudGVyIGhlcmUgdGhlIFwia2V5XCIgYXMgc3RyaW5nXG4vLyBcdGNvbnRlbnRWaWV3OiBjb250ZW50Vmlldyxcbi8vIFx0Y2xvc2VCdXR0b246IGNsb3NlQnV0dG9uLFxuLy8gXHRiYWNrZ3JvdW5kQ29sb3I6JyNlZWVlZWUnLCBcbi8vIFx0cHJlZmVyc0dyYWJiZXJWaXNpYmxlOnRydWUsIC8vIGJvdHRvbVNoZWV0IGdyYWJiZXJIYW5kbGUgdmlzaWJsZSB0cnVlIC8gZmFsc2Vcbi8vIFx0c3lzdGVtU2hlZXREaXNhYmxlUGFuR2VzdHVyZURpc21pc3M6ZmFsc2UsXG5cbi8vIFx0bm9uU3lzdGVtU2hlZXQ6dHJ1ZSwgLy8gZGVmYXVsdHMgdG8gXCJ0cnVlXCIgaWYgbm90IHNldCAtIG5vbiBpT1MgMTUgU2hlZXRDb250cm9sbGVyIChiYWNrd2FyZHMgY29tcGF0aWJsZSB0byBub24gaU9TMTUpIHdoZW4gXCJ0cnVlXCIgLSBpT1MxNSsgU2hlZXRDb250cm9sbGVyIHdoZW4gXCJmYWxzZVwiIC0gaWYgbm9uIGlPUzE1IGFuZCBzZXQgdG8gXCJmYWxzZVwiIGl0IGFsc28gZGVmYXVsdHMgdG8gXCJ0cnVlXCJcbi8vIFx0bm9uU3lzdGVtU2hlZXRBdXRvbWF0aWNTdGFydFBvc2l0aW9uRnJvbUNvbnRlbnRWaWV3SGVpZ2h0OmZhbHNlLCAvLyB3aGVuIHRoaXMgcHJvcGVydHkgaXMgXCJ0cnVlXCIgdGhlIG5vblN5c3RlbVNoZWV0IG9wZW5zIGluIHRoZSBoZWlnaHQgb2YgdGhlIGNvbnRlbnRWaWV3LCBhbGwgZGV0ZW50cyBhcmUgZGlzYWJsZWQsIG9ubHkgdGhpcyBzdGF0ZSBpcyBhY3RpdmUsIFwic3RhcnREZXRlbnRcIiBwcm9wZXJ0eSBpcyBpZ25vcmVkLCBhbHNvIHRoZSBcImRldGVudHNcIiBwcm9wZXJ0eSBpcyBpZ25vcmVkIC0tIGlmIHlvdSB3YW50IGFuIHVuZGltbWVkIGJhY2tncm91bmQsIHRoZW4geW91IG5lZWQgdG8gc2V0IHByb3BlcnR5IFwibGFyZ2VzdFVuZGltbWVkRGV0ZW50SWRlbnRpZmllclwiIHRvIFwibGFyZ2VcIlxuLy8gXHRub25TeXN0ZW1TaGVldFNtYWxsSGVpZ2h0OjIwMCwgXG4vLyBcdG5vblN5c3RlbVNoZWV0TWVkaXVtSGVpZ2h0OjQwMCwgXG4vLyBcdG5vblN5c3RlbVNoZWV0TGFyZ2VIZWlnaHQ6NzAwLFxuLy8gXHQvL25vblN5c3RlbVNoZWV0SGFuZGxlQ29sb3I6J3JlZCcsXG4vLyBcdG5vblN5c3RlbVNoZWV0RGlzYWJsZVBhbkdlc3R1cmVEaXNtaXNzOnRydWUsIC8vIGRpc2FibGVzIHRoZSBwYW4gZ2VzdHVyZSAoZHJhZyBkb3duIHRvIGNsb3NlKSwgY2xvc2luZyBpcyBvbmx5IHBvc3NpYmxlIHZpYSBjbG9zZUJ1dHRvbiB0aGVuIE9SIHZpYSBcImNsb3NlXCIgbWV0aG9kXG4vLyBcdG5vblN5c3RlbVNoZWV0RGlzYWJsZURpbW1lZEJhY2tncm91bmRUb3VjaERpc21pc3M6ZmFsc2UsIC8vIGRpc2FibGVzIHRoZSB0b3VjaCBldmVudCBvbiB0aGUgZGltbWVkIGJhY2tncm91bmRWaWV3IHRoYXQgd2lsbCBjbG9zZSB0aGUgc2hlZXRDb250cm9sbGVyXG5cbi8vIFx0bm9uU3lzdGVtU2hlZXREaXNhYmxlRGltbWVkQmFja2dyb3VuZDpmYWxzZSwgLy8gZGlzYWJsZXMgdGhlIGRpbW1lZCBiYWNrZ3JvdW5kVmlldyBvZiB0aGUgc2hlZXRjb250cm9sbGVyXG4vLyBcdG5vblN5c3RlbVNoZWV0VG9wU2hhZG93OnRydWUsIC8vIGhhcyBlZmZlY3Qgb25seSBvbiBcIm5vblN5c3RlbVNoZWV0OnRydWVcIlxuLy8gXHRub25TeXN0ZW1TaGVldFNob3VsZFNjcm9sbDpmYWxzZSwgLy8gd2hlbiB5b3VyIGNvbnRlbnRWaWV3IGlzIG5vdCBhIHNjcm9sbGFibGUgdmlldywgdGhlbiB0aGlzIGFjdGl2YXRlcyBzY3JvbGxpbmcgaWYgdGhlIGNvbnRlbnRWaWV3IGlzIGxhcmdlciB0aGVuIHRoZSBib3R0b21TaGVldCBcblx0XG5cblxuLy8gfSk7XG5cbi8vIC8vIEhhbmRsZSBjbG9zZSBidXR0b24gY2xpY2tcbi8vIGJ1dHRvbi5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsIGZ1bmN0aW9uKCkge1xuLy8gXHRib3R0b21TaGVldENvbnRyb2xsZXIuY2xvc2UoeyBhbmltYXRlZDogdHJ1ZSB9KTtcbi8vIH0pO1xuXG4vLyBjbG9zZUJ1dHRvbi5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsIGZ1bmN0aW9uKCkge1xuLy8gXHRib3R0b21TaGVldENvbnRyb2xsZXIuY2xvc2UoeyBhbmltYXRlZDogdHJ1ZSB9KTtcbi8vIH0pO1xuXG4vLyAvLyBFdmVudCBsaXN0ZW5lcnNcbi8vIGJvdHRvbVNoZWV0Q29udHJvbGxlci5hZGRFdmVudExpc3RlbmVyKCdvcGVuJywgZnVuY3Rpb24oZSkge1xuLy8gXHRUaS5BUEkuaW5mbygnQm90dG9tIFNoZWV0IG9wZW5lZCcpO1xuLy8gfSk7XG5cbi8vIGJvdHRvbVNoZWV0Q29udHJvbGxlci5hZGRFdmVudExpc3RlbmVyKCdjbG9zZScsIGZ1bmN0aW9uKGUpIHtcbi8vIFx0VGkuQVBJLmluZm8oJ0JvdHRvbSBTaGVldCBjbG9zZWQnKTtcbi8vIH0pO1xuXG4vLyBib3R0b21TaGVldENvbnRyb2xsZXIuYWRkRXZlbnRMaXN0ZW5lcignZGlzbWlzc2luZycsIGZ1bmN0aW9uKGUpIHtcbi8vIFx0VGkuQVBJLmluZm8oJ0JvdHRvbSBTaGVldCBkaXNtaXNzaW5nJyk7XG4vLyB9KTtcblxuLy8gYm90dG9tU2hlZXRDb250cm9sbGVyLmFkZEV2ZW50TGlzdGVuZXIoJ2RldGVudENoYW5nZScsIGZ1bmN0aW9uKGUpIHtcbi8vIFx0VGkuQVBJLmluZm8oJ0RldGVudCBjaGFuZ2VkIHRvOiAnICsgZS5zZWxlY3RlZERldGVudElkZW50aWZpZXIpO1xuLy8gfSk7XG5cbi8vIC8vIENyZWF0ZSBvcGVuIGJ1dHRvblxuLy8gdmFyIG9wZW5CdXR0b24gPSBUaS5VSS5jcmVhdGVCdXR0b24oe1xuLy8gXHR0aXRsZTogJ09wZW4gQm90dG9tIFNoZWV0Jyxcbi8vIFx0dG9wOiA1MCxcbi8vIFx0bGVmdDogMjAsXG4vLyBcdHJpZ2h0OiAyMCxcbi8vIFx0aGVpZ2h0OiA0NFxuLy8gfSk7XG5cbi8vIG9wZW5CdXR0b24uYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCBmdW5jdGlvbigpIHtcbi8vIFx0Ym90dG9tU2hlZXRDb250cm9sbGVyLm9wZW4oeyBhbmltYXRlZDogdHJ1ZSB9KTtcbi8vIH0pO1xuXG4vLyB3aW4uYWRkKG9wZW5CdXR0b24pO1xuLy8gd2luLm9wZW4oKTtcblxuXG5cblxuXG5cblxuXG4vLyB2YXIgbmFwcERyYXdlck1vZHVsZSA9IHJlcXVpcmUoJ2RrLm5hcHAuZHJhd2VyJyk7XG5cblxuLy8gLy8gKysrKysrKysrKysrKysrKysrKysrKysrKysrKysrKysrKysrKysrKysrKysrKysrKysrK1xuLy8gLy8gQ29kZSBmb3Igc3RhbmRhbG9uZSB3aW5kb3cgYmVsb3dcbi8vIC8vICsrKysrKysrKysrKysrKysrKysrKysrKysrKysrKysrKysrKysrKysrKysrKysrKysrKytcblxuLy8gdmFyIHRpdGxlQ29udHJvbCA9IFRpLlVJLmNyZWF0ZVZpZXcoe1xuLy8gICAgIGhlaWdodDpUaS5VSS5TSVpFLFxuLy8gICAgIHdpZHRoOlRpLlVJLkZJTEwsXG4vLyAgICAgYmFja2dyb3VuZENvbG9yIDogJ3JlZCdcbi8vIH0pO1xuLy8gdGl0bGVDb250cm9sLmFkZChUaS5VSS5jcmVhdGVMYWJlbCh7XG4vLyAgICAgICAgIGxlZnQ6OTYsXG4vLyAgICAgICAgIGJvdHRvbTo1LFxuLy8gICAgICAgICBiYWNrZ3JvdW5kQ29sb3IgOiAncmVkJyxcbi8vICAgICAgICAgdGV4dDogJ1Rlc3QnLFxuLy8gICAgICAgICBmb250Ontmb250U2l6ZToyMn0sXG4vLyAgICAgICAgIGNvbG9yOiAnI2ZmZicsXG4vLyAgICAgICAgIHdpZHRoOiBUaS5VSS5TSVpFLFxuLy8gICAgICAgICBoZWlnaHQ6MzYsXG4vLyAgICAgICAgIHJpZ2h0OjIwXG4vLyB9KSk7XG5cbi8vIHZhciB3aW4gPSBUaS5VSS5jcmVhdGVXaW5kb3coe1xuLy8gICAgIHRpdGxlOiAnVGVzdCcsXG4vLyAgICAgYmFja2dyb3VuZENvbG9yOiAnI2ZmZicsXG4vLyAgICAgc3VzdGFpbmVkUGVyZm9ybWFuY2VNb2RlOnRydWUsXG4vLyAgICAgZXh0ZW5kU2FmZUFyZWE6ZmFsc2UsXG4vLyAgICAgaGVpZ2h0OlRpLlVJLkZJTEwsXG4vLyAgICAgdG9wOjAsXG4vLyAgICAgYm90dG9tOjBcbi8vICB9KTtcbiBcbi8vICB2YXIgc2VjdGlvbkZydWl0ID0gVGkuVUkuY3JlYXRlVGFibGVWaWV3U2VjdGlvbih7IGhlYWRlclRpdGxlOiAnRnJ1aXQnIH0pO1xuLy8gIHNlY3Rpb25GcnVpdC5hZGQoVGkuVUkuY3JlYXRlVGFibGVWaWV3Um93KHsgdGl0bGU6ICdBcHBsZXMnICwgY2xhc3NOYW1lIDonZnJ1aXRzJywgaXNSZXVzYWJsZTp0cnVlIH0pKTtcbi8vICBzZWN0aW9uRnJ1aXQuYWRkKFRpLlVJLmNyZWF0ZVRhYmxlVmlld1Jvdyh7IHRpdGxlOiAnQmFuYW5hcycgLCBjbGFzc05hbWUgOidmcnVpdHMnLCBpc1JldXNhYmxlOnRydWUgfSkpO1xuLy8gIHNlY3Rpb25GcnVpdC5hZGQoVGkuVUkuY3JlYXRlVGFibGVWaWV3Um93KHsgdGl0bGU6ICdBcHBsZXMnICwgY2xhc3NOYW1lIDonZnJ1aXRzJywgaXNSZXVzYWJsZTp0cnVlIH0pKTtcbi8vICBzZWN0aW9uRnJ1aXQuYWRkKFRpLlVJLmNyZWF0ZVRhYmxlVmlld1Jvdyh7IHRpdGxlOiAnQmFuYW5hcycgLCBjbGFzc05hbWUgOidmcnVpdHMnLCBpc1JldXNhYmxlOnRydWUgfSkpO1xuLy8gIHNlY3Rpb25GcnVpdC5hZGQoVGkuVUkuY3JlYXRlVGFibGVWaWV3Um93KHsgdGl0bGU6ICdBcHBsZXMnICwgY2xhc3NOYW1lIDonZnJ1aXRzJywgaXNSZXVzYWJsZTp0cnVlIH0pKTtcbi8vICBzZWN0aW9uRnJ1aXQuYWRkKFRpLlVJLmNyZWF0ZVRhYmxlVmlld1Jvdyh7IHRpdGxlOiAnQmFuYW5hcycgLCBjbGFzc05hbWUgOidmcnVpdHMnLCBpc1JldXNhYmxlOnRydWUgfSkpO1xuLy8gIHNlY3Rpb25GcnVpdC5hZGQoVGkuVUkuY3JlYXRlVGFibGVWaWV3Um93KHsgdGl0bGU6ICdBcHBsZXMnICwgY2xhc3NOYW1lIDonZnJ1aXRzJywgaXNSZXVzYWJsZTp0cnVlIH0pKTtcbi8vICBzZWN0aW9uRnJ1aXQuYWRkKFRpLlVJLmNyZWF0ZVRhYmxlVmlld1Jvdyh7IHRpdGxlOiAnQmFuYW5hcycsIGNsYXNzTmFtZSA6J2ZydWl0cycsIGlzUmV1c2FibGU6dHJ1ZSAgfSkpO1xuLy8gIHNlY3Rpb25GcnVpdC5hZGQoVGkuVUkuY3JlYXRlVGFibGVWaWV3Um93KHsgdGl0bGU6ICdBcHBsZXMnICwgY2xhc3NOYW1lIDonZnJ1aXRzJywgaXNSZXVzYWJsZTp0cnVlIH0pKTtcbi8vICBzZWN0aW9uRnJ1aXQuYWRkKFRpLlVJLmNyZWF0ZVRhYmxlVmlld1Jvdyh7IHRpdGxlOiAnQmFuYW5hcycgLCBjbGFzc05hbWUgOidmcnVpdHMnLCBpc1JldXNhYmxlOnRydWUgfSkpO1xuIFxuLy8gIHZhciBzZWN0aW9uVmVnID0gVGkuVUkuY3JlYXRlVGFibGVWaWV3U2VjdGlvbih7IGhlYWRlclRpdGxlOiAnVmVnZXRhYmxlcycgfSk7XG4vLyAgc2VjdGlvblZlZy5hZGQoVGkuVUkuY3JlYXRlVGFibGVWaWV3Um93KHsgdGl0bGU6ICdDYXJyb3RzJyAsIGNsYXNzTmFtZSA6J1ZlZ2V0YWJsZXMnLCBpc1JldXNhYmxlOnRydWUgfSkpO1xuLy8gIHNlY3Rpb25WZWcuYWRkKFRpLlVJLmNyZWF0ZVRhYmxlVmlld1Jvdyh7IHRpdGxlOiAnUG90YXRvZXMnICwgY2xhc3NOYW1lIDonVmVnZXRhYmxlcycsIGlzUmV1c2FibGU6dHJ1ZX0pKTtcbi8vICBzZWN0aW9uVmVnLmFkZChUaS5VSS5jcmVhdGVUYWJsZVZpZXdSb3coeyB0aXRsZTogJ0NhcnJvdHMnICwgY2xhc3NOYW1lIDonVmVnZXRhYmxlcycsIGlzUmV1c2FibGU6dHJ1ZX0pKTtcbi8vICBzZWN0aW9uVmVnLmFkZChUaS5VSS5jcmVhdGVUYWJsZVZpZXdSb3coeyB0aXRsZTogJ1BvdGF0b2VzJyAsIGNsYXNzTmFtZSA6J1ZlZ2V0YWJsZXMnLCBpc1JldXNhYmxlOnRydWV9KSk7XG4vLyAgc2VjdGlvblZlZy5hZGQoVGkuVUkuY3JlYXRlVGFibGVWaWV3Um93KHsgdGl0bGU6ICdDYXJyb3RzJyAsIGNsYXNzTmFtZSA6J1ZlZ2V0YWJsZXMnLCBpc1JldXNhYmxlOnRydWV9KSk7XG4vLyAgc2VjdGlvblZlZy5hZGQoVGkuVUkuY3JlYXRlVGFibGVWaWV3Um93KHsgdGl0bGU6ICdQb3RhdG9lcycgLCBjbGFzc05hbWUgOidWZWdldGFibGVzJywgaXNSZXVzYWJsZTp0cnVlfSkpO1xuLy8gIHNlY3Rpb25WZWcuYWRkKFRpLlVJLmNyZWF0ZVRhYmxlVmlld1Jvdyh7IHRpdGxlOiAnQ2Fycm90cycgLCBjbGFzc05hbWUgOidWZWdldGFibGVzJywgaXNSZXVzYWJsZTp0cnVlfSkpO1xuLy8gIHNlY3Rpb25WZWcuYWRkKFRpLlVJLmNyZWF0ZVRhYmxlVmlld1Jvdyh7IHRpdGxlOiAnUG90YXRvZXMnICwgY2xhc3NOYW1lIDonVmVnZXRhYmxlcycsIGlzUmV1c2FibGU6dHJ1ZX0pKTtcbi8vICBzZWN0aW9uVmVnLmFkZChUaS5VSS5jcmVhdGVUYWJsZVZpZXdSb3coeyB0aXRsZTogJ0NhcnJvdHMnICwgY2xhc3NOYW1lIDonVmVnZXRhYmxlcycsIGlzUmV1c2FibGU6dHJ1ZX0pKTtcbi8vICBzZWN0aW9uVmVnLmFkZChUaS5VSS5jcmVhdGVUYWJsZVZpZXdSb3coeyB0aXRsZTogJ1BvdGF0b2VzJyAsIGNsYXNzTmFtZSA6J1ZlZ2V0YWJsZXMnLCBpc1JldXNhYmxlOnRydWV9KSk7XG4vLyAgc2VjdGlvblZlZy5hZGQoVGkuVUkuY3JlYXRlVGFibGVWaWV3Um93KHsgdGl0bGU6ICdDYXJyb3RzJyAsIGNsYXNzTmFtZSA6J1ZlZ2V0YWJsZXMnLCBpc1JldXNhYmxlOnRydWV9KSk7XG4vLyAgc2VjdGlvblZlZy5hZGQoVGkuVUkuY3JlYXRlVGFibGVWaWV3Um93KHsgdGl0bGU6ICdMYXN0IGVudHJ5JywgY2xhc3NOYW1lIDonbGFzdCcsIGlzUmV1c2FibGU6dHJ1ZSB9KSk7XG4gXG4vLyAgdmFyIHRhYmxlVmlldyA9IFRpLlVJLmNyZWF0ZVRhYmxlVmlldyh7XG4vLyAgICBiYWNrZ3JvdW5kQ29sb3I6ICcjY2NjJyxcbi8vICAgIGRhdGE6IFtzZWN0aW9uRnJ1aXQsIHNlY3Rpb25WZWddLFxuLy8gICAgdG9wOjAsXG4vLyAgICBib3R0b206MCxcbi8vICAgIG1pblJvd0hlaWdodDo2OSxcbi8vICAgIHJvd0hlaWdodDo2OSxcbi8vICAgIHdpZHRoOlRpLlVJLkZJTEwsXG4vLyAgICBoZWlnaHQ6VGkuVUkuRklMTCxcbi8vICAgIGJ1YmJsZVBhcmVudDp0cnVlLFxuLy8gICAgbWF4Q2xhc3NuYW1lOjUwXG4vLyAgfSk7XG4vLyAgICAgdGFibGVWaWV3LmFkZEV2ZW50TGlzdGVuZXIoJ3Njcm9sbGVuZCcsIGZ1bmN0aW9uKGUpIHtcbi8vICAgICAgICAgLy9UaS5BUEkud2FybignU2Nyb2xsaW5nIHN0b3BwZWQhICBjb250ZW50T2Zmc2V0Lnk6ICcgKyBlLmNvbnRlbnRPZmZzZXQueSk7XG4vLyAgICAgfSk7XG4vLyAgICAgdGFibGVWaWV3LmFkZEV2ZW50TGlzdGVuZXIoJ3Njcm9sbCcsIGZ1bmN0aW9uKGUpIHtcbi8vICAgICAgICAgLy9UaS5BUEkud2FybignU2Nyb2xsaW5nISBjb250ZW50T2Zmc2V0Lnk6ICcgKyBlLmNvbnRlbnRPZmZzZXQueSk7XG4vLyAgICAgfSk7XG5cbi8vICB2YXIgdG9vbGJhckNvbnRhaW5lciA9IFRpLlVJLmNyZWF0ZVZpZXcoe1xuLy8gICAgICBiYWNrZ3JvdW5kQ29sb3I6ICcjYWEyZjUzYzMnLFxuLy8gICAgICB3aWR0aDpUaS5VSS5GSUxMLFxuLy8gICAgICBoZWlnaHQ6VGkuVUkuU0laRSxcbi8vICAgICAgYm90dG9tOjBcbi8vICAgIH0pO1xuXG4vLyAgdmFyIHRvb2xiYXJWaWV3ID0gVGkuVUkuY3JlYXRlVmlldyh7XG4vLyAgICAgYmFja2dyb3VuZENvbG9yOiAnI2FhMmY1M2MzJyxcbi8vICAgICBsYXlvdXQ6J2hvcml6b250YWwnLFxuLy8gICAgIHdpZHRoOlRpLlVJLkZJTEwsXG4vLyAgICAgaGVpZ2h0OlRpLlVJLlNJWkUsXG4vLyAgICAgYm90dG9tOjUsXG4vLyAgICAgdG9wOjVcbi8vICAgfSk7XG5cbi8vICAgdG9vbGJhckNvbnRhaW5lci5hZGQodG9vbGJhclZpZXcpO1xuXG5cbi8vIHZhciBzZW5kID0gVGkuVUkuY3JlYXRlQnV0dG9uKHtcbi8vICAgICB0aXRsZTogJ1NlbmQnLFxuLy8gICAgIHN0eWxlOlRpdGFuaXVtLlVJLkJVVFRPTl9TVFlMRV9GSUxMRUQsXG4vLyAgICAgYmFja2dyb3VuZENvbG9yOidibHVlJyxcbi8vICAgICBiYWNrZ3JvdW5kU2VsZWN0ZWRDb2xvcjonYmx1ZScsXG4vLyAgICAgdGludENvbG9yOicjZmZmJyxcbi8vICAgICB0ZXh0QWxpZ246VGl0YW5pdW0uVUkuVEVYVF9BTElHTk1FTlRfQ0VOVEVSLFxuLy8gICAgIHZlcnRpY2FsQWxpZ246VGl0YW5pdW0uVUkuVEVYVF9WRVJUSUNBTF9BTElHTk1FTlRfQ0VOVEVSLFxuLy8gICAgIGJvcmRlclJhZGl1czoxMixcbi8vICAgICB3aWR0aDpUaS5VSS5GSUxMLFxuLy8gICAgIHJpZ2h0OjEwLFxuLy8gICAgIGJvdHRvbTooQU5EUk9JRCkgPyA1IDogMTBcbi8vIH0pO1xuXG4vLyB2YXIgdGV4dEFyZWEgPSBUaS5VSS5jcmVhdGVUZXh0QXJlYSh7XG4vLyAgICAgdG9wOjgsXG4vLyAgICAgYm90dG9tOjgsXG4vLyAgICAgbGVmdDoxNSxcbi8vICAgICByaWdodDo4LFxuLy8gICAgIGF1dG9jb3JyZWN0OiBmYWxzZSxcbi8vICAgICBlZGl0YWJsZTp0cnVlLFxuLy8gICAgIGxpbmVzOjEsXG4vLyAgICAgbWF4TGluZXM6NSxcbi8vICAgICBib3JkZXJXaWR0aDogMSxcbi8vICAgICBib3JkZXJDb2xvcjogJyNhYWEnLFxuLy8gICAgIGJvcmRlclJhZGl1czogMTYsXG4vLyAgICAgY29sb3I6ICcjMDAwJyxcbi8vICAgICBiYWNrZ3JvdW5kQ29sb3I6ICcjZmZmJyxcbi8vICAgICBmb250OiB7Zm9udFNpemU6MTYsIGZvbnRXZWlnaHQ6J25vcm1hbCd9LFxuLy8gICAgIHRleHRBbGlnbjogJ2xlZnQnLFxuLy8gICAgIHZhbHVlOiAnJyxcbi8vICAgICB3aWR0aDogJzcwJScsXG4vLyAgICAgcGFkZGluZzp7bGVmdDo0LHJpZ2h0OjQsdG9wOjgsYm90dG9tOjh9LFxuLy8gICAgIGhlaWdodCA6IFRpLlVJLlNJWkUsXG4vLyAgICAgc3VwcHJlc3NSZXR1cm46ZmFsc2Vcbi8vICAgfSk7XG4gICAgXG4vLyAgIHRvb2xiYXJWaWV3LmFkZCh0ZXh0QXJlYSk7XG4vLyAgIHRvb2xiYXJWaWV3LmFkZChzZW5kKTtcbiAgICAgXG4vLyAgaWYgKEFORFJPSUQpIHtcbi8vICAgICAgdmFyIGludGVyYWN0aXZlS2V5Ym9hcmRWaWV3ID0ga2V5Ym9hcmRDb250cm9sTW9kdWxlLmNyZWF0ZVZpZXcoe1xuLy8gICAgICAgICAgc2hvd0tleWJvYXJkT25TY3JvbGxVcDp0cnVlLCAvLyBzaG93IGtleWJvYXJkICh3aGVuIGhpZGRlbikgb24gc2Nyb2xsaW5nIHVwXG4vLyAgICAgICAgICBhdXRvQWRqdXN0Qm90dG9tUGFkZGluZzp0cnVlLCAvLyBzY3JvbGxpbmdWaWV3IHdpbGwgc3RheSBhdCB0aGUgc2l6ZSB5b3Ugc2V0LCBidXQgdGhlIHNjcm9sbEluc2V0Qm90dG9tIHdpbGwgYXV0b21hdGljbHkgYWRqdXN0IHRvIHRoZSB0b29sYmFyIGhlaWdodCAoZXg6IGJsdXJWaWV3VG9vbGJhciwgeW91IGNhbiBzZWUgdGhlIHNjcm9sbGluZ1ZpZXcgY29udGVudCB0aHJvdWdoIHRoZSBibHVycmVkIHRvb2xiYXIpXG4vLyAgICAgICAgICBhdXRvU2Nyb2xsVG9Cb3R0b206dHJ1ZSwgLy8gc2Nyb2xsaW5nIHRvIGJvdHRvbSBvbiB0b29sYmFyIHNpemUgY2hhbmdlXG4vLyAgICAgICAgICBhdXRvU2l6ZUFuZEtlZXBTY3JvbGxpbmdWaWV3QWJvdmVUb29sYmFyOmZhbHNlLCAvLyBzY3JvbGxpbmdWaWV3IHdpbGwgYmUgYWx3YXlzIG9uIHRvcCBvZiB0aGUgdG9vbGJhclZpZXcgLSB0aGUgc2Nyb2xsaW5nVmlldyByZXNpemVzIGF1dG9tYXRpY2x5IHJlc3BlY3RpbmcgdGhlIHNjcm9sbGluZ1ZpZXcgYm90dG9tIHZhbHVlIChpZiBzZXQpIHdoZW4gXCJ0cnVlXCIgLT4gXCJhdXRvQWRqdXN0Qm90dG9tUGFkZGluZz10cnVlXCIgaGFzIG5vIGVmZmVjdFxuLy8gICAgICAgICAgc2Nyb2xsaW5nVmlldzp0YWJsZVZpZXcsIC8vIHdoYXRldmVyIGxpc3RWaWV3LCB0YWJsZVZpZXcsIHNjcm9sbFZpZXcgLT4gd2lsbCBiZSBhdXRvbWF0aWNseSBhZGRlZCB0byB0aGUgaW50ZXJhY3RpdmVLZXlib2FyZFZpZXdcbi8vICAgICAgICAgIHRvb2xiYXJWaWV3OnRvb2xiYXJDb250YWluZXIsIC8vIGhhcyB0byBiZSBhIFRpLlVJLlZpZXchISEgIC0+IHdpbGwgYmUgYXV0b21hdGljbHkgYWRkZWQgdG8gdGhlIGludGVyYWN0aXZlS2V5Ym9hcmRWaWV3XG4vLyAgICAgICAgICBiYWNrZ3JvdW5kQ29sb3I6JyNmZWZlZmUnLFxuLy8gICAgICAgICAgdG9wOjAsXG4vLyAgICAgICAgICBib3R0b206MFxuLy8gICAgICB9KTsgXG4vLyAgICAgIHdpbi5hZGQoaW50ZXJhY3RpdmVLZXlib2FyZFZpZXcpO1xuLy8gIH1cbi8vICBlbHNlIHtcblxuLy8gICAgIHZhciBpbnRlcmFjdGl2ZUtleWJvYXJkVmlldyA9IGtleWJvYXJkQ29udHJvbE1vZHVsZS5jcmVhdGVWaWV3KHtcbi8vICAgICAgICAgcGFyZW50V2luZG93Ondpbixcbi8vICAgICAgICAgYXV0b0FkanVzdEJvdHRvbVBhZGRpbmc6dHJ1ZSxcbi8vICAgICAgICAgYXV0b1Njcm9sbFRvQm90dG9tOnRydWUsIC8vIHNjcm9sbGluZyB0byBib3R0b20gb24gdG9vbGJhciBzaXplIGNoYW5nZVxuLy8gICAgICAgICBhdXRvU2l6ZUFuZEtlZXBTY3JvbGxpbmdWaWV3QWJvdmVUb29sYmFyOmZhbHNlLCAvLyBzY3JvbGxpbmdWaWV3IHdpbGwgYmUgYWx3YXlzIG9uIHRvcCBvZiB0aGUgdG9vbGJhclZpZXcgLSB0aGUgc2Nyb2xsaW5nVmlldyByZXNpemVzIGF1dG9tYXRpY2x5IHJlc3BlY3RpbmcgdGhlIHNjcm9sbGluZ1ZpZXcgYm90dG9tIHZhbHVlIChpZiBzZXQpIHdoZW4gXCJ0cnVlXCIgLT4gXCJhdXRvQWRqdXN0Qm90dG9tUGFkZGluZz10cnVlXCIgaGFzIG5vIGVmZmVjdCBpbiB0aGF0IGNhc2Vcbi8vICAgICAgICAgaWdub3JlRXh0ZW5kU2FmZUFyZWE6ZmFsc2UsIC8vIG9ubHkgdXNlZCB3aGVuZSB0aGUgcGFyZW50V2luZG93IGhhcyBcImV4dGVuZFNhZmVBcmVhOnRydWVcIiBBTkQgcGFyZW50V2luZG93IGlzIGEgc3RhbmRhbG9uZSB3aW5kb3cgKG5vdCBjb250YWluZWQgaW4gTmF2aWdhdGlvbldpbmRvdyBhbmQvb3IgVGFnR3JvdXApIC0+IHRoZSBtb2R1bGUgZG9lcyBhdXRvZGV0ZWN0IHRoYXQhXG4vLyAgICAgICAgIHNjcm9sbGluZ1ZpZXc6dGFibGVWaWV3LCAvLyB3aGF0ZXZlciBsaXN0VmlldywgdGFibGVWaWV3LCBzY3JvbGxWaWV3ICAtPiB3aWxsIGJlIGF1dG9tYXRpY2x5IGFkZGVkIHRvIHRoZSBpbnRlcmFjdGl2ZUtleWJvYXJkVmlld1xuLy8gICAgICAgICB0b29sYmFyVmlldzp0b29sYmFyQ29udGFpbmVyLCAvLyBoYXMgdG8gYmUgYSBUaS5VSS5WaWV3ISEhIC0+IHdpbGwgYmUgYXV0b21hdGljbHkgYWRkZWQgdG8gdGhlIGludGVyYWN0aXZlS2V5Ym9hcmRWaWV3XG4vLyAgICAgICAgIHRleHRmaWVsZDp0ZXh0QXJlYSwgLy8gcmVxdWlyZWQgLT4gcHV0IGhlcmUgeW91ciBUaS5VSS5UZXh0QXJlYSBvciBUaXRhbml1bS5VSS5UZXh0RmllbGRcbi8vICAgICAgICAga2V5Ym9hcmRQYW5uaW5nOnRydWUsXG4vLyAgICAgICAgIGJhY2tncm91bmRDb2xvcjonI2ZlZmVmZScsXG4vLyAgICAgICAgIHRvcDowLFxuLy8gICAgICAgICBib3R0b206MFxuLy8gICAgIH0pO1xuLy8gICAgIHdpbi5hZGQoaW50ZXJhY3RpdmVLZXlib2FyZFZpZXcpO1xuLy8gIH1cblxuLy8gIHdpbi5vcGVuKCk7XG5cblxuXG4vLyAvLyAvLyArKysrKysrKysrKysrKysrKysrKysrKysrKysrKysrKysrKysrKysrKysrKysrKysrKysrXG4vLyAvLyAvLyBDb2RlIGZvciBUYWJHcm91cCBiZWxvd1xuLy8gLy8gLy8gKysrKysrKysrKysrKysrKysrKysrKysrKysrKysrKysrKysrKysrKysrKysrKysrKysrK1xuXG4vLyArKysrKysrKysrKysrKysrKysrKysrKysrKysrKysrKysrKysrKysrKysrKysrKysrKysrXG4vLyBDb2RlIGZvciBUYWJHcm91cCBpbiBOYXZpZ2F0aW9uV2luZG93XG4vLyArKysrKysrKysrKysrKysrKysrKysrKysrKysrKysrKysrKysrKysrKysrKysrKysrKysrXG5cblxuLyoqXG4gKiBPcGVuIHRoZSB0YWJHcm91cCBpbiBhIG5hdmlnYXRpb25XaW5kb3dcbiAqL1xuLy8gdmFyIG5hdmlnYXRpb25XaW5kb3cgPSBUaXRhbml1bS5VSS5jcmVhdGVOYXZpZ2F0aW9uV2luZG93KHtcbi8vICAgICB3aW5kb3c6IHRhYkdyb3VwXG4vLyB9KTtcbi8vIG5hdmlnYXRpb25XaW5kb3cub3BlbigpO1xuXG5cblxuXG52YXIgQU5EUk9JRCA9IChUaS5QbGF0Zm9ybS5vc25hbWUgPT09ICdhbmRyb2lkJyk7XG52YXIga2V5Ym9hcmRDb250cm9sTW9kdWxlID0gcmVxdWlyZSgnZGUubWFyY2JlbmRlci5rZXlib2FyZGNvbnRyb2wnKTtcblxuLyoqXG4gKiBDcmVhdGUgYSBuZXcgYFRpLlVJLlRhYkdyb3VwYC5cbiAqL1xudmFyIHRhYkdyb3VwID0gVGkuVUkuY3JlYXRlVGFiR3JvdXAoKTtcblxuLy8gIC8qKlxuLy8gICAqIEFkZCB0aGUgdHdvIGNyZWF0ZWQgdGFicyB0byB0aGUgdGFiR3JvdXAgb2JqZWN0LlxuLy8gICovXG4gIHRhYkdyb3VwLmFkZFRhYihjcmVhdGVUYWIoXCJBdXRvQWRqdXN0Qm90dG9tUGFkZGluZ1wiLCBcIlwiLCBcImFzc2V0cy9pbWFnZXMvdGFiMS5wbmdcIikpO1xuICB0YWJHcm91cC5hZGRUYWIoY3JlYXRlVGFiKFwiS2VlcFNjcm9sbGluZ1ZpZXdBYm92ZVwiLCBcIlwiLCBcImFzc2V0cy9pbWFnZXMvdGFiMi5wbmdcIikpO1xuXG5cbi8vIC8vICsrKysrKysrKysrKysrKysrKysrKysrKysrKysrKysrKysrKysrKysrKysrKysrKysrKytcbi8vIC8vIENvZGUgZm9yIFRhYkdyb3VwIG9ubHlcbi8vIC8vICsrKysrKysrKysrKysrKysrKysrKysrKysrKysrKysrKysrKysrKysrKysrKysrKysrKytcblxuLy8gLyoqXG4vLyAgKiBPcGVuIHRoZSB0YWJHcm91cFxuLy8gICovXG50YWJHcm91cC5vcGVuKCk7XG5cblxuLy8gLyoqXG4vLyAgKiBDcmVhdGVzIGEgbmV3IFRhYiBhbmQgY29uZmlndXJlcyBpdC5cbi8vICAqXG4vLyAgKiBAcGFyYW0gIHtTdHJpbmd9IHRpdGxlIFRoZSB0aXRsZSB1c2VkIGluIHRoZSBgVGkuVUkuVGFiYCBhbmQgaXQncyBpbmNsdWRlZCBgVGkuVUkuV2luZG93YFxuLy8gICogQHBhcmFtICB7U3RyaW5nfSBtZXNzYWdlIFRoZSB0aXRsZSBkaXNwbGF5ZWQgaW4gdGhlIGBUaS5VSS5MYWJlbGBcbi8vICAqIEByZXR1cm4ge1N0cmluZ30gaWNvbiBUaGUgaWNvbiB1c2VkIGluIHRoZSBgVGkuVUkuVGFiYFxuLy8gICovXG5mdW5jdGlvbiBjcmVhdGVUYWIodGl0bGUsIG1lc3NhZ2UsIGljb24pIHtcblxuICAgIHZhciB3aW4gPSBUaS5VSS5jcmVhdGVXaW5kb3coe1xuICAgICAgIHRpdGxlOiAnVGVzdCcsXG4gICAgICAgYmFyQ29sb3IgOiAnIzM2NWI4NScsXG4gICAgICAgYmFja2dyb3VuZENvbG9yOiAnI2ZmZicsXG4gICAgICAgZXh0ZW5kU2FmZUFyZWE6ZmFsc2UsXG5cdCAgIHRhYkJhckhpZGRlbjoodGl0bGUgPT0gXCJLZWVwU2Nyb2xsaW5nVmlld0Fib3ZlXCIpID8gdHJ1ZSA6IGZhbHNlLFxuICAgICAgIHN1c3RhaW5lZFBlcmZvcm1hbmNlTW9kZTp0cnVlXG4gICAgfSk7XG4gICAgXG5cblx0dmFyIHZpZXcgPSBUaXRhbml1bS5VSS5jcmVhdGVWaWV3KHtcblx0XHRiYWNrZ3JvdW5kQ29sb3I6J3llbGxvdycsXG5cdFx0d2lkdGg6IFRpLlVJLkZJTEwsXG5cdFx0bGF5b3V0Oidob3Jpem9udGFsJyxcblx0XHRoZWlnaHQ6IDY5XG5cdH0pO1xuXG5cdHZhciBsYWJlbCA9IFRpLlVJLmNyZWF0ZUxhYmVsKHtcblx0XHR0ZXh0OiAnTGl0ZVJUTE0gQ2hhdCcsXG5cdFx0Y29sb3I6ICcjZTk0NTYwJyxcblx0XHRiYWNrZ3JvdW5kQ29sb3I6J3llbGxvdycsXG5cdFx0Zm9udDogeyBmb250U2l6ZTogMTgsIGZvbnRXZWlnaHQ6ICdib2xkJyB9LFxuXHRcdGxlZnQ6IDEwLFxuXHRcdHdpZHRoOiAyMDBcblx0fSk7XG5cblx0dmFyIGltYWdlID0gVGkuVUkuY3JlYXRlSW1hZ2VWaWV3KHtcblx0XHRpbWFnZTonL2Fzc2V0cy9pbWFnZXMvdGFiMi5wbmcnLFxuXHRcdGFuaW1hdGVkOnRydWUsXG5cdFx0dGludENvbG9yOidncmVlbicsXG5cdFx0aGVpZ2h0OjQ2LFxuXHRcdGNhbGNNaW5NYXg6IHRydWUsXG4gICAgXHRtYXhXaWR0aDogMTIwLFxuXHQgICAgbWF4SGVpZ2h0OiA2OSxcblx0XHRjYWxjTWluTWF4RG9uZTpmYWxzZSxcblx0XHRhdmVyYWdlQ29sb3JEb25lOmZhbHNlLFxuXHQgICAgbm9UcmFuc3BhcmVuY3k6IGZhbHNlLFxuXHRcdGJsdXJyZWRJbWFnZTogZmFsc2UsXG5cdFx0Ymx1clJhZGl1czogMjBcblx0fSk7XG5cblx0aW1hZ2UuYWRkRXZlbnRMaXN0ZW5lcignYXZlcmFnZUNvbG9yJywgZnVuY3Rpb24oZSkge1xuXHRcdGNvbnNvbGUubG9nKCcjIyMjIyBhdmVyYWdlQ29sb3I6ICcsIEpTT04uc3RyaW5naWZ5KGUpKTtcblx0fSk7XG5cblx0aW1hZ2UuYWRkRXZlbnRMaXN0ZW5lcignaW1hZ2VNaW5NYXgnLCBmdW5jdGlvbihlKSB7XG5cdFx0Y29uc29sZS5sb2coJyMjIyMjIGltYWdlTWluTWF4OiAnLCBKU09OLnN0cmluZ2lmeShlKSk7XG5cdH0pO1x0XG5cblx0dmlldy5hZGQoaW1hZ2UpO1xuXHR2aWV3LmFkZChsYWJlbCk7XG5cblx0dmFyIHJvdyA9IFRpdGFuaXVtLlVJLmNyZWF0ZVRhYmxlVmlld1Jvdyh7XG5cdFx0aXNSZXVzYWJsZTp0cnVlLFxuXHRcdGhlaWdodDpUaS5VSS5TSVpFLFxuXHRcdG9wYXF1ZVJvdzp0cnVlLFxuXHRcdGNsYXNzTmFtZToneWVsbG93J1xuXHR9KTtcblx0cm93LmFkZCh2aWV3KTtcblxuICAgIHZhciBzZWN0aW9uRnJ1aXQgPSBUaS5VSS5jcmVhdGVUYWJsZVZpZXdTZWN0aW9uKHsgaGVhZGVyVGl0bGU6ICdGcnVpdCcsIGJhY2tncm91bmRDb2xvcjonYmx1ZScgfSk7XG4gICAgc2VjdGlvbkZydWl0LmFkZChyb3cpO1xuICAgIHNlY3Rpb25GcnVpdC5hZGQoVGkuVUkuY3JlYXRlVGFibGVWaWV3Um93KHsgdGl0bGU6ICdCYW5hbmFzJywgbGVmdEltYWdlOiAnL2Fzc2V0cy9pbWFnZXMvdGFiMi5wbmcnLCBjb2xvcjonYmxhY2snLCBoYXNDaGlsZDp0cnVlLCBpc1JldXNhYmxlOnRydWUsIGNsYXNzTmFtZTonZnJ1aXRzYmx1ZScsIGhlaWdodDo2OSwgb3BhcXVlUm93OnRydWUsIGJhY2tncm91bmRDb2xvcjonYmx1ZScsIGJhY2tncm91bmRTZWxlY3RlZENvbG9yOidyZWQnIH0pKTtcbiAgICBzZWN0aW9uRnJ1aXQuYWRkKFRpLlVJLmNyZWF0ZVRhYmxlVmlld1Jvdyh7IHRpdGxlOiAnQXBwbGVzJywgaXNSZXVzYWJsZTp0cnVlLCBjbGFzc05hbWU6J2ZydWl0c2JsdWUnLCBoZWlnaHQ6NjksIG9wYXF1ZVJvdzp0cnVlLCBiYWNrZ3JvdW5kQ29sb3I6J2JsdWUnfSkpO1xuICAgIHNlY3Rpb25GcnVpdC5hZGQoVGkuVUkuY3JlYXRlVGFibGVWaWV3Um93KHsgdGl0bGU6ICdCYW5hbmFzJywgaXNSZXVzYWJsZTp0cnVlLCBjbGFzc05hbWU6J2ZydWl0cycsIGhlaWdodDo2OSwgb3BhcXVlUm93OnRydWUsIGJhY2tncm91bmRDb2xvcjonZ3JlZW4nIH0pKTtcbiAgICBzZWN0aW9uRnJ1aXQuYWRkKFRpLlVJLmNyZWF0ZVRhYmxlVmlld1Jvdyh7IHRpdGxlOiAnQXBwbGVzJywgaXNSZXVzYWJsZTp0cnVlLCBjbGFzc05hbWU6J2ZydWl0cycsIGhlaWdodDo2OSwgb3BhcXVlUm93OnRydWUsIGJhY2tncm91bmRDb2xvcjonZ3JlZW4nIH0pKTtcbiAgICBzZWN0aW9uRnJ1aXQuYWRkKFRpLlVJLmNyZWF0ZVRhYmxlVmlld1Jvdyh7IHRpdGxlOiAnQmFuYW5hcyA5MCcsIGlzUmV1c2FibGU6dHJ1ZSwgY2xhc3NOYW1lOidmcnVpdHMnLCBoZWlnaHQ6OTAsIG9wYXF1ZVJvdzp0cnVlLCBiYWNrZ3JvdW5kQ29sb3I6J2dyZWVuJyB9KSk7XG4gICAgc2VjdGlvbkZydWl0LmFkZChUaS5VSS5jcmVhdGVUYWJsZVZpZXdSb3coeyB0aXRsZTogJ0FwcGxlcycsIGlzUmV1c2FibGU6dHJ1ZSwgY2xhc3NOYW1lOidmcnVpdHMnLCBoZWlnaHQ6NjksIG9wYXF1ZVJvdzp0cnVlLCBiYWNrZ3JvdW5kQ29sb3I6J2dyZWVuJyB9KSk7XG4gICAgc2VjdGlvbkZydWl0LmFkZChUaS5VSS5jcmVhdGVUYWJsZVZpZXdSb3coeyB0aXRsZTogJ0JhbmFuYXMnLCBpc1JldXNhYmxlOnRydWUsIGNsYXNzTmFtZTonZnJ1aXRzJywgaGVpZ2h0OjY5LCBvcGFxdWVSb3c6dHJ1ZSwgYmFja2dyb3VuZENvbG9yOidncmVlbicgfSkpO1xuICAgIHNlY3Rpb25GcnVpdC5hZGQoVGkuVUkuY3JlYXRlVGFibGVWaWV3Um93KHsgdGl0bGU6ICdBcHBsZXMnLCBpc1JldXNhYmxlOnRydWUsIGNsYXNzTmFtZTonZnJ1aXRzJywgaGVpZ2h0OjY5LCBvcGFxdWVSb3c6dHJ1ZSwgYmFja2dyb3VuZENvbG9yOidncmVlbicgfSkpO1xuICAgIFxuICAgIHZhciBzZWN0aW9uVmVnID0gVGkuVUkuY3JlYXRlVGFibGVWaWV3U2VjdGlvbih7IGhlYWRlclRpdGxlOiAnVmVnZXRhYmxlcycgfSk7XG4gICAgc2VjdGlvblZlZy5hZGQoVGkuVUkuY3JlYXRlVGFibGVWaWV3Um93KHsgdGl0bGU6ICdDYXJyb3RzJywgaXNSZXVzYWJsZTp0cnVlLCBjbGFzc05hbWU6J3ZlZycsIGhlaWdodDo2OSwgb3BhcXVlUm93OnRydWUsIGJhY2tncm91bmRDb2xvcjonZ3JlZW4nIH0pKTtcbiAgICBzZWN0aW9uVmVnLmFkZChUaS5VSS5jcmVhdGVUYWJsZVZpZXdSb3coeyB0aXRsZTogJ1BvdGF0b2VzJywgaXNSZXVzYWJsZTp0cnVlLCBjbGFzc05hbWU6J3ZlZycsIGhlaWdodDo2OSwgb3BhcXVlUm93OnRydWUsIGJhY2tncm91bmRDb2xvcjonZ3JlZW4nIH0pKTtcbiAgICBzZWN0aW9uVmVnLmFkZChUaS5VSS5jcmVhdGVUYWJsZVZpZXdSb3coeyB0aXRsZTogJ0NhcnJvdHMnLCBpc1JldXNhYmxlOnRydWUsIGNsYXNzTmFtZTondmVnJywgaGVpZ2h0OjY5LCBvcGFxdWVSb3c6dHJ1ZSwgYmFja2dyb3VuZENvbG9yOidncmVlbicgfSkpO1xuICAgIHNlY3Rpb25WZWcuYWRkKFRpLlVJLmNyZWF0ZVRhYmxlVmlld1Jvdyh7IHRpdGxlOiAnUG90YXRvZXMnLCBpc1JldXNhYmxlOnRydWUsIGNsYXNzTmFtZTondmVnJywgaGVpZ2h0OjY5LCBvcGFxdWVSb3c6dHJ1ZSwgYmFja2dyb3VuZENvbG9yOidncmVlbicgfSkpO1xuICAgIHNlY3Rpb25WZWcuYWRkKFRpLlVJLmNyZWF0ZVRhYmxlVmlld1Jvdyh7IHRpdGxlOiAnQ2Fycm90cycsIGlzUmV1c2FibGU6dHJ1ZSwgY2xhc3NOYW1lOid2ZWcnLCBoZWlnaHQ6NjksIG9wYXF1ZVJvdzp0cnVlLCBiYWNrZ3JvdW5kQ29sb3I6J2dyZWVuJyB9KSk7XG4gICAgc2VjdGlvblZlZy5hZGQoVGkuVUkuY3JlYXRlVGFibGVWaWV3Um93KHsgdGl0bGU6ICdQb3RhdG9lcycsIGlzUmV1c2FibGU6dHJ1ZSwgY2xhc3NOYW1lOid2ZWcnLCBoZWlnaHQ6NjksIG9wYXF1ZVJvdzp0cnVlLCBiYWNrZ3JvdW5kQ29sb3I6J2dyZWVuJyB9KSk7XG4gICAgc2VjdGlvblZlZy5hZGQoVGkuVUkuY3JlYXRlVGFibGVWaWV3Um93KHsgdGl0bGU6ICdDYXJyb3RzJywgaXNSZXVzYWJsZTp0cnVlLCBjbGFzc05hbWU6J3ZlZycsIGhlaWdodDo2OSwgb3BhcXVlUm93OnRydWUsIGJhY2tncm91bmRDb2xvcjonZ3JlZW4nIH0pKTtcbiAgICBzZWN0aW9uVmVnLmFkZChUaS5VSS5jcmVhdGVUYWJsZVZpZXdSb3coeyB0aXRsZTogJ1BvdGF0b2VzJywgaXNSZXVzYWJsZTp0cnVlLCBjbGFzc05hbWU6J3ZlZycsIGhlaWdodDo2OSwgb3BhcXVlUm93OnRydWUsIGJhY2tncm91bmRDb2xvcjonZ3JlZW4nIH0pKTtcbiAgICBzZWN0aW9uVmVnLmFkZChUaS5VSS5jcmVhdGVUYWJsZVZpZXdSb3coeyB0aXRsZTogJ0NhcnJvdHMnLCBpc1JldXNhYmxlOnRydWUsIGNsYXNzTmFtZTondmVnJywgaGVpZ2h0OjY5LCBvcGFxdWVSb3c6dHJ1ZSwgYmFja2dyb3VuZENvbG9yOidncmVlbicgfSkpO1xuICAgIHNlY3Rpb25WZWcuYWRkKFRpLlVJLmNyZWF0ZVRhYmxlVmlld1Jvdyh7IHRpdGxlOiAnUG90YXRvZXMnLCBpc1JldXNhYmxlOnRydWUsIGNsYXNzTmFtZTondmVnJywgaGVpZ2h0OjY5LCBvcGFxdWVSb3c6dHJ1ZSwgYmFja2dyb3VuZENvbG9yOidncmVlbicgfSkpO1xuICAgIHNlY3Rpb25WZWcuYWRkKFRpLlVJLmNyZWF0ZVRhYmxlVmlld1Jvdyh7IHRpdGxlOiAnQ2Fycm90cycsIGlzUmV1c2FibGU6dHJ1ZSwgY2xhc3NOYW1lOid2ZWcnLCBoZWlnaHQ6NjksIG9wYXF1ZVJvdzp0cnVlLCBiYWNrZ3JvdW5kQ29sb3I6J2dyZWVuJyB9KSk7XG5cdHNlY3Rpb25WZWcuYWRkKFRpLlVJLmNyZWF0ZVRhYmxlVmlld1Jvdyh7IHRpdGxlOiAnQ2Fycm90cycsIGlzUmV1c2FibGU6dHJ1ZSwgY2xhc3NOYW1lOid2ZWcnLCBoZWlnaHQ6NjksIG9wYXF1ZVJvdzp0cnVlLCBiYWNrZ3JvdW5kQ29sb3I6J2dyZWVuJyB9KSk7XG4gICAgc2VjdGlvblZlZy5hZGQoVGkuVUkuY3JlYXRlVGFibGVWaWV3Um93KHsgdGl0bGU6ICdQb3RhdG9lcycsIGlzUmV1c2FibGU6dHJ1ZSwgY2xhc3NOYW1lOid2ZWcnLCBoZWlnaHQ6NjksIG9wYXF1ZVJvdzp0cnVlLCBiYWNrZ3JvdW5kQ29sb3I6J2dyZWVuJyB9KSk7XG4gICAgc2VjdGlvblZlZy5hZGQoVGkuVUkuY3JlYXRlVGFibGVWaWV3Um93KHsgdGl0bGU6ICdDYXJyb3RzJywgaXNSZXVzYWJsZTp0cnVlLCBjbGFzc05hbWU6J3ZlZycsIGhlaWdodDo2OSwgb3BhcXVlUm93OnRydWUsIGJhY2tncm91bmRDb2xvcjonZ3JlZW4nIH0pKTtcbiAgICBzZWN0aW9uVmVnLmFkZChUaS5VSS5jcmVhdGVUYWJsZVZpZXdSb3coeyB0aXRsZTogJ1BvdGF0b2VzJywgaXNSZXVzYWJsZTp0cnVlLCBjbGFzc05hbWU6J3ZlZycsIGhlaWdodDo2OSwgb3BhcXVlUm93OnRydWUsIGJhY2tncm91bmRDb2xvcjonZ3JlZW4nIH0pKTtcbiAgICBzZWN0aW9uVmVnLmFkZChUaS5VSS5jcmVhdGVUYWJsZVZpZXdSb3coeyB0aXRsZTogJ0NhcnJvdHMnLCBpc1JldXNhYmxlOnRydWUsIGNsYXNzTmFtZTondmVnJywgaGVpZ2h0OjY5LCBvcGFxdWVSb3c6dHJ1ZSwgYmFja2dyb3VuZENvbG9yOidncmVlbicgfSkpO1xuICAgIHNlY3Rpb25WZWcuYWRkKFRpLlVJLmNyZWF0ZVRhYmxlVmlld1Jvdyh7IHRpdGxlOiAnUG90YXRvZXMnLCBpc1JldXNhYmxlOnRydWUsIGNsYXNzTmFtZTondmVnJywgaGVpZ2h0OjY5LCBvcGFxdWVSb3c6dHJ1ZSwgYmFja2dyb3VuZENvbG9yOidncmVlbicgfSkpO1xuICAgIHNlY3Rpb25WZWcuYWRkKFRpLlVJLmNyZWF0ZVRhYmxlVmlld1Jvdyh7IHRpdGxlOiAnQ2Fycm90cycsIGlzUmV1c2FibGU6dHJ1ZSwgY2xhc3NOYW1lOid2ZWcnLCBoZWlnaHQ6NjksIG9wYXF1ZVJvdzp0cnVlLCBiYWNrZ3JvdW5kQ29sb3I6J2dyZWVuJyB9KSk7XG4gICAgc2VjdGlvblZlZy5hZGQoVGkuVUkuY3JlYXRlVGFibGVWaWV3Um93KHsgdGl0bGU6ICdQb3RhdG9lcycsIGlzUmV1c2FibGU6dHJ1ZSwgY2xhc3NOYW1lOid2ZWcnLCBoZWlnaHQ6NjksIG9wYXF1ZVJvdzp0cnVlLCBiYWNrZ3JvdW5kQ29sb3I6J2dyZWVuJyB9KSk7XG4gICAgc2VjdGlvblZlZy5hZGQoVGkuVUkuY3JlYXRlVGFibGVWaWV3Um93KHsgdGl0bGU6ICdDYXJyb3RzJywgaXNSZXVzYWJsZTp0cnVlLCBjbGFzc05hbWU6J3ZlZycsIGhlaWdodDo2OSwgb3BhcXVlUm93OnRydWUsIGJhY2tncm91bmRDb2xvcjonZ3JlZW4nIH0pKTtcbiAgICBzZWN0aW9uVmVnLmFkZChUaS5VSS5jcmVhdGVUYWJsZVZpZXdSb3coeyB0aXRsZTogJ0xhc3QgZW50cnknLCBpc1JldXNhYmxlOnRydWUsIGNsYXNzTmFtZTondmVnJywgaGVpZ2h0OjY5LCBvcGFxdWVSb3c6dHJ1ZSwgYmFja2dyb3VuZENvbG9yOidncmVlbicgfSkpO1xuXG5cdFxuXG5cbiAgICB2YXIgdGFibGVWaWV3ID0gVGkuVUkuY3JlYXRlVGFibGVWaWV3KHtcbiAgICAgIGJhY2tncm91bmRDb2xvcjogJ2dyZWVuJyxcbiAgICAgIGRhdGE6IFtzZWN0aW9uRnJ1aXQsIHNlY3Rpb25WZWddLFxuICAgICAgdG9wOjAsXG4gICAgICBib3R0b206MCxcbiAgICAgIG1pblJvd0hlaWdodDo2OSxcbiAgICAgIHJvd0hlaWdodDo2OSxcbiAgICAgIHdpZHRoOlRpLlVJLkZJTEwsXG4gICAgICBoZWlnaHQ6VGkuVUkuRklMTCxcblx0ICBwYWdpbmdFbmFibGVkOmZhbHNlLFxuXHQgIHNuYXBwaW5nRW5hYmxlZDp0cnVlLFxuXHQgIGJ1YmJsZVBhcmVudDp0cnVlLFxuXHQgIHNlY3Rpb25IZWFkZXJGb290ZXJDYWNoaW5nOnRydWUsXG5cdCAgc21vb3RoU2Nyb2xsaW5nOnRydWUsXG4gICAgICBpbWFnZVByZWxvYWRFbmFibGVkOiB0cnVlLCBcdCAgXG5cdCAgZW5hYmxlSGVpZ2h0Q2FjaGluZzogdHJ1ZSwgICAvLyBSb3ctSGVpZ2h0IENhY2hpbmdcbiAgICAgIGVzdGltYXRlZFJvd0hlaWdodDogNjksICAgICAgIC8vIEbDvHIgbGF6eSBsYXlvdXRcbiAgICAgIHByZWZldGNoRW5hYmxlZDogdHJ1ZSAgICAgICAgIC8vIEhpbnRlcmdydW5kLVZvcmJlcmVpdHVuZ1xuICAgIH0pO1xuXG5cdHRhYmxlVmlldy5hZGRFdmVudExpc3RlbmVyKCdyb3d2aXNpYmxlJywgZnVuY3Rpb24oZSkge1xuXHRcdGNvbnNvbGUubG9nKGBSb3cgJHtlLmluZGV4fSB2aXNpYmxlIGF0IG9mZnNldDogJHtlLnRvcE9mZnNldH1gKTtcblx0fSk7XG5cblx0dGFibGVWaWV3LmFkZEV2ZW50TGlzdGVuZXIoJ3Jvd25vdHZpc2libGUnLCBmdW5jdGlvbihlKSB7XG5cdFx0Y29uc29sZS5sb2coYFJvdyAke2UuaW5kZXh9IG5vdCB2aXNpYmxlIGF0IG9mZnNldDogJHtlLnRvcE9mZnNldH1gKTtcblx0fSk7XG5cbiAgICB0YWJsZVZpZXcuYWRkRXZlbnRMaXN0ZW5lcignc2Nyb2xsZW5kJywgZnVuY3Rpb24oZSkge1xuXHRcdC8vdGFibGVWaWV3LmxvZ1BlcmZvcm1hbmNlKCk7XG4gICAgICAgIC8vVGkuQVBJLndhcm4oJ1Njcm9sbGluZyBzdG9wcGVkISBGaW5hbCBYOiAnICsgZS5jb250ZW50T2Zmc2V0LnggKyAnLCBZOiAnICsgZS5jb250ZW50T2Zmc2V0LnkpO1xuICAgIH0pO1xuXG5cblxuXHRcbi8vIFx0dmFyIGxhc3RMb2dUaW1lID0gMDtcbi8vICAgICB0YWJsZVZpZXcuYWRkRXZlbnRMaXN0ZW5lcignc2Nyb2xsJywgZnVuY3Rpb24oZSkge1xuLy8gICAgICAgIHZhciBub3cgPSBEYXRlLm5vdygpO1xuLy8gICAgICAgIGlmIChub3cgLSBsYXN0TG9nVGltZSA+IDUwMCkgeyAvLyBMb2cgbnVyIGFsbGUgMSBTZWt1bmRlXG4vLyAgICAgICAgICAgIHRhYmxlVmlldy5sb2dQZXJmb3JtYW5jZSgpO1xuLy8gICAgICAgICAgICBsYXN0TG9nVGltZSA9IG5vdztcbi8vICAgICAgICB9XG4vLyAgICAgICAgLy9UaS5BUEkud2FybignU2Nyb2xsaW5nISBYOiAnICsgZS5jb250ZW50T2Zmc2V0LnggKyAnLCBZOiAnICsgZS5jb250ZW50T2Zmc2V0LnkpO1xuLy8gICAgfSk7XG5cbiAgICB2YXIgdG9vbGJhckNvbnRhaW5lciA9IFRpLlVJLmNyZWF0ZVZpZXcoe1xuICAgICAgICBiYWNrZ3JvdW5kQ29sb3I6ICcjYWEyZjUzYzMnLFxuICAgICAgICB3aWR0aDpUaS5VSS5GSUxMLFxuICAgICAgICBoZWlnaHQ6VGkuVUkuU0laRSxcbiAgICAgICAgYm90dG9tOjBcbiAgICAgIH0pO1xuICAgXG4gICAgdmFyIHRvb2xiYXJWaWV3ID0gVGkuVUkuY3JlYXRlVmlldyh7XG4gICAgICAgYmFja2dyb3VuZENvbG9yOih0aXRsZSA9PSBcIktlZXBTY3JvbGxpbmdWaWV3QWJvdmVcIikgPyAnYmx1ZScgOiAncmVkJyxcbiAgICAgICBsYXlvdXQ6J2hvcml6b250YWwnLFxuICAgICAgIHdpZHRoOlRpLlVJLkZJTEwsXG4gICAgICAgaGVpZ2h0OlRpLlVJLlNJWkUsXG4gICAgICAgYm90dG9tOjUsXG4gICAgICAgdG9wOjVcbiAgICAgfSk7XG4gICBcbiAgICAgdG9vbGJhckNvbnRhaW5lci5hZGQodG9vbGJhclZpZXcpO1xuXG4gICAgdmFyIHNlbmQgPSBUaS5VSS5jcmVhdGVCdXR0b24oe1xuICAgICAgICB0aXRsZTogJ1NlbmQnLFxuICAgICAgICBzdHlsZTpUaXRhbml1bS5VSS5CVVRUT05fU1RZTEVfRklMTEVELFxuICAgICAgICBiYWNrZ3JvdW5kQ29sb3I6J2JsdWUnLFxuICAgICAgICBiYWNrZ3JvdW5kU2VsZWN0ZWRDb2xvcjonYmx1ZScsXG4gICAgICAgIHRpbnRDb2xvcjonI2ZmZicsXG4gICAgICAgIHRleHRBbGlnbjpUaXRhbml1bS5VSS5URVhUX0FMSUdOTUVOVF9DRU5URVIsXG4gICAgICAgIHZlcnRpY2FsQWxpZ246VGl0YW5pdW0uVUkuVEVYVF9WRVJUSUNBTF9BTElHTk1FTlRfQ0VOVEVSLFxuICAgICAgICBib3JkZXJSYWRpdXM6MTIsXG4gICAgICAgIHdpZHRoOlRpLlVJLkZJTEwsXG4gICAgICAgIHJpZ2h0OjEwLFxuICAgICAgICBib3R0b206KEFORFJPSUQpID8gNSA6IDEwXG4gICAgfSk7XG4gICAgXG4gICAgdmFyIHRleHRBcmVhID0gVGkuVUkuY3JlYXRlVGV4dEFyZWEoe1xuICAgICAgICB0b3A6OCxcbiAgICAgICAgYm90dG9tOjgsXG4gICAgICAgIGxlZnQ6MTUsXG4gICAgICAgIHJpZ2h0OjgsXG4gICAgICAgIGF1dG9jb3JyZWN0OiBmYWxzZSxcbiAgICAgICAgZWRpdGFibGU6dHJ1ZSxcbiAgICAgICAgYm9yZGVyV2lkdGg6IDIsXG4gICAgICAgIGJvcmRlckNvbG9yOiAnI2FhYScsXG4gICAgICAgIGJvcmRlclJhZGl1czogMTYsXG4gICAgICAgIHNjcm9sbGFibGU6dHJ1ZSxcbiAgICAgICAgLy8gbWF4TGluZXM6NSxcbiAgICAgICAgY29sb3I6ICcjMDAwJyxcbiAgICAgICAgYmFja2dyb3VuZENvbG9yOiAnI2ZmZicsXG4gICAgICAgIGZvbnQ6IHtmb250U2l6ZToxNiwgZm9udFdlaWdodDonbm9ybWFsJ30sXG4gICAgICAgIHRleHRBbGlnbjogVGl0YW5pdW0uVUkuVEVYVF9BTElHTk1FTlRfTEVGVCxcbiAgICAgICAgdmVydGljYWxBbGlnbjogVGl0YW5pdW0uVUkuVEVYVF9WRVJUSUNBTF9BTElHTk1FTlRfQ0VOVEVSLFxuICAgICAgICB2YWx1ZTogJycsXG4gICAgICAgIHdpZHRoOiAnNzAlJyxcbiAgICAgICAgcGFkZGluZzp7bGVmdDo0LHJpZ2h0OjQsdG9wOjEwLGJvdHRvbToxMH0sXG4gICAgICAgIGhlaWdodCA6IFRpLlVJLlNJWkUsXG4gICAgICAgIHN1cHByZXNzUmV0dXJuOmZhbHNlXG4gICAgICB9KTtcbiAgICAgICBcbiAgICAgIHRvb2xiYXJWaWV3LmFkZCh0ZXh0QXJlYSk7XG4gICAgICB0b29sYmFyVmlldy5hZGQoc2VuZCk7XG4gICAgICAgIFxuICAgIGlmIChBTkRST0lEKSB7XG4gICAgICAgIHZhciBpbnRlcmFjdGl2ZUtleWJvYXJkVmlldyA9IGtleWJvYXJkQ29udHJvbE1vZHVsZS5jcmVhdGVWaWV3KHtcbiAgICAgICAgICAgIHNob3dLZXlib2FyZE9uU2Nyb2xsVXA6dHJ1ZSwgLy8gc2hvdyBrZXlib2FyZCAod2hlbiBoaWRkZW4pIG9uIHNjcm9sbGluZyB1cFxuICAgICAgICAgICAgYXV0b0FkanVzdEJvdHRvbVBhZGRpbmc6dHJ1ZSwgLy8gc2Nyb2xsaW5nVmlldyB3aWxsIHN0YXkgYXQgdGhlIHNpemUgeW91IHNldCwgYnV0IHRoZSBzY3JvbGxJbnNldEJvdHRvbSB3aWxsIGF1dG9tYXRpY2x5IGFkanVzdCB0byB0aGUgdG9vbGJhciBoZWlnaHQgKGV4OiBibHVyVmlld1Rvb2xiYXIsIHlvdSBjYW4gc2VlIHRoZSBzY3JvbGxpbmdWaWV3IGNvbnRlbnQgdGhyb3VnaCB0aGUgYmx1cnJlZCB0b29sYmFyKVxuICAgICAgICAgICAgYXV0b1Njcm9sbFRvQm90dG9tOnRydWUsIC8vIHNjcm9sbGluZyB0byBib3R0b20gb24gdG9vbGJhciBzaXplIGNoYW5nZVxuICAgICAgICAgICAgYXV0b1NpemVBbmRLZWVwU2Nyb2xsaW5nVmlld0Fib3ZlVG9vbGJhcjoodGl0bGUgPT0gXCJLZWVwU2Nyb2xsaW5nVmlld0Fib3ZlXCIpID8gdHJ1ZSA6IGZhbHNlLCAvLyBzY3JvbGxpbmdWaWV3IHdpbGwgYmUgYWx3YXlzIG9uIHRvcCBvZiB0aGUgdG9vbGJhclZpZXcgLSB0aGUgc2Nyb2xsaW5nVmlldyByZXNpemVzIGF1dG9tYXRpY2x5IHJlc3BlY3RpbmcgdGhlIHNjcm9sbGluZ1ZpZXcgYm90dG9tIHZhbHVlIChpZiBzZXQpIHdoZW4gXCJ0cnVlXCIgLT4gXCJhdXRvQWRqdXN0Qm90dG9tUGFkZGluZz10cnVlXCIgaGFzIG5vIGVmZmVjdFxuICAgICAgICAgICAgc2Nyb2xsaW5nVmlldzp0YWJsZVZpZXcsIC8vIHdoYXRldmVyIGxpc3RWaWV3LCB0YWJsZVZpZXcsIHNjcm9sbFZpZXdcbiAgICAgICAgICAgIHRvb2xiYXJWaWV3OnRvb2xiYXJDb250YWluZXIsIC8vIGhhcyB0byBiZSBhIFRpLlVJLlZpZXchISFcbiAgICAgICAgICAgIGJhY2tncm91bmRDb2xvcjonI2ZlZmVmZScsXG4gICAgICAgICAgICB0b3A6MCxcbiAgICAgICAgICAgIGJvdHRvbTowXG4gICAgICAgIH0pOyBcbiAgICAgICAgd2luLmFkZChpbnRlcmFjdGl2ZUtleWJvYXJkVmlldyk7XG4gICAgfVxuICAgIGVsc2Uge1xuXG4gICAgICAgIHZhciBpbnRlcmFjdGl2ZUtleWJvYXJkVmlldyA9IGtleWJvYXJkQ29udHJvbE1vZHVsZS5jcmVhdGVWaWV3KHtcbiAgICAgICAgICAgIHBhcmVudFdpbmRvdzp3aW4sIC8vIHJlcXVpcmVkIC0+IHRoZSB3aW5kb3cgdGhlIGludGVyYWN0aXZlS2V5Ym9hcmRWaWV3IGlzIHBhcnQgb2ZcbiAgICAgICAgICAgIGF1dG9BZGp1c3RCb3R0b21QYWRkaW5nOih0aXRsZSA9PSBcIktlZXBTY3JvbGxpbmdWaWV3QWJvdmVcIikgPyBmYWxzZSA6IHRydWUsXG4gICAgICAgICAgICBpZ25vcmVFeHRlbmRTYWZlQXJlYTpmYWxzZSwgLy8gb25seSB1c2VkIHdoZW5lIHRoZSBwYXJlbnRXaW5kb3cgaGFzIFwiZXh0ZW5kU2FmZUFyZWE6dHJ1ZVwiIEFORCBwYXJlbnRXaW5kb3cgaXMgYSBzdGFuZGFsb25lIHdpbmRvdyAobm90IGNvbnRhaW5lZCBpbiBOYXZpZ2F0aW9uV2luZG93IGFuZC9vciBUYWdHcm91cCkgLT4gdGhlIG1vZHVsZSBkb2VzIGF1dG9kZXRlY3QgdGhhdCFcbiAgICAgICAgICAgIGF1dG9TY3JvbGxUb0JvdHRvbToodGl0bGUgPT0gXCJLZWVwU2Nyb2xsaW5nVmlld0Fib3ZlXCIpID8gZmFsc2UgOiB0cnVlLCAvLyBzY3JvbGxpbmcgdG8gYm90dG9tIG9uIHRvb2xiYXIgc2l6ZSBjaGFuZ2UgLyBvciB3aGVuIGZvY3VzIG9mIFwidGV4dGZpZWxkXCJcbiAgICAgICAgICAgIGF1dG9TaXplQW5kS2VlcFNjcm9sbGluZ1ZpZXdBYm92ZVRvb2xiYXI6KHRpdGxlID09IFwiS2VlcFNjcm9sbGluZ1ZpZXdBYm92ZVwiKSA/IHRydWUgOiBmYWxzZSwgLy8gc2Nyb2xsaW5nVmlldyB3aWxsIGJlIGFsd2F5cyBvbiB0b3Agb2YgdGhlIHRvb2xiYXJWaWV3IC0gdGhlIHNjcm9sbGluZ1ZpZXcgcmVzaXplcyBhdXRvbWF0aWNseSByZXNwZWN0aW5nIHRoZSBzY3JvbGxpbmdWaWV3IGJvdHRvbSB2YWx1ZSAoaWYgc2V0KSB3aGVuIFwidHJ1ZVwiIC0+IFwiYXV0b0FkanVzdEJvdHRvbVBhZGRpbmc9dHJ1ZVwiIGhhcyBubyBlZmZlY3QgaW4gdGhhdCBjYXNlXG4gICAgICAgICAgICBzaG93S2V5Ym9hcmRPblNjcm9sbFVwOnRydWUsIC8vIHNob3cga2V5Ym9hcmQgd2hlbiBvdmVyc2Nyb2xsaW5nIGF0IGJvdHRvbSAoaU9TICsgQW5kcm9pZClcbiAgICAgICAgICAgIHNjcm9sbGluZ1ZpZXc6dGFibGVWaWV3LCAvLyB3aGF0ZXZlciBsaXN0VmlldywgdGFibGVWaWV3LCBzY3JvbGxWaWV3XG4gICAgICAgICAgICB0b29sYmFyVmlldzp0b29sYmFyQ29udGFpbmVyLCAvLyBoYXMgdG8gYmUgYSBUaS5VSS5WaWV3ISEhXG4gICAgICAgICAgICB0ZXh0ZmllbGQ6dGV4dEFyZWEsIC8vIHJlcXVpcmVkIC0+IHB1dCBoZXJlIHlvdXIgVGkuVUkuVGV4dEFyZWEgb3IgVGl0YW5pdW0uVUkuVGV4dEZpZWxkXG4gICAgICAgICAgICBrZXlib2FyZFBhbm5pbmc6dHJ1ZSwgLy8gd2hlbiB0cnVlIHRoZSBpbnRlcmFjdGl2ZSBtb2RlIGlzIG9uXG4gICAgICAgICAgICBiYWNrZ3JvdW5kQ29sb3I6JyNmZWZlZmUnLFxuICAgICAgICAgICAgdG9wOjAsXG4gICAgICAgICAgICBib3R0b206MFxuICAgICAgICB9KTtcbiAgICAgICAgd2luLmFkZChpbnRlcmFjdGl2ZUtleWJvYXJkVmlldyk7XG4gICAgfVxuXG5cblxuXG4gICAgdmFyIHRhYiA9IFRpLlVJLmNyZWF0ZVRhYih7XG4gICAgICAgIHRpdGxlOiB0aXRsZSxcbiAgICAgICAgaWNvbjogaWNvbixcbiAgICAgICAgd2luZG93OiB3aW5cbiAgICB9KTtcblxuICAgIHJldHVybiB0YWI7XG59XG5cblxuXG5cblxuXG4vLyAvLyB2YXIgTmFwcERyYXdlck1vZHVsZSA9IHJlcXVpcmUoJ2RrLm5hcHAuZHJhd2VyJyk7XG5cbi8vIC8vIGZ1bmN0aW9uIGNyZWF0ZUFQSUV4YW1wbGVXaW5kb3coKSB7XG4vLyAvLyAgIHZhciB3aW4gPSBUaS5VSS5jcmVhdGVXaW5kb3coKTtcblxuLy8gLy8gICB2YXIgZGF0YSA9IFt7XG4vLyAvLyAgICAgICB0aXRsZTogJ1RvZ2dsZSBzaGFkb3cnXG4vLyAvLyAgICAgfSxcbi8vIC8vICAgICB7XG4vLyAvLyAgICAgICB0aXRsZTogJ1RvZ2dsZSBzdHJldGNoIGRyYXdlcidcbi8vIC8vICAgICB9LFxuLy8gLy8gICAgIHtcbi8vIC8vICAgICAgIHRpdGxlOiAnQ2xvc2UgRHJhd2VyJ1xuLy8gLy8gICAgIH0sXG4vLyAvLyAgICAge1xuLy8gLy8gICAgICAgdGl0bGU6ICdOZXcgV2luZG93J1xuLy8gLy8gICAgIH0sXG4vLyAvLyAgICAge1xuLy8gLy8gICAgICAgdGl0bGU6ICdEZWZhdWx0IFdpbmRvdydcbi8vIC8vICAgICB9LFxuLy8gLy8gICAgIHtcbi8vIC8vICAgICAgIHRpdGxlOiAnUmVtb3ZlIHJpZ2h0IERyYXdlcidcbi8vIC8vICAgICB9XG4vLyAvLyAgIF07XG5cbi8vIC8vICAgdmFyIHRhYmxlVmlldyA9IFRpLlVJLmNyZWF0ZVRhYmxlVmlldyh7XG4vLyAvLyAgICAgZGF0YTogZGF0YVxuLy8gLy8gICB9KTtcblxuLy8gLy8gICB0YWJsZVZpZXcuYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCBmdW5jdGlvbihlKSB7XG4vLyAvLyAgICAgVGkuQVBJLmluZm8oJ2lzTGVmdFdpbmRvd09wZW46ICcgKyBkcmF3ZXIuaXNMZWZ0V2luZG93T3BlbigpKTtcbi8vIC8vICAgICBzd2l0Y2ggKGUuaW5kZXgpIHtcbi8vIC8vICAgICAgIGNhc2UgMDpcbi8vIC8vICAgICAgICAgZHJhd2VyLnNob3dTaGFkb3cgPSAhZHJhd2VyLnNob3dTaGFkb3c7XG4vLyAvLyAgICAgICAgIGJyZWFrO1xuLy8gLy8gICAgICAgY2FzZSAxOlxuLy8gLy8gICAgICAgICBkcmF3ZXIuc2hvdWxkU3RyZXRjaERyYXdlciA9ICFkcmF3ZXIuc2hvdWxkU3RyZXRjaERyYXdlcjtcbi8vIC8vICAgICAgICAgYnJlYWs7XG4vLyAvLyAgICAgICBjYXNlIDI6XG4vLyAvLyAgICAgICAgIGRyYXdlci50b2dnbGVMZWZ0V2luZG93KCk7XG4vLyAvLyAgICAgICAgIGJyZWFrO1xuLy8gLy8gICAgICAgY2FzZSAzOlxuLy8gLy8gICAgICAgICB2YXIgbmV3V2luID0gb3Blbk5ld05hdldpbmRvdygpO1xuLy8gLy8gICAgICAgICBkcmF3ZXIuY2VudGVyV2luZG93ID0gbmV3V2luO1xuLy8gLy8gICAgICAgICBkcmF3ZXIudG9nZ2xlTGVmdFdpbmRvdygpO1xuLy8gLy8gICAgICAgICBicmVhaztcbi8vIC8vICAgICAgIGNhc2UgNDpcbi8vIC8vICAgICAgICAgZHJhd2VyLmNlbnRlcldpbmRvdyA9IGNyZWF0ZUNlbnRlck5hdldpbmRvdygpO1xuLy8gLy8gICAgICAgICBkcmF3ZXIudG9nZ2xlTGVmdFdpbmRvdygpO1xuLy8gLy8gICAgICAgICBicmVhaztcbi8vIC8vICAgICAgIGNhc2UgNTpcbi8vIC8vICAgICAgICAgZHJhd2VyLnJpZ2h0V2luZG93ID0gZmFsc2U7XG4vLyAvLyAgICAgICAgIGRyYXdlci50b2dnbGVMZWZ0V2luZG93KCk7XG4vLyAvLyAgICAgICAgIGJyZWFrO1xuLy8gLy8gICAgIH1cbi8vIC8vICAgfSk7XG5cbi8vIC8vICAgd2luLmFkZCh0YWJsZVZpZXcpO1xuLy8gLy8gICByZXR1cm4gd2luO1xuLy8gLy8gfVxuXG5cbi8vIC8vIGZ1bmN0aW9uIG9wZW5OZXdOYXZXaW5kb3coKSB7XG4vLyAvLyAgIHZhciBsZWZ0QnRuID0gVGkuVUkuY3JlYXRlQnV0dG9uKHtcbi8vIC8vICAgICB0aXRsZTogJ0xlZnQnXG4vLyAvLyAgIH0pO1xuLy8gLy8gICBsZWZ0QnRuLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgZnVuY3Rpb24oKSB7XG4vLyAvLyAgICAgZHJhd2VyLnRvZ2dsZUxlZnRXaW5kb3coKTtcbi8vIC8vICAgfSk7XG4vLyAvLyAgIHZhciB3aW4gPSBUaS5VSS5jcmVhdGVXaW5kb3coe1xuLy8gLy8gICAgIGJhY2tncm91bmRDb2xvcjogJyMyMjInLFxuLy8gLy8gICAgIHRyYW5zbHVjZW50OiB0cnVlLFxuLy8gLy8gICAgIGV4dGVuZEVkZ2VzOiBbVGkuVUkuRVhURU5EX0VER0VfVE9QXSxcbi8vIC8vICAgICB0aXRsZTogJ05ldyBOYXYgV2luZG93Jyxcbi8vIC8vICAgICBiYXJDb2xvcjogJyNGRkEnLFxuLy8gLy8gICAgIHRpbnRDb2xvcjogJ3llbGxvdycsXG4vLyAvLyAgICAgbGVmdE5hdkJ1dHRvbjogbGVmdEJ0blxuLy8gLy8gICB9KTtcblxuLy8gLy8gICB2YXIgc2Nyb2xsVmlldyA9IFRpLlVJLmNyZWF0ZVNjcm9sbFZpZXcoe1xuLy8gLy8gICAgIGxheW91dDogJ3ZlcnRpY2FsJyxcbi8vIC8vICAgICBsZWZ0OiAwLFxuLy8gLy8gICAgIHJpZ2h0OiAwLFxuLy8gLy8gICAgIGNvbnRlbnRIZWlnaHQ6ICdhdXRvJyxcbi8vIC8vICAgICBjb250ZW50V2lkdGg6ICcxMDAlJyxcbi8vIC8vICAgICBzaG93VmVydGljYWxTY3JvbGxJbmRpY2F0b3I6IHRydWUsXG4vLyAvLyAgICAgc2hvd0hvcml6b250YWxTY3JvbGxJbmRpY2F0b3I6IGZhbHNlXG4vLyAvLyAgIH0pO1xuXG4vLyAvLyAgIGZvciAodmFyIGkgPSAwOyBpIDwgMjA7IGkrKykge1xuLy8gLy8gICAgIHZhciBsYWJlbCA9IFRpLlVJLmNyZWF0ZUxhYmVsKHtcbi8vIC8vICAgICAgIHRvcDogMzAsXG4vLyAvLyAgICAgICB0ZXh0OiAnaU9TNyBpcyB0aGUgbmV3IGJsYWNrJyxcbi8vIC8vICAgICAgIGNvbG9yOiAnI0ZGRicsXG4vLyAvLyAgICAgICBmb250OiB7XG4vLyAvLyAgICAgICAgIGZvbnRTaXplOiAyMFxuLy8gLy8gICAgICAgfVxuLy8gLy8gICAgIH0pO1xuLy8gLy8gICAgIHNjcm9sbFZpZXcuYWRkKGxhYmVsKTtcbi8vIC8vICAgfVxuLy8gLy8gICB3aW4uYWRkKHNjcm9sbFZpZXcpO1xuLy8gLy8gICB2YXIgbmF2Q29udHJvbGxlciA9IFRpLlVJLmNyZWF0ZU5hdmlnYXRpb25XaW5kb3coe1xuLy8gLy8gICAgIHdpbmRvdzogd2luXG4vLyAvLyAgIH0pO1xuLy8gLy8gICByZXR1cm4gbmF2Q29udHJvbGxlcjtcbi8vIC8vIH1cblxuXG4vLyAvLyBmdW5jdGlvbiBjcmVhdGVDZW50ZXJOYXZXaW5kb3coKSB7XG4vLyAvLyAgIHZhciBsZWZ0QnRuID0gVGkuVUkuY3JlYXRlQnV0dG9uKHtcbi8vIC8vICAgICB0aXRsZTogJ0xlZnQnXG4vLyAvLyAgIH0pO1xuLy8gLy8gICBsZWZ0QnRuLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgZnVuY3Rpb24oKSB7XG4vLyAvLyAgICAgZHJhd2VyLnRvZ2dsZUxlZnRXaW5kb3coKTtcbi8vIC8vICAgfSk7XG4vLyAvLyAgIHZhciByaWdodEJ0biA9IFRpLlVJLmNyZWF0ZUJ1dHRvbih7XG4vLyAvLyAgICAgdGl0bGU6ICdSaWdodCdcbi8vIC8vICAgfSk7XG4vLyAvLyAgIHJpZ2h0QnRuLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgZnVuY3Rpb24oKSB7XG4vLyAvLyAgICAgZHJhd2VyLnRvZ2dsZVJpZ2h0V2luZG93KCk7XG4vLyAvLyAgIH0pO1xuXG4vLyAvLyAgIHZhciB3aW4gPSBUaS5VSS5jcmVhdGVXaW5kb3coe1xuLy8gLy8gICAgIGJhY2tncm91bmRDb2xvcjogJyNlZWUnLFxuLy8gLy8gICAgIHRyYW5zbHVjZW50OiBmYWxzZSxcbi8vIC8vICAgICB0aXRsZTogJ05hcHBEcmF3ZXInLFxuLy8gLy8gICAgIGJhckNvbG9yOiAnI2NhMjEyNycsXG4vLyAvLyAgICAgdGludENvbG9yOiAnI2NhMjEyNycsXG4vLyAvLyAgICAgbmF2VGludENvbG9yOiAnI2ZmZicsXG4vLyAvLyAgICAgdGl0bGVBdHRyaWJ1dGVzOiB7XG4vLyAvLyAgICAgICBjb2xvcjogJyNmZmYnXG4vLyAvLyAgICAgfSxcbi8vIC8vICAgICBsZWZ0TmF2QnV0dG9uOiBsZWZ0QnRuLFxuLy8gLy8gICAgIHJpZ2h0TmF2QnV0dG9uOiByaWdodEJ0blxuLy8gLy8gICB9KTtcblxuLy8gLy8gICB2YXIgY2xvc2VHZXN0dXJlTW9kZSA9IDE7XG4vLyAvLyAgIHZhciBjbG9zZUdlc3R1cmVNb2RlQnRuID0gVGkuVUkuY3JlYXRlQnV0dG9uKHtcbi8vIC8vICAgICB0aXRsZTogJ2Nsb3NlR2VzdHVyZU1vZGU6IEFMTCcsXG4vLyAvLyAgICAgd2lkdGg6IDMwMCxcbi8vIC8vICAgICB0b3A6IDgwXG4vLyAvLyAgIH0pO1xuXG4vLyAvLyAgIGNsb3NlR2VzdHVyZU1vZGVCdG4uYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCBmdW5jdGlvbihlKSB7XG4vLyAvLyAgICAgaWYgKGNsb3NlR2VzdHVyZU1vZGUgPT0gMikge1xuLy8gLy8gICAgICAgY2xvc2VHZXN0dXJlTW9kZSA9IDA7XG4vLyAvLyAgICAgfSBlbHNlIHtcbi8vIC8vICAgICAgIGNsb3NlR2VzdHVyZU1vZGUrKztcbi8vIC8vICAgICB9XG4vLyAvLyAgICAgc3dpdGNoIChjbG9zZUdlc3R1cmVNb2RlKSB7XG4vLyAvLyAgICAgICBjYXNlIDA6XG4vLyAvLyAgICAgICAgIGRyYXdlci5jbG9zZURyYXdlckdlc3R1cmVNb2RlID0gTmFwcERyYXdlck1vZHVsZS5DTE9TRV9NT0RFX1RBUF9DRU5URVJXSU5ET1c7XG4vLyAvLyAgICAgICAgIGNsb3NlR2VzdHVyZU1vZGVCdG4udGl0bGUgPSAnY2xvc2VHZXN0dXJlOiBUYXAgQ2VudGVyJztcbi8vIC8vICAgICAgICAgYnJlYWs7XG4vLyAvLyAgICAgICBjYXNlIDE6XG4vLyAvLyAgICAgICAgIGRyYXdlci5jbG9zZURyYXdlckdlc3R1cmVNb2RlID0gTmFwcERyYXdlck1vZHVsZS5DTE9TRV9NT0RFX0FMTDtcbi8vIC8vICAgICAgICAgY2xvc2VHZXN0dXJlTW9kZUJ0bi50aXRsZSA9ICdjbG9zZUdlc3R1cmU6IEFMTCc7XG4vLyAvLyAgICAgICAgIGJyZWFrO1xuLy8gLy8gICAgICAgY2FzZSAyOlxuLy8gLy8gICAgICAgICBkcmF3ZXIuY2xvc2VEcmF3ZXJHZXN0dXJlTW9kZSA9IE5hcHBEcmF3ZXJNb2R1bGUuQ0xPU0VfTU9ERV9QQU5OSU5HX05BVkJBUjtcbi8vIC8vICAgICAgICAgY2xvc2VHZXN0dXJlTW9kZUJ0bi50aXRsZSA9ICdjbG9zZUdlc3R1cmU6IE5BVkJBUic7XG4vLyAvLyAgICAgICAgIGJyZWFrO1xuLy8gLy8gICAgIH1cbi8vIC8vICAgfSk7XG4vLyAvLyAgIHdpbi5hZGQoY2xvc2VHZXN0dXJlTW9kZUJ0bik7XG5cblxuLy8gLy8gICB2YXIgYW5pbWF0aW9uTW9kZSA9IDA7XG4vLyAvLyAgIHZhciBhbmltYXRpb25Nb2RlQnRuID0gVGkuVUkuY3JlYXRlQnV0dG9uKHtcbi8vIC8vICAgICB0aXRsZTogJ2FuaW1hdGlvbjogTk9ORScsXG4vLyAvLyAgICAgd2lkdGg6IDMwMCxcbi8vIC8vICAgICB0b3A6IDE0MFxuLy8gLy8gICB9KTtcbi8vIC8vICAgYW5pbWF0aW9uTW9kZUJ0bi5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsIGZ1bmN0aW9uKGUpIHtcbi8vIC8vICAgICBpZiAoYW5pbWF0aW9uTW9kZSA9PSA1KSB7XG4vLyAvLyAgICAgICBhbmltYXRpb25Nb2RlID0gMDtcbi8vIC8vICAgICB9IGVsc2Uge1xuLy8gLy8gICAgICAgYW5pbWF0aW9uTW9kZSsrO1xuLy8gLy8gICAgIH1cbi8vIC8vICAgICBzd2l0Y2ggKGFuaW1hdGlvbk1vZGUpIHtcbi8vIC8vICAgICAgIGNhc2UgMDpcbi8vIC8vICAgICAgICAgZHJhd2VyLmFuaW1hdGlvbk1vZGUgPSBOYXBwRHJhd2VyTW9kdWxlLkFOSU1BVElPTl9OT05FO1xuLy8gLy8gICAgICAgICBhbmltYXRpb25Nb2RlQnRuLnRpdGxlID0gJ2FuaW1hdGlvbjogTm9uZSc7XG4vLyAvLyAgICAgICAgIGJyZWFrO1xuLy8gLy8gICAgICAgY2FzZSAxOlxuLy8gLy8gICAgICAgICBkcmF3ZXIuYW5pbWF0aW9uTW9kZSA9IE5hcHBEcmF3ZXJNb2R1bGUuQU5JTUFUSU9OX1BBUkFMTEFYX0ZBQ1RPUl8zO1xuLy8gLy8gICAgICAgICBhbmltYXRpb25Nb2RlQnRuLnRpdGxlID0gJ2FuaW1hdGlvbjogUGFyYWxsYXggZmFjdG9yIDMnO1xuLy8gLy8gICAgICAgICBicmVhaztcbi8vIC8vICAgICAgIGNhc2UgMjpcbi8vIC8vICAgICAgICAgZHJhd2VyLmFuaW1hdGlvbk1vZGUgPSBOYXBwRHJhd2VyTW9kdWxlLkFOSU1BVElPTl9QQVJBTExBWF9GQUNUT1JfNztcbi8vIC8vICAgICAgICAgYW5pbWF0aW9uTW9kZUJ0bi50aXRsZSA9ICdhbmltYXRpb246IFBhcmFsbGF4IGZhY3RvciA3Jztcbi8vIC8vICAgICAgICAgYnJlYWs7XG4vLyAvLyAgICAgICBjYXNlIDM6XG4vLyAvLyAgICAgICAgIGRyYXdlci5hbmltYXRpb25Nb2RlID0gTmFwcERyYXdlck1vZHVsZS5BTklNQVRJT05fRkFERTtcbi8vIC8vICAgICAgICAgYW5pbWF0aW9uTW9kZUJ0bi50aXRsZSA9ICdhbmltYXRpb246IEZhZGUnO1xuLy8gLy8gICAgICAgICBicmVhaztcbi8vIC8vICAgICAgIGNhc2UgNDpcbi8vIC8vICAgICAgICAgZHJhd2VyLmFuaW1hdGlvbk1vZGUgPSBOYXBwRHJhd2VyTW9kdWxlLkFOSU1BVElPTl9TTElERTtcbi8vIC8vICAgICAgICAgYW5pbWF0aW9uTW9kZUJ0bi50aXRsZSA9ICdhbmltYXRpb246IFNsaWRlJztcbi8vIC8vICAgICAgICAgYnJlYWs7XG4vLyAvLyAgICAgICBjYXNlIDU6XG4vLyAvLyAgICAgICAgIGRyYXdlci5hbmltYXRpb25Nb2RlID0gTmFwcERyYXdlck1vZHVsZS5BTklNQVRJT05fU0xJREVfU0NBTEU7XG4vLyAvLyAgICAgICAgIGFuaW1hdGlvbk1vZGVCdG4udGl0bGUgPSAnYW5pbWF0aW9uOiBTbGlkZSAmIFNjYWxlJztcbi8vIC8vICAgICAgICAgYnJlYWs7XG4vLyAvLyAgICAgfVxuLy8gLy8gICB9KTtcbi8vIC8vICAgd2luLmFkZChhbmltYXRpb25Nb2RlQnRuKTtcblxuXG4vLyAvLyAgIHZhciBzbGlkZXIgPSBUaS5VSS5jcmVhdGVTbGlkZXIoe1xuLy8gLy8gICAgIHRvcDogMjgwLFxuLy8gLy8gICAgIG1pbjogNTAsXG4vLyAvLyAgICAgbWF4OiAyODAsXG4vLyAvLyAgICAgd2lkdGg6IDI4MCxcbi8vIC8vICAgICB2YWx1ZTogMjAwXG4vLyAvLyAgIH0pO1xuLy8gLy8gICB2YXIgbGFiZWwgPSBUaS5VSS5jcmVhdGVMYWJlbCh7XG4vLyAvLyAgICAgdGV4dDogJ0xlZnQgRHJhd2VyIFdpZHRoOiAnICsgc2xpZGVyLnZhbHVlLFxuLy8gLy8gICAgIHRvcDogMjUwXG4vLyAvLyAgIH0pO1xuLy8gLy8gICBzbGlkZXIuYWRkRXZlbnRMaXN0ZW5lcigndG91Y2hlbmQnLCBmdW5jdGlvbihlKSB7XG4vLyAvLyAgICAgdmFyIHZhbHVlID0gTWF0aC5yb3VuZChlLnZhbHVlKTtcbi8vIC8vICAgICBsYWJlbC50ZXh0ID0gJ0xlZnQgRHJhd2VyIFdpZHRoOiAnICsgdmFsdWU7XG4vLyAvLyAgICAgZHJhd2VyLmxlZnREcmF3ZXJXaWR0aCA9IHZhbHVlO1xuLy8gLy8gICB9KTtcbi8vIC8vICAgd2luLmFkZChsYWJlbCk7XG4vLyAvLyAgIHdpbi5hZGQoc2xpZGVyKTtcblxuLy8gLy8gICB2YXIgbmF2Q29udHJvbGxlciA9IFRpLlVJLmNyZWF0ZU5hdmlnYXRpb25XaW5kb3coe1xuLy8gLy8gICAgIHdpbmRvdzogd2luXG4vLyAvLyAgIH0pO1xuLy8gLy8gICByZXR1cm4gbmF2Q29udHJvbGxlcjtcbi8vIC8vIH1cblxuLy8gLy8gdmFyIG1haW5XaW5kb3cgPSBjcmVhdGVDZW50ZXJOYXZXaW5kb3coKTtcblxuLy8gLy8gdmFyIGRyYXdlciA9IE5hcHBEcmF3ZXJNb2R1bGUuY3JlYXRlRHJhd2VyKHtcbi8vIC8vICAgbGVmdFdpbmRvdzogY3JlYXRlQVBJRXhhbXBsZVdpbmRvdygpLFxuLy8gLy8gICBjZW50ZXJXaW5kb3c6IG1haW5XaW5kb3csXG4vLyAvLyAgIHJpZ2h0V2luZG93OiBUaS5VSS5jcmVhdGVXaW5kb3coe1xuLy8gLy8gICAgIGJhY2tncm91bmRDb2xvcjogJyNGRkYnXG4vLyAvLyAgIH0pLFxuLy8gLy8gICBjbG9zZURyYXdlckdlc3R1cmVNb2RlOiBOYXBwRHJhd2VyTW9kdWxlLkNMT1NFX01PREVfQUxMLFxuLy8gLy8gICBvcGVuRHJhd2VyR2VzdHVyZU1vZGU6IE5hcHBEcmF3ZXJNb2R1bGUuT1BFTl9NT0RFX0FMTCxcbi8vIC8vICAgc2hvd1NoYWRvdzogZmFsc2UsIC8vbm8gc2hhZG93IGluIGlPUzdcbi8vIC8vICAgbGVmdERyYXdlcldpZHRoOiAyMDAsXG4vLyAvLyAgIHJpZ2h0RHJhd2VyV2lkdGg6IDEyMCxcbi8vIC8vICAgc3RhdHVzQmFyU3R5bGU6IE5hcHBEcmF3ZXJNb2R1bGUuU1RBVFVTQkFSX1dISVRFLCAvLyByZW1lbWJlciB0byBzZXQgVUlWaWV3Q29udHJvbGxlckJhc2VkU3RhdHVzQmFyQXBwZWFyYW5jZSB0byBmYWxzZSBpbiB0aWFwcC54bWxcbi8vIC8vICAgb3JpZW50YXRpb25Nb2RlczogW1RpLlVJLlBPUlRSQUlULCBUaS5VSS5VUFNJREVfUE9SVFJBSVRdXG4vLyAvLyB9KTtcblxuLy8gLy8gZHJhd2VyLmFkZEV2ZW50TGlzdGVuZXIoJ2NlbnRlcldpbmRvd0RpZEZvY3VzJywgZnVuY3Rpb24oKSB7XG4vLyAvLyAgIFRpLkFQSS5pbmZvKCdDZW50ZXIgZGlkIGZvY3VzIScpO1xuLy8gLy8gfSk7XG5cbi8vIC8vIGRyYXdlci5hZGRFdmVudExpc3RlbmVyKCdjZW50ZXJXaW5kb3dEaWRCbHVyJywgZnVuY3Rpb24oKSB7XG4vLyAvLyAgIFRpLkFQSS5pbmZvKCdDZW50ZXIgZGlkIGJsdXIhJyk7XG4vLyAvLyB9KTtcblxuLy8gLy8gZHJhd2VyLmFkZEV2ZW50TGlzdGVuZXIoJ3dpbmRvd0RpZE9wZW4nLCBmdW5jdGlvbihlKSB7XG4vLyAvLyAgIFRpLkFQSS5pbmZvKCd3aW5kb3dEaWRPcGVuJyk7XG4vLyAvLyB9KTtcblxuLy8gLy8gZHJhd2VyLmFkZEV2ZW50TGlzdGVuZXIoJ3dpbmRvd0RpZENsb3NlJywgZnVuY3Rpb24oZSkge1xuLy8gLy8gICBUaS5BUEkuaW5mbygnd2luZG93RGlkQ2xvc2UnKTtcbi8vIC8vIH0pO1xuXG4vLyAvLyBkcmF3ZXIub3BlbigpO1xuXG4vLyAvLyBUaS5BUEkuaW5mbygnaXNBbnlXaW5kb3dPcGVuOiAnICsgZHJhd2VyLmlzQW55V2luZG93T3BlbigpKTtcblxuXG5cblxuXG5cbi8vIC8qXG4vLyBUaVNESzogMTMuMS4wLkdBXG4vLyBSZXF1aXJlZCBNb2R1bGU6XG4vLyBMaW5rOiBodHRwczovL2dpdGh1Yi5jb20vbWJlbmRlcjc0L05hcHBEcmF3ZXJcbi8vIEluY2x1ZGU6IDxtb2R1bGUgcGxhdGZvcm09XCJpcGhvbmVcIiB2ZXJzaW9uPVwiMi4yLjdcIj5kay5uYXBwLmRyYXdlcjwvbW9kdWxlPlxuLy8gKi9cblxuLy8gLy8gY29uc3QgTmFwcERyYXdlck1vZHVsZSA9IHJlcXVpcmUoJ2RrLm5hcHAuZHJhd2VyJyk7XG5cbi8vIC8vIGNvbnN0IGRyYXdlciA9IE5hcHBEcmF3ZXJNb2R1bGUuY3JlYXRlRHJhd2VyKHtcbi8vIC8vIFx0d2lkdGg6IFRpLlBsYXRmb3JtLmRpc3BsYXlDYXBzLnBsYXRmb3JtV2lkdGgsXG4vLyAvLyBcdG9yaWVudGF0aW9uTW9kZXM6IFtUaS5VSS5QT1JUUkFJVF0sXG4vLyAvLyBcdGJhY2tncm91bmRDb2xvcjogJyMwMDAwMDAnLFxuLy8gLy8gXHRhbmltYXRpb25Nb2RlOiBOYXBwRHJhd2VyTW9kdWxlLkFOSU1BVElPTl9TTElERSxcbi8vIC8vIFx0Y2xvc2VEcmF3ZXJHZXN0dXJlTW9kZTogTmFwcERyYXdlck1vZHVsZS5DTE9TRV9NT0RFX0FMTCxcbi8vIC8vIFx0b3BlbkRyYXdlckdlc3R1cmVNb2RlOiBOYXBwRHJhd2VyTW9kdWxlLk9QRU5fTU9ERV9BTEwsXG4vLyAvLyBcdHNob3VsZFN0cmV0Y2hEcmF3ZXI6IGZhbHNlLFxuLy8gLy8gXHRzaG93U2hhZG93OiBmYWxzZSxcbi8vIC8vIFx0YW5pbWF0aW9uVmVsb2NpdHk6IDEzMDAsXG4vLyAvLyBcdGxlZnREcmF3ZXJXaWR0aDogVGkuUGxhdGZvcm0uZGlzcGxheUNhcHMucGxhdGZvcm1XaWR0aCxcbi8vIC8vIFx0cmlnaHREcmF3ZXJXaWR0aDogVGkuUGxhdGZvcm0uZGlzcGxheUNhcHMucGxhdGZvcm1XaWR0aFxuLy8gLy8gfSk7XG5cbi8vIC8vIC8vIENyZWF0ZSBEcmF3ZXJzXG4vLyAvLyBjb25zdCBsZWZ0RHJhd2VyV2luZG93ID0gVGkuVUkuY3JlYXRlV2luZG93KHtcbi8vIC8vIFx0dGl0bGU6ICdMZWZ0IERyYXdlcicsXG4vLyAvLyBcdGJhY2tncm91bmRDb2xvcjogJyNGRkZGRkYnXG4vLyAvLyB9KTtcblxuLy8gLy8gY29uc3QgbGVmdERyYXdlciA9IFRpLlVJLmNyZWF0ZU5hdmlnYXRpb25XaW5kb3coe1xuLy8gLy8gXHR3aW5kb3c6IGxlZnREcmF3ZXJXaW5kb3dcbi8vIC8vIH0pO1xuXG4vLyAvLyBjb25zdCByaWdodERyYXdlcldpbmRvdyA9IFRpLlVJLmNyZWF0ZVdpbmRvdyh7XG4vLyAvLyBcdHRpdGxlOiAnUmlnaHQgRHJhd2VyJyxcbi8vIC8vIFx0YmFja2dyb3VuZENvbG9yOiAnI0ZGRkZGRidcbi8vIC8vIH0pO1xuXG4vLyAvLyBjb25zdCByaWdodERyYXdlciA9IFRpLlVJLmNyZWF0ZU5hdmlnYXRpb25XaW5kb3coe1xuLy8gLy8gXHR3aW5kb3c6IHJpZ2h0RHJhd2VyV2luZG93XG4vLyAvLyB9KTtcblxuLy8gLy8gY29uc3Qgd2luMSA9IFRpLlVJLmNyZWF0ZVdpbmRvdyh7XG4vLyAvLyBcdGJhY2tncm91bmRDb2xvcjogJ2JsdWUnLFxuLy8gLy8gXHR0aXRsZTogJ0JsdWUnXG4vLyAvLyB9KTtcbi8vIC8vIHdpbjEuYWRkKFRpLlVJLmNyZWF0ZUxhYmVsKHsgdGV4dDogJ0kgYW0gYSBibHVlIHdpbmRvdy4nIH0pKTtcblxuLy8gLy8gY29uc3Qgd2luMiA9IFRpLlVJLmNyZWF0ZVdpbmRvdyh7XG4vLyAvLyBcdGJhY2tncm91bmRDb2xvcjogJ3JlZCcsXG4vLyAvLyBcdHRpdGxlOiAnUmVkJ1xuLy8gLy8gfSk7XG4vLyAvLyB3aW4yLmFkZChUaS5VSS5jcmVhdGVMYWJlbCh7IHRleHQ6ICdJIGFtIGEgcmVkIHdpbmRvdy4nIH0pKTtcblxuLy8gLy8gY29uc3QgdGFiMSA9IFRpLlVJLmNyZWF0ZVRhYih7XG4vLyAvLyBcdFx0d2luZG93OiB3aW4xLFxuLy8gLy8gXHRcdHRpdGxlOiAnQmx1ZSdcbi8vIC8vIFx0fSksXG4vLyAvLyBcdHRhYjIgPSBUaS5VSS5jcmVhdGVUYWIoe1xuLy8gLy8gXHRcdHdpbmRvdzogd2luMixcbi8vIC8vIFx0XHR0aXRsZTogJ1JlZCdcbi8vIC8vIFx0fSksXG4vLyAvLyBcdHRhYkdyb3VwID0gVGkuVUkuY3JlYXRlVGFiR3JvdXAoe1xuLy8gLy8gXHRcdHRhYnM6IFt0YWIxLCB0YWIyXVxuLy8gLy8gXHR9KTtcblxuLy8gLy8gLy8gT3BlbiBvdXIgVGFiR3JvdXAgKGNyYXNoZXMgd2l0aCBvciB3aXRob3V0IG9wZW5pbmcpXG4vLyAvLyAvLyB0YWJHcm91cC5vcGVuKCk7XG5cbi8vIC8vIC8vIC0tLSBTZXQgZHJhd2VyIFdpbmRvd3MgLS0tXG4vLyAvLyBkcmF3ZXIubGVmdFdpbmRvdyA9IGxlZnREcmF3ZXI7XG4vLyAvLyBkcmF3ZXIucmlnaHRXaW5kb3cgPSByaWdodERyYXdlcjtcbi8vIC8vIGRyYXdlci5jZW50ZXJXaW5kb3cgPSB0YWJHcm91cDtcblxuLy8gLy8gLy8gT3BlbiB0aGUgZHJhd2VyXG4vLyAvLyBkcmF3ZXIub3BlbigpO1xuXG4vLyAvLyAvLyBTaG91bGQgY3Jhc2ggd2l0aCB0aGUgZXJyb3IgcmVwb3J0ZWQgYXQgdGhlIGxpbmsgYmVsb3c6XG4vLyAvLyAvLyBodHRwczovL2dpdGh1Yi5jb20vdGlkZXYvdGl0YW5pdW0tc2RrL3B1bGwvMTQzOTcjaXNzdWVjb21tZW50LTM5NTY0Mjg5ODJcblxuXG5cblxuXG4vLyAvKlxuLy8gVGlTREs6IDEzLjIuMC5HQSAod2l0aCBQUiBwYXRjaCAjMTQ0NTApXG4vLyBSZXF1aXJlZCBNb2R1bGU6XG4vLyBMaW5rOiBodHRwczovL2dpdGh1Yi5jb20vbWJlbmRlcjc0L05hcHBEcmF3ZXJcbi8vIEluY2x1ZGU6IDxtb2R1bGUgcGxhdGZvcm09XCJpcGhvbmVcIiB2ZXJzaW9uPVwiMy4xLjFcIj5kay5uYXBwLmRyYXdlcjwvbW9kdWxlPlxuLy8gKi9cblxuLy8gLy8gY29uc3QgTmFwcERyYXdlck1vZHVsZSA9IHJlcXVpcmUoJ2RrLm5hcHAuZHJhd2VyJyk7XG4vLyAvLyB2YXIgZHJhd2VyID0gbnVsbDtcblxuLy8gLy8gZnVuY3Rpb24gY3JlYXRlRHJhd2VyKCkge1xuLy8gLy8gXHRkcmF3ZXIgPSBOYXBwRHJhd2VyTW9kdWxlLmNyZWF0ZURyYXdlcih7XG4vLyAvLyBcdFx0d2lkdGg6IFRpLlBsYXRmb3JtLmRpc3BsYXlDYXBzLnBsYXRmb3JtV2lkdGgsXG4vLyAvLyBcdFx0b3JpZW50YXRpb25Nb2RlczogW1RpLlVJLlBPUlRSQUlUXSxcbi8vIC8vIFx0XHRiYWNrZ3JvdW5kQ29sb3I6ICdyZWQnLFxuLy8gLy8gXHRcdGFuaW1hdGlvbk1vZGU6IE5hcHBEcmF3ZXJNb2R1bGUuQU5JTUFUSU9OX1NMSURFLFxuLy8gLy8gXHRcdGNsb3NlRHJhd2VyR2VzdHVyZU1vZGU6IE5hcHBEcmF3ZXJNb2R1bGUuQ0xPU0VfTU9ERV9BTEwsXG4vLyAvLyBcdFx0b3BlbkRyYXdlckdlc3R1cmVNb2RlOiBOYXBwRHJhd2VyTW9kdWxlLk9QRU5fTU9ERV9BTEwsXG4vLyAvLyBcdFx0c2hvdWxkU3RyZXRjaERyYXdlcjogZmFsc2UsXG4vLyAvLyBcdFx0c2hvd1NoYWRvdzogZmFsc2UsXG4vLyAvLyBcdFx0YW5pbWF0aW9uVmVsb2NpdHk6IDEzMDAsXG4vLyAvLyBcdFx0bGVmdERyYXdlcldpZHRoOiBUaS5QbGF0Zm9ybS5kaXNwbGF5Q2Fwcy5wbGF0Zm9ybVdpZHRoLFxuLy8gLy8gXHRcdHJpZ2h0RHJhd2VyV2lkdGg6IFRpLlBsYXRmb3JtLmRpc3BsYXlDYXBzLnBsYXRmb3JtV2lkdGhcbi8vIC8vIFx0fSk7XG5cbi8vIC8vIFx0Ly8gQ3JlYXRlIERyYXdlcnNcbi8vIC8vIFx0Y29uc3QgbGVmdERyYXdlcldpbmRvdyA9IFRpLlVJLmNyZWF0ZVdpbmRvdyh7IHRpdGxlOiAnTGVmdCBEcmF3ZXInLCBiYWNrZ3JvdW5kQ29sb3I6ICd5ZWxsb3cnLCBleHRlbmRTYWZlQXJlYTogdHJ1ZSwgZXh0ZW5kRWRnZXM6IFsxLCA0XSB9KTtcbi8vIC8vIFx0Y29uc3QgbGVmdERyYXdlciA9IFRpLlVJLmNyZWF0ZU5hdmlnYXRpb25XaW5kb3coeyB3aW5kb3c6IGxlZnREcmF3ZXJXaW5kb3cgfSk7XG5cbi8vIC8vIFx0Y29uc3QgcmlnaHREcmF3ZXJXaW5kb3cgPSBUaS5VSS5jcmVhdGVXaW5kb3coeyB0aXRsZTogJ1JpZ2h0IERyYXdlcicsIGJhY2tncm91bmRDb2xvcjogJ2dyZWVuJywgZXh0ZW5kU2FmZUFyZWE6IHRydWUsIGV4dGVuZEVkZ2VzOiBbMSwgNF0gfSk7XG4vLyAvLyBcdGNvbnN0IHJpZ2h0RHJhd2VyID0gVGkuVUkuY3JlYXRlTmF2aWdhdGlvbldpbmRvdyh7IHdpbmRvdzogcmlnaHREcmF3ZXJXaW5kb3cgfSk7XG5cbi8vIC8vIFx0Y29uc3Qgd2luMSA9IFRpLlVJLmNyZWF0ZVdpbmRvdyh7IGJhY2tncm91bmRDb2xvcjogJ2JsdWUnLCB0aXRsZTogJ1RhYiAxJywgZXh0ZW5kU2FmZUFyZWE6IHRydWUsIGV4dGVuZEVkZ2VzOiBbMSwgNF0sIHRpdGxlQXR0cmlidXRlczogeyBjb2xvcjogJ3doaXRlJywgZm9udDogeyBmb250U2l6ZTogMTcsIGZvbnRXZWlnaHQ6ICdib2xkJyB9IH0gfSk7XG4vLyAvLyBcdGNvbnN0IHdpbjFDb250YWluZXIgPSBUaS5VSS5jcmVhdGVWaWV3KHsgbGF5b3V0OiAndmVydGljYWwnLCBoZWlnaHQ6IFRpLlVJLlNJWkUsIHdpZHRoOiBUaS5VSS5GSUxMIH0pO1xuLy8gLy8gXHR3aW4xLmFkZCh3aW4xQ29udGFpbmVyKTtcblxuLy8gLy8gXHRjb25zdCB3aW4xTGFiZWwgPSBUaS5VSS5jcmVhdGVMYWJlbCh7IHRleHQ6ICfirIXvuI8gc3dpcGUgdG8gb3BlbiBkcmF3ZXJzIOKeoe+4jycsIGNvbG9yOiAnd2hpdGUnLCBmb250OiB7IGZvbnRTaXplOiAyMCwgZm9udFdlaWdodDogJ2JvbGQnIH0sIHRvcDogMCB9KTtcbi8vIC8vIFx0d2luMUNvbnRhaW5lci5hZGQod2luMUxhYmVsKTtcblxuLy8gLy8gXHQvLyBDcmVhdGUgRHJhd2VyIENsb3NlIEJ1dHRvblxuLy8gLy8gXHRjb25zdCBjbG9zZUJ1dHRvbiA9IFRpLlVJLmNyZWF0ZUJ1dHRvbih7IHRpdGxlOiAnQ2xvc2UgRHJhd2VyJywgYmFja2dyb3VuZENvbG9yOiAnd2hpdGUnLCB0aW50Q29sb3I6ICdibGFjaycsIGZvbnQ6IHsgZm9udFNpemU6IDIwLCBmb250V2VpZ2h0OiAnYm9sZCcgfSwgd2lkdGg6ICc1MCUnLCBoZWlnaHQ6IDQ0LCBib3JkZXJSYWRpdXM6IDEwLCB0b3A6IDU2IH0pO1xuLy8gLy8gXHRjbG9zZUJ1dHRvbi5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsICgpID0+IHtcbi8vIC8vIFx0XHRjbG9zZURyYXdlcigpO1xuLy8gLy8gXHR9KTtcbi8vIC8vIFx0d2luMUNvbnRhaW5lci5hZGQoY2xvc2VCdXR0b24pO1xuXG4vLyAvLyBcdGNvbnN0IHdpbjIgPSBUaS5VSS5jcmVhdGVXaW5kb3coeyBiYWNrZ3JvdW5kQ29sb3I6ICd5ZWxsb3cnLCB0aXRsZTogJ1RhYiAyJywgZXh0ZW5kU2FmZUFyZWE6IHRydWUsIGV4dGVuZEVkZ2VzOiBbMSwgNF0sIHRpdGxlQXR0cmlidXRlczogeyBmb250OiB7IGZvbnRTaXplOiAxNywgZm9udFdlaWdodDogJ2JvbGQnIH0gfSB9KTtcbi8vIC8vIFx0d2luMi5hZGQoVGkuVUkuY3JlYXRlTGFiZWwoeyB0ZXh0OiAnSSBhbSBqdXN0IGEgbG9uZWx5IHllbGxvdyB3aW5kb3cuJywgZm9udDogeyBmb250U2l6ZTogMTMsIGZvbnRXZWlnaHQ6ICdib2xkJyB9IH0pKTtcblxuLy8gLy8gXHRjb25zdCB0YWIxID0gVGkuVUkuY3JlYXRlVGFiKHsgd2luZG93OiB3aW4xLCB0aXRsZTogJ0JsdWUnIH0pLFxuLy8gLy8gXHRcdHRhYjIgPSBUaS5VSS5jcmVhdGVUYWIoeyB3aW5kb3c6IHdpbjIsIHRpdGxlOiAnWWVsbG93JyB9KSxcbi8vIC8vIFx0XHR0YWJHcm91cCA9IFRpLlVJLmNyZWF0ZVRhYkdyb3VwKHsgdGFiczogW3RhYjEsIHRhYjJdIH0pO1xuXG4vLyAvLyBcdC8vIE9wZW4gb3VyIFRhYkdyb3VwICh3b3JrcyB3aXRoIG9yIHdpdGhvdXQgY2FsbGluZyBvcGVuKVxuLy8gLy8gXHQvLyB0YWJHcm91cC5vcGVuKCk7XG5cbi8vIC8vIFx0Ly8gU2V0IGRyYXdlciBXaW5kb3dzXG4vLyAvLyBcdGRyYXdlci5sZWZ0V2luZG93ID0gbGVmdERyYXdlcjtcbi8vIC8vIFx0ZHJhd2VyLnJpZ2h0V2luZG93ID0gcmlnaHREcmF3ZXI7XG4vLyAvLyBcdGRyYXdlci5jZW50ZXJXaW5kb3cgPSB0YWJHcm91cDtcblxuLy8gLy8gXHQvLyBPcGVuIHRoZSBkcmF3ZXJcbi8vIC8vIFx0ZHJhd2VyLm9wZW4oKTtcbi8vIC8vIH1cblxuLy8gLy8gZnVuY3Rpb24gY2xvc2VEcmF3ZXIoKSB7XG4vLyAvLyBcdGRyYXdlci5jbG9zZSgpO1xuLy8gLy8gXHRkcmF3ZXIgPSBudWxsO1xuXG4vLyAvLyBcdC8vIE9wZW4gTGFuZGluZyBTY3JlZW5cbi8vIC8vIFx0Y3JlYXRlTGFuZGluZ1NjcmVlbigpO1xuLy8gLy8gfVxuXG4vLyAvLyBmdW5jdGlvbiBjcmVhdGVMYW5kaW5nU2NyZWVuKCkge1xuLy8gLy8gXHRjb25zdCB3aW4gPSBUaS5VSS5jcmVhdGVXaW5kb3coeyBiYWNrZ3JvdW5kQ29sb3I6ICcjRkZGRkZGJywgZXh0ZW5kU2FmZUFyZWE6IHRydWUsIGV4dGVuZEVkZ2VzOiBbMSwgNF0gfSk7XG5cbi8vIC8vIFx0Ly8gT3BlbiBEcmF3ZXIgQnV0dG9uXG4vLyAvLyBcdGNvbnN0IG9wZW5EcmF3ZXJCdXR0b24gPSBUaS5VSS5jcmVhdGVCdXR0b24oeyB0aXRsZTogJ09wZW4gRHJhd2VyJywgZm9udDogeyBmb250U2l6ZTogMjAsIGZvbnRXZWlnaHQ6ICdib2xkJyB9IH0pO1xuLy8gLy8gXHQvLyBDbGljayBFdmVudCB0byBPcGVuIERyYXdlclxuLy8gLy8gXHRvcGVuRHJhd2VyQnV0dG9uLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgKCkgPT4ge1xuLy8gLy8gXHRcdHdpbi5jbG9zZSgpO1xuLy8gLy8gXHRcdGNyZWF0ZURyYXdlcigpO1xuLy8gLy8gXHR9KTtcbi8vIC8vIFx0d2luLmFkZChvcGVuRHJhd2VyQnV0dG9uKTtcblxuLy8gLy8gXHQvLyBPcGVuIHRoZSBMYW5kaW5nIFNjcmVlbiBXaW5kb3dcbi8vIC8vIFx0d2luLm9wZW4oKTtcbi8vIC8vIH1cblxuLy8gLy8gLy8gT3BlbiBMYW5kaW5nIFNjcmVlblxuLy8gLy8gY3JlYXRlTGFuZGluZ1NjcmVlbigpO1xuIl0sInZlcnNpb24iOjN9
