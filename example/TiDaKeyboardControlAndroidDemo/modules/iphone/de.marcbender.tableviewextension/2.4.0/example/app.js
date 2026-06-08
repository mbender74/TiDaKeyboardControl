// TableViewExtension Example App
// Demonstrates all module features

import tableviewextension from 'de.marcbender.tableviewextension';

Ti.API.info("TableViewExtension module loaded: " + tableviewextension);

const win = Ti.UI.createWindow({
    title: 'TableViewExtension Demo',
    backgroundColor: '#fff'
});

// Header label
const headerLabel = Ti.UI.createLabel({
    text: 'TableViewExtension Features',
    font: { fontSize: 20, fontWeight: 'bold' },
    top: 10,
    left: 10,
    right: 10
});

// Create table view with sample data
const tableView = Ti.UI.createTableView({
    top: 50,
    bottom: 0,
    style: Ti.UI.iPhone.TableViewStyle.PLAIN
});

// Generate sample rows
const data = [];
for (let i = 1; i <= 50; i++) {
    data.push(Ti.UI.createTableViewRow({
        title: `Row ${i}`,
        hasDetail: true,
        detail: `Detail for row ${i}`,
        class: `row-${i}`
    }));
}
tableView.data = data;

// --- Feature 1: Row Visibility Tracking ---
Ti.API.info('[Demo] Row visibility tracking enabled');

tableView.addEventListener('rowvisible', function(e) {
    Ti.API.info(`[Demo] Row visible: index=${e.index}, topOffset=${e.topOffset}`);
    // Highlight visible rows
    if (e.rowData) {
        e.rowData.backgroundColor = '#f0f8ff';
    }
});

tableView.addEventListener('rownotvisible', function(e) {
    if (e.rowData) {
        e.rowData.backgroundColor = null;
    }
});

// --- Feature 2: Content Insets with animation ---
Ti.API.info('[Demo] Content insets management');

// Set initial content insets (e.g., for tab bar or bottom bar)
tableView.setContentInsets(
    { top: 0, right: 0, bottom: 0, left: 0 },
    { animated: false }
);

// --- Feature 3: Row Prepend (infinite scroll pattern) ---
Ti.API.info('[Demo] Row prepend for infinite scroll');

let page = 1;
let loading = false;

tableView.addEventListener('scroll', function(e) {
    if (e.contentOffset.y <= 5 && !loading) {
        loading = true;
        Ti.API.info(`[Demo] Loading older items (page ${page + 1})`);

        // Simulate async data loading
        setTimeout(() => {
            const newRows = [];
            for (let i = 0; i < 10; i++) {
                const idx = (page + 1) * 10 - i;
                newRows.push(Ti.UI.createTableViewRow({
                    title: `Row ${idx}`,
                    hasDetail: true,
                    detail: `Loaded from page ${page + 1}`
                }));
            }

            // Prepend rows while maintaining scroll position
            newRows.forEach(row => {
                tableView.appendRowBeforeRow(row);
            });

            loading = false;
            page++;
        }, 300);
    }
});

// --- Feature 4: Pan Gesture (optional) ---
Ti.API.info('[Demo] Pan gesture support available');

// Enable pan gesture tracking
// tableView.panGesture = true;

// tableView.addEventListener('pan', function(e) {
//     Ti.API.info(`[Demo] Pan: x=${e.translation.x}, y=${e.translation.y}`);
// });

// --- Feature 5: Row properties ---
Ti.API.info('[Demo] Row visibility check');

// Check if a specific row is visible
setTimeout(() => {
    if (tableView.data && tableView.data[0] && tableView.data[0].rows[0]) {
        const firstRow = tableView.data[0].rows[0];
        Ti.API.info(`[Demo] First row isVisible: ${firstRow.isVisible}`);
        Ti.API.info(`[Demo] First row getTopOffset: ${firstRow.getTopOffset}`);
    }
}, 1000);

// --- Feature 6: ScrollView extensions ---
Ti.API.info('[Demo] ScrollView scrollToBottomNoAnim available');

// Add to window
win.add(headerLabel);
win.add(tableView);
win.open();

// --- Keyboard handling example ---
Ti.App.addEventListener('keyboardappear', function(e) {
    Ti.API.info('[Demo] Keyboard appeared, adjusting insets');
    tableView.setContentInsets(
        { top: 0, right: 0, bottom: e.height, left: 0 },
        { animated: true, duration: 250 }
    );
});

Ti.App.addEventListener('keyboardhide', function() {
    Ti.API.info('[Demo] Keyboard hidden, resetting insets');
    tableView.setContentInsets(
        { top: 0, right: 0, bottom: 0, left: 0 },
        { animated: true, duration: 250 }
    );
});
