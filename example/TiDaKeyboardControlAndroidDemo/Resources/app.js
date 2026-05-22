
var ANDROID = (Ti.Platform.osname === 'android');
var keyboardControlModule = require('de.marcbender.keyboardcontrol');

// ++++++++++++++++++++++++++++++++++++++++++++++++++++
// Code for standalone window below
// ++++++++++++++++++++++++++++++++++++++++++++++++++++

var titleControl = Ti.UI.createView({
    height:Ti.UI.SIZE,
    width:Ti.UI.FILL,
    backgroundColor : 'red'
});
titleControl.add(Ti.UI.createLabel({
        left:96,
        bottom:5,
        backgroundColor : 'red',
        text: 'Test',
        font:{fontSize:22},
        color: '#fff',
        width: Ti.UI.SIZE,
        height:36,
        right:20
}));

var win = Ti.UI.createWindow({
    title: 'Test',
    backgroundColor: '#fff',
    sustainedPerformanceMode:true,
    extendSafeArea:false,
    height:Ti.UI.FILL,
    top:0,
    bottom:0
 });
 
 var sectionFruit = Ti.UI.createTableViewSection({ headerTitle: 'Fruit' });
 sectionFruit.add(Ti.UI.createTableViewRow({ title: 'Apples' , className :'fruits', isReusable:true }));
 sectionFruit.add(Ti.UI.createTableViewRow({ title: 'Bananas' , className :'fruits', isReusable:true }));
 sectionFruit.add(Ti.UI.createTableViewRow({ title: 'Apples' , className :'fruits', isReusable:true }));
 sectionFruit.add(Ti.UI.createTableViewRow({ title: 'Bananas' , className :'fruits', isReusable:true }));
 sectionFruit.add(Ti.UI.createTableViewRow({ title: 'Apples' , className :'fruits', isReusable:true }));
 sectionFruit.add(Ti.UI.createTableViewRow({ title: 'Bananas' , className :'fruits', isReusable:true }));
 sectionFruit.add(Ti.UI.createTableViewRow({ title: 'Apples' , className :'fruits', isReusable:true }));
 sectionFruit.add(Ti.UI.createTableViewRow({ title: 'Bananas', className :'fruits', isReusable:true  }));
 sectionFruit.add(Ti.UI.createTableViewRow({ title: 'Apples' , className :'fruits', isReusable:true }));
 sectionFruit.add(Ti.UI.createTableViewRow({ title: 'Bananas' , className :'fruits', isReusable:true }));
 
 var sectionVeg = Ti.UI.createTableViewSection({ headerTitle: 'Vegetables' });
 sectionVeg.add(Ti.UI.createTableViewRow({ title: 'Carrots' , className :'Vegetables', isReusable:true }));
 sectionVeg.add(Ti.UI.createTableViewRow({ title: 'Potatoes' , className :'Vegetables', isReusable:true}));
 sectionVeg.add(Ti.UI.createTableViewRow({ title: 'Carrots' , className :'Vegetables', isReusable:true}));
 sectionVeg.add(Ti.UI.createTableViewRow({ title: 'Potatoes' , className :'Vegetables', isReusable:true}));
 sectionVeg.add(Ti.UI.createTableViewRow({ title: 'Carrots' , className :'Vegetables', isReusable:true}));
 sectionVeg.add(Ti.UI.createTableViewRow({ title: 'Potatoes' , className :'Vegetables', isReusable:true}));
 sectionVeg.add(Ti.UI.createTableViewRow({ title: 'Carrots' , className :'Vegetables', isReusable:true}));
 sectionVeg.add(Ti.UI.createTableViewRow({ title: 'Potatoes' , className :'Vegetables', isReusable:true}));
 sectionVeg.add(Ti.UI.createTableViewRow({ title: 'Carrots' , className :'Vegetables', isReusable:true}));
 sectionVeg.add(Ti.UI.createTableViewRow({ title: 'Potatoes' , className :'Vegetables', isReusable:true}));
 sectionVeg.add(Ti.UI.createTableViewRow({ title: 'Carrots' , className :'Vegetables', isReusable:true}));
 sectionVeg.add(Ti.UI.createTableViewRow({ title: 'Last entry', className :'last', isReusable:true }));
 
 var tableView = Ti.UI.createTableView({
   backgroundColor: '#ccc',
   data: [sectionFruit, sectionVeg],
   top:0,
   bottom:0,
   minRowHeight:69,
   rowHeight:69,
   width:Ti.UI.FILL,
   height:Ti.UI.FILL,
   bubbleParent:true,
   maxClassname:50
 });
    tableView.addEventListener('scrollend', function(e) {
        Ti.API.warn('Scrolling stopped!  contentOffset.y: ' + e.contentOffset.y);
    });
    tableView.addEventListener('scroll', function(e) {
        Ti.API.warn('Scrolling! contentOffset.y: ' + e.contentOffset.y);
    });

 var toolbarContainer = Ti.UI.createView({
     backgroundColor: '#aa2f53c3',
     width:Ti.UI.FILL,
     height:Ti.UI.SIZE,
     bottom:0
   });

 var toolbarView = Ti.UI.createView({
    backgroundColor: '#aa2f53c3',
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
    lines:1,
    maxLines:5,
    borderWidth: 1,
    borderColor: '#aaa',
    borderRadius: 16,
    color: '#000',
    backgroundColor: '#fff',
    font: {fontSize:16, fontWeight:'normal'},
    textAlign: 'left',
    value: '',
    width: '70%',
    padding:{left:4,right:4,top:8,bottom:8},
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
         autoSizeAndKeepScrollingViewAboveToolbar:false, // scrollingView will be always on top of the toolbarView - the scrollingView resizes automaticly respecting the scrollingView bottom value (if set) when "true" -> "autoAdjustBottomPadding=true" has no effect
         scrollingView:tableView, // whatever listView, tableView, scrollView -> will be automaticly added to the interactiveKeyboardView
         toolbarView:toolbarContainer, // has to be a Ti.UI.View!!!  -> will be automaticly added to the interactiveKeyboardView
         backgroundColor:'#fefefe',
         top:0,
         bottom:0
     }); 
     win.add(interactiveKeyboardView);
 }
 else {

    var interactiveKeyboardView = keyboardControlModule.createView({
        parentWindow:win,
        autoAdjustBottomPadding:true,
        autoScrollToBottom:true, // scrolling to bottom on toolbar size change
        autoSizeAndKeepScrollingViewAboveToolbar:false, // scrollingView will be always on top of the toolbarView - the scrollingView resizes automaticly respecting the scrollingView bottom value (if set) when "true" -> "autoAdjustBottomPadding=true" has no effect in that case
        ignoreExtendSafeArea:false, // only used whene the parentWindow has "extendSafeArea:true" AND parentWindow is a standalone window (not contained in NavigationWindow and/or TagGroup) -> the module does autodetect that!
        scrollingView:tableView, // whatever listView, tableView, scrollView  -> will be automaticly added to the interactiveKeyboardView
        toolbarView:toolbarContainer, // has to be a Ti.UI.View!!! -> will be automaticly added to the interactiveKeyboardView
        textfield:textArea, // required -> put here your Ti.UI.TextArea or Titanium.UI.TextField
        keyboardPanning:true,
        backgroundColor:'#fefefe',
        top:0,
        bottom:0
    });
    win.add(interactiveKeyboardView);
 }

 win.open();






