import Throttle from '../../src/core/utils/modules/throttleFn';
describe('节流', () => {
  test('同步调用', () => {
    const callback = jest.fn();
    const fn = Throttle(callback);
    fn(1);
    fn(2);
    fn(3);
    fn(4);
    const calls = callback.mock.calls;
    expect(calls.length).toBe(1);
  });
  test('立即执行', () => {
    const callback = jest.fn();
    const fn = Throttle(callback, { immediate: true });
    fn(1);
    fn(2);
    fn(3);
    fn(4);
    const calls = callback.mock.calls;
    expect(calls.length).toBe(2);
  });
});
