import { isCollapsedSelectionInsert, isCollapsedSelectionDelete } from './EditorTools';

test('isCollapsedSelectionInsert works for start of the string', () => {
    expect(isCollapsedSelectionInsert('test', 'atest', 0).newChar).toBe('a');
    expect(isCollapsedSelectionInsert('test', 'taest', 0)).toBe(undefined);
});

test('isCollapsedSelectionInsert works for middle of a string', () => {
    expect(isCollapsedSelectionInsert('test', 'teast', 2).newChar).toBe('a');
});

test('isCollapsedSelectionDelete works for middle of the string', () => {
   const change = isCollapsedSelectionDelete('test', 'tet', 3);
   expect(change.start).toBe('te');
   expect(change.end).toBe('t');
   expect(change.deletedChar).toBe('s');
});

test('isCollapsedSelectionDelete works for end of the string', () => {
    const change = isCollapsedSelectionDelete('test', 'tet', 3);
    expect(change.start).toBe('te');
    expect(change.end).toBe('t');
    expect(change.deletedChar).toBe('s');
 });