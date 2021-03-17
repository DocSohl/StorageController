import {Divider, PageHeader, Space} from "antd";
import {BigProgress, FlexibleCard, HealthCount, StatusCard, ValueCard} from "../common/Cards";
import React from "react";
import './Dashboard.css';


const Dashboard = (props) => (
    <>
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
        <Space size='large' wrap={true}>
            <FlexibleCard title='Storage Usage' viz='StoragePie' endpoint='/dashboard/storage/usage'>
            </FlexibleCard>
            <FlexibleCard title='File Type Distribution' viz='FileTypeDistribution' endpoint='/dashboard/storage/file_types'>
            </FlexibleCard>
        </Space>
    </>
);

export default Dashboard;
