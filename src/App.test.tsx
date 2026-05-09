import { fireEvent, render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';

import App from './App';

describe('App', () => {
  it('renders lesson and reflection panels for the current challenge', () => {
    render(<App />);

    expect(screen.getByRole('heading', { name: '오늘의 실험' })).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: '관찰 기록' })).toBeInTheDocument();
    expect(screen.getByText(/거북이가 한 바퀴 360도를 나누어 돈다/)).toBeInTheDocument();
  });

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

    const commandList = screen.getByRole('list', { name: '현재 블록 목록' });
    const before = commandList.querySelectorAll('li').length;

    await user.click(screen.getByRole('button', { name: '색상 적용' }));
    const after = commandList.querySelectorAll('li').length;

    expect(after).toBe(before + 1);
    const colorInput = within(commandList).getByDisplayValue('#1f7a5c');
    expect(colorInput).toHaveAttribute('type', 'color');
  });

  it('keeps previous result until run is clicked again after command edits', async () => {
    const user = userEvent.setup();

    render(<App />);

    await user.click(screen.getByRole('button', { name: '정사각형 불러오기' }));
    await user.click(screen.getByRole('button', { name: '실행' }));

    expect(screen.getByRole('status')).toHaveTextContent('실행 결과: 선분 4개');

    await user.click(screen.getByRole('button', { name: '이동 추가' }));
    expect(screen.getByRole('status')).toHaveTextContent('실행 결과: 선분 4개');

    await user.click(screen.getByRole('button', { name: '실행' }));
    expect(screen.getByRole('status')).toHaveTextContent('실행 결과: 선분 5개');
  });

  it('starts free drawing and adds move and turn commands with custom values', async () => {
    const user = userEvent.setup();

    render(<App />);

    await user.click(screen.getByRole('button', { name: '자유 도형 그리기' }));

    expect(screen.getByText('명령이 없습니다.')).toBeInTheDocument();
    expect(
      screen.getByText(/이동거리와 회전각을 직접 정해 나만의 도형 명령/),
    ).toBeInTheDocument();

    const builder = screen.getByRole('group', { name: '새 명령 만들기' });
    const moveDistanceInput = within(builder).getByRole('spinbutton', {
      name: '이동거리',
    });
    fireEvent.change(moveDistanceInput, { target: { value: '120' } });
    await user.click(within(builder).getByRole('button', { name: '이동 추가' }));

    const turnDegreesInput = within(builder).getByRole('spinbutton', {
      name: '회전 각도',
    });
    fireEvent.change(turnDegreesInput, { target: { value: '45' } });
    await user.selectOptions(
      within(builder).getByRole('combobox', { name: '방향' }),
      'left',
    );
    await user.click(within(builder).getByRole('button', { name: '회전 추가' }));

    const commandList = screen.getByRole('list', { name: '현재 블록 목록' });
    expect(within(commandList).getByDisplayValue('120')).toBeInTheDocument();
    expect(within(commandList).getByDisplayValue('45')).toBeInTheDocument();
    expect(within(commandList).getByRole('combobox', { name: '방향' })).toHaveValue(
      'left',
    );

    await user.click(screen.getByRole('button', { name: '실행' }));
    expect(screen.getByRole('status')).toHaveTextContent('실행 결과: 선분 1개');
  });

  it('allows editing repeat polygon fields and updates drawing only after rerun', async () => {
    const user = userEvent.setup();

    render(<App />);

    await user.click(screen.getByRole('button', { name: '정사각형 불러오기' }));
    await user.click(screen.getByRole('button', { name: '실행' }));

    expect(screen.getByRole('status')).toHaveTextContent('실행 결과: 선분 4개');

    const repeatCountInput = screen.getByRole('spinbutton', {
      name: '반복 횟수',
    });
    fireEvent.change(repeatCountInput, { target: { value: '5' } });
    expect(repeatCountInput).toHaveValue(5);

    expect(screen.getByRole('status')).toHaveTextContent('실행 결과: 선분 4개');

    await user.click(screen.getByRole('button', { name: '실행' }));
    expect(screen.getByRole('status')).toHaveTextContent('실행 결과: 선분 5개');
  });

  it('requests png export when PNG 저장 is clicked', async () => {
    const user = userEvent.setup();

    const toDataURLSpy = vi
      .spyOn(HTMLCanvasElement.prototype, 'toDataURL')
      .mockReturnValue('data:image/png;base64,test');
    const anchorClickSpy = vi.spyOn(HTMLAnchorElement.prototype, 'click').mockImplementation(() => {});

    render(<App />);

    await user.click(screen.getByRole('button', { name: '정사각형 불러오기' }));
    await user.click(screen.getByRole('button', { name: '실행' }));
    await user.click(screen.getByRole('button', { name: 'PNG 저장' }));

    expect(toDataURLSpy).toHaveBeenCalledWith('image/png');
    expect(anchorClickSpy).toHaveBeenCalled();

    toDataURLSpy.mockRestore();
    anchorClickSpy.mockRestore();
  });
});
