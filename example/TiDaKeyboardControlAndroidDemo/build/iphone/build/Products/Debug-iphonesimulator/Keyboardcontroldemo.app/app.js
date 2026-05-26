
var ANDROID = Ti.Platform.osname === 'android';
var keyboardControlModule = require('de.marcbender.keyboardcontrol');
var nappDrawerModule = require('dk.napp.drawer');


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
// tabGroup.open();


// ++++++++++++++++++++++++++++++++++++++++++++++++++++
// Code for TabGroup in NavigationWindow
// ++++++++++++++++++++++++++++++++++++++++++++++++++++


/**
 * Open the tabGroup in a navigationWindow
 */
var navigationWindow = Titanium.UI.createNavigationWindow({
  window: tabGroup
});
navigationWindow.open();



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

  var sectionFruit = Ti.UI.createTableViewSection({ headerTitle: 'Fruit' });
  sectionFruit.add(Ti.UI.createTableViewRow({ title: 'Apples' }));
  sectionFruit.add(Ti.UI.createTableViewRow({ title: 'Bananas' }));
  sectionFruit.add(Ti.UI.createTableViewRow({ title: 'Apples' }));
  sectionFruit.add(Ti.UI.createTableViewRow({ title: 'Bananas' }));
  sectionFruit.add(Ti.UI.createTableViewRow({ title: 'Apples' }));
  sectionFruit.add(Ti.UI.createTableViewRow({ title: 'Bananas' }));
  sectionFruit.add(Ti.UI.createTableViewRow({ title: 'Apples' }));
  sectionFruit.add(Ti.UI.createTableViewRow({ title: 'Bananas' }));
  sectionFruit.add(Ti.UI.createTableViewRow({ title: 'Apples' }));
  sectionFruit.add(Ti.UI.createTableViewRow({ title: 'Bananas' }));

  var sectionVeg = Ti.UI.createTableViewSection({ headerTitle: 'Vegetables' });
  sectionVeg.add(Ti.UI.createTableViewRow({ title: 'Carrots' }));
  sectionVeg.add(Ti.UI.createTableViewRow({ title: 'Potatoes' }));
  sectionVeg.add(Ti.UI.createTableViewRow({ title: 'Carrots' }));
  sectionVeg.add(Ti.UI.createTableViewRow({ title: 'Potatoes' }));
  sectionVeg.add(Ti.UI.createTableViewRow({ title: 'Carrots' }));
  sectionVeg.add(Ti.UI.createTableViewRow({ title: 'Potatoes' }));
  sectionVeg.add(Ti.UI.createTableViewRow({ title: 'Carrots' }));
  sectionVeg.add(Ti.UI.createTableViewRow({ title: 'Potatoes' }));
  sectionVeg.add(Ti.UI.createTableViewRow({ title: 'Carrots' }));
  sectionVeg.add(Ti.UI.createTableViewRow({ title: 'Potatoes' }));
  sectionVeg.add(Ti.UI.createTableViewRow({ title: 'Carrots' }));
  sectionVeg.add(Ti.UI.createTableViewRow({ title: 'Last entry' }));

  var tableView = Ti.UI.createTableView({
    backgroundColor: 'green',
    data: [sectionFruit, sectionVeg],
    top: 0,
    bottom: 0,
    minRowHeight: 69,
    rowHeight: 69,
    width: Ti.UI.FILL,
    height: Ti.UI.FILL,
    bubbleParent: true
  });


  tableView.addEventListener('scrollend', function (e) {

    // Ti.API.warn('Scrolling stopped! Final X: ' + e.x + ', Y: ' + e.y);
  });tableView.addEventListener('scroll', function (e) {

    // Ti.API.warn('Scrolling! X: ' + e.x + ', Y: ' + e.y);
  });
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
    borderWidth: 1,
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






// var NappDrawerModule = require('dk.napp.drawer');

// function createAPIExampleWindow() {
//   var win = Ti.UI.createWindow();

//   var data = [{
//       title: 'Toggle shadow'
//     },
//     {
//       title: 'Toggle stretch drawer'
//     },
//     {
//       title: 'Close Drawer'
//     },
//     {
//       title: 'New Window'
//     },
//     {
//       title: 'Default Window'
//     },
//     {
//       title: 'Remove right Drawer'
//     }
//   ];

//   var tableView = Ti.UI.createTableView({
//     data: data
//   });

//   tableView.addEventListener('click', function(e) {
//     Ti.API.info('isLeftWindowOpen: ' + drawer.isLeftWindowOpen());
//     switch (e.index) {
//       case 0:
//         drawer.showShadow = !drawer.showShadow;
//         break;
//       case 1:
//         drawer.shouldStretchDrawer = !drawer.shouldStretchDrawer;
//         break;
//       case 2:
//         drawer.toggleLeftWindow();
//         break;
//       case 3:
//         var newWin = openNewNavWindow();
//         drawer.centerWindow = newWin;
//         drawer.toggleLeftWindow();
//         break;
//       case 4:
//         drawer.centerWindow = createCenterNavWindow();
//         drawer.toggleLeftWindow();
//         break;
//       case 5:
//         drawer.rightWindow = false;
//         drawer.toggleLeftWindow();
//         break;
//     }
//   });

//   win.add(tableView);
//   return win;
// }


// function openNewNavWindow() {
//   var leftBtn = Ti.UI.createButton({
//     title: 'Left'
//   });
//   leftBtn.addEventListener('click', function() {
//     drawer.toggleLeftWindow();
//   });
//   var win = Ti.UI.createWindow({
//     backgroundColor: '#222',
//     translucent: true,
//     extendEdges: [Ti.UI.EXTEND_EDGE_TOP],
//     title: 'New Nav Window',
//     barColor: '#FFA',
//     tintColor: 'yellow',
//     leftNavButton: leftBtn
//   });

//   var scrollView = Ti.UI.createScrollView({
//     layout: 'vertical',
//     left: 0,
//     right: 0,
//     contentHeight: 'auto',
//     contentWidth: '100%',
//     showVerticalScrollIndicator: true,
//     showHorizontalScrollIndicator: false
//   });

//   for (var i = 0; i < 20; i++) {
//     var label = Ti.UI.createLabel({
//       top: 30,
//       text: 'iOS7 is the new black',
//       color: '#FFF',
//       font: {
//         fontSize: 20
//       }
//     });
//     scrollView.add(label);
//   }
//   win.add(scrollView);
//   var navController = Ti.UI.createNavigationWindow({
//     window: win
//   });
//   return navController;
// }


// function createCenterNavWindow() {
//   var leftBtn = Ti.UI.createButton({
//     title: 'Left'
//   });
//   leftBtn.addEventListener('click', function() {
//     drawer.toggleLeftWindow();
//   });
//   var rightBtn = Ti.UI.createButton({
//     title: 'Right'
//   });
//   rightBtn.addEventListener('click', function() {
//     drawer.toggleRightWindow();
//   });

//   var win = Ti.UI.createWindow({
//     backgroundColor: '#eee',
//     translucent: false,
//     title: 'NappDrawer',
//     barColor: '#ca2127',
//     tintColor: '#ca2127',
//     navTintColor: '#fff',
//     titleAttributes: {
//       color: '#fff'
//     },
//     leftNavButton: leftBtn,
//     rightNavButton: rightBtn
//   });

//   var closeGestureMode = 1;
//   var closeGestureModeBtn = Ti.UI.createButton({
//     title: 'closeGestureMode: ALL',
//     width: 300,
//     top: 80
//   });

//   closeGestureModeBtn.addEventListener('click', function(e) {
//     if (closeGestureMode == 2) {
//       closeGestureMode = 0;
//     } else {
//       closeGestureMode++;
//     }
//     switch (closeGestureMode) {
//       case 0:
//         drawer.closeDrawerGestureMode = NappDrawerModule.CLOSE_MODE_TAP_CENTERWINDOW;
//         closeGestureModeBtn.title = 'closeGesture: Tap Center';
//         break;
//       case 1:
//         drawer.closeDrawerGestureMode = NappDrawerModule.CLOSE_MODE_ALL;
//         closeGestureModeBtn.title = 'closeGesture: ALL';
//         break;
//       case 2:
//         drawer.closeDrawerGestureMode = NappDrawerModule.CLOSE_MODE_PANNING_NAVBAR;
//         closeGestureModeBtn.title = 'closeGesture: NAVBAR';
//         break;
//     }
//   });
//   win.add(closeGestureModeBtn);


//   var animationMode = 0;
//   var animationModeBtn = Ti.UI.createButton({
//     title: 'animation: NONE',
//     width: 300,
//     top: 140
//   });
//   animationModeBtn.addEventListener('click', function(e) {
//     if (animationMode == 5) {
//       animationMode = 0;
//     } else {
//       animationMode++;
//     }
//     switch (animationMode) {
//       case 0:
//         drawer.animationMode = NappDrawerModule.ANIMATION_NONE;
//         animationModeBtn.title = 'animation: None';
//         break;
//       case 1:
//         drawer.animationMode = NappDrawerModule.ANIMATION_PARALLAX_FACTOR_3;
//         animationModeBtn.title = 'animation: Parallax factor 3';
//         break;
//       case 2:
//         drawer.animationMode = NappDrawerModule.ANIMATION_PARALLAX_FACTOR_7;
//         animationModeBtn.title = 'animation: Parallax factor 7';
//         break;
//       case 3:
//         drawer.animationMode = NappDrawerModule.ANIMATION_FADE;
//         animationModeBtn.title = 'animation: Fade';
//         break;
//       case 4:
//         drawer.animationMode = NappDrawerModule.ANIMATION_SLIDE;
//         animationModeBtn.title = 'animation: Slide';
//         break;
//       case 5:
//         drawer.animationMode = NappDrawerModule.ANIMATION_SLIDE_SCALE;
//         animationModeBtn.title = 'animation: Slide & Scale';
//         break;
//     }
//   });
//   win.add(animationModeBtn);


//   var slider = Ti.UI.createSlider({
//     top: 280,
//     min: 50,
//     max: 280,
//     width: 280,
//     value: 200
//   });
//   var label = Ti.UI.createLabel({
//     text: 'Left Drawer Width: ' + slider.value,
//     top: 250
//   });
//   slider.addEventListener('touchend', function(e) {
//     var value = Math.round(e.value);
//     label.text = 'Left Drawer Width: ' + value;
//     drawer.leftDrawerWidth = value;
//   });
//   win.add(label);
//   win.add(slider);

//   var navController = Ti.UI.createNavigationWindow({
//     window: win
//   });
//   return navController;
// }

// var mainWindow = createCenterNavWindow();

// var drawer = NappDrawerModule.createDrawer({
//   leftWindow: createAPIExampleWindow(),
//   centerWindow: mainWindow,
//   rightWindow: Ti.UI.createWindow({
//     backgroundColor: '#FFF'
//   }),
//   closeDrawerGestureMode: NappDrawerModule.CLOSE_MODE_ALL,
//   openDrawerGestureMode: NappDrawerModule.OPEN_MODE_ALL,
//   showShadow: false, //no shadow in iOS7
//   leftDrawerWidth: 200,
//   rightDrawerWidth: 120,
//   statusBarStyle: NappDrawerModule.STATUSBAR_WHITE, // remember to set UIViewControllerBasedStatusBarAppearance to false in tiapp.xml
//   orientationModes: [Ti.UI.PORTRAIT, Ti.UI.UPSIDE_PORTRAIT]
// });

// drawer.addEventListener('centerWindowDidFocus', function() {
//   Ti.API.info('Center did focus!');
// });

// drawer.addEventListener('centerWindowDidBlur', function() {
//   Ti.API.info('Center did blur!');
// });

// drawer.addEventListener('windowDidOpen', function(e) {
//   Ti.API.info('windowDidOpen');
// });

// drawer.addEventListener('windowDidClose', function(e) {
//   Ti.API.info('windowDidClose');
// });

// drawer.open();

// Ti.API.info('isAnyWindowOpen: ' + drawer.isAnyWindowOpen());






/*
TiSDK: 13.1.0.GA
Required Module:
Link: https://github.com/mbender74/NappDrawer
Include: <module platform="iphone" version="2.2.7">dk.napp.drawer</module>
*/

// const NappDrawerModule = require('dk.napp.drawer');

// const drawer = NappDrawerModule.createDrawer({
// 	width: Ti.Platform.displayCaps.platformWidth,
// 	orientationModes: [Ti.UI.PORTRAIT],
// 	backgroundColor: '#000000',
// 	animationMode: NappDrawerModule.ANIMATION_SLIDE,
// 	closeDrawerGestureMode: NappDrawerModule.CLOSE_MODE_ALL,
// 	openDrawerGestureMode: NappDrawerModule.OPEN_MODE_ALL,
// 	shouldStretchDrawer: false,
// 	showShadow: false,
// 	animationVelocity: 1300,
// 	leftDrawerWidth: Ti.Platform.displayCaps.platformWidth,
// 	rightDrawerWidth: Ti.Platform.displayCaps.platformWidth
// });

// // Create Drawers
// const leftDrawerWindow = Ti.UI.createWindow({
// 	title: 'Left Drawer',
// 	backgroundColor: '#FFFFFF'
// });

// const leftDrawer = Ti.UI.createNavigationWindow({
// 	window: leftDrawerWindow
// });

// const rightDrawerWindow = Ti.UI.createWindow({
// 	title: 'Right Drawer',
// 	backgroundColor: '#FFFFFF'
// });

// const rightDrawer = Ti.UI.createNavigationWindow({
// 	window: rightDrawerWindow
// });

// const win1 = Ti.UI.createWindow({
// 	backgroundColor: 'blue',
// 	title: 'Blue'
// });
// win1.add(Ti.UI.createLabel({ text: 'I am a blue window.' }));

// const win2 = Ti.UI.createWindow({
// 	backgroundColor: 'red',
// 	title: 'Red'
// });
// win2.add(Ti.UI.createLabel({ text: 'I am a red window.' }));

// const tab1 = Ti.UI.createTab({
// 		window: win1,
// 		title: 'Blue'
// 	}),
// 	tab2 = Ti.UI.createTab({
// 		window: win2,
// 		title: 'Red'
// 	}),
// 	tabGroup = Ti.UI.createTabGroup({
// 		tabs: [tab1, tab2]
// 	});

// // Open our TabGroup (crashes with or without opening)
// // tabGroup.open();

// // --- Set drawer Windows ---
// drawer.leftWindow = leftDrawer;
// drawer.rightWindow = rightDrawer;
// drawer.centerWindow = tabGroup;

// // Open the drawer
// drawer.open();

// // Should crash with the error reported at the link below:
// // https://github.com/tidev/titanium-sdk/pull/14397#issuecomment-3956428982





/*
TiSDK: 13.2.0.GA (with PR patch #14450)
Required Module:
Link: https://github.com/mbender74/NappDrawer
Include: <module platform="iphone" version="3.1.1">dk.napp.drawer</module>
*/

