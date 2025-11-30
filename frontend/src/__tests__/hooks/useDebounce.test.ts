import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { act, renderHook, waitFor } from '@testing-library/react';
import { useDebounce } from '../../hooks/useDebounce';

describe('useDebounce', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('should return initial value immediately', () => {
    const { result } = renderHook(() => useDebounce('test', 300));
    expect(result.current).toBe('test');
  });

  it('should debounce value changes', async () => {
    const { result, rerender } = renderHook(
      ({ value }) => useDebounce(value, 300),
      {
        initialProps: { value: 'test' },
      }
    );

    expect(result.current).toBe('test');

    rerender({ value: 'test2' });
    expect(result.current).toBe('test'); // Still old value

    act(() => {
      vi.advanceTimersByTime(300);
    });

    expect(result.current).toBe('test2');
  });

  it('should use custom delay', async () => {
    const { result, rerender } = renderHook(
      ({ value }) => useDebounce(value, 500),
      {
        initialProps: { value: 'test' },
      }
    );

    rerender({ value: 'test2' });
    act(() => {
      vi.advanceTimersByTime(300);
    });
    expect(result.current).toBe('test'); // Still old value
    act(() => {
      vi.advanceTimersByTime(200);
    });
    expect(result.current).toBe('test2');
  });

  it('should cancel previous timeout on new value', async () => {
    const { result, rerender } = renderHook(
      ({ value }) => useDebounce(value, 300),
      {
        initialProps: { value: 'test' },
      }
    );

    rerender({ value: 'test2' });
    act(() => {
      vi.advanceTimersByTime(200);
    });

    rerender({ value: 'test3' });
    act(() => {
      vi.advanceTimersByTime(200);
    });

    expect(result.current).toBe('test'); // Still original

    act(() => {
      vi.advanceTimersByTime(100);
    });
    expect(result.current).toBe('test3'); // Should be latest value
  });
});

