import { Pie, Bar } from '@ant-design/charts';


const StoragePie = (props) => {
    return <Pie
        data={props.data}
        angleField='size'
        colorField='folder'
        style={{ width: 600, height: 600 }}
    />;
};

const FileTypeDistribution = (props) => {
    var config = {
        data: props.data,
        xField: 'size',
        yField: 'file_type',
        seriesField: 'file_type',
        legend: { position: 'top-left' },
        style: { width: 1200, height: 600 }
    };
    return <Bar {...config} />;
};


export { StoragePie, FileTypeDistribution };
