import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it } from 'vitest';

import App from './App';

describe('App', () => {
  it('loads the square challenge and runs geometry facts after execute', async () => {
    const user = userEvent.setup();

    render(<App />);

    await user.click(screen.getByRole('button', { name: '정사각형 불러오기' }));
    await user.click(screen.getByRole('button', { name: '실행' }));

    expect(screen.getByRole('status')).toHaveTextContent('실행 결과: 선분 4개');
    expect(screen.getByLabelText('정다각형 수학 공식')).toHaveTextContent(/외각\s*90도/);
  });

  it('adds a color command when 색상 적용 is clicked', async () => {
    const user = userEvent.setup();

    render(<App />);

    await user.click(screen.getByRole('button', { name: '색상 적용' }));
    expect(screen.getByText('펜 색상 #1f7a5c')).toBeInTheDocument();
  });

  it('keeps previous result until run is clicked again after command edits', async () => {
    const user = userEvent.setup();

    render(<App />);

    await user.click(screen.getByRole('button', { name: '정사각형 불러오기' }));
    await user.click(screen.getByRole('button', { name: '실행' }));

    expect(screen.getByRole('status')).toHaveTextContent('실행 결과: 선분 4개');

    await user.click(screen.getByRole('button', { name: '앞으로 이동 추가' }));
    expect(screen.getByRole('status')).toHaveTextContent('실행 결과: 선분 4개');

    await user.click(screen.getByRole('button', { name: '실행' }));
    expect(screen.getByRole('status')).toHaveTextContent('실행 결과: 선분 5개');
  });
});
