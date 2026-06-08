// Example app for ti.imageviewextension module
// Demonstrates all extended features

var win = Ti.UI.createWindow({
    backgroundColor: '#ffffff'
});

var scrollView = Ti.UI.createScrollView({
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    showVerticalScrollIndicator: true
});

// Helper to create section headers
function createHeader(text) {
    return Ti.UI.createLabel({
        text: text,
        font: { fontSize: 18, fontWeight: 'bold' },
        top: 20,
        left: 10,
        right: 10,
        color: '#333333'
    });
}

// Helper to create description labels
function createDescription(text) {
    return Ti.UI.createLabel({
        text: text,
        font: { fontSize: 14 },
        top: 5,
        left: 10,
        right: 10,
        color: '#666666'
    });
}

var yOffset = 0;

// ============================================================
// Example 1: Animated Fade-In
// ============================================================
scrollView.add(createHeader('1. Animated Fade-In'));
scrollView.add(createDescription('animated: true, animateOnce: false — re-animates on visibility'));

var imageView1 = Ti.UI.createImageView({
    image: '/assets/KITT.jpg',
    top: yOffset + 30,
    left: 10,
    right: 10,
    height: 200,
    animated: true,
    animateOnce: false
});
scrollView.add(imageView1);
yOffset += 240;

// ============================================================
// Example 2: Constrained Sizing with calcMinMax
// ============================================================
scrollView.add(createHeader('2. Constrained Sizing'));
scrollView.add(createDescription('calcMinMax: true, maxWidth: 300, maxHeight: 200 — maintains aspect ratio'));

var imageView2 = Ti.UI.createImageView({
    image: '/assets/KITT.jpg',
    top: yOffset + 30,
    left: 10,
    width: Ti.UI.SIZE,
    height: Ti.UI.SIZE,
    calcMinMax: true,
    maxWidth: 300,
    maxHeight: 200
});
scrollView.add(imageView2);

imageView2.addEventListener('imageMinMax', function(e) {
    Ti.API.info('[Example 2] Scaled dimensions: ' + e.width + 'x' + e.height);
    
    // Update actual dimensions after scaling
    this.width = e.width;
    this.height = e.height;
});

yOffset += 250;

// ============================================================
// Example 3: No Transparency (Performance)
// ============================================================
scrollView.add(createHeader('3. No Transparency'));
scrollView.add(createDescription('noTransparency: true, backgroundColor: #e0e0e0 — removes alpha channel'));

var imageView3 = Ti.UI.createImageView({
    image: '/assets/KITT.jpg',
    top: yOffset + 30,
    left: 10,
    right: 10,
    height: 200,
    noTransparency: true,
    backgroundColor: '#e0e0e0'
});
scrollView.add(imageView3);
yOffset += 240;

// ============================================================
// Example 4: Average Color Detection
// ============================================================
scrollView.add(createHeader('4. Average Color Detection'));
scrollView.add(createDescription('averageColor event — extracts dominant color for UI theming'));

var colorLabel = Ti.UI.createLabel({
    top: yOffset + 25,
    left: 10,
    right: 10,
    height: 40,
    textAlign: 'center',
    font: { fontSize: 16, fontWeight: 'bold' },
    color: '#333333',
    text: 'Waiting for color...'
});
scrollView.add(colorLabel);

var imageView4 = Ti.UI.createImageView({
    image: '/assets/KITT.jpg',
    top: yOffset + 50,
    left: 10,
    right: 10,
    height: 200,
    averageColorDone: false
});
scrollView.add(imageView4);

imageView4.addEventListener('averageColor', function(e) {
    var hexColor = imageView4.averageColor;
    colorLabel.text = 'Dominant Color: ' + hexColor;
    colorLabel.color = hexColor;
    Ti.API.info('[Example 4] Average color detected: ' + hexColor);
    Ti.API.info('[Example 4] RGB values:', e.color);
});

yOffset += 280;

// ============================================================
// Example 5: Blurred Image
// ============================================================
scrollView.add(createHeader('5. Blurred Image'));
scrollView.add(createDescription('blurredImage: true, blurRadius: 25 — Gaussian blur using Core Image'));

var imageView5 = Ti.UI.createImageView({
    image: '/assets/KITT.jpg',
    top: yOffset + 30,
    left: 10,
    right: 10,
    height: 200,
    blurredImage: true,
    blurRadius: 25
});
scrollView.add(imageView5);
yOffset += 240;

// ============================================================
// Example 6: Tint Color
// ============================================================
scrollView.add(createHeader('6. Tint Color'));
scrollView.add(createDescription('tintColor: "#365b85" — image becomes single-color silhouette'));

var imageView6 = Ti.UI.createImageView({
    image: '/assets/KITT.jpg',
    top: yOffset + 30,
    left: 10,
    width: 200,
    height: 150,
    tintColor: '#365b85'
});
scrollView.add(imageView6);
yOffset += 190;

// ============================================================
// Example 7: Layer Rasterization (Performance)
// ============================================================
scrollView.add(createHeader('7. Layer Rasterization'));
scrollView.add(createDescription('shouldRasterize: true — improves scrolling performance'));

