import { findDeltaCharPositionInString } from './TextTools';

test('findDeltaCharFindsDelta at start of string', () => {
    const delta = findDeltaCharPositionInString('test', 'atest');
    expect(delta.start).toBe(0);
    expect(delta.end).toBe(0);
    expect(delta.delta).toBe('a');

    const delta2 = findDeltaCharPositionInString('test', 'aTtest');
    expect(delta2.start).toBe(0);
    expect(delta2.end).toBe(1);
    expect(delta2.delta).toBe('aT');
});

test('findDeltaCharFindsDelta at end of string', () => {
    const delta = findDeltaCharPositionInString('test', 'testa');
    expect(delta.start).toBe(4);
    expect(delta.end).toBe(4);
    expect(delta.delta).toBe('a');

    const delta2 = findDeltaCharPositionInString('test', 'testta');
    expect(delta2.start).toBe(4);
    expect(delta2.end).toBe(5);
    expect(delta2.delta).toBe('ta');
});

test('findDeltaCharFindsDelta in the middle', () => {
    const delta = findDeltaCharPositionInString('test', 'tetst');
    expect(delta.start).toBe(2);
    expect(delta.end).toBe(2);
    expect(delta.delta).toBe('t');

    const delta2 = findDeltaCharPositionInString('test', 'tetast');
    expect(delta2.start).toBe(2);
    expect(delta2.end).toBe(3);
    expect(delta2.delta).toBe('ta');
});