import {Divider, PageHeader, Typography, Image, Row, Col} from "antd";
import React from "react";

const { Paragraph, Text } = Typography;


const Help = (props) => {
    return <>
        <PageHeader
            className="site-page-header"
            title="Help"
            subTitle="Connecting to Storage"
        />

        <Row>
            <Col span={12}>
                <Divider orientation='left' style={{fontSize: 24}}>MacOS</Divider>
                <Typography style={{marginRight: "20px"}}>
                    <Paragraph>
                        To connect to the SMB share on MacOS, navigate to Finder and select Go > "Connect to Server".
                    </Paragraph>
                    <div style={{marginLeft: "50px"}}>
                        <Image src='/MacOS-Open-Dialog.png' alt='Open Dialog on MacOS' width={400}/>
                    </div>
                    <Paragraph>
                        In the pop up window, type in the exact text: &nbsp;
                        <Text keyboard copyable>smb://storage.sohl.org/Public</Text>
                    </Paragraph>
                    <Image src='/MacOS-Fill-Dialog.png' alt='Populate Dialog on MacOS' width={500}/>
                    <Paragraph>
                        Click "Connect" and you should see the files immediately.
                    </Paragraph>
                </Typography>
            </Col>

            <Col span={12}>
                <Divider orientation='left' style={{fontSize: 24}}>Windows</Divider>
                <Typography>
                    <Paragraph>
                        To connect to the SMB share on Windows, navigate to Windows Explorer. Right click "Network" and select "Map network drive".
                    </Paragraph>
                    <div style={{marginLeft: "80px"}}>
                        <Image src='/Windows-Open-Dialog.png' alt='Open Dialog on MacOS' width={400}/>
                    </div>
                    <Paragraph>
                        In the pop up window, select any unused drive letter and type in the exact text: &nbsp;
                        <Text keyboard copyable>\\storage.sohl.org\Public</Text>
                    </Paragraph>
                    <div style={{marginLeft: "50px"}}>
                        <Image src='/Windows-Fill-Dialog.png' alt='Populate Dialog on MacOS' width={500}/>
                    </div>
                    <Paragraph>
                        Click "Finish" and you should see the files immediately.
                    </Paragraph>
                </Typography>
            </Col>
        </Row>

    </>
};

export default Help
