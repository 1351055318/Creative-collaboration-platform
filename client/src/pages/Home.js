import React from 'react';
import { Typography, Button, Row, Col, Card, Space, Divider } from 'antd';
import { Link } from 'react-router-dom';
import {
  BulbOutlined,
  TeamOutlined,
  RocketOutlined,
  AppstoreOutlined
} from '@ant-design/icons';
import styled from 'styled-components';

const { Title, Paragraph } = Typography;

const HeroSection = styled.div`
  text-align: center;
  padding: 60px 20px;
  background: linear-gradient(135deg, #1890ff 0%, #722ed1 100%);
  color: white;
  border-radius: 8px;
  margin-bottom: 40px;
`;

const FeatureCard = styled(Card)`
  margin-bottom: 24px;
  height: 100%;
  .ant-card-head-title {
    display: flex;
    align-items: center;
  }
  .icon {
    font-size: 24px;
    margin-right: 8px;
  }
`;

const Home = () => {
  return (
    <div>
      <HeroSection className="hero-section">
        <Title level={1} style={{ color: 'white', marginBottom: 16 }}>
          灵感花园 - 创意协作平台
        </Title>
        <Paragraph style={{ fontSize: 18, color: 'white', marginBottom: 24 }}>
          在这里，您的创意可以生根发芽，与志同道合的伙伴共同成长
        </Paragraph>
        <Space size="middle">
          <Button type="primary" size="large" ghost>
            <Link to="/register">立即注册</Link>
          </Button>
          <Button size="large" type="default" style={{ background: 'white' }}>
            <Link to="/login">登录</Link>
          </Button>
        </Space>
      </HeroSection>

      <Title level={2} style={{ textAlign: 'center', marginBottom: 40 }}>
        为什么选择灵感花园
      </Title>

      <Row gutter={[24, 24]}>
        <Col xs={24} sm={12} lg={6}>
          <FeatureCard
            className="feature-card"
            title={
              <>
                <BulbOutlined className="icon" />
                创意孵化
              </>
            }
          >
            <Paragraph>
              捕捉灵感的火花，记录并发展您的创意想法，使用数字工具将它们变为现实。
            </Paragraph>
          </FeatureCard>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <FeatureCard
            className="feature-card"
            title={
              <>
                <TeamOutlined className="icon" />
                协作无间
              </>
            }
          >
            <Paragraph>
              与志同道合的创意人共同合作，分享想法，实时协作，创造更大的价值。
            </Paragraph>
          </FeatureCard>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <FeatureCard
            className="feature-card"
            title={
              <>
                <AppstoreOutlined className="icon" />
                多媒体支持
              </>
            }
          >
            <Paragraph>
              支持文字、图片、视频和音频等多种媒体形式，全方位展示您的创意作品。
            </Paragraph>
          </FeatureCard>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <FeatureCard
            className="feature-card"
            title={
              <>
                <RocketOutlined className="icon" />
                项目落地
              </>
            }
          >
            <Paragraph>
              从创意萌芽到最终执行，平台提供全流程支持，帮助项目成功落地。
            </Paragraph>
          </FeatureCard>
        </Col>
      </Row>

      <Divider />

      <div style={{ textAlign: 'center', margin: '40px 0' }}>
        <Title level={2}>准备好开始您的创意之旅了吗？</Title>
        <Paragraph style={{ fontSize: 16, marginBottom: 24 }}>
          加入灵感花园，与全球创意人一起，让您的想法开花结果。
        </Paragraph>
        <Button type="primary" size="large">
          <Link to="/register">立即开始</Link>
        </Button>
      </div>
    </div>
  );
};

export default Home; 