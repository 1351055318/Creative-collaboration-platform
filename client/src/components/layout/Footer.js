import React from 'react';
import { Layout } from 'antd';
import styled from 'styled-components';

const { Footer: AntFooter } = Layout;

const StyledFooter = styled(AntFooter)`
  text-align: center;
  background: #f0f2f5;
  border-top: 1px solid #e8e8e8;
  padding: 16px;
`;

const Footer = () => {
  return (
    <StyledFooter>
      灵感花园 ©{new Date().getFullYear()} 创意协作平台
    </StyledFooter>
  );
};

export default Footer; 