import { evaluateQuickIdea } from './lib/ai/evaluator.ts';

const testData = {
  idea: 'منصة تعليمية تفاعلية للأطفال',
  problem: 'صعوبة التعلم الذاتي',
  targetAudience: 'الأطفال من 6-12 سنة',
  category: 'education'
};

console.log('Testing Quick Evaluation...');
console.log('Input:', testData);

try {
  const result = await evaluateQuickIdea(testData);
  console.log('\n✅ Success!');
  console.log('Result:', JSON.stringify(result, null, 2));
} catch (error) {
  console.error('\n❌ Error:', error.message);
  console.error('Stack:', error.stack);
}
