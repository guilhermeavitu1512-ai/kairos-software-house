import test from 'node:test';
import assert from 'node:assert/strict';
import { EMPTY_PROBLEM, validBrazilPhone, formatBrazilPhone, toggleSelection, validateProblemStep, buildProblemMessage } from '../data/problem-flow.ts';

const complete = { ...EMPTY_PROBLEM, problem: 'Agendamentos se perdem entre WhatsApp e planilhas.', business: 'Serviço', current: ['WhatsApp', 'Planilhas'], goals: ['Organizar agenda'], name: 'Pessoa de teste', whatsapp: '81912345678' };
test('Brazilian numbers normalize country code and retain DDD 55', () => {
  for (const value of ['81912345678', '+55 (81) 91234-5678', '55912345678', '1132345678']) assert.equal(validBrazilPhone(value), true, value);
  for (const value of ['', '123', '00123456789', '81999999999', '81123456789', '81912345678abc']) assert.equal(validBrazilPhone(value), false, value);
  assert.equal(formatBrazilPhone('+55 81 91234-5678'), '(81) 91234-5678');
});
test('all three steps validate and contact errors are actionable', () => {
  for (let step=0; step<3; step++) assert.equal(validateProblemStep(step, complete), '');
  for (let step=0; step<3; step++) assert.notEqual(validateProblemStep(step, EMPTY_PROBLEM), '');
  assert.match(validateProblemStep(2, {...complete,email:'invalid'}), /e-mail/);
  assert.equal(validateProblemStep(2, {...complete,email:''}), '');
});
test('other business requires context', () => {
  assert.notEqual(validateProblemStep(1, {...complete,business:'Outro'}), '');
  assert.equal(validateProblemStep(1, {...complete,business:'Outro',otherBusiness:'Cooperativa'}), '');
});
test('exclusive selections do not retain contradictory answers', () => {
  assert.deepEqual(toggleSelection(['WhatsApp','Planilhas'], 'Ainda não tenho nada', 'Ainda não tenho nada'), ['Ainda não tenho nada']);
  assert.deepEqual(toggleSelection(['Ainda não sei'], 'Organizar agenda', 'Ainda não sei'), ['Organizar agenda']);
});
test('review edits preserve answers and WhatsApp copy has no budget or fake send', () => {
  const updated = {...complete, problem:'Organizar os agendamentos.'};
  assert.deepEqual(updated.current, complete.current);
  const message = buildProblemMessage(updated);
  assert.doesNotMatch(message, /Como funciona hoje/);
  assert.doesNotMatch(message, /O que gostaria de melhorar/);
  assert.match(message, /Organizar os agendamentos/);
  assert.doesNotMatch(message, /orçamento|investimento|enviada com sucesso|tecnologia/i);
  assert.equal(decodeURIComponent(encodeURIComponent(message)),message);
});

test("contact can omit phone but validates a provided number",()=>{assert.equal(validateProblemStep(2,{...complete,whatsapp:""}),"");assert.match(validateProblemStep(2,{...complete,whatsapp:"123"}),/WhatsApp/);});

test("plan context survives into the WhatsApp summary",()=>{assert.match(buildProblemMessage({...complete,interest:"Site Business — R$ 697"}),/Interesse: Site Business — R\$ 697/);});
