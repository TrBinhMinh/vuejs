import React, { useEffect, useState } from 'react';
import moment from 'moment';
import PropTypes from 'prop-types';
import intl from 'react-intl-universal';

import { PlusOutlined } from '@ant-design/icons';
import { Modal, Form, DatePicker, Input, Table, Upload } from 'antd';
import { SubTitle } from '../../../../components/SubTitle';
import { VN_FORMAT_DATE } from '../../../../constants/constants';
import { FormRender } from '../../../../components/FormRender';
import { ButtonSubmission } from '../../../../components/ButtonSubmission';
import showNotification from '../../../../components/Notification';
import { createNewAsset, updateAsset, getDeviceSelector, getOwnerSelector, getAuditChangeLog } from '../../../../api/assets';

import './index.scss';

const { TextArea } = Input;

const AddNewAssetsFormData = ({ listDeviceSelector, listOwnerSelector, typeOfView }) => {
    return [
        {
            name: 'assetCode',
            title: `${intl.get('userAssets.deviceCode')}`,
            type: 'input',
            placeholder: intl.get('userAssets.deviceCode'),
            readOnly: typeOfView ?? true,
            options: [],
            rules: [
                {
                    required: true,
                    message: `${intl.get('staff.emptyField')}`,
                },
            ],
        },
        {
            name: 'assetName',
            title: `${intl.get('userAssets.deviceName')}`,
            type: 'input',
            readOnly: typeOfView ?? true,
            placeholder: intl.get('userAssets.deviceName'),
            options: [],
            rules: [
                {
                    required: true,
                    message: `${intl.get('staff.emptyField')}`,
                },
            ],
        },
        {
            name: 'deviceTypeId',
            className: `${typeOfView ? 'readonly--select' : ''} `,
            title: `${intl.get('userAssets.deviceType')}`,
            type: 'select',
            readOnly: typeOfView ?? true,
            placeholder: intl.get('userAssets.deviceType'),
            options: listDeviceSelector,
            rules: [
                {
                    required: true,
                    message: `${intl.get('staff.emptyField')}`,
                },
            ],
        },
        {
            name: 'ownerId',
            className: `${typeOfView ? 'readonly--select' : ''} `,
            title: `${intl.get('userAssets.owner')}`,
            type: 'select',
            readOnly: typeOfView ?? true,
            placeholder: intl.get('userAssets.owner'),
            options: listOwnerSelector,
            rules: [
                {
                    required: true,
                    message: `${intl.get('staff.emptyField')}`,
                },
            ],
        },
    ];
};

function transformData(selectedData = []) {
    return selectedData.map((item) => {
        return { value: item?.id, title: item?.name };
    });
}

const getBase64 = (file) =>
    new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);

        reader.onload = () => resolve(reader.result);

        reader.onerror = (error) => reject(error);
    });

