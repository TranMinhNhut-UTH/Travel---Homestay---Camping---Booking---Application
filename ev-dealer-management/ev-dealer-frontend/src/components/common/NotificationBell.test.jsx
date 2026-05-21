import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { act } from 'react-dom/test-utils';
import NotificationBell from './NotificationBell';

// Mock WebSocket
class MockWebSocket {
  constructor(url) {
    this.url = url;
    this.onmessage = null;
    this.onopen = null;
    this.onerror = null;
  }

  close() {}
}

global.WebSocket = MockWebSocket;

// Mock fetch
global.fetch = jest.fn();

describe('NotificationBell Component', () => {
  beforeEach(() => {
    fetch.mockClear();
    // Mock successful API response
    fetch.mockImplementation(() =>
      Promise.resolve({
        json: () =>
          Promise.resolve([
            {
              id: 1,
              title: 'Test Notification',
              message: 'This is a test',
              read: false,
              createdAt: new Date().toISOString(),
            },
          ]),
      })
    );
  });

  it('renders notification bell with badge', async () => {
    render(<NotificationBell />);
    
    expect(screen.getByRole('button')).toBeInTheDocument();
    expect(screen.getByLabelText(/Notifications/)).toBeInTheDocument();
  });

  it('shows notifications dropdown when clicked', async () => {
    render(<NotificationBell />);
    
    const bell = screen.getByRole('button');
    fireEvent.click(bell);
    
    await waitFor(() => {
      expect(screen.getByText('Test Notification')).toBeInTheDocument();
    });
  });

  it('marks notification as read when clicked', async () => {
    render(<NotificationBell />);
    
    const bell = screen.getByRole('button');
    fireEvent.click(bell);
    
    await waitFor(() => {
      const notification = screen.getByText('Test Notification');
      fireEvent.click(notification);
    });
    
    expect(fetch).toHaveBeenCalledWith(
      expect.stringContaining('/api/notifications/1/read'),
      expect.objectContaining({ method: 'PATCH' })
    );
  });

  it('handles WebSocket messages correctly', async () => {
    render(<NotificationBell />);
    
    const ws = new MockWebSocket('test');
    
    act(() => {
      ws.onmessage({
        data: JSON.stringify({
          id: 2,
          title: 'New WebSocket Notification',
          message: 'Real-time notification',
          read: false,
          createdAt: new Date().toISOString(),
        }),
      });
    });
    
    const bell = screen.getByRole('button');
    fireEvent.click(bell);
    
    await waitFor(() => {
      expect(screen.getByText('New WebSocket Notification')).toBeInTheDocument();
    });
  });

  it('updates unread count correctly', async () => {
    render(<NotificationBell />);
    
    await waitFor(() => {
      expect(screen.getByText('1')).toBeInTheDocument();
    });
    
    const bell = screen.getByRole('button');
    fireEvent.click(bell);
    
    const notification = await screen.findByText('Test Notification');
    fireEvent.click(notification);
    
    await waitFor(() => {
      expect(screen.queryByText('1')).not.toBeInTheDocument();
    });
  });
});