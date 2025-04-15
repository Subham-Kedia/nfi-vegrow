import { render, screen } from 'test-utils';

import RenderApp from './RenderApp';

describe('Render App', () => {
  it('should renders App', () => {
    render(<RenderApp />);
    expect(screen.getByTestId('app')).toBeDefined();
  });
});