var imageView7 = Ti.UI.createImageView({
    image: '/assets/KITT.jpg',
    top: yOffset + 30,
    left: 10,
    right: 10,
    height: 200,
    shouldRasterize: true,
    animated: true,
    animateOnce: false
});
scrollView.add(imageView7);
yOffset += 240;

// ============================================================
// Example 8: Combined Features
// ============================================================
scrollView.add(createHeader('8. Combined Features'));
scrollView.add(createDescription('animated + calcMinMax + averageColor + shouldRasterize'));

var combinedLabel = Ti.UI.createLabel({
    top: yOffset + 25,
    left: 10,
    right: 10,
    height: 60,
    textAlign: 'center',
    font: { fontSize: 14 },
    color: '#333333',
    text: 'Loading...'
});
scrollView.add(combinedLabel);

var imageView8 = Ti.UI.createImageView({
    image: '/assets/KITT.jpg',
    top: yOffset + 50,
    left: 10,
    right: 10,
    width: Ti.UI.SIZE,
    height: Ti.UI.SIZE,
    
    // Animation
    animated: true,
    animateOnce: true,
    
    // Sizing
    calcMinMax: true,
    maxWidth: 320,
    maxHeight: 250,
    
    // Performance
    shouldRasterize: true,
    
    // Color detection
    averageColorDone: false
});
scrollView.add(imageView8);

imageView8.addEventListener('averageColor', function(e) {
    combinedLabel.text = 'Color: ' + imageView8.averageColor;
    Ti.API.info('[Example 8] Average color:', e.averageColor);
});

imageView8.addEventListener('imageMinMax', function(e) {
    combinedLabel.text += '\nSize: ' + e.width + 'x' + e.height;
    Ti.API.info('[Example 8] Scaled to:', e.width + 'x' + e.height);
    
    // Update dimensions
    this.width = e.width;
    this.height = e.height;
});

yOffset += 340;

// ============================================================
// Example 9: Blur + Average Color (Background Effect)
// ============================================================
scrollView.add(createHeader('9. Blurred Background + Color Match'));
scrollView.add(createDescription('blurredImage + averageColor — frosted glass effect with matching UI'));

var blurContainer = Ti.UI.createView({
    top: yOffset + 10,
    left: 10,
    right: 10,
    height: 250
});

var blurBackground = Ti.UI.createImageView({
    image: '/assets/KITT.jpg',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    blurredImage: true,
    blurRadius: 30
});

var blurOverlay = Ti.UI.createView({
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.3)'
});

var blurLabel = Ti.UI.createLabel({
    top: Ti.UI.CENTER,
    left: 20,
    right: 20,
    textAlign: 'center',
    font: { fontSize: 20, fontWeight: 'bold' },
    color: '#ffffff',
    text: 'Frosted Glass Effect'
});

blurContainer.add(blurBackground);
blurContainer.add(blurOverlay);
blurContainer.add(blurLabel);
scrollView.add(blurContainer);

blurBackground.addEventListener('averageColor', function(e) {
    Ti.API.info('[Example 9] Blur background color:', e.averageColor);
});

yOffset += 270;

// ============================================================
// Example 10: TableView Integration
// ============================================================
scrollView.add(createHeader('10. TableView Integration'));
scrollView.add(createDescription('animated + shouldRasterize + calcMinMax — smooth scrolling list'));

var tableView = Ti.UI.createTableView({
    top: yOffset + 10,
    left: 10,
    right: 10,
    height: 400,
    style: Ti.UI.iPhone.TableViewStyle.GROUPED
});

for (var i = 0; i < 10; i++) {
    var row = Ti.UI.createTableViewRow({
        height: 80,
        className: 'item'
    });
    
    var rowImage = Ti.UI.createImageView({
        image: '/assets/KITT.jpg',
        left: 10,
        top: 10,
        bottom: 10,
        width: 60,
        height: 60,
        
        // Animation
        animated: true,
        animateOnce: false,
        
        // Sizing
        calcMinMax: true,
        maxWidth: 60,
        maxHeight: 60,
        
        // Performance
        shouldRasterize: true
    });
    
    rowImage.addEventListener('averageColor', function(e) {
        this.backgroundColor = e.averageColor;
    });
    
    var rowLabel = Ti.UI.createLabel({
        text: 'Item ' + (i + 1),
        left: 85,
        top: 30,
        right: 10,
        font: { fontSize: 16 }
    });
    
    row.add(rowImage);
    row.add(rowLabel);
    tableView.appendRow(row);
}

scrollView.add(tableView);
yOffset += 420;

// ============================================================
// Footer
// ============================================================
scrollView.add(Ti.UI.createLabel({
    top: yOffset + 20,
    left: 10,
    right: 10,
    bottom: 20,
    textAlign: 'center',
    font: { fontSize: 12 },
    color: '#999999',
    text: 'ti.imageviewextension Module Example\nAll features demonstrated'
}));

scrollView.height = yOffset + 80;
win.add(scrollView);
win.open();
