import {Divider, PageHeader, Space, Radio, Card} from "antd";
import {BigProgress, FlexibleCard, HealthCount, StatusCard, ValueCard} from "../common/Cards";
import React from "react";
import { useState } from "react";
import './Dashboard.css';


const Dashboard = (props) => {
    const [units, setUnits] = useState('bytes');
    const [group, setGroup] = useState('tld');

    let storage_endpoint = '/dashboard/storage/counts?group=' + group;
    if (units === 'bytes') {
        storage_endpoint = '/dashboard/storage/usage?group='+group;
    }

    return <>
        <PageHeader
            className="site-page-header"
            title="Dashboard"
            subTitle="Current System Status"
        />

        <Divider orientation='left' style={{fontSize: 24}}>Health</Divider>
        <Space size='large' wrap={true}>
            <StatusCard title='Storage Health' endpoint='/dashboard/health/storage'/>
            <StatusCard title='Controller Health' endpoint='/dashboard/health/controller'/>
            <HealthCount title='Disks Healthy' endpoint='/dashboard/health/disks'/>
            <HealthCount title='Nodes Healthy' endpoint='/dashboard/health/nodes'/>
        </Space>

        <Divider orientation='left' style={{fontSize: 24}}>Backups</Divider>
        <Space size='large' wrap={true}>
            <StatusCard title='Backup Status' endpoint='/dashboard/backup/status'/>
            <ValueCard title='Next Backup' endpoint='/dashboard/backup/next'/>
            <ValueCard title='Upload Speed' endpoint='/dashboard/backup/speed'/>
            <BigProgress title='Backup Progress' endpoint='/dashboard/backup/progress'/>
        </Space>

        <Divider orientation='left' style={{fontSize: 24}}>Storage</Divider>
        <Space size='small'>
            <Card title="Statistic" bordered={false} className='status-card'>
                <Radio.Group value={units} onChange={e => setUnits(e.target.value)}>
                    <Radio.Button value="bytes">File Size</Radio.Button>
                    <Radio.Button value="count">File Count</Radio.Button>
                </Radio.Group>
            </Card>
            <Card title="Grouping" bordered={false} className='status-card'>
                <Radio.Group value={group} onChange={e => setGroup(e.target.value)}>
                    <Radio.Button value="tld">Top Folder</Radio.Button>
                    <Radio.Button value="type">File Type</Radio.Button>
                </Radio.Group>
            </Card>
        </Space>
        <br />
        <Space size='large' wrap={true}>
            <FlexibleCard title='Storage Usage' viz='StoragePie' endpoint={storage_endpoint} units={units}>
            </FlexibleCard>
            <FlexibleCard title='File Type Distribution' viz='FileTypeDistribution' endpoint={storage_endpoint}
                          units={units}>
            </FlexibleCard>
        </Space>
    </>
};

export default Dashboard;
