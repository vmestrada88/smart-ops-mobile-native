/**
 * @format
 */

import React from 'react';
import { render, screen } from '@testing-library/react-native';
import App from '../App';

describe('App Component', () => {
  test('renders login screen initially', () => {
    render(<App />);
    
    // Should show the app title
    expect(screen.getByText('Smart Ops')).toBeTruthy();
  });

  test('displays login form elements', () => {
    render(<App />);
    
    // Should have email and password inputs
    expect(screen.getByPlaceholderText('Email')).toBeTruthy();
    expect(screen.getByPlaceholderText('Password')).toBeTruthy();
  });

  test('shows login and guest buttons', () => {
    render(<App />);
    
    // Should show both login options
    expect(screen.getByText('Login')).toBeTruthy();
    expect(screen.getByText('Continue as Guest')).toBeTruthy();
  });

  test('displays forgot password link', () => {
    render(<App />);
    
    expect(screen.getByText('Forgot Password?')).toBeTruthy();
  });
});
