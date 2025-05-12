import { render, screen, fireEvent } from '@testing-library/react';
import SearchInput from './SearchInput';
import { describe, it, expect, vi } from 'vitest';

describe('SearchInput', () => {
  it('renders an input field and a search button', () => {
    const mockOnSearch = vi.fn();
    render(<SearchInput onSearch={mockOnSearch} />);
    const inputElement = screen.getByRole('textbox');
    expect(inputElement).toBeInTheDocument();
    const buttonElement = screen.getByRole('button', { name: /search/i });
    expect(buttonElement).toBeInTheDocument();
  });

  it('updates input value on user typing', () => {
    const mockOnSearch = vi.fn();
    render(<SearchInput onSearch={mockOnSearch} />);
    const inputElement = screen.getByRole('textbox') as HTMLInputElement;
    fireEvent.change(inputElement, { target: { value: 'test query' } });
    expect(inputElement.value).toBe('test query');
  });

  it('calls onSearch with the query when search button is clicked', () => {
    const mockOnSearch = vi.fn();
    render(<SearchInput onSearch={mockOnSearch} />);
    const inputElement = screen.getByRole('textbox');
    const buttonElement = screen.getByRole('button', { name: /search/i });

    fireEvent.change(inputElement, { target: { value: 'specific query' } });
    fireEvent.click(buttonElement);

    expect(mockOnSearch).toHaveBeenCalledTimes(1);
    expect(mockOnSearch).toHaveBeenCalledWith('specific query');
  });

  it('calls onSearch with the query when Enter key is pressed in the input', () => {
    const mockOnSearch = vi.fn();
    render(<SearchInput onSearch={mockOnSearch} />);
    const inputElement = screen.getByRole('textbox');
    
    fireEvent.change(inputElement, { target: { value: 'enter query' } });
    fireEvent.keyDown(inputElement, { key: 'Enter', code: 'Enter', charCode: 13 });
    
    expect(mockOnSearch).toHaveBeenCalledTimes(1);
    expect(mockOnSearch).toHaveBeenCalledWith('enter query');
  });

  it('calls onSearch with an empty string if input is empty and search is triggered', () => {
    const mockOnSearch = vi.fn();
    render(<SearchInput onSearch={mockOnSearch} />);
    const buttonElement = screen.getByRole('button', { name: /search/i });
    fireEvent.click(buttonElement);
    expect(mockOnSearch).toHaveBeenCalledTimes(1);
    expect(mockOnSearch).toHaveBeenCalledWith('');
  });

});