
var ANDROID = (Ti.Platform.osname === 'android');
var keyboardControlModule = require('it.smc.dakeyboardcontrol');


/**
 * Create a new `Ti.UI.TabGroup`.
 */
var tabGroup = Ti.UI.createTabGroup();

/**
 * Add the two created tabs to the tabGroup object.
 */
tabGroup.addTab(createTab("AutoAdjustBottomPadding", "", "assets/images/tab1.png"));
tabGroup.addTab(createTab("KeepScrollingViewAbove", "", "assets/images/tab2.png"));

/**
 * Open the tabGroup
 */
// tabGroup.open();

/**
 * Open the tabGroup in a navigationWindow
 */
var navigationWindow = Titanium.UI.createNavigationWindow({
    window: tabGroup
});
navigationWindow.open();

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
       backgroundColor: '#fff',
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
      backgroundColor: '#ccc',
      data: [sectionFruit, sectionVeg],
      top:0,
      bottom:0,
      width:Ti.UI.FILL,
      height:Ti.UI.FILL
    });

    var toolbarContainer = Ti.UI.createView({
        backgroundColor: '#aa2f53c3',
        layout:'horizontal',
        width:Ti.UI.FILL,
        height:Ti.UI.SIZE,
        bottom:0
      });

    var send = Ti.UI.createButton({
        title: 'Send',
        right:10,
        bottom:5
    });
    
    var textArea = Ti.UI.createTextArea({
        top:8,
        bottom:8,
        left:15,
        right:8,
        borderWidth: 1,
        borderColor: '#aaa',
        borderRadius: 16,
        color: '#888',
        font: {fontSize:16, fontWeight:'bold'},
        textAlign: 'left',
        value: 'I am a textarea',
        width: '70%',
        height : Ti.UI.SIZE
      });
       
    toolbarContainer.add(textArea);
    toolbarContainer.add(send);
        
    var interactiveKeyboardView = keyboardControlModule.createView({
        showKeyboardOnScrollUp:false, // show keyboard (when hidden) on scrolling up
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

    var tab = Ti.UI.createTab({
        title: title,
        icon: icon,
        window: win
    });

    return tab;
}
