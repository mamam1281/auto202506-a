#!/usr/bin/env node

/**
 * 토큰 마이그레이션 스크립트
 * 기존 하드코딩된 색상을 CSS Variables로 자동 변환
 */

const fs = require('fs');
const path = require('path');

// 색상 매핑 테이블
const colorMappings = {
  // 네온 퍼플 색상들
  '#7b29cd': 'var(--neon-purple-1)',
  '#870dd1': 'var(--neon-purple-2)',
  '#5b30f6': 'var(--neon-purple-3)',
  '#8054f2': 'var(--neon-purple-4)',
  
  // rgba 형태
  'rgba(123, 41, 205, 0.3)': 'var(--neon-glow-1)',
  'rgba(135, 13, 209, 0.3)': 'var(--neon-glow-2)',
  'rgba(91, 48, 246, 0.3)': 'var(--neon-glow-3)',
  'rgba(128, 84, 242, 0.3)': 'var(--neon-glow-4)',
  
  'rgba(123, 41, 205, 0.15)': 'var(--neon-bg-1)',
  'rgba(135, 13, 209, 0.15)': 'var(--neon-bg-2)',
  'rgba(91, 48, 246, 0.15)': 'var(--neon-bg-3)',
  'rgba(128, 84, 242, 0.15)': 'var(--neon-bg-4)',
  
  'rgba(123, 41, 205, 0.2)': 'var(--neon-border-1)',
  'rgba(135, 13, 209, 0.2)': 'var(--neon-border-2)',
  'rgba(91, 48, 246, 0.2)': 'var(--neon-border-3)',
  'rgba(128, 84, 242, 0.2)': 'var(--neon-border-4)',
  
  // 다크 배경 색상들
  '#1a1a1a': 'var(--cosmic-bg-dark-1)',
  '#2d2d2d': 'var(--cosmic-bg-dark-2)',
  '#333333': 'var(--cosmic-bg-dark-3)',
  
  // 텍스트 색상들
  '#ffffff': 'var(--cosmic-text-primary)',
  '#D1D5DB': 'var(--cosmic-text-secondary)',
  '#a0a0a0': 'var(--cosmic-text-muted)',
};

// Tailwind 클래스 매핑
const tailwindMappings = {
  'from-[#7b29cd]': 'from-neon-purple-1',
  'to-[#870dd1]': 'to-neon-purple-2',
  'from-[#870dd1]': 'from-neon-purple-2',
  'to-[#5b30f6]': 'to-neon-purple-3',
  'from-[#5b30f6]': 'from-neon-purple-3',
  'to-[#8054f2]': 'to-neon-purple-4',
  'from-[#8054f2]': 'from-neon-purple-4',
  'to-[#7b29cd]': 'to-neon-purple-1',
  
  'bg-[#1a1a1a]': 'bg-cosmic-bg-1',
  'bg-[#2d2d2d]': 'bg-cosmic-bg-2',
  'bg-[#333333]': 'bg-cosmic-bg-3',
  
  'text-[#ffffff]': 'text-cosmic-text-primary',
  'text-[#D1D5DB]': 'text-cosmic-text-secondary',
  'text-[#a0a0a0]': 'text-cosmic-text-muted',
  
  'border-[#7b29cd]/20': 'border-neon-purple-1/20',
  'border-[#870dd1]/20': 'border-neon-purple-2/20',
  'border-[#5b30f6]/20': 'border-neon-purple-3/20',
  'border-[#8054f2]/20': 'border-neon-purple-4/20',
};

// 크기 관련 매핑
const sizeMappings = {
  'min-h-[320px]': 'cosmic-card-base',
  'min-h-[380px]': 'cosmic-card-game',
  'min-h-[280px]': 'cosmic-card-mission',
  
  'h-40': "style={{ height: 'var(--image-height-base)' }}",
  'h-32': "style={{ height: 'var(--image-height-standard)' }}",
  
  'p-6': "style={{ padding: 'var(--cosmic-padding)' }}",
  'gap-4': "style={{ gap: 'var(--cosmic-gap)' }}",
  'gap-6': "style={{ gap: 'var(--cosmic-gap-lg)' }}",
  
  'rounded-2xl': "style={{ borderRadius: 'var(--cosmic-radius-card)' }}",
  'rounded-xl': "style={{ borderRadius: 'var(--cosmic-radius-image)' }}",
};

/**
 * 파일 내용을 토큰으로 변환
 */
function convertToTokens(content) {
  let convertedContent = content;
  
  // 1. CSS Variables 변환
  Object.entries(colorMappings).forEach(([hardcoded, token]) => {
    // 문자열 내의 색상값 교체
    const regex = new RegExp(escapeRegExp(hardcoded), 'g');
    convertedContent = convertedContent.replace(regex, token);
  });
  
  // 2. Tailwind 클래스 변환
  Object.entries(tailwindMappings).forEach(([hardcoded, token]) => {
    const regex = new RegExp(escapeRegExp(hardcoded), 'g');
    convertedContent = convertedContent.replace(regex, token);
  });
  
  // 3. 크기 관련 변환
  Object.entries(sizeMappings).forEach(([hardcoded, token]) => {
    const regex = new RegExp(escapeRegExp(hardcoded), 'g');
    convertedContent = convertedContent.replace(regex, token);
  });
  
  return convertedContent;
}

