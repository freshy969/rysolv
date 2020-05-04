import React from 'react';
import T from 'prop-types';

import { ConditionalRender } from 'components/base_ui';

import DesktopHeader from './DesktopHeader';
import MobileHeader from './MobileHeader';

const Header = ({ activeUser, handleLogin, handleLogout, view }) => {
  const isMobile = view === 'mobile';

  return (
    <ConditionalRender
      Component={MobileHeader}
      FallbackComponent={DesktopHeader}
      propsToPassDown={{
        activeUser,
        handleLogin,
        handleLogout,
        isMobile,
        view,
      }}
      shouldRender={isMobile}
    />
  );
};

Header.propTypes = {
  activeUser: T.object,
  handleLogin: T.func,
  handleLogout: T.func,
  view: T.string,
};

export default Header;
