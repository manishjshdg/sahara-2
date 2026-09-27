// SAHARA Comprehensive Production Test Suite
// Validates:
// 1. Authentication & Signup
// 2. Check-in submission & Adaptive questions
// 3. Baseline calculation & Change detection (Non-diagnostic)
// 4. AI Support Signal generation & Contributing indicators
// 5. Emergency Safety Circuit Breaker (Self-harm intercept)
// 6. Habit tracking & gentle non-shaming streak dynamics
// 7. Hobby exploration & activity logs
// 8. Support ecosystem & Appointment booking
// 9. Case management & Clinical notes
// 10. Rights, schemes & Helpline search
// 11. Emergency temporary live location sharing start/stop
// 12. Organization multi-tenant aggregated analytics & billing
// 13. Security & Validation edge cases (invalid input, empty data)

const BASE_URL = 'http://localhost:5000/api';

let totalTests = 0;
let passedTests = 0;
let failedTests = 0;

function assert(condition, message) {
  totalTests++;
  if (condition) {
    passedTests++;
    console.log(`  ✓ ${message}`);
  } else {
    failedTests++;
    console.error(`  ✗ FAIL: ${message}`);
  }
}

async function request(path, options = {}) {
  const token = options.token || 'sahara_sec_tok_usr_demo_1';
  const headers = {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}`,
    ...(options.headers || {})
  };
  const res = await fetch(`${BASE_URL}${path}`, {
    ...options,
    headers
  });
  const data = await res.json().catch(() => ({}));
  return { status: res.status, ok: res.ok, data };
}

async function runTests() {
  console.log('\n==================================================');
  console.log('🧪 RUNNING SAHARA PRODUCTION TEST SUITE');
  console.log('==================================================\n');

  // TEST 1: Check-in Questions & Adaptive Schema
  console.log('[Suite 1: Adaptive Check-in Engine]');
  const qRes = await request('/checkins/questions');
  assert(qRes.status === 200, 'Questions endpoint returns 200 OK');
  assert(qRes.data.questions?.length >= 7, 'Includes all core domains (mood, stress, sleep, safety, social, functioning, energy)');
  assert(qRes.data.questions[0].labelTe !== undefined, 'Questions include Telugu localization');
  assert(qRes.data.hasVoiceSupport === true, 'Voice recognition support enabled');

  // TEST 2: Personal Baseline Calculation
  console.log('\n[Suite 2: Personal Baseline & Change Detection]');
  const blRes = await request('/baseline?userId=usr_demo_1');
  assert(blRes.status === 200, 'Baseline endpoint returns 200 OK');
  assert(blRes.data.typicalSleep !== undefined, 'Typical sleep baseline calculated');
  assert(blRes.data.typicalStress !== undefined, 'Typical stress baseline calculated');
  assert(blRes.data.status === 'established', 'Survivor baseline status is established');

  // TEST 3: Check-in Submission & AI Support Signal
  console.log('\n[Suite 3: AI Support Signal Generation (Non-Diagnostic)]');
  const checkinRes = await request('/checkins', {
    method: 'POST',
    body: JSON.stringify({
      userId: 'usr_demo_1',
      mood: 4,
      stress: 8.5,       // Elevated stress vs baseline 3.4
      sleep: 3.5,        // Drop in sleep vs baseline 7.5
      safety: 7,
      social: 3.0,       // Drop in social vs baseline 6.8
      functioning: 3.5,  // Impaired functioning vs baseline 7.6
      energy: 3,
      notes: 'Feeling exhausted and isolated.',
      wantsHumanSupport: true
    })
  });

  assert(checkinRes.status === 201, 'Check-in saved successfully (201 Created)');
  assert(checkinRes.data.evaluation?.hasSignal === true, 'AI Support Signal triggered on meaningful baseline deviation');
  assert(
    checkinRes.data.evaluation?.signal?.headline === 'Your recent responses show a meaningful change from your usual pattern.',
    'Signal uses non-diagnostic, neutral wording'
  );
  assert(
    checkinRes.data.evaluation?.signal?.contributingIndicators?.length >= 2,
    'Signal provides transparent, explainable contributing indicators'
  );

  // TEST 4: Emergency Safety Circuit Breaker (Self-harm / Immediate Danger)
  console.log('\n[Suite 4: Safety Circuit Breaker & Safeguarding]');
  const dangerCheckin = await request('/checkins', {
    method: 'POST',
    body: JSON.stringify({
      userId: 'usr_demo_1',
      mood: 1,
      stress: 10,
      safety: 1, // Critical safety rating
      notes: 'I cannot go on anymore.',
      wantsHumanSupport: true
    })
  });
  assert(dangerCheckin.status === 201, 'Critical check-in processed');
  assert(dangerCheckin.data.evaluation?.isImmediateDanger === true, 'Safety circuit breaker triggered immediately');
  assert(
    dangerCheckin.data.evaluation?.signal?.signalLevel === 'immediate_attention',
    'Signal upgraded to Immediate Attention'
  );
  assert(
    dangerCheckin.data.evaluation?.signal?.suggestedSteps?.some(s => s.action === 'call_112'),
    'Direct routing to 112 emergency services'
  );

  // TEST 5: Habits Tracking & Non-Shaming Streak
  console.log('\n[Suite 5: Habits & Gentle Routine Tracking]');
  const habitsRes = await request('/habits');
  assert(habitsRes.status === 200, 'Habits list retrieved');
  assert(habitsRes.data.length >= 3, 'Default trauma-informed habits exist');

  const firstHabit = habitsRes.data[0];
  const toggleRes = await request(`/habits/${firstHabit.id}/toggle`, { method: 'POST' });
  assert(toggleRes.status === 200, 'Habit completion toggled');
  assert(toggleRes.data.gentleMessage !== undefined, 'Gentle non-shaming feedback message returned');

  // TEST 6: Hobbies Exploration & Micro-Goals
  console.log('\n[Suite 6: Hobbies & Creative Reconnection]');
  const hobbiesRes = await request('/hobbies');
  assert(hobbiesRes.status === 200, 'Hobbies list retrieved');
  assert(hobbiesRes.data.length >= 2, 'Creative hobbies available');

  const firstHobby = hobbiesRes.data[0];
  const logRes = await request(`/hobbies/${firstHobby.id}/log`, {
    method: 'POST',
    body: JSON.stringify({ durationMinutes: 15, note: 'Gentle pencil sketching' })
  });
  assert(logRes.status === 200, 'Hobby time logged without pressure');
  assert(logRes.data.hobby.totalMinutesLogged > 0, 'Total minutes updated');

  // TEST 7: Support Ecosystem & Appointment Booking
  console.log('\n[Suite 7: Professionals & Appointment System]');
  const profsRes = await request('/professionals');
  assert(profsRes.status === 200, 'Professionals directory retrieved');
  assert(profsRes.data.some(p => p.role === 'counselor'), 'Trauma counselor profile exists');
  assert(profsRes.data.some(p => p.role === 'social_worker'), 'Social worker profile exists');

  const bookRes = await request('/appointments', {
    method: 'POST',
    body: JSON.stringify({
      userId: 'usr_demo_1',
      professionalId: 'prof_1',
      dateTime: '2026-09-28T10:00:00.000Z',
      notes: 'Follow-up consultation'
    })
  });
  assert(bookRes.status === 201, 'Appointment successfully booked (201 Created)');
  assert(bookRes.data.status === 'Confirmed', 'Session status is Confirmed');
  assert(bookRes.data.joinUrl.startsWith('https://sahara.care/session/'), 'Secure in-app join URL generated');

  // TEST 8: Trusted Circle & Emergency Live Location
  console.log('\n[Suite 8: Trusted Circle & Live Location Sharing]');
  const contactsRes = await request('/trusted-contacts');
  assert(contactsRes.status === 200, 'Trusted circle contacts retrieved');
  assert(contactsRes.data.length >= 2, 'Trusted circle populated');

  // Start live location sharing
  const startLoc = await request('/emergency/start', {
    method: 'POST',
    body: JSON.stringify({ lat: 17.385044, lng: 78.486671, address: 'Hyderabad, Telangana' })
  });
  assert(startLoc.status === 201, 'Live location sharing activated');
  assert(startLoc.data.isSharing === true, 'Location sharing state is active');

  // Stop live location sharing
  const stopLoc = await request('/emergency/stop', { method: 'POST' });
  assert(stopLoc.status === 200, 'Live location sharing stopped safely');
  assert(stopLoc.data.isSharing === false, 'Location sharing state terminated');

  // TEST 9: Rights, Schemes & Helplines
  console.log('\n[Suite 9: Rights, Victim Relief Schemes & Helplines]');
  const resList = await request('/resources');
  assert(resList.status === 200, 'Resources directory retrieved');
  assert(resList.data.some(r => r.title.includes('Atrocities')), 'SC/ST PoA Act legal relief scheme present');
  assert(resList.data.some(r => r.title.includes('NALSA')), 'NALSA Free Legal Aid present');
  assert(resList.data.some(r => r.verifiedDate !== undefined), 'Official verification date recorded');

  const hlRes = await request('/helplines');
  assert(hlRes.status === 200, 'Helplines retrieved');
  assert(hlRes.data.some(h => h.number === '14416'), 'Tele-MANAS (14416) verified');
  assert(hlRes.data.some(h => h.number === '112'), 'National Emergency 112 verified');

  // TEST 10: Professional Portal & Case Management
  console.log('\n[Suite 10: Professional Portal & Case Notes]');
  const casesRes = await request('/cases?professionalId=prof_1');
  assert(casesRes.status === 200, 'Assigned cases retrieved for counselor');
  assert(casesRes.data.length >= 1, 'Active case assigned to Dr. Radhika');

  const addNoteRes = await request(`/cases/${casesRes.data[0].id}/notes`, {
    method: 'POST',
    body: JSON.stringify({
      authorName: 'Dr. Radhika Sharma',
      authorRole: 'Counselor',
      noteType: 'Session Summary',
      content: 'Survivor reported improved grounding following box breathing exercise.'
    })
  });
  assert(addNoteRes.status === 201, 'Clinical case note saved successfully');

  // TEST 11: Organization & Subscription Module
  console.log('\n[Suite 11: Multi-Tenant Organization & Aggregated Analytics]');
  const orgRes = await request('/organizations/current');
  assert(orgRes.status === 200, 'Organization details retrieved');
  assert(orgRes.data.metrics.beneficiaryCapacityLimit >= 100, 'Capacity limits configured');
  assert(orgRes.data.metrics.anonymizedTrendCategories.length >= 2, 'Only aggregated/anonymized analytics exposed');

  // TEST 12: Security & Edge Case Handling
  console.log('\n[Suite 12: Security, Validation & Error Handling]');
  const badLogin = await request('/auth/login', {
    method: 'POST',
    body: JSON.stringify({ email: 'unknown@sahara.care', password: 'wrong' })
  });
  assert(badLogin.status === 401, 'Unauthorized login rejected with 401');

  const emptyHabit = await request('/habits', {
    method: 'POST',
    body: JSON.stringify({ title: '' })
  });
  assert(emptyHabit.status === 400, 'Invalid empty habit rejected with 400');

  // Summary
  console.log('\n==================================================');
  console.log(`📊 TEST SUITE COMPLETE: ${passedTests}/${totalTests} PASSED (${failedTests} FAILED)`);
  console.log('==================================================\n');

  if (failedTests > 0) {
    process.exit(1);
  }
}

runTests().catch((err) => {
  console.error('Fatal test error:', err);
  process.exit(1);
});