// ++++++++++++++++++++++++++++++++++++++++++++++++++++
// Code for TabGroup below
// ++++++++++++++++++++++++++++++++++++++++++++++++++++


/**
 * Create a new `Ti.UI.TabGroup`.
 */
// var tabGroup = Ti.UI.createTabGroup();

//  /**
//   * Add the two created tabs to the tabGroup object.
//  */
//  tabGroup.addTab(createTab("AutoAdjustBottomPadding", "", "assets/images/tab1.png"));
//  tabGroup.addTab(createTab("KeepScrollingViewAbove", "", "assets/images/tab2.png"));



// ++++++++++++++++++++++++++++++++++++++++++++++++++++
// Code for TabGroup only
// ++++++++++++++++++++++++++++++++++++++++++++++++++++

/**
 * Open the tabGroup
 */
// tabGroup.open();



// ++++++++++++++++++++++++++++++++++++++++++++++++++++
// Code for TabGroup in NavigationWindow
// ++++++++++++++++++++++++++++++++++++++++++++++++++++


// /**
//  * Open the tabGroup in a navigationWindow
//  */
// var navigationWindow = Titanium.UI.createNavigationWindow({
//     window: tabGroup
// });
// navigationWindow.open();



/**
 * Creates a new Tab and configures it.
 *
 * @param  {String} title The title used in the `Ti.UI.Tab` and it's included `Ti.UI.Window`
 * @param  {String} message The title displayed in the `Ti.UI.Label`
 * @return {String} icon The icon used in the `Ti.UI.Tab`
 */
function createTab(title, message, icon) {

    var win = Ti.UI.createWindow({
       title: 'Test',
       barColor : '#365b85',
       backgroundColor: '#fff',
       extendSafeArea:false,
       sustainedPerformanceMode:true
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
      top:0,
      bottom:0,
      minRowHeight:69,
      rowHeight:69,
      width:Ti.UI.FILL,
      height:Ti.UI.FILL,
      bubbleParent:true
    });


    tableView.addEventListener('scrollend', function(e) {
       // Ti.API.warn('Scrolling stopped! Final X: ' + e.x + ', Y: ' + e.y);
    });
    tableView.addEventListener('scroll', function(e) {
       // Ti.API.warn('Scrolling! X: ' + e.x + ', Y: ' + e.y);
    });

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
        borderWidth: 1,
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
