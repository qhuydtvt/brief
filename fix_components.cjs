const fs = require('fs');
const path = require('path');

const dir = 'src/entities/slide/ui/custom';
const files = fs.readdirSync(dir).filter(f => f.endsWith('.tsx'));

for (const file of files) {
  const filepath = path.join(dir, file);
  let content = fs.readFileSync(filepath, 'utf8');

  // General layout updates
  content = content.replace(/p-2 pt-4 text-center gap-3/g, 'p-1 pt-2 text-center gap-2');
  content = content.replace(/space-y-2 max-w-xs/g, 'space-y-1 max-w-xs');
  content = content.replace(/text-2xl font-black/g, 'text-xl font-bold');
  content = content.replace(/text-\[13px\]/g, 'text-xs');

  // Specific updates
  if (file === 'SlideLessIsMore.tsx') {
    content = content.replace(/px-6 py-3/g, 'py-2.5 px-5 text-sm');
  } else if (file === 'SlideSeeAndHear.tsx') {
    content = content.replace(/max-w-\[220px\]/g, 'max-w-[200px]');
  } else if (file === 'SlideTestToRemember.tsx') {
    content = content.replace(/space-y-3/g, 'space-y-2');
    content = content.replace(/gap-3/g, 'gap-2');
    content = content.replace(/py-2 rounded-xl/g, 'py-1.5 rounded-xl text-sm');
  } else if (file === 'SlideSpaceYourPractice.tsx') {
    content = content.replace(/space-y-4/g, 'space-y-3');
    content = content.replace(/h-12 bg-white\/10/g, 'h-10 bg-white/10');
    content = content.replace(/px-6 py-2/g, 'px-4 py-1.5 text-sm');
  } else if (file === 'SlideMakeItPersonal.tsx') {
    content = content.replace(/px-4 py-2/g, 'px-3 py-1.5');
    content = content.replace(/w-20 h-20 mb-4/g, 'w-14 h-14 mb-2');
    content = content.replace(/p-4 rounded-3xl/g, 'p-3 rounded-2xl');
  } else if (file === 'SlideDesignForPortrait.tsx') {
    content = content.replace(/h-\[160px\]/g, 'h-[140px]');
  } else if (file === 'SlideKeepWithinReach.tsx') {
    content = content.replace(/h-\[150px\]/g, 'h-[130px]');
  } else if (file === 'SlideReadTheSound.tsx') {
    content = content.replace(/h-\[120px\]/g, 'h-[100px]');
    content = content.replace(/text-4xl font-black/g, 'text-3xl font-black leading-tight');
  } else if (file === 'SlideHookThemFast.tsx') {
    content = content.replace(/h-\[150px\]/g, 'h-[130px]');
    content = content.replace(/scale-125/g, 'scale-110');
    content = content.replace(/text-3xl/g, 'text-2xl');
  } else if (file === 'SlideSwipeAndRepeat.tsx') {
    content = content.replace(/h-\[220px\]/g, 'h-[180px]');
    content = content.replace(/w-16 h-16 fill-red-500/g, 'w-12 h-12 fill-red-500');
  }

  fs.writeFileSync(filepath, content, 'utf8');
}
console.log('Modifications applied.');
