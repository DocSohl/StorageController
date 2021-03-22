import { Card, Result, Progress, Row, Col, Typography } from 'antd';
import './Cards.css';
import { useState, useEffect } from "react";
import {FileTypeDistribution, StoragePie} from "../dashboard_components/StorageUsage";

const { Text } = Typography;


const StatusCard = (props) => {
    const [isLoaded, setIsLoaded] = useState(false);
    const [items, setItems] = useState({'status': 'info', 'text': 'Not Loaded'});

    useEffect(() => {
        fetch(props.endpoint)
            .then(res => res.json())
            .then(
                (result) => {
                    setIsLoaded(true);
                    setItems(result);
                },
                (error) => {
                    setIsLoaded(true);
                    setItems({'status': 'warning', 'text': "Couldn't Load"});
                }
            )
    }, [])

    return <Card title={props.title} className='status-card normal-width normal-height' loading={!isLoaded}>
        <Row justify="space-around" align="middle" style={{height: '100%'}}>
            <Col span={24}>
                <Result
                    status={items.status}
                    title={items.text}
                />
            </Col>
        </Row>
    </Card>
};

const HealthCount = (props) => {
    const [isLoaded, setIsLoaded] = useState(false);
    const [items, setItems] = useState({ healthy: 0, total: 0 });

    useEffect(() => {
        fetch(props.endpoint)
            .then(res => res.json())
            .then(
                (result) => {
                    setIsLoaded(true);
                    setItems(result);
                },
                (error) => {
                    setIsLoaded(true);
                    setItems({ healthy: 0, total: 0 });
                }
            )
    }, [])

    return <Card title={props.title} className='status-card normal-width normal-height' loading={!isLoaded}>
        <Row justify="space-around" align="middle" style={{ height: '100%' }}>
            <Col span={24}>
                <Progress
                    type="circle"
                    percent={items.healthy / items.total * 100}
                    format={_ => `${items.healthy} / ${items.total}`}
                />
            </Col>
        </Row>
    </Card>
};

const ValueCard = (props) => {
    const [isLoaded, setIsLoaded] = useState(false);
    const [items, setItems] = useState({ value: 'Not Loaded' });

    useEffect(() => {
        fetch(props.endpoint)
            .then(res => res.json())
            .then(
                (result) => {
                    setIsLoaded(true);
                    setItems(result);
                },
                (error) => {
                    setIsLoaded(true);
                    setItems({ value: "Couldn't Load" });
                }
            )
    }, [])

    return <Card title={props.title} className='status-card normal-width normal-height' loading={!isLoaded}>
        <Row justify="space-around" align="middle" style={{ height: '100%' }}>
            <Col span={24}>
                <Text strong={true} style={{ fontSize: 24 }}>{items.value}</Text>
            </Col>
        </Row>
    </Card>
};

const BigProgress = (props) => {
    const [isLoaded, setIsLoaded] = useState(false);
    const [items, setItems] = useState({ healthy: 0, total: 0, unit: '' });

    useEffect(() => {
        fetch(props.endpoint)
            .then(res => res.json())
            .then(
                (result) => {
                    setIsLoaded(true);
                    setItems(result);
                },
                (error) => {
                    setIsLoaded(true);
                    setItems({ healthy: 0, total: 0, unit: '' });
                }
            )
    }, [])

    return <Card title={props.title} className='status-card double-width normal-height' loading={!isLoaded}>
        <Row justify="space-around" align="bottom" style={{ height: '50%' }}>
            <Col span={24}>
                <Progress
                    status={items.completed < items.total ?  "active" : null}
                    percent={items.completed / items.total * 100}
                />
            </Col>
        </Row>
        <Row justify="space-around" align="top" style={{ height: '50%' }}>
            <Col span={24}>
                <Text strong={true} style={{ fontSize: 24 }}>
                    {items.completed} / {items.total} {items.unit}
                </Text>
            </Col>
        </Row>
    </Card>
};

const FlexibleCard = (props) => {
    const [isLoaded, setIsLoaded] = useState(false);
    const [items, setItems] = useState([{}]);

    useEffect(() => {
        fetch(props.endpoint)
            .then(res => res.json())
            .then(
                (result) => {
                    setIsLoaded(true);
                    setItems(result);
                },
                (error) => {
                }
            )
    }, [props])

    let rendered_component = '';
    if (isLoaded) {
        if (props.viz === 'StoragePie') {
            rendered_component = <StoragePie data={items} units={props.units} />
        }
        else if (props.viz === 'FileTypeDistribution') {
            rendered_component = <FileTypeDistribution data={items} units={props.units}/>
        }
        else {
            rendered_component = props.children;
        }
    }
    return <Card title={props.title} className='status-card' loading={!isLoaded}>
        <Row justify="space-around" align="middle" style={{ height: '100%' }}>
            <Col span={24}>
                {rendered_component}
            </Col>
        </Row>
    </Card>
}

export { StatusCard, HealthCount, ValueCard, BigProgress, FlexibleCard };