const AddNewAssets = ({ onOpenAddNewAssets, onCloseModalAddNewAssets, assetInformationData, onOkGetInfoAssetAssigned, typeOfView }) => {
    const [form] = Form.useForm();
    const [listDeviceSelector, setListDeviceSelector] = useState([]);
    const [listOwnerSelector, setListOwnerSelector] = useState([]);
    const [assetHistory, setAssetHistory] = useState([]);
    const [previewVisible, setPreviewVisible] = useState(false);
    const [previewImage, setPreviewImage] = useState('');
    const [previewTitle, setPreviewTitle] = useState('');
    const [fileList, setFileList] = useState([]);

    const handleCancel = () => setPreviewVisible(false);

    const handlePreview = async (file) => {
        if (!file.url && !file.preview) {
            file.preview = await getBase64(file.originFileObj);
        }

        setPreviewImage(file.url || file.preview);
        setPreviewVisible(true);
        setPreviewTitle(file.name || file.url.substring(file.url.lastIndexOf('/') + 1));
    };

    const handleChange = ({ fileList: newFileList }) => setFileList(newFileList);

    const uploadButton = (
        <div>
            <PlusOutlined />
            <div
                style={{
                    marginTop: 8,
                }}
            >
                Upload
            </div>
        </div>
    );
    const historyColumns = [
        {
            title: intl.get('userAssets.assetHistory.date'),
            dataIndex: 'date',
            key: 'date',
            render: (text, item) => {
                return <span>{item.isReturn ? item.returnDate : item.assignDate}</span>;
            },
            width: '15%',
        },
        {
            title: intl.get('userAssets.assetHistory.person'),
            dataIndex: 'assigneeName',
            key: 'assigneeName',
            width: '30%',
        },

        {
            title: intl.get('userAssets.assetHistory.action'),
            dataIndex: 'isReturn',
            key: 'isReturn',
            render: (text, item) => {
                return <span>{item.isReturn ? intl.get('userAssets.assetHistory.return') : intl.get('userAssets.assetHistory.assign')}</span>;
            },
            width: '13%',
        },
        {
            title: intl.get('userAssets.assetHistory.note'),
            dataIndex: 'note',
            key: 'note',
            width: '30%',
        },
    ];

    useEffect(() => {
        if (typeOfView === 'view') {
            getAuditChangeLog(assetInformationData?.id).then((res) => {
                setAssetHistory(res.data);
            });
        }
    }, []);

    useEffect(() => {
        if (Object.keys(assetInformationData).length !== 0) {
            form.setFieldsValue({
                ...assetInformationData,
                arrivedDate: moment(assetInformationData?.arrivedDate, VN_FORMAT_DATE),
                deviceTypeId: assetInformationData?.deviceType?.id,
                ownerId: assetInformationData?.owner?.id,
                status: assetInformationData?.assetStatus,
            });
        } else {
            form.setFieldsValue({ arrivedDate: moment(new Date(), VN_FORMAT_DATE) });
        }
    }, [assetInformationData]);

    useEffect(() => {
        getDeviceSelector().then((res) => {
            setListDeviceSelector(transformData(res?.data) ?? []);
        });
    }, []);

    useEffect(() => {
        getOwnerSelector().then((res) => {
            setListOwnerSelector(transformData(res?.data) ?? []);
        });
    }, []);

    const sortAssetHistory = (history) => {
        return history.sort((a, b) => {
            const toSortDateA = a.returnDate ?? a.assignDate;
            const toSortDateB = b.returnDate ?? b.assignDate;
            return moment(toSortDateB, 'DD/MM/YYYY').unix() - moment(toSortDateA, 'DD/MM/YYYY').unix();
        });
    };

    const historyPagination = {
        pageSize: 5,
    };

    const onSubmitAddNewAssets = (data) => {
        const requestData = {
            ...data,
            arrivedDate: data?.arrivedDate ? moment(data?.arrivedDate).format(VN_FORMAT_DATE) : null,
            status: assetInformationData?.assetStatus,
        };
        if (assetInformationData?.id) {
            updateAsset(requestData, assetInformationData?.id)
                .then((res) => {
                    showNotification({ type: 'success', noti: 'update', content: intl.get('notification.asset') });
                    form.resetFields();
                    onCloseModalAddNewAssets();
                    onOkGetInfoAssetAssigned();
                })
                .catch((error) => {
                    showNotification({ type: '', noti: 'update', content: intl.get('notification.asset') });
                });
        } else {
            createNewAsset(requestData)
                .then((res) => {
                    showNotification({ type: 'success', noti: 'create', content: intl.get('notification.asset') });
                    form.resetFields();
                    onCloseModalAddNewAssets();
                    onOkGetInfoAssetAssigned();
                })
                .catch((error) => {
                    showNotification({ type: '', noti: 'create', content: intl.get('notification.asset') });
                });
        }
    };

    return (
        <Modal
            className="new--assets--wrapper"
            visible={onOpenAddNewAssets}
            onCancel={() => {
                onCloseModalAddNewAssets();
                form.resetFields('');
                Modal.destroyAll();
            }}
            title={null}
            closable={false}
            footer={null}
            keyboard={true}
        >
            <Form form={form} layout="vertical" onFinish={onSubmitAddNewAssets} className="new--assets--container">
                <SubTitle
                    title={
                        Object.keys(assetInformationData).length === 0
                            ? intl.get('userAssets.addNewAssetsTitle')
                            : typeOfView
                            ? intl.get('userAssets.viewAssetsTitle')
                            : intl.get('userAssets.editAssetsTitle')
                    }
                    onClickClose={onCloseModalAddNewAssets}
                />
                <div className="new--assets--setting">
                    <div className="scroll__modal">
                        <div style={{ display: 'flex', flexDirection: 'row', marginBottom: 8 }}>
                            <div className="title--date">{intl.get('userAssets.date')}</div>
                            <div style={{ color: 'red', marginLeft: 6 }}>*</div>
                        </div>
                        <Form.Item name="arrivedDate" rules={[{ required: true, message: intl.get('appointment.emptyField') }]}>
                            <DatePicker
                                className={`${typeOfView ? 'datepicker--view--assets' : ''}`}
                                format={VN_FORMAT_DATE}
                                style={{ width: '100%', cursor: 'pointer' }}
                                inputReadOnly={typeOfView ?? true}
                            />
                        </Form.Item>
                        <div className="add--assets--form">
                            <FormRender formData={AddNewAssetsFormData({ listDeviceSelector, listOwnerSelector, typeOfView })} />
                        </div>
                        {!typeOfView ? (
                            <Form.Item name="description" label={intl.get('userAssets.note')}>
                                <TextArea style={{ width: '100%', border: '1px solid #E0E0E0', boxSizing: 'border-box', borderRadius: 4, height: 120 }} />
                            </Form.Item>
                        ) : null}
                        {!typeOfView ? (
                            <Form.Item name="insertImage" label={intl.get('userAssets.note')}>
                                <Upload
                                    action="https://www.mocky.io/v2/5cc8019d300000980a055e76"
                                    listType="picture-card"
                                    fileList={fileList}
                                    onPreview={handlePreview}
                                    onChange={handleChange}
                                >
                                    {fileList.length >= 8 ? null : uploadButton}
                                </Upload>
                                <Modal visible={previewVisible} title={previewTitle} footer={null} onCancel={handleCancel}>
                                    <img
                                        alt="example"
                                        style={{
                                            width: '100%',
                                        }}
                                        src={previewImage}
                                    />
                                </Modal>
                            </Form.Item>
                        ) : null}
                    </div>

                    {!typeOfView ? (
                        <Form.Item shouldUpdate>
                            {({ getFieldValue }) => {
                                const isDisabled =
                                    !getFieldValue('arrivedDate') ||
                                    !getFieldValue('assetCode') ||
                                    !getFieldValue('assetName') ||
                                    !getFieldValue('deviceTypeId') ||
                                    !getFieldValue('ownerId');
                                return (
                                    <div>
                                        <ButtonSubmission isEdit={assetInformationData?.id} isDisabled={isDisabled} />
                                    </div>
                                );
                            }}
                        </Form.Item>
                    ) : null}
                    {typeOfView === 'view' && (
                        <div className="assets--history">
                            <div className="assets--history--wrapper">
                                <div className="assets--history--label">{intl.get('userAssets.assetHistory.label')}</div>
                                <div className="assets--history--content">
                                    {assetHistory.length > 0 ? (
                                        <Table dataSource={sortAssetHistory(assetHistory)} columns={historyColumns} pagination={historyPagination} />
                                    ) : (
                                        intl.get('userAssets.assetHistory.noHistory')
                                    )}
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </Form>
        </Modal>
    );
};

AddNewAssets.propTypes = {
    typeOfView: PropTypes.string,
    onOpenAddNewAssets: PropTypes.bool,
    onCloseModalAddNewAssets: PropTypes.func,
    assetInformationData: PropTypes.object,
    onOkGetInfoAssetAssigned: PropTypes.func,
};

export default AddNewAssets;