/**
 * 정규식 특수문자 이스케이프
 */
function escapeRegExp(string) {
  return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

/**
 * 컴포넌트 파일들을 찾아서 변환
 */
function migrateComponents() {
  const componentsDir = path.join(__dirname, '../components');
  const files = [
    'CardBase.tsx',
    'CardGame.tsx', 
    'CardMission.tsx',
    'CardReward.tsx'
  ];
  
  files.forEach(filename => {
    const filePath = path.join(componentsDir, filename);
    
    if (fs.existsSync(filePath)) {
      console.log(`🔄 Processing ${filename}...`);
      
      const originalContent = fs.readFileSync(filePath, 'utf8');
      const convertedContent = convertToTokens(originalContent);
      
      // 백업 파일 생성
      const backupPath = filePath.replace('.tsx', '.backup.tsx');
      fs.writeFileSync(backupPath, originalContent);
      console.log(`📄 Backup created: ${filename}.backup.tsx`);
      
      // 변환된 내용 저장
      fs.writeFileSync(filePath, convertedContent);
      console.log(`✅ Converted: ${filename}`);
      
      // 변경사항 요약
      const changes = findChanges(originalContent, convertedContent);
      if (changes.length > 0) {
        console.log(`📝 Changes in ${filename}:`);
        changes.forEach(change => {
          console.log(`   ${change.from} → ${change.to}`);
        });
      }
      console.log('');
    }
  });
}

/**
 * 변경사항 찾기
 */
function findChanges(original, converted) {
  const changes = [];
  
  Object.entries(colorMappings).forEach(([hardcoded, token]) => {
    if (original.includes(hardcoded) && converted.includes(token)) {
      changes.push({ from: hardcoded, to: token });
    }
  });
  
  Object.entries(tailwindMappings).forEach(([hardcoded, token]) => {
    if (original.includes(hardcoded) && converted.includes(token)) {
      changes.push({ from: hardcoded, to: token });
    }
  });
  
  return changes;
}

/**
 * App.tsx도 변환
 */
function migrateApp() {
  const appPath = path.join(__dirname, '../App.tsx');
  
  if (fs.existsSync(appPath)) {
    console.log('🔄 Processing App.tsx...');
    
    const originalContent = fs.readFileSync(appPath, 'utf8');
    const convertedContent = convertToTokens(originalContent);
    
    // 백업 생성
    const backupPath = path.join(__dirname, '../App.backup.tsx');
    fs.writeFileSync(backupPath, originalContent);
    console.log('📄 Backup created: App.backup.tsx');
    
    // 변환된 내용 저장
    fs.writeFileSync(appPath, convertedContent);
    console.log('✅ Converted: App.tsx');
    
    const changes = findChanges(originalContent, convertedContent);
    if (changes.length > 0) {
      console.log('📝 Changes in App.tsx:');
      changes.forEach(change => {
        console.log(`   ${change.from} → ${change.to}`);
      });
    }
  }
}

/**
 * 유효성 검사
 */
function validateTokens() {
  console.log('🔍 Validating CSS Variables...');
  
  const globalsCssPath = path.join(__dirname, '../styles/globals.css');
  const globalsContent = fs.readFileSync(globalsCssPath, 'utf8');
  
  const requiredTokens = [
    '--neon-purple-1',
    '--neon-purple-2', 
    '--neon-purple-3',
    '--neon-purple-4',
    '--neon-glow-1',
    '--neon-glow-2',
    '--neon-glow-3', 
    '--neon-glow-4',
    '--cosmic-bg-dark-1',
    '--cosmic-bg-dark-2',
    '--cosmic-text-primary'
  ];
  
  const missingTokens = requiredTokens.filter(token => 
    !globalsContent.includes(token)
  );
  
  if (missingTokens.length > 0) {
    console.log('❌ Missing tokens in globals.css:');
    missingTokens.forEach(token => console.log(`   ${token}`));
    return false;
  }
  
  console.log('✅ All required tokens found in globals.css');
  return true;
}

/**
 * 메인 실행 함수
 */
function main() {
  console.log('🚀 Starting token migration...\n');
  
  // 1. CSS 토큰 유효성 검사
  if (!validateTokens()) {
    console.log('\n❌ Please add missing tokens to globals.css first');
    process.exit(1);
  }
  
  console.log('');
  
  // 2. 컴포넌트 변환
  migrateComponents();
  
  // 3. App.tsx 변환
  migrateApp();
  
  console.log('🎉 Migration completed!');
  console.log('\n📋 Next steps:');
  console.log('1. Review the changes in each file');
  console.log('2. Test the application');
  console.log('3. Remove backup files if everything works');
  console.log('4. Set up Figma Variables for design-dev sync');
}

// 스크립트 직접 실행 시
if (require.main === module) {
  main();
}

module.exports = {
  convertToTokens,
  migrateComponents,
  migrateApp,
  validateTokens
};