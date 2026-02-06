const fs = require('fs');
const path = require('path');

// We'll use a npm package to convert the logo
// First, let's check if sharp is available
try {
  const sharp = require('sharp');
  
  const logoPath = path.join(__dirname, 'react-project-structura/src/images/logo_v2.png');
  
  // Create white version for dark theme
  sharp(logoPath)
    .tint({r: 255, g: 255, b: 255})
    .toFile(path.join(__dirname, 'react-project-structura/src/images/logo_v2_white.png'))
    .then(() => console.log('Created logo_v2_white.png'))
    .catch(err => console.error('White version error:', err));
  
  // Create dark version for light theme
  sharp(logoPath)
    .tint({r: 31, g: 41, b: 55})
    .toFile(path.join(__dirname, 'react-project-structura/src/images/logo_v2_dark.png'))
    .then(() => console.log('Created logo_v2_dark.png'))
    .catch(err => console.error('Dark version error:', err));
  
} catch (e) {
  console.log('Sharp not available, using alternative method');
}
