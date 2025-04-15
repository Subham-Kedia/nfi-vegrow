import { render } from 'test-utils';

import AppLoader from './index';

test('should renders App Loader', () => {
  const { getByRole } = render(<AppLoader />);
  expect(getByRole('progressbar')).toBeDefined();
  expect(getByRole('progressbar')).toHaveStyle(`width: 35px`);
});
