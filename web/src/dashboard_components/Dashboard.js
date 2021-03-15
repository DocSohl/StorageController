import {Divider, PageHeader, Space} from "antd";
import {BigProgress, FlexibleCard, HealthCount, StatusCard, ValueCard} from "../common/Cards";
import {FileTypeDistribution, StoragePie} from "./StorageUsage";
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
            <StatusCard title='Storage Health' status='success' text='All Good'/>
            <StatusCard title='Controller Health' status='success' text='All Good'/>
            <HealthCount title='Disks Healthy' healthy={10} total={12}/>
            <HealthCount title='Nodes Healthy' healthy={3} total={3}/>
        </Space>

        <Divider orientation='left' style={{fontSize: 24}}>Backups</Divider>
        <Space size='large' wrap={true}>
            <StatusCard title='Backup Status' status='warning' text='Not Backed Up'/>
            <ValueCard title='Next Backup' value='6 Days'/>
            <ValueCard title='Upload Speed' value='120 MB/s'/>
            <BigProgress title='Backup Progress' completed={30000} total={30000} unit='MB'/>
        </Space>

        <Divider orientation='left' style={{fontSize: 24}}>Storage</Divider>
        <Space size='large' wrap={true}>
            <FlexibleCard title='Storage Usage'>
                <StoragePie/>
            </FlexibleCard>
            <FlexibleCard title='File Type Distribution'>
                <FileTypeDistribution/>
            </FlexibleCard>
        </Space>
    </>
);

export default Dashboard;
