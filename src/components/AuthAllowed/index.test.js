import React from 'react';
import { render } from 'test-utils';
import { SiteProvider } from 'App/SiteContext';
import { RESOURCES, ACTIONS } from 'Utilities/constants';
import AuthAllowed from './index';

test('should renders AuthAllowed', () => {
  const { getByText } = render(
    <SiteProvider
      value={{
        permissions: { '*': [{ action: '*' }] },
      }}
    >
      <AuthAllowed
        resource={RESOURCES.PURCHASE_ORDER}
        action={ACTIONS.CREATE}
        yes={() => <div>Allow me</div>}
      />
    </SiteProvider>,
  );
  expect(getByText('Allow me')).toBeDefined();
});