// const NappDrawerModule = require('dk.napp.drawer');
// var drawer = null;

// function createDrawer() {
// 	drawer = NappDrawerModule.createDrawer({
// 		width: Ti.Platform.displayCaps.platformWidth,
// 		orientationModes: [Ti.UI.PORTRAIT],
// 		backgroundColor: 'red',
// 		animationMode: NappDrawerModule.ANIMATION_SLIDE,
// 		closeDrawerGestureMode: NappDrawerModule.CLOSE_MODE_ALL,
// 		openDrawerGestureMode: NappDrawerModule.OPEN_MODE_ALL,
// 		shouldStretchDrawer: false,
// 		showShadow: false,
// 		animationVelocity: 1300,
// 		leftDrawerWidth: Ti.Platform.displayCaps.platformWidth,
// 		rightDrawerWidth: Ti.Platform.displayCaps.platformWidth
// 	});

// 	// Create Drawers
// 	const leftDrawerWindow = Ti.UI.createWindow({ title: 'Left Drawer', backgroundColor: 'yellow', extendSafeArea: true, extendEdges: [1, 4] });
// 	const leftDrawer = Ti.UI.createNavigationWindow({ window: leftDrawerWindow });

// 	const rightDrawerWindow = Ti.UI.createWindow({ title: 'Right Drawer', backgroundColor: 'green', extendSafeArea: true, extendEdges: [1, 4] });
// 	const rightDrawer = Ti.UI.createNavigationWindow({ window: rightDrawerWindow });

// 	const win1 = Ti.UI.createWindow({ backgroundColor: 'blue', title: 'Tab 1', extendSafeArea: true, extendEdges: [1, 4], titleAttributes: { color: 'white', font: { fontSize: 17, fontWeight: 'bold' } } });
// 	const win1Container = Ti.UI.createView({ layout: 'vertical', height: Ti.UI.SIZE, width: Ti.UI.FILL });
// 	win1.add(win1Container);

// 	const win1Label = Ti.UI.createLabel({ text: '⬅️ swipe to open drawers ➡️', color: 'white', font: { fontSize: 20, fontWeight: 'bold' }, top: 0 });
// 	win1Container.add(win1Label);

// 	// Create Drawer Close Button
// 	const closeButton = Ti.UI.createButton({ title: 'Close Drawer', backgroundColor: 'white', tintColor: 'black', font: { fontSize: 20, fontWeight: 'bold' }, width: '50%', height: 44, borderRadius: 10, top: 56 });
// 	closeButton.addEventListener('click', () => {
// 		closeDrawer();
// 	});
// 	win1Container.add(closeButton);

// 	const win2 = Ti.UI.createWindow({ backgroundColor: 'yellow', title: 'Tab 2', extendSafeArea: true, extendEdges: [1, 4], titleAttributes: { font: { fontSize: 17, fontWeight: 'bold' } } });
// 	win2.add(Ti.UI.createLabel({ text: 'I am just a lonely yellow window.', font: { fontSize: 13, fontWeight: 'bold' } }));

// 	const tab1 = Ti.UI.createTab({ window: win1, title: 'Blue' }),
// 		tab2 = Ti.UI.createTab({ window: win2, title: 'Yellow' }),
// 		tabGroup = Ti.UI.createTabGroup({ tabs: [tab1, tab2] });

// 	// Open our TabGroup (works with or without calling open)
// 	// tabGroup.open();

// 	// Set drawer Windows
// 	drawer.leftWindow = leftDrawer;
// 	drawer.rightWindow = rightDrawer;
// 	drawer.centerWindow = tabGroup;

// 	// Open the drawer
// 	drawer.open();
// }

// function closeDrawer() {
// 	drawer.close();
// 	drawer = null;

// 	// Open Landing Screen
// 	createLandingScreen();
// }

// function createLandingScreen() {
// 	const win = Ti.UI.createWindow({ backgroundColor: '#FFFFFF', extendSafeArea: true, extendEdges: [1, 4] });

// 	// Open Drawer Button
// 	const openDrawerButton = Ti.UI.createButton({ title: 'Open Drawer', font: { fontSize: 20, fontWeight: 'bold' } });
// 	// Click Event to Open Drawer
// 	openDrawerButton.addEventListener('click', () => {
// 		win.close();
// 		createDrawer();
// 	});
// 	win.add(openDrawerButton);

// 	// Open the Landing Screen Window
// 	win.open();
// }

