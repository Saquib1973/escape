const fs = require('fs');
const path = require('path');

// Get target folder from command line arguments
const targetFolder = process.argv[2];

// Configuration
const OUTPUT_FILE = 'combine.txt';
const ROOT_DIR = path.join(__dirname, '.');

// Directories and files to exclude
const EXCLUDE_DIRS = [
  'node_modules',
  '.next',
  '.git',
  'dist',
  'build',
  'coverage',
  '.vscode',
  '.idea',
  'out',
  '.turbo',
];

const EXCLUDE_FILES = [
  '.DS_Store',
  'package-lock.json',
  'yarn.lock',
  'pnpm-lock.yaml',
  '.env',
  '.env.local',
  '.env.production',
  OUTPUT_FILE,
];

// File extensions to include (add more as needed)
const INCLUDE_EXTENSIONS = [
  '.js',
  '.jsx',
  '.ts',
  '.tsx',
  '.json',
  '.css',
  '.scss',
  '.md',
  '.txt',
  '.yml',
  '.yaml',
  '.prisma',
  '.sql',
  '.env.example',
  '.mjs',
  '.cjs',
];

// Special files to always include
const ALWAYS_INCLUDE = [
  'package.json',
  'tsconfig.json',
  'next.config.ts',
  'next.config.js',
  'tailwind.config.js',
  'tailwind.config.ts',
  'README.md',
  '.gitignore',
  'Dockerfile',
  '.dockerignore',
];

function shouldIncludeFile(fileName, filePath) {
  // Check if it's in the always include list
  if (ALWAYS_INCLUDE.includes(fileName)) {
    return true;
  }

  // Check if it's in exclude list
  if (EXCLUDE_FILES.includes(fileName)) {
    return false;
  }

  // Check file extension
  const ext = path.extname(fileName);
  return INCLUDE_EXTENSIONS.includes(ext);
}

function shouldExcludeDir(dirName) {
  return EXCLUDE_DIRS.includes(dirName);
}

function getAllFiles(dirPath, arrayOfFiles = []) {
  const files = fs.readdirSync(dirPath);

  files.forEach((file) => {
    const fullPath = path.join(dirPath, file);
    const stat = fs.statSync(fullPath);

    if (stat.isDirectory()) {
      if (!shouldExcludeDir(file)) {
        arrayOfFiles = getAllFiles(fullPath, arrayOfFiles);
      }
    } else {
      if (shouldIncludeFile(file, fullPath)) {
        arrayOfFiles.push(fullPath);
      }
    }
  });

  return arrayOfFiles;
}

function getRelativePath(filePath) {
  return path.relative(ROOT_DIR, filePath).replace(/\\/g, '/');
}

function combineCodebase() {
  // Determine the directory to scan
  let scanDir = ROOT_DIR;
  let folderName = 'entire codebase';
  
  if (targetFolder) {
    scanDir = path.isAbsolute(targetFolder) 
      ? targetFolder 
      : path.join(ROOT_DIR, targetFolder);
    
    // Check if the target folder exists
    if (!fs.existsSync(scanDir)) {
      console.error(`❌ Error: Folder "${targetFolder}" does not exist`);
      process.exit(1);
    }
    
    if (!fs.statSync(scanDir).isDirectory()) {
      console.error(`❌ Error: "${targetFolder}" is not a directory`);
      process.exit(1);
    }
    
    folderName = targetFolder;
  }
  
  console.log(`🔍 Scanning ${folderName}...`);
  
  const allFiles = getAllFiles(scanDir);
  console.log(`📁 Found ${allFiles.length} files to include`);

  let output = '';
  output += '=' .repeat(80) + '\n';
  output += 'CODEBASE COMBINED FILE\n';
  output += `Folder: ${folderName}\n`;
  output += `Generated: ${new Date().toISOString()}\n`;
  output += `Total Files: ${allFiles.length}\n`;
  output += '='.repeat(80) + '\n\n';

  // Sort files by path for better organization
  allFiles.sort();

  allFiles.forEach((filePath, index) => {
    const relativePath = getRelativePath(filePath);
    console.log(`📄 Processing [${index + 1}/${allFiles.length}]: ${relativePath}`);

    try {
      const content = fs.readFileSync(filePath, 'utf8');
      
      output += '\n' + '='.repeat(80) + '\n';
      output += `FILE: ${relativePath}\n`;
      output += '='.repeat(80) + '\n';
      output += content;
      output += '\n\n';
    } catch (error) {
      console.error(`❌ Error reading ${relativePath}:`, error.message);
      output += '\n' + '='.repeat(80) + '\n';
      output += `FILE: ${relativePath}\n`;
      output += '='.repeat(80) + '\n';
      output += `[ERROR: Could not read file - ${error.message}]\n\n`;
    }
  });

  // Write output file
  const outputPath = path.join(ROOT_DIR, OUTPUT_FILE);
  fs.writeFileSync(outputPath, output, 'utf8');
  
  const stats = fs.statSync(outputPath);
  const fileSizeInMB = (stats.size / (1024 * 1024)).toFixed(2);
  
  console.log('\n✅ Success!');
  console.log(`📝 Output file: ${OUTPUT_FILE}`);
  console.log(`📊 File size: ${fileSizeInMB} MB`);
  console.log(`📁 Total files combined: ${allFiles.length}`);
}

// Run the script
try {
  if (process.argv.includes('--help') || process.argv.includes('-h')) {
    console.log('Usage: node combine-codebase.js [folder-path]');
    console.log('\nExamples:');
    console.log('  node combine-codebase.js              # Combine entire codebase');
    console.log('  node combine-codebase.js src          # Combine only the src folder');
    console.log('  node combine-codebase.js src/app      # Combine only the src/app folder');
    console.log('  node combine-codebase.js components   # Combine only the components folder');
    process.exit(0);
  }
  
  combineCodebase();
} catch (error) {
  console.error('❌ Fatal error:', error);
  process.exit(1);
}
