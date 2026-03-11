const fs = require('fs');
const path = require('path');

const modelsDir = path.join(__dirname, '..', 'public', 'models');

function loadManifestFiles(dir) {
  return fs.readdirSync(dir).filter(f => f.endsWith('-weights_manifest.json'));
}

function validate() {
  if (!fs.existsSync(modelsDir)) {
    console.error(`Models directory not found: ${modelsDir}`);
    process.exit(2);
  }

  const manifests = loadManifestFiles(modelsDir);
  if (!manifests.length) {
    console.error('No manifest files found in', modelsDir);
    process.exit(2);
  }

  let missing = [];

  manifests.forEach((mf) => {
    const manifestPath = path.join(modelsDir, mf);
    let content;
    try {
      content = JSON.parse(fs.readFileSync(manifestPath, 'utf8'));
    } catch (err) {
      console.error('Failed to parse', manifestPath, err.message);
      missing.push(manifestPath);
      return;
    }

    content.forEach((entry) => {
      if (!entry.paths || !Array.isArray(entry.paths)) return;
      entry.paths.forEach((p) => {
        const filePath = path.join(modelsDir, p);
        if (!fs.existsSync(filePath)) {
          missing.push(filePath);
        }
      });
    });
  });

  if (missing.length) {
    console.error('Missing model files:');
    missing.forEach(m => console.error(' -', m));
    console.error('\nRun frontend/scripts/download-models.ps1 to fetch missing files.');
    process.exit(3);
  }

  console.log('All model files referenced by manifests are present.');
}

if (require.main === module) validate();

module.exports = { validate };