// // Open Landing Screen
// createLandingScreen();
//# sourceMappingURL=data:application/json;charset=utf-8;base64,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QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7QUFHQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7OztBQUdBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7QUFHQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTs7QUFFQTs7Ozs7OztBQU9BO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7Ozs7OztBQU1BO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBIiwibmFtZXMiOlsiQU5EUk9JRCIsIlRpIiwiUGxhdGZvcm0iLCJvc25hbWUiLCJrZXlib2FyZENvbnRyb2xNb2R1bGUiLCJyZXF1aXJlIiwibmFwcERyYXdlck1vZHVsZSIsInRhYkdyb3VwIiwiVUkiLCJjcmVhdGVUYWJHcm91cCIsImFkZFRhYiIsImNyZWF0ZVRhYiIsIm5hdmlnYXRpb25XaW5kb3ciLCJUaXRhbml1bSIsImNyZWF0ZU5hdmlnYXRpb25XaW5kb3ciLCJ3aW5kb3ciLCJvcGVuIiwidGl0bGUiLCJtZXNzYWdlIiwiaWNvbiIsIndpbiIsImNyZWF0ZVdpbmRvdyIsImJhckNvbG9yIiwiYmFja2dyb3VuZENvbG9yIiwiZXh0ZW5kU2FmZUFyZWEiLCJ0YWJCYXJIaWRkZW4iLCJzdXN0YWluZWRQZXJmb3JtYW5jZU1vZGUiLCJzZWN0aW9uRnJ1aXQiLCJjcmVhdGVUYWJsZVZpZXdTZWN0aW9uIiwiaGVhZGVyVGl0bGUiLCJhZGQiLCJjcmVhdGVUYWJsZVZpZXdSb3ciLCJzZWN0aW9uVmVnIiwidGFibGVWaWV3IiwiY3JlYXRlVGFibGVWaWV3IiwiZGF0YSIsInRvcCIsImJvdHRvbSIsIm1pblJvd0hlaWdodCIsInJvd0hlaWdodCIsIndpZHRoIiwiRklMTCIsImhlaWdodCIsImJ1YmJsZVBhcmVudCIsImFkZEV2ZW50TGlzdGVuZXIiLCJlIiwidG9vbGJhckNvbnRhaW5lciIsImNyZWF0ZVZpZXciLCJTSVpFIiwidG9vbGJhclZpZXciLCJsYXlvdXQiLCJzZW5kIiwiY3JlYXRlQnV0dG9uIiwic3R5bGUiLCJCVVRUT05fU1RZTEVfRklMTEVEIiwiYmFja2dyb3VuZFNlbGVjdGVkQ29sb3IiLCJ0aW50Q29sb3IiLCJ0ZXh0QWxpZ24iLCJURVhUX0FMSUdOTUVOVF9DRU5URVIiLCJ2ZXJ0aWNhbEFsaWduIiwiVEVYVF9WRVJUSUNBTF9BTElHTk1FTlRfQ0VOVEVSIiwiYm9yZGVyUmFkaXVzIiwicmlnaHQiLCJ0ZXh0QXJlYSIsImNyZWF0ZVRleHRBcmVhIiwibGVmdCIsImF1dG9jb3JyZWN0IiwiZWRpdGFibGUiLCJib3JkZXJXaWR0aCIsImJvcmRlckNvbG9yIiwic2Nyb2xsYWJsZSIsImNvbG9yIiwiZm9udCIsImZvbnRTaXplIiwiZm9udFdlaWdodCIsIlRFWFRfQUxJR05NRU5UX0xFRlQiLCJ2YWx1ZSIsInBhZGRpbmciLCJzdXBwcmVzc1JldHVybiIsImludGVyYWN0aXZlS2V5Ym9hcmRWaWV3Iiwic2hvd0tleWJvYXJkT25TY3JvbGxVcCIsImF1dG9BZGp1c3RCb3R0b21QYWRkaW5nIiwiYXV0b1Njcm9sbFRvQm90dG9tIiwiYXV0b1NpemVBbmRLZWVwU2Nyb2xsaW5nVmlld0Fib3ZlVG9vbGJhciIsInNjcm9sbGluZ1ZpZXciLCJwYXJlbnRXaW5kb3ciLCJpZ25vcmVFeHRlbmRTYWZlQXJlYSIsInRleHRmaWVsZCIsImtleWJvYXJkUGFubmluZyIsInRhYiJdLCJzb3VyY2VSb290IjoiL1VzZXJzL21hcmNiZW5kZXIvVGl0YW5pdW0tTW9kdWxlcy9UaURhS2V5Ym9hcmRDb250cm9sL2V4YW1wbGUvVGlEYUtleWJvYXJkQ29udHJvbEFuZHJvaWREZW1vL1Jlc291cmNlcyIsInNvdXJjZXMiOlsiYXBwLmpzIl0sInNvdXJjZXNDb250ZW50IjpbIlxudmFyIEFORFJPSUQgPSAoVGkuUGxhdGZvcm0ub3NuYW1lID09PSAnYW5kcm9pZCcpO1xudmFyIGtleWJvYXJkQ29udHJvbE1vZHVsZSA9IHJlcXVpcmUoJ2RlLm1hcmNiZW5kZXIua2V5Ym9hcmRjb250cm9sJyk7XG52YXIgbmFwcERyYXdlck1vZHVsZSA9IHJlcXVpcmUoJ2RrLm5hcHAuZHJhd2VyJyk7XG5cblxuLy8gLy8gKysrKysrKysrKysrKysrKysrKysrKysrKysrKysrKysrKysrKysrKysrKysrKysrKysrK1xuLy8gLy8gQ29kZSBmb3Igc3RhbmRhbG9uZSB3aW5kb3cgYmVsb3dcbi8vIC8vICsrKysrKysrKysrKysrKysrKysrKysrKysrKysrKysrKysrKysrKysrKysrKysrKysrKytcblxuLy8gdmFyIHRpdGxlQ29udHJvbCA9IFRpLlVJLmNyZWF0ZVZpZXcoe1xuLy8gICAgIGhlaWdodDpUaS5VSS5TSVpFLFxuLy8gICAgIHdpZHRoOlRpLlVJLkZJTEwsXG4vLyAgICAgYmFja2dyb3VuZENvbG9yIDogJ3JlZCdcbi8vIH0pO1xuLy8gdGl0bGVDb250cm9sLmFkZChUaS5VSS5jcmVhdGVMYWJlbCh7XG4vLyAgICAgICAgIGxlZnQ6OTYsXG4vLyAgICAgICAgIGJvdHRvbTo1LFxuLy8gICAgICAgICBiYWNrZ3JvdW5kQ29sb3IgOiAncmVkJyxcbi8vICAgICAgICAgdGV4dDogJ1Rlc3QnLFxuLy8gICAgICAgICBmb250Ontmb250U2l6ZToyMn0sXG4vLyAgICAgICAgIGNvbG9yOiAnI2ZmZicsXG4vLyAgICAgICAgIHdpZHRoOiBUaS5VSS5TSVpFLFxuLy8gICAgICAgICBoZWlnaHQ6MzYsXG4vLyAgICAgICAgIHJpZ2h0OjIwXG4vLyB9KSk7XG5cbi8vIHZhciB3aW4gPSBUaS5VSS5jcmVhdGVXaW5kb3coe1xuLy8gICAgIHRpdGxlOiAnVGVzdCcsXG4vLyAgICAgYmFja2dyb3VuZENvbG9yOiAnI2ZmZicsXG4vLyAgICAgc3VzdGFpbmVkUGVyZm9ybWFuY2VNb2RlOnRydWUsXG4vLyAgICAgZXh0ZW5kU2FmZUFyZWE6ZmFsc2UsXG4vLyAgICAgaGVpZ2h0OlRpLlVJLkZJTEwsXG4vLyAgICAgdG9wOjAsXG4vLyAgICAgYm90dG9tOjBcbi8vICB9KTtcbiBcbi8vICB2YXIgc2VjdGlvbkZydWl0ID0gVGkuVUkuY3JlYXRlVGFibGVWaWV3U2VjdGlvbih7IGhlYWRlclRpdGxlOiAnRnJ1aXQnIH0pO1xuLy8gIHNlY3Rpb25GcnVpdC5hZGQoVGkuVUkuY3JlYXRlVGFibGVWaWV3Um93KHsgdGl0bGU6ICdBcHBsZXMnICwgY2xhc3NOYW1lIDonZnJ1aXRzJywgaXNSZXVzYWJsZTp0cnVlIH0pKTtcbi8vICBzZWN0aW9uRnJ1aXQuYWRkKFRpLlVJLmNyZWF0ZVRhYmxlVmlld1Jvdyh7IHRpdGxlOiAnQmFuYW5hcycgLCBjbGFzc05hbWUgOidmcnVpdHMnLCBpc1JldXNhYmxlOnRydWUgfSkpO1xuLy8gIHNlY3Rpb25GcnVpdC5hZGQoVGkuVUkuY3JlYXRlVGFibGVWaWV3Um93KHsgdGl0bGU6ICdBcHBsZXMnICwgY2xhc3NOYW1lIDonZnJ1aXRzJywgaXNSZXVzYWJsZTp0cnVlIH0pKTtcbi8vICBzZWN0aW9uRnJ1aXQuYWRkKFRpLlVJLmNyZWF0ZVRhYmxlVmlld1Jvdyh7IHRpdGxlOiAnQmFuYW5hcycgLCBjbGFzc05hbWUgOidmcnVpdHMnLCBpc1JldXNhYmxlOnRydWUgfSkpO1xuLy8gIHNlY3Rpb25GcnVpdC5hZGQoVGkuVUkuY3JlYXRlVGFibGVWaWV3Um93KHsgdGl0bGU6ICdBcHBsZXMnICwgY2xhc3NOYW1lIDonZnJ1aXRzJywgaXNSZXVzYWJsZTp0cnVlIH0pKTtcbi8vICBzZWN0aW9uRnJ1aXQuYWRkKFRpLlVJLmNyZWF0ZVRhYmxlVmlld1Jvdyh7IHRpdGxlOiAnQmFuYW5hcycgLCBjbGFzc05hbWUgOidmcnVpdHMnLCBpc1JldXNhYmxlOnRydWUgfSkpO1xuLy8gIHNlY3Rpb25GcnVpdC5hZGQoVGkuVUkuY3JlYXRlVGFibGVWaWV3Um93KHsgdGl0bGU6ICdBcHBsZXMnICwgY2xhc3NOYW1lIDonZnJ1aXRzJywgaXNSZXVzYWJsZTp0cnVlIH0pKTtcbi8vICBzZWN0aW9uRnJ1aXQuYWRkKFRpLlVJLmNyZWF0ZVRhYmxlVmlld1Jvdyh7IHRpdGxlOiAnQmFuYW5hcycsIGNsYXNzTmFtZSA6J2ZydWl0cycsIGlzUmV1c2FibGU6dHJ1ZSAgfSkpO1xuLy8gIHNlY3Rpb25GcnVpdC5hZGQoVGkuVUkuY3JlYXRlVGFibGVWaWV3Um93KHsgdGl0bGU6ICdBcHBsZXMnICwgY2xhc3NOYW1lIDonZnJ1aXRzJywgaXNSZXVzYWJsZTp0cnVlIH0pKTtcbi8vICBzZWN0aW9uRnJ1aXQuYWRkKFRpLlVJLmNyZWF0ZVRhYmxlVmlld1Jvdyh7IHRpdGxlOiAnQmFuYW5hcycgLCBjbGFzc05hbWUgOidmcnVpdHMnLCBpc1JldXNhYmxlOnRydWUgfSkpO1xuIFxuLy8gIHZhciBzZWN0aW9uVmVnID0gVGkuVUkuY3JlYXRlVGFibGVWaWV3U2VjdGlvbih7IGhlYWRlclRpdGxlOiAnVmVnZXRhYmxlcycgfSk7XG4vLyAgc2VjdGlvblZlZy5hZGQoVGkuVUkuY3JlYXRlVGFibGVWaWV3Um93KHsgdGl0bGU6ICdDYXJyb3RzJyAsIGNsYXNzTmFtZSA6J1ZlZ2V0YWJsZXMnLCBpc1JldXNhYmxlOnRydWUgfSkpO1xuLy8gIHNlY3Rpb25WZWcuYWRkKFRpLlVJLmNyZWF0ZVRhYmxlVmlld1Jvdyh7IHRpdGxlOiAnUG90YXRvZXMnICwgY2xhc3NOYW1lIDonVmVnZXRhYmxlcycsIGlzUmV1c2FibGU6dHJ1ZX0pKTtcbi8vICBzZWN0aW9uVmVnLmFkZChUaS5VSS5jcmVhdGVUYWJsZVZpZXdSb3coeyB0aXRsZTogJ0NhcnJvdHMnICwgY2xhc3NOYW1lIDonVmVnZXRhYmxlcycsIGlzUmV1c2FibGU6dHJ1ZX0pKTtcbi8vICBzZWN0aW9uVmVnLmFkZChUaS5VSS5jcmVhdGVUYWJsZVZpZXdSb3coeyB0aXRsZTogJ1BvdGF0b2VzJyAsIGNsYXNzTmFtZSA6J1ZlZ2V0YWJsZXMnLCBpc1JldXNhYmxlOnRydWV9KSk7XG4vLyAgc2VjdGlvblZlZy5hZGQoVGkuVUkuY3JlYXRlVGFibGVWaWV3Um93KHsgdGl0bGU6ICdDYXJyb3RzJyAsIGNsYXNzTmFtZSA6J1ZlZ2V0YWJsZXMnLCBpc1JldXNhYmxlOnRydWV9KSk7XG4vLyAgc2VjdGlvblZlZy5hZGQoVGkuVUkuY3JlYXRlVGFibGVWaWV3Um93KHsgdGl0bGU6ICdQb3RhdG9lcycgLCBjbGFzc05hbWUgOidWZWdldGFibGVzJywgaXNSZXVzYWJsZTp0cnVlfSkpO1xuLy8gIHNlY3Rpb25WZWcuYWRkKFRpLlVJLmNyZWF0ZVRhYmxlVmlld1Jvdyh7IHRpdGxlOiAnQ2Fycm90cycgLCBjbGFzc05hbWUgOidWZWdldGFibGVzJywgaXNSZXVzYWJsZTp0cnVlfSkpO1xuLy8gIHNlY3Rpb25WZWcuYWRkKFRpLlVJLmNyZWF0ZVRhYmxlVmlld1Jvdyh7IHRpdGxlOiAnUG90YXRvZXMnICwgY2xhc3NOYW1lIDonVmVnZXRhYmxlcycsIGlzUmV1c2FibGU6dHJ1ZX0pKTtcbi8vICBzZWN0aW9uVmVnLmFkZChUaS5VSS5jcmVhdGVUYWJsZVZpZXdSb3coeyB0aXRsZTogJ0NhcnJvdHMnICwgY2xhc3NOYW1lIDonVmVnZXRhYmxlcycsIGlzUmV1c2FibGU6dHJ1ZX0pKTtcbi8vICBzZWN0aW9uVmVnLmFkZChUaS5VSS5jcmVhdGVUYWJsZVZpZXdSb3coeyB0aXRsZTogJ1BvdGF0b2VzJyAsIGNsYXNzTmFtZSA6J1ZlZ2V0YWJsZXMnLCBpc1JldXNhYmxlOnRydWV9KSk7XG4vLyAgc2VjdGlvblZlZy5hZGQoVGkuVUkuY3JlYXRlVGFibGVWaWV3Um93KHsgdGl0bGU6ICdDYXJyb3RzJyAsIGNsYXNzTmFtZSA6J1ZlZ2V0YWJsZXMnLCBpc1JldXNhYmxlOnRydWV9KSk7XG4vLyAgc2VjdGlvblZlZy5hZGQoVGkuVUkuY3JlYXRlVGFibGVWaWV3Um93KHsgdGl0bGU6ICdMYXN0IGVudHJ5JywgY2xhc3NOYW1lIDonbGFzdCcsIGlzUmV1c2FibGU6dHJ1ZSB9KSk7XG4gXG4vLyAgdmFyIHRhYmxlVmlldyA9IFRpLlVJLmNyZWF0ZVRhYmxlVmlldyh7XG4vLyAgICBiYWNrZ3JvdW5kQ29sb3I6ICcjY2NjJyxcbi8vICAgIGRhdGE6IFtzZWN0aW9uRnJ1aXQsIHNlY3Rpb25WZWddLFxuLy8gICAgdG9wOjAsXG4vLyAgICBib3R0b206MCxcbi8vICAgIG1pblJvd0hlaWdodDo2OSxcbi8vICAgIHJvd0hlaWdodDo2OSxcbi8vICAgIHdpZHRoOlRpLlVJLkZJTEwsXG4vLyAgICBoZWlnaHQ6VGkuVUkuRklMTCxcbi8vICAgIGJ1YmJsZVBhcmVudDp0cnVlLFxuLy8gICAgbWF4Q2xhc3NuYW1lOjUwXG4vLyAgfSk7XG4vLyAgICAgdGFibGVWaWV3LmFkZEV2ZW50TGlzdGVuZXIoJ3Njcm9sbGVuZCcsIGZ1bmN0aW9uKGUpIHtcbi8vICAgICAgICAgLy9UaS5BUEkud2FybignU2Nyb2xsaW5nIHN0b3BwZWQhICBjb250ZW50T2Zmc2V0Lnk6ICcgKyBlLmNvbnRlbnRPZmZzZXQueSk7XG4vLyAgICAgfSk7XG4vLyAgICAgdGFibGVWaWV3LmFkZEV2ZW50TGlzdGVuZXIoJ3Njcm9sbCcsIGZ1bmN0aW9uKGUpIHtcbi8vICAgICAgICAgLy9UaS5BUEkud2FybignU2Nyb2xsaW5nISBjb250ZW50T2Zmc2V0Lnk6ICcgKyBlLmNvbnRlbnRPZmZzZXQueSk7XG4vLyAgICAgfSk7XG5cbi8vICB2YXIgdG9vbGJhckNvbnRhaW5lciA9IFRpLlVJLmNyZWF0ZVZpZXcoe1xuLy8gICAgICBiYWNrZ3JvdW5kQ29sb3I6ICcjYWEyZjUzYzMnLFxuLy8gICAgICB3aWR0aDpUaS5VSS5GSUxMLFxuLy8gICAgICBoZWlnaHQ6VGkuVUkuU0laRSxcbi8vICAgICAgYm90dG9tOjBcbi8vICAgIH0pO1xuXG4vLyAgdmFyIHRvb2xiYXJWaWV3ID0gVGkuVUkuY3JlYXRlVmlldyh7XG4vLyAgICAgYmFja2dyb3VuZENvbG9yOiAnI2FhMmY1M2MzJyxcbi8vICAgICBsYXlvdXQ6J2hvcml6b250YWwnLFxuLy8gICAgIHdpZHRoOlRpLlVJLkZJTEwsXG4vLyAgICAgaGVpZ2h0OlRpLlVJLlNJWkUsXG4vLyAgICAgYm90dG9tOjUsXG4vLyAgICAgdG9wOjVcbi8vICAgfSk7XG5cbi8vICAgdG9vbGJhckNvbnRhaW5lci5hZGQodG9vbGJhclZpZXcpO1xuXG5cbi8vIHZhciBzZW5kID0gVGkuVUkuY3JlYXRlQnV0dG9uKHtcbi8vICAgICB0aXRsZTogJ1NlbmQnLFxuLy8gICAgIHN0eWxlOlRpdGFuaXVtLlVJLkJVVFRPTl9TVFlMRV9GSUxMRUQsXG4vLyAgICAgYmFja2dyb3VuZENvbG9yOidibHVlJyxcbi8vICAgICBiYWNrZ3JvdW5kU2VsZWN0ZWRDb2xvcjonYmx1ZScsXG4vLyAgICAgdGludENvbG9yOicjZmZmJyxcbi8vICAgICB0ZXh0QWxpZ246VGl0YW5pdW0uVUkuVEVYVF9BTElHTk1FTlRfQ0VOVEVSLFxuLy8gICAgIHZlcnRpY2FsQWxpZ246VGl0YW5pdW0uVUkuVEVYVF9WRVJUSUNBTF9BTElHTk1FTlRfQ0VOVEVSLFxuLy8gICAgIGJvcmRlclJhZGl1czoxMixcbi8vICAgICB3aWR0aDpUaS5VSS5GSUxMLFxuLy8gICAgIHJpZ2h0OjEwLFxuLy8gICAgIGJvdHRvbTooQU5EUk9JRCkgPyA1IDogMTBcbi8vIH0pO1xuXG4vLyB2YXIgdGV4dEFyZWEgPSBUaS5VSS5jcmVhdGVUZXh0QXJlYSh7XG4vLyAgICAgdG9wOjgsXG4vLyAgICAgYm90dG9tOjgsXG4vLyAgICAgbGVmdDoxNSxcbi8vICAgICByaWdodDo4LFxuLy8gICAgIGF1dG9jb3JyZWN0OiBmYWxzZSxcbi8vICAgICBlZGl0YWJsZTp0cnVlLFxuLy8gICAgIGxpbmVzOjEsXG4vLyAgICAgbWF4TGluZXM6NSxcbi8vICAgICBib3JkZXJXaWR0aDogMSxcbi8vICAgICBib3JkZXJDb2xvcjogJyNhYWEnLFxuLy8gICAgIGJvcmRlclJhZGl1czogMTYsXG4vLyAgICAgY29sb3I6ICcjMDAwJyxcbi8vICAgICBiYWNrZ3JvdW5kQ29sb3I6ICcjZmZmJyxcbi8vICAgICBmb250OiB7Zm9udFNpemU6MTYsIGZvbnRXZWlnaHQ6J25vcm1hbCd9LFxuLy8gICAgIHRleHRBbGlnbjogJ2xlZnQnLFxuLy8gICAgIHZhbHVlOiAnJyxcbi8vICAgICB3aWR0aDogJzcwJScsXG4vLyAgICAgcGFkZGluZzp7bGVmdDo0LHJpZ2h0OjQsdG9wOjgsYm90dG9tOjh9LFxuLy8gICAgIGhlaWdodCA6IFRpLlVJLlNJWkUsXG4vLyAgICAgc3VwcHJlc3NSZXR1cm46ZmFsc2Vcbi8vICAgfSk7XG4gICAgXG4vLyAgIHRvb2xiYXJWaWV3LmFkZCh0ZXh0QXJlYSk7XG4vLyAgIHRvb2xiYXJWaWV3LmFkZChzZW5kKTtcbiAgICAgXG4vLyAgaWYgKEFORFJPSUQpIHtcbi8vICAgICAgdmFyIGludGVyYWN0aXZlS2V5Ym9hcmRWaWV3ID0ga2V5Ym9hcmRDb250cm9sTW9kdWxlLmNyZWF0ZVZpZXcoe1xuLy8gICAgICAgICAgc2hvd0tleWJvYXJkT25TY3JvbGxVcDp0cnVlLCAvLyBzaG93IGtleWJvYXJkICh3aGVuIGhpZGRlbikgb24gc2Nyb2xsaW5nIHVwXG4vLyAgICAgICAgICBhdXRvQWRqdXN0Qm90dG9tUGFkZGluZzp0cnVlLCAvLyBzY3JvbGxpbmdWaWV3IHdpbGwgc3RheSBhdCB0aGUgc2l6ZSB5b3Ugc2V0LCBidXQgdGhlIHNjcm9sbEluc2V0Qm90dG9tIHdpbGwgYXV0b21hdGljbHkgYWRqdXN0IHRvIHRoZSB0b29sYmFyIGhlaWdodCAoZXg6IGJsdXJWaWV3VG9vbGJhciwgeW91IGNhbiBzZWUgdGhlIHNjcm9sbGluZ1ZpZXcgY29udGVudCB0aHJvdWdoIHRoZSBibHVycmVkIHRvb2xiYXIpXG4vLyAgICAgICAgICBhdXRvU2Nyb2xsVG9Cb3R0b206dHJ1ZSwgLy8gc2Nyb2xsaW5nIHRvIGJvdHRvbSBvbiB0b29sYmFyIHNpemUgY2hhbmdlXG4vLyAgICAgICAgICBhdXRvU2l6ZUFuZEtlZXBTY3JvbGxpbmdWaWV3QWJvdmVUb29sYmFyOmZhbHNlLCAvLyBzY3JvbGxpbmdWaWV3IHdpbGwgYmUgYWx3YXlzIG9uIHRvcCBvZiB0aGUgdG9vbGJhclZpZXcgLSB0aGUgc2Nyb2xsaW5nVmlldyByZXNpemVzIGF1dG9tYXRpY2x5IHJlc3BlY3RpbmcgdGhlIHNjcm9sbGluZ1ZpZXcgYm90dG9tIHZhbHVlIChpZiBzZXQpIHdoZW4gXCJ0cnVlXCIgLT4gXCJhdXRvQWRqdXN0Qm90dG9tUGFkZGluZz10cnVlXCIgaGFzIG5vIGVmZmVjdFxuLy8gICAgICAgICAgc2Nyb2xsaW5nVmlldzp0YWJsZVZpZXcsIC8vIHdoYXRldmVyIGxpc3RWaWV3LCB0YWJsZVZpZXcsIHNjcm9sbFZpZXcgLT4gd2lsbCBiZSBhdXRvbWF0aWNseSBhZGRlZCB0byB0aGUgaW50ZXJhY3RpdmVLZXlib2FyZFZpZXdcbi8vICAgICAgICAgIHRvb2xiYXJWaWV3OnRvb2xiYXJDb250YWluZXIsIC8vIGhhcyB0byBiZSBhIFRpLlVJLlZpZXchISEgIC0+IHdpbGwgYmUgYXV0b21hdGljbHkgYWRkZWQgdG8gdGhlIGludGVyYWN0aXZlS2V5Ym9hcmRWaWV3XG4vLyAgICAgICAgICBiYWNrZ3JvdW5kQ29sb3I6JyNmZWZlZmUnLFxuLy8gICAgICAgICAgdG9wOjAsXG4vLyAgICAgICAgICBib3R0b206MFxuLy8gICAgICB9KTsgXG4vLyAgICAgIHdpbi5hZGQoaW50ZXJhY3RpdmVLZXlib2FyZFZpZXcpO1xuLy8gIH1cbi8vICBlbHNlIHtcblxuLy8gICAgIHZhciBpbnRlcmFjdGl2ZUtleWJvYXJkVmlldyA9IGtleWJvYXJkQ29udHJvbE1vZHVsZS5jcmVhdGVWaWV3KHtcbi8vICAgICAgICAgcGFyZW50V2luZG93Ondpbixcbi8vICAgICAgICAgYXV0b0FkanVzdEJvdHRvbVBhZGRpbmc6dHJ1ZSxcbi8vICAgICAgICAgYXV0b1Njcm9sbFRvQm90dG9tOnRydWUsIC8vIHNjcm9sbGluZyB0byBib3R0b20gb24gdG9vbGJhciBzaXplIGNoYW5nZVxuLy8gICAgICAgICBhdXRvU2l6ZUFuZEtlZXBTY3JvbGxpbmdWaWV3QWJvdmVUb29sYmFyOmZhbHNlLCAvLyBzY3JvbGxpbmdWaWV3IHdpbGwgYmUgYWx3YXlzIG9uIHRvcCBvZiB0aGUgdG9vbGJhclZpZXcgLSB0aGUgc2Nyb2xsaW5nVmlldyByZXNpemVzIGF1dG9tYXRpY2x5IHJlc3BlY3RpbmcgdGhlIHNjcm9sbGluZ1ZpZXcgYm90dG9tIHZhbHVlIChpZiBzZXQpIHdoZW4gXCJ0cnVlXCIgLT4gXCJhdXRvQWRqdXN0Qm90dG9tUGFkZGluZz10cnVlXCIgaGFzIG5vIGVmZmVjdCBpbiB0aGF0IGNhc2Vcbi8vICAgICAgICAgaWdub3JlRXh0ZW5kU2FmZUFyZWE6ZmFsc2UsIC8vIG9ubHkgdXNlZCB3aGVuZSB0aGUgcGFyZW50V2luZG93IGhhcyBcImV4dGVuZFNhZmVBcmVhOnRydWVcIiBBTkQgcGFyZW50V2luZG93IGlzIGEgc3RhbmRhbG9uZSB3aW5kb3cgKG5vdCBjb250YWluZWQgaW4gTmF2aWdhdGlvbldpbmRvdyBhbmQvb3IgVGFnR3JvdXApIC0+IHRoZSBtb2R1bGUgZG9lcyBhdXRvZGV0ZWN0IHRoYXQhXG4vLyAgICAgICAgIHNjcm9sbGluZ1ZpZXc6dGFibGVWaWV3LCAvLyB3aGF0ZXZlciBsaXN0VmlldywgdGFibGVWaWV3LCBzY3JvbGxWaWV3ICAtPiB3aWxsIGJlIGF1dG9tYXRpY2x5IGFkZGVkIHRvIHRoZSBpbnRlcmFjdGl2ZUtleWJvYXJkVmlld1xuLy8gICAgICAgICB0b29sYmFyVmlldzp0b29sYmFyQ29udGFpbmVyLCAvLyBoYXMgdG8gYmUgYSBUaS5VSS5WaWV3ISEhIC0+IHdpbGwgYmUgYXV0b21hdGljbHkgYWRkZWQgdG8gdGhlIGludGVyYWN0aXZlS2V5Ym9hcmRWaWV3XG4vLyAgICAgICAgIHRleHRmaWVsZDp0ZXh0QXJlYSwgLy8gcmVxdWlyZWQgLT4gcHV0IGhlcmUgeW91ciBUaS5VSS5UZXh0QXJlYSBvciBUaXRhbml1bS5VSS5UZXh0RmllbGRcbi8vICAgICAgICAga2V5Ym9hcmRQYW5uaW5nOnRydWUsXG4vLyAgICAgICAgIGJhY2tncm91bmRDb2xvcjonI2ZlZmVmZScsXG4vLyAgICAgICAgIHRvcDowLFxuLy8gICAgICAgICBib3R0b206MFxuLy8gICAgIH0pO1xuLy8gICAgIHdpbi5hZGQoaW50ZXJhY3RpdmVLZXlib2FyZFZpZXcpO1xuLy8gIH1cblxuLy8gIHdpbi5vcGVuKCk7XG5cblxuXG4vLyAvLyAvLyArKysrKysrKysrKysrKysrKysrKysrKysrKysrKysrKysrKysrKysrKysrKysrKysrKysrXG4vLyAvLyAvLyBDb2RlIGZvciBUYWJHcm91cCBiZWxvd1xuLy8gLy8gLy8gKysrKysrKysrKysrKysrKysrKysrKysrKysrKysrKysrKysrKysrKysrKysrKysrKysrK1xuXG5cbi8qKlxuICogQ3JlYXRlIGEgbmV3IGBUaS5VSS5UYWJHcm91cGAuXG4gKi9cbnZhciB0YWJHcm91cCA9IFRpLlVJLmNyZWF0ZVRhYkdyb3VwKCk7XG5cbi8vICAvKipcbi8vICAgKiBBZGQgdGhlIHR3byBjcmVhdGVkIHRhYnMgdG8gdGhlIHRhYkdyb3VwIG9iamVjdC5cbi8vICAqL1xuICB0YWJHcm91cC5hZGRUYWIoY3JlYXRlVGFiKFwiQXV0b0FkanVzdEJvdHRvbVBhZGRpbmdcIiwgXCJcIiwgXCJhc3NldHMvaW1hZ2VzL3RhYjEucG5nXCIpKTtcbiAgdGFiR3JvdXAuYWRkVGFiKGNyZWF0ZVRhYihcIktlZXBTY3JvbGxpbmdWaWV3QWJvdmVcIiwgXCJcIiwgXCJhc3NldHMvaW1hZ2VzL3RhYjIucG5nXCIpKTtcblxuXG4vLyAvLyArKysrKysrKysrKysrKysrKysrKysrKysrKysrKysrKysrKysrKysrKysrKysrKysrKysrXG4vLyAvLyBDb2RlIGZvciBUYWJHcm91cCBvbmx5XG4vLyAvLyArKysrKysrKysrKysrKysrKysrKysrKysrKysrKysrKysrKysrKysrKysrKysrKysrKysrXG5cbi8vIC8qKlxuLy8gICogT3BlbiB0aGUgdGFiR3JvdXBcbi8vICAqL1xuLy8gdGFiR3JvdXAub3BlbigpO1xuXG5cbi8vICsrKysrKysrKysrKysrKysrKysrKysrKysrKysrKysrKysrKysrKysrKysrKysrKysrKytcbi8vIENvZGUgZm9yIFRhYkdyb3VwIGluIE5hdmlnYXRpb25XaW5kb3dcbi8vICsrKysrKysrKysrKysrKysrKysrKysrKysrKysrKysrKysrKysrKysrKysrKysrKysrKytcblxuXG4vKipcbiAqIE9wZW4gdGhlIHRhYkdyb3VwIGluIGEgbmF2aWdhdGlvbldpbmRvd1xuICovXG52YXIgbmF2aWdhdGlvbldpbmRvdyA9IFRpdGFuaXVtLlVJLmNyZWF0ZU5hdmlnYXRpb25XaW5kb3coe1xuICAgIHdpbmRvdzogdGFiR3JvdXBcbn0pO1xubmF2aWdhdGlvbldpbmRvdy5vcGVuKCk7XG5cblxuXG4vLyAvKipcbi8vICAqIENyZWF0ZXMgYSBuZXcgVGFiIGFuZCBjb25maWd1cmVzIGl0LlxuLy8gICpcbi8vICAqIEBwYXJhbSAge1N0cmluZ30gdGl0bGUgVGhlIHRpdGxlIHVzZWQgaW4gdGhlIGBUaS5VSS5UYWJgIGFuZCBpdCdzIGluY2x1ZGVkIGBUaS5VSS5XaW5kb3dgXG4vLyAgKiBAcGFyYW0gIHtTdHJpbmd9IG1lc3NhZ2UgVGhlIHRpdGxlIGRpc3BsYXllZCBpbiB0aGUgYFRpLlVJLkxhYmVsYFxuLy8gICogQHJldHVybiB7U3RyaW5nfSBpY29uIFRoZSBpY29uIHVzZWQgaW4gdGhlIGBUaS5VSS5UYWJgXG4vLyAgKi9cbmZ1bmN0aW9uIGNyZWF0ZVRhYih0aXRsZSwgbWVzc2FnZSwgaWNvbikge1xuXG4gICAgdmFyIHdpbiA9IFRpLlVJLmNyZWF0ZVdpbmRvdyh7XG4gICAgICAgdGl0bGU6ICdUZXN0JyxcbiAgICAgICBiYXJDb2xvciA6ICcjMzY1Yjg1JyxcbiAgICAgICBiYWNrZ3JvdW5kQ29sb3I6ICcjZmZmJyxcbiAgICAgICBleHRlbmRTYWZlQXJlYTpmYWxzZSxcblx0ICAgdGFiQmFySGlkZGVuOih0aXRsZSA9PSBcIktlZXBTY3JvbGxpbmdWaWV3QWJvdmVcIikgPyB0cnVlIDogZmFsc2UsXG4gICAgICAgc3VzdGFpbmVkUGVyZm9ybWFuY2VNb2RlOnRydWVcbiAgICB9KTtcbiAgICBcbiAgICB2YXIgc2VjdGlvbkZydWl0ID0gVGkuVUkuY3JlYXRlVGFibGVWaWV3U2VjdGlvbih7IGhlYWRlclRpdGxlOiAnRnJ1aXQnIH0pO1xuICAgIHNlY3Rpb25GcnVpdC5hZGQoVGkuVUkuY3JlYXRlVGFibGVWaWV3Um93KHsgdGl0bGU6ICdBcHBsZXMnIH0pKTtcbiAgICBzZWN0aW9uRnJ1aXQuYWRkKFRpLlVJLmNyZWF0ZVRhYmxlVmlld1Jvdyh7IHRpdGxlOiAnQmFuYW5hcycgfSkpO1xuICAgIHNlY3Rpb25GcnVpdC5hZGQoVGkuVUkuY3JlYXRlVGFibGVWaWV3Um93KHsgdGl0bGU6ICdBcHBsZXMnIH0pKTtcbiAgICBzZWN0aW9uRnJ1aXQuYWRkKFRpLlVJLmNyZWF0ZVRhYmxlVmlld1Jvdyh7IHRpdGxlOiAnQmFuYW5hcycgfSkpO1xuICAgIHNlY3Rpb25GcnVpdC5hZGQoVGkuVUkuY3JlYXRlVGFibGVWaWV3Um93KHsgdGl0bGU6ICdBcHBsZXMnIH0pKTtcbiAgICBzZWN0aW9uRnJ1aXQuYWRkKFRpLlVJLmNyZWF0ZVRhYmxlVmlld1Jvdyh7IHRpdGxlOiAnQmFuYW5hcycgfSkpO1xuICAgIHNlY3Rpb25GcnVpdC5hZGQoVGkuVUkuY3JlYXRlVGFibGVWaWV3Um93KHsgdGl0bGU6ICdBcHBsZXMnIH0pKTtcbiAgICBzZWN0aW9uRnJ1aXQuYWRkKFRpLlVJLmNyZWF0ZVRhYmxlVmlld1Jvdyh7IHRpdGxlOiAnQmFuYW5hcycgfSkpO1xuICAgIHNlY3Rpb25GcnVpdC5hZGQoVGkuVUkuY3JlYXRlVGFibGVWaWV3Um93KHsgdGl0bGU6ICdBcHBsZXMnIH0pKTtcbiAgICBzZWN0aW9uRnJ1aXQuYWRkKFRpLlVJLmNyZWF0ZVRhYmxlVmlld1Jvdyh7IHRpdGxlOiAnQmFuYW5hcycgfSkpO1xuICAgIFxuICAgIHZhciBzZWN0aW9uVmVnID0gVGkuVUkuY3JlYXRlVGFibGVWaWV3U2VjdGlvbih7IGhlYWRlclRpdGxlOiAnVmVnZXRhYmxlcycgfSk7XG4gICAgc2VjdGlvblZlZy5hZGQoVGkuVUkuY3JlYXRlVGFibGVWaWV3Um93KHsgdGl0bGU6ICdDYXJyb3RzJyB9KSk7XG4gICAgc2VjdGlvblZlZy5hZGQoVGkuVUkuY3JlYXRlVGFibGVWaWV3Um93KHsgdGl0bGU6ICdQb3RhdG9lcycgfSkpO1xuICAgIHNlY3Rpb25WZWcuYWRkKFRpLlVJLmNyZWF0ZVRhYmxlVmlld1Jvdyh7IHRpdGxlOiAnQ2Fycm90cycgfSkpO1xuICAgIHNlY3Rpb25WZWcuYWRkKFRpLlVJLmNyZWF0ZVRhYmxlVmlld1Jvdyh7IHRpdGxlOiAnUG90YXRvZXMnIH0pKTtcbiAgICBzZWN0aW9uVmVnLmFkZChUaS5VSS5jcmVhdGVUYWJsZVZpZXdSb3coeyB0aXRsZTogJ0NhcnJvdHMnIH0pKTtcbiAgICBzZWN0aW9uVmVnLmFkZChUaS5VSS5jcmVhdGVUYWJsZVZpZXdSb3coeyB0aXRsZTogJ1BvdGF0b2VzJyB9KSk7XG4gICAgc2VjdGlvblZlZy5hZGQoVGkuVUkuY3JlYXRlVGFibGVWaWV3Um93KHsgdGl0bGU6ICdDYXJyb3RzJyB9KSk7XG4gICAgc2VjdGlvblZlZy5hZGQoVGkuVUkuY3JlYXRlVGFibGVWaWV3Um93KHsgdGl0bGU6ICdQb3RhdG9lcycgfSkpO1xuICAgIHNlY3Rpb25WZWcuYWRkKFRpLlVJLmNyZWF0ZVRhYmxlVmlld1Jvdyh7IHRpdGxlOiAnQ2Fycm90cycgfSkpO1xuICAgIHNlY3Rpb25WZWcuYWRkKFRpLlVJLmNyZWF0ZVRhYmxlVmlld1Jvdyh7IHRpdGxlOiAnUG90YXRvZXMnIH0pKTtcbiAgICBzZWN0aW9uVmVnLmFkZChUaS5VSS5jcmVhdGVUYWJsZVZpZXdSb3coeyB0aXRsZTogJ0NhcnJvdHMnIH0pKTtcbiAgICBzZWN0aW9uVmVnLmFkZChUaS5VSS5jcmVhdGVUYWJsZVZpZXdSb3coeyB0aXRsZTogJ0xhc3QgZW50cnknIH0pKTtcbiAgICBcbiAgICB2YXIgdGFibGVWaWV3ID0gVGkuVUkuY3JlYXRlVGFibGVWaWV3KHtcbiAgICAgIGJhY2tncm91bmRDb2xvcjogJ2dyZWVuJyxcbiAgICAgIGRhdGE6IFtzZWN0aW9uRnJ1aXQsIHNlY3Rpb25WZWddLFxuICAgICAgdG9wOjAsXG4gICAgICBib3R0b206MCxcbiAgICAgIG1pblJvd0hlaWdodDo2OSxcbiAgICAgIHJvd0hlaWdodDo2OSxcbiAgICAgIHdpZHRoOlRpLlVJLkZJTEwsXG4gICAgICBoZWlnaHQ6VGkuVUkuRklMTCxcbiAgICAgIGJ1YmJsZVBhcmVudDp0cnVlXG4gICAgfSk7XG5cblxuICAgIHRhYmxlVmlldy5hZGRFdmVudExpc3RlbmVyKCdzY3JvbGxlbmQnLCBmdW5jdGlvbihlKSB7XG4gICAgICAgLy8gVGkuQVBJLndhcm4oJ1Njcm9sbGluZyBzdG9wcGVkISBGaW5hbCBYOiAnICsgZS54ICsgJywgWTogJyArIGUueSk7XG4gICAgfSk7XG4gICAgdGFibGVWaWV3LmFkZEV2ZW50TGlzdGVuZXIoJ3Njcm9sbCcsIGZ1bmN0aW9uKGUpIHtcbiAgICAgICAvLyBUaS5BUEkud2FybignU2Nyb2xsaW5nISBYOiAnICsgZS54ICsgJywgWTogJyArIGUueSk7XG4gICAgfSk7XG5cbiAgICB2YXIgdG9vbGJhckNvbnRhaW5lciA9IFRpLlVJLmNyZWF0ZVZpZXcoe1xuICAgICAgICBiYWNrZ3JvdW5kQ29sb3I6ICcjYWEyZjUzYzMnLFxuICAgICAgICB3aWR0aDpUaS5VSS5GSUxMLFxuICAgICAgICBoZWlnaHQ6VGkuVUkuU0laRSxcbiAgICAgICAgYm90dG9tOjBcbiAgICAgIH0pO1xuICAgXG4gICAgdmFyIHRvb2xiYXJWaWV3ID0gVGkuVUkuY3JlYXRlVmlldyh7XG4gICAgICAgYmFja2dyb3VuZENvbG9yOih0aXRsZSA9PSBcIktlZXBTY3JvbGxpbmdWaWV3QWJvdmVcIikgPyAnYmx1ZScgOiAncmVkJyxcbiAgICAgICBsYXlvdXQ6J2hvcml6b250YWwnLFxuICAgICAgIHdpZHRoOlRpLlVJLkZJTEwsXG4gICAgICAgaGVpZ2h0OlRpLlVJLlNJWkUsXG4gICAgICAgYm90dG9tOjUsXG4gICAgICAgdG9wOjVcbiAgICAgfSk7XG4gICBcbiAgICAgdG9vbGJhckNvbnRhaW5lci5hZGQodG9vbGJhclZpZXcpO1xuXG4gICAgdmFyIHNlbmQgPSBUaS5VSS5jcmVhdGVCdXR0b24oe1xuICAgICAgICB0aXRsZTogJ1NlbmQnLFxuICAgICAgICBzdHlsZTpUaXRhbml1bS5VSS5CVVRUT05fU1RZTEVfRklMTEVELFxuICAgICAgICBiYWNrZ3JvdW5kQ29sb3I6J2JsdWUnLFxuICAgICAgICBiYWNrZ3JvdW5kU2VsZWN0ZWRDb2xvcjonYmx1ZScsXG4gICAgICAgIHRpbnRDb2xvcjonI2ZmZicsXG4gICAgICAgIHRleHRBbGlnbjpUaXRhbml1bS5VSS5URVhUX0FMSUdOTUVOVF9DRU5URVIsXG4gICAgICAgIHZlcnRpY2FsQWxpZ246VGl0YW5pdW0uVUkuVEVYVF9WRVJUSUNBTF9BTElHTk1FTlRfQ0VOVEVSLFxuICAgICAgICBib3JkZXJSYWRpdXM6MTIsXG4gICAgICAgIHdpZHRoOlRpLlVJLkZJTEwsXG4gICAgICAgIHJpZ2h0OjEwLFxuICAgICAgICBib3R0b206KEFORFJPSUQpID8gNSA6IDEwXG4gICAgfSk7XG4gICAgXG4gICAgdmFyIHRleHRBcmVhID0gVGkuVUkuY3JlYXRlVGV4dEFyZWEoe1xuICAgICAgICB0b3A6OCxcbiAgICAgICAgYm90dG9tOjgsXG4gICAgICAgIGxlZnQ6MTUsXG4gICAgICAgIHJpZ2h0OjgsXG4gICAgICAgIGF1dG9jb3JyZWN0OiBmYWxzZSxcbiAgICAgICAgZWRpdGFibGU6dHJ1ZSxcbiAgICAgICAgYm9yZGVyV2lkdGg6IDEsXG4gICAgICAgIGJvcmRlckNvbG9yOiAnI2FhYScsXG4gICAgICAgIGJvcmRlclJhZGl1czogMTYsXG4gICAgICAgIHNjcm9sbGFibGU6dHJ1ZSxcbiAgICAgICAgLy8gbWF4TGluZXM6NSxcbiAgICAgICAgY29sb3I6ICcjMDAwJyxcbiAgICAgICAgYmFja2dyb3VuZENvbG9yOiAnI2ZmZicsXG4gICAgICAgIGZvbnQ6IHtmb250U2l6ZToxNiwgZm9udFdlaWdodDonbm9ybWFsJ30sXG4gICAgICAgIHRleHRBbGlnbjogVGl0YW5pdW0uVUkuVEVYVF9BTElHTk1FTlRfTEVGVCxcbiAgICAgICAgdmVydGljYWxBbGlnbjogVGl0YW5pdW0uVUkuVEVYVF9WRVJUSUNBTF9BTElHTk1FTlRfQ0VOVEVSLFxuICAgICAgICB2YWx1ZTogJycsXG4gICAgICAgIHdpZHRoOiAnNzAlJyxcbiAgICAgICAgcGFkZGluZzp7bGVmdDo0LHJpZ2h0OjQsdG9wOjEwLGJvdHRvbToxMH0sXG4gICAgICAgIGhlaWdodCA6IFRpLlVJLlNJWkUsXG4gICAgICAgIHN1cHByZXNzUmV0dXJuOmZhbHNlXG4gICAgICB9KTtcbiAgICAgICBcbiAgICAgIHRvb2xiYXJWaWV3LmFkZCh0ZXh0QXJlYSk7XG4gICAgICB0b29sYmFyVmlldy5hZGQoc2VuZCk7XG4gICAgICAgIFxuICAgIGlmIChBTkRST0lEKSB7XG4gICAgICAgIHZhciBpbnRlcmFjdGl2ZUtleWJvYXJkVmlldyA9IGtleWJvYXJkQ29udHJvbE1vZHVsZS5jcmVhdGVWaWV3KHtcbiAgICAgICAgICAgIHNob3dLZXlib2FyZE9uU2Nyb2xsVXA6dHJ1ZSwgLy8gc2hvdyBrZXlib2FyZCAod2hlbiBoaWRkZW4pIG9uIHNjcm9sbGluZyB1cFxuICAgICAgICAgICAgYXV0b0FkanVzdEJvdHRvbVBhZGRpbmc6dHJ1ZSwgLy8gc2Nyb2xsaW5nVmlldyB3aWxsIHN0YXkgYXQgdGhlIHNpemUgeW91IHNldCwgYnV0IHRoZSBzY3JvbGxJbnNldEJvdHRvbSB3aWxsIGF1dG9tYXRpY2x5IGFkanVzdCB0byB0aGUgdG9vbGJhciBoZWlnaHQgKGV4OiBibHVyVmlld1Rvb2xiYXIsIHlvdSBjYW4gc2VlIHRoZSBzY3JvbGxpbmdWaWV3IGNvbnRlbnQgdGhyb3VnaCB0aGUgYmx1cnJlZCB0b29sYmFyKVxuICAgICAgICAgICAgYXV0b1Njcm9sbFRvQm90dG9tOnRydWUsIC8vIHNjcm9sbGluZyB0byBib3R0b20gb24gdG9vbGJhciBzaXplIGNoYW5nZVxuICAgICAgICAgICAgYXV0b1NpemVBbmRLZWVwU2Nyb2xsaW5nVmlld0Fib3ZlVG9vbGJhcjoodGl0bGUgPT0gXCJLZWVwU2Nyb2xsaW5nVmlld0Fib3ZlXCIpID8gdHJ1ZSA6IGZhbHNlLCAvLyBzY3JvbGxpbmdWaWV3IHdpbGwgYmUgYWx3YXlzIG9uIHRvcCBvZiB0aGUgdG9vbGJhclZpZXcgLSB0aGUgc2Nyb2xsaW5nVmlldyByZXNpemVzIGF1dG9tYXRpY2x5IHJlc3BlY3RpbmcgdGhlIHNjcm9sbGluZ1ZpZXcgYm90dG9tIHZhbHVlIChpZiBzZXQpIHdoZW4gXCJ0cnVlXCIgLT4gXCJhdXRvQWRqdXN0Qm90dG9tUGFkZGluZz10cnVlXCIgaGFzIG5vIGVmZmVjdFxuICAgICAgICAgICAgc2Nyb2xsaW5nVmlldzp0YWJsZVZpZXcsIC8vIHdoYXRldmVyIGxpc3RWaWV3LCB0YWJsZVZpZXcsIHNjcm9sbFZpZXdcbiAgICAgICAgICAgIHRvb2xiYXJWaWV3OnRvb2xiYXJDb250YWluZXIsIC8vIGhhcyB0byBiZSBhIFRpLlVJLlZpZXchISFcbiAgICAgICAgICAgIGJhY2tncm91bmRDb2xvcjonI2ZlZmVmZScsXG4gICAgICAgICAgICB0b3A6MCxcbiAgICAgICAgICAgIGJvdHRvbTowXG4gICAgICAgIH0pOyBcbiAgICAgICAgd2luLmFkZChpbnRlcmFjdGl2ZUtleWJvYXJkVmlldyk7XG4gICAgfVxuICAgIGVsc2Uge1xuXG4gICAgICAgIHZhciBpbnRlcmFjdGl2ZUtleWJvYXJkVmlldyA9IGtleWJvYXJkQ29udHJvbE1vZHVsZS5jcmVhdGVWaWV3KHtcbiAgICAgICAgICAgIHBhcmVudFdpbmRvdzp3aW4sIC8vIHJlcXVpcmVkIC0+IHRoZSB3aW5kb3cgdGhlIGludGVyYWN0aXZlS2V5Ym9hcmRWaWV3IGlzIHBhcnQgb2ZcbiAgICAgICAgICAgIGF1dG9BZGp1c3RCb3R0b21QYWRkaW5nOih0aXRsZSA9PSBcIktlZXBTY3JvbGxpbmdWaWV3QWJvdmVcIikgPyBmYWxzZSA6IHRydWUsXG4gICAgICAgICAgICBpZ25vcmVFeHRlbmRTYWZlQXJlYTpmYWxzZSwgLy8gb25seSB1c2VkIHdoZW5lIHRoZSBwYXJlbnRXaW5kb3cgaGFzIFwiZXh0ZW5kU2FmZUFyZWE6dHJ1ZVwiIEFORCBwYXJlbnRXaW5kb3cgaXMgYSBzdGFuZGFsb25lIHdpbmRvdyAobm90IGNvbnRhaW5lZCBpbiBOYXZpZ2F0aW9uV2luZG93IGFuZC9vciBUYWdHcm91cCkgLT4gdGhlIG1vZHVsZSBkb2VzIGF1dG9kZXRlY3QgdGhhdCFcbiAgICAgICAgICAgIGF1dG9TY3JvbGxUb0JvdHRvbToodGl0bGUgPT0gXCJLZWVwU2Nyb2xsaW5nVmlld0Fib3ZlXCIpID8gZmFsc2UgOiB0cnVlLCAvLyBzY3JvbGxpbmcgdG8gYm90dG9tIG9uIHRvb2xiYXIgc2l6ZSBjaGFuZ2UgLyBvciB3aGVuIGZvY3VzIG9mIFwidGV4dGZpZWxkXCJcbiAgICAgICAgICAgIGF1dG9TaXplQW5kS2VlcFNjcm9sbGluZ1ZpZXdBYm92ZVRvb2xiYXI6KHRpdGxlID09IFwiS2VlcFNjcm9sbGluZ1ZpZXdBYm92ZVwiKSA/IHRydWUgOiBmYWxzZSwgLy8gc2Nyb2xsaW5nVmlldyB3aWxsIGJlIGFsd2F5cyBvbiB0b3Agb2YgdGhlIHRvb2xiYXJWaWV3IC0gdGhlIHNjcm9sbGluZ1ZpZXcgcmVzaXplcyBhdXRvbWF0aWNseSByZXNwZWN0aW5nIHRoZSBzY3JvbGxpbmdWaWV3IGJvdHRvbSB2YWx1ZSAoaWYgc2V0KSB3aGVuIFwidHJ1ZVwiIC0+IFwiYXV0b0FkanVzdEJvdHRvbVBhZGRpbmc9dHJ1ZVwiIGhhcyBubyBlZmZlY3QgaW4gdGhhdCBjYXNlXG4gICAgICAgICAgICBzaG93S2V5Ym9hcmRPblNjcm9sbFVwOnRydWUsIC8vIHNob3cga2V5Ym9hcmQgd2hlbiBvdmVyc2Nyb2xsaW5nIGF0IGJvdHRvbSAoaU9TICsgQW5kcm9pZClcbiAgICAgICAgICAgIHNjcm9sbGluZ1ZpZXc6dGFibGVWaWV3LCAvLyB3aGF0ZXZlciBsaXN0VmlldywgdGFibGVWaWV3LCBzY3JvbGxWaWV3XG4gICAgICAgICAgICB0b29sYmFyVmlldzp0b29sYmFyQ29udGFpbmVyLCAvLyBoYXMgdG8gYmUgYSBUaS5VSS5WaWV3ISEhXG4gICAgICAgICAgICB0ZXh0ZmllbGQ6dGV4dEFyZWEsIC8vIHJlcXVpcmVkIC0+IHB1dCBoZXJlIHlvdXIgVGkuVUkuVGV4dEFyZWEgb3IgVGl0YW5pdW0uVUkuVGV4dEZpZWxkXG4gICAgICAgICAgICBrZXlib2FyZFBhbm5pbmc6dHJ1ZSwgLy8gd2hlbiB0cnVlIHRoZSBpbnRlcmFjdGl2ZSBtb2RlIGlzIG9uXG4gICAgICAgICAgICBiYWNrZ3JvdW5kQ29sb3I6JyNmZWZlZmUnLFxuICAgICAgICAgICAgdG9wOjAsXG4gICAgICAgICAgICBib3R0b206MFxuICAgICAgICB9KTtcbiAgICAgICAgd2luLmFkZChpbnRlcmFjdGl2ZUtleWJvYXJkVmlldyk7XG4gICAgfVxuXG5cblxuXG4gICAgdmFyIHRhYiA9IFRpLlVJLmNyZWF0ZVRhYih7XG4gICAgICAgIHRpdGxlOiB0aXRsZSxcbiAgICAgICAgaWNvbjogaWNvbixcbiAgICAgICAgd2luZG93OiB3aW5cbiAgICB9KTtcblxuICAgIHJldHVybiB0YWI7XG59XG5cblxuXG5cblxuXG4vLyB2YXIgTmFwcERyYXdlck1vZHVsZSA9IHJlcXVpcmUoJ2RrLm5hcHAuZHJhd2VyJyk7XG5cbi8vIGZ1bmN0aW9uIGNyZWF0ZUFQSUV4YW1wbGVXaW5kb3coKSB7XG4vLyAgIHZhciB3aW4gPSBUaS5VSS5jcmVhdGVXaW5kb3coKTtcblxuLy8gICB2YXIgZGF0YSA9IFt7XG4vLyAgICAgICB0aXRsZTogJ1RvZ2dsZSBzaGFkb3cnXG4vLyAgICAgfSxcbi8vICAgICB7XG4vLyAgICAgICB0aXRsZTogJ1RvZ2dsZSBzdHJldGNoIGRyYXdlcidcbi8vICAgICB9LFxuLy8gICAgIHtcbi8vICAgICAgIHRpdGxlOiAnQ2xvc2UgRHJhd2VyJ1xuLy8gICAgIH0sXG4vLyAgICAge1xuLy8gICAgICAgdGl0bGU6ICdOZXcgV2luZG93J1xuLy8gICAgIH0sXG4vLyAgICAge1xuLy8gICAgICAgdGl0bGU6ICdEZWZhdWx0IFdpbmRvdydcbi8vICAgICB9LFxuLy8gICAgIHtcbi8vICAgICAgIHRpdGxlOiAnUmVtb3ZlIHJpZ2h0IERyYXdlcidcbi8vICAgICB9XG4vLyAgIF07XG5cbi8vICAgdmFyIHRhYmxlVmlldyA9IFRpLlVJLmNyZWF0ZVRhYmxlVmlldyh7XG4vLyAgICAgZGF0YTogZGF0YVxuLy8gICB9KTtcblxuLy8gICB0YWJsZVZpZXcuYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCBmdW5jdGlvbihlKSB7XG4vLyAgICAgVGkuQVBJLmluZm8oJ2lzTGVmdFdpbmRvd09wZW46ICcgKyBkcmF3ZXIuaXNMZWZ0V2luZG93T3BlbigpKTtcbi8vICAgICBzd2l0Y2ggKGUuaW5kZXgpIHtcbi8vICAgICAgIGNhc2UgMDpcbi8vICAgICAgICAgZHJhd2VyLnNob3dTaGFkb3cgPSAhZHJhd2VyLnNob3dTaGFkb3c7XG4vLyAgICAgICAgIGJyZWFrO1xuLy8gICAgICAgY2FzZSAxOlxuLy8gICAgICAgICBkcmF3ZXIuc2hvdWxkU3RyZXRjaERyYXdlciA9ICFkcmF3ZXIuc2hvdWxkU3RyZXRjaERyYXdlcjtcbi8vICAgICAgICAgYnJlYWs7XG4vLyAgICAgICBjYXNlIDI6XG4vLyAgICAgICAgIGRyYXdlci50b2dnbGVMZWZ0V2luZG93KCk7XG4vLyAgICAgICAgIGJyZWFrO1xuLy8gICAgICAgY2FzZSAzOlxuLy8gICAgICAgICB2YXIgbmV3V2luID0gb3Blbk5ld05hdldpbmRvdygpO1xuLy8gICAgICAgICBkcmF3ZXIuY2VudGVyV2luZG93ID0gbmV3V2luO1xuLy8gICAgICAgICBkcmF3ZXIudG9nZ2xlTGVmdFdpbmRvdygpO1xuLy8gICAgICAgICBicmVhaztcbi8vICAgICAgIGNhc2UgNDpcbi8vICAgICAgICAgZHJhd2VyLmNlbnRlcldpbmRvdyA9IGNyZWF0ZUNlbnRlck5hdldpbmRvdygpO1xuLy8gICAgICAgICBkcmF3ZXIudG9nZ2xlTGVmdFdpbmRvdygpO1xuLy8gICAgICAgICBicmVhaztcbi8vICAgICAgIGNhc2UgNTpcbi8vICAgICAgICAgZHJhd2VyLnJpZ2h0V2luZG93ID0gZmFsc2U7XG4vLyAgICAgICAgIGRyYXdlci50b2dnbGVMZWZ0V2luZG93KCk7XG4vLyAgICAgICAgIGJyZWFrO1xuLy8gICAgIH1cbi8vICAgfSk7XG5cbi8vICAgd2luLmFkZCh0YWJsZVZpZXcpO1xuLy8gICByZXR1cm4gd2luO1xuLy8gfVxuXG5cbi8vIGZ1bmN0aW9uIG9wZW5OZXdOYXZXaW5kb3coKSB7XG4vLyAgIHZhciBsZWZ0QnRuID0gVGkuVUkuY3JlYXRlQnV0dG9uKHtcbi8vICAgICB0aXRsZTogJ0xlZnQnXG4vLyAgIH0pO1xuLy8gICBsZWZ0QnRuLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgZnVuY3Rpb24oKSB7XG4vLyAgICAgZHJhd2VyLnRvZ2dsZUxlZnRXaW5kb3coKTtcbi8vICAgfSk7XG4vLyAgIHZhciB3aW4gPSBUaS5VSS5jcmVhdGVXaW5kb3coe1xuLy8gICAgIGJhY2tncm91bmRDb2xvcjogJyMyMjInLFxuLy8gICAgIHRyYW5zbHVjZW50OiB0cnVlLFxuLy8gICAgIGV4dGVuZEVkZ2VzOiBbVGkuVUkuRVhURU5EX0VER0VfVE9QXSxcbi8vICAgICB0aXRsZTogJ05ldyBOYXYgV2luZG93Jyxcbi8vICAgICBiYXJDb2xvcjogJyNGRkEnLFxuLy8gICAgIHRpbnRDb2xvcjogJ3llbGxvdycsXG4vLyAgICAgbGVmdE5hdkJ1dHRvbjogbGVmdEJ0blxuLy8gICB9KTtcblxuLy8gICB2YXIgc2Nyb2xsVmlldyA9IFRpLlVJLmNyZWF0ZVNjcm9sbFZpZXcoe1xuLy8gICAgIGxheW91dDogJ3ZlcnRpY2FsJyxcbi8vICAgICBsZWZ0OiAwLFxuLy8gICAgIHJpZ2h0OiAwLFxuLy8gICAgIGNvbnRlbnRIZWlnaHQ6ICdhdXRvJyxcbi8vICAgICBjb250ZW50V2lkdGg6ICcxMDAlJyxcbi8vICAgICBzaG93VmVydGljYWxTY3JvbGxJbmRpY2F0b3I6IHRydWUsXG4vLyAgICAgc2hvd0hvcml6b250YWxTY3JvbGxJbmRpY2F0b3I6IGZhbHNlXG4vLyAgIH0pO1xuXG4vLyAgIGZvciAodmFyIGkgPSAwOyBpIDwgMjA7IGkrKykge1xuLy8gICAgIHZhciBsYWJlbCA9IFRpLlVJLmNyZWF0ZUxhYmVsKHtcbi8vICAgICAgIHRvcDogMzAsXG4vLyAgICAgICB0ZXh0OiAnaU9TNyBpcyB0aGUgbmV3IGJsYWNrJyxcbi8vICAgICAgIGNvbG9yOiAnI0ZGRicsXG4vLyAgICAgICBmb250OiB7XG4vLyAgICAgICAgIGZvbnRTaXplOiAyMFxuLy8gICAgICAgfVxuLy8gICAgIH0pO1xuLy8gICAgIHNjcm9sbFZpZXcuYWRkKGxhYmVsKTtcbi8vICAgfVxuLy8gICB3aW4uYWRkKHNjcm9sbFZpZXcpO1xuLy8gICB2YXIgbmF2Q29udHJvbGxlciA9IFRpLlVJLmNyZWF0ZU5hdmlnYXRpb25XaW5kb3coe1xuLy8gICAgIHdpbmRvdzogd2luXG4vLyAgIH0pO1xuLy8gICByZXR1cm4gbmF2Q29udHJvbGxlcjtcbi8vIH1cblxuXG4vLyBmdW5jdGlvbiBjcmVhdGVDZW50ZXJOYXZXaW5kb3coKSB7XG4vLyAgIHZhciBsZWZ0QnRuID0gVGkuVUkuY3JlYXRlQnV0dG9uKHtcbi8vICAgICB0aXRsZTogJ0xlZnQnXG4vLyAgIH0pO1xuLy8gICBsZWZ0QnRuLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgZnVuY3Rpb24oKSB7XG4vLyAgICAgZHJhd2VyLnRvZ2dsZUxlZnRXaW5kb3coKTtcbi8vICAgfSk7XG4vLyAgIHZhciByaWdodEJ0biA9IFRpLlVJLmNyZWF0ZUJ1dHRvbih7XG4vLyAgICAgdGl0bGU6ICdSaWdodCdcbi8vICAgfSk7XG4vLyAgIHJpZ2h0QnRuLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgZnVuY3Rpb24oKSB7XG4vLyAgICAgZHJhd2VyLnRvZ2dsZVJpZ2h0V2luZG93KCk7XG4vLyAgIH0pO1xuXG4vLyAgIHZhciB3aW4gPSBUaS5VSS5jcmVhdGVXaW5kb3coe1xuLy8gICAgIGJhY2tncm91bmRDb2xvcjogJyNlZWUnLFxuLy8gICAgIHRyYW5zbHVjZW50OiBmYWxzZSxcbi8vICAgICB0aXRsZTogJ05hcHBEcmF3ZXInLFxuLy8gICAgIGJhckNvbG9yOiAnI2NhMjEyNycsXG4vLyAgICAgdGludENvbG9yOiAnI2NhMjEyNycsXG4vLyAgICAgbmF2VGludENvbG9yOiAnI2ZmZicsXG4vLyAgICAgdGl0bGVBdHRyaWJ1dGVzOiB7XG4vLyAgICAgICBjb2xvcjogJyNmZmYnXG4vLyAgICAgfSxcbi8vICAgICBsZWZ0TmF2QnV0dG9uOiBsZWZ0QnRuLFxuLy8gICAgIHJpZ2h0TmF2QnV0dG9uOiByaWdodEJ0blxuLy8gICB9KTtcblxuLy8gICB2YXIgY2xvc2VHZXN0dXJlTW9kZSA9IDE7XG4vLyAgIHZhciBjbG9zZUdlc3R1cmVNb2RlQnRuID0gVGkuVUkuY3JlYXRlQnV0dG9uKHtcbi8vICAgICB0aXRsZTogJ2Nsb3NlR2VzdHVyZU1vZGU6IEFMTCcsXG4vLyAgICAgd2lkdGg6IDMwMCxcbi8vICAgICB0b3A6IDgwXG4vLyAgIH0pO1xuXG4vLyAgIGNsb3NlR2VzdHVyZU1vZGVCdG4uYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCBmdW5jdGlvbihlKSB7XG4vLyAgICAgaWYgKGNsb3NlR2VzdHVyZU1vZGUgPT0gMikge1xuLy8gICAgICAgY2xvc2VHZXN0dXJlTW9kZSA9IDA7XG4vLyAgICAgfSBlbHNlIHtcbi8vICAgICAgIGNsb3NlR2VzdHVyZU1vZGUrKztcbi8vICAgICB9XG4vLyAgICAgc3dpdGNoIChjbG9zZUdlc3R1cmVNb2RlKSB7XG4vLyAgICAgICBjYXNlIDA6XG4vLyAgICAgICAgIGRyYXdlci5jbG9zZURyYXdlckdlc3R1cmVNb2RlID0gTmFwcERyYXdlck1vZHVsZS5DTE9TRV9NT0RFX1RBUF9DRU5URVJXSU5ET1c7XG4vLyAgICAgICAgIGNsb3NlR2VzdHVyZU1vZGVCdG4udGl0bGUgPSAnY2xvc2VHZXN0dXJlOiBUYXAgQ2VudGVyJztcbi8vICAgICAgICAgYnJlYWs7XG4vLyAgICAgICBjYXNlIDE6XG4vLyAgICAgICAgIGRyYXdlci5jbG9zZURyYXdlckdlc3R1cmVNb2RlID0gTmFwcERyYXdlck1vZHVsZS5DTE9TRV9NT0RFX0FMTDtcbi8vICAgICAgICAgY2xvc2VHZXN0dXJlTW9kZUJ0bi50aXRsZSA9ICdjbG9zZUdlc3R1cmU6IEFMTCc7XG4vLyAgICAgICAgIGJyZWFrO1xuLy8gICAgICAgY2FzZSAyOlxuLy8gICAgICAgICBkcmF3ZXIuY2xvc2VEcmF3ZXJHZXN0dXJlTW9kZSA9IE5hcHBEcmF3ZXJNb2R1bGUuQ0xPU0VfTU9ERV9QQU5OSU5HX05BVkJBUjtcbi8vICAgICAgICAgY2xvc2VHZXN0dXJlTW9kZUJ0bi50aXRsZSA9ICdjbG9zZUdlc3R1cmU6IE5BVkJBUic7XG4vLyAgICAgICAgIGJyZWFrO1xuLy8gICAgIH1cbi8vICAgfSk7XG4vLyAgIHdpbi5hZGQoY2xvc2VHZXN0dXJlTW9kZUJ0bik7XG5cblxuLy8gICB2YXIgYW5pbWF0aW9uTW9kZSA9IDA7XG4vLyAgIHZhciBhbmltYXRpb25Nb2RlQnRuID0gVGkuVUkuY3JlYXRlQnV0dG9uKHtcbi8vICAgICB0aXRsZTogJ2FuaW1hdGlvbjogTk9ORScsXG4vLyAgICAgd2lkdGg6IDMwMCxcbi8vICAgICB0b3A6IDE0MFxuLy8gICB9KTtcbi8vICAgYW5pbWF0aW9uTW9kZUJ0bi5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsIGZ1bmN0aW9uKGUpIHtcbi8vICAgICBpZiAoYW5pbWF0aW9uTW9kZSA9PSA1KSB7XG4vLyAgICAgICBhbmltYXRpb25Nb2RlID0gMDtcbi8vICAgICB9IGVsc2Uge1xuLy8gICAgICAgYW5pbWF0aW9uTW9kZSsrO1xuLy8gICAgIH1cbi8vICAgICBzd2l0Y2ggKGFuaW1hdGlvbk1vZGUpIHtcbi8vICAgICAgIGNhc2UgMDpcbi8vICAgICAgICAgZHJhd2VyLmFuaW1hdGlvbk1vZGUgPSBOYXBwRHJhd2VyTW9kdWxlLkFOSU1BVElPTl9OT05FO1xuLy8gICAgICAgICBhbmltYXRpb25Nb2RlQnRuLnRpdGxlID0gJ2FuaW1hdGlvbjogTm9uZSc7XG4vLyAgICAgICAgIGJyZWFrO1xuLy8gICAgICAgY2FzZSAxOlxuLy8gICAgICAgICBkcmF3ZXIuYW5pbWF0aW9uTW9kZSA9IE5hcHBEcmF3ZXJNb2R1bGUuQU5JTUFUSU9OX1BBUkFMTEFYX0ZBQ1RPUl8zO1xuLy8gICAgICAgICBhbmltYXRpb25Nb2RlQnRuLnRpdGxlID0gJ2FuaW1hdGlvbjogUGFyYWxsYXggZmFjdG9yIDMnO1xuLy8gICAgICAgICBicmVhaztcbi8vICAgICAgIGNhc2UgMjpcbi8vICAgICAgICAgZHJhd2VyLmFuaW1hdGlvbk1vZGUgPSBOYXBwRHJhd2VyTW9kdWxlLkFOSU1BVElPTl9QQVJBTExBWF9GQUNUT1JfNztcbi8vICAgICAgICAgYW5pbWF0aW9uTW9kZUJ0bi50aXRsZSA9ICdhbmltYXRpb246IFBhcmFsbGF4IGZhY3RvciA3Jztcbi8vICAgICAgICAgYnJlYWs7XG4vLyAgICAgICBjYXNlIDM6XG4vLyAgICAgICAgIGRyYXdlci5hbmltYXRpb25Nb2RlID0gTmFwcERyYXdlck1vZHVsZS5BTklNQVRJT05fRkFERTtcbi8vICAgICAgICAgYW5pbWF0aW9uTW9kZUJ0bi50aXRsZSA9ICdhbmltYXRpb246IEZhZGUnO1xuLy8gICAgICAgICBicmVhaztcbi8vICAgICAgIGNhc2UgNDpcbi8vICAgICAgICAgZHJhd2VyLmFuaW1hdGlvbk1vZGUgPSBOYXBwRHJhd2VyTW9kdWxlLkFOSU1BVElPTl9TTElERTtcbi8vICAgICAgICAgYW5pbWF0aW9uTW9kZUJ0bi50aXRsZSA9ICdhbmltYXRpb246IFNsaWRlJztcbi8vICAgICAgICAgYnJlYWs7XG4vLyAgICAgICBjYXNlIDU6XG4vLyAgICAgICAgIGRyYXdlci5hbmltYXRpb25Nb2RlID0gTmFwcERyYXdlck1vZHVsZS5BTklNQVRJT05fU0xJREVfU0NBTEU7XG4vLyAgICAgICAgIGFuaW1hdGlvbk1vZGVCdG4udGl0bGUgPSAnYW5pbWF0aW9uOiBTbGlkZSAmIFNjYWxlJztcbi8vICAgICAgICAgYnJlYWs7XG4vLyAgICAgfVxuLy8gICB9KTtcbi8vICAgd2luLmFkZChhbmltYXRpb25Nb2RlQnRuKTtcblxuXG4vLyAgIHZhciBzbGlkZXIgPSBUaS5VSS5jcmVhdGVTbGlkZXIoe1xuLy8gICAgIHRvcDogMjgwLFxuLy8gICAgIG1pbjogNTAsXG4vLyAgICAgbWF4OiAyODAsXG4vLyAgICAgd2lkdGg6IDI4MCxcbi8vICAgICB2YWx1ZTogMjAwXG4vLyAgIH0pO1xuLy8gICB2YXIgbGFiZWwgPSBUaS5VSS5jcmVhdGVMYWJlbCh7XG4vLyAgICAgdGV4dDogJ0xlZnQgRHJhd2VyIFdpZHRoOiAnICsgc2xpZGVyLnZhbHVlLFxuLy8gICAgIHRvcDogMjUwXG4vLyAgIH0pO1xuLy8gICBzbGlkZXIuYWRkRXZlbnRMaXN0ZW5lcigndG91Y2hlbmQnLCBmdW5jdGlvbihlKSB7XG4vLyAgICAgdmFyIHZhbHVlID0gTWF0aC5yb3VuZChlLnZhbHVlKTtcbi8vICAgICBsYWJlbC50ZXh0ID0gJ0xlZnQgRHJhd2VyIFdpZHRoOiAnICsgdmFsdWU7XG4vLyAgICAgZHJhd2VyLmxlZnREcmF3ZXJXaWR0aCA9IHZhbHVlO1xuLy8gICB9KTtcbi8vICAgd2luLmFkZChsYWJlbCk7XG4vLyAgIHdpbi5hZGQoc2xpZGVyKTtcblxuLy8gICB2YXIgbmF2Q29udHJvbGxlciA9IFRpLlVJLmNyZWF0ZU5hdmlnYXRpb25XaW5kb3coe1xuLy8gICAgIHdpbmRvdzogd2luXG4vLyAgIH0pO1xuLy8gICByZXR1cm4gbmF2Q29udHJvbGxlcjtcbi8vIH1cblxuLy8gdmFyIG1haW5XaW5kb3cgPSBjcmVhdGVDZW50ZXJOYXZXaW5kb3coKTtcblxuLy8gdmFyIGRyYXdlciA9IE5hcHBEcmF3ZXJNb2R1bGUuY3JlYXRlRHJhd2VyKHtcbi8vICAgbGVmdFdpbmRvdzogY3JlYXRlQVBJRXhhbXBsZVdpbmRvdygpLFxuLy8gICBjZW50ZXJXaW5kb3c6IG1haW5XaW5kb3csXG4vLyAgIHJpZ2h0V2luZG93OiBUaS5VSS5jcmVhdGVXaW5kb3coe1xuLy8gICAgIGJhY2tncm91bmRDb2xvcjogJyNGRkYnXG4vLyAgIH0pLFxuLy8gICBjbG9zZURyYXdlckdlc3R1cmVNb2RlOiBOYXBwRHJhd2VyTW9kdWxlLkNMT1NFX01PREVfQUxMLFxuLy8gICBvcGVuRHJhd2VyR2VzdHVyZU1vZGU6IE5hcHBEcmF3ZXJNb2R1bGUuT1BFTl9NT0RFX0FMTCxcbi8vICAgc2hvd1NoYWRvdzogZmFsc2UsIC8vbm8gc2hhZG93IGluIGlPUzdcbi8vICAgbGVmdERyYXdlcldpZHRoOiAyMDAsXG4vLyAgIHJpZ2h0RHJhd2VyV2lkdGg6IDEyMCxcbi8vICAgc3RhdHVzQmFyU3R5bGU6IE5hcHBEcmF3ZXJNb2R1bGUuU1RBVFVTQkFSX1dISVRFLCAvLyByZW1lbWJlciB0byBzZXQgVUlWaWV3Q29udHJvbGxlckJhc2VkU3RhdHVzQmFyQXBwZWFyYW5jZSB0byBmYWxzZSBpbiB0aWFwcC54bWxcbi8vICAgb3JpZW50YXRpb25Nb2RlczogW1RpLlVJLlBPUlRSQUlULCBUaS5VSS5VUFNJREVfUE9SVFJBSVRdXG4vLyB9KTtcblxuLy8gZHJhd2VyLmFkZEV2ZW50TGlzdGVuZXIoJ2NlbnRlcldpbmRvd0RpZEZvY3VzJywgZnVuY3Rpb24oKSB7XG4vLyAgIFRpLkFQSS5pbmZvKCdDZW50ZXIgZGlkIGZvY3VzIScpO1xuLy8gfSk7XG5cbi8vIGRyYXdlci5hZGRFdmVudExpc3RlbmVyKCdjZW50ZXJXaW5kb3dEaWRCbHVyJywgZnVuY3Rpb24oKSB7XG4vLyAgIFRpLkFQSS5pbmZvKCdDZW50ZXIgZGlkIGJsdXIhJyk7XG4vLyB9KTtcblxuLy8gZHJhd2VyLmFkZEV2ZW50TGlzdGVuZXIoJ3dpbmRvd0RpZE9wZW4nLCBmdW5jdGlvbihlKSB7XG4vLyAgIFRpLkFQSS5pbmZvKCd3aW5kb3dEaWRPcGVuJyk7XG4vLyB9KTtcblxuLy8gZHJhd2VyLmFkZEV2ZW50TGlzdGVuZXIoJ3dpbmRvd0RpZENsb3NlJywgZnVuY3Rpb24oZSkge1xuLy8gICBUaS5BUEkuaW5mbygnd2luZG93RGlkQ2xvc2UnKTtcbi8vIH0pO1xuXG4vLyBkcmF3ZXIub3BlbigpO1xuXG4vLyBUaS5BUEkuaW5mbygnaXNBbnlXaW5kb3dPcGVuOiAnICsgZHJhd2VyLmlzQW55V2luZG93T3BlbigpKTtcblxuXG5cblxuXG5cbi8qXG5UaVNESzogMTMuMS4wLkdBXG5SZXF1aXJlZCBNb2R1bGU6XG5MaW5rOiBodHRwczovL2dpdGh1Yi5jb20vbWJlbmRlcjc0L05hcHBEcmF3ZXJcbkluY2x1ZGU6IDxtb2R1bGUgcGxhdGZvcm09XCJpcGhvbmVcIiB2ZXJzaW9uPVwiMi4yLjdcIj5kay5uYXBwLmRyYXdlcjwvbW9kdWxlPlxuKi9cblxuLy8gY29uc3QgTmFwcERyYXdlck1vZHVsZSA9IHJlcXVpcmUoJ2RrLm5hcHAuZHJhd2VyJyk7XG5cbi8vIGNvbnN0IGRyYXdlciA9IE5hcHBEcmF3ZXJNb2R1bGUuY3JlYXRlRHJhd2VyKHtcbi8vIFx0d2lkdGg6IFRpLlBsYXRmb3JtLmRpc3BsYXlDYXBzLnBsYXRmb3JtV2lkdGgsXG4vLyBcdG9yaWVudGF0aW9uTW9kZXM6IFtUaS5VSS5QT1JUUkFJVF0sXG4vLyBcdGJhY2tncm91bmRDb2xvcjogJyMwMDAwMDAnLFxuLy8gXHRhbmltYXRpb25Nb2RlOiBOYXBwRHJhd2VyTW9kdWxlLkFOSU1BVElPTl9TTElERSxcbi8vIFx0Y2xvc2VEcmF3ZXJHZXN0dXJlTW9kZTogTmFwcERyYXdlck1vZHVsZS5DTE9TRV9NT0RFX0FMTCxcbi8vIFx0b3BlbkRyYXdlckdlc3R1cmVNb2RlOiBOYXBwRHJhd2VyTW9kdWxlLk9QRU5fTU9ERV9BTEwsXG4vLyBcdHNob3VsZFN0cmV0Y2hEcmF3ZXI6IGZhbHNlLFxuLy8gXHRzaG93U2hhZG93OiBmYWxzZSxcbi8vIFx0YW5pbWF0aW9uVmVsb2NpdHk6IDEzMDAsXG4vLyBcdGxlZnREcmF3ZXJXaWR0aDogVGkuUGxhdGZvcm0uZGlzcGxheUNhcHMucGxhdGZvcm1XaWR0aCxcbi8vIFx0cmlnaHREcmF3ZXJXaWR0aDogVGkuUGxhdGZvcm0uZGlzcGxheUNhcHMucGxhdGZvcm1XaWR0aFxuLy8gfSk7XG5cbi8vIC8vIENyZWF0ZSBEcmF3ZXJzXG4vLyBjb25zdCBsZWZ0RHJhd2VyV2luZG93ID0gVGkuVUkuY3JlYXRlV2luZG93KHtcbi8vIFx0dGl0bGU6ICdMZWZ0IERyYXdlcicsXG4vLyBcdGJhY2tncm91bmRDb2xvcjogJyNGRkZGRkYnXG4vLyB9KTtcblxuLy8gY29uc3QgbGVmdERyYXdlciA9IFRpLlVJLmNyZWF0ZU5hdmlnYXRpb25XaW5kb3coe1xuLy8gXHR3aW5kb3c6IGxlZnREcmF3ZXJXaW5kb3dcbi8vIH0pO1xuXG4vLyBjb25zdCByaWdodERyYXdlcldpbmRvdyA9IFRpLlVJLmNyZWF0ZVdpbmRvdyh7XG4vLyBcdHRpdGxlOiAnUmlnaHQgRHJhd2VyJyxcbi8vIFx0YmFja2dyb3VuZENvbG9yOiAnI0ZGRkZGRidcbi8vIH0pO1xuXG4vLyBjb25zdCByaWdodERyYXdlciA9IFRpLlVJLmNyZWF0ZU5hdmlnYXRpb25XaW5kb3coe1xuLy8gXHR3aW5kb3c6IHJpZ2h0RHJhd2VyV2luZG93XG4vLyB9KTtcblxuLy8gY29uc3Qgd2luMSA9IFRpLlVJLmNyZWF0ZVdpbmRvdyh7XG4vLyBcdGJhY2tncm91bmRDb2xvcjogJ2JsdWUnLFxuLy8gXHR0aXRsZTogJ0JsdWUnXG4vLyB9KTtcbi8vIHdpbjEuYWRkKFRpLlVJLmNyZWF0ZUxhYmVsKHsgdGV4dDogJ0kgYW0gYSBibHVlIHdpbmRvdy4nIH0pKTtcblxuLy8gY29uc3Qgd2luMiA9IFRpLlVJLmNyZWF0ZVdpbmRvdyh7XG4vLyBcdGJhY2tncm91bmRDb2xvcjogJ3JlZCcsXG4vLyBcdHRpdGxlOiAnUmVkJ1xuLy8gfSk7XG4vLyB3aW4yLmFkZChUaS5VSS5jcmVhdGVMYWJlbCh7IHRleHQ6ICdJIGFtIGEgcmVkIHdpbmRvdy4nIH0pKTtcblxuLy8gY29uc3QgdGFiMSA9IFRpLlVJLmNyZWF0ZVRhYih7XG4vLyBcdFx0d2luZG93OiB3aW4xLFxuLy8gXHRcdHRpdGxlOiAnQmx1ZSdcbi8vIFx0fSksXG4vLyBcdHRhYjIgPSBUaS5VSS5jcmVhdGVUYWIoe1xuLy8gXHRcdHdpbmRvdzogd2luMixcbi8vIFx0XHR0aXRsZTogJ1JlZCdcbi8vIFx0fSksXG4vLyBcdHRhYkdyb3VwID0gVGkuVUkuY3JlYXRlVGFiR3JvdXAoe1xuLy8gXHRcdHRhYnM6IFt0YWIxLCB0YWIyXVxuLy8gXHR9KTtcblxuLy8gLy8gT3BlbiBvdXIgVGFiR3JvdXAgKGNyYXNoZXMgd2l0aCBvciB3aXRob3V0IG9wZW5pbmcpXG4vLyAvLyB0YWJHcm91cC5vcGVuKCk7XG5cbi8vIC8vIC0tLSBTZXQgZHJhd2VyIFdpbmRvd3MgLS0tXG4vLyBkcmF3ZXIubGVmdFdpbmRvdyA9IGxlZnREcmF3ZXI7XG4vLyBkcmF3ZXIucmlnaHRXaW5kb3cgPSByaWdodERyYXdlcjtcbi8vIGRyYXdlci5jZW50ZXJXaW5kb3cgPSB0YWJHcm91cDtcblxuLy8gLy8gT3BlbiB0aGUgZHJhd2VyXG4vLyBkcmF3ZXIub3BlbigpO1xuXG4vLyAvLyBTaG91bGQgY3Jhc2ggd2l0aCB0aGUgZXJyb3IgcmVwb3J0ZWQgYXQgdGhlIGxpbmsgYmVsb3c6XG4vLyAvLyBodHRwczovL2dpdGh1Yi5jb20vdGlkZXYvdGl0YW5pdW0tc2RrL3B1bGwvMTQzOTcjaXNzdWVjb21tZW50LTM5NTY0Mjg5ODJcblxuXG5cblxuXG4vKlxuVGlTREs6IDEzLjIuMC5HQSAod2l0aCBQUiBwYXRjaCAjMTQ0NTApXG5SZXF1aXJlZCBNb2R1bGU6XG5MaW5rOiBodHRwczovL2dpdGh1Yi5jb20vbWJlbmRlcjc0L05hcHBEcmF3ZXJcbkluY2x1ZGU6IDxtb2R1bGUgcGxhdGZvcm09XCJpcGhvbmVcIiB2ZXJzaW9uPVwiMy4xLjFcIj5kay5uYXBwLmRyYXdlcjwvbW9kdWxlPlxuKi9cblxuLy8gY29uc3QgTmFwcERyYXdlck1vZHVsZSA9IHJlcXVpcmUoJ2RrLm5hcHAuZHJhd2VyJyk7XG4vLyB2YXIgZHJhd2VyID0gbnVsbDtcblxuLy8gZnVuY3Rpb24gY3JlYXRlRHJhd2VyKCkge1xuLy8gXHRkcmF3ZXIgPSBOYXBwRHJhd2VyTW9kdWxlLmNyZWF0ZURyYXdlcih7XG4vLyBcdFx0d2lkdGg6IFRpLlBsYXRmb3JtLmRpc3BsYXlDYXBzLnBsYXRmb3JtV2lkdGgsXG4vLyBcdFx0b3JpZW50YXRpb25Nb2RlczogW1RpLlVJLlBPUlRSQUlUXSxcbi8vIFx0XHRiYWNrZ3JvdW5kQ29sb3I6ICdyZWQnLFxuLy8gXHRcdGFuaW1hdGlvbk1vZGU6IE5hcHBEcmF3ZXJNb2R1bGUuQU5JTUFUSU9OX1NMSURFLFxuLy8gXHRcdGNsb3NlRHJhd2VyR2VzdHVyZU1vZGU6IE5hcHBEcmF3ZXJNb2R1bGUuQ0xPU0VfTU9ERV9BTEwsXG4vLyBcdFx0b3BlbkRyYXdlckdlc3R1cmVNb2RlOiBOYXBwRHJhd2VyTW9kdWxlLk9QRU5fTU9ERV9BTEwsXG4vLyBcdFx0c2hvdWxkU3RyZXRjaERyYXdlcjogZmFsc2UsXG4vLyBcdFx0c2hvd1NoYWRvdzogZmFsc2UsXG4vLyBcdFx0YW5pbWF0aW9uVmVsb2NpdHk6IDEzMDAsXG4vLyBcdFx0bGVmdERyYXdlcldpZHRoOiBUaS5QbGF0Zm9ybS5kaXNwbGF5Q2Fwcy5wbGF0Zm9ybVdpZHRoLFxuLy8gXHRcdHJpZ2h0RHJhd2VyV2lkdGg6IFRpLlBsYXRmb3JtLmRpc3BsYXlDYXBzLnBsYXRmb3JtV2lkdGhcbi8vIFx0fSk7XG5cbi8vIFx0Ly8gQ3JlYXRlIERyYXdlcnNcbi8vIFx0Y29uc3QgbGVmdERyYXdlcldpbmRvdyA9IFRpLlVJLmNyZWF0ZVdpbmRvdyh7IHRpdGxlOiAnTGVmdCBEcmF3ZXInLCBiYWNrZ3JvdW5kQ29sb3I6ICd5ZWxsb3cnLCBleHRlbmRTYWZlQXJlYTogdHJ1ZSwgZXh0ZW5kRWRnZXM6IFsxLCA0XSB9KTtcbi8vIFx0Y29uc3QgbGVmdERyYXdlciA9IFRpLlVJLmNyZWF0ZU5hdmlnYXRpb25XaW5kb3coeyB3aW5kb3c6IGxlZnREcmF3ZXJXaW5kb3cgfSk7XG5cbi8vIFx0Y29uc3QgcmlnaHREcmF3ZXJXaW5kb3cgPSBUaS5VSS5jcmVhdGVXaW5kb3coeyB0aXRsZTogJ1JpZ2h0IERyYXdlcicsIGJhY2tncm91bmRDb2xvcjogJ2dyZWVuJywgZXh0ZW5kU2FmZUFyZWE6IHRydWUsIGV4dGVuZEVkZ2VzOiBbMSwgNF0gfSk7XG4vLyBcdGNvbnN0IHJpZ2h0RHJhd2VyID0gVGkuVUkuY3JlYXRlTmF2aWdhdGlvbldpbmRvdyh7IHdpbmRvdzogcmlnaHREcmF3ZXJXaW5kb3cgfSk7XG5cbi8vIFx0Y29uc3Qgd2luMSA9IFRpLlVJLmNyZWF0ZVdpbmRvdyh7IGJhY2tncm91bmRDb2xvcjogJ2JsdWUnLCB0aXRsZTogJ1RhYiAxJywgZXh0ZW5kU2FmZUFyZWE6IHRydWUsIGV4dGVuZEVkZ2VzOiBbMSwgNF0sIHRpdGxlQXR0cmlidXRlczogeyBjb2xvcjogJ3doaXRlJywgZm9udDogeyBmb250U2l6ZTogMTcsIGZvbnRXZWlnaHQ6ICdib2xkJyB9IH0gfSk7XG4vLyBcdGNvbnN0IHdpbjFDb250YWluZXIgPSBUaS5VSS5jcmVhdGVWaWV3KHsgbGF5b3V0OiAndmVydGljYWwnLCBoZWlnaHQ6IFRpLlVJLlNJWkUsIHdpZHRoOiBUaS5VSS5GSUxMIH0pO1xuLy8gXHR3aW4xLmFkZCh3aW4xQ29udGFpbmVyKTtcblxuLy8gXHRjb25zdCB3aW4xTGFiZWwgPSBUaS5VSS5jcmVhdGVMYWJlbCh7IHRleHQ6ICfirIXvuI8gc3dpcGUgdG8gb3BlbiBkcmF3ZXJzIOKeoe+4jycsIGNvbG9yOiAnd2hpdGUnLCBmb250OiB7IGZvbnRTaXplOiAyMCwgZm9udFdlaWdodDogJ2JvbGQnIH0sIHRvcDogMCB9KTtcbi8vIFx0d2luMUNvbnRhaW5lci5hZGQod2luMUxhYmVsKTtcblxuLy8gXHQvLyBDcmVhdGUgRHJhd2VyIENsb3NlIEJ1dHRvblxuLy8gXHRjb25zdCBjbG9zZUJ1dHRvbiA9IFRpLlVJLmNyZWF0ZUJ1dHRvbih7IHRpdGxlOiAnQ2xvc2UgRHJhd2VyJywgYmFja2dyb3VuZENvbG9yOiAnd2hpdGUnLCB0aW50Q29sb3I6ICdibGFjaycsIGZvbnQ6IHsgZm9udFNpemU6IDIwLCBmb250V2VpZ2h0OiAnYm9sZCcgfSwgd2lkdGg6ICc1MCUnLCBoZWlnaHQ6IDQ0LCBib3JkZXJSYWRpdXM6IDEwLCB0b3A6IDU2IH0pO1xuLy8gXHRjbG9zZUJ1dHRvbi5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsICgpID0+IHtcbi8vIFx0XHRjbG9zZURyYXdlcigpO1xuLy8gXHR9KTtcbi8vIFx0d2luMUNvbnRhaW5lci5hZGQoY2xvc2VCdXR0b24pO1xuXG4vLyBcdGNvbnN0IHdpbjIgPSBUaS5VSS5jcmVhdGVXaW5kb3coeyBiYWNrZ3JvdW5kQ29sb3I6ICd5ZWxsb3cnLCB0aXRsZTogJ1RhYiAyJywgZXh0ZW5kU2FmZUFyZWE6IHRydWUsIGV4dGVuZEVkZ2VzOiBbMSwgNF0sIHRpdGxlQXR0cmlidXRlczogeyBmb250OiB7IGZvbnRTaXplOiAxNywgZm9udFdlaWdodDogJ2JvbGQnIH0gfSB9KTtcbi8vIFx0d2luMi5hZGQoVGkuVUkuY3JlYXRlTGFiZWwoeyB0ZXh0OiAnSSBhbSBqdXN0IGEgbG9uZWx5IHllbGxvdyB3aW5kb3cuJywgZm9udDogeyBmb250U2l6ZTogMTMsIGZvbnRXZWlnaHQ6ICdib2xkJyB9IH0pKTtcblxuLy8gXHRjb25zdCB0YWIxID0gVGkuVUkuY3JlYXRlVGFiKHsgd2luZG93OiB3aW4xLCB0aXRsZTogJ0JsdWUnIH0pLFxuLy8gXHRcdHRhYjIgPSBUaS5VSS5jcmVhdGVUYWIoeyB3aW5kb3c6IHdpbjIsIHRpdGxlOiAnWWVsbG93JyB9KSxcbi8vIFx0XHR0YWJHcm91cCA9IFRpLlVJLmNyZWF0ZVRhYkdyb3VwKHsgdGFiczogW3RhYjEsIHRhYjJdIH0pO1xuXG4vLyBcdC8vIE9wZW4gb3VyIFRhYkdyb3VwICh3b3JrcyB3aXRoIG9yIHdpdGhvdXQgY2FsbGluZyBvcGVuKVxuLy8gXHQvLyB0YWJHcm91cC5vcGVuKCk7XG5cbi8vIFx0Ly8gU2V0IGRyYXdlciBXaW5kb3dzXG4vLyBcdGRyYXdlci5sZWZ0V2luZG93ID0gbGVmdERyYXdlcjtcbi8vIFx0ZHJhd2VyLnJpZ2h0V2luZG93ID0gcmlnaHREcmF3ZXI7XG4vLyBcdGRyYXdlci5jZW50ZXJXaW5kb3cgPSB0YWJHcm91cDtcblxuLy8gXHQvLyBPcGVuIHRoZSBkcmF3ZXJcbi8vIFx0ZHJhd2VyLm9wZW4oKTtcbi8vIH1cblxuLy8gZnVuY3Rpb24gY2xvc2VEcmF3ZXIoKSB7XG4vLyBcdGRyYXdlci5jbG9zZSgpO1xuLy8gXHRkcmF3ZXIgPSBudWxsO1xuXG4vLyBcdC8vIE9wZW4gTGFuZGluZyBTY3JlZW5cbi8vIFx0Y3JlYXRlTGFuZGluZ1NjcmVlbigpO1xuLy8gfVxuXG4vLyBmdW5jdGlvbiBjcmVhdGVMYW5kaW5nU2NyZWVuKCkge1xuLy8gXHRjb25zdCB3aW4gPSBUaS5VSS5jcmVhdGVXaW5kb3coeyBiYWNrZ3JvdW5kQ29sb3I6ICcjRkZGRkZGJywgZXh0ZW5kU2FmZUFyZWE6IHRydWUsIGV4dGVuZEVkZ2VzOiBbMSwgNF0gfSk7XG5cbi8vIFx0Ly8gT3BlbiBEcmF3ZXIgQnV0dG9uXG4vLyBcdGNvbnN0IG9wZW5EcmF3ZXJCdXR0b24gPSBUaS5VSS5jcmVhdGVCdXR0b24oeyB0aXRsZTogJ09wZW4gRHJhd2VyJywgZm9udDogeyBmb250U2l6ZTogMjAsIGZvbnRXZWlnaHQ6ICdib2xkJyB9IH0pO1xuLy8gXHQvLyBDbGljayBFdmVudCB0byBPcGVuIERyYXdlclxuLy8gXHRvcGVuRHJhd2VyQnV0dG9uLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgKCkgPT4ge1xuLy8gXHRcdHdpbi5jbG9zZSgpO1xuLy8gXHRcdGNyZWF0ZURyYXdlcigpO1xuLy8gXHR9KTtcbi8vIFx0d2luLmFkZChvcGVuRHJhd2VyQnV0dG9uKTtcblxuLy8gXHQvLyBPcGVuIHRoZSBMYW5kaW5nIFNjcmVlbiBXaW5kb3dcbi8vIFx0d2luLm9wZW4oKTtcbi8vIH1cblxuLy8gLy8gT3BlbiBMYW5kaW5nIFNjcmVlblxuLy8gY3JlYXRlTGFuZGluZ1NjcmVlbigpO1xuIl0sInZlcnNpb24iOjN9
