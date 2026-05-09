export type TurnDirection = 'left' | 'right';

export type TurtleCommand =
  | { type: 'move'; distance: number }
  | { type: 'turn'; direction: TurnDirection; degrees: number }
  | { type: 'penColor'; color: string }
  | { type: 'repeat'; times: number; commands: TurtleCommand[] };

export type TurtleState = {
  x: number;
  y: number;
  heading: number;
  penColor: string;
};

export type DrawSegment = {
  from: { x: number; y: number };
  to: { x: number; y: number };
  color: string;
};

export type TurtleProgramResult = {
  segments: DrawSegment[];
  finalState: TurtleState;
};

const DEFAULT_STATE: TurtleState = {
  x: 0,
  y: 0,
  heading: 0,
  penColor: '#1f7a5c',
};

export function runTurtleProgram(
  commands: TurtleCommand[],
  initialState: TurtleState = DEFAULT_STATE,
): TurtleProgramResult {
  const segments: DrawSegment[] = [];
  const finalState = commands.reduce(
    (state, command) => executeCommand(command, state, segments),
    { ...initialState },
  );

  return { segments, finalState };
}

function executeCommand(
  command: TurtleCommand,
  state: TurtleState,
  segments: DrawSegment[],
): TurtleState {
  if (command.type === 'move') {
    const radians = (state.heading * Math.PI) / 180;
    const nextState = {
      ...state,
      x: state.x + Math.cos(radians) * command.distance,
      y: state.y + Math.sin(radians) * command.distance,
    };

    segments.push({
      from: { x: state.x, y: state.y },
      to: { x: nextState.x, y: nextState.y },
      color: state.penColor,
    });

    return nextState;
  }

  if (command.type === 'turn') {
    const signedDegrees =
      command.direction === 'right' ? command.degrees : -command.degrees;

    return {
      ...state,
      heading: normalizeDegrees(state.heading + signedDegrees),
    };
  }

  if (command.type === 'penColor') {
    return { ...state, penColor: command.color };
  }

  return Array.from({ length: command.times }).reduce<TurtleState>(
    (repeatState) =>
      command.commands.reduce(
        (innerState, innerCommand) =>
          executeCommand(innerCommand, innerState, segments),
        repeatState,
      ),
    state,
  );
}

function normalizeDegrees(degrees: number) {
  return ((degrees % 360) + 360) % 360;
}
