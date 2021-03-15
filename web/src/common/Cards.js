import { Card, Result, Progress, Row, Col, Typography } from 'antd';
import './Cards.css';

const { Text } = Typography;


const StatusCard = (props) => (
    <Card title={props.title} className='status-card normal-width normal-height'>
        <Row justify="space-around" align="middle" style={{ height: '100%' }}>
            <Col span={24}>
                <Result
                    status={props.status}
                    title={props.text}
                />
            </Col>
        </Row>
    </Card>
);

const HealthCount = (props) => (
    <Card title={props.title} className='status-card normal-width normal-height'>
        <Row justify="space-around" align="middle" style={{ height: '100%' }}>
            <Col span={24}>
                <Progress
                    type="circle"
                    percent={props.healthy / props.total * 100}
                    format={_ => `${props.healthy} / ${props.total}`}
                />
            </Col>
        </Row>
    </Card>
);

const ValueCard = (props) => (
    <Card title={props.title} className='status-card normal-width normal-height'>
        <Row justify="space-around" align="middle" style={{ height: '100%' }}>
            <Col span={24}>
                <Text strong={true} style={{ fontSize: 24 }}>{props.value}</Text>
            </Col>
        </Row>
    </Card>
);

const BigProgress = (props) => (
    <Card title={props.title} className='status-card double-width normal-height'>
        <Row justify="space-around" align="bottom" style={{ height: '50%' }}>
            <Col span={24}>
                <Progress
                    status={props.completed < props.total ?  "active" : null}
                    percent={props.completed / props.total * 100}
                />
            </Col>
        </Row>
        <Row justify="space-around" align="top" style={{ height: '50%' }}>
            <Col span={24}>
                <Text strong={true} style={{ fontSize: 24 }}>
                    {props.completed} / {props.total} {props.unit}
                </Text>
            </Col>
        </Row>
    </Card>
);

const FlexibleCard = (props) => (
    <Card title={props.title} className='status-card'>
        <Row justify="space-around" align="middle" style={{ height: '100%' }}>
            <Col span={24}>
                {props.children}
            </Col>
        </Row>
    </Card>
)

export { StatusCard, HealthCount, ValueCard, BigProgress, FlexibleCard };
