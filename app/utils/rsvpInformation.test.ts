import { describe, expect, it } from 'vitest';
import { parseRsvpInformation } from './rsvpInformation';
describe('RSVP wedding information', () => {
  it('preserves wedding-local times and plain text without converting them', () => {
    const config={version:1,weddingDate:'2027-03-28',ceremonyTime:'02:30',parking:'<img src=x onerror=alert(1)>',faq:[{question:'Children?',answer:'Yes'}]};
    expect(parseRsvpInformation(config)).toEqual(config);
    expect(parseRsvpInformation(config)).not.toBe(config);
  });
  it('supports older responses and rejects unsafe or unsupported data', () => {
    expect(parseRsvpInformation(undefined)).toBeNull();
    for(const invalid of [{version:2},{version:1,rsvpToken:'secret'},{version:1,travelLink:'javascript:alert(1)'},{version:1,travelLink:'https://user:pass@example.com'},{version:1,weddingDate:'2027-02-30'},{version:1,ceremonyTime:'24:00'},{version:1,parking:'x'.repeat(1201)},{version:1,faq:[{question:'',answer:'yes'}]}]) expect(parseRsvpInformation(invalid)).toBeNull();
  });
});
