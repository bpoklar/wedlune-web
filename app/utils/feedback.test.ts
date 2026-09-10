import { describe, expect, it } from 'vitest';
import { feedbackCategories, feedbackSchema } from './feedback';

const valid = { category: 'general', message: 'This is helpful feedback.' };

describe('website feedback contract', () => {
  it('normalizes optional fields and trims input', () => {
    expect(feedbackSchema.parse({ ...valid, message: `  ${valid.message}  `, email: '  ' })).toEqual({
      ...valid, rating: null, email: null, website: '',
    });
    expect(feedbackSchema.parse({ ...valid, email: ' test@example.com ', rating: 5 })).toMatchObject({ email: 'test@example.com', rating: 5 });
  });

  it.each(feedbackCategories)('accepts Flutter category %s', (category) => {
    expect(feedbackSchema.safeParse({ ...valid, category }).success).toBe(true);
  });

  it.each([10, 2000])('accepts a %i-character message', (length) => {
    expect(feedbackSchema.safeParse({ ...valid, message: 'a'.repeat(length) }).success).toBe(true);
  });

  it.each([null, 1, 2, 3, 4, 5])('accepts rating %s', (rating) => {
    expect(feedbackSchema.safeParse({ ...valid, rating }).success).toBe(true);
  });

  it.each([
    { message: '' }, { message: ' '.repeat(20) }, { message: 'too short' },
    { message: 'a'.repeat(2001) }, { message: 123 }, { category: 'other' },
    { rating: 0 }, { rating: 6 }, { rating: 1.5 }, { rating: '5' },
    { email: 'invalid' }, { email: `${'a'.repeat(245)}@example.com` },
    { website: 'spam' }, { user_id: 'forged-user' }, { wedding_id: null },
    { source: 'app' }, { created_at: '2026-09-10' }, { contact_email: 'test@example.com' },
  ])('rejects invalid or privileged input %j', (input) => {
    expect(feedbackSchema.safeParse({ ...valid, ...input }).success).toBe(false);
  });

  it('measures text consistently with the Flutter UTF-16 length limit', () => {
    expect(feedbackSchema.safeParse({ ...valid, message: '💛'.repeat(1000) }).success).toBe(true);
    expect(feedbackSchema.safeParse({ ...valid, message: '💛'.repeat(1001) }).success).toBe(false);
  });
});
