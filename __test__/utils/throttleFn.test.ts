import Throttle from '../../src/core/utils/modules/throttleFn';
test('节流', () => {
  const callback = jest.fn();
  const fn = Throttle(callback);
  fn(1);
  fn(2);
  fn(3);
  fn(4);
  const calls = callback.mock.calls;
  expect(calls.length).toBe(1);
});
